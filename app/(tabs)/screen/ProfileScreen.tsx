import Header from '@/components/Header';
import { useUserContext } from '@/context/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
    const { user } = useUserContext();
    return (
        <View>
            <Header title="Perfil" isLoggedIn={true} current="Profile" user={user} />
            <View style={styles.resumenContainer}>
                <View style={styles.box}>
                    <Text style={styles.monto}>$0</Text>
                    <Text style={styles.label}>TOTAL A PAGAR</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.monto}>0</Text>
                    <Text style={styles.label}>ENTREGADOS</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.monto}>0</Text>
                    <Text style={styles.label}>PENDIENTES</Text>
                </View>
            </View>

            {/* Categorías */}
            <Text style={styles.categoriasTitulo}>Categorías</Text>
            <TouchableOpacity style={styles.categoria}>
                <Icon name="cube-outline" size={30} color="#007B8A" style={styles.roundedIcon} />
                <Text style={styles.categoriaTexto}>Historial de Envíos</Text>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="#888" style={styles.roundedIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoria}>
                <Icon name="credit-card-outline" size={30} color="#007B8A" style={styles.roundedIcon} />
                <Text style={styles.categoriaTexto}>Mis Tarjetas</Text>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="#888" style={styles.roundedIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoria}>
                <MaterialIcons name="person-outline" size={30} color="#007B8A" style={styles.roundedIcon} />
                <Text style={styles.categoriaTexto}>Mis Datos</Text>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="#888" style={styles.roundedIcon} />
            </TouchableOpacity>
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
    box: {
        backgroundColor: '#007B8A',
        borderRadius: 15,
        padding: 15,
        width: '30%',
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