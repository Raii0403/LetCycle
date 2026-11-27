import { ErrorMessage } from "@/components/ErrorMessage";
import { FormModal, type FormField, type FormValues } from "@/components/FormModal";
import { Loading } from "@/components/Loading";
import { TpsMap } from "@/components/TpsMap";
import { colors } from "@/constants/colors";
import { useHomeData } from "@/context/HomeDataContext";
import { collectionPointService } from "@/services/collectionPointService";
import { depositService, POINTS_PER_KG } from "@/services/depositService";
import { wasteCategoryService } from "@/services/wasteCategoryService";
import type {
  CollectionPointRow,
  DepositRow,
  WasteCategoryRow,
} from "@/types/home";
import { formatKg, formatNumber, parseDecimal } from "@/utils/format";
import { openCollectionSearch, openDirections } from "@/utils/maps";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

// Konfirmasi lalu hapus; error ditampilkan lewat Alert.
function confirmRemove(
  title: string,
  remove: () => Promise<void>,
  reload: () => Promise<void>,
) {
  Alert.alert("Hapus data", `Hapus "${title}"?`, [
    { text: "Batal", style: "cancel" },
    {
      text: "Hapus",
      style: "destructive",
      onPress: async () => {
        try {
          await remove();
          await reload();
        } catch (e) {
          Alert.alert("Gagal", e instanceof Error ? e.message : "Gagal menghapus.");
        }
      },
    },
  ]);
}

function EmptyState({
  message,
  buttonLabel,
  onAdd,
  dark = false,
}: {
  message: string;
  buttonLabel: string;
  onAdd: () => void;
  dark?: boolean;
}) {
  return (
    <View style={styles.empty}>
      <Text style={[styles.emptyText, dark && styles.emptyTextDark]}>{message}</Text>
      <Pressable accessibilityRole="button" style={styles.emptyButton} onPress={onAdd}>
        <Ionicons name="add" size={16} color={colors.white} />
        <Text style={styles.emptyButtonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

function AddButton({ label, onPress, dark = false }: { label: string; onPress: () => void; dark?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={[styles.addButton, dark && styles.addButtonDark]}
      onPress={onPress}
    >
      <Ionicons name="add" size={20} color={dark ? colors.forest : colors.white} />
    </Pressable>
  );
}

// ---------- Tempat pengumpulan ----------

const pointFields: FormField[] = [
  { key: "name", label: "Nama tempat", required: true, placeholder: "Contoh: Bank Sampah Hijau" },
  { key: "address", label: "Alamat", required: true },
  { key: "phone", label: "Telepon (opsional)", kind: "phone" },
  { key: "latitude", label: "Latitude", kind: "coordinate", required: true, placeholder: "-7.4246" },
  { key: "longitude", label: "Longitude", kind: "coordinate", required: true, placeholder: "109.2332" },
];

function validatePoint(v: FormValues): string | null {
  const lat = parseDecimal(v.latitude);
  const lng = parseDecimal(v.longitude);
  if (lat < -90 || lat > 90) return "Latitude harus antara -90 dan 90.";
  if (lng < -180 || lng > 180) return "Longitude harus antara -180 dan 180.";
  return null;
}

export function CollectionPointsCard() {
  const { width } = useWindowDimensions();
  const wide = width >= 640;
  const { points, loading, error, retry, reload } = useHomeData();
  const [form, setForm] = useState<{ row: CollectionPointRow | null } | null>(null);

  async function save(v: FormValues) {
    const payload = {
      name: v.name.trim(),
      address: v.address.trim(),
      phone: v.phone?.trim() ? v.phone.trim() : null,
      latitude: parseDecimal(v.latitude),
      longitude: parseDecimal(v.longitude),
    };
    if (form?.row) await collectionPointService.update(form.row.id, payload);
    else await collectionPointService.create(payload);
    await reload();
  }

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tempat Pengumpulan Sampah</Text>
        <View style={styles.headerActions}>
          <AddButton label="Tambah tempat pengumpulan" onPress={() => setForm({ row: null })} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lihat semua tempat pengumpulan"
            hitSlop={8}
            style={styles.seeAllLocations}
            onPress={() => void openCollectionSearch()}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.forest} />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <Loading message="Memuat tempat pengumpulan..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => void retry()} />
      ) : points.length === 0 ? (
        <EmptyState
          message="Belum ada tempat pengumpulan, tambahkan yang pertama."
          buttonLabel="Tambah Tempat"
          onAdd={() => setForm({ row: null })}
        />
      ) : (
        <View style={[styles.collectionBody, wide && styles.collectionBodyWide]}>
          <View style={wide ? styles.mapWide : styles.mapNarrow}>
            <TpsMap
              points={points}
              height={wide ? 260 : Math.min(240, Math.round(width * 0.55))}
            />
          </View>
          <View style={[styles.tpsList, wide && styles.tpsListWide]}>
            {points.map((p) => (
              <View key={p.id} style={styles.tpsItem}>
                <View style={styles.tpsIcon}>
                  <Ionicons name="location-outline" size={17} color={colors.green} />
                </View>
                <View style={styles.tpsDetails}>
                  <Text style={styles.tpsName}>{p.name}</Text>
                  <Text style={styles.tpsAddress}>{p.address}</Text>
                  {p.phone ? <Text style={styles.tpsPhone}>{p.phone}</Text> : null}
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Lihat arah ke ${p.name}`}
                  style={styles.iconButton}
                  onPress={() => void openDirections(p.latitude, p.longitude)}
                >
                  <Ionicons name="navigate-outline" size={17} color={colors.forest} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Ubah ${p.name}`}
                  style={styles.iconButton}
                  onPress={() => setForm({ row: p })}
                >
                  <Ionicons name="create-outline" size={17} color={colors.forest} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Hapus ${p.name}`}
                  style={styles.iconButton}
                  onPress={() =>
                    confirmRemove(p.name, () => collectionPointService.remove(p.id), reload)
                  }
                >
                  <Ionicons name="trash-outline" size={17} color="#C0392B" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}

      {form ? (
        <FormModal
          key={form.row?.id ?? "new"}
          visible
          title={form.row ? "Ubah Tempat Pengumpulan" : "Tambah Tempat Pengumpulan"}
          fields={pointFields}
          validate={validatePoint}
          initialValues={{
            name: form.row?.name ?? "",
            address: form.row?.address ?? "",
            phone: form.row?.phone ?? "",
            latitude: form.row ? String(form.row.latitude) : "",
            longitude: form.row ? String(form.row.longitude) : "",
          }}
          onClose={() => setForm(null)}
          onSubmit={save}
        />
      ) : null}
    </View>
  );
}

// ---------- Kategori sampah ----------

const CATEGORY_ICONS: { value: IconName; label: string; color: string }[] = [
  { value: "document-text-outline", label: "Kertas", color: "#F5E8D4" },
  { value: "cube-outline", label: "Logam", color: "#E9EDE5" },
  { value: "water-outline", label: "Plastik", color: "#DDF0EA" },
  { value: "hardware-chip-outline", label: "Elektronik", color: "#E8E8D8" },
];

const categoryFields: FormField[] = [
  { key: "name", label: "Nama kategori", required: true, placeholder: "Contoh: Plastik" },
  { key: "price", label: "Harga per kg (Rp)", kind: "number", required: true, placeholder: "1500" },
  {
    key: "icon",
    label: "Ikon",
    kind: "select",
    required: true,
    options: CATEGORY_ICONS.map((i) => ({ value: i.value, label: i.label })),
  },
];

export function CategoriesSection() {
  const { categories, loading, error, retry, reload } = useHomeData();
  const [form, setForm] = useState<{ row: WasteCategoryRow | null } | null>(null);

  async function save(v: FormValues) {
    const icon = CATEGORY_ICONS.find((i) => i.value === v.icon) ?? CATEGORY_ICONS[1];
    const payload = {
      name: v.name.trim(),
      price_per_kg: Number(v.price),
      icon: icon.value,
      color: icon.color,
    };
    if (form?.row) await wasteCategoryService.update(form.row.id, payload);
    else await wasteCategoryService.create(payload);
    await reload();
  }

  function openActions(c: WasteCategoryRow) {
    Alert.alert(c.name, `Rp ${formatNumber(c.price_per_kg)} / kg`, [
      { text: "Ubah", onPress: () => setForm({ row: c }) },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => confirmRemove(c.name, () => wasteCategoryService.remove(c.id), reload),
      },
      { text: "Batal", style: "cancel" },
    ]);
  }

  return (
    <View style={styles.categoriesSection}>
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesTitle}>Kategori Sampah yang diterima</Text>
        <AddButton dark label="Tambah kategori sampah" onPress={() => setForm({ row: null })} />
      </View>

      {loading ? (
        <Loading message="Memuat kategori..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => void retry()} />
      ) : categories.length === 0 ? (
        <EmptyState
          dark
          message="Belum ada kategori sampah, tambahkan yang pertama."
          buttonLabel="Tambah Kategori"
          onAdd={() => setForm({ row: null })}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          accessibilityLabel="Kategori sampah yang diterima"
        >
          {categories.map((c) => (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={`${c.name}, Rp ${formatNumber(c.price_per_kg)} per kilogram. Ketuk untuk ubah atau hapus`}
              style={styles.categoryCard}
              onPress={() => openActions(c)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: c.color }]}>
                <Ionicons name={c.icon as IconName} size={23} color={colors.forest} />
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>
                {c.name}
              </Text>
              <Text style={styles.categoryPrice}>Rp {formatNumber(c.price_per_kg)}</Text>
              <Text style={styles.categoryUnit}>/ kg</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <Text style={styles.priceDisclaimer}>*Harga dapat berubah mengikuti kondisi pasar</Text>

      {form ? (
        <FormModal
          key={form.row?.id ?? "new"}
          visible
          title={form.row ? "Ubah Kategori" : "Tambah Kategori"}
          fields={categoryFields}
          initialValues={{
            name: form.row?.name ?? "",
            price: form.row ? String(form.row.price_per_kg) : "",
            icon: form.row?.icon ?? CATEGORY_ICONS[0].value,
          }}
          onClose={() => setForm(null)}
          onSubmit={save}
        />
      ) : null}
    </View>
  );
}

// ---------- Riwayat setoran ----------

export function DepositsSection() {
  const { deposits, categories, loading, error, retry, reload } = useHomeData();
  const [form, setForm] = useState<{ row: DepositRow | null } | null>(null);

  function openForm(row: DepositRow | null) {
    if (categories.length === 0) {
      Alert.alert("Belum ada kategori", "Tambahkan kategori sampah dulu sebelum mencatat setoran.");
      return;
    }
    setForm({ row });
  }

  const fields: FormField[] = [
    {
      key: "category",
      label: "Kategori sampah",
      kind: "select",
      required: true,
      options: categories.map((c) => ({ value: c.id, label: c.name })),
    },
    { key: "weight", label: "Berat (kg)", kind: "decimal", required: true, placeholder: "2,5" },
    { key: "bottles", label: "Jumlah botol PET (opsional)", kind: "number" },
  ];

  async function save(v: FormValues) {
    const cat = categories.find((c) => c.id === v.category);
    if (!cat) throw new Error("Kategori tidak ditemukan.");
    const weight = parseDecimal(v.weight);
    const payload = {
      category_id: cat.id,
      category_name: cat.name,
      weight_kg: weight,
      bottle_count: v.bottles?.trim() ? Number(v.bottles) : 0,
      amount: Math.round(weight * cat.price_per_kg),
      points: Math.round(weight * POINTS_PER_KG),
    };
    if (form?.row) await depositService.update(form.row.id, payload);
    else await depositService.create(payload);
    await reload();
  }

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Riwayat Setoran</Text>
        <AddButton label="Catat setoran" onPress={() => openForm(null)} />
      </View>

      {loading ? (
        <Loading message="Memuat setoran..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => void retry()} />
      ) : deposits.length === 0 ? (
        <EmptyState
          message="Belum ada setoran, catat setoran pertama Anda."
          buttonLabel="Catat Setoran"
          onAdd={() => openForm(null)}
        />
      ) : (
        <View style={styles.tpsList}>
          {deposits.map((d) => (
            <View key={d.id} style={styles.tpsItem}>
              <View style={styles.tpsIcon}>
                <Ionicons name="repeat-outline" size={17} color={colors.green} />
              </View>
              <View style={styles.tpsDetails}>
                <Text style={styles.tpsName}>
                  {d.category_name} · {formatKg(Number(d.weight_kg))}
                </Text>
                <Text style={styles.tpsPhone}>
                  Rp {formatNumber(d.amount)} · {formatNumber(d.points)} poin
                  {d.bottle_count > 0 ? ` · ${d.bottle_count} botol` : ""}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ubah setoran"
                style={styles.iconButton}
                onPress={() => openForm(d)}
              >
                <Ionicons name="create-outline" size={17} color={colors.forest} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Hapus setoran"
                style={styles.iconButton}
                onPress={() =>
                  confirmRemove(
                    `setoran ${d.category_name}`,
                    () => depositService.remove(d.id),
                    reload,
                  )
                }
              >
                <Ionicons name="trash-outline" size={17} color="#C0392B" />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {form ? (
        <FormModal
          key={form.row?.id ?? "new"}
          visible
          title={form.row ? "Ubah Setoran" : "Catat Setoran"}
          fields={fields}
          validate={(v) => (parseDecimal(v.weight) > 0 ? null : "Berat harus lebih dari 0.")}
          initialValues={{
            category: form.row?.category_id ?? "",
            weight: form.row ? String(form.row.weight_kg) : "",
            bottles: form.row && form.row.bottle_count > 0 ? String(form.row.bottle_count) : "",
          }}
          onClose={() => setForm(null)}
          onSubmit={save}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 19,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E9EEE5",
  },
  sectionHeader: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: "800", flexShrink: 1 },
  headerActions: { flexDirection: "row", alignItems: "center" },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.forest,
  },
  addButtonDark: { backgroundColor: colors.gold },
  seeAllLocations: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  collectionBody: { gap: 10 },
  collectionBodyWide: { flexDirection: "row", alignItems: "flex-start" },
  mapNarrow: { width: "100%" },
  mapWide: { flex: 1 },
  tpsListWide: { flex: 1 },
  tpsList: { borderRadius: 13, overflow: "hidden", borderWidth: 1, borderColor: "#DCE5D7" },
  tpsItem: {
    minHeight: 69,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F5F8F1",
  },
  tpsIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E4F0E2",
  },
  tpsDetails: { flex: 1, gap: 3 },
  tpsName: { color: colors.deepForest, fontSize: 12, fontWeight: "700" },
  tpsAddress: { color: colors.muted, fontSize: 10, lineHeight: 14 },
  tpsPhone: { color: "#5B7964", fontSize: 10 },
  iconButton: { width: 36, height: 44, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", gap: 10, paddingVertical: 14 },
  emptyText: { color: colors.muted, fontSize: 12, textAlign: "center" },
  emptyTextDark: { color: "#D8E7D8" },
  emptyButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.green,
  },
  emptyButtonText: { color: colors.white, fontWeight: "800", fontSize: 12 },
  categoriesSection: {
    paddingTop: 14,
    paddingBottom: 12,
    borderRadius: 18,
    backgroundColor: colors.forest,
    overflow: "hidden",
  },
  categoriesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  categoriesTitle: { flex: 1, color: colors.white, fontSize: 15, fontWeight: "800" },
  categoryList: { paddingHorizontal: 12, gap: 8 },
  categoryCard: {
    width: 76,
    minHeight: 115,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 13,
    backgroundColor: "#F8FAF5",
  },
  categoryIcon: {
    width: 41,
    height: 41,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  categoryName: {
    minHeight: 27,
    color: colors.ink,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 13,
    textAlign: "center",
  },
  categoryPrice: { marginTop: 4, color: colors.green, fontSize: 10, fontWeight: "800" },
  categoryUnit: { color: colors.muted, fontSize: 9 },
  priceDisclaimer: { marginTop: 8, paddingHorizontal: 12, color: "#D8E7D8", fontSize: 9 },
});
