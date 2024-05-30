import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const SellModal = ({
  isVisible,
  onClose,
  currentQuantity,
  productName,
  productQuantity,
  expiryDate,
  foodId,
  image, // Recebe foodId como propriedade
}) => {
  const [productValue, setProductValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const taxRate = 0.05;
  const [finalValue, setFinalValue] = useState("");
  const [currentRemainingQuantity, setCurrentRemainingQuantity] =
    useState(currentQuantity);
  const [bairros, setBairros] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const firestore = getFirestore();
        const userRef = doc(firestore, "users", user.uid);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
          const userDataObj = userData.data();
          setBairros(userDataObj.bairro);
        } else {
          console.log("Dados do usuário não encontrados.");
        }
      } else {
        console.log("Usuário não autenticado.");
      }
    };

    fetchUserData();
  }, []);

  const handleCalculateFinalValue = () => {
    if (parseFloat(productValue) && parseFloat(quantity)) {
      const totalProductValue = parseFloat(productValue) * parseFloat(quantity);
      const finalPrice = totalProductValue * (1 + taxRate); // Aplica a taxa sobre o valor total
      setFinalValue(finalPrice.toFixed(2));
      setError("");
    } else {
      setFinalValue("");
      setError(
        "Por favor, insira um valor válido para o produto e a quantidade."
      );
    }
    Keyboard.dismiss();
  };

  const handleQuantityChange = (text) => {
    const newQuantity = text.trim() === "" ? "" : parseInt(text);
    if (
      text.trim() === "" ||
      (newQuantity !== 0 &&
        !isNaN(newQuantity) &&
        newQuantity <= productQuantity &&
        newQuantity > 0)
    ) {
      const remainingQuantity =
        text.trim() === ""
          ? currentRemainingQuantity
          : productQuantity - newQuantity;
      setCurrentRemainingQuantity(remainingQuantity);
      setQuantity(text);
      setError("");
    } else if (newQuantity === 0) {
      setError(
        "Quantidade inválida. Por favor, insira um valor maior que zero."
      );
    } else {
      setError(
        "A quantidade inserida é inválida. Por favor, insira um valor até " +
          productQuantity +
          "."
      );
    }
  };

  const handlePublishSale = async () => {
    if (finalValue === "" || quantity === "" || productValue === "") {
      setError(
        "Por favor, preencha todos os campos e calcule o valor final antes de publicar a venda."
      );
      return;
    }

    const firestore = getFirestore();
    const sellRef = collection(firestore, "sell");
    const user = getAuth().currentUser;

    if (!user) {
      setError(
        "Usuário não autenticado. Por favor, faça login e tente novamente."
      );
      return;
    }

    const foodRef = doc(firestore, `users/${user.uid}/foods`, foodId); // Use foodId passado como propriedade

    try {
      await updateDoc(foodRef, {
        sell: true,
      });
      console.log("Documento foods atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o documento foods:", error);
    }

    const saleData = {
      sell: true,
      productName,
      productValue: parseFloat(productValue),
      quantity: parseInt(quantity),
      finalValue: parseFloat(finalValue),
      userId: user.uid,
      expiryDate,
      bairros,
      timestamp: new Date(),
      image,
    };

    console.log("Dados da venda a serem adicionados:", saleData);

    try {
      const sellDocRef = doc(firestore, "sell", foodId);
      await setDoc(sellDocRef, saleData); // Use setDoc em vez de addDoc para definir o documento com o mesmo ID
      console.log("Venda publicada com sucesso!");
      handleModalClose();

      // Exibir toast para Android
      ToastAndroid.show("Venda publicada com sucesso!", ToastAndroid.SHORT);

      // Exibir alerta para iOS
      Alert.alert("Venda publicada com sucesso!");
    } catch (error) {
      console.error("Erro ao publicar a venda: ", error);
      setError("Erro ao publicar a venda. Tente novamente.");
    }
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
              <TouchableOpacity
                onPress={handleModalClose}
                style={styles.closeButton}
              >
                <Ionicons name="close-circle-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={styles.currentQuantityText}>
              Nome do Produto: {productName}
            </Text>
            <Text style={styles.productQuantityText}>
              Quantidade do Produto: {productQuantity}
            </Text>
            <Text style={styles.expiryDateText}>
              Data de Validade: {expiryDate}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Preço do Produto
              (R$)"
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
            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.taxContainer}>
              <Text style={styles.taxText}>
                Taxa: {taxRate * 100}% sobre o produto
              </Text>
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
  expiryDateText: {
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
