import { colors } from "@/constants/colors";
import type { CollectionPointRow } from "@/types/home";
import { StyleSheet, Text, View } from "react-native";

// Versi web: react-native-maps tidak mendukung web.
export function TpsMap({
  height = 120,
}: {
  points?: CollectionPointRow[];
  height?: number;
}) {
  return (
    <View style={[styles.box, { minHeight: Math.min(height, 120) }]}>
      <Text style={styles.text}>
        Peta hanya tersedia di aplikasi Android/iOS. Gunakan tombol arah pada daftar TPS untuk membuka Google Maps.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    backgroundColor: colors.mint,
  },
  text: { color: colors.muted, fontSize: 12, textAlign: "center" },
});
