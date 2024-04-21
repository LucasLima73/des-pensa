import React from "react";
import { View, Text, Modal, Button, Dimensions } from "react-native";
import { launchCameraAsync, MediaTypeOptions } from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker/build/ImagePicker.types";
import styles from "./styles";

interface EditModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const windowHeight = Dimensions.get("window").height;

const EditModal: React.FC<EditModalProps> = ({ isVisible, onClose }) => {
  const handleCameraLaunch = async () => {
    const result: ImagePickerResult = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      // Implementar lógica para salvar a imagem e atualizar o estado do produto
    } else {
      console.log("A câmera foi cancelada ou não foi concedida permissão");
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text>Editando Produto</Text>
          {/* Formulário de edição aqui */}
          <Button title="Abrir Câmera" onPress={handleCameraLaunch} />
          <Button title="Fechar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;
