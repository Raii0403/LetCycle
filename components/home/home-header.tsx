import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

// Profil dan ringkasan saldo pengguna.
export function HeaderProfile() {
  return (
    <View style={styles.profileRow}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={23} color={colors.forest} />
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.3</Text>
        </View>
      </View>

      <View style={styles.profileText}>
        <Text style={styles.greeting}>Halo, Budi Santoso</Text>
        <Text style={styles.profileSubtitle}>Eco Warrior • Nasabah Aktif</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Lihat notifikasi"
        style={styles.notificationButton}
        onPress={() => Alert.alert("Notifikasi", "Belum ada notifikasi baru.")}
      >
        <Ionicons name="notifications-outline" size={21} color={colors.white} />
        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );
}

export function BalanceCard() {
  return (
    <View
      style={styles.balanceCard}
      accessibilityLabel="Ringkasan saldo dan poin"
    >
      <View style={styles.balanceColumn}>
        <Text style={styles.balanceLabel}>Saldo Dompet Eco</Text>
        <Text style={styles.balanceAmount}>Rp 124.500</Text>
      </View>
      <View style={styles.balanceDivider} />
      <View style={[styles.balanceColumn, styles.pointsColumn]}>
        <Text style={styles.balanceLabel}>Total Poin Daur Ulang</Text>
        <View style={styles.pointsRow}>
          <Ionicons name="star" size={15} color={colors.gold} />
          <Text style={styles.pointsAmount}>1.420 EcoPoints</Text>
        </View>
      </View>
    </View>
  );
}

export function HomeHeader() {
  return (
    <LinearGradient
      colors={["#287944", "#1B5B3A", colors.forest]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      yo
      <View style={styles.headerContent}>
        <HeaderProfile />
        <BalanceCard />
      </View>
    </LinearGradient>
  );
}

export function ImpactCard() {
  const stats = [
    {
      value: "1.240 kg",
      label: "Sampah telah didaur ulang",
      icon: "scale-outline",
    },
    { value: "7.240", label: "Botol PET terkumpul", icon: "water-outline" },
    { value: "53", label: "Kali melakukan setor", icon: "repeat-outline" },
    {
      value: "Rp 8,2 jt",
      label: "Nilai transaksi terkumpul",
      icon: "cash-outline",
    },
  ] as const;

  return (
    <View style={styles.impactCard}>
      <View style={styles.sectionHeading}>
        <View style={styles.impactIcon}>
          <Ionicons name="sync-outline" size={21} color={colors.green} />
        </View>
        <Text style={styles.cardTitle}>Dampak yang sudah dibuat</Text>
      </View>
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statTile}>
            <View style={styles.statTopRow}>
              <Ionicons name={stat.icon} size={15} color={colors.green} />
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 25,
  },
  headerContent: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  profileRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    position: "relative",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#DDEFE0",
    borderWidth: 2,
    borderColor: "#F4FAF4",
    justifyContent: "center",
    alignItems: "center",
  },
  levelBadge: {
    position: "absolute",
    bottom: -1,
    right: -2,
    paddingHorizontal: 5,
    minWidth: 28,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.gold,
    borderWidth: 1,
    borderColor: colors.white,
  },
  levelText: {
    color: colors.deepForest,
    fontSize: 10,
    fontWeight: "800",
  },
  profileText: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  profileSubtitle: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    color: "#EAF4E9",
    backgroundColor: "rgba(255,255,255,0.14)",
    fontSize: 10,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF8171",
    borderWidth: 1,
    borderColor: colors.forest,
  },
  balanceCard: {
    minHeight: 76,
    marginTop: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(238,249,236,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  balanceColumn: {
    flex: 1,
    gap: 5,
  },
  pointsColumn: {
    alignItems: "flex-end",
  },
  balanceLabel: {
    color: "#E3F0E4",
    fontSize: 11,
  },
  balanceAmount: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
  balanceDivider: {
    height: 38,
    width: 1,
    marginHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.23)",
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pointsAmount: {
    color: "#FFE27A",
    fontSize: 14,
    fontWeight: "800",
  },
  impactCard: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EDF0E9",
    shadowColor: "#183C24",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 13,
  },
  impactIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mint,
  },
  cardTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  statTile: {
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 68,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: colors.paleMint,
    justifyContent: "center",
  },
  statTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  statValue: {
    color: colors.deepForest,
    fontSize: 14,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },
});
