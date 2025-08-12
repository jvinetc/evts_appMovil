import Header from '@/components/Header';
import { useUserContext } from '@/context/UserContext';
import React from 'react';
import { View } from 'react-native';

const ConfigScreen = () => {
    const { user } = useUserContext();
  return (
    <View>
        <Header title="Configuración" isLoggedIn={true} current="Config" user={user} />
    </View>
  )
}

export default ConfigScreen