// @cli:unistyles-start — the create CLI removes this block for other styling options
// Custom entry — runs unistyles side-effect BEFORE expo-router/entry
// This is required because route modules transitively load components
// that call StyleSheet.create((theme) => ...) at import time.
// The theme must be configured first.
import '@/styles/unistyles';
// @cli:unistyles-end
import 'expo-router/entry';
