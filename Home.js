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
  Platform,
  PermissionsAndroid,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

// Função para armazenar os itens no AsyncStorage
const storeItems = async (items, username) => {
  try {
    await AsyncStorage.setItem(`items_${username}`, JSON.stringify(items));
  } catch (error) {
    alert("Erro ao salvar os dados: " + error);
  }
};


// Função para recuperar os itens do AsyncStorage
const retrieveItems = async (username) => {
  try {
    const storedItems = await AsyncStorage.getItem(`items_${username}`);
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


  useEffect(() => {
    const loadItems = async () => {
      const username = await AsyncStorage.getItem("loggedInUser");
      if (username) {
        const storedItems = await retrieveItems(username);
        setItems(storedItems);
      }
    };
    loadItems();
  }, []);
  

  // Função para solicitar permissão de acesso à galeria no Android
  const requestGalleryPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      if (!granted) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Permissão de Galeria",
            message:
              "O app precisa de acesso à galeria para selecionar imagens.",
            buttonNeutral: "Perguntar depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          }
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            "Permissão Necessária",
            "Você precisa habilitar a permissão de galeria nas configurações.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Abrir Configurações",
                onPress: () => Linking.openSettings(),
              },
            ],
            { cancelable: true }
          );
        }
        return false;
      }
      return true; // Permissão já concedida
    }
    return true; // iOS não requer essa permissão
  };

  // Função para abrir a galeria de imagens
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Desculpe, precisamos da permissão para acessar a galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Verifica se está editando ou adicionando um novo item
      if (editingItem) {
        setEditingItem((prevItem) => ({ ...prevItem, image: uri }));
      } else {
        setNewItem((prevItem) => ({ ...prevItem, image: uri }));
      }

      // Exibir o alerta de confirmação
      Alert.alert("Sucesso", "Imagem escolhida com sucesso!");
    } else {
      console.log("Seleção de imagem cancelada pelo usuário.");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Desculpe, precisamos da permissão para acessar a câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (editingItem) {
        setEditingItem((prevItem) => ({ ...prevItem, image: uri }));
      } else {
        setNewItem((prevItem) => ({ ...prevItem, image: uri }));
      }
      Alert.alert("Sucesso", "Foto capturada com sucesso!");
    } else {
      console.log("Captura de foto cancelada pelo usuário.");
    }
  };

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
  const addItem = async () => {
    const username = await AsyncStorage.getItem("loggedInUser");
    const updatedItems = editingItem
      ? items.map((it) => (it.id === editingItem.id ? editingItem : it))
      : [...items, { ...newItem, id: items.length.toString() }];
  
    setItems(updatedItems);
    if (username) {
      await storeItems(updatedItems, username); // Armazena os itens para o usuário específico
    }
  
    // Limpa o estado ao adicionar ou editar
    setNewItem({
      name: "",
      quantity: 1,
      description: "",
      link: "",
      image: null,
    });
    setEditingItem(null); // Limpar o item em edição
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

  const handlePhotoTaken = (uri) => {
    setNewItem({ ...newItem, image: uri });
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
    <TouchableOpacity
      onPress={() => openDetails(item)}
      style={styles.itemContainer}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      ) : (
        <Text style={styles.placeholderImage}>Image</Text>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, -1)}
            style={styles.roundButton}
          >
            <Text style={styles.roundButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.itemQuantity}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => updateQuantity(item.id, 1)}
            style={styles.roundButton}
          >
            <Text style={styles.roundButtonText}>+</Text>
          </TouchableOpacity>
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

      {selectedItem && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedItem.image ? (
                <Image
                  source={{ uri: selectedItem.image }}
                  style={styles.detailImage}
                />
              ) : (
                <Text style={styles.placeholderImage}>Image</Text>
              )}
              <Text style={styles.itemName}>{selectedItem.name}</Text>
              <Text style={styles.itemDescription}>
                {selectedItem.description}
              </Text>
              {selectedItem.link && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(selectedItem.link)}
                >
                  <Text style={styles.itemLink}>{selectedItem.link}</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.itemQuantityModal}>
                {selectedItem.quantity}
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ffe699" }]}
                onPress={closeDetails}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        visible={modalVisible && !selectedItem}
        animationType="slide"
        transparent={true}
      >
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
              value={
                editingItem ? editingItem.description : newItem.description
              }
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
              placeholder="Link"
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
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ffe699" }]}
                onPress={takePhoto}
              >
                <Text style={styles.buttonText}>Tirar Foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ffe699" }]}
                onPress={selectImage}
              >
                <Text style={styles.buttonText}>Escolher da Galeria</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ffe699" }]}
                onPress={addItem}
              >
                <Text style={styles.buttonText}>
                  {editingItem ? "Salvar Alterações" : "Adicionar Item"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ffe699" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
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
    backgroundColor: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  editar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    lineHeight: 50,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontWeight: "bold",
    padding: 4,
    fontSize: 14,
    marginTop: 5,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 4,
  },
  itemQuantityModal: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 35,
    position: "absolute",
    right: 20,
    bottom: 50,
    zIndex: 1,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: "#ffe699",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  detailImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  itemDescription: {
    marginVertical: 10,
    padding: 4,
    textDecorationLine: "italic",
  },
  itemLink: {
    color: "blue",
    padding: 4,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  roundButton: {
    backgroundColor: "#ffe699",
    borderRadius: 20,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  roundButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HomeScreen;
