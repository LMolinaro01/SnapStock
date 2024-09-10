// Exercicio feito em aula, mudança de telas (Código Temporário)

import { Text, SafeAreaView, Button, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function App() {
  const [x, setX] = useState(false);
  const [y, setY] = useState(false);

  return (
    <SafeAreaView>
      {x ? (
        <>
          <Text>Hello</Text>
          <Button onPress={() => setX(false)} title="Logar" />
        </>
      ) : y ? (
        <>
          <ActivityIndicator animating={true} />
          <Button onPress={() => setY(false)} title="Confirmar" />
        </>
      ) : (
        <>
          <Text>Logado</Text>
          <Button onPress={() => { setX(true); setY(true); }} title="Deslogar" />
        </>
      )}
    </SafeAreaView>
  );
}
