import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function JobCard({ job, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.location}>{job.location}</Text>
      <Text style={styles.budget}>Budget: KES {job.budget}</Text>
      <Text style={styles.status}>
        Status: <Text style={{ color: job.status === 'open' ? '#20bf6b' : '#eb3b5a' }}>{job.status.toUpperCase()}</Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#3867d6',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3867d6',
    marginBottom: 6,
  },
  location: {
    color: '#778ca3',
    fontSize: 16,
    marginBottom: 4,
  },
  budget: {
    color: '#4b7bec',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
