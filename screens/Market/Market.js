import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getFirestore, query, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export function Market({ navigation }) {
  const [sellItems, setSellItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.spinner}
        />
      ) : (
        sellItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.nameSold}</Text>
            <Text style={styles.itemText}>Quantidade: {item.quantitySold}</Text>
            <Text style={styles.itemText}>Vendido por: {item.soldBy}</Text>
            <Text style={styles.itemText}>
              Data de Vencimento: {item.expiryDateSold}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "80%",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  spinner: {
    marginTop: 20,
  },
});
