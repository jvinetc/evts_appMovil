import { disableStop, listStopByUser } from '@/api/Stops';
import Header from '@/components/Header';
import HistorialCompras from '@/components/HistorialCompras';
import ModalPedidos from '@/components/ModalPedidos';
import PayButton from '@/components/PayButton';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { useUserContext } from '@/context/UserContext';
import { StopData } from '@/interface/Stop';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
    const [stops, setStops] = useState<StopData[] | null>(null);
    const [porPagar, setPorPagar] = useState<StopData[] | null>(null);
    const [stopsModal, setStopsModal] = useState<StopData[] | null>(null);
    const [entregados, setEntregados] = useState<StopData[] | null>(null);
    const [pendientes, setPendientes] = useState<StopData[] | null>(null);
    const [enRetiro, setEnRetiro] = useState<StopData[] | null>(null);
    const [total, setTotal] = useState(0);
    const [viewHistory, setViewHistory] = useState(false);
    const [viewDetail, setViewDetail] = useState(false);
    const [title, setTitle] = useState('');
    const { user } = useUserContext();
    const { token } = useToken();
    const { setLoading } = useLoading();
    const isFocused = useIsFocused();
    useEffect(() => {
        const loadStops = async () => {
            setLoading(true);
            setEnRetiro(null);
            setPendientes(null);
            setEntregados(null);
            setPorPagar(null);
            setTotal(0);
            try {
                if (!user) {
                    Alert.alert('Error', 'EL usuario no esta inicializado')
                } else {
                    const { data } = await listStopByUser(user, token);
                    setStops(data.data);
                    const stps: StopData[] = data.data;
                    let subTotal = 0;
                    stps.map((stop) => {
                        switch (stop.status) {
                            case 'to_be_paid':
                                setPorPagar((prev) => prev ? [...prev, stop] : [stop]);
                                subTotal += Number(stop.Rate?.price);
                                break;
                            case 'delivery':
                                setPendientes((prev) => prev ? [...prev, stop] : [stop]);
                                break;
                            case 'pickUp':
                                setEnRetiro((prev) => prev ? [...prev, stop] : [stop]);
                                break;
                            case 'delivered':
                                setEntregados((prev) => prev ? [...prev, stop] : [stop])
                            default:
                                break;
                        }
                    });
                    setTotal(subTotal);
                }
            } catch (error) {
                console.log("Error", error);
                Alert.alert('Error', 'Las paradas no pudieron ser cargadas o aun no has creado tu tienda, revisa Configuracion');
            } finally {
                setLoading(false);
            }
        }
        loadStops();
    }, [user, isFocused, !stops])

    const deleteStop = async (stop:StopData) => {
        setLoading(true);
        try {
            await disableStop(stop, token);
            Alert.alert('Eliminado', 'Su punto fue eliminado.');
            setStops(null);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }


    return (
        <View>
            <Header title="Perfil" isLoggedIn={true} current="Profile" user={user} />
            <View style={styles.resumenContainer}>
                <TouchableOpacity style={styles.box} onPress={() =>{ 
                    setTitle('EN RETIRO');
                    setStopsModal(enRetiro);
                    setViewDetail(true);
                }}>
                    <View>
                        <Text style={[styles.monto, {alignSelf:'center'}]}>{enRetiro?.length || 0}</Text>
                        <Text style={styles.label}>EN RETIRO</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.box} onPress={() => { 
                    setTitle('PENDIENTES');
                    setStopsModal(pendientes);
                    setViewDetail(true);
                }}>
                    <View>
                        <Text style={[styles.monto, {alignSelf:'center'}]}>{pendientes?.length || 0}</Text>
                        <Text style={styles.label}>PENDIENTES</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.box} onPress={() => { 
                    setTitle('ENTREGADOS');
                    setStopsModal(entregados);
                    setViewDetail(true);
                }}>
                    <View >
                        <Text style={[styles.monto, {alignSelf:'center'}]}>{entregados?.length || 0}</Text>
                        <Text style={styles.label}>ENTREGADOS</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Categorías */}
            <Text style={styles.categoriasTitulo}>Categorías</Text>
            <TouchableOpacity style={styles.categoria} onPress={() => setViewHistory(true)}>
                <Icon name="cube-outline" size={30} color="#007B8A" style={styles.roundedIcon} />
                <Text style={styles.categoriaTexto}>Historial de Compras</Text>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="#888" style={styles.roundedIcon} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.categoria}>
                <Icon name="credit-card-outline" size={30} color="#007B8A" style={styles.roundedIcon} />
                <Text style={styles.categoriaTexto}>Mis Tarjetas</Text>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="#888" style={styles.roundedIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoria}>
                <MaterialIcons name="person-outline" size={30} color="#007B8A" style={styles.roundedIcon} />
                <Text style={styles.categoriaTexto}>Mis Datos</Text>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="#888" style={styles.roundedIcon} />
            </TouchableOpacity> */}


            <View style={styles.resumenContainerP}>
                <TouchableOpacity style={styles.boxP} onPress={() =>{ 
                    setTitle('POR PAGAR');
                    setStopsModal(porPagar);
                    setViewDetail(true);
                }}>
                    <View>
                        <Text style={[styles.monto, {alignSelf:'center'}]}>{porPagar?.length || 0}</Text>
                        <Text style={styles.label}>POR PAGAR</Text>
                    </View>
                </TouchableOpacity>
                <PayButton total={total} porPagar={porPagar} setPorPagar={setPorPagar} user={user} />
            </View>
            {viewHistory && <HistorialCompras setViewHistory={setViewHistory} viewHistory={viewHistory} user={user} />}
            {viewDetail && <ModalPedidos setViewDetail={setViewDetail} stops={stopsModal} title={title} viewDetail={viewDetail} deleteStop={deleteStop} />}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    resumenContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        padding: 10,
    },
    resumenContainerP: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 30
    },
    box: {
        backgroundColor: '#007B8A',
        borderRadius: 15,
        padding: 15,
        width: '30%',
        alignItems: 'center',
    },
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
    },
    categoriasTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 20,
    },
    categoria: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    categoriaTexto: {
        flex: 1,
        marginLeft: 30,
        fontSize: 16,
    },
    roundedIcon: {
        borderRadius: 25,
        elevation: 4,

    },
});
export default ProfileScreen