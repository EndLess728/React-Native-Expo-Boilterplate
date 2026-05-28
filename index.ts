// Custom entry — runs side-effects that MUST execute before expo-router scans
// any route file. Route modules transitively load Unistyles `StyleSheet.create`
// calls (Button, toast), which require `StyleSheet.configure` to have already
// run.
//
// i18next is NOT initialized here — its language preference lives in MMKV,
// which isn't ready until `initStorage()` resolves. `app/_layout.tsx` calls
// `initI18n()` after storage init so the saved language is honored.
//
// Order matters: ES module imports evaluate in source order. The
// `simple-import-sort` rule is disabled here because its preferred ordering
// would put `expo-router/entry` first — which defeats the entire point of
// this file.
/* eslint-disable simple-import-sort/imports */
import '@/styles/unistyles';

import 'expo-router/entry';
