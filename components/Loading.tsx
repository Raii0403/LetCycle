import { colors } from "@/constants/colors";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function Loading({ message = "Memuat data..." }: { message?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.green} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },
  message: {
    color: colors.muted,
    fontSize: 13,
  },
});
