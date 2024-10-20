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
} from "react-native";
//import { launchCamera } from "react-native-image-picker";
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
  const [selectedItem, setSelectedItem] = useState(null); // Para armazenar o item selecionado

  // Carrega os itens salvos ao inicializar o componente
  useEffect(() => {
    const loadItems = async () => {
      const storedItems = await retrieveItems();
      setItems(storedItems);
    };
    loadItems();
  }, []);

  // Função para adicionar ou editar item
  const addItem = () => {
    const updatedItems = editingItem
      ? items.map((it) => (it.id === editingItem.id ? editingItem : it))
      : [...items, { ...newItem, id: items.length.toString() }];

    setItems(updatedItems);
    storeItems(updatedItems); // Armazena os itens no AsyncStorage

    setNewItem({ name: "", quantity: 1, description: "", link: "", image: null });
    setModalVisible(false);
  };

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
                onPress: () => {
                  const filteredItems = items.filter((it) => it.id !== id);
                  setItems(filteredItems);
                  storeItems(filteredItems); // Atualiza o armazenamento
                },
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

  const handleTakePhoto = () => {
    launchCamera({}, (response) => {
      if (response.assets) {
        setNewItem({ ...newItem, image: response.assets[0].uri });
      }
    });
  };

  // Função para abrir os detalhes do item
  const openDetails = (item) => {
    setSelectedItem(item);
    setModalVisible(true); // Abre a modal de detalhes do item
  };

  // Função para fechar a modal de detalhes
  const closeDetails = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openDetails(item)} style={styles.itemContainer}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      ) : (
        <Text style={styles.placeholderImage}>Image</Text>
      )}

      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <Button
            color="#ffe699" // Cor dos botões
            title="-"
            onPress={() => updateQuantity(item.id, -1)}
          />
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <Button
            color="#ffe699" // Cor dos botões
            title="+"
            onPress={() => updateQuantity(item.id, 1)}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          setEditingItem(item);
          setModalVisible(true);
        }}
        style={styles.editIconContainer}
      >
        <Text style={styles.editar}>Editar</Text>
      </TouchableOpacity>
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

      {/* Modal para exibir os detalhes do item */}
      {selectedItem && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedItem.image }} style={styles.detailImage} />
              <Text style={styles.itemName}>{selectedItem.name}</Text>
              <Text style={styles.itemDescription}>{selectedItem.description}</Text>
              <Text style={styles.itemQuantity}>Quantidade: {selectedItem.quantity}</Text>
              {selectedItem.link && <Text style={styles.itemLink}>Link: {selectedItem.link}</Text>}
              <Button title="Fechar" onPress={closeDetails} color="#ffe699" />
            </View>
          </View>
        </Modal>
      )}

      <Modal visible={modalVisible && !selectedItem} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={editingItem ? editingItem.name : newItem.name}
              onChangeText={(text) => {
                if (editingItem) {
                  setEditingItem({ ...editingItem, name: text });
                } else {
                  setNewItem({ ...newItem, name: text });
                }
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={editingItem ? editingItem.description : newItem.description}
              onChangeText={(text) => {
                if (editingItem) {
                  setEditingItem({ ...editingItem, description: text });
                } else {
                  setNewItem({ ...newItem, description: text });
                }
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Link (Opcional)"
              value={editingItem ? editingItem.link : newItem.link}
              onChangeText={(text) => {
                if (editingItem) {
                  setEditingItem({ ...editingItem, link: text });
                } else {
                  setNewItem({ ...newItem, link: text });
                }
              }}
            />
            <View>
              <Button title="Tirar Foto" onPress={handleTakePhoto} color="#ffe699" />
              <Button
                title={editingItem ? "Salvar Alterações" : "Adicionar Item"}
                onPress={addItem}
                color="#ffe699" 
              />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#ffe699" />
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    lineHeight: 50,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontWeight: 'bold',
    padding: 4,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 8,
    
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#ffe699',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  itemDescription: {
    marginVertical: 10,
  },
  itemLink: {
    color: 'blue',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
