import { Dimensions, StyleSheet } from "react-native";

const windowHeight = Dimensions.get("window").height;


export default StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modal: {
        backgroundColor: "white",
        width: "100%",
        minHeight: windowHeight / 2,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
      },
});
