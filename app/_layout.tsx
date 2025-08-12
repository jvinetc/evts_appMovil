import { LoadingProvider } from "@/context/LoadingContext";
import { TokenProvider } from "@/context/TokenContext";
import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <LoadingProvider>
      <UserProvider>
        <TokenProvider>
          <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </View>
        </TokenProvider>
      </UserProvider>
    </LoadingProvider>
  );
}
