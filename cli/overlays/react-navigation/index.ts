// Custom entry — the unistyles side-effect MUST run before any screen module
// is imported, because components call StyleSheet.create((theme) => ...) at
// import time and the theme has to be configured first.
import '@/styles/unistyles';

import { registerRootComponent } from 'expo';

import App from '@/App';

registerRootComponent(App);
