import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AccountScreen() {
  const router = useRouter();

  function kembaliAman() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Budi Santoso</Text>
      <Text style={styles.subtitle}>Eco Warrior • Nasabah Aktif</Text>

      <Pressable style={styles.button} onPress={kembaliAman}>
        <Text style={styles.buttonText}>Kembali ke Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: colors.paleMint,
  },
  name: { color: colors.ink, fontSize: 22, fontWeight: "800" },
  subtitle: { color: colors.muted, marginTop: 4, marginBottom: 24 },
  button: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.forest,
  },
  buttonText: { color: colors.white, fontWeight: "800" },
});
