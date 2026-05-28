# Localization conventions for `src/localization/` — React Native + Expo

> Source of truth for adding, modifying, or consuming translations in this project. Intended to be read by humans and AI coding assistants alike (Claude Code, Cursor, Copilot, Codex, Aider, etc.). Follow it verbatim — do not invent a parallel structure.

This is a standalone Expo / React Native app. All user-facing text goes through **i18next** + **react-i18next** with translations stored in JSON files under `src/localization/translations/`. Language preference is persisted in encrypted MMKV, device locale is the fallback, and RTL layout changes trigger a full app restart.

---

## What the localization module already handles

Do **not** re-implement any of these in a screen or component:

- **Language persistence** — the selected language is saved to MMKV via `useSelectedLanguage()`. Reads survive cold launches.
- **Device locale fallback** — on first launch (no saved preference), `expo-localization` detects the device language. Falls back to `'en'` if the detected locale isn't in the resource map.
- **RTL layout switching** — `changeLanguage()` detects RTL transitions (e.g. English → Arabic) and forces `I18nManager.forceRTL()` + a full app restart. No per-screen RTL logic is needed.
- **Type-safe translation keys** — `react-i18next.d.ts` augments `CustomTypeOptions` so `t()` autocompletes and type-checks against `en.json`. The `TxKeyPath` type in `utils.tsx` provides compile-time validation for the `useTranslate()` / `translate()` wrappers.
- **Initialization ordering** — `initI18n()` is called in `app/_layout.tsx` **after** `initStorage()` and `rehydrateStores()` complete. This guarantees the saved language is available from MMKV. Never move this call earlier.

If you need to change any of this behavior, modify the source files in `src/localization/` — do **not** add parallel i18n logic elsewhere.

---

## Step 1 — Understand the file layout (rigid; do not deviate)

```
src/localization/
├── i18n.ts              ← i18next initialization; called AFTER initStorage()
├── react-i18next.d.ts   ← TypeScript module augmentation for type-safe t()
├── resources.ts         ← Language resource map + Language union type
├── types.ts             ← RecursiveKeyOf<T> helper for nested key paths
├── utils.tsx            ← Public API: hooks & helpers for consuming translations
└── translations/
    ├── en.json           ← English (default / fallback — type source of truth)
    ├── es.json           ← Spanish
    └── ar.json           ← Arabic (RTL)
```

Rules:
- **One JSON file per language.** Name: `<ISO 639-1 code>.json` (e.g. `en.json`, `fr.json`, `zh.json`).
- **All JSON files must have identical structure.** Every key present in `en.json` must be present in every other file. Missing keys fall back to English at runtime but indicate an incomplete translation.
- **`en.json` is the type source of truth.** TypeScript derives all key paths from this file. Add keys here first.
- **`resources.ts` is the registry.** Every new language file must be imported and registered here. The `Language` type is auto-derived from the registry keys.

---

## Step 2 — Understand the initialization sequence

The init chain in `app/_layout.tsx → RootLayout → prepare()` is:

```
initStorage()  →  rehydrateStores()  →  initI18n()
```

`initI18n()` (in `src/localization/i18n.ts`):
1. Reads the saved language from MMKV via `getLanguage()`.
2. Falls back to the device locale via `expo-localization` if no saved preference.
3. Initializes i18next with the `resources` map, `fallbackLng: 'en'`, and `compatibilityJSON: 'v4'`.
4. Sets `I18nManager.allowRTL` / `forceRTL` based on the resolved language direction.

**Never call `initI18n()` before `initStorage()`.** MMKV isn't created until `initStorage()` resolves — calling earlier silently ignores the saved preference.

`initI18n()` is idempotent — safe to call more than once (a guard flag prevents re-initialization).

---

## Step 3 — Using translations in components

### 3a. Reactive translation (for UI that updates on language change)

Use the `useTranslate()` hook from `@/localization/utils`:

```tsx
import { useTranslate } from '@/localization/utils';

const MyScreen: React.FC = () => {
  const t = useTranslate();

  return (
    <ScreenWrapper>
      <Text style={TextStyles.h1}>{t('auth.welcome')}</Text>
      <Text>{t('settings.select_language')}</Text>
    </ScreenWrapper>
  );
};
```

`useTranslate()` wraps `react-i18next`'s `useTranslation()` and returns a memoized function typed with `TxKeyPath`. It **re-renders the component** when the active language changes.

**Use this for all user-facing text in React components.**

### 3b. Non-reactive translation (outside the component tree)

Use the `translate()` function from `@/localization/utils`:

```tsx
import { translate } from '@/localization/utils';

showErrorToast(translate('errors.network_failure'));
```

`translate()` reads the current language imperatively via `i18n.t()`. It does **not** trigger re-renders. Use only for:
- Toast messages
- Error formatting in catch blocks
- Utility functions that run outside React

### 3c. Changing the active language

Use the `useSelectedLanguage()` hook:

```tsx
import { useSelectedLanguage } from '@/localization/utils';
import type { Language } from '@/localization/resources';

const LanguagePicker: React.FC = () => {
  const { language, setLanguage } = useSelectedLanguage();

  return (
    <Pressable onPress={() => setLanguage('es')}>
      <Text>{language === 'es' ? '✓ ' : ''}Español</Text>
    </Pressable>
  );
};
```

`useSelectedLanguage()`:
- Reads the current language from MMKV (reactive via `useMMKVString`).
- On `setLanguage(lang)`: writes to MMKV **and** calls `changeLanguage()`.
- `changeLanguage()` calls `i18n.changeLanguage(lang)` and, if the RTL direction changed (e.g. LTR → RTL or vice versa), forces `I18nManager.forceRTL()` + restarts the app.

**Never call `i18n.changeLanguage()` directly.** It skips MMKV persistence and RTL restart logic.

### 3d. Translating Zod Form Schemas

When using Zod with React Hook Form, **do not** define the schema at the module scope with `translate()`, as it will evaluate before i18n is initialized. Instead, wrap the schema in a function that takes the reactive `t` function, and memoize it inside your component:

```tsx
import { useTranslate } from '@/localization/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 1. Define schema generator outside the component
const getFormSchema = (t: ReturnType<typeof useTranslate>) => z.object({
  email: z.string({ error: t('validation.email_required') }),
});

type FormData = z.infer<ReturnType<typeof getFormSchema>>;

export default function MyFormScreen() {
  const t = useTranslate();
  
  // 2. Memoize the schema reactively
  const schema = React.useMemo(() => getFormSchema(t), [t]);

  const { control } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  // ...
}
```

### 3e. Accessing the Language type

```tsx
import type { Language } from '@/localization/resources';
// Language = 'en' | 'es' | 'ar' — derived from `keyof typeof resources`
```

Use this type whenever you need to reference a language code in props, state, or function parameters.

---

## Step 4 — Adding a new translation key

1. **Add the key to `en.json` first** — this is the type source of truth:

   ```json
   {
     "auth": {
       "welcome": "Welcome",
       "forgot_password": "Forgot your password?"
     }
   }
   ```

2. **Add the same key to every other language file** with the translated value. Structure must be identical:

   ```json
   // es.json
   {
     "auth": {
       "welcome": "Bienvenido",
       "forgot_password": "¿Olvidaste tu contraseña?"
     }
   }
   ```

   ```json
   // ar.json
   {
     "auth": {
       "welcome": "مرحبا",
       "forgot_password": "هل نسيت كلمة المرور؟"
     }
   }
   ```

3. **Use the key in your component** — TypeScript autocompletes and validates:

   ```tsx
   const t = useTranslate();
   return <Text>{t('auth.forgot_password')}</Text>;
   ```

### Key naming conventions

- **Dot-separated nested JSON** — group keys by feature or screen area.
- **snake_case** for key segments: `auth.login_description` ✅, `auth.loginDescription` ❌.
- **Top-level groups** match feature areas: `auth`, `settings`, `errors`, `common`, `home`, `profile`, etc.
- **Descriptive but concise**: `settings.select_language` ✅, `settings.selectTheLanguageThatYouWantToUse` ❌.
- **No abbreviations**: `auth.password` ✅, `auth.pwd` ❌.

---

## Step 5 — Adding a new language

Follow all steps — skipping any will cause build errors or runtime fallbacks.

### 5a. Create the translation file

Copy `en.json` and translate every value. Place at `src/localization/translations/<code>.json`:

```json
// src/localization/translations/fr.json
{
  "auth": {
    "welcome": "Bienvenue",
    "login": "Se connecter",
    "profile": "Profil",
    "logout": "Se déconnecter",
    "home": "Accueil",
    "email": "E-mail",
    "password": "Mot de passe",
    "login_description": "Entrez votre e-mail et mot de passe pour vous connecter"
  },
  "settings": {
    "language": "Langue",
    "select_language": "Sélectionner la langue",
    "english": "Anglais",
    "spanish": "Espagnol",
    "arabic": "Arabe",
    "french": "Français"
  }
}
```

### 5b. Register the language in `resources.ts`

Import the new JSON and add it to the resource map. The `Language` type auto-updates:

```ts
import ar from '@/localization/translations/ar.json';
import en from '@/localization/translations/en.json';
import es from '@/localization/translations/es.json';
import fr from '@/localization/translations/fr.json';  // ← new

export const resources = {
  en: { translation: en },
  es: { translation: es },
  ar: { translation: ar },
  fr: { translation: fr },  // ← new
};

export type Language = keyof typeof resources;
// Now: 'en' | 'es' | 'ar' | 'fr'
```

### 5c. Add a language label key to every existing translation file

Each language file needs a label for the new language under `settings`:

```
en.json → "settings": { ..., "french": "French" }
es.json → "settings": { ..., "french": "Francés" }
ar.json → "settings": { ..., "french": "الفرنسية" }
fr.json → "settings": { ..., "french": "Français" }
```

### 5d. Add the language to the language picker UI

The language picker is in `app/(tabs)/profile.tsx`. Add to the `LANGUAGES` array:

```tsx
const LANGUAGES: {
  code: Language;
  labelKey: 'settings.english' | 'settings.spanish' | 'settings.arabic' | 'settings.french';
}[] = [
  { code: 'en', labelKey: 'settings.english' },
  { code: 'es', labelKey: 'settings.spanish' },
  { code: 'ar', labelKey: 'settings.arabic' },
  { code: 'fr', labelKey: 'settings.french' },  // ← new
];
```

### 5e. If the new language is RTL

If the new language is RTL (e.g. Hebrew, Urdu, Persian), update the RTL detection in `utils.tsx → changeLanguage()`. Currently it hard-checks for `'ar'` — extend to a set:

```tsx
const RTL_LANGUAGES = new Set<Language>(['ar', 'he']);

const isCurrentRTL = RTL_LANGUAGES.has(currentLang as Language);
const isNewRTL = RTL_LANGUAGES.has(lang);
```

---

## Step 6 — Interpolation and plurals

i18next supports interpolation and pluralization natively. Use `compatibilityJSON: 'v4'` (already configured).

### Interpolation

```json
// en.json
{ "greeting": "Hello, {{name}}!" }
```

```tsx
t('greeting', { name: 'John' })  // → "Hello, John!"
```

### Pluralization

Uses ICU-style suffixes: `_zero`, `_one`, `_two`, `_few`, `_many`, `_other`.

```json
// en.json
{
  "items_one": "{{count}} item",
  "items_other": "{{count}} items"
}
```

```tsx
t('items', { count: 1 })  // → "1 item"
t('items', { count: 5 })  // → "5 items"
```

For languages with complex plural rules (Arabic has six forms), define all applicable suffixes in that language's JSON file. i18next picks the correct form based on the locale's CLDR rules.

---

## Step 7 — Verify

After writing the code:

```bash
yarn type-check   # tsc --noEmit — catches missing keys, wrong TxKeyPath usage
yarn lint         # eslint . — catches import order / style issues
```

Surface any failures explicitly before reporting the work as done.

---

## How type safety works (for reference)

Understanding the type pipeline helps you debug autocomplete issues:

1. **`en.json`** defines the canonical translation shape as a nested object.
2. **`resources.ts`** imports all JSON files and exports a typed `resources` map. `Language` is derived as `keyof typeof resources`.
3. **`react-i18next.d.ts`** augments `react-i18next`'s `CustomTypeOptions` interface, binding the `resources` type to `en`'s shape. This makes `t()` from `useTranslation()` aware of all valid keys.
4. **`types.ts`** provides `RecursiveKeyOf<T>` — a recursive mapped type that flattens `{ auth: { login: string } }` into the union `'auth' | 'auth.login'`.
5. **`utils.tsx`** defines `TxKeyPath = RecursiveKeyOf<typeof resources.en.translation>` and uses it to type the `key` parameter of `useTranslate()` and `translate()`.

**Consequence:** adding a key to `en.json` automatically makes it available in `t()` autocomplete with no manual type updates. Using a key that doesn't exist in `en.json` produces a TypeScript error.

---

## Dependencies

| Package               | Version    | Purpose                                    |
|-----------------------|------------|--------------------------------------------|
| `i18next`             | `^25.8.0`  | Core i18n framework                        |
| `react-i18next`       | `^16.5.3`  | React bindings (hooks, context, components)|
| `expo-localization`   | `~55.0.15` | Device locale detection at first launch    |
| `react-native-mmkv`   | (project)  | Persisting the selected language           |
| `react-native-restart`| `^0.0.27`  | App restart after RTL direction change     |

---

## Hard rules — never violate these

- **Never use `useTranslation()` from `react-i18next` directly.** It bypasses `TxKeyPath` type safety. Use `useTranslate()` from `@/localization/utils`.
- **Never call `i18n.t()` in a React component.** It's non-reactive and won't update when the language changes. Use `useTranslate()`.
- **Never call `i18n.changeLanguage()` directly.** It skips MMKV persistence and RTL restart logic. Use `useSelectedLanguage().setLanguage()`.
- **Never hardcode user-facing strings in JSX.** Every visible string must go through `t('key.path')`. The only exception is debug-only text gated behind `__DEV__`.
- **Never store translations in `.tsx` / `.ts` files.** All translations live in JSON files under `src/localization/translations/`.
- **Never have different JSON structures across language files.** Every key in `en.json` must exist in every other language file with the same nesting. Missing keys fall back to English silently — which means an incomplete UX, not a crash.
- **Never call `initI18n()` before `initStorage()`.** The saved language preference lives in MMKV, which isn't created until `initStorage()` resolves.
- **Never use `AsyncStorage` for language preference.** The project uses MMKV. Language persistence goes through `useMMKVString` via `useSelectedLanguage()`.
- **Never import from `react-i18next` in screen files.** All translation access goes through `@/localization/utils`.

---

## Final checklist before reporting done

- [ ] All new user-facing strings use translation keys via `t('key.path')`, not hardcoded text
- [ ] New keys added to `en.json` **first**, then to **every** other language file with identical structure
- [ ] Key names follow `feature_area.snake_case` convention
- [ ] Components use `useTranslate()` from `@/localization/utils`, not `useTranslation()` from `react-i18next`
- [ ] Non-component code uses `translate()` from `@/localization/utils`, not `i18n.t()`
- [ ] Language switching uses `useSelectedLanguage()`, not `i18n.changeLanguage()` directly
- [ ] If a new language was added: JSON file created, registered in `resources.ts`, label keys added to all existing files, added to language picker in `app/(tabs)/profile.tsx`
- [ ] If a new RTL language was added: RTL detection logic updated in `utils.tsx → changeLanguage()`
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes

---

## Reference index

| Pattern                                    | File to read                                   |
|--------------------------------------------|------------------------------------------------|
| i18next initialization                     | `src/localization/i18n.ts`                     |
| Type-safe hooks and helpers                | `src/localization/utils.tsx`                   |
| Language resource map + `Language` type     | `src/localization/resources.ts`                |
| Module augmentation for `t()` autocomplete | `src/localization/react-i18next.d.ts`          |
| Recursive key-path type utility            | `src/localization/types.ts`                    |
| English translations (type source of truth)| `src/localization/translations/en.json`        |
| App init sequence (storage → i18n)         | `app/_layout.tsx`                              |
| Language picker UI                         | `app/(tabs)/profile.tsx`                       |
| MMKV storage initialization                | `src/storage/index.ts`                         |
| Translation usage in a screen              | `app/(tabs)/index.tsx`, `app/(tabs)/profile.tsx`|
