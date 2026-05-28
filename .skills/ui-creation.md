# UI conventions for screens & components — React Native + Expo

> Source of truth for building any screen, component, or layout in this project. Intended to be read by humans and AI coding assistants alike (Claude Code, Cursor, Copilot, Codex, Aider, etc.). Follow it verbatim — do not invent a parallel structure.

This is an Expo Router app styled with `react-native-unistyles` (v3). Theme tokens, typography, and scaling helpers are centralized — screens compose them, they do not redefine them.

---

## Where things live

```
app/                       ← Expo Router screens (file-based routing)
  _layout.tsx              ← root layout, Stack.Protected auth gating
  (auth)/                  ← auth group
  (tabs)/                  ← tab group
src/
  components/              ← reusable UI primitives (PascalCase.tsx)
  theme/                   ← TextStyles, fonts (typography only)
  styles/                  ← unistyles config, themes (light/dark), breakpoints
  utils/                   ← scale (ms, vs, s), toast, etc.
```

- **Screens** go under `app/` using Expo Router conventions.
- **Reusable components** go under `src/components/` as `PascalCase.tsx`, with a default export and re-export added to `src/components/index.ts`.
- **Never** create a new top-level folder for design tokens; extend `src/theme/` or `src/styles/themes.ts`.

---

## Step 1 — Theming (non-negotiable)

All styles go through `react-native-unistyles` `StyleSheet.create((theme, rt) => ...)`. Never `import { StyleSheet } from 'react-native'`.

```ts
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
  },
}));
```

Rules:
- **Colors** — always `theme.colors.<token>` from `src/styles/themes.ts`. Never hex codes, `rgba(...)`, or named colors inline. If a needed color is missing, add it to **both** `lightTheme` and `darkTheme` in `src/styles/themes.ts` (use the same key).
- **Safe-area insets** — read from `rt.insets.top | bottom | left | right`. Do not import `useSafeAreaInsets` in a screen unless you need the live value during render (rare).
- **Two themes** must stay in sync. Every key added to `lightTheme.colors` must exist in `darkTheme.colors`.
- **No inline `style={{ ... }}`** for anything beyond a one-off positional tweak (e.g. `style={{ marginTop: ms(4) }}` is fine; a 5-line inline object is not). Promote to the stylesheet.

---

## Step 2 — Sizing (`ms` everywhere)

All dimensions, spacing, font sizes, border radii, and icon sizes go through the scale helpers in `src/utils/scale.ts`:

```ts
import { ms } from '@/utils';

padding: ms(20),
borderRadius: ms(10),
fontSize: ms(16),
```

- `ms(n)` — moderateScale (use this 95% of the time)
- `s(n)` — horizontal scale
- `vs(n)` — vertical scale
- `mvs(n)` — moderate vertical scale

Rules:
- **Raw numeric dimensions are banned** in `style` blocks. `paddingHorizontal: 20` → `paddingHorizontal: ms(20)`. Exceptions: `flex: 1`, `flexGrow: 1`, `opacity`, `zIndex`, integer multipliers.
- Designs are spec'd against the 350×680 guideline (see `src/utils/scale.ts`). Pass design-unit numbers to `ms()` and let the helper do the device scaling.

---

## Step 3 — Typography

All `<Text>` styles come from `src/theme/TextStyles.ts`. Do not inline `fontSize`, `lineHeight`, or `fontFamily` in a screen.

```tsx
import { TextStyles } from '@/theme';
import { useTranslate } from '@/localization/utils';

// Inside your component:
// const t = useTranslate();

<Text style={TextStyles.h1}>{t('auth.login')}</Text>
<Text style={TextStyles.body}>{t('auth.welcome_back')}</Text>
<Text style={[TextStyles.bodySmall, { color: theme.colors.textGray }]}>...</Text>
```

Available roles (see `TextStyles.ts` for exact sizes):
- Headings: `h1`, `h2`, `h3`
- Body: `bodyLarge`, `body`, `bodySmall` (+ `*SemiBold` variants)
- UI: `button`, `buttonSmall`, `label`, `caption`, `overline`
- Utility: `error`, `link`

Rules:
- If a needed text style does not exist, **add it to `TextStyles.ts`** with `ms()`-scaled values — do not inline it.
- Color is composed at the call site (`[TextStyles.body, { color: theme.colors.danger }]`), because `TextStyles` is color-agnostic.
- Use `fonts.openSan.*` from `@/theme` only when defining a new `TextStyles` entry, never in a screen.

---

## Step 4 — Use the existing primitives

Before building anything new, check `src/components/`:

| Component | Use for |
|---|---|
| `ScreenWrapper` | Root of every screen (theme background, safe-area insets, keyboard handling, optional background image, loader overlay). |
| `Button` | Any tappable CTA. Variants: `primary`, `secondary`, `disabled`. Supports `leftIcon` / `rightIcon` / `isLoading`. |
| `TextField` | Uncontrolled text input with focus animation, error border, optional left/end icons. |
| `ControlledTextField` | `react-hook-form`-bound `TextField`. Use this in forms — never wire `TextField` to RHF directly. |
| `FullScreenLoader` | Modal spinner overlay — usually triggered via `ScreenWrapper`'s `showLoader` prop. |
| `TabBarIcon` / `TabBarLabel` | Tab navigator UI bits. |

If a new pattern recurs ≥3 times across screens, lift it into `src/components/` rather than copy-pasting JSX.

---

## Step 5 — ScreenWrapper rules

Every screen renders inside `<ScreenWrapper>`. It is the only place where keyboard handling, safe areas, background images, and the loading overlay are wired up.

```tsx
<ScreenWrapper scrollable style={styles.container}>
  {/* screen content */}
</ScreenWrapper>
```

Props:
- `style` — layout style (padding, `justifyContent`, `alignItems`, etc.). Routed to the content container in scrollable mode, or the outer `View` otherwise. **Caller never thinks about which.**
- `scrollable` — opt-in when the screen has text inputs or content that may exceed the viewport. Uses `KeyboardAwareScrollView` from `react-native-keyboard-controller`, which scrolls **only when the focused input would be obscured** by the keyboard. Centered layouts stay centered when there is room.
- `showLoader` — toggles full-screen `ActivityIndicator` overlay.
- `backgroundImage` / `backgroundImageStyle` / `backgroundImageResizeMode` — full-screen background art.
- `keyboardBottomOffset` — gap between the keyboard top and the focused input (default `20`).

Rules:
- **Do not** import `KeyboardAvoidingView` or `KeyboardAwareScrollView` directly in screens — route through `ScreenWrapper`.
- **Do not** default to `scrollable` for list screens, static dashboards, or screens with sticky bottom CTAs:
  - `flex: 1` children break inside a scroll view (the content container has intrinsic height).
  - `FlatList` / `FlashList` inside a `ScrollView` warns and loses virtualization.
  - iOS rubber-band bounce on a non-overflowing screen looks broken.
- **Lists**: use `FlatList` or `FlashList` directly under a non-scrollable `ScreenWrapper`; the list owns scrolling.
- Pass layout via `style` prop only. There is no separate `contentContainerStyle` prop — `ScreenWrapper` routes it for you.

---

## Step 6 — Forms

`react-hook-form` + `zod` + `@hookform/resolvers/zod` + `ControlledTextField`.

```tsx
import { useTranslate } from '@/localization/utils';

// 1. Define the schema generation function (so translations evaluate at render time)
const getFormSchema = (t: ReturnType<typeof useTranslate>) => z.object({
  email: z.string({ error: t('validation.email_required') }).min(1, t('validation.email_required')).email(t('validation.email_invalid')),
  password: z.string().min(6, t('validation.password_min_length')),
});

type FormData = z.infer<ReturnType<typeof getFormSchema>>;

// 2. Inside the component, memoize the schema with the reactive `t`
const t = useTranslate();
const schema = React.useMemo(() => getFormSchema(t), [t]);

const { control, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { email: '', password: '' },
});

<ControlledTextField<FormData>
  control={control}
  name="email"
  placeholder={t('auth.enter_email')}
  keyboardType="email-address"
  autoCapitalize="none"
  autoComplete="email"
  textContentType="emailAddress"
  returnKeyType="next"
/>
```

Rules:
- **One schema per form**, generated via a function so validation messages can be translated reactively.
- **Validation messages live in the schema**, translated via `t()`, not hardcoded.
- Wrap form screens in `<ScreenWrapper scrollable>` so the focused field is kept visible.
- Use `react-hook-form` for any input — never `useState` for individual fields.

---

## Step 7 — Navigation

This project uses **Expo Router** (file-based). Adding a screen = adding a file under `app/`.

- Use route groups `(group)/` to share a layout without affecting URL.
- Use `_layout.tsx` for stack/tab configuration.
- For programmatic navigation use `router.push|replace|back` from `expo-router`.
- For redirects driven by global state, prefer the built-in `<Stack.Protected>` guard (already wired in `app/_layout.tsx`) over per-screen `useEffect` redirects.

Don't install or import `@react-navigation/*` directly — Expo Router re-exports what's needed.

---

## Step 8 — i18n & env

- User-facing strings must be fully translated. See the **[Localization Skill](file://.skills/localization.md)**.
- Use `useTranslate()` from `@/localization/utils`. No raw English literals in screens (debug labels gated by `__DEV__` are fine).
- Public runtime config goes through `Env` from `@env`. Never read `process.env.*` directly in components.

---

## Patterns to avoid

- Inline hex/rgba colors in components → use `theme.colors.*`.
- Raw numeric dimensions / font sizes → wrap with `ms()`.
- Inline `fontSize` / `fontFamily` / `lineHeight` in screens → add to `TextStyles`.
- `KeyboardAvoidingView` / `KeyboardAwareScrollView` imported in a screen → use `<ScreenWrapper scrollable>`.
- `FlatList` / `FlashList` inside a scrollable `ScreenWrapper` → use a non-scrollable wrapper.
- `useState` for form fields → use `react-hook-form` + `ControlledTextField`.
- Re-implementing `Button`, `TextField`, loader, screen wrapper, etc. → extend the existing primitive, or lift a new shared one into `src/components/` if the pattern recurs.
- Adding a key to one theme only → both `lightTheme` and `darkTheme` must define every key.
- `import { StyleSheet } from 'react-native'` → always `from 'react-native-unistyles'`.

---

## Step 9 — Reviewer checklist (before opening a PR)

- [ ] Screen is wrapped in `<ScreenWrapper>`; `scrollable` is set iff there are inputs or potentially overflowing content.
- [ ] No hex codes, no raw numbers in `style` blocks (except `flex`, `opacity`, `zIndex`).
- [ ] All text uses a `TextStyles.*` entry; new styles were added to `TextStyles.ts`, not inlined.
- [ ] All colors resolve from `theme.colors.*`; new tokens added to **both** themes.
- [ ] No `@react-navigation/*` direct imports; routes added under `app/` follow Expo Router conventions.
- [ ] Forms use `react-hook-form` + `zod` + `ControlledTextField`.
- [ ] User-facing strings go through `useTranslate()`.
- [ ] New reusable component is exported from `src/components/index.ts`.
