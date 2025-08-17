import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { requestStoragePermission } from '@/utils/Permission';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';

const ButtonDownloadTemplate = () => {
    const whatsappNumber = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER || '56912345678';
    const API_URL = process.env.EXPO_PUBLIC_API_SERVER;
    const { setLoading } = useLoading();
    const { token } = useToken();

    const saveToDownloads = async (fileUri: string) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'No se puede guardar el archivo.');
                return;
            }

            const asset = await MediaLibrary.createAssetAsync(fileUri);
            let album = await MediaLibrary.getAlbumAsync('Download');
            if (!album) {
                album = await MediaLibrary.createAlbumAsync('Download', asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
            Alert.alert('Guardado', 'El archivo se guardó en la carpeta de descargas.');
        } catch (error) {
            console.error('Error al guardar en descargas:', error);
            Alert.alert('Error', 'No se pudo guardar el archivo.');
        }
    };

    const downloadTemplateExcel = async () => {
        try {
            setLoading(true);

            // 🛡️ Solicitar permiso solo en Android
            if (Platform.OS === 'android') {
                const hasPermission = await requestStoragePermission();
                if (!hasPermission) {
                    Alert.alert(
                        'Permiso denegado',
                        'No se puede abrir el archivo sin acceso al almacenamiento.'
                    );
                    Linking.openURL(`https://wa.me/${whatsappNumber}?text=Hola, comparteme la plantilla para solicitar envios`);
                    return;
                }
            }

            // 📥 Ruta donde se guardará el archivo
            const fileUri = FileSystem.documentDirectory + 'Plantilla_Stops.xlsx';

            // 🚀 Descargar el archivo
            const download = FileSystem.createDownloadResumable(
                `${API_URL}/stop/downloadTemplate`,
                fileUri,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await download.downloadAsync();

            if (!result || !('uri' in result)) {
                throw new Error('No se pudo obtener la URI del archivo descargado.');
            }

            console.log('Plantilla descargada en:', result.uri);
            Alert.alert('Descarga completa', 'La plantilla se guardó en tu dispositivo.');

            // 📂 Abrir el archivo según plataforma
            if (Platform.OS === 'android') {
                try {
                    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                        data: result.uri,
                        flags: 1,
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    await saveToDownloads(result.uri);
                } catch (error) {
                    console.warn('No se pudo abrir el archivo:', error);
                    Alert.alert(
                        'No se pudo abrir el archivo',
                        'Asegúrate de tener una app como Excel o Google Sheets instalada.'
                    );
                }
            } else {
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(result.uri);
                } else {
                    Alert.alert(
                        'No se pudo abrir el archivo',
                        'Instala una app compatible con archivos Excel para visualizarlo.'
                    );
                }
            }
        } catch (error) {
            console.error('Error al descargar la plantilla:', error);
            Alert.alert(
                'Error',
                'No se pudo descargar la plantilla. Se redigira a nuestro whatsapp para que la pueda solicitar.'
            );
            Linking.openURL(`https://wa.me/${whatsappNumber}?text=Hola, comparteme la plantilla para solicitar envios`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <TouchableOpacity style={styles.actionButton} onPress={() => downloadTemplateExcel()}>
            <MaterialCommunityIcons name="file-excel" size={24} color="#2ECC71" />
            <Text style={styles.actionText}>Plantilla</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        elevation: 2,
    },
    actionText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    }
});

export default ButtonDownloadTemplate