import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { signOut, getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import styles from "./styles";

import { auth } from "../../config";
//import { EditModal } from "./EditModal"; // Você precisará importar o componente EditModal se ele estiver em um arquivo separado

export const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const user = getAuth().currentUser;
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Corrigi a inicialização do estado aqui
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    if (user) {
      const firestore = getFirestore(); // Corrigi o nome da função aqui
      const querySnapshot = await getDocs(
        collection(firestore, `users/${user.uid}/foods`)
      );
      const productsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const expiryDate = new Date(data.expiryDate);
        return {
          id: doc.id,
          name: data.name,
          image: data.image,
          quantity: data.quantity,
          expiryDate: expiryDate,
        };
      });
      setProducts(productsData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchProducts();
    });

    return unsubscribe;
  }, [navigation]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {user && (
        <Text style={styles.emailText}>Bem-vindo, {user.displayName}</Text>
      )}
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
                <Text style={styles.expiryText}>
                  {product.expiryDate.toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
