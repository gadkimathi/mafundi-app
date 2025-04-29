import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function DebugLogger() {
  const { token, user } = useAuth();
  useEffect(() => {
    // Log token and user for debugging
    console.log('Auth token:', token);
    console.log('User:', user);
    console.log('Window location:', window.location.pathname);
  }, [token, user]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <DebugLogger />
      <AppNavigator />
    </AuthProvider>
  );
}
