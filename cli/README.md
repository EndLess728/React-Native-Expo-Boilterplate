# create-expo-boilerplate

Scaffold a new Expo app from [React-Native-Expo-Boilterplate](https://github.com/EndLess728/React-Native-Expo-Boilterplate) — no cloning, no deleting example code by hand.

```bash
npx create-expo-boilerplate my-app
# or
yarn create expo-boilerplate my-app
pnpm create expo-boilerplate my-app
bun create expo-boilerplate my-app
```

It asks a few questions, writes the project, installs dependencies, sets up git (and Husky), and makes the first commit.

## Options

| Prompt | Choices | Default | Flag |
|---|---|---|---|
| State management | Zustand · Redux Toolkit | Zustand | `--state zustand\|redux` |
| Redux side effects (Redux only) | Thunk · Saga | Thunk | `--redux-middleware thunk\|saga` |
| Navigation | Expo Router · React Navigation | Expo Router | `--navigation expo-router\|react-navigation` |
| Language | TypeScript · JavaScript | TypeScript | `--language ts\|js` (or `--js`) |
| ESLint | yes · no | yes | `--eslint` / `--no-eslint` |
| Husky git hooks | yes · no | yes | `--husky` / `--no-husky` |
| App display name | — | from the folder name | `--name "My App"` |
| Bundle id / Android package | — | `com.<name>` | `--bundle-id com.company.app` |
| Package manager | yarn · npm · pnpm · bun | whatever ran the CLI | `--pm` |

Other flags: `--yes` (take defaults for anything not passed), `--no-install`, `--no-git`.

```bash
# Fully non-interactive
npx create-expo-boilerplate my-app --yes \
  --state redux --redux-middleware saga \
  --navigation react-navigation --js --no-husky
```

Every combination uses the same feature-based layout (`src/features/<feature>`, `src/shared`, …). Screens only talk to state through the auth feature's hooks (`useIsLoggedIn`, `useLogin`, …), which is why switching the state library or the navigator doesn't touch a single screen.

## How it works

The repo root **is** the template: the Expo Router + Zustand + TypeScript app with ESLint and Husky. Nobody maintains a second copy.

```
cli/
├── src/
│   ├── index.ts              # prompts + flags (commander, @clack/prompts)
│   ├── generate.ts           # runs the steps below in order
│   ├── template.ts           # copies the repo root (or the packaged template/)
│   └── steps/
│       ├── navigation.ts     # React Navigation: drop src/app, add the overlay, edit app.config + deps
│       ├── state.ts          # Redux: drop the Zustand store, add redux/common + thunk|saga overlays
│       ├── tooling.ts        # remove ESLint / Husky (+ lint-staged, Commitlint)
│       ├── identity.ts       # name, slug, scheme, bundle id
│       ├── packageManager.ts # lockfile, `yarn …` mentions, eas.json, .npmrc
│       ├── javascript.ts     # TS → JS with the TypeScript compiler, last
│       ├── readme.ts         # README for the exact stack chosen
│       └── format.ts         # Prettier with the project's .prettierrc
├── overlays/                 # files that differ per option, written in TypeScript
│   ├── react-navigation/
│   └── redux/{common,thunk,saga}/
└── scripts/
    ├── sync-template.mjs     # copies the repo root into template/ when packing
    └── test-matrix.mjs       # generates + checks every combination
```

- **Overlays are TypeScript only.** The JavaScript option transpiles the finished project with the TypeScript compiler (types erased, JSX untouched, blank lines kept), deletes files that only held types, and Prettier formats the result. There's no separate JS template to maintain.
- **Edits fail loudly.** Every string edit throws if its target text is missing, so if the boilerplate changes in a way a step depends on, generation (and CI) fails instead of shipping a half-converted project.
- **One marker.** `eslint.config.js` wraps the Zustand-only rule in `// @cli:zustand-start` … `// @cli:zustand-end`. The CLI strips the markers, or swaps the block for the typed-Redux-hooks rule.

## Developing

```bash
cd cli
npm install
npm run build
node dist/index.js ../../my-test-app          # generates from the current repo root
```

Run from a checkout, the CLI copies the boilerplate straight from the repo root, so changes there show up in generated apps right away.

### Test every combination

```bash
npm run test:matrix            # 18 core combinations
npm run test:matrix -- --all   # all 48
npm run test:matrix -- --export   # also bundle each with `expo export` (slow)
npm run test:matrix -- --only redux-saga.react-navigation
```

The script generates each project into your temp dir, installs **one** shared superset of dependencies, and checks each project for leftovers (stray markers, Zustand imports in Redux apps, …), circular imports (madge), `tsc`, ESLint (or Prettier when ESLint is off), Jest, and `expo config`. CI runs the core set on every PR that touches the app or the CLI.

### Adding an option

1. Add the choice to `options.ts`, a prompt + flag in `index.ts`, and a step in `steps/` (or extend one).
2. Put files that differ in `overlays/<option>/`, in TypeScript, mirroring project paths.
3. Pin any new packages in `versions.ts`.
4. Add the dimension to `scripts/test-matrix.mjs` and run it.

### Upgrading the Expo SDK

Upgrade the boilerplate at the repo root as usual, then bump the overlay-only packages in `src/versions.ts` (React Navigation, Redux), and run `npm run test:matrix -- --all --export`.

## Publishing

```bash
cd cli
npm version patch        # or minor / major
npm publish              # prepack builds dist/ and syncs template/
```

`prepack` compiles the CLI and copies the boilerplate into `template/`. npm drops `.gitignore` from tarballs, so it's stored as `_gitignore` and renamed back on generate. Check what ships with `npm pack --dry-run`.

To keep it private to the team, publish under a scope (`@your-org/create-expo-boilerplate`, run as `npm create @your-org/expo-boilerplate`) with restricted access.
