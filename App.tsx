import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation';

const isWeb = Platform.OS === 'web';

let FirebaseRNInitializer: React.FC<{children: React.ReactNode}> = ({children}) => <>{children}</>;
let FirebaseInitVerification: React.FC = () => <Text>Firebase testing not available on web</Text>;

if (!isWeb) {
  try {
    const FirebaseImports = require('./src/services/FirebaseRNInitializer');
    const TestImports = require('./src/tests/FirebaseInitVerification');
    FirebaseRNInitializer = FirebaseImports.FirebaseRNInitializer;
    FirebaseInitVerification = TestImports.FirebaseInitVerification;
  } catch (error) {
    console.warn('Failed to import Firebase components:', error);
  }
}

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

  if (isWeb) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.rootView}>
          <View style={styles.container}>
            <Text style={styles.title}>Japan AI Chat App</Text>
            <Text style={styles.subtitle}>Web Preview Mode</Text>
            <Text style={styles.description}>
              This is a simplified web preview of the Japan AI Chat App.
              Some features like Firebase authentication and native components
              are disabled in web mode.
            </Text>
            <View style={styles.featureContainer}>
              <Text style={styles.featureTitle}>Available AI Models:</Text>
              <Text style={styles.featureItem}>• ChatGPT (OpenAI)</Text>
              <Text style={styles.featureItem}>• Claude (Anthropic)</Text>
              <Text style={styles.featureItem}>• Deepseek</Text>
              <Text style={styles.featureItem}>• Qwen3:4B (Local)</Text>
            </View>
            <StatusBar style="auto" />
          </View>
        </GestureHandlerRootView>
      </SafeAreaProvider>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6200ee',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
    maxWidth: 500,
  },
  featureContainer: {
    alignSelf: 'stretch',
    maxWidth: 500,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  featureItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
});
