// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBexIgJ5Ih1psxKlcEZ6m6Zavsxqzc0a84',
  authDomain: 'thunderteam-99849.firebaseapp.com',
  projectId: 'thunderteam-99849',
  storageBucket: 'thunderteam-99849.appspot.com',
  messagingSenderId: '97084125410',
  appId: '1:97084125410:web:c06c2cafc47d26cf31eebb',
  databaseURL: 'https://thunderteam-99849-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);

export const storage = getStorage(app);

