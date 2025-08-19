import { StopData } from '@/interface/Stop';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PropsPedidos = {
    stops: StopData[] | null;
    viewDetail: boolean;
    setViewDetail: (value: boolean) => void;
    title: string;


}

const ModalPedidos: React.FC<PropsPedidos> = ({ stops, viewDetail, setViewDetail, title }) => {

    return (
        <>
            <Modal visible={viewDetail} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {stops && <>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <ScrollView style={styles.scrollArea}>
                                {stops.map((stop, index) => (
                                    <View key={index} style={styles.slice}>
                                        <Text>Nombre: {stop.addresName}</Text>
                                        <Text>Telefono: {stop.phone}</Text>
                                        <Text>Estado: {stop.status}</Text>
                                        <Text>Direccion: {stop.addres}</Text>
                                        <Text>Comuna: {stop.Comuna?.name}</Text>
                                        <Text>Fecha: {stop.createAt ? new Date(stop.createAt).toLocaleString() :
                                            new Date().toLocaleString()}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </>}
                        <TouchableOpacity onPress={() =>setViewDetail(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    iconLabel: {
        marginLeft: 8,
        color: '#007B8A',
        fontWeight: '600',
    },
});

export default ModalPedidos