import { ModalInfo } from "@/components/ModalInfo";
import { useUserContext } from "@/context/UserContext";
import React, { useRef, useState } from "react";
import { Animated, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from "../../../components/Header";

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const whatsappNumber = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER || '56912345678';
  const instagramUrl = process.env.EXPO_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/tu_cuenta';
  const iconScale = useRef(new Animated.Value(1)).current;
  const [visible, setVisible] = useState(false);
  const { isLoggedIn, user } = useUserContext();

  const handlePressWsp = () => {
    Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start(() => {
      Linking.openURL(`https://wa.me/${whatsappNumber}?text=Hola, necesito ayuda`);
    });
  };

  const handlePressIg = () => {
    Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start(() => {
      Linking.openURL(instagramUrl);
    });
  };
  return (
    <>
      <Header title="Inicio" isLoggedIn={isLoggedIn} current="Home" />
      <ModalInfo visible={visible} setVisible={setVisible} />
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => setVisible(true)}>
          <Animated.View style={[styles.iconWrapper, { transform: [{ scale: iconScale }] }]}>
            <Icon name="map-marker" size={60} color="#FF8C00" />
          </Animated.View>
          <View style={styles.cardText}>
            <Text style={styles.title}>¡Cobertura y Precios!</Text>
            <Text style={styles.subtitle}>(Busca tu servicio)</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={handlePressWsp}
        >
          <Animated.View style={[styles.iconWrapper, { transform: [{ scale: iconScale }] }]}>
            <Icon name="whatsapp" size={60} color="#25D366" />
          </Animated.View>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>¡WhatsApp!</Text>
            <Text style={styles.subtitle}>(Ayuda en línea)</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={handlePressIg}
        >
          <Animated.View style={[styles.iconWrapper, { transform: [{ scale: iconScale }] }]}>
            <Icon name="instagram" size={60} color="#C13584" />
          </Animated.View>
          <View style={styles.cardText}>
            <Text style={styles.title}>¡Instagram!</Text>
            <Text style={styles.subtitle}>(Ve nuestrs posts)</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>

  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 20,
    paddingLeft: 90,
    paddingRight: 20,
    width: '70%',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 25
  },
  cardText: {
    marginLeft: 15,
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  iconWrapper: {
    position: 'absolute',
    left: -15,
    top: '60%',
    transform: [{ translateY: -20 }],
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 5,
    elevation: 6
  },
  textWrapper: {
    flex: 1
  },
});