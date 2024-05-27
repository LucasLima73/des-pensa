import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "../../config/firebase";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();
  const user = getAuth().currentUser;
  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Dados dos chats:", chatData);
      setChats(chatData);
    });

    return () => unsubscribe();
  }, []);

  const handleChatPress = (chat) => {
    navigation.navigate("Chats", { chatId: chat.id });
  };

  return (
    <View style={styles.container}>
      {chats.map((chat, index) => (
        <TouchableOpacity
          key={index}
          style={styles.chatItem}
          onPress={() => handleChatPress(chat)}
        >
          <Text style={styles.userName}>
            {`Você comprou ${chat.product}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  userName: {
    fontSize: 18,
  },
});
