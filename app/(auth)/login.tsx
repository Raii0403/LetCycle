import { colors } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleAuth() {
    if (loading) return;

    const cleanEmail = email.trim();
    const cleanUsername = username.trim();

    if (!cleanEmail || !password) {
      Alert.alert("Data belum lengkap", "Email dan password wajib diisi.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Password terlalu pendek", "Minimal 6 karakter.");
      return;
    }
    if (isRegistering && !cleanUsername) {
      Alert.alert("Data belum lengkap", "Username wajib diisi saat daftar.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { username: cleanUsername } },
        });
        if (error) throw error;
        Alert.alert("Berhasil", "Akun berhasil dibuat!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
        // Redirect ditangani otomatis oleh route guard di _layout.
      }
    } catch (e: unknown) {
      Alert.alert(
        isRegistering ? "Pendaftaran gagal" : "Login gagal",
        e instanceof Error ? e.message : "Terjadi kesalahan.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.brand}>LetsCycle</Text>
          <Text style={styles.title}>
            {isRegistering ? "Buat Akun" : "Masuk"}
          </Text>

          {isRegistering && (
            <>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Nama panggilan"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="nama@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Minimal 6 karakter"
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                {isRegistering ? "Daftar" : "Masuk"}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => setIsRegistering((v) => !v)}
            disabled={loading}
          >
            <Text style={styles.toggle}>
              {isRegistering
                ? "Sudah punya akun? Masuk di sini"
                : "Belum punya akun? Daftar di sini"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.paleMint },
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
  card: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    gap: 6,
  },
  brand: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: { color: colors.ink, fontSize: 26, fontWeight: "800", marginBottom: 12 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#D4E0D3",
    backgroundColor: colors.paleMint,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 15,
  },
  button: {
    marginTop: 18,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontWeight: "800", fontSize: 15 },
  toggle: {
    color: colors.green,
    textAlign: "center",
    marginTop: 16,
    fontWeight: "600",
  },
});
