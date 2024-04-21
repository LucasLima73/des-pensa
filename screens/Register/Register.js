import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "./styles"; // Importe os estilos

export default function Register() {
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    const user = getAuth().currentUser;
    if (user) {
      setLoading(true);
      const firestore = getFirestore();
      const foodCollection = collection(firestore, `users/${user.uid}/foods`);

      // Salve a data de validade como uma string formatada
      const formattedDate = expiryDate; // Não precisa converter, já está no formato desejado

      addDoc(foodCollection, {
        name: name,
        expiryDate: formattedDate, // Salve como string formatada
        quantity: quantity,
        image:
          "https://img.freepik.com/vetores-gratis/saco-de-papel-de-transportadora-de-supermercado-com-alimentos_1284-35997.jpg", // URL da imagem
      })
        .then(() => {
          console.log("Item de comida adicionado!");
          setName("");
          setExpiryDate("");
          setQuantity("");
        })
        .catch((error) => {
          console.error("Erro ao adicionar item de comida: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Função para lidar com a entrada do usuário com máscara
  const handleExpiryDateChange = (text) => {
    const formatted = text
      .replace(/\D/g, "") // Remove todos os caracteres que não são dígitos
      .replace(/(\d{2})(\d)/, "$1/$2") // Coloca uma barra depois dos primeiros dois dígitos
      .replace(/(\d{2})(\d)/, "$1/$2") // Coloca uma barra depois dos segundos dois dígitos
      .replace(/(\d{4})\d+?$/, "$1"); // Limita a entrada a 8 dígitos para o ano

    setExpiryDate(formatted);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (DD/MM/YYYY)"
        value={expiryDate}
        onChangeText={handleExpiryDateChange}
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#841584" />
        ) : (
          <Button
            title="Add Food Item"
            onPress={handleRegister}
            color="#841584"
          />
        )}
      </View>
    </View>
  );
}
