import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "crypto-js";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./Home";
import ItemDetailsScreen from './ItemDetailsScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Função para criptografar a senha
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

// Função para salvar o usuário
const storeUser = async (username, password) => {
  try {
    // Criptografa a senha
    const hashedPassword = hashPassword(password);

    // Recupera os usuários já armazenados
    const usersJSON = await AsyncStorage.getItem("users");
    let users = usersJSON ? JSON.parse(usersJSON) : [];

    // Verifica se o usuário já existe
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
      Alert.alert("Erro", "Usuário já registrado.");
    } else {
      // Adiciona o novo usuário
      users.push({ username, password: hashedPassword });
      await AsyncStorage.setItem("users", JSON.stringify(users));
      Alert.alert("Sucesso", "Usuário registrado com sucesso.");
    }
  } catch (error) {
    Alert.alert("Erro", "Falha ao salvar usuário.");
  }
};

// Função para verificar o login
const handleLogin = async (username, password, setLogado) => {
  try {
    const hashedPassword = hashPassword(password);

    const usersJSON = await AsyncStorage.getItem("users");
    const users = usersJSON ? JSON.parse(usersJSON) : [];

    // Verifica se as credenciais estão corretas
    const user = users.find(
      (user) => user.username === username && user.password === hashedPassword
    );

    if (user) {
      setLogado(true);
      Alert.alert("Sucesso", "Login realizado com sucesso.");
    } else {
      Alert.alert("Erro", "Credenciais incorretas.");
    }
  } catch (error) {
    Alert.alert("Erro", "Falha ao processar login.");
  }
};

const PreLogin = ({ navigation }) => {
  return (
    <View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("logo.png")}
          style={{ width: 165, height: 140, marginBottom: 20 }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate("Registrar")}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Logar</Text>
        </TouchableOpacity>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
        <Text>© Leonardo Molinaro</Text>
      </View>
    </View>
  );
};

const FormularioLogin = ({ route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => handleLogin(username, password, route.params.funcLogar)}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Registrar = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
  if (username && password) {
    try {
      // Criptografa a senha antes de salvar
      const hashedPassword = hashPassword(password);

      // Recupera os usuários armazenados
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      // Verifica se o usuário já existe
      const userExists = users.find((user) => user.username === username);
      if (userExists) {
        alert("Usuário já existe.");
      } else {
        // Adiciona o novo usuário com a senha criptografada ao AsyncStorage
        users.push({ username, password: hashedPassword });
        
        // Certifica-se de que os dados são salvos antes de continuar
        await AsyncStorage.setItem("users", JSON.stringify(users));
        alert("Usuário registrado com sucesso!");

        // Aguarda um pequeno atraso para garantir que os dados foram salvos corretamente
        setTimeout(() => {
          // Leva o usuário para a tela de login
          navigation.navigate("Login");
        }, 500);
      }
    } catch (error) {
      alert("Erro ao registrar usuário: " + error);
    }
  } else {
    alert("Preencha todos os campos.");
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
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const Config = () => <Text>Configurações</Text>;

const App = () => {
  const [EstaLogado, setLogado] = useState(false);

  return EstaLogado ? (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{
          drawerActiveTintColor: "#ffe699", 
          drawerInactiveTintColor: "#000", 
          drawerStyle: {
            backgroundColor: "#fff", 
          },
        }}>
        <Drawer.Screen name="Início" component={HomeScreen} />
        <Drawer.Screen name="Fotos" component={ItemDetailsScreen} />
        <Drawer.Screen name="Configurações" component={Config} />
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
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#ffe699", 
  },
  loginButton: {
    backgroundColor: "#ffe699", 
  },
  buttonText: {
    color: "#000", 
    fontWeight: "bold",
  },
});

export default App;
