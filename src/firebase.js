import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCH32Und7_nOape6wfKUB8rOJnAlVQzjYA",
  authDomain: "carwash-7c481.firebaseapp.com",
  projectId: "carwash-7c481",
  storageBucket: "carwash-7c481.firebasestorage.app",
  messagingSenderId: "637258399630",
  appId: "1:637258399630:web:f9a2a84bfd7360de836edf",
  measurementId: "G-3727PCZE2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
