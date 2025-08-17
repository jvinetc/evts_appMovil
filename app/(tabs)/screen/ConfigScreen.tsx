import Header from '@/components/Header';
import UserInfo from '@/components/UserInfo';
import { useUserContext } from '@/context/UserContext';
import React from 'react';
import { View } from 'react-native';

const ConfigScreen = () => {
  const { user, setUser } = useUserContext();
  return (
    <>
      <Header title="Configuracion" isLoggedIn={true} current="Config" user={user} />
      <View style={{ height:'100%' }}>
        <UserInfo user={user} setUser={setUser} />
      </View>
    </>
  )
}

export default ConfigScreen