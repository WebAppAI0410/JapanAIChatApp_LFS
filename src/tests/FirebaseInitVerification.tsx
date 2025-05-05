import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { testFirebaseAuth } from '../services/firebaseRN';

export const FirebaseInitVerification: React.FC = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    setError(null);
    
    try {
      const isHermes = typeof (global as any).HermesInternal !== 'undefined';
      console.log(`Running Firebase test with Hermes: ${isHermes ? 'enabled' : 'disabled'}`);
      
      const result = await testFirebaseAuth();
      
      if (result) {
        setTestResult('Firebase initialization and authentication successful!');
      } else {
        setError('Firebase test failed');
      }
    } catch (err: any) {
      console.error('Test error:', err);
      setError(`Test error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Initialization Test</Text>
      <Text style={styles.subtitle}>
        Tests Firebase initialization with Hermes JS engine
      </Text>
      
      <Button title="Test Firebase" onPress={runTest} disabled={isLoading} />
      
      {isLoading && (
        <Text style={styles.loadingText}>Testing...</Text>
      )}
      
      {testResult && (
        <Text style={styles.successText}>{testResult}</Text>
      )}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  successText: {
    marginTop: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 16,
    color: '#F44336',
    fontWeight: 'bold',
  },
});
