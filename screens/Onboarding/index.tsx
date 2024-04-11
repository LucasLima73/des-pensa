import React, { useEffect } from "react";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "react-native-onboarding-swiper";

const Simple = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const checkOnboarding = async () => {
      const onboardingSeen = await AsyncStorage.getItem("onboardingSeen");
      if (onboardingSeen) {
        navigation.replace("Login");
      }
    };
    checkOnboarding();
  }, []);

  const handleDone = async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
    navigation.replace("Login");
  };

  return (
    <Onboarding
      skipLabel="Pular" // Altera o texto do botão "Skip"
      nextLabel="Próximo"
      onDone={handleDone}
      pages={[
        {
          backgroundColor: "#E3BE8A",
          image: <Image source={require("../../assets/1.jpeg")} />,
          title: "Bem vindo",
          subtitle: "Nosso projeto visa a ODS 7",
        },
        {
          backgroundColor: "#ADD9E6",
          image: <Image source={require("../../assets/2.jpeg")} />,
          title: "EC8",
          subtitle: "Projeto interediciplinar.",
        },
        {
          backgroundColor: "#F7A155",
          image: <Image source={require("../../assets/3.jpeg")} />,
          title: "EC8",
          subtitle: "DES-PENSA",
        },
      ]}
    />
  );
};

export default Simple;
