import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importe o ícone do Ionicons

export const SellModal = ({ isVisible, onClose, currentQuantity, productName, productQuantity }) => {
  const [productValue, setProductValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const taxRate = 0.05; // Taxa de 5%
  const [finalValue, setFinalValue] = useState("");
  const [currentRemainingQuantity, setCurrentRemainingQuantity] = useState(currentQuantity);

  const handleCalculateFinalValue = () => {
    if (parseFloat(productValue) && parseFloat(quantity)) {
      const totalProductValue = parseFloat(productValue) * parseFloat(quantity);
      const finalPrice = totalProductValue * (1 + taxRate);
      setFinalValue(finalPrice.toFixed(2));
      setError("");
    } else {
      setFinalValue("");
      setError("Por favor, insira um valor válido para o produto e a quantidade.");
    }
    Keyboard.dismiss(); // Fecha o teclado
  };

  const handleQuantityChange = (text) => {
    const newQuantity = text.trim() === "" ? "" : parseInt(text);
    if (text.trim() === "" || (newQuantity !== 0 && !isNaN(newQuantity) && newQuantity <= productQuantity && newQuantity > 0)) {
      const remainingQuantity = text.trim() === "" ? currentRemainingQuantity : productQuantity - newQuantity;
      setCurrentRemainingQuantity(remainingQuantity);
      setQuantity(text);
      setError("");
    } else if (newQuantity === 0) {
      setError("Quantidade inválida. Por favor, insira um valor maior que zero.");
    } else {
      setError("A quantidade inserida é inválida. Por favor, insira um valor até " + productQuantity + ".");
    }
  };

  const handlePublishSale = () => {
    // Implemente a lógica para publicar a venda
    console.log("Venda publicada!");
    // Aqui você pode adicionar a lógica para publicar a venda, como enviar os dados para um servidor, por exemplo.
  };

  const handleModalClose = () => {
    // Limpar os campos quando o modal for fechado
    setProductValue("");
    setQuantity("");
    setError("");
    setFinalValue("");
    setCurrentRemainingQuantity(currentQuantity);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleModalClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Adicionar Valor da Venda</Text>
              <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
                <Ionicons name="close-circle-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={styles.currentQuantityText}>
              Nome do Produto: {productName}
            </Text>
            <Text style={styles.productQuantityText}>
              Quantidade do Produto: {productQuantity}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Preço do Produto (R$)"
              placeholderTextColor="#A9A9A9"
              keyboardType="numeric"
              value={productValue}
              onChangeText={(text) => setProductValue(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              placeholderTextColor="#A9A9A9"
              keyboardType="numeric"
              value={quantity}
              onChangeText={(text) => handleQuantityChange(text)}
            />
            {error !== "" && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            <View style={styles.taxContainer}>
              <Text style={styles.taxText}>Taxa: {taxRate * 100}% sobre o produto</Text>
            </View>
            <TouchableOpacity onPress={handleCalculateFinalValue}>
              <Text style={styles.calculateButton}>Calcular</Text>
            </TouchableOpacity>
            {finalValue !== "" && (
              <>
                <Text style={styles.finalValueText}>
                  Valor Final: R${finalValue}
                </Text>
                <TouchableOpacity onPress={handlePublishSale}>
                  <Text style={styles.publishButton}>Publicar Venda</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  innerContainer: {
    backgroundColor: "#ffff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "#000",
  },
  currentQuantityText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#A9A9A9",
  },
  productNameText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#A9A9A9",
  },
  productQuantityText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#A9A9A9",
  },
  taxContainer: {
    width: "100%",
    marginBottom: 10,
  },
  taxText: {
    textAlign: "center",
    color: "#A9A9A9",
  },
  calculateButton: {
    marginTop: 10,
    color: "#fff",
    backgroundColor: "#0f0",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  finalValueText: {
    marginTop: 20,
    fontSize: 16,
  },
  publishButton: {
    marginTop: 10,
    color: "#fff",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 10,
  },
});

export default SellModal;
