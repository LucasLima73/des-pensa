import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth } from "../../config";

export const Profile = () => {
  const [userData, setUserData] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bairro, setBairro] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const firestore = getFirestore();
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          setName(userSnapshot.data().name);
          setEmail(userSnapshot.data().email);
          setBairro(userSnapshot.data().bairro || ""); // Se não houver bairro, deixe como vazio
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    const firestore = getFirestore();
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(userRef, { ...userData, name, email, bairro });
      setEditing(false);
    }
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={editing}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              editable={editing}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bairro:</Text>
            <TextInput
              style={styles.input}
              value={bairro}
              onChangeText={setBairro}
              editable={editing}
            />
          </View>
          {editing ? (
            <TouchableOpacity
              onPress={handleSaveChanges}
              style={[
                styles.button,
                { backgroundColor: "#ADD8E6" },
                styles.shadow,
              ]}
            >
              <Text style={styles.buttonText}>Salvar mudanças</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={[
                styles.button,
                { backgroundColor: "#ADD8E6" },
                styles.shadow,
              ]}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleLogout}
            style={[
              styles.button,
              { backgroundColor: "#ADD8E6" },
              styles.shadow,
            ]}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    marginBottom: 5,
    color: "#333",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    width: "100%",
  },
  button: {
    width: "100%",
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default Profile;
