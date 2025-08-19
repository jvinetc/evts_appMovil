import { detailAddres } from '@/api/AddresApi';
import { listComunas } from '@/api/Comunas';
import { listRates } from '@/api/Rate';
import { createStop, uploadExcel } from '@/api/Stops';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { IComuna } from '@/interface/Comuna';
import { IRate } from '@/interface/Rate';
import { StopData } from '@/interface/Stop';
import { UserData } from '@/interface/User';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AutoComplete from './AutoComplete';
import ButtonDownloadTemplate from './ButtonDownloadTemplate';
import CustomDropDown from './CustomDropDown';

type Suggestion = {
    placePrediction: {
        placeId: string;
        text: {
            text: string;
        };
    };
};

type FormAgendarProps = {
    user: UserData
}
const FormAgendar = ({ user }: FormAgendarProps) => {
    const [stop, setStop] = useState<StopData | undefined>();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [blockAutocomplete, setBlockAutocomplete] = useState(false);
    const [rates, setRates] = useState<IRate[]>([]);
    const [isFragile, setIsFragile] = useState(false);
    const [isReturnable, setIsReturnable] = useState(false);
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const { token } = useToken();
    const { setLoading } = useLoading();
    const phoneFormat = /^\+56\s?9\d{8}$|^569\d{8}$/i;
    const router = useRouter();

    useEffect(() => {
        const loadRates = async () => {
            setLoading(true);
            try {
                const { data } = await listRates(token);
                setRates(data);
            } catch (error) {
                console.log('Error al cargar tarifas:', error);
            } finally {
                setLoading(false);
            }
        }
        loadRates();
    }, []);

    const handleSelect = async (placeId: string, address: string) => {
        try {
            const { data } = await detailAddres(placeId, token);
            const { data: comunas } = await listComunas(token);
            const { addres, streetName, streetNumber, comuna, lat, lng } = data.data;
            if (!addres || !streetName || !streetNumber || !comuna || !lat || !lng) {
                setSuggestions([]);
                Alert.alert('Erro', 'Debe ingresar una direccion valida')
                console.log('Datos incompletos de la dirección seleccionada');
                return;
            }
            setBlockAutocomplete(true);
            setStop({ ...stop, addres: `${streetName} ${streetNumber}`, lat, lng })
            const { id } = comunas.find(
                (comun: IComuna) => comun.name.trim() === comuna.trim()
            ) as IComuna;
            if (stop) {
                setStop({ ...stop, comunaId: id, lat, lng });
            }
            setSuggestions([]);
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        if (user.Sells && user.Sells.length === 0) {
            Alert.alert('Atencion', 'Para agendar primero debe crear una tienda.');
            router.push('/(tabs)/screen/ConfigScreen');
            return;
        }
        if (!stop || !stop.addresName || !stop.phone || !stop.addres || !stop.rateId) {
            Alert.alert('Error', 'Por favor completa todos los campos requeridos.');
            console.log('No se ha completado el formulario');
            return;
        }
        if (!stop.phone.match(phoneFormat)) {
            Alert.alert('Error', 'El formato del teléfono es inválido.');
            console.log('El formato del teléfono es inválido.');
            return;
        }

        setLoading(true);
        try {
            setStop({
                ...stop,
                fragile: isFragile,
                devolution: isReturnable,
                sellId: user.Sells && user.Sells.length > 0 ? user.Sells[0].id : undefined
            });
            await createStop(stop, token);
            setStop({
                addresName: '',
                phone: '',
                addres: '',
                notes: '',
                sellId: undefined,
                comunaId: undefined,
                rateId: undefined,
            })
            setIsFragile(false);
            setIsReturnable(false);
            Alert.alert('Éxito', 'Destinatario guardado correctamente');
        } catch (error) {
            console.log('Error al guardar el destinatario:', error);
            Alert.alert('Error', 'No se pudo guardar el destinatario. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    }

    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets.length > 0) {
                setFileName(result.assets[0].name);
                setFile(result);

            }
        } catch (error) {
            console.error('Error al seleccionar archivo:', error);
        }
    };

    const uploadExcelStop = async () => {
        try {
            setLoading(true);
            if(user.Sells && user.Sells.length === 0){
                Alert.alert('Atencion', 'Para agendar primero debe crear una tienda.');
                router.push('/(tabs)/screen/ConfigScreen');
                return;
            }
            if (!file || !file.assets || file.assets.length === 0) {
                Alert.alert('Error', 'Por favor selecciona un archivo Excel primero.');
                return;
            }
            const formData = new FormData();
            const asset = file.assets[0];
            formData.append('file', {
                uri: asset.uri,
                name: asset.name || asset.name || 'archivo.xlsx',
                type: asset.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            } as any);
            let sellId =  user.Sells && user.Sells.length > 0 ? Number(user.Sells[0].id) : undefined;
            const { data, status } = await uploadExcel(formData, token, sellId);
            if (status === 201) {
                Alert.alert('Éxito', `${data.message}`);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudo subir el archivo. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
            setVisible(false);
            setFile(null);
            setFileName(null);
        }
    }

    const onSelect = (id: number) => {
        setStop({ ...stop, rateId: id });
    }


    return (
        <View style={{ padding: 20 }}>
            <View style={styles.fieldContainer}>
                <TextInput style={styles.input} value={stop?.addresName}
                    onChangeText={(text) => setStop({ ...stop, addresName: text })}
                    placeholder='Nombre y Apellido...'
                    placeholderTextColor="#7f8c8d" />
            </View>

            <View style={styles.fieldContainer}>
                <TextInput style={styles.input} value={stop?.phone} keyboardType='phone-pad'
                    onChangeText={(text) => setStop({ ...stop, phone: text })} placeholder='Telefono ej:(+56911111111)'
                    placeholderTextColor="#7f8c8d" />
            </View>
            <AutoComplete
                handleSelect={handleSelect}
                data={stop}
                setData={setStop}
                blockAutocomplete={blockAutocomplete}
                setBlockAutocomplete={setBlockAutocomplete}
                setSuggestions={setSuggestions}
                suggestions={suggestions}
                placeHolder='Direccion de entrega'
                isEdit={true}
            />

            <View style={styles.fieldContainer}>
                <TextInput style={styles.input} value={stop?.notes} multiline
                    onChangeText={(text) => setStop({ ...stop, notes: text })}
                    placeholder='Referencias(Depto/Torre/etc)'
                    placeholderTextColor="#7f8c8d" />
            </View>
            <View style={styles.fieldContainer}>
                <CustomDropDown
                    rates={rates}
                    selectedValue={stop?.rateId}
                    onSelect={onSelect}
                />
            </View>

            <View style={styles.buttonRow}>
                <View style={styles.optionRow}>
                    <Text style={styles.label}>¿Es frágil?</Text>
                    <Switch
                        value={isFragile}
                        onValueChange={setIsFragile}
                        thumbColor={isFragile ? '#831111ff' : '#ccc'}
                    />
                </View>

                <View style={styles.optionRow}>
                    <Text style={styles.label}>¿Es devolución?</Text>
                    <Switch
                        value={isReturnable}
                        onValueChange={setIsReturnable}
                        thumbColor={isReturnable ? '#c4d111ff' : '#ccc'}
                    />
                </View>
            </View>
            <View style={styles.buttonRow}>
                {/* Descargar Excel */}
                <ButtonDownloadTemplate />

                {/* Subir Excel */}
                <TouchableOpacity style={styles.actionButton} onPress={() => setVisible(true)}>
                    <MaterialCommunityIcons name="upload" size={24} color="#3498DB" />
                    <Text style={styles.actionText}>Subir Excel</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.tagButton, { backgroundColor: '#199b4fff' }]}>
                <Text style={styles.tagText} onPress={() => handleSubmit()}>GRABAR DESTINATARIO</Text>
            </TouchableOpacity>
            <Modal visible={visible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.uploadButtonM} onPress={handlePickFile}>
                            <Text style={styles.uploadTextM}>Seleccionar archivo Excel</Text>
                        </TouchableOpacity>

                        {fileName && <Text style={styles.fileNameM}>📄 {fileName}</Text>}

                        <TouchableOpacity style={styles.uploadButtonM} onPress={uploadExcelStop}>
                            <Text style={styles.uploadTextM}>Subir Excel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.closeButtonM} onPress={() => setVisible(false)}>
                            <Text style={styles.closeTextM}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#D6EAF8',
        justifyContent: 'center',
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#34495E',
        marginBottom: 6,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    inputDrop: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        height: 60,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
    },
    tagButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    tagText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    uploadButton: {
        backgroundColor: '#1ABC9C',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    downloadButton: {
        backgroundColor: '#7c8cc2ff',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        width: '70%',
        alignSelf: 'center',
    },
    uploadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sugerenciaItem: {
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
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
    },
    fileName: {
        marginTop: 15,
        fontSize: 14,
        color: '#34495E',
    }, modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        paddingVertical: 24,
        paddingHorizontal: 20,
        borderRadius: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        alignItems: 'center',
    },
    uploadButtonM: {
        backgroundColor: '#1ABC9C',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    uploadTextM: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    fileNameM: {
        marginVertical: 10,
        fontSize: 14,
        color: '#34495E',
        textAlign: 'center',
    },
    closeButtonM: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#e74c3c',
        width: '100%',
        alignItems: 'center',
    },
    closeTextM: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
export default FormAgendar