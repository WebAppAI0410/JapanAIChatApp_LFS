import { Platform } from 'react-native';

// Firebase React Native SDK initialization
export const initializeFirebase = async () => {
  try {
    // Dynamic import to ensure Firebase modules are loaded after Hermes is ready
    const { initializeApp } = await import('@react-native-firebase/app');
    const { getAuth } = await import('@react-native-firebase/auth');
    
    // Check if Firebase is already initialized
    const apps = initializeApp().apps;
    if (apps.length === 0) {
      console.log('Initializing Firebase for React Native');
      
      // Firebase is initialized in the native layer (MainApplication.kt)
      // This just ensures the JS side is properly connected
      const app = initializeApp();
      const auth = getAuth(app);
      
      console.log(`Firebase initialized successfully on ${Platform.OS} with auth:`, !!auth);
      return app;
    } else {
      console.log('Firebase already initialized');
      return apps[0];
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Test Firebase initialization
export const testFirebaseAuth = async () => {
  try {
    const { getAuth } = await import('@react-native-firebase/auth');
    const auth = getAuth();
    
    // Test anonymous sign in
    const userCredential = await auth().signInAnonymously();
    console.log('Anonymous auth successful:', userCredential.user.uid);
    return true;
  } catch (error) {
    console.error('Firebase auth test failed:', error);
    return false;
  }
};
