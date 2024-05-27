import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Notification() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aqui você receberá as notificações de seus produtos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Notification;
