import { BottomNav } from "@/components/home/bottom-nav";
import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.forest }}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.forest },
            headerTintColor: colors.white,
            // Tanpa animasi dorong agar terasa seperti pindah tab.
            animation: "none",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="marketplace" options={{ title: "Marketplace" }} />
          <Stack.Screen name="account" options={{ title: "Akun Saya" }} />
        </Stack>
      </View>
      <BottomNav />
    </View>
  );
}
