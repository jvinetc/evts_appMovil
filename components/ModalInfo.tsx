import { listComunas } from '@/api/Comunas';
import { listRates } from '@/api/Rate';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { IComuna } from '@/interface/Comuna';
import { IRate } from '@/interface/Rate';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ModalProps {
    visible: boolean;
    setVisible: (value: boolean) => void;
}
export const ModalInfo: React.FC<ModalProps> = ({ visible, setVisible }) => {
    const [filtradas, setFiltradas] = useState<IRate[]>([]);
    const [comunas, setComunas] = useState<IComuna[]>([]);
    const [rates, setRates] = useState<IRate[]>([]);
    const { setLoading } = useLoading();
    const { token } = useToken();

    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const abrirModal = () => {
            if (visible) return;
            setBusqueda('');
            loadComunas();
            loadRates();
        };
        abrirModal();
    }, [visible]);


    const loadComunas = async () => {
        try {
            setLoading(true);
            const { data } = await listComunas(token);
            setComunas(data);
            //setFiltradas(data);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const loadRates = async () => {
        try {
            setLoading(true);
            const { data } = await listRates(token);
            setRates(data);
            setFiltradas(data);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const cerrarModal = () => setVisible(false);

    const filtrar = (texto: string) => {
        setBusqueda(texto);
        const resultado = rates.filter(c =>
            c.nameService.toLowerCase().includes(texto.toLowerCase())
        );
        setFiltradas(resultado);
    };

    return (
        <>
            <Modal visible={visible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Buscar Tarifas</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Busqueda..."
                            placeholderTextColor="#7f8c8d"
                            value={busqueda}
                            onChangeText={filtrar}
                        />
                        <FlatList
                            data={filtradas}
                            keyExtractor={(item) => item.nameService}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.item}>
                                    <Text>{item.nameService}</Text>
                                    <Text>{item.price}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={cerrarModal} style={styles.closeButton}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        marginVertical: 10,
        elevation: 3,
        alignItems: 'center'
    },
    iconWrapper: {
        marginRight: 15
    },
    icon: {
        fontSize: 30
    },
    textWrapper: {
        flex: 1
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007B8A'
    },
    subtitle: {
        fontSize: 14,
        color: '#666'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 20,
        padding: 20,
        elevation: 5
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
    },
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end'
    },
    closeText: {
        color: '#007B8A',
        fontWeight: 'bold'
    }
});