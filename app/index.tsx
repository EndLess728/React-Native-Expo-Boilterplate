import { Redirect } from 'expo-router';

// `/` entry — defer to the AuthGate in `_layout.tsx`. We redirect to `/home`;
// the gate bounces unauthenticated users to `/login`.
export default function Index() {
  return <Redirect href="/home" />;
}
