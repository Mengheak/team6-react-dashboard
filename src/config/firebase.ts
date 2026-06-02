import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


//firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initializes your Firebase app instance using the provided configuration.
// This sets up the connection between your project and Firebase services.
const app = initializeApp(firebaseConfig);

// Gets the Firebase Authentication service tied to your app.
// Used for handling user sign-in, sign-out, and authentication flows.
export const auth = getAuth(app);

// Gets the Firebase Realtime Database service tied to your app.
// Allows you to read and write data in real-time across clients.
export const database = getDatabase(app);
