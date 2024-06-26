import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  View,
  TextInput,
  Logo,
  Button,
  FormErrorMessage,
} from "../../components";
import { Images, Colors, auth } from "../../config";
import { useTogglePasswordVisibility } from "../../hooks";
import { signupValidationSchema } from "../../utils";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import axios from "axios"; // Make sure axios is installed

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");

  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = async (values) => {
    const { email, password, name, bairro } = values;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const firestore = getFirestore();

      // Add user data to the users collection
      const userRef = doc(firestore, `users/${user.uid}`);
      await setDoc(userRef, { name, email, bairro }, { merge: true });

      // Check if the bairro exists in the bairros collection
      const bairrosCollection = collection(firestore, "bairros");
      const q = query(bairrosCollection, where("bairro", "==", bairro));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // If bairro doesn't exist, add it
        await addDoc(bairrosCollection, { bairro });
      }

      setErrorState(""); // Clear any previous errors
    } catch (error) {
      setErrorState(error.message);
    }
  };

  const fetchNeighborhood = async (cep, setFieldValue) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { bairro } = response.data;
      setFieldValue("bairro", bairro);
    } catch (error) {
      setErrorState(
        "Erro ao buscar bairro. Verifique o CEP e tente novamente."
      );
    }
  };

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.logoContainer}>
          <Logo uri={Images.logo} />
          <Text style={styles.screenTitle}>Crie uma nova conta</Text>
        </View>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            cep: "",
            bairro: "",
          }}
          validationSchema={signupValidationSchema}
          onSubmit={(values) => handleSignup(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldValue,
          }) => (
            <>
              <TextInput
                name="name"
                leftIconName="account"
                placeholder="Nome"
                autoCapitalize="words"
                autoFocus={true}
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              <FormErrorMessage error={errors.name} visible={touched.name} />
              <TextInput
                name="email"
                leftIconName="email"
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />
              <TextInput
                name="password"
                leftIconName="key-variant"
                placeholder="Senha"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType="newPassword"
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              <TextInput
                name="confirmPassword"
                leftIconName="key-variant"
                placeholder="Confirmação de senha"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType="password"
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />
              <TextInput
                name="cep"
                leftIconName="map-marker"
                placeholder="CEP"
                autoCapitalize="none"
                keyboardType="numeric"
                value={values.cep}
                onChangeText={(text) => {
                  handleChange("cep")(text);
                  if (text.length === 8) {
                    fetchNeighborhood(text, setFieldValue);
                  }
                }}
                onBlur={handleBlur("cep")}
              />
              <FormErrorMessage error={errors.cep} visible={touched.cep} />
              <TextInput
                name="bairro"
                leftIconName="home"
                placeholder="Bairro"
                autoCapitalize="words"
                value={values.bairro}
                editable={false} // Bairro field should be read-only
              />
              {errorState !== "" ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}
              <Button style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Criar conta</Text>
              </Button>
            </>
          )}
        </Formik>
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={"Já possui uma conta? Clique aqui!"}
          onPress={() => navigation.navigate("Login")}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ADD8E6",
    paddingHorizontal: 12,
  },
  logoContainer: {
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.black,
    paddingTop: 20,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "700",
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
