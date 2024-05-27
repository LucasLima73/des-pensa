import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import {
  getDoc,
  doc,
  updateDoc,
  getFirestore,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { SellModal } from "../SellModal/SellModal";

const EditModal = ({ isVisible, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [temporaryExpiryDate, setTemporaryExpiryDate] = useState("");
  const [image, setImage] = useState("");
  const [userName, setUserName] = useState("");
  const [isSellModalVisible, setIsSellModalVisible] = useState(false);
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchProduct = async () => {
      const firestore = getFirestore();
      const productRef = doc(firestore, `users/${user.uid}/foods/${productId}`);
      const productDoc = await getDoc(productRef);
      if (productDoc.exists()) {
        const data = productDoc.data();
        setProduct(data);
        setName(data.name);
        setQuantity(data.quantity.toString());
        setExpiryDate(data.expiryDate);
        setTemporaryExpiryDate(data.expiryDate);
        setImage(data.image);
      }
    };

    if (isVisible && productId) {
      fetchProduct();
    }
  }, [isVisible, productId]);

  const handleSave = async () => {
    const firestore = getFirestore();
    const productRef = doc(firestore, `users/${user.uid}/foods/${productId}`);

    await updateDoc(productRef, {
      name,
      quantity: parseInt(quantity),
      expiryDate: temporaryExpiryDate,
      image,
    });
    onClose();
  };

  const handleDelete = async () => {
    const firestore = getFirestore();
    const productRef = doc(firestore, `users/${user.uid}/foods/${productId}`);

    await deleteDoc(productRef);
    onClose();
  };

  const handleSell = async () => {
    setIsSellModalVisible(true);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {product && (
            <>
              <Image source={{ uri: product.image }} style={styles.image} />
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Quantidade"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Data de Vencimento"
                value={temporaryExpiryDate}
                onChangeText={(text) => setTemporaryExpiryDate(text)}
              />
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sellButton} onPress={handleSell}>
                <Text style={styles.sellButtonText}>Vender Produto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Apagar Produto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </>
          )}
          <SellModal
            isVisible={isSellModalVisible}
            onClose={() => setIsSellModalVisible(false)}
            productName={name}
            productQuantity={quantity}
            productId={productId}
            expiryDate={temporaryExpiryDate}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#841584",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sellButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  sellButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditModal;
