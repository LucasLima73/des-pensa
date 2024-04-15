import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { signUpUser } from "../../config/firebase";
import styles from "./styles";

const SignUp = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<any>("");

  const handleSignUp = async () => {
      await signUpUser(email, password,name);
      navigation.replace("Tabs");
  };

  const navigateToSignIn = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
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

export default SignUp;
