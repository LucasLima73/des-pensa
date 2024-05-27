import * as Notifications from "expo-notifications";
import { ToastAndroid } from "react-native";

export const scheduleNotification = async (product) => {
  const now = new Date();
  const expiryDateParts = product.expiryDate.split("/");
  const notificationDate = new Date(
    parseInt(expiryDateParts[2]),
    parseInt(expiryDateParts[1]) - 1,
    parseInt(expiryDateParts[0])
  );
  notificationDate.setDate(notificationDate.getDate() - 7);

  if (notificationDate > now) {
    const trigger = { date: notificationDate };
    const content = {
      title: "Alerta de Validade!",
      body: `O produto "${product.name}" está vencendo em breve!`,
      data: { productId: product.id },
    };

    await Notifications.scheduleNotificationAsync({ content, trigger });
    console.log("Notificação agendada para:", notificationDate);

    // Exibir o ToastAndroid
    ToastAndroid.showWithGravity(
      `Notificação ativada para ${product.name}`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  } else {
    console.log("Notificação não agendada, pois a data é no passado.");
  }
};
