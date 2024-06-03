import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../screens/Login/LoginScreen';

test('login with valid credentials', async () => {
  const navigation = {
    navigate: jest.fn(),
  };

  const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={navigation} />);
  
  const emailInput = getByPlaceholderText('Email');
  const passwordInput = getByPlaceholderText('Senha');
  const loginButton = getByText('Entrar');

  fireEvent.changeText(emailInput, 'test@example.com');
  fireEvent.changeText(passwordInput, 'password');
  fireEvent.press(loginButton);

  await waitFor(() => {
    expect(navigation.navigate).toHaveBeenCalledWith('Main');
  });
});

test('login with invalid credentials shows error message', async () => {
  const navigation = {
    navigate: jest.fn(),
  };

  const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={navigation} />);
  
  const emailInput = getByPlaceholderText('Email');
  const passwordInput = getByPlaceholderText('Senha');
  const loginButton = getByText('Entrar');

  fireEvent.changeText(emailInput, 'invalid@example.com');
  fireEvent.changeText(passwordInput, 'wrongpassword');
  fireEvent.press(loginButton);

  await waitFor(() => {
    expect(getByText('Credenciais inválidas. Por favor, verifique e tente novamente.')).toBeTruthy();
  });
});
