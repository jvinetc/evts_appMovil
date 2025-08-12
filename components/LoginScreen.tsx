import { UserData } from "@/interface/User";
import { useState } from "react";
//import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import LoginForm from "@/components/LoginForm";
import { useToken } from "@/context/TokenContext";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { StyleSheet, Text } from 'react-native';
import { login } from "../api/User";
import Header from "./Header";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('')
    const { setUser } = useUserContext();
    const { setIsLoggedIn } = useUserContext();
    const { setToken } = useToken();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!email.trim() && !password.trim()) {
            setError('Los campos son obligatorios');
            return;
        }
        try {
            const userData: UserData = { email, password };
            const { data } = await login(userData);
            setMessage('Login exitoso');
            setError('');
            setUser(data.user);
            setToken(data.token); // Guardar el token en el contexto
            setIsLoggedIn(true);    
            router.push('/(tabs)/screen/HomeScreen'); // Redirige a la pantalla de inicio
        } catch (error) {
            setError("Error al iniciar sesion");
            console.error(error);
        }


    };

    return (
        <>
            <Header title="Login" isLoggedIn={false} user={null} />
            <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <Text style={styles.success}>{message}</Text> : null}
        </>
    )
}

const styles = StyleSheet.create({
    error: { color: 'red', backgroundColor: '#FDD' },
    success: { color: 'green', backgroundColor: '#DFD' },
});