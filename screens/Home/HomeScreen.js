import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
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
  const [searchTerm, setSearchTerm] = useState("");

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
        const expiryDateString = data.expiryDate;

        let daysRemaining = 0;
        try {
          const expiryDateParts = expiryDateString.split("/");
          const expiryDate = new Date(
            parseInt(expiryDateParts[2]),
            parseInt(expiryDateParts[1]) - 1,
            parseInt(expiryDateParts[0])
          );
          const today = new Date();
          const timeDifference = expiryDate.getTime() - today.getTime();
          daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        } catch (error) {
          console.error("Erro ao processar data de validade:", error);
        }

        daysRemaining = daysRemaining >= 0 ? daysRemaining : 0;

        return {
          id: doc.id,
          name: data.name,
          image: data.image,
          quantity: data.quantity,
          expiryDate: data.expiryDate,
          daysRemaining: daysRemaining,
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
    fetchProducts();
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.emailText}>Bem-vindo, {userDisplayName}</Text>
      <Text style={styles.heading}>Sua Des-pensa</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Pesquisar produto..."
          placeholderTextColor="#A9A9A9"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.spinner}
        />
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
              <Text style={styles.quantityText}>{product.quantity}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.expiryText}>
                {product.daysRemaining > 7
                  ? `${product.daysRemaining} dia(s) restante(s)`
                  : "Expirado"}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(product)}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>
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
