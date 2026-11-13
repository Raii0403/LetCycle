import { colors } from "@/constants/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>Coba Lagi</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 12,
    padding: 20,
  },
  message: {
    color: colors.muted,
    textAlign: "center",
  },
  button: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.forest,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "800",
  },
});
