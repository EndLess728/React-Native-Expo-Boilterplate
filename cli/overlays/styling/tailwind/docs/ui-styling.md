## Step 1 — Theming (non-negotiable)

Style with `className`. Colors come from the theme variables in `global.css`, which switch automatically between light and dark:

```tsx
<View className="flex-1 bg-background p-5">
  <Text className="text-body font-opensans text-typography">…</Text>
</View>
```

Rules:
- **Colors** — always a theme class (`bg-background`, `text-typography`, `border-border-gray`, `text-danger`, …). Never arbitrary colors like `bg-[#fff]` or Tailwind palette colors like `bg-gray-100`. If a needed color is missing, add it to **both** `@variant light` and `@variant dark` in `global.css` (or to `@theme` if it's the same in both), and mirror it in `src/styles/themes.ts`.
- **Colors as props** (icon `color`, `placeholderTextColor`, tab bar tints, Reanimated animations) — read them from `useAppTheme()`, which returns the JS mirror of the active theme.
- **Safe-area insets** — `ScreenWrapper` already pads the bottom inset. Use `useSafeAreaInsets()` from `react-native-safe-area-context` when a screen needs another edge.
- **Two themes** must stay in sync — every variable in `@variant light` must exist in `@variant dark`.
- **Third-party components** don't accept `className` unless wrapped: `const StyledX = withUniwind(X)` at module level (see the Uniwind docs). Icons from `@react-native-vector-icons` take `color`/`size` props — wrap them in a `View` for spacing.
- **Dynamic classes** must be complete strings (`isActive ? 'bg-primary' : 'bg-surface'`). Never build class names by concatenating fragments (`` `bg-${color}` ``) — Tailwind can't see them at build time.
- **`style={{ ... }}`** only for values that are computed at runtime (insets, measured sizes, animated values).

---

## Step 2 — Sizing (Tailwind spacing scale)

Use Tailwind's spacing scale for padding, margins, gaps and sizes: `p-5` (20), `mb-4` (16), `gap-2.5` (10), `h-6 w-6` (24). One step is 4 px.

Rules:
- Prefer scale values over arbitrary ones. Use brackets (`mt-[30px]`, `rounded-[28px]`) only to match a design exactly.
- Values that must be computed in JS can still use the scale helpers in `src/shared/utils/scale.ts` (`ms(n)`) via `style`.

---

## Step 3 — Typography

Text uses a **role** class for size + line height and a **font** class for the weight. Both are defined in `global.css`:

```tsx
<Text className="text-h1 font-opensans-bold text-typography">{t('auth.login')}</Text>
<Text className="text-body font-opensans text-typography">{t('auth.welcome_back')}</Text>
<Text className="text-body-sm font-opensans text-text-gray">...</Text>
```

Available roles: `text-h1`, `text-h2`, `text-h3`, `text-body-lg`, `text-body`, `text-body-sm`, `text-button`, `text-label`, `text-caption`.

Fonts (React Native has one family per weight): `font-opensans`, `font-opensans-italic`, `font-opensans-semibold`, `font-opensans-semibold-italic`, `font-opensans-bold`, `font-opensans-bold-italic`.

Rules:
- If a needed text role does not exist, **add it to `@theme` in `global.css`** (`--text-<name>` and `--text-<name>--line-height`) — do not use arbitrary sizes in screens.
- Don't use Tailwind's `font-bold` / `font-semibold` weights — they don't switch the font file. Use the `font-opensans-*` classes.
- New fonts: bundle the file with the `expo-font` plugin in `app.config.ts`, then add a `--font-*` variable named exactly like the file.

