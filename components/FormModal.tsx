import { colors } from "@/constants/colors";
import { useState } from "react";
import {
  ActivityIndicator,
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

export interface FormField {
  key: string;
  label: string;
  placeholder?: string;
  kind?: "text" | "number" | "decimal" | "coordinate" | "phone" | "select";
  required?: boolean;
  options?: { value: string; label: string }[]; // untuk kind "select"
}

export type FormValues = Record<string, string>;

// Form modal generik: validasi field wajib/angka, tombol disabled saat menyimpan.
// onSubmit boleh melempar Error; pesannya ditampilkan di form.
export function FormModal({
  visible,
  title,
  fields,
  initialValues,
  submitLabel = "Simpan",
  validate,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  title: string;
  fields: FormField[];
  initialValues: FormValues;
  submitLabel?: string;
  validate?: (values: FormValues) => string | null;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function check(): string | null {
    for (const f of fields) {
      const v = (values[f.key] ?? "").trim();
      if (f.required && !v) return `${f.label} wajib diisi.`;
      if (v && f.kind === "coordinate" && !Number.isFinite(Number(v.replace(",", ".")))) {
        return `${f.label} harus berupa angka.`;
      }
      if (v && (f.kind === "number" || f.kind === "decimal")) {
        const n = Number(v.replace(",", "."));
        if (!Number.isFinite(n) || n < 0) return `${f.label} harus berupa angka.`;
        if (f.kind === "number" && !Number.isInteger(n))
          return `${f.label} harus bilangan bulat.`;
      }
    }
    return validate ? validate(values) : null;
  }

  async function submit() {
    if (saving) return;
    const problem = check();
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {fields.map((f) => (
              <View key={f.key}>
                <Text style={styles.label}>{f.label}</Text>
                {f.kind === "select" ? (
                  <View style={styles.chips}>
                    {(f.options ?? []).map((o) => {
                      const active = values[f.key] === o.value;
                      return (
                        <Pressable
                          key={o.value}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() => setValues((p) => ({ ...p, [f.key]: o.value }))}
                        >
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>
                            {o.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <TextInput
                    style={styles.input}
                    value={values[f.key] ?? ""}
                    onChangeText={(t) => setValues((p) => ({ ...p, [f.key]: t }))}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.muted}
                    editable={!saving}
                    keyboardType={
                      f.kind === "number"
                        ? "number-pad"
                        : f.kind === "decimal"
                          ? "decimal-pad"
                          : f.kind === "phone"
                            ? "phone-pad"
                            : f.kind === "coordinate" && Platform.OS === "ios"
                              ? "numbers-and-punctuation"
                              : "default"
                    }
                  />
                )}
              </View>
            ))}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>
          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onClose} disabled={saving}>
              <Text style={styles.cancelText}>Batal</Text>
            </Pressable>
            <Pressable
              style={[styles.save, saving && styles.saveDisabled]}
              onPress={() => void submit()}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.saveText}>{submitLabel}</Text>
              )}
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
    maxWidth: 560,
    alignSelf: "center",
    maxHeight: "90%",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
  },
  title: { color: colors.ink, fontSize: 18, fontWeight: "800", marginBottom: 8 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#D4E0D3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
    backgroundColor: colors.paleMint,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.mint,
  },
  chipActive: { backgroundColor: colors.forest },
  chipText: { color: colors.ink, fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: colors.white },
  error: { color: "#C0392B", marginTop: 10, fontSize: 13 },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  cancel: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mint,
  },
  cancelText: { color: colors.ink, fontWeight: "700" },
  save: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.forest,
  },
  saveDisabled: { opacity: 0.6 },
  saveText: { color: colors.white, fontWeight: "800" },
});
