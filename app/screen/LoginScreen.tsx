import { UserData } from "@/interface/User";
import { useState } from "react";
//import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { login } from "@/api/User";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import { useLoading } from "@/context/LoadingContext";
import { useToken } from "@/context/TokenContext";
import { useUserContext } from "@/context/UserContext";
import { registerPushToken } from "@/utils/Notifications";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text } from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('')
    const { setUser } = useUserContext();
    const { setIsLoggedIn } = useUserContext();
    const { setToken } = useToken();
    const { setLoading } = useLoading();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!email.trim() && !password.trim()) {
            setError('Los campos son obligatorios');
            return;
        }
        setMessage('');
        setError('');
        try {
            setLoading(true);
            const userData: UserData = { email, password };
            const { data } = await login(userData);
            if (data.user && data.user.role && data.user.role === 'admin') {
                Alert.alert('Error, su cuenta esta registrada como administrador, inicie sesion en la version web');
                setError('Usuario registrao como administrador.');
                return;
            }
            setMessage('Login exitoso');
            setError('');
            setUser(data.user);
            await registerPushToken(data.user.id);
            setToken(data.token); // Guardar el token en el contexto
            setIsLoggedIn(true);
            router.push('/(tabs)/screen/HomeScreen'); // Redirige a la pantalla de inicio
        } catch (error) {
            setError("Error al iniciar sesion");
            Alert.alert('Error', 'No fue posible iniciar sesion, intentalo mas tarde, y si no las has hecho, verifica tu correo');
            console.log(error);
        } finally {
            setLoading(false);

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