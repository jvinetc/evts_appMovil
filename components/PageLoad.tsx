import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const PageLoad = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#007B8A" />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
   overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, // Asegura que esté encima de todo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 220, 0.5)', // Beige semitransparente
  },
  loadingText: {
    marginTop: 10,
    color: '#007B8A',
    fontWeight: '600',
  },
});

export default PageLoad