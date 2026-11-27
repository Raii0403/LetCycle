import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeHeader, ImpactCard } from '@/components/home/home-header';
import {
  CategoriesSection,
  CollectionPointsCard,
  DepositsSection,
} from '@/components/home/data-sections';
import { NewsSection, TipCard } from '@/components/home/home-sections';
import { HomeDataProvider, useHomeData } from '@/context/HomeDataContext';
import { colors } from '@/constants/colors';

function HomeContent() {
  const { refreshing, refresh } = useHomeData();
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={colors.forest}
          />
        }
      >
        <HomeHeader />
        <View style={styles.content}>
          <ImpactCard />
          <DepositsSection />
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

export default function HomeScreen() {
  return (
    <HomeDataProvider>
      <HomeContent />
    </HomeDataProvider>
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