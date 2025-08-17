import { getDataPay } from '@/api/ApiTransbankc';
import Header from '@/components/Header';
import { useLoading } from '@/context/LoadingContext';
import { useToken } from '@/context/TokenContext';
import { VerifyResponse } from '@/interface/ApiTransbnak';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const PaymentSuccess = () => {
  const { authorization_code } = useLocalSearchParams();
  const [dataPay, setDataPay] = useState<VerifyResponse | null>(null);
  const { setLoading } = useLoading();
  const { token } = useToken();
  useEffect(() => {
    const loadDataPay = async () => {
      if (!authorization_code) {
        Alert.alert('Error', "No existe codigo de verificacion");
        return;
      }
      setLoading(true);
      try {
        const { data } = await getDataPay(authorization_code, token);
        setDataPay(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    loadDataPay();
  }, []);

  const handleShare = async () => {
    if (!dataPay) return;
    const content = `
✅ Comprobante de pago

Código de autorización: ${dataPay.authorization_code}
Estado: ${dataPay.status}
Orden de compra: ${dataPay.buy_order}
Tarjeta: **** **** **** ${dataPay.card_detail?.slice(-4)}
Monto: $${dataPay.amount}.-
Fecha: ${dataPay?.createAt ? new Date(dataPay?.createAt).toLocaleString():
            new Date().toLocaleString().toLocaleString()}
    `;
    try {
      await Share.share({ message: content });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo compartir el comprobante');
    }
  };

  return (
    <>
      <Header title="Comprobante de pago" isLoggedIn={true} />
      <View style={styles.container}>
        <View style={styles.receipt}>
          <Text style={styles.title}>✅ Pago exitoso</Text>
          <Text style={styles.label}>Código de autorización:</Text>
          <Text style={styles.value}>{dataPay?.authorization_code}</Text>

          <Text style={styles.label}>Estado del pago:</Text>
          <Text style={styles.value}>{dataPay?.status}</Text>

          <Text style={styles.label}>Orden de compra:</Text>
          <Text style={styles.value}>{dataPay?.buy_order}</Text>

          <Text style={styles.label}>Tarjeta:</Text>
          <Text style={styles.value}>**** **** **** {dataPay?.card_detail?.slice(-4)}</Text>

          <Text style={styles.label}>Monto:</Text>
          <Text style={styles.value}>${dataPay?.amount}.-</Text>

          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>{dataPay?.createAt ? new Date(dataPay?.createAt).toLocaleString():
            new Date().toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>📄 Descargar comprobante</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.navigate('/(tabs)/screen/ProfileScreen')}>
          <Text style={styles.link}>← Regresar al inicio</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  receipt: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    elevation: 4,
    borderColor: '#007B8A',
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ECC71',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007B8A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: '#007B8A',
    fontSize: 16,
  },
});

export default PaymentSuccess