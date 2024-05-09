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
            <Button title="Salvar" onPress={handleSave} />
            <TouchableOpacity onPress={handleSell}>
              <Text style={styles.sellButton}>Vender Produto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.deleteButton}>Apagar Produto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Fechar</Text>
            </TouchableOpacity>
          </>
        )}
        <SellModal
          isVisible={isSellModalVisible}
          onClose={() => setIsSellModalVisible(false)}
          productName={name}
          productQuantity={quantity}
          productId={productId}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    color: "#fff",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    marginTop: 10,
    color: "#fff",
    backgroundColor: "#f00",
    padding: 10,
    borderRadius: 5,
  },
  sellButton: {
    marginTop: 10,
    color: "#fff",
    backgroundColor: "#0f0",
    padding: 10,
    borderRadius: 5,
  },
});

export default EditModal;
