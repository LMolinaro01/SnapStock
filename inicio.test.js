import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './HomeScreen'; 

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => ({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() => ({
    canceled: false,
    assets: [{ uri: 'mock-uri' }],
  })),
  requestCameraPermissionsAsync: jest.fn(() => ({ status: 'granted' })),
  launchCameraAsync: jest.fn(() => ({
    canceled: false,
    assets: [{ uri: 'mock-camera-uri' }],
  })),
}));

describe('HomeScreen', () => {
  it('renders corretly', async () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    // Verifica se o botão "Adicionar Item" está presente na tela
    const addButton = getByText('+');
    expect(addButton).toBeTruthy();

    // Verifica se a lista inicial está vazia
    const flatList = getByTestId('flat-list');
    expect(flatList.props.data).toEqual([]);
  });

  it('botões funcionando corretamente', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<HomeScreen />);

    // Clicar no botão de adicionar item
    const addButton = getByText('+');
    fireEvent.press(addButton);

    // Inserir valores no modal de adicionar item
    const nameInput = getByPlaceholderText('Nome');
    fireEvent.changeText(nameInput, 'Novo Item');

    const descriptionInput = getByPlaceholderText('Descrição');
    fireEvent.changeText(descriptionInput, 'Descrição do Novo Item');

    const linkInput = getByPlaceholderText('Link');
    fireEvent.changeText(linkInput, 'http://link.com');

    // Clicar no botão "Adicionar Item"
    const addItemButton = getByText('Adicionar Item');
    fireEvent.press(addItemButton);

    // Esperar o modal fechar e verificar se o item foi adicionado à lista
    await waitFor(() => {
      const flatList = getByTestId('flat-list');
      expect(flatList.props.data.length).toBe(1); // Verifica se o item foi adicionado
      expect(flatList.props.data[0].name).toBe('Novo Item'); // Verifica se o nome está correto
    });
  });


});
