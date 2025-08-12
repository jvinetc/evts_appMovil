import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({email, setEmail, password, setPassword, handleSubmit}) => {
  return (
    <View style={styles.container}>
                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Icon name="email-outline" size={24} color="#007B8A" />
                        <TextInput placeholder="Correo"
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
                            secureTextEntry
                            style={styles.input} value={password}
                            onChangeText={setPassword}
                            autoCapitalize='none' // Evita que se capitalicen las letras
                            autoCorrect={false} // Desactiva la autocorrección
                        />
                    </View>
    
                    {/* Botón */}
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText} >Iniciar sesión</Text>
                    </TouchableOpacity>
    
                    {/* Link simple */}
                    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
    
                    {/* Link resaltado */}
                    <Text style={styles.linkResaltado}>¿No tienes cuenta? Regístrate</Text>
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
        paddingVertical: 8
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
})
export default LoginForm