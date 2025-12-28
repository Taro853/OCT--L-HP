import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLeYuQEoAkACjAUtl7Yl2to7EPbNmCwi0",
  authDomain: "oct-hp.firebaseapp.com",
  projectId: "oct-hp",
  storageBucket: "oct-hp.firebasestorage.app",
  messagingSenderId: "311607769750",
  appId: "1:311607769750:web:10860ce0a04e2c061060b7",
  measurementId: "G-DEXS3BBN5W"
};

let app;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  // Initialize Firestore (Database)
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization failed. The app will run in mock mode.", error);
  // Ensure db is null so the app falls back to initial constants
  db = null;
  app = null;
}

export { db, app };
