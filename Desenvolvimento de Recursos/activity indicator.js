import { useState } from 'react';
import { View, Button, Text, TextInput, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const PreLogin = ({ navigation, route }) => {
  return (
    <View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('logo.png')}
          style={{ width: 140, height: 110, marginBottom: 20 }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.navigate('Registrar')}
          title="Registrar"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.navigate('Login')} title="Logar" />
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text>© Leonardo Molinaro</Text>
      </View>
    </View>
  );
};

const FormularioLogin = ({ route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Login para testes
    if (username === 'admin' && password === '123') {
      route.params.funcLogar(true); // Simula o login bem-sucedido
    } else {
      alert('Credenciais incorretas');
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

const Registrar = () => {
  return <Text>Registrar</Text>;
};

const Perfil = () => {
  return (
    <View>
      <Text>Perfil legal</Text>
    </View>
  );
};

const Home = ({ navigation, route }) => {
  return <View></View>;
};

const Config = () => {
  return <Text>Config</Text>;
};

const Exibir = () => {
  return <Text>Exibir</Text>;
};

const Fotos = () => {
  return <Text>Foto legal</Text>;
};

const App = () => {
  const [EstaLogado, setLogado] = useState(false);
  return EstaLogado ? (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Início" component={() => {}} />
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
        <Stack.Screen name="Perfil" component={Perfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 10, // Define o espaçamento vertical entre os botões
  },
  input: {
    height: 40,
    borderColor: '#bcbab9',
    borderWidth: 1,
    marginBottom: 20,
  },
});

export default App;
