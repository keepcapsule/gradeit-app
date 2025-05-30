import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUJDlca208m2iPm9kR4uOFWsGC9I124T8",
  authDomain: "gradeit-70083.firebaseapp.com",
  projectId: "gradeit-70083",
  storageBucket: "gradeit-70083.firebasestorage.app",
  messagingSenderId: "662330018140",
  appId: "1:662330018140:web:3f44d3cc666f4d9ad55999",
  measurementId: "G-EKD3BDNCHS"
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };