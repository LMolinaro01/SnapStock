// CameraScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen({ route, navigation }) {
  const { onPhotoTaken } = route.params; // Callback para retornar o URI da foto
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(CameraType.back); // Câmera traseira por padrão
  const [hasPermission, setHasPermission] = useState(null);

  // Solicita permissão de uso da câmera ao carregar o componente
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        alert('Permissão para acessar a câmera foi negada.');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        await MediaLibrary.saveToLibraryAsync(photo.uri); // Salva na galeria do dispositivo
        onPhotoTaken(photo.uri); // Passa o URI da foto de volta
        navigation.goBack(); // Volta para a tela anterior
      } catch (error) {
        console.error('Erro ao tirar foto: ', error);
        alert('Falha ao capturar a foto. Tente novamente.');
      }
    } else {
      alert('Referência da câmera não está disponível.');
    }
  };

  const flipCamera = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  if (hasPermission === null) {
    return <View><Text>Verificando permissões...</Text></View>;
  }

  if (hasPermission === false) {
    return <View><Text>Acesso à câmera negado.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={ref => setCameraRef(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={flipCamera}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  button: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
