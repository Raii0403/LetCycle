import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '@/constants/colors';
import {
  articles,
  articleFilters,
  collectionPoints,
  recyclingFact,
  wasteCategories,
} from '@/data/home';

type Filter = (typeof articleFilters)[number];

// Daftar tempat setor sampah terdekat.
export function TpsListItem({
  name,
  address,
  phone,
  distance,
}: (typeof collectionPoints)[number]) {
  return (
    <View style={styles.tpsItem}>
      <View style={styles.tpsIcon}>
        <Ionicons name="location-outline" size={17} color={colors.green} />
      </View>
      <View style={styles.tpsDetails}>
        <Text style={styles.tpsName}>{name}</Text>
        <Text style={styles.tpsAddress}>{address}</Text>
        <Text style={styles.tpsPhone}>{phone}  ·  {distance}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Lihat arah ke ${name}`}
        style={styles.directionButton}
        onPress={() => Alert.alert('Petunjuk arah', `Arah ke ${name} (${distance}).`)}
      >
        <Ionicons name="navigate-outline" size={17} color={colors.forest} />
      </Pressable>
    </View>
  );
}

export function CollectionPointsCard() {
  return (
    <View style={styles.collectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tempat Pengumpulan Sampah</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Lihat semua tempat pengumpulan"
          hitSlop={8}
          style={styles.seeAllLocations}
          onPress={() => Alert.alert('Tempat pengumpulan', 'Daftar tempat pengumpulan terdekat.')}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.forest} />
        </Pressable>
      </View>
      <View style={styles.tpsList}>
        {collectionPoints.map((point) => (
          <TpsListItem key={point.name} {...point} />
        ))}
      </View>
    </View>
  );
}

// Kategori diterima beserta harga perkiraan per kilogram.
export function CategoryCard({
  name,
  price,
  icon,
  color,
}: (typeof wasteCategories)[number]) {
  return (
    <View
      accessibilityLabel={`${name}, ${price} per kilogram`}
      style={styles.categoryCard}
    >
      <View style={[styles.categoryIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={23} color={colors.forest} />
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>{name}</Text>
      <Text style={styles.categoryPrice}>{price}</Text>
      <Text style={styles.categoryUnit}>/ kg</Text>
    </View>
  );
}

export function CategoriesSection() {
  return (
    <View style={styles.categoriesSection}>
      <Text style={styles.categoriesTitle}>Kategori Sampah yang diterima</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        accessibilityLabel="Kategori sampah yang diterima"
      >
        {wasteCategories.map((category) => (
          <CategoryCard key={category.name} {...category} />
        ))}
      </ScrollView>
      <Text style={styles.priceDisclaimer}>*Harga dapat berubah mengikuti kondisi pasar</Text>
    </View>
  );
}

export function FilterChip({
  label,
  active,
  onPress,
}: {
  label: Filter;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.filterChip, active && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function ArticleCard({
  category,
  publishedAt,
  readTime,
  title,
  icon,
  color,
}: (typeof articles)[number]) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${category}. ${title}. Waktu baca ${readTime}.`}
      style={styles.articleCard}
      onPress={() => Alert.alert(title, `${category} · ${readTime} waktu baca`)}
    >
      <LinearGradient
        colors={color}
        style={styles.articleImage}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Ionicons name={icon} size={32} color={colors.white} />
        <View style={styles.articleImageDecoration}>
          <Ionicons name="leaf" size={18} color="rgba(255,255,255,0.78)" />
        </View>
      </LinearGradient>
      <View style={styles.articleContent}>
        <View style={styles.articleMeta}>
          <Text style={styles.articleTag}>{category}</Text>
          <Text style={styles.articleTime}>{publishedAt}  ·  {readTime}</Text>
        </View>
        <Text style={styles.articleTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.articleSummary}>Yuk, mulai kebiasaan kecil yang berdampak besar bagi bumi.</Text>
      </View>
    </Pressable>
  );
}

export function NewsSection({
  selectedFilter,
  onSelectFilter,
}: {
  selectedFilter: Filter;
  onSelectFilter: (filter: Filter) => void;
}) {
  const visibleArticles = articles.filter(
    (article) => selectedFilter === 'Semua' || article.category === selectedFilter,
  );

  return (
    <View style={styles.newsSection}>
      <View style={styles.newsHeading}>
        <View>
          <Text style={styles.sectionTitle}>Berita & Tips Daur Ulang</Text>
          <Text style={styles.newsSubtitle}>Inspirasi kecil untuk bumi yang lebih baik</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          style={styles.seeAllButton}
          onPress={() => Alert.alert('Berita & tips', 'Kamu sedang melihat artikel terbaru.')}
        >
          <Text style={styles.seeAllText}>Lihat Semua</Text>
          <Ionicons name="chevron-forward" size={15} color={colors.green} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        accessibilityLabel="Filter berita"
      >
        {articleFilters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            active={selectedFilter === filter}
            onPress={() => onSelectFilter(filter)}
          />
        ))}
      </ScrollView>
      <View style={styles.articleList}>
        {visibleArticles.map((article) => (
          <ArticleCard key={article.title} {...article} />
        ))}
      </View>
    </View>
  );
}

// Fakta singkat yang mendorong kebiasaan daur ulang.
export function TipCard() {
  return (
    <View style={styles.tipCard}>
      <View style={styles.tipIcon}>
        <Ionicons name="bulb-outline" size={20} color="#AA7C0A" />
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>Tahukah Anda?</Text>
        <Text style={styles.tipText}>{recyclingFact}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  collectionCard: {
    padding: 14,
    borderRadius: 19,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E9EEE5',
  },
  sectionHeader: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  seeAllLocations: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tpsList: {
    borderRadius: 13,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DCE5D7',
  },
  tpsItem: {
    minHeight: 69,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: '#F5F8F1',
  },
  tpsIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4F0E2',
  },
  tpsDetails: {
    flex: 1,
    gap: 3,
  },
  tpsName: {
    color: colors.deepForest,
    fontSize: 12,
    fontWeight: '700',
  },
  tpsAddress: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },
  tpsPhone: {
    color: '#5B7964',
    fontSize: 10,
  },
  directionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  categoriesSection: {
    paddingTop: 14,
    paddingBottom: 12,
    borderRadius: 18,
    backgroundColor: colors.forest,
    overflow: 'hidden',
  },
  categoriesTitle: {
    paddingHorizontal: 15,
    marginBottom: 12,
    color: colors.white,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
  },
  categoryList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryCard: {
    width: 76,
    minHeight: 115,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 13,
    backgroundColor: '#F8FAF5',
  },
  categoryIcon: {
    width: 41,
    height: 41,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryName: {
    minHeight: 27,
    color: colors.ink,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
    textAlign: 'center',
  },
  categoryPrice: {
    marginTop: 4,
    color: colors.green,
    fontSize: 10,
    fontWeight: '800',
  },
  categoryUnit: {
    color: colors.muted,
    fontSize: 9,
  },
  priceDisclaimer: {
    marginTop: 8,
    paddingHorizontal: 12,
    color: '#D8E7D8',
    fontSize: 9,
  },
  newsSection: {
    gap: 11,
  },
  newsHeading: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  newsSubtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 10,
  },
  seeAllButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  seeAllText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '700',
  },
  filterList: {
    gap: 7,
    paddingRight: 16,
  },
  filterChip: {
    minHeight: 44,
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#E9F0E7',
  },
  filterChipActive: {
    backgroundColor: colors.forest,
  },
  filterText: {
    color: '#49634E',
    fontSize: 10,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  articleList: {
    gap: 10,
  },
  articleCard: {
    minHeight: 107,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 9,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EEF1EA',
  },
  articleImage: {
    width: 79,
    height: 82,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  articleImageDecoration: {
    position: 'absolute',
    right: 6,
    bottom: 5,
  },
  articleContent: {
    flex: 1,
    gap: 6,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  articleTag: {
    overflow: 'hidden',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
    color: colors.deepForest,
    backgroundColor: '#DDF1D8',
    fontSize: 9,
    fontWeight: '800',
  },
  articleTime: {
    color: colors.muted,
    fontSize: 9,
  },
  articleTitle: {
    color: colors.ink,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
  },
  articleSummary: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },
  tipCard: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 17,
    backgroundColor: '#EDF5E9',
    borderWidth: 1,
    borderColor: '#DFEBD9',
  },
  tipIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3C9',
  },
  tipContent: {
    flex: 1,
    gap: 4,
  },
  tipTitle: {
    color: colors.deepForest,
    fontSize: 11,
    fontWeight: '800',
  },
  tipText: {
    color: '#506856',
    fontSize: 10,
    lineHeight: 14,
  },
});
