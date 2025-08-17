import { getPayDetail, getPays } from '@/api/Stops';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { IPayment } from '@/interface/Payment';
import { StopData } from '@/interface/Stop';
import { UserData } from '@/interface/User';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HistotialProps = {
    viewHistory: boolean;
    setViewHistory: (value: boolean) => void;
    user: UserData | undefined;
}

const HistorialCompras: React.FC<HistotialProps> = ({ viewHistory, setViewHistory, user }) => {

    const { setLoading } = useLoading();
    const { token } = useToken();
    const [payments, setPayments] = useState<IPayment[] | undefined>();
    const [viewDetail, setViewDetail] = useState(false);
    const [stops, setStops] = useState<StopData[] | null>(null);

    useEffect(() => {
        const loadPays = async () => {
            setLoading(true);
            try {
                if (!user || user.Sells?.length === 0) {
                    Alert.alert('Error', 'Aun no has creado tu tienda, revisa configuracion');
                    return;
                }
                const sellId = user.Sells?.length !== undefined ? user.Sells[0].id : 0;
                const { data } = await getPays(Number(sellId), token);
                setPayments(data);
            } catch (error) {
                console.log(error);
                Alert.alert('Error', 'No se pudieron cargar las compras, intente mas tarde');
                setViewHistory(false);
            } finally {
                setLoading(false);
            }
        }
        loadPays();
    }, [])

    const getDetai = async (item: IPayment) => {
        if (!item) {
            Alert.alert('Error', 'Registro inexistente.');
            return;
        } try {
            setLoading(true);
            const { data } = await getPayDetail(item?.buy_order, token);
            setStops(data);
            setViewDetail(true);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudieron cargar las compras, intente mas tarde');
            setViewDetail(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Modal visible={viewHistory} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Historial de Compras</Text>
                        <ScrollView style={styles.scrollArea}>
                            {payments && payments.map((item, index) => (
                                <View key={index} style={styles.slice}>
                                    <TouchableOpacity onPress={() => getDetai(item)}>
                                        <Text style={styles.sliceTitle}>Boleta #{index + 1}</Text>
                                    </TouchableOpacity>
                                    <Text>Código: {item.authorization_code}</Text>
                                    <Text>Monto: ${item.amount}</Text>
                                    <Text>Estado: {item.status}</Text>
                                    <Text>Orden: {item.buy_order}</Text>
                                    <Text>Tarjeta: **** {item.card_detail?.slice(-4)}</Text>
                                    <Text>Fecha: {item?.createAt ? new Date(item?.createAt).toLocaleString() :
                                        new Date().toLocaleString().toLocaleString()}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setViewHistory(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {viewDetail && stops && <Modal visible={viewDetail} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Detalle de la orden {stops[0].buyOrder}</Text>
                        <ScrollView style={styles.scrollArea}>
                            {stops.map((stop, index) => (
                                <View key={index} style={styles.slice}>
                                    <Text>Nombre: {stop.addresName}</Text>
                                    <Text>Telefono: {stop.phone}</Text>
                                    <Text>Estado: {stop.status}</Text>
                                    <Text>Direccion: {stop.addres}</Text>
                                    <Text>Comuna: {stop.Comuna?.name}</Text>
                                    <Text>Fecha: {stop.createAt ? new Date(stop.createAt).toLocaleString() :
                                        new Date().toLocaleString().toLocaleString()}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setViewDetail(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>}
        </>

    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007B8A',
        textAlign: 'center',
    },
    scrollArea: {
        marginVertical: 10,
    },
    slice: {
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    sliceTitle: {
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    closeButton: {
        backgroundColor: '#007B8A',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    closeText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default HistorialCompras