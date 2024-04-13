import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native"; // Importando Button
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // Start with empty string
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    const user = getAuth().currentUser;
    if (user) {
      setLoading(true);
      const firestore = getFirestore();
      const foodCollection = collection(firestore, `users/${user.uid}/foods`);

      // Convert formatted expiryDate to a valid Date object before saving
      const formattedDate = convertFormattedToDate(expiryDate);
      if (!formattedDate) {
        console.warn(
          "Formato de data de validade inválido. Use o formato DD/MM/YYYY."
        );
        setLoading(false); // Stop loading if date is invalid
        return;
      }

      addDoc(foodCollection, {
        name: name,
        expiryDate: formattedDate, // Use converted Date object
        quantity: quantity,
        image:
          "https://img.freepik.com/vetores-gratis/saco-de-papel-de-transportadora-de-supermercado-com-alimentos_1284-35997.jpg", // Image URL
      })
        .then(() => {
          console.log("Food item added!");
          setName("");
          setExpiryDate(""); // Clear expiryDate
          setQuantity("");
        })
        .catch((error) => {
          console.error("Error adding food item: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Function to convert formatted expiryDate to a valid Date object
  const convertFormattedToDate = (formattedDate: string) => {
    const parts = formattedDate.split("/");
    if (parts.length !== 3) {
      return null; // Formato inválido
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // Não subtrai 1 do mês
    const year = parseInt(parts[2], 10);

    // Formata a data como "YYYY-MM-DD"
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to handle user input with mask
  const handleExpiryDateChange = (text: string) => {
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
        onChangeText={handleExpiryDateChange} // Use custom handler
        keyboardType="numeric" // Keyboard for numbers
        maxLength={10} // Maximum input length
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
  },
});
