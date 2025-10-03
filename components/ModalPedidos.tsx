import { StopData } from '@/interface/Stop';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PropsPedidos = {
    stops: StopData[] | null;
    viewDetail: boolean;
    setViewDetail: (value: boolean) => void;
    title: string;
    deleteStop: (value: StopData) => void;
}

const ModalPedidos: React.FC<PropsPedidos> = ({ stops, viewDetail, setViewDetail, title, deleteStop }) => {
    const router = useRouter();
    const [showEvidence, setShowEvidence] = useState(false);
    const [evidenceImages, setEvidenceImages] = useState<string[]>([]);



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
                                        {stop.status === 'delivered' &&
                                            <View>
                                                <TouchableOpacity onPress={() => {
                                                    setEvidenceImages(stop.evidence || []);
                                                    setShowEvidence(true);
                                                }}>
                                                    <Text style={{ textDecorationLine: 'underline' }}>Ver Evidencia...</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                        {stop.status === 'to_be_paid' &&
                                            <View>
                                                <TouchableOpacity onPress={() => router.navigate({
                                                    pathname: '/(tabs)/screen/AgendarScreen',
                                                    params: {
                                                        stopId: stop.id,
                                                    },
                                                })}>
                                                    <Text style={{ textDecorationLine: 'underline' }}>Editar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {
                                                    deleteStop(stop);
                                                    setViewDetail(false);

                                                }}>
                                                    <Text style={{ textDecorationLine: 'underline' }}>Eliminar</Text>
                                                </TouchableOpacity>
                                            </View>}
                                    </View>
                                ))}
                            </ScrollView>
                        </>}
                        <TouchableOpacity onPress={() => setViewDetail(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal visible={showEvidence} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Evidencias</Text>
                        <ScrollView horizontal style={{ marginVertical: 10 }}>
                            {evidenceImages.map((uri, idx) => (
                                <TouchableOpacity key={idx} onPress={() => Linking.openURL(uri)}>
                                    <Image
                                        source={{ uri }}
                                        style={styles.previewImage}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setShowEvidence(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
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