## Step 1 — Theming (non-negotiable)

Styles use React Native's `StyleSheet`. Anything that reads the theme goes through `makeStyles` from `@/theme`, which builds the stylesheet once per theme:

```ts
import { makeStyles } from '@/theme';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

// inside the component
const styles = useStyles();
```

Styles that never read the theme stay in a plain module-level `StyleSheet.create({ ... })`.

Rules:
- **Colors** — always `theme.colors.<token>` from `src/styles/themes.ts`. Never hex codes, `rgba(...)`, or named colors inline. If a needed color is missing, add it to **both** `lightTheme` and `darkTheme` in `src/styles/themes.ts` (use the same key).
- **Colors as props** (icon `color`, `placeholderTextColor`, tab bar tints) — read them from `useAppTheme()`.
- **Safe-area insets** — `ScreenWrapper` already pads the bottom inset. Use `useSafeAreaInsets()` from `react-native-safe-area-context` when a screen needs another edge.
- **Two themes** must stay in sync. Every key added to `lightTheme.colors` must exist in `darkTheme.colors`.
- **No inline `style={{ ... }}`** for anything beyond a one-off positional tweak (e.g. `style={{ marginTop: ms(4) }}` is fine; a 5-line inline object is not). Promote to the stylesheet.

---

## Step 2 — Sizing (`ms` everywhere)

All dimensions, spacing, font sizes, border radii, and icon sizes go through the scale helpers in `src/shared/utils/scale.ts`:

```ts
import { ms } from '@/shared/utils';

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
- Designs are spec'd against the 350×680 guideline (see `src/shared/utils/scale.ts`). Pass design-unit numbers to `ms()` and let the helper do the device scaling.

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

