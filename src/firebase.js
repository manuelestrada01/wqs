import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1n7I4GuH4gXK7rbfAigJkDNPrR06L4hs",
  authDomain: "wqs-aberturas.firebaseapp.com",
  projectId: "wqs-aberturas",
  storageBucket: "wqs-aberturas.firebasestorage.app",
  messagingSenderId: "465405622568",
  appId: "1:465405622568:web:ed9f374cedbca54464781d",
  measurementId: "G-GLLFCS9PM2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
