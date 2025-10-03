import { recoveryPass } from '@/api/User';
import { useLoading } from '@/context/LoadingContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LoginFormProps {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    handleSubmit: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ email, setEmail, password, setPassword, handleSubmit }) => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const { setLoading } = useLoading();
    const recPass = async () => {
        setLoading(true);
        try {
            const { data, status } = await recoveryPass(recoveryEmail);
            if (status === 200) {
                console.log('Solicitar recuperación para:', recoveryEmail);
                Alert.alert('Correo enviado', data.message);
            }
            if (status === 206) {
                console.log('Solicitar recuperación para:', recoveryEmail);
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Correo enviado', 'Revisa tu bandeja de entrada.');
        } finally {
            setLoading(false);
            setShowRecoveryModal(false);
        }
    }
    return (
        <View style={styles.container}>
            {/* Email */}
            <View style={styles.inputContainer}>
                <Icon name="email-outline" size={24} color="#007B8A" />
                <TextInput placeholder="Correo"
                    placeholderTextColor="#7f8c8d"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none' // Evita que se capitalicen las letras
                    autoCorrect={false} // Desactiva la autocorrección
                    keyboardType="email-address" style={styles.input} />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={24} color="#007B8A" />
                <TextInput placeholder="Contraseña"
                    placeholderTextColor="#7f8c8d"
                    secureTextEntry={!showPassword}
                    style={styles.input} value={password}
                    onChangeText={setPassword}
                    autoCapitalize='none' // Evita que se capitalicen las letras
                    autoCorrect={false} // Desactiva la autocorrección
                />
                <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                    <Icon
                        name={!showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="#007B8A"
                    />
                </TouchableOpacity>
            </View>

            {/* Botón */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText} >Iniciar sesión</Text>
            </TouchableOpacity>

            {/* Link simple */}
            <TouchableOpacity onPress={() => setShowRecoveryModal(true)}>
                <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            {/* Link resaltado */}
            <TouchableOpacity onPress={() => router.push('/screen/RegisterScreen')}>
                <Text style={styles.linkResaltado}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
            <Modal visible={showRecoveryModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Recuperar contraseña</Text>
                        <Text style={{ marginBottom: 10 }}>Ingresa tu correo para recibir instrucciones:</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="email-outline" size={24} color="#007B8A" />
                            <TextInput
                                placeholder="Correo"
                                placeholderTextColor="#7f8c8d"
                                value={recoveryEmail}
                                onChangeText={setRecoveryEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={styles.input}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                // Aquí puedes llamar a tu API para enviar el correo
                                recPass();
                            }}
                        >
                            <Text style={styles.buttonText}>Enviar instrucciones</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowRecoveryModal(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Cancelar</Text>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
        padding: '30%',
        gap: 12
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#007B8A',
        marginBottom: 20,
        width: '100%'
    },
    input: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 8,
        color: '#2c3e50'
    },
    button: {
        backgroundColor: '#007B8A',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 6,
        marginVertical: 20
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
    link: { color: '#333', marginBottom: 10 },
    linkResaltado: { color: '#007B8A', fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007B8A',
        textAlign: 'center',
    },
    closeButton: {
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    closeText: {
        color: '#007B8A',
        fontWeight: '600',
        fontSize: 16,
    }
})
export default LoginForm