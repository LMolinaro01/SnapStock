import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { launchCamera } from 'react-native-image-picker';

const Stack = createStackNavigator(); // Navegação em pilha (stack)
const Drawer = createDrawerNavigator(); // Navegação em gaveta (drawer)

const PreLogin = ({ navigation }) => {
  return (
    <View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('logo.png')} style={{ width: 140, height: 110, marginBottom: 20 }} />
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.navigate('Registrar')} title="Registrar" />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.navigate('Login')} title="Logar" />
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <Text>© Leonardo Molinaro</Text>
      </View>
    </View>
  );
};

const FormularioLogin = ({ route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Simples verificação de login
    if (username === 'admin' && password === '123') {
      route.params.funcLogar(true); // Define o estado de login como verdadeiro
    } else {
      alert('Credenciais incorretas');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nome de Usuário</Text>
      <TextInput value={username} onChangeText={setUsername} style={styles.input} />
      <Text>Senha</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <View style={styles.buttonContainer}>
        <Button onPress={handleLogin} title="Entrar" />
      </View>
    </View>
  );
};

// Tela de Registro
const Registrar = () => <Text>Registrar</Text>;

// Tela de Perfil
const Perfil = () => (
  <View>
    <Text>Perfil legal</Text>
  </View>
);

// Tela de Configurações
const Config = () => <Text>Configurações</Text>;

// Tela de Exibição
const Exibir = () => <Text>Exibir conteúdo</Text>;

// Tela de Fotos
const Fotos = () => <Text>Galeria de Fotos</Text>;

// Tela Principal de Listagem de Itens
const HomeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, description: '', link: '', image: null });

  // Adiciona novo item
  const addItem = () => {
    setItems([...items, { ...newItem, id: items.length.toString() }]);
    setNewItem({ name: '', quantity: 1, description: '', link: '', image: null });
    setModalVisible(false);
  };

  // Atualiza a quantidade do item
  const updateQuantity = (id, amount) => {
    const updatedItems = items.map(item => (item.id === id ? { ...item, quantity: item.quantity + amount } : item));
    setItems(updatedItems);
  };

  // Função para tirar foto
  const handleTakePhoto = () => {
    launchCamera({}, response => {
      if (response.assets) {
        setNewItem({ ...newItem, image: response.assets[0].uri });
      }
    });
  };

  // Renderiza cada item
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('ItemDetails', { item, setItems })}>
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
      <FlatList data={items} keyExtractor={item => item.id} renderItem={renderItem} />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal para adicionar novo item */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={newItem.name}
              onChangeText={text => setNewItem({ ...newItem, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={newItem.description}
              onChangeText={text => setNewItem({ ...newItem, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Link (Opcional)"
              value={newItem.link}
              onChangeText={text => setNewItem({ ...newItem, link: text })}
            />
            <View>
              <Button title="Tirar Foto" onPress={handleTakePhoto} />
              <Button title="Adicionar Item" onPress={addItem} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Tela de Detalhes do Item
const ItemDetails = ({ route, navigation }) => {
  const { item, setItems } = route.params;
  const [editedItem, setEditedItem] = useState(item);

  const saveChanges = () => {
    setItems(prevItems => prevItems.map(it => (it.id === editedItem.id ? editedItem : it)));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {editedItem.image && <Image source={{ uri: editedItem.image }} style={styles.detailImage} />}
      <TextInput style={styles.input} value={editedItem.name} onChangeText={text => setEditedItem({ ...editedItem, name: text })} />
      <TextInput style={styles.input} value={editedItem.description} onChangeText={text => setEditedItem({ ...editedItem, description: text })} />
      <TextInput style={styles.input} value={editedItem.link} onChangeText={text => setEditedItem({ ...editedItem, link: text })} />
      <Button title="Salvar Alterações" onPress={saveChanges} />
    </View>
  );
};

// App principal com controle de login
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
        <Stack.Screen name="Login" component={FormularioLogin} initialParams={{ funcLogar: setLogado }} />
        <Stack.Screen name="Registrar" component={Registrar} />
        <Stack.Screen name="Perfil" component={Perfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, borderWidth: 1, borderColor: '#ccc', padding: 10 },
  itemImage: { width: 50, height: 50, marginRight: 10 },
  itemInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { fontSize: 18 },
  itemQuantity: { marginHorizontal: 10, fontSize: 16 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  addButton: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 24 },
  buttonContainer: { marginVertical: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 5 },
  detailImage: { width: 200, height: 200, marginBottom: 20 }
});

export default App;
