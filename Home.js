import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  Alert,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { launchCamera } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para armazenar os itens no AsyncStorage
const storeItems = async (items) => {
  try {
    await AsyncStorage.setItem("items", JSON.stringify(items));
  } catch (error) {
    alert("Erro ao salvar os dados: " + error);
  }
};

// Função para recuperar os itens do AsyncStorage
const retrieveItems = async () => {
  try {
    const storedItems = await AsyncStorage.getItem("items");
    return storedItems !== null ? JSON.parse(storedItems) : [];
  } catch (error) {
    alert("Erro ao recuperar os dados: " + error);
    return [];
  }
};

const HomeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    description: "",
    link: "",
    image: null,
  });

  const [editingItem, setEditingItem] = useState(null);

  // Carrega os itens salvos ao inicializar o componente
  useEffect(() => {
    const loadItems = async () => {
      const storedItems = await retrieveItems();
      setItems(storedItems);
    };
    loadItems();
  }, []);

  // Exibe um toast de confirmação
  const showToast = (message) => {
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  // Função para adicionar ou editar item
  const addItem = () => {
    const updatedItems = editingItem
      ? items.map((it) => (it.id === editingItem.id ? editingItem : it))
      : [...items, { ...newItem, id: items.length.toString() }];

    setItems(updatedItems);
    storeItems(updatedItems); // Armazena os itens no AsyncStorage

    showToast(editingItem ? "Item editado com sucesso!" : "Item adicionado com sucesso!");

    setNewItem({ name: "", quantity: 1, description: "", link: "", image: null });
    setModalVisible(false);
  };

  // Atualiza a quantidade ou exclui o item se for zero
  const updateQuantity = (id, amount) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + amount;
        if (newQuantity <= 0) {
          Alert.alert(
            "Excluir Item",
            "Você realmente deseja excluir este item?",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Excluir",
                onPress: () => removeItem(id),
              },
            ],
            { cancelable: true }
          );
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setItems(updatedItems);
    storeItems(updatedItems); // Atualiza o armazenamento
  };

  // Função para remover um item
  const removeItem = (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
    storeItems(filteredItems); // Atualiza o armazenamento
    showToast("Item removido com sucesso!");
  };

  // Função para verificar permissão de câmera
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Permissão para acessar a câmera",
            message: "O app precisa de acesso à câmera para tirar fotos",
            buttonNeutral: "Pergunte depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS não requer permissões explícitas
  };

  // Função para tirar foto
  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    launchCamera({}, (response) => {
      if (response.assets) {
        setNewItem({ ...newItem, image: response.assets[0].uri });
      }
    });
  };

  // Função para gerenciar mudanças nos inputs
  const handleInputChange = (field, value) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    } else {
      setNewItem({ ...newItem, [field]: value });
    }
  };

  // Renderiza cada item na lista
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setEditingItem(item);
        setModalVisible(true);
      }}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      ) : (
        <Text style={styles.placeholderImage}>Image</Text>
      )}

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <Button title="-" onPress={() => updateQuantity(item.id, -1)} />
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <Button title="+" onPress={() => updateQuantity(item.id, 1)} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingItem(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={editingItem ? editingItem.name : newItem.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={editingItem ? editingItem.description : newItem.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Link (Opcional)"
              value={editingItem ? editingItem.link : newItem.link}
              onChangeText={(text) => handleInputChange('link', text)}
            />
            <View>
              <Button title="Tirar Foto" onPress={handleTakePhoto} />
              <Button
                title={editingItem ? "Salvar Alterações" : "Adicionar Item"}
                onPress={addItem}
              />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#ddd',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#999',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
