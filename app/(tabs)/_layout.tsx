import PageLoad from "@/components/PageLoad";
import { useLoading } from "@/context/LoadingContext";
import { useUserContext } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from '../../components/LoginScreen';

export default function TabLayout() {
    const { isLoggedIn } = useUserContext(); // Obtiene el estado de autenticación del contexto
    const { isLoading } = useLoading(); // Obtiene el estado de carga del contexto
    if (!isLoggedIn) {
        // Solo muestra el formulario si no ha iniciado sesión
        return (
            <View style={styles.container}>
                <LoginScreen />
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Bienvenido a la app</Text>
                </View>
            </View>
        );
    }

    return (
        <>
            {isLoading && <PageLoad />}
            <Tabs screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#007B8A',
                    height: 60,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    position: 'absolute',
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#F5F5DC',
                tabBarLabelStyle: { fontWeight: 'bold' },
                headerShown: false
            }}>
                <Tabs.Screen name="screen/HomeScreen"
                    options={{
                        title: "Inicio",
                        headerShown: false,
                        tabBarIcon: ({ color, size }) =>
                            (<Ionicons name="home" color={color} size={size} />)
                    }} />
                <Tabs.Screen name="screen/ProfileScreen"
                    options={{
                        title: "Mi perfil",
                        headerShown: false,
                        tabBarIcon: ({ color, size }) =>
                            (<Ionicons name="storefront" color={color} size={size} />)
                    }} />
                    <Tabs.Screen name="screen/AgendarScreen"
                    options={{
                        title: "Agendar",
                        headerShown: false,
                        tabBarIcon: ({ color, size }) =>
                            (<Ionicons name="calendar" color={color} size={size} />)
                    }} />
                    <Tabs.Screen name="screen/ConfigScreen"
                    options={{
                        title: "Configuración",
                        headerShown: false,
                        tabBarIcon: ({ color, size }) =>
                            (<Ionicons name="cog" color={color} size={size} />)
                    }} />
            </Tabs>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    footer: {
        height: 60,
        backgroundColor: '#007B8A',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerText: { color: 'white' }
});