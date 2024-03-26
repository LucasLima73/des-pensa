import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const MainScreen = ({ navigation }: { navigation: any }) => {
  const handleLogout = () => {
    // Lógica para fazer logout do usuário
    // Por exemplo, navegar de volta para a tela de login
    navigation.navigate("Tabs");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Tela Principal</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default MainScreen;
