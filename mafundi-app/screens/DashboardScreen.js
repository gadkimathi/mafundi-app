import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView, StatusBar, TouchableOpacity, TextInput, Alert } from 'react-native';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../services/JobService';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function DashboardScreen({ navigation }) {
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [locating, setLocating] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Redirect unauthenticated users to Login
  useEffect(() => {
    if (!token) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }, [token, navigation]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const res = await fetchJobs(token);
        setJobs(res.data);
      } catch (err) {
        setError('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };
    if (token) loadJobs();
  }, [token]);

  // Prompt for location on mount
  useEffect(() => {
    if (!userLocation && !permissionDenied) {
      getCurrentLocation();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userLocation && jobs.length) {
      // Filter and sort jobs by proximity
      const jobsWithDistance = jobs.map(job => {
        if (job.location_coords) {
          const [lat, lon] = job.location_coords.split(',').map(Number);
          const distance = haversineDistance(userLocation.latitude, userLocation.longitude, lat, lon);
          return { ...job, distance };
        }
        return { ...job, distance: null };
      });
      // Only show jobs within 10km, sorted by distance
      const filtered = jobsWithDistance
        .filter(j => j.distance !== null && j.distance <= 10)
        .sort((a, b) => a.distance - b.distance);
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs([]);
    }
  }, [userLocation, jobs]);

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
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (e) {
      setError('Could not get current location. Enter manually below.');
    } finally {
      setLocating(false);
    }
  };

  const handleManualLocation = () => {
    // For demo, let's just alert and not geocode
    if (!manualLocation || manualLocation.length < 2) {
      Alert.alert('Error', 'Please enter your location.');
      return;
    }
    Alert.alert('Manual location', 'Manual location entry is not yet geocoded. Please use GPS for best results.');
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetail', { job });
  };

  const isFundi = user?.role === 'fundi';
  const isForeman = user?.role === 'foreman';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6fa" />
      <View style={styles.topNav}>
        {isFundi && (
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('MyApplications')}>
            <Ionicons name="briefcase-outline" size={18} color="#3867d6" />
            <Text style={styles.navBtnText}>My Applications</Text>
          </TouchableOpacity>
        )}
        {isForeman && (
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('JobApplications')}>
            <Ionicons name="people-outline" size={18} color="#3867d6" />
            <Text style={styles.navBtnText}>Applications for My Jobs</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.locationBar}>
        <TouchableOpacity style={styles.locateBtn} onPress={getCurrentLocation} disabled={locating}>
          <Ionicons name="locate" size={18} color="#fff" />
          <Text style={styles.locateBtnText}>{locating ? 'Locating...' : 'Use My Location'}</Text>
        </TouchableOpacity>
        <Text style={styles.or}>or</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location manually"
          value={manualLocation}
          onChangeText={setManualLocation}
        />
        <TouchableOpacity style={styles.manualBtn} onPress={handleManualLocation}>
          <Text style={styles.manualBtnText}>Set</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Jobs Near Me</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3867d6" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <JobCard job={{ ...item, distance: item.distance }} onPress={() => handleJobPress(item)} />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>No jobs found within 10km.</Text>}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostJobScreen')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 16,
    paddingTop: 36,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#d1d8e0',
    shadowColor: '#3867d6',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  navBtnText: {
    color: '#3867d6',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locateBtn: {
    backgroundColor: '#3867d6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  or: {
    marginHorizontal: 8,
    color: '#778ca3',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#d1d8e0',
    marginHorizontal: 4,
  },
  manualBtn: {
    backgroundColor: '#4b7bec',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 4,
  },
  manualBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3867d6',
    marginBottom: 16,
    letterSpacing: 1,
    alignSelf: 'center',
  },
  error: {
    color: '#eb3b5a',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  empty: {
    color: '#778ca3',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#3867d6',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});
