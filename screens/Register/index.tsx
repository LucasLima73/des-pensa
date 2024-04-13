import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebase from "firebase/app";

import { getAuth } from 'firebase/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleRegister = () => {
    const user = getAuth().currentUser;
    if (user) {
      const firestore = getFirestore();
      const foodCollection = collection(firestore, `users/${user.uid}/foods`);
      addDoc(foodCollection, {
        name: name,
        expiryDate: expiryDate,
      })
        .then(() => {
          console.log('Food item added!');
          setName('');
          setExpiryDate('');
        })
        .catch(error => {
          console.error('Error adding food item: ', error);
        });
    }
  };
  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Expiry Date (DD/MM/YYYY)"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />
      <Button
        title="Add Food Item"
        onPress={handleRegister}
      />
    </View>
  );
}
