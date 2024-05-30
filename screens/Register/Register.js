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
  ToastAndroid,
  Text,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Notifications from "expo-notifications";
import styles from "./styles"; // Import styles

export default function Register() {
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [expiryDateError, setExpiryDateError] = useState(false);
  const [quantityError, setQuantityError] = useState(false);

  const handleRegister = async () => {
    if (!name || !expiryDate || !quantity) {
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

      const formattedDate = expiryDate;

      try {
        await addDoc(foodCollection, {
          name: name,
          expiryDate: formattedDate,
          quantity: quantity,
          image:
            "https://img.freepik.com/vetores-gratis/saco-de-papel-de-transportadora-de-supermercado-com-alimentos_1284-35997.jpg",
        });
        console.log("Item de comida adicionado!");

        const now = new Date();
        const expiryDateParts = formattedDate.split("/");
        const notificationDate = new Date(
          parseInt(expiryDateParts[2]),
          parseInt(expiryDateParts[1]) - 1,
          parseInt(expiryDateParts[0])
        );
        notificationDate.setDate(notificationDate.getDate() - 7);

        if (notificationDate > now) {
          const trigger = { date: notificationDate };
          const content = {
            title: "Alerta de Validade!",
            body: `O produto "${name}" está vencendo em breve!`,
            data: { productId: name },
          };

          await Notifications.scheduleNotificationAsync({ content, trigger });
          console.log("Notificação agendada para:", notificationDate);

          ToastAndroid.showWithGravity(
            `Notificação ativada para ${name}`,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        } else {
          console.log("Notificação não agendada, pois a data é no passado.");
        }

        await logRegistrationEvent(name, user.uid);
        logEvent(analytics, "add_product", { productName: name });

        setName("");
        setExpiryDate("");
        setQuantity("");
        Keyboard.dismiss();
        Alert.alert(
          "Sucesso",
          "Produto adicionado com sucesso em sua despensa, e você será notificado 7 dias antes do seu vencimento!"
        );
      } catch (error) {
        console.error("Erro ao adicionar item de comida: ", error);
        Alert.alert(
          "Erro",
          "Falha ao adicionar item de comida. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const logRegistrationEvent = async (productName, userId) => {
    const firestore = getFirestore();
    const analyticsCollection = collection(firestore, "analytics");

    const event = {
      event: "product_registered",
      userId: userId,
      productName: productName,
      timestamp: new Date(),
    };

    try {
      await addDoc(analyticsCollection, event);
      console.log("Evento de registro de produto salvo em analytics");
    } catch (error) {
      console.error("Erro ao registrar evento de produto: ", error);
    }
  };

  const handleExpiryDateChange = (text) => {
    const formatted = text
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{4})\d+?$/, "$1");

    setExpiryDate(formatted);
    setExpiryDateError(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.instructionText}>
          Adicione aqui seus produtos e deixe que nosso app cuide de tudo para
          você
        </Text>
        <TextInput
          style={[styles.input, nameError && styles.errorInput]}
          placeholder="Nome do produto"
          placeholderTextColor="#A9A9A9"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setNameError(false);
          }}
        />
        <TextInput
          style={[styles.input, expiryDateError && styles.errorInput]}
          placeholder="Data de validade (DD/MM/AAAA)"
          placeholderTextColor="#A9A9A9"
          value={expiryDate}
          onChangeText={handleExpiryDateChange}
          keyboardType="numeric"
          maxLength={10}
        />
        <TextInput
          style={[styles.input, quantityError && styles.errorInput]}
          placeholder="Quantidade"
          placeholderTextColor="#A9A9A9"
          value={quantity}
          onChangeText={(text) => {
            setQuantity(text);
            setQuantityError(false);
          }}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#ADD8E6" />
          ) : (
            <Button
              title="Adicionar produto"
              onPress={handleRegister}
              color="#ADD8E6"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
