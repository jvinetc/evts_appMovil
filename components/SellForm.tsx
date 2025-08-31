import { detailAddres } from '@/api/AddresApi';
import { listComunas } from '@/api/Comunas';
import { uploadImage } from '@/api/Images';
import { createSell, updateSell } from '@/api/Sell';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { IComuna } from '@/interface/Comuna';
import { SellData } from '@/interface/Sell';
import { UserData } from '@/interface/User';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AutoComplete from './AutoComplete';
import ImageModal from './ImageModal';

type Suggestion = {
    placePrediction: {
        placeId: string;
        text: {
            text: string;
        };
    };
};

type sellFormProps = {
    user: UserData | undefined;
    setUser: (user: UserData) => void;
    create: boolean | null;
    setCreate: (create: boolean) => void;
}
const SellForm = ({ user, setCreate, create, setUser }: sellFormProps) => {
    const [sell, setSell] = useState<SellData | undefined>(user?.Sells && user.Sells.length > 0 ? user?.Sells[0] : undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [blockAutocomplete, setBlockAutocomplete] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const { setLoading } = useLoading();
    const { token } = useToken();
    const API_URL = process.env.EXPO_PUBLIC_API_SERVER;
    const [modalVisible, setModalVisible] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (user?.Sells && user.Sells.length === 0) {
            setIsEdit(true);
            return;
        } else {
            setBlockAutocomplete(true);
            setIsEdit(false)
        }
    }, [user, isFocused]);

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
            const { id } = comunas.find(
                (comun: IComuna) => comun.name.trim() === comuna.trim()
            ) as IComuna;
            if (sell) {
                setSell({
                    ...sell,
                    comunaId: id,
                    lat,
                    lng,
                    addresPickup: `${streetName} ${streetNumber}`,
                    addres: `${streetName} ${streetNumber}`,
                });
            }
            setSuggestions([]);
        } catch (error) {
            console.log(error)
        }
    }


    const handleSubmit = async () => {
        if (!sell || !sell.name || !sell.addresPickup || !sell.email) {
            Alert.alert('Error', "Los campos deben ser completados");
            return;
        }
        try {
            setSell({ ...sell, userId: Number(user?.id) });
            setLoading(true);
            const { data } = await createSell(sell, token);
            setUser({ ...user, Sells: [data] });
            setSell(data);
            setIsEdit(false);
            Alert.alert('Exito', 'Su tienda fue creada satisfactoriamente');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No fue posible crear su tienda, intente mas tarde');
        } finally {
            setLoading(false)
        }
    }

    const saveImage = async (imageUri: string) => {
        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            name: `photo_${Date.now()}.jpg`,
            type: 'image/jpeg',
        } as any);

        try {
            setLoading(true);
            const { status, data } = await uploadImage(formData, token, user)
            if (status === 201) {
                setUser({ ...user, Images: [data.image] });
                Alert.alert('Exito', 'La imagen fue grabada correctamente.');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'La imagen no puso ser grabada, intentelo mas tarde');
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async () => {
        if (!sell || !sell.name || !sell.addresPickup || !sell.email) {
            Alert.alert('Error', "Los campos deben ser completados");
            return;
        }
        try {
            setLoading(true);
            await updateSell(sell, token);
            setUser({ ...user, Sells: [sell] });
            Alert.alert('Exito', 'La tienda fue actualizada satisfactoriamnte.');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'La tienda no pudo ser actualizada, intentelo mas tarde');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <View style={styles.avatarContainer}>
                <Image source={user?.Images && user.Images.length > 0 ? { uri: user.Images[0].url } : {
                    uri: 'https://tse2.mm.bing.net/th/id/OIP.SPitBW3YurFj2aUt13oM0wHaEn?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
                }}
                    style={styles.avatar} />
                <TouchableOpacity style={styles.editIcon} onPress={() => setModalVisible(true)}>
                    <Icon name="account-convert" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <ImageModal visible={modalVisible}
                onConfirm={(uri) => saveImage(uri)}
                onCancel={() => setModalVisible(false)} />
            <View style={styles.fieldContainer}>
                <TextInput placeholder="Nombre de tu tienda"
                    placeholderTextColor="#7f8c8d"
                    value={sell?.name}
                    onChangeText={(text) => setSell({ ...sell, name: text })}
                    autoCorrect={false} // Desactiva la autocorrección
                    style={styles.input}
                    editable={isEdit}
                />
            </View>
            <View style={styles.fieldContainer}>
                <TextInput placeholder="Email"
                    placeholderTextColor="#7f8c8d"
                    value={sell?.email}
                    onChangeText={(text) => setSell({ ...sell, email: text })}
                    autoCorrect={false} // Desactiva la autocorrección
                    style={styles.input}
                    autoCapitalize='none'
                    editable={isEdit}
                />
            </View>
            <AutoComplete
                handleSelect={handleSelect}
                data={sell}
                setData={setSell}
                blockAutocomplete={blockAutocomplete}
                setBlockAutocomplete={setBlockAutocomplete}
                setSuggestions={setSuggestions}
                suggestions={suggestions}
                placeHolder='Direccion de retiro'
                isEdit={isEdit}
            />

            {/* Botón */}
            <View style={styles.buttonRow}>
                {user?.Sells && user.Sells.length === 0 && create ?
                    (<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                        <Text style={styles.buttonText}>Crear tienda</Text>
                    </TouchableOpacity>)
                    : !isEdit ?
                        (<TouchableOpacity style={styles.button} onPress={() => setIsEdit(true)}>
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>) :
                        (<TouchableOpacity style={styles.button} onPress={handleUpdate}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>)}
                <TouchableOpacity style={styles.button} onPress={() => setCreate(false)}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 12
    },
    fieldContainer: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#007B8A',
        marginBottom: 20,
    },
    /* input: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 3,
        color: '#2c3e50'
    }, */
    button: {
        backgroundColor: '#007B8A',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignItems: 'center',
        width: '45%',
        alignSelf: 'center',
        justifyContent: 'space-around'
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
    link: { color: '#333', marginBottom: 10 },
    linkResaltado: { color: '#007B8A', fontWeight: 'bold' },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
        width: '100%'
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
    avatarContainer: {
        position: 'relative',
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 20
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#fff',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1ABC9C',
        borderRadius: 16,
        padding: 6,
        elevation: 4,
    },
})

export default SellForm