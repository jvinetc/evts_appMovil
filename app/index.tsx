import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screen/LoginScreen";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <LoginScreen />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Bienvenido a la app</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    footer: {
        height: 60,
        backgroundColor: '#007B8A',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerText: { color: 'white' }
});
