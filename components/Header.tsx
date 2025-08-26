import { UserData } from '@/interface/User';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HeaderProps {
  title: string;
  isLoggedIn: boolean;
  user?: UserData | null;
  current?: string; // Prop opcional para indicar si es la pantalla actual
}
export default function Header({ title, isLoggedIn, user, current }: HeaderProps) {
  const API_URL = process.env.EXPO_PUBLIC_API_SERVER;
  const router = useRouter();
  return (
    <View style={current === "Home" ? styles.header : styles.headerPerfil}>
      {current === "Home" || !isLoggedIn ?
        <Image source={{ uri: 'https://image.freepik.com/free-vector/delivery-logo-template_15146-141.jpg' }} style={styles.logo} resizeMode="contain" />
        : isLoggedIn && user ? (
          <>
            <View style={styles.headerLeft}>
              <Image source={user.Images && user.Images.length > 0 ? { uri: user.Images[0].url } : {
                uri: 'https://tse2.mm.bing.net/th/id/OIP.SPitBW3YurFj2aUt13oM0wHaEn?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
              }}
                style={styles.avatar} />
              <View style={{ marginTop: 30, marginLeft: 20 }}>
                <Text style={styles.welcome}>{user.Sells && user.Sells.length === 0 ? 'Usuraio,' : 'Tienda,'} </Text>
                <Text style={styles.subtitle}> {user.Sells && user.Sells.length > 0 ? user.Sells[0].name : user.username}</Text>
              </View>

              <TouchableOpacity style={styles.perfilLink} onPress={() => router.navigate('/screen/ConfigScreen')}>
                <Text style={styles.perfilText}>Mi Perfil</Text>
              </TouchableOpacity>
            </View>

            {current === 'Profile' ? (
              <>
                <View style={styles.searchContainer}>
                  <Icon name="shopping-search" size={20} color="#888" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar mi pedido"
                    placeholderTextColor="#888"
                  />
                </View>
              </>
            ) : (
              <Text style={styles.headerText}>{title}</Text>
            )}

          </>
        ) : (
          <Text style={styles.headerText}>{title}</Text>
        )}
    </View>
  );
}


const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: height * 0.25,
    backgroundColor: '#007B8A',
    padding: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '80%',
    height: '100%',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  headerPerfil: {
    height: height * 0.25,
    width: '100%',
    backgroundColor: '#007B8A',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'space-between',
  },
  headerText: { color: 'white', fontSize: 24, textAlign: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '90%',
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,

  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // ✅ redondea la imagen
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  welcome: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: -100,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    marginLeft: -100,
  },
  perfilLink: {
    padding: 5,
    marginRight: 2,
  },
  perfilText: {
    color: '#F5F5DC', // color hueso para contraste
    fontWeight: 'bold',
    fontSize: 14,
  },
});