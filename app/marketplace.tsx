import { colors } from "@/constants/colors";
import { formatRupiah, products, type Product } from "@/data/marketplace";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function MarketplaceScreen() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>(products);

  // Dijalankan setiap kali query berubah
  useEffect(() => {
    const keyword = query.trim().toLowerCase();
    setResults(
      products.filter((item) => item.name.toLowerCase().includes(keyword)),
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Cari kategori sampah..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Tidak ada hasil.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name={item.icon} size={24} color={colors.green} />
            <View style={styles.cardText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{formatRupiah(item.price)} / kg</Text>
            </View>
            {item.stock !== undefined && (
              <Text style={styles.stock}>Stok {item.stock}</Text>
            )}
          </View>
        )}
      />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Kembali</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.paleMint },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DCE5D7",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  cardText: { flex: 1 },
  name: { color: colors.ink, fontWeight: "800", fontSize: 14 },
  price: { color: colors.muted, fontSize: 12, marginTop: 2 },
  stock: { color: colors.green, fontSize: 12, fontWeight: "700" },
  empty: { textAlign: "center", color: colors.muted, marginTop: 24 },
  backButton: {
    minHeight: 44,
    marginTop: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.forest,
  },
  backText: { color: colors.white, fontWeight: "800" },
});
