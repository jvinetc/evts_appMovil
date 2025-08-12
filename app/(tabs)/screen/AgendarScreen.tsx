import FormAgendar from '@/components/FormAgendar';
import Header from '@/components/Header';
import { useUserContext } from '@/context/UserContext';
import React from 'react';
import { View } from 'react-native';



const AgendarScreen = () => {
    const { user } = useUserContext();
    return (
        <View>
            <Header title="DATOS DESTINATARIO" isLoggedIn={true} current="Agendar" user={user} />
            {user && <FormAgendar user={user} />}
        </View>
    )
}



export default AgendarScreen