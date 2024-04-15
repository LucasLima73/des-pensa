import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Adicionando AsyncStorage
import dotenv from "dotenv";

dotenv.config();

// Inicializando o aplicativo Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

// Função para cadastro de usuário
const signUpUser = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Salvar o nome no banco de dados
    await addDoc(collection(db, "users"), {
      name: name,
      email: email,
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Função para login de usuário
const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Exportando as funções e referências necessárias
export { auth, db, signUpUser, loginUser, collection };
