import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const PageLoad = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Envios todo santiago</Text>
        {/* Puedes usar una imagen también */}
        {/* <Image source={require('../assets/logo.png')} style={styles.logo} /> */}
      </View>
      <ActivityIndicator size="large" color="#007B8A" />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    marginBottom: 20
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007B8A'
  },
  loadingText: {
    marginTop: 10,
    color: '#007B8A'
  }
});

export default PageLoad