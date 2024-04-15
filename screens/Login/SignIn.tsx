import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../config/AuthProvider";
import { loginUser } from "../../config/firebase";
import styles from "./styles";

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

export default SignIn;
