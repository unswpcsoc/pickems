import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClSxwusMFv2axyVT2POPEEr174mPcUqJQ",
  authDomain: "pickems-2c806.firebaseapp.com",
  projectId: "pickems-2c806",
  storageBucket: "pickems-2c806.firebasestorage.app",
  messagingSenderId: "305137214855",
  appId: "1:305137214855:web:e38d6870cd94c917f51f22",
  measurementId: "G-MH4SQ4ZCMT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
