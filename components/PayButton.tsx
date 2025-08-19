import { verifyPay } from '@/api/ApiTransbankc';
import { pay } from '@/api/Stops';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { StopData } from '@/interface/Stop';
import { UserData } from '@/interface/User';
import { router } from 'expo-router'; // o useNavigation()
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type payProps = {
    total: number;
    porPagar: StopData[] | null;
    setPorPagar: React.Dispatch<React.SetStateAction<StopData[] | null>>;
    user: UserData | undefined;
}

const PayButton = ({ total, porPagar, setPorPagar, user }: payProps) => {
    const { token } = useToken();
    const { setLoading } = useLoading();
    const API_URL = process.env.EXPO_PUBLIC_API_SERVER;

    const handlePay = async () => {
        if (!user) {
            Alert.alert("Error", 'Este usuario no tiene sesion iniciada');
            return;
        }
        if (total === 0) {
            Alert.alert('Felicidades', 'No registra saldos pendientes.');
            return;
        }
        try {
            setLoading(true);
            const sessionId = `SID-${Date.now()}-${user && user.Sells !== undefined && user.Sells[0].id}`;
            const returnUrl = `${API_URL}/webpay-return`;
            const { data } = await pay(porPagar, total, sessionId, returnUrl, token);
            const { token: payToken, url } = data;
            const fullUrl = `${url}?token_ws=${payToken}`;
            const redirectUrl = 'appenvios://(tabs)/screen/ProfileScreen';
            const result = await WebBrowser.openAuthSessionAsync(fullUrl, redirectUrl);
            console.log('result:', result);
            if (result.type === 'success' && result.url.includes('token_ws')) {
                console.log('result.url:', result.url);
                const token_ws = new URL(result.url).searchParams.get('token_ws');
                const { data, status } = await verifyPay(token_ws, token);
                if (status === 200) {
                    Alert.alert('Felicidades', 'Su pago fue efectuado con exito.');
                    router.push({
                        pathname: '/screen/payment_success',
                        params: {
                            authorization_code: data.authorization_code
                        },
                    });
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Su pago no se pudo ejecutar, intentelo mas tarde.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.boxP}>
            <TouchableOpacity onPress={handlePay}>
                <Text style={styles.monto}>${total.toLocaleString('Es-es') || 0}</Text>
                <Text style={styles.label}>TOTAL A PAGAR</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    boxP: {
        backgroundColor: '#007B8A',
        borderRadius: 15,
        padding: 15,
        width: '48%',
        alignItems: 'center',
    },
    monto: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    label: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    }
});

export default PayButton