import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Adicionando AsyncStorage

// Inicializando o aplicativo Firebase
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
