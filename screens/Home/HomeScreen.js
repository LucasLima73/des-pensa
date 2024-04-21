import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { signOut, getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";
import styles from "./styles";

import { auth } from "../../config";
import EditModal from "../EditModal/EditModal";

export const HomeScreen = ({ navigation }) => {
  const [userDisplayName, setUserDisplayName] = useState("");
  const user = getAuth().currentUser;
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const fetchUserData = async () => {
    if (user) {
      const firestore = getFirestore();
      const userDoc = await getDoc(doc(firestore, `users/${user.uid}`));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDisplayName(userData.name);
      }
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    if (user) {
      const firestore = getFirestore();
      const querySnapshot = await getDocs(
        collection(firestore, `users/${user.uid}/foods`)
      );
      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          image: data.image,
          quantity: data.quantity,
          expiryDate: data.expiryDate,
        };
      });
      setProducts(productsData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProducts();
    });

    return unsubscribe;
  }, [navigation]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditProductId(product.id);
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditProductId(null);
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emailText}>Bem-vindo, {userDisplayName}</Text>
      <Text style={styles.heading}>Sua Des-pensa</Text>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.spinner}
        />
      ) : (
        <ScrollView style={styles.scrollView}>
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              onPress={() => handleEdit(product)}
            >
              <View style={styles.productItem}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                />
                <Text style={styles.quantityText}>{product.quantity}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.expiryText}>{product.expiryDate}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <EditModal
        isVisible={isEditModalVisible}
        onClose={handleCloseEditModal}
        productId={editProductId}
      />
    </View>
  );
};
