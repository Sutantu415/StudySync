import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBqCzIDnR_pKyiFzFS7iSis4l7qjCBMF0A",
    authDomain: "studysync-4a5fd.firebaseapp.com",
    projectId: "studysync-4a5fd",
    storageBucket: "studysync-4a5fd.firebasestorage.app",
    messagingSenderId: "601682688166",
    appId: "1:601682688166:web:e81f351cd24a89da7c9c67",
    measurementId: "G-PMCM1QRY2N"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app); // Authentication
export const db = getFirestore(app); // Firestore database

// Export the Firebase app
export default app;