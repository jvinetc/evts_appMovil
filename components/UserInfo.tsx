import { UserData } from '@/interface/User';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SellForm from './SellForm';

type userInfoProps = {
    user: UserData | undefined;
    setUser: (user: UserData | undefined) => void;
}

const UserInfo = ({ user, setUser }: userInfoProps) => {
    const [isEdit, setIsEdit] = useState(false);
    const [passConfirm, setPassConfirm] = useState('');
    const [create, setCreate] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (create) setCreate(false);
    }, []);

    const comparePass = () => {
        if (user && user.password !== passConfirm) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            setPassConfirm('');
            return;
        }
    }

    const handleSubmit = async () => {
        console.log(user)
    }

    return (
        <View style={{ padding: 20 }}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                extraScrollHeight={40}
                keyboardShouldPersistTaps="handled"
            >
                {!create && <>
                    <View style={styles.fieldContainer}>
                        <TextInput placeholder="Nombre"
                            placeholderTextColor="#7f8c8d"
                            value={user?.firstName}
                            onChangeText={(text) => setUser({ ...user, firstName: text })}
                            autoCorrect={false} // Desactiva la autocorrección
                            style={styles.input}
                            editable={isEdit}
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput placeholder="Apellidos"
                            placeholderTextColor="#7f8c8d"
                            value={user?.lastName}
                            onChangeText={(text) => setUser({ ...user, lastName: text })}
                            autoCorrect={false} // Desactiva la autocorrección
                            style={styles.input}
                            editable={isEdit}
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput placeholder="Username"
                            placeholderTextColor="#7f8c8d"
                            value={user?.username}
                            onChangeText={(text) => setUser({ ...user, username: text })}
                            autoCorrect={false} // Desactiva la autocorrección
                            style={styles.input}
                            autoCapitalize='none'
                            editable={isEdit}
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput style={styles.input}
                            value={user?.phone}
                            keyboardType='phone-pad'
                            onChangeText={(text) => setUser({ ...user, phone: text })}
                            placeholder='Telefono ej:(+56911111111)'
                            placeholderTextColor="#7f8c8d"
                            editable={isEdit}
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput placeholder="Correo"
                            placeholderTextColor="#7f8c8d"
                            value={user?.email}
                            onChangeText={(text) => setUser({ ...user, email: text })}
                            autoCapitalize='none' // Evita que se capitalicen las letras
                            autoCorrect={false} // Desactiva la autocorrección
                            keyboardType="email-address"
                            style={styles.input}
                            editable={isEdit}
                        />
                    </View>
                </>}
                {isEdit && <>
                    {/* Password */}
                    <View style={styles.fieldContainer}>
                        <TextInput placeholder="Contraseña"
                            placeholderTextColor="#7f8c8d"
                            secureTextEntry={isEdit}
                            style={styles.input} value={user?.password}
                            onChangeText={(text) => setUser({ ...user, password: text })}
                            autoCapitalize='none' // Evita que se capitalicen las letras
                            autoCorrect={false} // Desactiva la autocorrección
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput placeholder="Confirmar contraseña"
                            placeholderTextColor="#7f8c8d"
                            secureTextEntry={isEdit}
                            style={styles.input} value={passConfirm || ''}
                            onChangeText={(text) => setPassConfirm(text)}
                            autoCapitalize='none' // Evita que se capitalicen las letras
                            autoCorrect={false} // Desactiva la autocorrección
                            onBlur={comparePass}
                        />
                    </View>
                </>}


                {isEdit && <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleSubmit}>
                        <Text style={styles.actionText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => setIsEdit(false)}>
                        <Text style={styles.actionText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>}

                {/* Botón */}
                {!isEdit && !create && <>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setIsEdit(true);
                            setUser({ ...user, password: '' });
                        }}>
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>
                        {user?.Sells && user.Sells.length === 0 ?
                            (<TouchableOpacity style={styles.button} onPress={() => setCreate(true)}>
                                <Text style={styles.buttonText}>Crea tu tienda</Text>
                            </TouchableOpacity>)
                            :
                            (<TouchableOpacity style={styles.button} onPress={() => setCreate(true)}>
                                <Text style={styles.buttonText}>Ver tu tienda</Text>
                            </TouchableOpacity>)}
                    </View>
                </>}
                {create &&
                    <SellForm user={user} setCreate={setCreate} create={create} setUser={setUser} />
                }
            </KeyboardAwareScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingBottom: 120,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#007B8A',
        marginBottom: 20,
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
})
export default UserInfo