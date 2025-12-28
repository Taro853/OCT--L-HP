
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// ユーザー提供のFirebase構成
const firebaseConfig = {
  apiKey: "AIzaSyDLeYuQEoAkACjAUtl7Yl2to7EPbNmCwi0",
  authDomain: "oct-hp.firebaseapp.com",
  projectId: "oct-hp",
  storageBucket: "oct-hp.firebasestorage.app",
  messagingSenderId: "311607769750",
  appId: "1:311607769750:web:10860ce0a04e2c061060b7",
  measurementId: "G-DEXS3BBN5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore (Database) and export it for use in App.tsx
const db = getFirestore(app);

export { db, app, analytics };
