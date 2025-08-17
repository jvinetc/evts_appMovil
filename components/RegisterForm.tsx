import { register } from '@/api/User';
import { useLoading } from '@/context/LoadingContext';
import { UserData } from '@/interface/User';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterForm = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [passConfirm, setPassConfirm] = useState<string | null>('');
    const [date, setDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const { setLoading } = useLoading();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!user || !user.firstName ||
            !user.lastName || !user.email ||
            !user.password || !user.username ||
            !passConfirm || !date || !user.phone) {
            Alert.alert('Error', 'Los campos deben estar completos');
            return;
        }
        try {
            setLoading(true);
            const { data, status } = await register(user);
            if (status === 201) {
                Alert.alert('Felicidades', data.message);
            }            
            setUser(null);
            setDate(null);
            setPassConfirm('');
            setTimeout(() => {
                router.push('/screen/LoginScreen');
            }, 3000)
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudo realizar el registro, intentelo mas tarde')
        } finally {
            setLoading(false);
        }
    }

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

    const calculateAge = (birthDate: Date): number => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const comparePass = () => {
        if (user && user.password !== passConfirm) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            setPassConfirm('');
            return;
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Icon name="account" size={24} color="#007B8A" />
                <TextInput placeholder="Nombre"
                    placeholderTextColor="#7f8c8d"
                    value={user?.firstName}
                    onChangeText={(text) => setUser({ ...user, firstName: text })}
                    autoCorrect={false} // Desactiva la autocorrección
                    style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="account" size={24} color="#007B8A" />
                <TextInput placeholder="Apellidos"
                    placeholderTextColor="#7f8c8d"
                    value={user?.lastName}
                    onChangeText={(text) => setUser({ ...user, lastName: text })}
                    autoCorrect={false} // Desactiva la autocorrección
                    style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="account" size={24} color="#007B8A" />
                <TextInput placeholder="Username"
                    placeholderTextColor="#7f8c8d"
                    value={user?.username}
                    onChangeText={(text) => setUser({ ...user, username: text })}
                    autoCorrect={false} // Desactiva la autocorrección
                    style={styles.input}
                    autoCapitalize='none' />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="calendar-account-outline" size={24} color="#007B8A" />
                <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
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
            <View style={styles.inputContainer}>
                <Icon name="cellphone-basic" size={24} color="#007B8A" />
                <TextInput style={styles.input}
                    value={user?.phone}
                    keyboardType='phone-pad'
                    onChangeText={(text) => setUser({ ...user, phone: text })}
                    placeholder='Telefono ej:(+56911111111)'
                    placeholderTextColor="#7f8c8d" />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="email-outline" size={24} color="#007B8A" />
                <TextInput placeholder="Correo"
                    placeholderTextColor="#7f8c8d"
                    value={user?.email}
                    onChangeText={(text) => setUser({ ...user, email: text })}
                    autoCapitalize='none' // Evita que se capitalicen las letras
                    autoCorrect={false} // Desactiva la autocorrección
                    keyboardType="email-address"
                    style={styles.input} />
            </View>
            {/* Password */}
            <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={24} color="#007B8A" />
                <TextInput placeholder="Contraseña"
                    placeholderTextColor="#7f8c8d"
                    secureTextEntry={true}
                    style={styles.input} value={user?.password}
                    onChangeText={(text) => setUser({ ...user, password: text })}
                    autoCapitalize='none' // Evita que se capitalicen las letras
                    autoCorrect={false} // Desactiva la autocorrección
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={24} color="#007B8A" />
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

            {/* Botón */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText} >Registrate</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
        padding: '8%',
        gap: 12
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#007B8A',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 3,
        color: '#2c3e50'
    },
    button: {
        backgroundColor: '#007B8A',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center',
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
    link: { color: '#333', marginBottom: 10 },
    linkResaltado: { color: '#007B8A', fontWeight: 'bold' },
})
export default RegisterForm