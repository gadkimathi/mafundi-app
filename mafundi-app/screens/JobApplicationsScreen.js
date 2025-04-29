import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { fetchApplicationsForJobs } from '../services/JobService';

export default function JobApplicationsScreen() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true);
        const res = await fetchApplicationsForJobs(token);
        setApplications(res.data);
      } catch (err) {
        setError('Failed to load job applications.');
      } finally {
        setLoading(false);
      }
    };
    if (token) loadApps();
  }, [token]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Applications for My Jobs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3867d6" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.jobTitle}>Job: {item.job?.title}</Text>
              <Text style={styles.applicant}>Applicant: {item.user?.name}</Text>
              <Text style={styles.status}>Status: <Text style={{color: item.status === 'pending' ? '#fd9644' : item.status === 'accepted' ? '#20bf6b' : '#eb3b5a'}}>{item.status.toUpperCase()}</Text></Text>
              <Text style={styles.coverLetter}>Cover Letter: {item.cover_letter}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3867d6',
    marginBottom: 16,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#3867d6',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3867d6',
    marginBottom: 4,
  },
  applicant: {
    fontSize: 15,
    color: '#3867d6',
    marginBottom: 2,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  coverLetter: {
    fontSize: 15,
    color: '#222f3e',
    marginTop: 4,
  },
  error: {
    color: '#eb3b5a',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
