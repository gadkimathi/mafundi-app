import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Image, ActivityIndicator } from 'react-native';
import { register as apiRegister, login as apiLogin } from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('fundi');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await apiRegister({ name, email, password, password_confirmation: passwordConfirm, role });
      // Auto-login after successful signup
      const response = await apiLogin(email, password);
      const { user, token } = response.data;
      await login(user, token);
      router.replace('/dashboard');
    } catch (err) {
      // Show more informative error if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError('Signup failed. Try a different email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />
      <View style={styles.roleSwitch}>
        <TouchableOpacity style={[styles.roleButton, role === 'fundi' && styles.roleSelected]} onPress={() => setRole('fundi')}>
          <Text style={[styles.roleText, role === 'fundi' && styles.roleTextSelected]}>Fundi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.roleButton, role === 'foreman' && styles.roleSelected]} onPress={() => setRole('foreman')}>
          <Text style={[styles.roleText, role === 'foreman' && styles.roleTextSelected]}>Foreman</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    padding: 24,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3867d6',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d8e0',
  },
  roleSwitch: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#d1d8e0',
    alignItems: 'center',
  },
  roleSelected: {
    backgroundColor: '#3867d6',
    borderColor: '#3867d6',
  },
  roleText: {
    color: '#3867d6',
    fontWeight: 'bold',
  },
  roleTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#3867d6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#3867d6',
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center',
  },
  error: {
    color: '#eb3b5a',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
