import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

const ProductItem = ({ product }: { product: { id: number, name: string, image: string, expiryDate: Date } }) => {
  const calculateDaysUntilExpiry = (expiryDate: Date) => {
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const daysUntilExpiry = calculateDaysUntilExpiry(product.expiryDate);

  // Definindo estilos baseados na proximidade do vencimento
  let itemStyle = styles.productItem;
  if (daysUntilExpiry <= 3) {
    itemStyle = { ...itemStyle, borderColor: "red" }; // Adiciona uma borda vermelha para indicar proximidade do vencimento
  } else if (daysUntilExpiry <= 7) {
    itemStyle = { ...itemStyle, borderColor: "orange" }; // Adiciona uma borda laranja para indicar proximidade do vencimento
  }

  return (
    <View style={itemStyle}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.expiryText}>{daysUntilExpiry} dias até o vencimento</Text>
    </View>
  );
};

const MainScreen = ({ navigation }: { navigation: any }) => {
  const productList = [
    {
      id: 1,
      name: "Maçã",
      image: "https://www.shutterstock.com/image-photo/bunch-bananas-isolated-on-white-600nw-1722111529.jpg",
      expiryDate: new Date("2024-04-30"),
    },
    {
      id: 2,
      name: "Banana",
      image: "https://www.shutterstock.com/image-photo/bunch-bananas-isolated-on-white-600nw-1722111529.jpg",
      expiryDate: new Date("2024-04-15"),
    },
    {
      id: 3,
      name: "Laranja",
      image: "https://www.shutterstock.com/image-photo/bunch-bananas-isolated-on-white-600nw-1722111529.jpg",
      expiryDate: new Date("2024-05-05"),
    },
    // Adicione mais produtos conforme necessário
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Produtos de Mercado</Text>
      <ScrollView style={styles.scrollView}>
        {productList.map((product) => (
          <ProductItem key={product.id} product={product} />
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
    borderColor: "transparent", // Inicialmente transparente
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
});

export default MainScreen;
