import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import { signInWithEmailAndPassword,getAuth } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  getFirestore,
  collection,
  addDoc,
  Firestore,
} from "firebase/firestore";

import {
  View,
  TextInput,
  Logo,
  Button,
  FormErrorMessage,
} from "../../components";
import { Images, Colors, auth } from "../../config";
import { useTogglePasswordVisibility } from "../../hooks";
import { loginValidationSchema } from "../../utils";

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();
  const firestore = getFirestore();

  const handleLogin = async (values) => {
    const { email, password } = values;
    const auth = getAuth();
    const firestore = getFirestore();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Log the login event to Firestore as an event in the "analytics" collection
      await addDoc(collection(firestore, "analytics"), {
        event: "login",
        email,
        method: "email",
        timestamp: new Date(),
      });
    } catch (error) {
      setErrorState(error.message);
    }
  };

  return (
    <>
      <View isSafe style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          {/* LogoContainer: consist app logo and screen title */}
          <View style={styles.logoContainer}>
            <Logo uri={Images.logo} />
            <Text style={styles.screenTitle}>Bem vindo de volta!</Text>
          </View>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginValidationSchema}
            onSubmit={(values) => handleLogin(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => (
              <>
                {/* Input fields */}
                <TextInput
                  name="email"
                  leftIconName="email"
                  placeholder="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoFocus={true}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                <FormErrorMessage
                  error={errors.email}
                  visible={touched.email}
                />
                <TextInput
                  name="password"
                  leftIconName="key-variant"
                  placeholder="Senha"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType="password"
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
                {/* Display Screen Error Messages */}
                {errorState !== "" ? (
                  <FormErrorMessage error={errorState} visible={true} />
                ) : null}
                {/* Login button */}
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Entrar</Text>
                </Button>
              </>
            )}
          </Formik>
          {/* Button to navigate to SignupScreen to create a new account */}
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={"É novo? crie sua conta"}
            onPress={() => navigation.navigate("Signup")}
          />
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={"Esqueci a senha"}
            onPress={() => navigation.navigate("ForgotPassword")}
          />
        </KeyboardAwareScrollView>
      </View>

      {/* App info footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Equipe Des-senvolve</Text>
      </View>
    </>
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
  footer: {
    backgroundColor: "#ADD8E6",
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.orange,
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
    color: Colors.white,
  },
});
