import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Platform } from 'react-native';
import { initializeFirebase, signInAnonymous, getCurrentUser } from '../services/firebaseRN.js';

/**
 * FirebaseInitVerification - Component to verify Firebase initialization
 * 
 * This component tests Firebase initialization and authentication in the Hermes JavaScript engine
 * and provides detailed logs for debugging.
 */
export const FirebaseInitVerification: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => {
    console.log(`[FirebaseTest] ${message}`);
    setLogs(prev => [...prev, `${new Date().toISOString().slice(11, 19)} - ${message}`]);
  };

  const runTest = async () => {
    setStatus('testing');
    setError(null);
    setLogs([]);

    try {
      const isHermes = typeof (global as any).HermesInternal !== 'undefined';
      addLog(`Environment: ${Platform.OS}, Hermes: ${isHermes ? 'Enabled' : 'Disabled'}`);
      
      addLog('Test 1: Firebase Initialization - Starting');
      await initializeFirebase();
      addLog('Test 1: Firebase Initialization - Success');
      
      addLog('Test 2: Authentication - Starting');
      const currentUser = getCurrentUser();
      
      if (currentUser) {
        addLog(`Test 2: Authentication - User already exists: ${currentUser.uid}`);
      } else {
        addLog('Test 2: Authentication - No current user, signing in anonymously');
        const user = await signInAnonymous();
        addLog(`Test 2: Authentication - Anonymous sign-in successful: ${user.uid}`);
      }
      
      addLog('Test 3: Firebase Services Access - Starting');
      const auth = require('@react-native-firebase/auth').default();
      addLog(`Test 3: Firebase Services Access - Auth instance available: ${!!auth}`);
      
      setStatus('success');
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Initialization Verification</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title={status === 'testing' ? 'Testing...' : 'Run Verification'} 
          onPress={runTest} 
          disabled={status === 'testing'} 
        />
      </View>
      
      {status !== 'idle' && (
        <View style={[
          styles.statusContainer, 
          status === 'testing' ? styles.statusTesting : 
          status === 'success' ? styles.statusSuccess : 
          styles.statusError
        ]}>
          <Text style={styles.statusText}>
            {status === 'testing' ? 'Testing Firebase initialization...' : 
             status === 'success' ? 'All tests passed successfully!' : 
             `Error: ${error}`}
          </Text>
        </View>
      )}
      
      <ScrollView style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Test Logs:</Text>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  statusContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusTesting: {
    backgroundColor: '#e0e0e0',
  },
  statusSuccess: {
    backgroundColor: '#d4edda',
  },
  statusError: {
    backgroundColor: '#f8d7da',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 16,
  },
  logsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  logsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logText: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 5,
  },
});
