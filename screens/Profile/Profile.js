import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, TextInput, Button } from "react-native";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";

const EditProfileModal = ({ isVisible, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");

  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
      setLocation(user.location || "");
    }
  }, [isVisible, user]);

  const handleSave = async () => {
    try {
      if (name !== user.displayName) {
        await user.updateProfile({
          displayName: name,
        });
      }

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      if (password) {
        await updatePassword(user, password);
      }

      // Atualizar outras informações de perfil, como localização, se necessário

      onClose();
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Localização"
          value={location}
          onChangeText={setLocation}
        />
        <Button title="Salvar" onPress={handleSave} />
        <Button title="Fechar" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default EditProfileModal;
