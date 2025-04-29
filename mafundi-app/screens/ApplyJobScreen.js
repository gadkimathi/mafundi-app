import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { applyToJob } from '../services/JobService';
import * as Location from 'expo-location';

export default function ApplyJobScreen({ route, navigation }) {
  const { token } = useAuth();
  const { job } = route.params;
  const [location, setLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  const getCurrentLocation = async () => {
    setLocating(true);
    setError('');
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setError('Permission to access location was denied.');
        setLocating(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (e) {
      setError('Could not get current location.');
    } finally {
      setLocating(false);
    }
  };

  const handleApply = async () => {
    setError('');
    let locValue = '';
    if (location) {
      locValue = `${location.latitude},${location.longitude}`;
    } else if (manualLocation && manualLocation.length > 2) {
      locValue = manualLocation;
    } else {
      setError('Please select or enter your location.');
      return;
    }
    setLoading(true);
    try {
      await applyToJob({ job_id: job.id, location: locValue }, token);
      Alert.alert('Success', 'Application submitted!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      setLocation(null);
      setManualLocation('');
    } catch (err) {
      setError(err.message || 'Failed to apply for job.');
      Alert.alert('Error', err.message || 'Failed to apply for job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Apply for {job.title}</Text>
      {!permissionDenied && (
        <TouchableOpacity style={styles.locateBtn} onPress={getCurrentLocation} disabled={locating}>
          <Text style={styles.locateBtnText}>{locating ? 'Locating...' : 'Use My Current Location'}</Text>
        </TouchableOpacity>
      )}
      {(permissionDenied || !location) && (
        <TextInput
          style={styles.input}
          placeholder="Enter your location (e.g. Kariobangi, Nairobi)"
          value={manualLocation}
          onChangeText={setManualLocation}
        />
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleApply} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Apply Now</Text>}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3867d6',
    marginBottom: 24,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d8e0',
  },
  button: {
    backgroundColor: '#3867d6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#eb3b5a',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  locateBtn: {
    backgroundColor: '#4b7bec',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  locateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
