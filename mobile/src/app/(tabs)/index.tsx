import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius } from '../../lib/theme';
import { useLanguage } from '../../lib/i18n';
import { useCatalog } from '../../context/CatalogContext';
import { MediaCard, MediaRow } from '../../components/MediaRow';
import { SectionHeader, StateView } from '../../components/ui';
import AppHeader from '../../components/AppHeader';
import { byFeatured, thumbnailOf } from '../../lib/media';

export default function HomeScreen() {
  const { t, pick } = useLanguage();
  const { mezmurs, films, categories, loading, error, refresh } = useCatalog();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (!mezmurs.length && (loading || error)) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <AppHeader />
        <StateView loading={loading} error={error} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  const featured = byFeatured(mezmurs).slice(0, 8);
  const popular = [...mezmurs].sort((a, b) => b.views - a.views).slice(0, 5);
  const featuredFilms = byFeatured(films).slice(0, 8);
  const mosaic = [...byFeatured(mezmurs).slice(0, 4), ...byFeatured(films).slice(0, 2)];
  const mezmurCategories = categories.filter((c) => c.type !== 'film');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold400} colors={[colors.gold500]} />}
      >
        {/* Hero: a mosaic of real catalog thumbnails behind the headline, like the website */}
        <View style={styles.hero}>
          <View style={styles.mosaic}>
            {mosaic.map((item) => (
              <Image key={item.id} source={thumbnailOf(item)} style={styles.mosaicTile} contentFit="cover" />
            ))}
          </View>
          <LinearGradient
            colors={['rgba(32,5,11,0.55)', 'rgba(32,5,11,0.85)', colors.background]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroBadge}>✝ {t.tagline}</Text>
            <Text style={styles.heroTitle}>{t.heroTitle}</Text>
            <View style={styles.heroButtons}>
              <Pressable onPress={() => router.navigate('/mezmur')} style={styles.heroPrimary}>
                <Ionicons name="musical-notes" size={16} color={colors.burgundy950} />
                <Text style={styles.heroPrimaryText}>{t.exploreMezmur}</Text>
              </Pressable>
              <Pressable onPress={() => router.navigate('/films')} style={styles.heroSecondary}>
                <Ionicons name="film" size={16} color={colors.gold400} />
                <Text style={styles.heroSecondaryText}>{t.exploreFilms}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.padded}>
            <SectionHeader title={t.categories} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {mezmurCategories.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => router.navigate({ pathname: '/mezmur', params: { category: c.id } })}
                style={styles.categoryCard}
              >
                <Text style={styles.categoryName} numberOfLines={2}>
                  {pick(c.nameAmharic, c.nameEnglish)}
                </Text>
                <Text style={styles.categoryCount}>
                  {mezmurs.filter((m) => m.category === c.id).length} {t.mezmurs}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured mezmur carousel */}
        <View style={styles.section}>
          <View style={styles.padded}>
            <SectionHeader title={t.featuredMezmur} action={t.seeAll} onAction={() => router.navigate('/mezmur')} />
          </View>
          <FlatList
            horizontal
            data={featured}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => <MediaCard item={item} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          />
        </View>

        {/* Most viewed */}
        <View style={[styles.section, styles.padded]}>
          <SectionHeader title={t.mostViewed} />
          <View style={{ gap: 10 }}>
            {popular.map((m) => (
              <MediaRow key={m.id} item={m} />
            ))}
          </View>
        </View>

        {/* Films carousel */}
        <View style={styles.section}>
          <View style={styles.padded}>
            <SectionHeader title={t.featuredFilms} action={t.seeAll} onAction={() => router.navigate('/films')} />
          </View>
          <FlatList
            horizontal
            data={featuredFilms}
            keyExtractor={(f) => f.id}
            renderItem={({ item }) => <MediaCard item={item} width={240} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: { height: 300, overflow: 'hidden', justifyContent: 'flex-end' },
  mosaic: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', flexWrap: 'wrap', transform: [{ rotate: '-6deg' }, { scale: 1.25 }] },
  mosaicTile: { width: '33.33%', aspectRatio: 16 / 9, borderWidth: 2, borderColor: colors.background },
  heroContent: { padding: 20, gap: 10 },
  heroBadge: { color: colors.gold300, fontSize: 12, fontWeight: '600' },
  heroTitle: { color: colors.text, fontSize: 26, fontWeight: '800', lineHeight: 34 },
  heroButtons: { flexDirection: 'row', gap: 10, marginTop: 6 },
  heroPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radius.md,
    backgroundColor: colors.gold500
  },
  heroPrimaryText: { color: colors.burgundy950, fontWeight: '800', fontSize: 14 },
  heroSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: 'rgba(48,10,19,0.85)'
  },
  heroSecondaryText: { color: colors.text, fontWeight: '700', fontSize: 14 },

  section: { marginTop: 24 },
  padded: { paddingHorizontal: 16 },
  categoryRow: { gap: 10, paddingHorizontal: 16 },
  categoryCard: {
    width: 140,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    minHeight: 78
  },
  categoryName: { color: colors.text, fontWeight: '700', fontSize: 13 },
  categoryCount: { color: colors.gold400, fontSize: 11, marginTop: 6 },
  carousel: { gap: 14, paddingHorizontal: 16 }
});
