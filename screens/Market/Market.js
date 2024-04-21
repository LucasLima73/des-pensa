import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export function Market() {
  const [sellItems, setSellItems] = useState([]);
  const user = getAuth().currentUser;

  useEffect(() => {
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
    };

    fetchSellItems();
  }, [user.uid]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sellItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.nameSold}</Text>
          <Text style={styles.itemText}>Quantidade: {item.quantitySold}</Text>
          <Text style={styles.itemText}>Vendido por: {item.soldBy}</Text>
          <Text style={styles.itemText}>
            Data de Vencimento: {item.expiryDateSold}
          </Text>
        </View>
      ))}
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
});
