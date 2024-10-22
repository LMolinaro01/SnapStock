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
import ItemDetailsScreen from "./ItemDetailsScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Função para criptografar a senha
const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
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
      await AsyncStorage.setItem("loggedInUser", username); // Salva o nome de usuário logado
      setLogado(true);
      Alert.alert("Sucesso!", "Login realizado com êxito.");
    } else {
      Alert.alert("Erro!", "Credenciais incorretas.");
    }
  } catch (error) {
    Alert.alert("Erro!", "Falha ao processar login.");
  }
};


// Função para logout
const logout = (setLogado) => {
  setLogado(false); // Apenas define o estado para não logado
  Alert.alert("Deslogado", "Você foi deslogado com sucesso.");
};

const PreLogin = ({ navigation }) => {
  return (
    <View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          marginTop: 20,
        }}
      >
        <Image
          source={require("./logo.png")}
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
          onPress={() =>
            handleLogin(username, password, route.params.funcLogar)
          }
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
        const hashedPassword = hashPassword(password);

        const storedUsers = await AsyncStorage.getItem("users");
        let users = storedUsers ? JSON.parse(storedUsers) : [];

        const userExists = users.find((user) => user.username === username);
        if (userExists) {
          Alert.alert("Atenção!", "Usuário já existe.");
        } else {
          users.push({ username, password: hashedPassword });

          await AsyncStorage.setItem("users", JSON.stringify(users));
          Alert.alert("Sucesso!", "Usuário registrado corretamente!");

          setTimeout(() => {
            navigation.navigate("Login");
          }, 500);
        }
      } catch (error) {
        Alert.alert("Atenção","Erro ao registrar usuário: " + error);
      }
    } else {
      Alert.alert("Atenção","Preencha todos os campos.");
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

const Config = ({ setLogado }) => {
  const clearUsers = async () => {
    Alert.alert(
      "Excluir Todos os Usuários",
      "Você tem certeza que deseja apagar todos os usuários registrados?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => showSecondAlert(), // Chama uma função para mostrar um segundo alerta
        },
      ]
    );
  };
  
  // Função para mostrar um segundo alerta de confirmação
  const showSecondAlert = () => {
    Alert.alert(
      "Confirmação Final",
      "Esta ação é irreversível. Deseja realmente apagar todos os usuários? (Isso inclui todas as fotos e itens associados a eles)",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("users");
              Alert.alert("Concluído", "Todos os usuários foram apagados.");
            } catch (error) {
              Alert.alert("Erro", "Falha ao apagar usuários.");
            }
          },
          style: "destructive", // Estilo para destacar a ação perigosa
        },
      ]
    );
  };
  
  return (
    <View style={styles.configContainer}>
      <Text style={styles.configTitle}>Área Perigosa</Text>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          marginTop: 20,
        }}
      >
        <Image
          source={require("./danger.png")}
          style={{ width: 165, height: 140, marginBottom: 20 }}
        />
      </View>

      <TouchableOpacity
        style={[styles.button2, { backgroundColor: "#ffe699" }]}
        onPress={clearUsers}
      >
        <Text style={styles.buttonText2}>Apagar todos os Usuários</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button2, { backgroundColor: "#ffe699" }]}
        onPress={() => logout(setLogado)}
      >
        <Text style={styles.buttonText2}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  const [EstaLogado, setLogado] = useState(false);

  return EstaLogado ? (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: "#ffe699",
          drawerInactiveTintColor: "#000",
          drawerStyle: {
            backgroundColor: "#fff",
          },
        }}
      >
        <Drawer.Screen name="Início" component={HomeScreen} />
        <Drawer.Screen name="Fotos" component={ItemDetailsScreen} />
        <Drawer.Screen name="Configurações">
          {() => <Config setLogado={setLogado} />}
        </Drawer.Screen>
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
        <Stack.Screen name="Home" component={HomeScreen} />
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
  buttonText2: {
    color: "black",
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  configContainer: {
    flex: 1,
    padding: 20,
  },
  configTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default App;
