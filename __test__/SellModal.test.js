import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SellModal } from '../screens/SellModal/SellModal';

test('calculate final value', async () => {
  const onClose = jest.fn();

  const { getByPlaceholderText, getByText } = render(
    <SellModal
      isVisible={true}
      onClose={onClose}
      currentQuantity={10}
      productName="Test Product"
      productQuantity={10}
      expiryDate="01/01/2025"
      foodId="food123"
      image="imageurl"
    />
  );

  const productValueInput = getByPlaceholderText('Preço do Produto (R$)');
  const quantityInput = getByPlaceholderText('Quantidade');
  const calculateButton = getByText('Calcular');

  fireEvent.changeText(productValueInput, '10');
  fireEvent.changeText(quantityInput, '5');
  fireEvent.press(calculateButton);

  await waitFor(() => {
    expect(getByText('Valor Final: R$50.50')).toBeTruthy();
  });
});

test('publish sale', async () => {
  const onClose = jest.fn();

  const { getByPlaceholderText, getByText } = render(
    <SellModal
      isVisible={true}
      onClose={onClose}
      currentQuantity={10}
      productName="Test Product"
      productQuantity={10}
      expiryDate="01/01/2025"
      foodId="food123"
      image="imageurl"
    />
  );

  const productValueInput = getByPlaceholderText('Preço do Produto (R$)');
  const quantityInput = getByPlaceholderText('Quantidade');
  const calculateButton = getByText('Calcular');
  const publishButton = getByText('Publicar Venda');

  fireEvent.changeText(productValueInput, '10');
  fireEvent.changeText(quantityInput, '5');
  fireEvent.press(calculateButton);
  fireEvent.press(publishButton);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
});
