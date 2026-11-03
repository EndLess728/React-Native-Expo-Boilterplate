# Scripts, Builds & Releases

Every script, local and cloud builds, fast repacks, EAS workflows and how releases are cut. Back to the [README](../README.md).

## All Scripts

### Environment Files

```bash
yarn env:init                  # Create any missing .env.* from .env.example
                               #   (never overwrites; runs on postinstall too)
yarn env:pull:development      # Pull values down from EAS into .env.development
yarn env:pull:staging          # …from the EAS `preview` environment
yarn env:pull:production       # …from the EAS `production` environment
yarn env:push:development      # Push .env.development up to EAS
yarn env:push:staging          # …to the EAS `preview` environment
yarn env:push:production       # …to the EAS `production` environment
```

### Development

```bash
yarn start                     # Start Metro (default dev client)
yarn start:development         # Start Metro with dev env
yarn start:staging             # Start Metro with staging env
yarn start:production          # Start Metro with production env
```

### Run on Device / Simulator

```bash
yarn android:development       # Build + run Android (dev)
yarn ios:development           # Build + run iOS (dev)
yarn android:staging           # Build + run Android (staging)
yarn ios:staging               # Build + run iOS (staging)
yarn android:production        # Build + run Android (production)
yarn ios:production            # Build + run iOS (production)
```

### Prebuild (Generate Native Projects)

```bash
yarn prebuild:development      # Clean prebuild for dev (strict validation)
yarn prebuild:staging          # Clean prebuild for staging
yarn prebuild:production       # Clean prebuild for production
```

### Local Release Builds

```bash
# Android APK
yarn build:android:production  # prebuild --clean → gradlew assembleRelease

# iOS (opens Xcode workspace for archive)
yarn build:ios:production      # prebuild --clean → open .xcworkspace
```

> All build and prebuild scripts use `--clean` and `STRICT_ENV_VALIDATION=1` to ensure fresh native projects with validated env vars.

### Fast Rebuilds (Repack)

`build:android:*` runs `expo prebuild --clean` plus a full Gradle release build every single time — minutes of work even when the only thing that changed is a TypeScript file. Repack takes the APK from the last real native build and swaps in a freshly bundled JS payload instead, which turns that into a few seconds.

```bash
yarn repack:android:staging                    # repack, or full build if stale
yarn repack:android:staging --install          # …and adb install -r onto the device
yarn repack:android:staging --force-build      # ignore the cache, rebuild native
yarn repack:android:staging --no-build         # fail instead of falling back
yarn repack:android:staging --js-bundle-only   # keep the binary's app metadata

yarn repack:ios:staging --source-app path/to/App.app   # seed the cache from an Xcode build
yarn repack:ios:staging                                # repack from the cached artifact
```

All three environments are wired for both platforms (`repack:android:development`, `repack:ios:production`, and so on).

#### When to use it

| Use repack | Use a full build |
|---|---|
| Only JS/TS changed — screens, components, hooks, styles, translations, business logic | You added or removed a native dependency |
| Handing a fresh staging APK to QA or a stakeholder | You edited a config plugin or anything in `app.config.ts` that feeds the native projects |
| Iterating on release-mode behaviour (where Fast Refresh does not apply) | You bumped the Expo SDK or React Native |
| Re-testing the same build with a different `.env` value | You are cutting a store release — those go through EAS Build |

Repack is **not** for the Metro dev client. `yarn start` already loads JS over the network, so Fast Refresh covers that case. This is for release-mode builds you install and hand to someone.

#### The one rule: native must be unchanged

A repacked artifact is only valid while the native half is untouched. Add a native module, change a config plugin, or bump the SDK, and the new JS will call native APIs the old binary does not contain — which fails **at runtime on the device**, not here, where you would notice it.

The script does not trust you to remember. It fingerprints the project with `@expo/fingerprint`, stores the hash next to the cached artifact in `.repack/`, and compares before every repack. On a mismatch it falls back to a full native build instead of producing a broken artifact — or exits with an error if you passed `--no-build`.

This means the **first run seeds the cache** and is therefore slow (full prebuild + Gradle). Every run after that is the fast path, until something native moves.

#### iOS needs one manual step

iOS is deliberately not automated: `yarn build:ios:*` opens Xcode rather than producing an artifact at a known path, so there is nothing for the script to shell out to. Build or archive in Xcode once, seed the cache with `--source-app`, and subsequent `yarn repack:ios:*` runs are fast. Both simulator `.app` bundles and device `.ipa` files work.

#### Signing (Android)

Repack rewrites the archive, so the result must be re-signed — and signing with a different key than the binary already on the device makes the install fail with `INSTALL_FAILED_UPDATE_INCOMPATIBLE`. The default is the debug keystore, which is correct rather than a placeholder: local release builds are debug-signed on purpose (`android/app/build.gradle` signs `release` with `signingConfigs.debug`), while store releases go through EAS Build, which holds the real keystore in the cloud. Override with `--ks`, `--ks-pass`, `--ks-key-alias` and `--ks-key-pass` when repacking an artifact EAS built.

> `.repack/` holds the cached source binaries, their fingerprints and the repacked output. It is gitignored — machine-local build output. The script runs the pinned `@expo/repack-app` devDependency rather than `npx …@latest`, so it behaves the same on every machine and works offline.

### EAS Cloud Builds

```bash
eas build --profile development --platform android
eas build --profile staging --platform ios
eas build --profile production --platform all
```

EAS profiles are defined in `eas.json`. Each profile injects `EXPO_PUBLIC_APP_ENV`
and names an EAS `environment` (`development` / `preview` / `production`) whose
stored variables EAS puts straight into `process.env` on the builder.

`scripts/eas-pre-install.sh` runs before install and copies the matching
`.env.<APP_ENV>` to `.env.local` when that file made it onto the builder —
`.easignore` un-ignores the three env files so they upload from your machine
even though git does not track them. When the file is absent (a CI-triggered
build, or a teammate who has not filled theirs in), the hook exits cleanly and
the EAS-stored variables are the source of truth.

> That fallback is the reason to keep EAS in sync: run `eas env:list` to confirm
> all three environments are populated, and `yarn env:push:<env>` when they are
> not. It is what a cloud build falls back to when there is no file on disk.

Profiles all extend a shared `base` (pinned Node/Yarn, 4 GB heap for Metro):

| Profile | EAS environment | Distribution | Android artifact | Notes |
|---|---|---|---|---|
| `debug` | `development` | internal | apk (implicit) | Dev client build (`developmentClient: true`) |
| `development` | `development` | internal | apk | Standalone dev build, no Metro |
| `staging` | `preview` | internal | apk | QA / stakeholder drops |
| `production` | `production` | store | aab | `autoIncrement: true` — version comes from EAS (`appVersionSource: remote`) |

### EAS Workflows

The three files in `.eas/workflows/` run multi-job pipelines on EAS instead of a single `eas build` call. All three are **manual trigger only** (`workflow_dispatch`) — nothing runs on push, because every run spends paid build minutes and most commits are never installed by anyone.

| Workflow | Script | What it does | Reach for it when |
|---|---|---|---|
| `build.yml` | `yarn eas:workflow:build` | Plain build, Android + iOS **in parallel** | You want an artifact — QA drop, device build, release candidate |
| `build-fast.yml` | `yarn eas:workflow:build:fast` | Fingerprints, reuses a matching build and repacks it; compiles only if none matches | Iterating on JS-only changes and you don't want to pay for a full compile |
| `release.yml` | `yarn eas:workflow:release` | Approval gate → production build → store submission | Cutting an actual release to TestFlight / Play |

Validate all three before pushing changes to them:

```bash
yarn eas:workflow:validate
```

#### Passing inputs

Both build workflows take `profile` and `platform`, and both default to `staging` / `all`. Override with `-F`:

```bash
yarn eas:workflow:build                                   # staging, both platforms
yarn eas:workflow:build -F profile=production             # production, both platforms
yarn eas:workflow:build -F profile=development -F platform=ios
yarn eas:workflow:build:fast -F platform=android

# Convenience wrappers for the common profiles:
yarn eas:workflow:build:development
yarn eas:workflow:build:staging
yarn eas:workflow:build:production
```

> Inputs are declared `required: false` on purpose. Marking one `required: true` makes EAS ignore its `default` and prompt for a value instead, which turns every scripted run into an interactive one.

In `build.yml` the two platform jobs have no dependency between them, so a both-platform run takes as long as the *slower* platform rather than the sum. Single-platform runs skip the other job rather than needing a separate file per platform.

#### `build-fast.yml` — the cloud counterpart to `yarn repack`

Same idea as [Fast Rebuilds (Repack)](#fast-rebuilds-repack), except the cache is every build your team has ever run on EAS rather than one APK on one machine. Per platform it:

1. **Fingerprints** the project's native inputs.
2. **Looks for a finished build** with that exact fingerprint *and* the same profile — profile is part of the query because a build from another profile can share a fingerprint, and repacking it would ship the wrong configuration. If a matching build is still running it waits for it instead of starting a second identical compile.
3. **Repacks** that binary with the new JS if one was found — otherwise **compiles from scratch**.

So the first run after a native change pays full price and becomes the source binary for every JS-only run after it. It offers only `staging` and `development` profiles, and the fingerprint job pins the EAS environment to match (`development` → `development`, `staging` → `preview`) — `app.config.ts` reads `EXPO_PUBLIC_APP_ENV`, so a fingerprint taken under the wrong environment makes every run look like a native change.

**Releases deliberately do not use it.** Expo's guidance is that production builds should go through the complete pipeline for correct symbolication and signing, so what reaches a store is always compiled, never repacked.

#### `release.yml` — production build and submit

```bash
yarn eas:workflow:release                      # both platforms, submit
yarn eas:workflow:release -F platform=ios      # one platform
yarn eas:workflow:release -F submit=false      # build only, don't upload
```

The **approval gate runs first**, before any build. Approving afterwards would waste the minutes it exists to protect, and a production build increments the remote version whether or not anyone wanted it. After approval each platform is an independent build → submit chain, so a failure on one store doesn't hold up the other.

What submission does *not* do is release anything:

- **Android** — the `.aab` goes to the Play `internal` track with `releaseStatus: draft`. Nothing reaches users until someone promotes it in the Play Console.
- **iOS** — the `.ipa` lands in TestFlight once Apple finishes processing (usually 10–15 minutes). Releasing to the App Store stays a deliberate act in App Store Connect.

> **One-time setup.** Submission keys are separate from build signing: a Google Service Account key and an App Store Connect API key, uploaded once via `eas credentials --platform <android|ios>`. Without them the build succeeds and the submit job fails at upload — after the minutes are already spent.

For a one-off release without the workflow, `yarn ios-build-production-auto-submit` and `yarn android-build-production-auto-submit` run `eas build … --auto-submit` directly, skipping the approval gate.

### Code Quality

```bash
yarn lint                      # Run ESLint
yarn lint:fix                  # Auto-fix lint issues
yarn type-check                # TypeScript check (--noEmit)
yarn test                      # Run tests
yarn test:coverage             # Run tests with coverage report
```

## Releases

Every push to `main` publishes a [GitHub Release](../../../releases) with a changelog — see [`.github/workflows/release.yml`](../.github/workflows/release.yml).

- The version comes from the [Conventional Commits](https://www.conventionalcommits.org/) since the last `v*` tag: `feat` → minor, `fix` / `perf` / … → patch, `feat!` or `BREAKING CHANGE:` → major.
- The release notes group those commits by type, with links (config: [`cliff.toml`](../cliff.toml), generated by [git-cliff](https://git-cliff.org)).
- Pushes with nothing releasable (only `chore`, `docs`, `ci`, …) don't create a release.

Commitlint already enforces the commit format, so there's nothing extra to do — write good commit messages and merge.


### Publishing the CLI to npm

Every push to `main` also publishes the `create-expo-boilerplate` CLI to npm with the same version as the GitHub release — see [`.github/workflows/publish-cli.yml`](../.github/workflows/publish-cli.yml). It needs the `NPM_TOKEN` repository secret, and pushes with nothing releasable are skipped. Details in [`cli/README.md`](../cli/README.md#publishing).
