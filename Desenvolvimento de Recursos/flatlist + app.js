import React, { useState } from "react";
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
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { launchCamera } from "react-native-image-picker";
import { Alert } from "react-native";


const Stack = createStackNavigator(); 
const Drawer = createDrawerNavigator(); 

const PreLogin = ({ navigation }) => {
  return (
    <View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("logo.png")}
          style={{ width: 140, height: 110, marginBottom: 20 }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.navigate("Registrar")}
          title="Registrar"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.navigate("Login")} title="Logar" />
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text>© Leonardo Molinaro</Text>
      </View>
    </View>
  );
};

const FormularioLogin = ({ route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "123") {
      route.params.funcLogar(true);
    } else {
      alert("Credenciais incorretas");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nome de Usuário</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <Text>Senha</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button onPress={handleLogin} title="Entrar" />
      </View>
    </View>
  );
};

const Registrar = () => <Text>Registrar</Text>;
const Perfil = () => <View><Text>Perfil legal</Text></View>;
const Config = () => <Text>Configurações</Text>;
const Exibir = () => <Text>Exibir conteúdo</Text>;
const Fotos = () => <Text>Galeria de Fotos</Text>;

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

  const addItem = () => {
    setItems([...items, { ...newItem, id: items.length.toString() }]);
    setNewItem({ name: "", quantity: 1, description: "", link: "", image: null });
    setModalVisible(false);
  };

  const updateQuantity = (id, amount) => {
  const updatedItems = items.map(item => {
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
                setItems(prevItems => prevItems.filter(it => it.id !== id));
              },
            },
          ],
          { cancelable: true }
        );
        return item; // Retorna o item sem alterações
      }
      return { ...item, quantity: newQuantity }; // Atualiza a quantidade
    }
    return item; // Retorna o item sem alterações
  });
  setItems(updatedItems.filter(item => item.quantity > 0)); // Remove os itens com quantidade <= 0
};


  const handleTakePhoto = () => {
    launchCamera({}, response => {
      if (response.assets) {
        setNewItem({ ...newItem, image: response.assets[0].uri });
      }
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setEditingItem(item); // Define o item que está sendo editado
        setModalVisible(true); // Abre o modal de edição
      }}
    >
      {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
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
          setEditingItem(null); // Reseta o item a ser editado
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal para adicionar e editar item */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
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
              <Button title="Tirar Foto" onPress={handleTakePhoto} />
              <Button
                title={editingItem ? "Salvar Alterações" : "Adicionar Item"}
                onPress={() => {
                  if (editingItem) {
                    setItems((prevItems) =>
                      prevItems.map((it) => (it.id === editingItem.id ? editingItem : it))
                    );
                  } else {
                    addItem();
                  }
                  setModalVisible(false);
                }}
              />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const ItemDetails = ({ route, navigation }) => {
  const { item, setItems } = route.params;
  const [editedItem, setEditedItem] = useState(item);

  const saveChanges = () => {
    setItems((prevItems) =>
      prevItems.map((it) => (it.id === editedItem.id ? editedItem : it))
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {editedItem.image && (
        <Image source={{ uri: editedItem.image }} style={styles.detailImage} />
      )}
      <TextInput
        style={styles.input}
        value={editedItem.name}
        onChangeText={(text) => setEditedItem({ ...editedItem, name: text })}
      />
      <TextInput
        style={styles.input}
        value={editedItem.description}
        onChangeText={(text) =>
          setEditedItem({ ...editedItem, description: text })
        }
      />
      <TextInput
        style={styles.input}
        value={editedItem.link}
        onChangeText={(text) => setEditedItem({ ...editedItem, link: text })}
      />
      <Button title="Salvar Alterações" onPress={saveChanges} />
    </View>
  );
};

const App = () => {
  const [EstaLogado, setLogado] = useState(false);

  return EstaLogado ? (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Início" component={HomeScreen} />
        <Drawer.Screen name="Config" component={Config} />
        <Drawer.Screen name="Exibir" component={Exibir} />
        <Drawer.Screen name="Fotos" component={Fotos} />
      </Drawer.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SnapStock" component={PreLogin} />
        <Stack.Screen
          name="Login"
          component={FormularioLogin}
          initialParams={{ funcLogar: setLogado }}
        />
        <Stack.Screen name="Registrar" component={Registrar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemQuantity: {
    marginHorizontal: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007BFF",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  detailImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});

export default App;
