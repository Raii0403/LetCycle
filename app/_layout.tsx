import { BottomNav } from "@/components/home/bottom-nav";
import { colors } from "@/constants/colors";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

// Route guard: harus di komponen anak agar bisa memakai useAuth().
function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    if (isLoading) return;
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, isLoading, inAuthGroup, router]);

  // Jangan render Stack sebelum status sesi diketahui (cegah flicker).
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.paleMint,
        }}
      >
        <ActivityIndicator size="large" color={colors.forest} />
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.forest },
            headerTintColor: colors.white,
            // Tanpa animasi dorong agar terasa seperti pindah tab.
            animation: "none",
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(app)/marketplace"
            options={{ title: "Marketplace" }}
          />
          <Stack.Screen name="(app)/account" options={{ title: "Akun Saya" }} />
          <Stack.Screen
            name="(app)/DataProduk"
            options={{ title: "Daftar Produk" }}
          />
        </Stack>
      </View>
      {user && !inAuthGroup ? <BottomNav /> : null}
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: colors.forest }}>
        <StatusBar style="light" />
        <RootNavigator />
      </View>
    </AuthProvider>
  );
}
