import { PermissionsAndroid, Platform } from 'react-native';

export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Permiso de almacenamiento',
        message: 'La app necesita acceso para abrir archivos Excel.',
        buttonNeutral: 'Preguntar después',
        buttonNegative: 'Cancelar',
        buttonPositive: 'Aceptar',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Error al pedir permiso:', err);
    return false;
  }
};