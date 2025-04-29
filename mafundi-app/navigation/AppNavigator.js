import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import PostJobScreen from '../screens/PostJobScreen';
import ApplyJobScreen from '../screens/ApplyJobScreen';
import MyApplicationsScreen from '../screens/MyApplicationsScreen';
import JobApplicationsScreen from '../screens/JobApplicationsScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="NotFound" component={NotFoundScreen} />
    </AuthStack.Navigator>
  );
}

function AppStackScreen() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Dashboard" component={DashboardScreen} />
      <AppStack.Screen name="JobDetail" component={JobDetailScreen} />
      <AppStack.Screen name="PostJob" component={PostJobScreen} />
      <AppStack.Screen name="ApplyJob" component={ApplyJobScreen} />
      <AppStack.Screen name="MyApplications" component={MyApplicationsScreen} />
      <AppStack.Screen name="JobApplications" component={JobApplicationsScreen} />
      <AppStack.Screen name="NotFound" component={NotFoundScreen} />
    </AppStack.Navigator>
  );
}

// Linking config supports both lowercase and capitalized routes for web
const linking = {
  prefixes: [],
  config: {
    screens: {
      Login: ['login', 'Login'],
      Signup: ['signup', 'Signup'],
      Dashboard: ['dashboard', 'Dashboard'],
      JobDetail: ['job/:id', 'Job/:id'],
      PostJob: ['post-job', 'PostJob'],
      ApplyJob: ['apply-job', 'ApplyJob'],
      MyApplications: ['my-applications', 'MyApplications'],
      JobApplications: ['job-applications', 'JobApplications'],
      // Catch-all for any unmatched route
      NotFound: ['404', 'notfound', '*'],
    },
  },
};

export default function AppNavigator() {
  const { token } = useAuth();
  return (
    <NavigationContainer linking={linking} fallback={<NotFoundScreen />}>
      {token ? <AppStackScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}
