import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { colors } from "@/constants/colors";
import { fetchJson } from "@/services/api";
import type { User } from "@/types/user";
import { useRouter } from "expo-router";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Memuat profil pengguna dari API dan memperbarui status layar.
function loadUser(
  setUser: Dispatch<SetStateAction<User | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
) {
  setLoading(true);
  setError(null);
  fetchJson<User>("https://dummyjson.com/users/1")
    .then((user) => setUser(user))
    .catch((error: unknown) => {
      if (typeof error === "string") {
        setError(error);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Gagal memuat profil.");
      }
    })
    .finally(() => setLoading(false));
}

export default function AccountScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function kembaliAman() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  useEffect(() => {
    loadUser(setUser, setLoading, setError);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading message="Memuat profil..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => loadUser(setUser, setLoading, setError)}
        />
      ) : user ? (
        <>
          <Text style={styles.name}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.subtitle}>Eco Warrior • Nasabah Aktif</Text>
        </>
      ) : null}

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
