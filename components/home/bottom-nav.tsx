import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  { name: "Home", href: "/", icon: "home-outline", activeIcon: "home" },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: "bag-handle-outline",
    activeIcon: "bag-handle",
  },
  { name: "Account", href: "/account", icon: "person-outline", activeIcon: "person" },
  { name:"Daftar_Produk", href:"/DataProduk", icon:"bag-handle-outline", activeIcon:"bag-handle"},
] as const;

// Navigasi utama dipasang di _layout sehingga tetap terlihat di semua halaman.
export function BottomNav() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      style={[styles.safeArea, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <View style={styles.nav}>
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Pressable
              key={tab.name}
              accessibilityRole="button"
              accessibilityLabel={tab.name}
              accessibilityState={{ selected: active }}
              style={styles.tab}
              onPress={() => {
                if (!active) router.replace(tab.href);
              }}
            >
              <Ionicons
                name={active ? tab.activeIcon : tab.icon}
                size={22}
                color={active ? "#E6F1D8" : "#D4E0D3"}
              />
              <Text style={[styles.label, active && styles.activeLabel]}>
                {tab.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.forest,
  },
  nav: {
    minHeight: 64,
    paddingTop: 7,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: 720,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.forest,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    color: "#D4E0D3",
    fontSize: 10,
    fontWeight: "500",
  },
  activeLabel: {
    color: colors.white,
    fontWeight: "800",
  },
});
