// Muhammad Iqbal Habibi 202410370110231


import { AddProductModal } from "@/components/AddProductModal";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { colors } from "@/constants/colors";
import { formatRupiah, type Product } from "@/data/marketplace";
import { categoryLabels, getProducts } from "@/services/productService";
import { Ionicons } from "@expo/vector-icons";
import {
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import {
    Alert,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";

// Memuat barang dan memperbarui tampilan sesuai hasil permintaan API.
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
      setError("Gagal memuat barang.");
    }
  } finally {
    setLoading(false);
  }
}

function ProductCard({ item }: { item: Product }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel={item.name}
      />
      <View style={styles.cardBody}>
        <Text style={styles.conditionBadge}>{item.condition}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>{formatRupiah(item.price)}</Text>
        <View style={styles.sellerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.sellerName.charAt(0)}</Text>
          </View>
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName} numberOfLines={1}>
              {item.sellerName}
            </Text>
            <View style={styles.cityRow}>
              <Ionicons
                name="location-outline"
                size={11}
                color={colors.muted}
              />
              <Text style={styles.city} numberOfLines={1}>
                {item.city}
              </Text>
            </View>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          style={styles.contactButton}
          onPress={() =>
            Alert.alert(
              "Hubungi penjual",
              `Kirim pesan ke ${item.sellerName} tentang "${item.name}".`,
            )
          }
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={15}
            color={colors.white}
          />
          <Text style={styles.contactText}>Hubungi Penjual</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function MarketplaceScreen() {
  const { width } = useWindowDimensions();
  // Jumlah kolom menyesuaikan lebar layar.
  const columns = width >= 900 ? 3 : 2;

  const [query, setQuery] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [category, setCategory] = useState<string>("semua");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

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

  // Hasil filter dihitung ulang ketika data, keyword, atau kategori berubah.
  const results = useMemo(
    () =>
      products.filter(
        (item) =>
          (category === "semua" || item.category === category) &&
          item.name.toLowerCase().includes(keyword),
      ),
    [products, keyword, category],
  );

  const categories = ["semua", ...Object.keys(categoryLabels)];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            placeholder="Cari barang daur ulang..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Jual barang"
          style={styles.sellButton}
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.sellText}>Jual</Text>
        </Pressable>
      </View>

      <AddProductModal
        visible={showForm}
        onClose={() => setShowForm(false)}
        onAdded={(product) => setProducts((prev) => [product, ...prev])}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipList}
      >
        {categories.map((key) => {
          const active = category === key;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCategory(key)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {key === "semua" ? "Semua" : categoryLabels[key]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? (
        <Loading message="Memuat barang..." />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => {
            void loadProducts(setProducts, setLoading, setError);
          }}
        />
      ) : (
        <FlatList
          key={columns}
          data={results}
          numColumns={columns}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>Tidak ada barang.</Text>
          }
          renderItem={({ item }) => <ProductCard item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: colors.paleMint,
  },
  topRow: { flexDirection: "row", gap: 8 },
  sellButton: {
    minHeight: 46,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 12,
    backgroundColor: colors.forest,
  },
  sellText: { color: colors.white, fontWeight: "800" },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#DCE5D7",
  },
  input: { flex: 1, minHeight: 44, color: colors.ink },
  chipScroll: { flexGrow: 0, marginVertical: 10 },
  chipList: { gap: 8 },
  chip: {
    minHeight: 38,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "#E9F0E7",
  },
  chipActive: { backgroundColor: colors.forest },
  chipText: { color: "#49634E", fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: colors.white, fontWeight: "800" },
  list: { paddingBottom: 16 },
  row: { gap: 10 },
  card: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E9EEE5",
  },
  image: { width: "100%", aspectRatio: 1, backgroundColor: colors.mint },
  cardBody: { padding: 10, gap: 6 },
  conditionBadge: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    color: colors.deepForest,
    backgroundColor: "#DDF1D8",
    fontSize: 9,
    fontWeight: "800",
  },
  name: {
    minHeight: 34,
    color: colors.ink,
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 17,
  },
  price: { color: colors.green, fontWeight: "800", fontSize: 15 },
  sellerRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gold,
  },
  avatarText: { color: colors.deepForest, fontWeight: "800", fontSize: 12 },
  sellerInfo: { flex: 1 },
  sellerName: { color: colors.ink, fontSize: 11, fontWeight: "700" },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  city: { color: colors.muted, fontSize: 10, flexShrink: 1 },
  contactButton: {
    minHeight: 38,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.forest,
  },
  contactText: { color: "#FFFFFF", fontWeight: "800", fontSize: 11 },
  empty: { textAlign: "center", color: colors.muted, marginTop: 24 },
});
