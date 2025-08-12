import { detailAddres } from '@/api/AddresApi';
import { listComunas } from '@/api/Comunas';
import { listRates } from '@/api/Rate';
import { createStop } from '@/api/Stops';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { IComuna } from '@/interface/Comuna';
import { IRate } from '@/interface/Rate';
import { StopData } from '@/interface/Stop';
import { UserData } from '@/interface/User';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AutoComplete from './AutoComplete';

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
const FormAgendar = ({user}:FormAgendarProps) => {
    const [stop, setStop] = useState<StopData | undefined>();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [blockAutocomplete, setBlockAutocomplete] = useState(false);
    const [rates, setRates] = useState<IRate[]>([]);
    const [isFragile, setIsFragile] = useState(false);
    const [isReturnable, setIsReturnable] = useState(false);
    const {token}= useToken();
    const { setLoading } = useLoading();
    const phoneFormat = /^\+56\s?9\d{8}$|^569\d{8}$/i;

    useEffect(() => {
        const loadRates = async () => {
            setLoading(true);
            try {
                const { data } = await listRates();
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
            const { data } = await detailAddres(placeId);
            const { data: comunas } = await listComunas();
            const { addres, streetName, streetNumber, comuna, lat, lng } = data.data;
            if (!addres || !streetName || !streetNumber || !comuna || !lat || !lng) {
                setSuggestions([]);
                console.error('Datos incompletos de la dirección seleccionada');
                return;
            }
            setBlockAutocomplete(true);
            setStop({ ...stop, addres: `${streetName} ${streetNumber}`, lat, lng })
            const { id } = comunas.find(
                (comun: IComuna) => comun.name.trim() === comuna.trim()
            ) as IComuna;
            if (stop) {
                setStop({...stop, comunaId: id, lat, lng });
            }
            setSuggestions([]);
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        if (!stop ||!stop.addresName || !stop.phone || !stop.addres || !stop.rateId ) {
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
            const {data} = await createStop(stop, token);
            console.log(data);
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
        }finally{
            setLoading(false);
        }     
    }
    return (
        <View style={{ padding: 20 }}>
            <View style={styles.fieldContainer}>
                <TextInput style={styles.input} value={stop?.addresName}
                    onChangeText={(text) => setStop({ ...stop, addresName: text })}
                    placeholder='Nombre y Apellido...' />
            </View>

            <View style={styles.fieldContainer}>
                <TextInput style={styles.input} value={stop?.phone} keyboardType='phone-pad'
                    onChangeText={(text) => setStop({ ...stop, phone: text })} placeholder='Telefono...' />
            </View>
            <AutoComplete
                handleSelect={handleSelect}
                stop={stop}
                setStop={setStop}
                blockAutocomplete={blockAutocomplete}
                setBlockAutocomplete={setBlockAutocomplete}
                setSuggestions={setSuggestions}
                suggestions={suggestions}
            />

            <View style={styles.fieldContainer}>
                <TextInput style={styles.input} value={stop?.notes} multiline
                    onChangeText={(text) => setStop({ ...stop, notes: text })}
                    placeholder='Referencias(Depto/Torre/etc)' />
            </View>
            <View style={styles.fieldContainer}>
                <RNPickerSelect style={{ inputIOS: styles.inputDrop, inputAndroid: styles.inputDrop }}
                    onValueChange={(value) => setStop({ ...stop, rateId: value })}
                    items={rates.map(rate => ({
                        label: `${rate.nameService} - $${rate.price}`,
                        value: rate.id,
                    }))}
                    placeholder={{ label: 'Selecciona un servicio...', value: undefined }}
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
                <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Descargar')}>
                    <MaterialCommunityIcons name="file-excel" size={24} color="#2ECC71" />
                    <Text style={styles.actionText}>Plantilla</Text>
                </TouchableOpacity>

                {/* Subir Excel */}
                <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Subir')}>
                    <MaterialCommunityIcons name="upload" size={24} color="#3498DB" />
                    <Text style={styles.actionText}>Subir Excel</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.tagButton, { backgroundColor: '#199b4fff' }]}>
                <Text style={styles.tagText} onPress={handleSubmit}>GRABAR DESTINATARIO</Text>
            </TouchableOpacity>
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
});
export default FormAgendar