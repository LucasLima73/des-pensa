import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "./styles"; // Importe os estilos

export default function Register() {
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [expiryDateError, setExpiryDateError] = useState(false);
  const [quantityError, setQuantityError] = useState(false);

  const handleRegister = () => {
    if (!name || !expiryDate || !quantity) {
      // Se algum dos campos estiver vazio, marque-os como erro
      if (!name) setNameError(true);
      if (!expiryDate) setExpiryDateError(true);
      if (!quantity) setQuantityError(true);
      
      Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
      return;
    }

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
          Keyboard.dismiss(); // Fecha o teclado após a adição do item
          Alert.alert("Sucesso", "Produto adicionado com sucesso em sua despensa!");
        })
        .catch((error) => {
          console.error("Erro ao adicionar item de comida: ", error);
          Alert.alert("Erro", "Falha ao adicionar item de comida. Tente novamente mais tarde.");
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
    setExpiryDateError(false); // Resetar o erro quando o usuário começar a digitar novamente
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TextInput
          style={[styles.input, nameError && styles.errorInput]} // Aplicar estilo de erro se houver erro
          placeholder="Nome do produto"
          placeholderTextColor="#A9A9A9" // Defina a cor do texto do placeholder
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError(false); // Resetar o erro quando o usuário começar a digitar novamente
          }}
        />
        <TextInput
          style={[styles.input, expiryDateError && styles.errorInput]} // Aplicar estilo de erro se houver erro
          placeholder="Data de validade (DD/MM/AAAA)"
          placeholderTextColor="#A9A9A9" // Defina a cor do texto do placeholder
          value={expiryDate}
          onChangeText={handleExpiryDateChange}
          keyboardType="numeric"
          maxLength={10}
        />
        <TextInput
          style={[styles.input, quantityError && styles.errorInput]} // Aplicar estilo de erro se houver erro
          placeholder="Quantidade"
          placeholderTextColor="#A9A9A9" // Defina a cor do texto do placeholder
          value={quantity}
          onChangeText={(text) => {
            setQuantity(text);
            setQuantityError(false); // Resetar o erro quando o usuário começar a digitar novamente
          }}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#841584" />
          ) : (
            <Button
              title="Adicionar produto"
              onPress={handleRegister}
              color="#841584"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
