# Environments

Env files, the three app environments, how switching works and how values reach EAS. Back to the [README](../README.md).

## Multi-Environment Setup

The app supports three environments, each with its own **app name**, **package name / bundle ID**, and **env variables**:

| Environment | App Name | Android Package | iOS Bundle ID |
|---|---|---|---|
| `development` | ExpoTemplate (Dev) | `com.expo.template` | `com.expo.template` |
| `staging` | ExpoTemplate (Staging) | `com.expo.template` | `com.expo.template` |
| `production` | ExpoTemplate | `com.expo.template` | `com.expo.template` |

> A single package name is used across all environments to keep third-party service setup (Firebase, push notifications, signing) unified.

### Environment Variables

Each `.env.<environment>` file defines:

```bash
EXPO_PUBLIC_APP_ENV=development    # development | staging | production
EXPO_PUBLIC_API_URL=https://api.example.com/
```

> `.env.development` is seeded with `EXPO_PUBLIC_API_URL=https://dummyjson.com/`, a free demo API, so
> the Home screen renders real data on first run. It uses the hooks in `src/features/posts/api`:
> `useInfinitePosts()` (paginated list, loads more on scroll), `usePost()` (detail by id, tap a post) and
> `useAddPost()` (POST mutation). Swap the URL for your backend and replace the `posts` feature with your own.

Adding a new variable:
1. Add it to `.env.example` — the committed template every local file is seeded from
2. Run `yarn env:init`. It will not touch your existing files, but it names each
   one missing the new key, so you know exactly what to fill in
3. Add the key to the Zod schema in `env.ts`
4. Reference it statically via `process.env.EXPO_PUBLIC_YOUR_VAR` (Metro requires dot notation) or import from `@env`
5. Push it to EAS for cloud builds — `yarn env:push:staging` and friends

> Step 2 matters more than it looks: a missing key does not fail where you added
> it. It fails later, during someone else's prebuild, as a Zod error about a
> variable they have never heard of.

> **Validation:** `env.ts` validates all variables via Zod on every startup. In development, invalid vars log a warning. During prebuild (`STRICT_ENV_VALIDATION=1`), it throws — catching config errors before native code is generated.

### How Env Switching Works

```
yarn android:staging
  → cp .env.staging .env.local        (writes active env to .env.local)
  → expo run:android                  (Metro starts, reads .env.local)
  → .env.local has highest priority   (wins over .env.development auto-load)
  → env.ts reads EXPO_PUBLIC_APP_ENV=staging, builds typed config
  → app.config.ts uses Env for app name, bundle ID, package name
  → Runtime code imports Env from @env for API URLs etc.
```

## Keeping Env Files Out of Git

Real `.env.*` files are **gitignored and untracked**. Only `.env.example` (with
placeholder values) is committed.

You do not create them by hand — `scripts/setup-env.mjs` runs on `postinstall`
and seeds all three from `.env.example`, with `EXPO_PUBLIC_APP_ENV` already set
per file:

```bash
yarn install        # creates .env.development / .staging / .production if absent
yarn env:init       # the same thing, on demand
```

The generator **never writes to a file that already exists**. It runs on every
install, so overwriting the file holding your staging credentials would be a
worse bug than the one it solves — existing files are only read, to report keys
they are missing. It is also skipped entirely on EAS and in CI, where env vars
are injected into `process.env` rather than read from disk.

> **Why untracked, not just gitignored?** Ignore rules do not apply to files git
> already tracks. A tracked-but-ignored env file accepts a real API key and
> commits it with no warning at all — the failure mode is silent, which is the
> worst kind. Keeping them untracked means `git status` has nothing to offer and
> the key cannot leak by accident.

If you ever find one tracked again (`git ls-files | grep '^\.env'` should print
only `.env.example`), un-track it without deleting your values:

```bash
git rm --cached .env.development .env.staging .env.production
```

