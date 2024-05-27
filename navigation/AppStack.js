import * as React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Importe os ícones que você deseja usar
import { HomeScreen } from "../screens";
import Register from "../screens/Register/Register";
import { Market } from "../screens/Market/Market";
import { Profile } from "../screens/Profile/Profile";
import { Notification } from "../screens/Notification/Notification";
import Chat from "../screens/Chat/Chat";
import ChatList from "../screens/Chat/ChatList";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const NotificationButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Ionicons name="notifications-outline" size={24} color="black" />
  </TouchableOpacity>
);

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Des-pensa"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <View style={{ marginRight: 25 }}>
              <NotificationButton
                onPress={() => navigation.navigate("Notification")}
              />
            </View>
          ),
        })}
      />
       <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Chats" component={Chat} />
      <Stack.Screen name="Chatlist" component={Chat} />
    </Stack.Navigator>
  );
};

export const AppStack = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
     
      <Tabs.Screen
        name="Mini-Mercado"
        component={Market}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),
        }}
      />
       <Tabs.Screen
        name="Adicionar"
        component={Register}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={[styles.addButton, { backgroundColor: color }]}>
              <Ionicons name="add-circle-outline" color="#fff" size={size * 1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Perfil"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Chat de vendas"
        component={ChatList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox" color={color} size={size} />
          ),
        }}
      />
      
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    top: -20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
