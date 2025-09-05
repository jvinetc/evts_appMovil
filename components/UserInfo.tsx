import { update } from '@/api/User';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { UserData } from '@/interface/User';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    const [date, setDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const { setLoading } = useLoading();
    const { token } = useToken();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (create) setCreate(false);
        setDate(user && user.birthDate ? new Date(user.birthDate) : null)
    }, [user]);

    const comparePass = () => {
        if (user && user.password !== passConfirm) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            setPassConfirm('');
            return;
        }
    }

    const calculateAge = (birthDate: Date): number => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleDateChange = async (_event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            const ageLocal = Number(calculateAge(selectedDate));
            if (ageLocal < 18) {
                Alert.alert('Error', 'Para registrarse debe tener mayoria de edad.')
                setDate(null);
                return;
            }
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setUser({ ...user, age: ageLocal, birthDate: formattedDate });
        }
    }

    const handleSubmit = async () => {
        if (!user || !user.firstName ||
            !user.lastName || !user.email ||
            !user.username || !date || !user.phone) {
            Alert.alert('Error', 'Los campos deben estar completos');
            return;
        }
        try {
            setLoading(true);
            const { data, status } = await update(user, token);
            if (status === 200) {
                Alert.alert('Felicidades', 'Usuario actualizado correctamente');
            }
            setDate(null);
            setPassConfirm('');
            setIsEdit(false);
            setUser({...user, ...data})
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudo actualizar, intentelo mas tarde')
        } finally {
            setLoading(false);
        }
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
                    <View style={styles.fieldContainer}>
                        <TouchableOpacity onPress={() => isEdit && setShowPicker(true)} style={styles.input}>
                            <Text style={date ? { color: '#2c3e50' } : { color: '#7f8c8d' }}>
                                {date ? date.toLocaleDateString() : 'Selecciona tu fecha de nacimiento'}
                            </Text>
                        </TouchableOpacity>
                        {showPicker && (
                            <DateTimePicker
                                value={date || new Date(2000, 0, 1)}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                maximumDate={new Date()}
                                onChange={handleDateChange}
                            />
                        )}
                    </View>
                </>}
                {isEdit && <>
                    {/* Password */}
                    <View style={styles.fieldContainer}>
                        <TextInput placeholder="Contraseña"
                            placeholderTextColor="#7f8c8d"
                            secureTextEntry={true}
                            style={styles.input} value={user?.password}
                            onChangeText={(text) => setUser({ ...user, password: text })}
                            autoCapitalize='none' // Evita que se capitalicen las letras
                            autoCorrect={false} // Desactiva la autocorrección
                        />
                    </View>
                    <View style={styles.fieldContainer}>
                        <TextInput placeholder="Confirmar contraseña"
                            placeholderTextColor="#7f8c8d"
                            secureTextEntry={true}
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
        color: '#2c3e50'
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
        width: '100%'
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 2,
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