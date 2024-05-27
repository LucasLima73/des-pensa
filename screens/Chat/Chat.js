import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { auth } from "../../config/firebase";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { chatId } = route.params;
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chats", chatId, "messages"), orderBy("createdAt")),
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: firebaseData.text,
            createdAt: new Date(firebaseData.createdAt), // Convertendo o número para uma data
            user: {
              _id: firebaseData.user._id,
              name: firebaseData.user.name,
            },
          };
          return data;
        });

        setMessages(newMessages);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  const onSend = async (newMessages = []) => {
    const messageData = newMessages.map((message) => ({
      ...message,
      createdAt: message.createdAt.getTime(), // Convertendo a data para um número
      user: {
        _id: user.uid, // Usando o ID do usuário atual
        name: user.displayName, // Usando o nome do usuário atual
      },
    }));

    try {
      // Adicionando as novas mensagens ao banco de dados
      await Promise.all(
        messageData.map(async (message) => {
          await addDoc(collection(db, "chats", chatId, "messages"), message);
        })
      );
    } catch (error) {
      console.error("Erro ao enviar mensagens:", error);
    }
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user.uid,
          name: user.displayName,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
