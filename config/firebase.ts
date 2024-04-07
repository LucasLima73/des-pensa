import firebase from "firebase/app";
import "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNF38ZXGnIEieN7pJP9PPHBQc0YlqlNiI",
  authDomain: "des-pensa-1d38e.firebaseapp.com",
  projectId: "des-pensa-1d38e",
  storageBucket: "des-pensa-1d38e.appspot.com",
  messagingSenderId: "839232965368",
  appId: "1:839232965368:web:84c5689df4ad0a861a890d",
};

initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth();
const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};
export { auth, db, signUpUser, loginUser };
