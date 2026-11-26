// Firebase Configuration and Initialization Module
// Checks for valid Firebase project credentials and provides secure initialization

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || null,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || null,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || null,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || null,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || null,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || null,
};

// Validates whether live Firebase credentials have been configured
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.authDomain
  );
};

export const getFirebaseConfig = () => firebaseConfig;

export default firebaseConfig;
