import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function JobDetailScreen({ route, navigation }) {
  const { job } = route.params;
  const { user } = useAuth();
  const isFundi = user?.role === 'fundi';
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{job.location}</Text>
      <Text style={styles.label}>Budget:</Text>
      <Text style={styles.value}>KES {job.budget}</Text>
      <Text style={styles.label}>Status:</Text>
      <Text style={[styles.value, { color: job.status === 'open' ? '#20bf6b' : '#eb3b5a' }]}>{job.status.toUpperCase()}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.desc}>{job.description}</Text>
      {isFundi && job.status === 'open' && (
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => navigation.navigate('ApplyJob', { job })}
        >
          <Text style={styles.applyBtnText}>Apply for this Job</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f6fa',
    padding: 28,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3867d6',
    marginBottom: 16,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    color: '#778ca3',
    fontWeight: 'bold',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    color: '#222f3e',
    marginBottom: 4,
  },
  desc: {
    fontSize: 16,
    color: '#222f3e',
    marginTop: 4,
    lineHeight: 22,
  },
  applyBtn: {
    marginTop: 28,
    backgroundColor: '#3867d6',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
