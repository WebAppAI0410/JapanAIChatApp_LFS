import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { initializeFirebase } from './firebaseRN';

interface FirebaseRNInitializerProps {
  children: React.ReactNode;
}

/**
 * FirebaseRNInitializer - Component to initialize Firebase in React Native
 * 
 * This component handles Firebase initialization with special handling for
 * Hermes JavaScript engine. It ensures Firebase is properly initialized
 * before rendering the app content.
 */
export const FirebaseRNInitializer: React.FC<FirebaseRNInitializerProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const isHermes = typeof (global as any).HermesInternal !== 'undefined';
        console.log(`Initializing Firebase on ${Platform.OS} with Hermes: ${isHermes ? 'enabled' : 'disabled'}`);
        
        await initializeFirebase();
        
        setInitialized(true);
      } catch (err: any) {
        console.error('Firebase initialization error:', err.message);
        setError(err.message);
      }
    };

    initFirebase();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Firebase initialization error: {error}</Text>
      </View>
    );
  }

  if (!initialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Initializing Firebase...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#6200ee',
  },
  errorText: {
    fontSize: 16,
    color: '#B00020',
    textAlign: 'center',
  },
});
