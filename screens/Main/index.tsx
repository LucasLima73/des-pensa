// MainScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useAuth } from "../../config/AuthProvider";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ProductItem = ({
  product,
}: {
  product: { id: string; name: string; image: string; expiryDate: string };
}) => {
  const calculateDaysUntilExpiry = (expiryDateString: string) => {
    const expiryDate = new Date(expiryDateString);
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const daysUntilExpiry = calculateDaysUntilExpiry(product.expiryDate);

  let itemStyle = styles.productItem;
  if (daysUntilExpiry <= 3) {
    itemStyle = { ...itemStyle, borderColor: "red" };
  } else if (daysUntilExpiry <= 7) {
    itemStyle = { ...itemStyle, borderColor: "orange" };
  }

  return (
    <View style={itemStyle}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.expiryText}>
        {daysUntilExpiry} dias até o vencimento
      </Text>
    </View>
  );
};

const MainScreen = ({ navigation }: { navigation: any }) => {
  const user = getAuth().currentUser;
  const [products, setProducts] = useState(
    [] as { id: string; name: string; image: string; expiryDate: string }[]
  );

  const fetchProducts = async () => {
    if (user) {
      const firestore = getFirestore();
      const querySnapshot = await getDocs(
        collection(firestore, `users/${user.uid}/foods`)
      );
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        image: doc.data().image,
        expiryDate: doc.data().expiryDate, 
      }));
      setProducts(productsData);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  return (
    <View style={styles.container}>
      {user && (
        <Text style={styles.emailText}>Bem-vindo, {user.displayName}</Text>
      )}
      <Text style={styles.heading}>Produtos de Mercado</Text>
      <ScrollView style={styles.scrollView}>
        {products.map((product) => (
          <ProductItem key={parseInt(product.id)} product={product} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollView: {
    width: "100%",
  },
  productItem: {
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expiryText: {
    fontSize: 14,
    color: "#888",
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default MainScreen;
