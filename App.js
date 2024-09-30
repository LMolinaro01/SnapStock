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
import HomeScreen from "./Home";


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
const Perfil = () => <View><Text>Perfil</Text></View>;
const Config = () => <Text>Configurações</Text>;
const Exibir = () => <Text>Exibir conteúdo</Text>;
const Fotos = () => <Text>Galeria de Fotos</Text>;


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
  placeholderImage: {
    width: 50,
    height: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    lineHeight: 50,
    color: "#777",
},
  detailImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  
});

export default App;
