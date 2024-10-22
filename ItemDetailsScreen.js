import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const ItemDetailsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      const storedItems = await retrieveItems();
      setItems(storedItems);
    };

    loadItems();

    const unsubscribe = navigation.addListener("focus", loadItems);

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      ) : (
        <Text style={styles.placeholderImage}>Imagem não disponível</Text>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemQuantity}>Quantidade: {item.quantity}</Text>
        {item.link && <Text style={styles.itemLink}>{item.link}</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noItemsText}>Nenhum item disponível</Text>
      )}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ffe699" }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "column",
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 3,
  },
  itemImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
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
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    lineHeight: 200,
  },
  itemInfo: {
    alignItems: "center",
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemDescription: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemLink: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  noItemsText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ItemDetailsScreen;
