import { AddProductModal } from "@/components/AddProductModal";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { colors } from "@/constants/colors";
import { formatRupiah, type Product } from "@/data/marketplace";
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
} from "@/services/favoriteService";
import {
  categoryLabels,
  getProducts,
  removeProduct,
} from "@/services/productService";
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
  RefreshControl,
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
  forceRefresh = false,
) {
  setLoading(true);
  setError(null);
  try {
    const data = await getProducts(forceRefresh);
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

// Memuat id barang favorit milik user dari Supabase.
async function loadFavorites(
  setFavoriteIds: Dispatch<SetStateAction<Set<string>>>,
) {
  try {
    const rows = await fetchFavorites();
    setFavoriteIds(new Set(rows.map((r) => r.product_id)));
  } catch (e) {
    Alert.alert("Favorit", e instanceof Error ? e.message : "Gagal memuat favorit.");
  }
}

function ProductCard({
  item,
  isFavorite,
  onToggleFavorite,
  onDelete,
}: {
  item: Product;
  isFavorite: boolean;
  onToggleFavorite: (item: Product) => void;
  onDelete: (item: Product) => void;
}) {
  return (
    <View style={styles.card}>
      <View>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={item.name}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          style={styles.favButton}
          onPress={() => onToggleFavorite(item)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? "#D94B4B" : colors.muted}
          />
        </Pressable>
        {item.ownerId ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hapus jualan saya"
            style={styles.deleteButton}
            onPress={() => onDelete(item)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.white} />
          </Pressable>
        ) : null}
      </View>
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
              <Ionicons name="location-outline" size={11} color={colors.muted} />
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
          <Ionicons name="chatbubble-ellipses-outline" size={15} color={colors.white} />
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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // product_id barang yang difavoritkan user (dari Supabase).
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Pull-to-refresh: muat ulang barang (API + jualan) dan favorit.
  async function handleRefresh() {
    setRefreshing(true);
    try {
      const data = await getProducts(true);
      setProducts(data);
      setError(null);
      await loadFavorites(setFavoriteIds);
    } catch (e) {
      Alert.alert("Gagal memuat", e instanceof Error ? e.message : "Coba lagi.");
    } finally {
      setRefreshing(false);
    }
  }

  // Optimistic UI: ubah dulu, kembalikan jika Supabase gagal.
  async function toggleFavorite(item: Product) {
    const wasFav = favoriteIds.has(item.id);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFav) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
    try {
      if (wasFav) await removeFavorite(item.id);
      else
        await addFavorite({
          product_id: item.id,
          name: item.name,
          price: item.price,
          thumbnail: item.thumbnail,
        });
    } catch (e) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFav) next.add(item.id);
        else next.delete(item.id);
        return next;
      });
      Alert.alert("Favorit", e instanceof Error ? e.message : "Gagal mengubah favorit.");
    }
  }

  function confirmDelete(item: Product) {
    Alert.alert("Hapus jualan", `Hapus "${item.name}" dari jualan Anda?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await removeProduct(item.id);
            setProducts((prev) => prev.filter((p) => p.id !== item.id));
          } catch (e) {
            Alert.alert("Gagal", e instanceof Error ? e.message : "Gagal menghapus.");
          }
        },
      },
    ]);
  }

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
    void loadFavorites(setFavoriteIds);
  }, []);

  // Hasil filter dihitung ulang ketika data, keyword, atau kategori berubah.
  const results = useMemo(
    () =>
      products.filter(
        (item) =>
          (category === "semua" ||
            (category === "favorit"
              ? favoriteIds.has(item.id)
              : item.category === category)) &&
          item.name.toLowerCase().includes(keyword),
      ),
    [products, keyword, category, favoriteIds],
  );

  const categories = ["semua", "favorit", ...Object.keys(categoryLabels)];

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
                {key === "semua"
                  ? "Semua"
                  : key === "favorit"
                    ? "Favorit"
                    : categoryLabels[key]}
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
          ListEmptyComponent={<Text style={styles.empty}>Tidak ada barang.</Text>}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void handleRefresh()}
              tintColor={colors.forest}
            />
          }
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              isFavorite={favoriteIds.has(item.id)}
              onToggleFavorite={(p) => void toggleFavorite(p)}
              onDelete={confirmDelete}
            />
          )}
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
  name: { minHeight: 34, color: colors.ink, fontWeight: "700", fontSize: 13, lineHeight: 17 },
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
  favButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D94B4B",
    alignItems: "center",
    justifyContent: "center",
  },
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
