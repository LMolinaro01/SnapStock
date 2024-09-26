import {
  SafeAreaView,
  Button,
  TextInput,
  StyleSheet,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

// Função para armazenar os dados
const _storeData = async (nome, codigo, numero) => {
  try {
    // cria um objeto com os valores a serem armazenados
    const data = { nome, codigo, numero };

    await AsyncStorage.setItem("dados", JSON.stringify(data)); // transforma em uma string
    alert("Dados salvos com sucesso!");
  } catch (error) {
    alert("Erro ao salvar os dados: " + error);
  }
};

// Função para recuperar os dados
const _retrieveData = async () => {
  try {
    // Recupera o valor salvo no AsyncStorage
    const value = await AsyncStorage.getItem("dados");

    if (value !== null) {
      const data = JSON.parse(value); // converte o valor string de volta

      alert(
        `Nome: ${data.nome}, Código: ${data.codigo}, Número: ${data.numero}`
      );
    } else {
      alert("Nenhum dado encontrado.");
    }
  } catch (error) {
    alert("Erro ao recuperar os dados: " + error);
  }
};

export default function App() {
  const [valorSalvarNome, setValorSalvarNome] = useState("");
  const [valorSalvarCodigo, setValorSalvarCodigo] = useState("");
  const [valorSalvarNum, setValorSalvarNum] = useState("");

  return (
    <SafeAreaView>
      <Text>Digite o Nome</Text>
      <TextInput
        value={valorSalvarNome}
        onChangeText={setValorSalvarNome}
        style={styles.input}
      />

      <Text>Digite o Código</Text>
      <TextInput
        value={valorSalvarCodigo}
        onChangeText={setValorSalvarCodigo}
        style={styles.input}
      />

      <Text>Digite o Número</Text>
      <TextInput
        value={valorSalvarNum}
        onChangeText={setValorSalvarNum}
        style={styles.input}
      />

      <Button
        onPress={() =>
          _storeData(valorSalvarNome, valorSalvarCodigo, valorSalvarNum)
        }
        title="Registrar valores"
      />
      <Button onPress={_retrieveData} title="Pegar valores" />
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
 
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
