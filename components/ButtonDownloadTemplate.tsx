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
                    Linking.openURL(`https://wa.me/${whatsappNumber}?text=Hola, me compartes la plantilla para agendar envios`);
                    return;
                }
            }
            const fileName = 'Plantilla_Stops.xlsx';
            const tempUri = FileSystem.cacheDirectory + fileName;
            const targetUri = FileSystem.documentDirectory + fileName;

            // 🚀 Descargar el archivo
            const download = FileSystem.createDownloadResumable(
                `${API_URL}/stop/downloadTemplate`,
                tempUri,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            let result;
            try {
                result = await download.downloadAsync();
            } catch (err) {
                console.error('❌ Error en downloadAsync:', err);
                throw err;
            }

            if (!result || !('uri' in result)) {
                throw new Error('No se pudo obtener la URI del archivo descargado.');
            }
            try {
                await FileSystem.copyAsync({
                    from: result.uri,
                    to: targetUri,
                });
                console.log('Plantilla descargada en:', result.uri);
                Alert.alert('Descarga completa', 'La plantilla se guardó en tu dispositivo.');
            } catch (error) {
                throw error;
            }

            // 📂 Abrir el archivo según plataforma
            if (Platform.OS === 'android') {
                try {
                    const fileInfo = await FileSystem.getInfoAsync(result.uri);
                    if (!fileInfo.exists) {
                        throw new Error('El archivo no existe en la ruta especificada.');
                    }
                    const info = await FileSystem.getInfoAsync(targetUri);
                    if (!info.exists) throw new Error('Archivo no copiado correctamente');
                    const asset = await MediaLibrary.createAssetAsync(result.uri);
                    console.log(asset)
                    let album = await MediaLibrary.getAlbumAsync('Download');
                    if (!album) {
                        album = await MediaLibrary.createAlbumAsync('Download', asset, false);
                    } else {
                        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    }
                    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                        data: result.uri,
                        flags: 1,
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    await saveToDownloads(result.uri);
                } catch (error) {
                    console.warn('No se pudo abrir el archivo:', error);
                    if (await Sharing.isAvailableAsync()) {
                        await Sharing.shareAsync(result.uri, {
                            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            dialogTitle: 'Abrir plantilla Excel',
                        });
                    } else {
                        Alert.alert(
                            'No se pudo abrir el archivo',
                            'Asegúrate de tener una app como Excel o Google Sheets instalada.'
                        );
                    }
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