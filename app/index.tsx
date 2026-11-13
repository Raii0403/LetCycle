import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeHeader, ImpactCard } from '@/components/home/home-header';
import {
  CategoriesSection,
  CollectionPointsCard,
  NewsSection,
  TipCard,
} from '@/components/home/home-sections';
import { colors } from '@/constants/colors';

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <View style={styles.content}>
          <ImpactCard />
          <CollectionPointsCard />
          <CategoriesSection />
          <NewsSection
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />
          <TipCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.forest,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.paleMint,
  },
  scrollContent: {
    paddingBottom: 18,
  },
  content: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
});


// tambahkan 1 tombol
// tambahkan 2 data sesuai project masing"
// tmbahkan penggunaan inline style pada komponen yg baru di buat 