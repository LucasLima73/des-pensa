import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./screens/Onboarding";
import Login from "./screens/Login/SignIn";
import SignUp from "./screens/Login/SignUp";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "./screens/Main";

const Stack = createNativeStackNavigator();

function Tabs() {
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator>
    <Tabs.Screen name="Main" component={MainScreen}  options={{ headerShown: false }}/>
    <Tabs.Screen name="Mains" component={SignUp}  options={{ headerShown: false }}/>
    <Tabs.Screen name="Mainss" component={MainScreen}  options={{ headerShown: false }}/>
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" >
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUp}  options={{ headerShown: false }}/>
        <Stack.Screen name="Tabs" component={Tabs}  options={{ headerShown: false }}/>
        </Stack.Navigator>
      
      
    </NavigationContainer>
  );
}
