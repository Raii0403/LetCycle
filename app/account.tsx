import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { colors } from "@/constants/colors";
import { fetchJson } from "@/services/api";
import type { User } from "@/types/user";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { StyleSheet, Text, View } from "react-native";

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: 24,
    justifyContent: "center",
    backgroundColor: colors.paleMint,
  },
  name: { color: colors.ink, fontSize: 22, fontWeight: "800" },
  subtitle: { color: colors.muted, marginTop: 4, marginBottom: 24 },
});
