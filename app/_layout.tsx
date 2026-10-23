import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.forest },
          headerTintColor: colors.white,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="marketplace" options={{ title: "Marketplace" }} />
        <Stack.Screen name="account" options={{ title: "Akun Saya" }} />
      </Stack>
    </>
  );
}
