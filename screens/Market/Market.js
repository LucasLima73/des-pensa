import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native"; // Importe useNavigation
import {
  collection,
  getFirestore,
  query,
  getDocs,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";

export function Market({ navigation }) {
  const [sellItems, setSellItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sellerName, setSellerName] = useState("");
  const user = getAuth().currentUser;

  useFocusEffect(
    React.useCallback(() => {
      const fetchSellItems = async () => {
        const firestore = getFirestore();
        const sellRef = collection(firestore, `sell`);
        const sellQuery = query(sellRef);

        const sellSnapshot = await getDocs(sellQuery);
        const items = [];

        sellSnapshot.forEach((doc) => {
          items.push(doc.data());
        });

        setSellItems(items);
        setIsLoading(false);
      };

      fetchSellItems();
    }, [])
  );

  const getSellerName = async (userId) => {
    const firestore = getFirestore();
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userName = userDoc.data().name;
      console.log("Nome do usuário:", userName);
      return userName;
    } else {
      console.log("Nome não encontrado para o userId:", userId);
      return "Nome não encontrado";
    }
  };

  const handleItemPress = async (item) => {
    setSelectedItem(item);
    const name = await getSellerName(item.userId);
    setSellerName(name);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSellerName("");
  };

  // Dentro da função handleBuyProduct em Market.js

  const handleBuyProduct = async () => {
    const chatData = {
      participants: [user.uid, selectedItem.userId],
      product: selectedItem.productName,
    };

    try {
      const chatRef = await addDoc(collection(db, "chats"), chatData);
      navigation.navigate("Chats", { chatId: chatRef.id });
    } catch (error) {
      console.error("Erro ao criar chat:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#841584"
          style={styles.spinner}
        />
      ) : (
        sellItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={() => handleItemPress(item)}
          >
            <Text style={styles.itemName}>{item.productName}</Text>
            <Text style={styles.itemDetail}>Quantidade: {item.quantity}</Text>
            <Text style={styles.itemDetail}>Preço: {item.finalValue}</Text>
            <Text style={styles.itemDetail}>
              Data de Vencimento: {item.expiryDate}
            </Text>
          </TouchableOpacity>
        ))
      )}

      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalItemName}>
              {selectedItem && selectedItem.productName}
            </Text>
            <Text style={styles.modalItemDetail}>
              Quantidade: {selectedItem && selectedItem.quantity}
            </Text>
            <Text style={styles.modalItemDetail}>
              Preço: {selectedItem && selectedItem.finalValue}
            </Text>
            <Text style={styles.modalItemDetail}>
              Data de Vencimento: {selectedItem && selectedItem.expiryDate}
            </Text>
            <Text style={styles.modalItemDetail}>Vendedor: {sellerName}</Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={handleBuyProduct}
            >
              <Text style={styles.buyButtonText}>Comprar Produto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeModalButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    width: "90%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  itemDetail: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  spinner: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalItemName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalItemDetail: {
    fontSize: 18,
    marginBottom: 5,
    color: "#555",
  },
  buyButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeModalButton: {
    marginTop: 10,
    color: "#007bff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default Market; // Certifique-se de exportar o componente Market