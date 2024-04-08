import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { signUpUser } from "../../config/firebase"; // Importe a função signUpUser

const SignUp = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<any>("");

  const handleSignUp = async () => {
    try {
      await signUpUser(email, password); // Chame a função signUpUser
      navigation.replace("Tabs");
    } catch (error) {
      setError(error.message);
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Criar conta" onPress={handleSignUp} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.signInLink} onPress={navigateToSignIn}>
        <Text style={styles.signInLinkText}>Já tem uma conta? Entre aqui</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#333333",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  signInLink: {
    marginTop: 20,
  },
  signInLinkText: {
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default SignUp;
