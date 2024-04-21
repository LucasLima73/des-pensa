import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../../config/AuthProvider";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import EditModal from "../EditModal";
import styles from "./styles";

const MainScreen = ({ navigation }: { navigation: any }) => {
  const user = getAuth().currentUser;
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    if (user) {
      const firestore = getFirestore();
      const querySnapshot = await getDocs(collection(firestore, `users/${user.uid}/foods`));
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

  const handleEdit = (product: any) => {
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
        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
      ) : (
        <ScrollView style={styles.scrollView}>
          {products.map((product) => (
            <TouchableOpacity key={product.id} onPress={() => handleEdit(product)}>
              <View style={styles.productItem}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <Text style={styles.quantityText}>{product.quantity}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.expiryText}>{product.expiryDate}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <EditModal isVisible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)} />
    </View>
  );
};

export default MainScreen;
