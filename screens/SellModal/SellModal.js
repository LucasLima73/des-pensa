import React from "react";

import { View, Text, Modal,StyleSheet,TouchableOpacity } from "react-native";

export const SellModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Text>Modal de Venda</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
    padding: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    color: "#fff",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    marginTop: 10,
    color: "#fff",
    backgroundColor: "#f00",
    padding: 10,
    borderRadius: 5,
  },
  sellButton: {
    marginTop: 10,
    color: "#fff",
    backgroundColor: "#0f0",
    padding: 10,
    borderRadius: 5,
  },
});
