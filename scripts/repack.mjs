#!/usr/bin/env node
/**
 * scripts/repack.mjs
 *
 * Rebuild the JS half of an app without recompiling the native half.
 *
 * `yarn build:android:staging` runs `expo prebuild --clean` and a full Gradle
 * release build every single time, even when the only thing that changed is a
 * TypeScript file. Repack takes the APK from the last real native build and
 * swaps in a freshly bundled JS payload, which is the difference between a
 * coffee break and a few seconds.
 *
 * ─── The one rule ────────────────────────────────────────────────────────────
 * A repacked artifact is only valid while the NATIVE side is unchanged. Add a
 * native dependency, edit a config plugin, bump the Expo SDK, or change
 * anything app.config.ts feeds into the native projects, and the new JS will
 * call native APIs the old binary does not contain — which fails at runtime, on
 * the device, not here. So this script does not trust the developer to
 * remember: it fingerprints the project with @expo/fingerprint, stores the hash
 * next to the cached APK, and compares before every repack. A mismatch falls
 * back to a full build instead of producing a broken artifact.
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   yarn repack:android:staging              # repack, or full build if stale
 *   yarn repack:android:staging --install    # …and adb install -r onto device
 *   yarn repack:android:staging --force-build# ignore the cache, rebuild native
 *   yarn repack:android:staging --no-build   # fail instead of falling back
 *   yarn repack:android:staging --js-bundle-only
 *                                            # keep the binary's app metadata
 *
 *   yarn repack:ios:staging --source-app path/to/ios.app
 *                                            # seed the cache from an Xcode build
 *   yarn repack:ios:staging                  # repack from the cached artifact
 *
 * Not for the Metro dev client: that already loads JS over the network, so
 * Fast Refresh covers it. This is for release-mode builds you install and hand
 * to someone.
 */

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, '.repack');

const ENVIRONMENTS = ['development', 'staging', 'production'];
const PLATFORMS = ['android', 'ios'];

// ─── args ─────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const value = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

const platform = value('platform');
const environment = value('env');
const sourceApp = value('source-app');
const install = flag('install');
const forceBuild = flag('force-build');
const noBuild = flag('no-build');
const verbose = flag('verbose');

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

if (!PLATFORMS.includes(platform)) fail(`--platform must be one of: ${PLATFORMS.join(', ')}`);
if (!ENVIRONMENTS.includes(environment)) fail(`--env must be one of: ${ENVIRONMENTS.join(', ')}`);

/**
 * Signing has to match the source APK exactly.
 *
 * Repack rewrites the archive, so the result must be re-signed — and signing it
 * with a different key than the binary already on the device makes the install
 * fail with INSTALL_FAILED_UPDATE_INCOMPATIBLE.
 *
 * The debug keystore is the right default here, not a placeholder: local builds
 * are debug-signed on purpose (android/app/build.gradle signs `release` with
 * signingConfigs.debug), and store releases go through EAS Build, which holds
 * the real release keystore in the cloud and never touches this path. So there
 * is no upload keystore to migrate to locally — but the flags stay overridable
 * for the one case that needs it: repacking an artifact EAS built, whose
 * signature came from a keystore only EAS has (`eas credentials` can export it).
 *
 * Passwords are passed explicitly rather than left to repack's `pass:android`
 * default, so an override supplies the key password too.
 */
const signing = {
  keystore: value('ks')
    ? resolve(ROOT, value('ks'))
    : join(ROOT, 'android', 'app', 'debug.keystore'),
  storePassword: value('ks-pass') ?? 'pass:android',
  alias: value('ks-key-alias') ?? 'androiddebugkey',
  keyPassword: value('ks-key-pass') ?? 'pass:android',
};

/**
 * Warn when the Gradle release build stops using the keystore assumed above.
 *
 * A warning rather than a hard stop: local builds are debug-signed by design,
 * so this only trips if someone changes build.gradle or the Expo template does
 * — neither of which should block a repack that is probably still fine. The
 * symptom to watch for if it does fire is an APK that refuses to install.
 */
function verifySigningConfig() {
  const gradlePath = join(ROOT, 'android', 'app', 'build.gradle');
  if (value('ks') || !existsSync(gradlePath)) return;

  const usesDebugKeystore = /release\s*\{[^}]*signingConfig\s+signingConfigs\.debug/s.test(
    readFileSync(gradlePath, 'utf8'),
  );
  if (usesDebugKeystore) return;

  console.warn(
    '\n⚠️  android/app/build.gradle no longer signs `release` with the debug keystore,\n' +
      '   but this repack is signing with it anyway. If the APK will not install,\n' +
      '   pass the matching one: --ks <path> --ks-pass <pass:…> --ks-key-alias <alias> --ks-key-pass <pass:…>\n',
  );
}

const GRADLE_APK = join(
  ROOT,
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk',
);

// ─── environment ──────────────────────────────────────────────────────────────

/**
 * Same contract as every other build script in package.json: `.env.<env>` is
 * copied to `.env.local`, which load-env reads. It has to happen before the
 * fingerprint is taken — app.config.ts reads these values, and a different
 * EXPO_PUBLIC_APP_ENV can produce a different native config, which is exactly
 * the kind of drift the fingerprint exists to catch.
 */
const envFile = join(ROOT, `.env.${environment}`);
if (!existsSync(envFile))
  fail(`Missing ${basename(envFile)} — run \`yarn env:pull:${environment}\` first.`);
cpSync(envFile, join(ROOT, '.env.local'));

const childEnv = {
  ...process.env,
  APP_ENV: environment,
  EXPO_PUBLIC_APP_ENV: environment,
  NODE_ENV: environment === 'development' ? 'development' : 'production',
  STRICT_ENV_VALIDATION: '1',
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function run(command, args, { cwd = ROOT, allowFailure = false } = {}) {
  if (verbose) console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd, env: childEnv, stdio: 'inherit', shell: false });
  if (result.status !== 0 && !allowFailure) {
    fail(`\`${command} ${args.join(' ')}\` exited with code ${result.status ?? 'null'}`);
  }
  return result.status === 0;
}

/**
 * The project's native fingerprint for this platform and environment.
 *
 * Imported lazily because @expo/fingerprint arrives as a transitive dependency
 * of expo — resolving it at module load would turn a missing package into a
 * confusing import error before the argument validation above has run.
 */
async function fingerprint() {
  const { createFingerprintAsync } = await import('@expo/fingerprint');
  const { hash } = await createFingerprintAsync(ROOT, { platforms: [platform] });
  return hash;
}

/**
 * The cached artifact keeps its original extension.
 *
 * iOS can be seeded from either a simulator `.app` bundle or a device `.ipa`,
 * and repack reads the kind from the extension — filing an .ipa under an .app
 * name would hand it a bundle that is really a zip.
 */
const EXTENSIONS = { android: ['.apk'], ios: ['.app', '.ipa'] };

const cachePath = (extension) => join(CACHE, `${platform}-${environment}${extension}`);
const fingerprintPath = join(CACHE, `${platform}-${environment}.fingerprint`);

const findCachedArtifact = () => EXTENSIONS[platform].map(cachePath).find(existsSync) ?? null;

const cached = {
  artifact: findCachedArtifact(),
  fingerprint: fingerprintPath,
};

function readCachedFingerprint() {
  if (!existsSync(cached.fingerprint)) return null;
  return readFileSync(cached.fingerprint, 'utf8').trim();
}

function saveToCache(artifactPath, hash) {
  mkdirSync(CACHE, { recursive: true });

  // Drop every extension we might have cached before, so a switch from .app to
  // .ipa (or back) cannot leave a stale sibling for findCachedArtifact to pick.
  for (const extension of EXTENSIONS[platform]) {
    rmSync(cachePath(extension), { recursive: true, force: true });
  }

  const destination = cachePath(extname(artifactPath) || EXTENSIONS[platform][0]);
  cpSync(artifactPath, destination, { recursive: true });
  writeFileSync(cached.fingerprint, `${hash}\n`);
  cached.artifact = destination;
}

// ─── full native build (Android only) ─────────────────────────────────────────

/**
 * The slow path this script exists to avoid — run only when there is nothing
 * cached or the native fingerprint moved.
 *
 * iOS is not automated here on purpose: `yarn build:ios:*` opens Xcode rather
 * than producing an artifact at a known path, so there is nothing to shell out
 * to. Point --source-app at the .app or .ipa Xcode produced instead.
 */
function fullBuildAndroid() {
  console.log('\n🔨 Full native build (prebuild + Gradle release)…\n');
  run('npx', ['expo', 'prebuild', '--clean', '--platform', 'android']);

  /**
   * Create the sourcemap output directory before Gradle needs it.
   *
   * :app:createBundleReleaseJsAndAssets passes --sourcemap-output to
   * `expo export:embed` without creating the parent directory, so on a tree
   * freshly wiped by `prebuild --clean` the bundle builds fine and then dies
   * writing the map:
   *
   *   Error: ENOENT: no such file or directory, open
   *   '…/intermediates/sourcemaps/react/release/index.android.bundle.packager.map'
   *
   * Whether it fails depends on task ordering, which makes it look flaky —
   * raising the daemon heap was enough to change the schedule and expose it.
   * One mkdir removes the race entirely.
   */
  mkdirSync(
    join(ROOT, 'android', 'app', 'build', 'intermediates', 'sourcemaps', 'react', 'release'),
    {
      recursive: true,
    },
  );

  run('./gradlew', ['assembleRelease'], { cwd: join(ROOT, 'android') });
  if (!existsSync(GRADLE_APK)) fail(`Gradle finished but no APK at ${GRADLE_APK}`);
  return GRADLE_APK;
}

// ─── repack ───────────────────────────────────────────────────────────────────

function repack(source) {
  const output = join(CACHE, `${platform}-${environment}-repacked${extname(source)}`);
  rmSync(output, { recursive: true, force: true });

  const args = ['--platform', platform, '--source-app', source, '--output', output];

  // Android artifacts must be re-signed after their contents change. iOS
  // simulator .app bundles are not signed at all; a device .ipa needs a real
  // identity and profile, which belong to whoever owns the certificates —
  // pass them through --signing-identity / --provisioning-profile yourself.
  if (platform === 'android') {
    verifySigningConfig();
    args.push(
      '--ks',
      signing.keystore,
      '--ks-pass',
      signing.storePassword,
      '--ks-key-alias',
      signing.alias,
      '--ks-key-pass',
      signing.keyPassword,
    );
  }

  // Passed straight through. --js-bundle-only keeps the binary's existing app
  // name, version and expo-updates manifest instead of refreshing them from the
  // config; --embed-bundle-assets forces a bundle even for a debug source app,
  // which otherwise expects to load JS from a dev server.
  for (const passthrough of ['js-bundle-only', 'embed-bundle-assets']) {
    if (flag(passthrough)) args.push(`--${passthrough}`);
  }
  if (verbose) args.push('--verbose');

  console.log('\n📦 Repacking JS into the existing native binary…\n');

  // The pinned devDependency, not `npx @expo/repack-app@latest` — a build tool
  // that silently upgrades itself mid-project is a build tool that breaks on
  // someone else's machine, and this way it works offline.
  run(join(ROOT, 'node_modules', '.bin', 'repack-app'), args);
  return output;
}

// ─── main ─────────────────────────────────────────────────────────────────────

const hash = await fingerprint();
const previous = readCachedFingerprint();

let source = sourceApp ? resolve(ROOT, sourceApp) : null;
if (source && !existsSync(source)) fail(`--source-app not found: ${source}`);

// An explicitly supplied artifact reseeds the cache: the caller is telling us
// this binary is the current native truth, so its fingerprint is today's.
if (source) {
  saveToCache(source, hash);
  console.log(`📥 Cached ${basename(source)} as the ${platform}/${environment} source app.`);
} else if (forceBuild || previous === null || cached.artifact === null || previous !== hash) {
  const reason = forceBuild
    ? 'forced with --force-build'
    : previous === null || cached.artifact === null
      ? 'nothing cached for this platform and environment yet'
      : 'the native fingerprint changed since the cached build';

  if (platform === 'ios') {
    fail(
      `Cannot repack iOS: ${reason}.\n` +
        `   Build in Xcode (\`yarn build:ios:${environment}\`), then seed the cache:\n` +
        `   yarn repack:ios:${environment} --source-app <path to .app or .ipa>`,
    );
  }
  if (noBuild) fail(`Refusing to repack: ${reason} (and --no-build was passed).`);

  console.log(`\nℹ️  Full build needed — ${reason}.`);
  saveToCache(fullBuildAndroid(), hash);
} else {
  console.log(`\n✅ Native fingerprint unchanged (${hash.slice(0, 12)}…) — repacking only the JS.`);
}

const artifact = repack(cached.artifact);
console.log(`\n✨ ${artifact}\n`);

if (install) {
  if (platform !== 'android')
    fail('--install is Android-only; drag the .app onto a simulator instead.');
  console.log('📲 Installing…\n');
  run('adb', ['install', '-r', artifact]);
}
