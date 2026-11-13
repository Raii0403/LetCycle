import { colors } from "@/constants/colors";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { formatRupiah, type Product } from "@/data/marketplace";
import { getProducts } from "@/services/productService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Memuat produk dan memperbarui tampilan sesuai hasil permintaan API.
async function loadProducts(
  setProducts: Dispatch<SetStateAction<Product[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
) {
  setLoading(true);
  setError(null);
  try {
    const data = await getProducts();
    setProducts(data);
  } catch (error) {
    if (typeof error === "string") {
      setError(error);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Gagal memuat produk.");
    }
  } finally {
    setLoading(false);
  }
}

export default function MarketplaceScreen() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dijalankan setiap kali query berubah: tunggu 300 ms setelah user berhenti
  // mengetik, baru simpan sebagai keyword (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(query.trim().toLowerCase());
    }, 300);

    // Cleanup: batalkan timer lama kalau user masih mengetik
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    void loadProducts(setProducts, setLoading, setError);
  }, []);

  // Hasil filter dihitung ulang ketika data produk atau keyword berubah.
  const results = useMemo(
    () => products.filter((item) => item.name.toLowerCase().includes(keyword)),
    [products, keyword],
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Cari kategori sampah..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {loading ? (
        <Loading message="Memuat produk..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => {
            void loadProducts(setProducts, setLoading, setError);
          }}
        />
      ) : (
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
      )}

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
