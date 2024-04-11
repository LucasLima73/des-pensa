import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./config/AuthProvider"
import OnboardingScreen from "./screens/Onboarding";
import Login from "./screens/Login/SignIn";
import SignUp from "./screens/Login/SignUp";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "./screens/Main";
import Register from "./screens/Register";
import Market from "./screens/Market";
import Profile from "./screens/Profile";
import { Ionicons } from "@expo/vector-icons"; // Importe os ícones que você deseja usar
const Stack = createNativeStackNavigator();

function Tabs() {
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator>
      <Tabs.Screen
        name="Home"
        component={MainScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Adicionar"
        component={Register}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Market"
        component={Market}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Onboarding">
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
