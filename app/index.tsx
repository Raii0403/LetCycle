import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '@/components/home/bottom-nav';
import { HomeHeader, ImpactCard } from '@/components/home/home-header';
import {
  CategoriesSection,
  CollectionPointsCard,
  NewsSection,
  TipCard,
} from '@/components/home/home-sections';
import { colors } from '@/constants/colors';
import { articleFilters } from '@/data/home';

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof articleFilters)[number]>('Semua');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
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
      <BottomNav onHomePress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
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
    maxWidth: 520,
    alignSelf: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
});
