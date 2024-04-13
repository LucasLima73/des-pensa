import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../config/AuthProvider";
import { loginUser } from "../../config/firebase";

const SignIn = ({ navigation }: { navigation: any }) => {
 // const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
      const userData = await loginUser(email, password);
     // login(email, password);
      navigation.replace("Tabs");
  };

  const navigateToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
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
      <Button title="Entrar" onPress={handleSignIn} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.signUpLink} onPress={navigateToSignUp}>
        <Text style={styles.signUpLinkText}>
          Não tem uma conta? Cadastre-se aqui
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
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
  signUpLink: {
    marginTop: 20,
  },
  signUpLinkText: {
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default SignIn;
