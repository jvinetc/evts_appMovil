import RegisterForm from '@/components/RegisterForm'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Header from '../../components/Header'

const RegisterScreen = () => {
    return (
        <View  style={styles.container}>
            <Header title='Registro' isLoggedIn={false} />
            <RegisterForm />
            <View style={styles.footer}>
                <Text style={styles.footerText}>Para comenzar, registrate!!</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    footer: {
        height: 60,
        backgroundColor: '#007B8A',
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
        alignSelf:'flex-end'
    },
    footerText: { color: 'white' }
})
export default RegisterScreen