import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ImageModal = ({ visible, onConfirm, onCancel }: {
    visible: boolean;
    onConfirm: (imageUri: string) => void;
    onCancel: () => void;
}) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const pickFromLibrary = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:  ['images'],
            quality: 1,
        });
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const pickFromCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes:  ['images'],
            quality: 1,
        });
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };
    return (
       <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Seleccionar Imagen</Text>

          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.preview} />
          )}

          <TouchableOpacity style={styles.optionButton} onPress={pickFromLibrary}>
            <Text style={styles.buttonText}>Elegir desde galería</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={pickFromCamera}>
            <Text style={styles.buttonText}>Tomar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#1ABC9C' }]}
            onPress={() => {
              if (selectedImage) onConfirm(selectedImage);
              onCancel();
              setSelectedImage(null);
            }}
          >
            <Text style={styles.buttonText}>Grabar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#E74C3C' }]}
            onPress={() => {
              onCancel();
              setSelectedImage(null);
            }}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
    color: '#333',
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
export default ImageModal