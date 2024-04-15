import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  signUpLink: {
    marginTop: 20,
  },
  signUpLinkText: {
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#333333",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  signInLink: {
    marginTop: 20,
  },
  signInLinkText: {
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
