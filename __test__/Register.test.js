import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Register from '../screens/Register/Register';

test('submitting empty form shows validation errors', async () => {
  const { getByText, getByPlaceholderText } = render(<Register />);
  
  const addButton = getByText('Adicionar produto');

  fireEvent.press(addButton);

  expect(getByText('Erro')).toBeTruthy();
  expect(getByText('Todos os campos devem ser preenchidos.')).toBeTruthy();
});

test('submitting valid form does not show validation errors', async () => {
  const { queryByText, getByText, getByPlaceholderText } = render(<Register />);
  
  const nameInput = getByPlaceholderText('Nome do produto');
  const expiryDateInput = getByPlaceholderText('Data de validade (DD/MM/AAAA)');
  const quantityInput = getByPlaceholderText('Quantidade');
  const addButton = getByText('Adicionar produto');

  fireEvent.changeText(nameInput, 'Test Product');
  fireEvent.changeText(expiryDateInput, '31/12/2025');
  fireEvent.changeText(quantityInput, '10');

  fireEvent.press(addButton);

  expect(queryByText('Erro')).toBeNull();
  expect(queryByText('Todos os campos devem ser preenchidos.')).toBeNull();
});
