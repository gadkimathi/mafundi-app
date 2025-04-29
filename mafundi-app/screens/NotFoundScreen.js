import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NotFoundScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Screen Not Found</Text>
      <Text style={styles.message}>The page or screen you are looking for does not exist.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Login')}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eb3b5a',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#222f3e',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3867d6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
