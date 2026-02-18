import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project config from https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyApFMWviXSbpXTLXWbcSOI2e5Ke-8cdWlc",
  authDomain: "fintrack-1d909.firebaseapp.com",
  projectId:  "fintrack-1d909",
  storageBucket: "fintrack-1d909.firebasestorage.app",
  messagingSenderId: "127974868182",
  appId: "1:127974868182:web:bcaec69bcc016356e7f577",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
