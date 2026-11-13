import { colors } from "@/constants/colors";
import type { Product } from "@/data/marketplace";
import { addProduct, categoryLabels, CONDITIONS } from "@/services/productService";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Form untuk menambahkan barang baru ke marketplace.
export function AddProductModal({
  visible,
  onClose,
  onAdded,
}: {
  visible: boolean;
  onClose: () => void;
  onAdded: (product: Product) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(Object.keys(categoryLabels)[0]);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [sellerName, setSellerName] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setPrice("");
    setSellerName("");
    setCity("");
    setError(null);
  }

  function submit() {
    setSubmitting(true);
    setError(null);
    addProduct({ name, price, category, condition, sellerName, city })
      .then((product) => {
        onAdded(product);
        reset();
        onClose();
      })
      .catch((err: unknown) => {
        setError(typeof err === "string" ? err : "Gagal menambahkan barang.");
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>Jual Barang</Text>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Nama barang</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Contoh: Kursi kayu bekas" />

            <Text style={styles.label}>Harga (Rp)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="150000"
            />

            <Text style={styles.label}>Kategori</Text>
            <View style={styles.chips}>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Pressable
                  key={key}
                  style={[styles.chip, category === key && styles.chipActive]}
                  onPress={() => setCategory(key)}
                >
                  <Text style={[styles.chipText, category === key && styles.chipTextActive]}>{label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Kondisi</Text>
            <View style={styles.chips}>
              {CONDITIONS.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.chip, condition === item && styles.chipActive]}
                  onPress={() => setCondition(item)}
                >
                  <Text style={[styles.chipText, condition === item && styles.chipTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Nama penjual</Text>
            <TextInput style={styles.input} value={sellerName} onChangeText={setSellerName} placeholder="Nama kamu" />

            <Text style={styles.label}>Kota</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Purwokerto" />

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancel]} onPress={onClose} disabled={submitting}>
              <Text style={styles.cancelText}>Batal</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.save]} onPress={submit} disabled={submitting}>
              <Text style={styles.saveText}>{submitting ? "Menyimpan..." : "Tambahkan"}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    width: "100%",
    maxWidth: 640,
    maxHeight: "90%",
    alignSelf: "center",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
  },
  title: { color: colors.ink, fontSize: 18, fontWeight: "800", marginBottom: 8 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 10, marginBottom: 4 },
  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCE5D7",
    backgroundColor: colors.paleMint,
    color: colors.ink,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { minHeight: 36, paddingHorizontal: 12, justifyContent: "center", borderRadius: 18, backgroundColor: "#E9F0E7" },
  chipActive: { backgroundColor: colors.forest },
  chipText: { color: "#49634E", fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: colors.white, fontWeight: "800" },
  error: { color: "#B3261E", marginTop: 10, fontSize: 12 },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  button: { flex: 1, minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  cancel: { backgroundColor: "#E9F0E7" },
  cancelText: { color: colors.forest, fontWeight: "800" },
  save: { backgroundColor: colors.forest },
  saveText: { color: colors.white, fontWeight: "800" },
});
