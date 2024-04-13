import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Button,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../config/AuthProvider";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { launchCameraAsync, MediaTypeOptions } from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker/build/ImagePicker.types";

const ProductItem = ({
  product,
  onEdit,
}: {
  product: {
    id: string;
    name: string;
    image: string;
    expiryDate: Date;
    quantity: number;
  };
  onEdit: (product: any) => void;
}) => {
  const calculateDaysUntilExpiry = (expiryDate: Date) => {
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
    <TouchableOpacity onPress={() => onEdit(product)}>
      <View style={itemStyle}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <Text style={styles.quantityText}>{product.quantity}</Text>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.expiryText}>
          {daysUntilExpiry} dias até o vencimento
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MainScreen = ({ navigation }: { navigation: any }) => {
  const user = getAuth().currentUser;
  const [products, setProducts] = useState<
    {
      id: string;
      name: string;
      image: string;
      expiryDate: Date;
      quantity: number;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    if (user) {
      const firestore = getFirestore();
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

  const handleEdit = (product: React.SetStateAction<null>) => {
    setEditingProduct(product);
    setIsEditModalVisible(true);
  };

  const handleCameraLaunch = async () => {
    const result: ImagePickerResult = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      // Implementar lógica para salvar a imagem e atualizar o estado do produto
    } else {
      console.log("A câmera foi cancelada ou não foi concedida permissão");
    }
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
            <ProductItem
              key={product.id}
              product={product}
              onEdit={handleEdit}
            />
          ))}
        </ScrollView>
      )}
      <Modal visible={isEditModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Editando Produto</Text>
          {/* Formulário de edição aqui */}
          <Button title="Abrir Câmera" onPress={handleCameraLaunch} />
          <Button title="Fechar" onPress={() => setIsEditModalVisible(false)} />
        </View>
      </Modal>
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
    position: "relative",
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
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
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    position: "relative",
    top: -30,
    left: 35,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    borderRadius: 50,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainScreen;
