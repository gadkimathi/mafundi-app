import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to login or dashboard depending on auth (simple for now)
  return <Redirect href="/login" />;
}
