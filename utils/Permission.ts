import { PermissionsAndroid, Platform } from 'react-native';

export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const sdkVersion = parseInt(String(Platform.Version), 10);

    // Android 13+ usa READ_MEDIA_IMAGES en lugar de READ_EXTERNAL_STORAGE
    const permissions =
      sdkVersion >= 33
        ? [PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]
        : [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ];

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    const allGranted = permissions.every(
      (perm) => granted[perm] === PermissionsAndroid.RESULTS.GRANTED
    );

    return allGranted;
  } catch (err) {
    console.warn('📛 Error al pedir permiso de almacenamiento:', err);
    return false;
  }
};