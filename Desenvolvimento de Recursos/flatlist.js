import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { launchCamera } from 'react-native-image-picker';

const Stack = createStackNavigator();

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
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + amount } : item
    );
    setItems(updatedItems);
  };

  // Tirar foto do item
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
      onPress={() => navigation.navigate('ItemDetails', { item, setItems })}
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
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
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
            <Button title="Tirar Foto" onPress={handleTakePhoto} />
            <Button title="Adicionar Item" onPress={addItem} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Tela de detalhes do item
const ItemDetails = ({ route, navigation }) => {
  const { item, setItems } = route.params;
  const [editedItem, setEditedItem] = useState(item);

  // Salva alterações feitas no item
  const saveChanges = () => {
    setItems(prevItems =>
      prevItems.map(it => (it.id === editedItem.id ? editedItem : it))
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {editedItem.image && <Image source={{ uri: editedItem.image }} style={styles.detailImage} />}
      <TextInput
        style={styles.input}
        value={editedItem.name}
        onChangeText={text => setEditedItem({ ...editedItem, name: text })}
      />
      <TextInput
        style={styles.input}
        value={editedItem.description}
        onChangeText={text => setEditedItem({ ...editedItem, description: text })}
      />
      <TextInput
        style={styles.input}
        value={editedItem.link}
        onChangeText={text => setEditedItem({ ...editedItem, link: text })}
      />
      <Button title="Salvar Alterações" onPress={saveChanges} />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ItemDetails" component={ItemDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
  },
  itemQuantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  detailImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
