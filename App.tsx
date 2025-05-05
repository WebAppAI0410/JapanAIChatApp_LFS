import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation';
import { FirebaseRNInitializer } from './src/services/FirebaseRNInitializer';
import { FirebaseInitVerification } from './src/tests/FirebaseInitVerification';

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [showTest, setShowTest] = useState(false);

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FirebaseRNInitializer>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.rootView}>
          {showTest ? (
            <View style={styles.testContainer}>
              <FirebaseInitVerification />
              <Button title="Back to App" onPress={() => setShowTest(false)} />
            </View>
          ) : (
            <>
              <Navigation />
              <View style={styles.testButtons}>
                <Button title="Test Firebase" onPress={() => setShowTest(true)} />
              </View>
              <StatusBar style="auto" />
            </>
          )}
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </FirebaseRNInitializer>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  testContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  testButtons: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
