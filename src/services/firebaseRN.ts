import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Initialize Firebase with React Native Firebase SDK
 * This function ensures proper initialization of Firebase in React Native
 * with special handling for Hermes JavaScript engine
 */
export const initializeFirebase = async (): Promise<void> => {
  try {
    if (firebase.apps.length === 0) {
      console.log('Initializing Firebase with React Native Firebase SDK');
      
      await AsyncStorage.setItem('firebase_persistence', 'LOCAL');
      
      console.log('Firebase initialized successfully with React Native Firebase SDK');
    } else {
      console.log('Firebase already initialized');
    }
  } catch (error: any) {
    console.error('Error initializing Firebase:', error.message);
    throw error;
  }
};

/**
 * Sign in anonymously with Firebase Authentication
 * @returns Promise<FirebaseAuthTypes.User> The authenticated user
 */
export const signInAnonymous = async (): Promise<FirebaseAuthTypes.User> => {
  try {
    const result = await auth().signInAnonymously();
    console.log('Anonymous auth successful:', result.user.uid);
    return result.user;
  } catch (error: any) {
    console.error('Anonymous auth error:', error.message);
    throw error;
  }
};

/**
 * Get the current authenticated user
 * @returns FirebaseAuthTypes.User | null The current user or null if not authenticated
 */
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return auth().currentUser;
};

/**
 * Sign out the current user
 * @returns Promise<void>
 */
export const signOut = async (): Promise<void> => {
  try {
    await auth().signOut();
    console.log('User signed out successfully');
  } catch (error: any) {
    console.error('Sign out error:', error.message);
    throw error;
  }
};

/**
 * Listen for authentication state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
): (() => void) => {
  return auth().onAuthStateChanged(callback);
};
