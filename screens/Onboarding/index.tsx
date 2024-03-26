import { Image } from "react-native";
import React from "react";

import Onboarding from "react-native-onboarding-swiper";

const Simple = ({ navigation }: { navigation: any }) => (
  <Onboarding
    skipLabel="Pular" // Altera o texto do botão "Skip"
    nextLabel="Próximo"
    onDone={() => navigation.replace("Login")}
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
        title: "EC7",
        subtitle: "Projeto interediciplinar.",
      },
      {
        backgroundColor: "#F7A155",
        image: <Image source={require("../../assets/3.jpeg")} />,
        title: "EC7",
        subtitle: "DES-PENSA",
      },
    ]}
  />
);

export default Simple;
