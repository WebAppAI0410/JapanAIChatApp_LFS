import { Platform } from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Firebase React Native SDK initialization
export const initializeFirebase = async () => {
  try {
    // Check if Firebase is already initialized
    if (firebase.apps.length === 0) {
      console.log('Initializing Firebase for React Native');
      
      // Firebase is initialized in the native layer (MainApplication.kt)
      console.log(`Firebase initialized successfully on ${Platform.OS}`);
    } else {
      console.log('Firebase already initialized with', firebase.apps.length, 'apps');
    }
    
    return firebase.app();
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Test Firebase initialization
export const testFirebaseAuth = async () => {
  try {
    const authInstance = auth();
    
    // Test anonymous sign in
    const userCredential = await authInstance.signInAnonymously();
    console.log('Anonymous auth successful:', userCredential.user.uid);
    return true;
  } catch (error) {
    console.error('Firebase auth test failed:', error);
    return false;
  }
};
