// Exercicio feito em aula, mudança de telas (Código Temporário)

//STACK, TAB, DRAWER e PROTEGIDA

import { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
 
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
 
const Login = ({ navigation, route }) => {
  return (
    <View>
      <Button onPress={() => route.params.funcLogar(true)} title="Logar" />
      <Button
        onPress={() => navigation.navigate('Registrar')}
        title="Registrar"
      />
    </View>
  );
};
 
const Registrar = () => {
  return <Text>Registrar</Text>;
};
 
const Avisos = () => {
  return <Text>Avisos</Text>;
};
 
const Perfil = ({ navigation, route }) => {
  return (
    <View>
      <Text>Perfil legal</Text>      {' '}
     
    </View>
  );
};
 
const Home = ({ navigation, route }) => {
  return (
    <View>
           {' '}
      <Button onPress={() => navigation.navigate('Perfil')} title="Perfil" />   {' '}
      <Button onPress = {()=>route.params.funcLogar(false)} title='Ir para Tela de login'/>
    </View>
  );
};
 
const Config = () => {
  return <Text>Config</Text>;
};
 
const Contatos = () => {
  return <Text>Contatos</Text>;
};
 
const Fotos = () => {
  return <Text>Foto legal</Text>;
};
 
const App = () => {
  const [EstaLogado, setLogado] = useState(false);
  return EstaLogado ? (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Home"
          component={() => {
            return (
              <Tab.Navigator>
                <Tab.Screen
                  name="Home_tab"
                  options={{ headerShown: false }}
                  component={() => {
                    return (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="Home"
                          options={{ headerShown: false }}
                          component={Home}
                          initialParams={{ funcLogar: setLogado }}
                        />
                        <Stack.Screen name="Perfil" component={Perfil} />
                      </Stack.Navigator>
                    );
                  }}
                />
                <Tab.Screen name="Avisos" component={Avisos} />
              </Tab.Navigator>
            );
          }}
        />
        <Drawer.Screen name="Config" component={Config} />
        <Drawer.Screen name="Contatos" component={Contatos} />
        <Drawer.Screen name="Fotos" component={Fotos} />
      </Drawer.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          initialParams={{ funcLogar: setLogado }}
        />
        <Stack.Screen name="Registrar" component={Registrar} />
        <Stack.Screen name="Perfil" component={Perfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 
export default App;
