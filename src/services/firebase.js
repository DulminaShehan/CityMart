// CityMart - Firebase Central Configuration & Initialization Module
// Configured from official google-services.json for project: citymart-69b52

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "citymart-69b52.firebaseapp.com",
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "https://citymart-69b52-default-rtdb.firebaseio.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "citymart-69b52",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "citymart-69b52.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "997601669962",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:997601669962:android:c6f16c79614df49ca7c7b3",
};

// Direct REST API base URLs for ultra-reliable cross-platform mobile connectivity
export const FIREBASE_AUTH_BASE = "https://identitytoolkit.googleapis.com/v1";
export const FIREBASE_RTDB_BASE = firebaseConfig.databaseURL;
export const FIREBASE_STORAGE_BASE = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o`;

/**
 * Validates connection to Firebase Realtime Database
 */
export async function testFirebaseConnection() {
  try {
    const res = await fetch(`${FIREBASE_RTDB_BASE}/.json?shallow=true`);
    return {
      connected: res.status === 200,
      status: res.status,
      message: res.status === 200 ? 'Realtime Database connected successfully' : `HTTP ${res.status}`,
    };
  } catch (error) {
    return {
      connected: false,
      message: error.message,
    };
  }
}

export default firebaseConfig;
