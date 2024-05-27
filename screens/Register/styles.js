import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  errorInput: {
    borderColor: "#e74c3c",
  },
  instructionText: {
    fontSize: 18,
    color: "#4a4a4a",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingHorizontal: 10,
    lineHeight: 24,
  },
});
