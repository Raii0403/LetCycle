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
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Loading } from '@/components/Loading';
import { colors } from '@/constants/colors';
import { recyclingFact } from '@/data/home';
import { getArticles } from '@/services/articleService';
import type { Article } from '@/types/article';

export function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
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
}: Article) {
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

// Memuat artikel dan memperbarui status daftar, loading, serta error.
function loadArticles(
  setArticles: Dispatch<SetStateAction<Article[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
) {
  setLoading(true);
  setError(null);
  getArticles()
    .then((data) => setArticles(data))
    .catch((error: unknown) => {
      if (typeof error === 'string') {
        setError(error);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Gagal memuat artikel.');
      }
    })
    .finally(() => setLoading(false));
}

export function NewsSection({
  selectedFilter,
  onSelectFilter,
}: {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles(setArticles, setLoading, setError);
  }, []);

  const filters = ['Semua', ...new Set(articles.map((article) => article.category))];
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
        {filters.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            active={selectedFilter === filter}
            onPress={() => onSelectFilter(filter)}
          />
        ))}
      </ScrollView>
      <View style={styles.articleList}>
        {loading ? (
          <Loading message="Memuat berita..." />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => loadArticles(setArticles, setLoading, setError)}
          />
        ) : (
          visibleArticles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))
        )}
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
  sectionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
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
