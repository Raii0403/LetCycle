import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabName = "Home" | "Marketplace" | "Account";

const tabs = [
  { name: "Home", icon: "home-outline", activeIcon: "home" },
  { name: "Marketplace", icon: "bag-handle-outline", activeIcon: "bag-handle" },
  { name: "Account", icon: "person-outline", activeIcon: "person" },
] as const;

// Navigasi utama tetap terlihat di bawah layar.
export function BottomNav({ onHomePress }: { onHomePress: () => void }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  function handleTabPress(tab: TabName) {
    if (tab === "Home") {
      onHomePress();
      return;
    }
    router.push(tab === "Marketplace" ? "/marketplace" : "/account");
  }

  return (
    <View
      style={[styles.safeArea, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <View style={styles.nav}>
        {tabs.map((tab) => {
          const active = tab.name === "Home";
          return (
            <Pressable
              key={tab.name}
              accessibilityRole="button"
              accessibilityLabel={tab.name}
              accessibilityState={{ selected: active }}
              style={styles.tab}
              onPress={() => handleTabPress(tab.name)}
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
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.forest,
  },
  tab: {
    minWidth: 76,
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
