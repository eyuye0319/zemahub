import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import type { MediaType } from '../lib/types';
import { colors } from '../lib/theme';
import { useLanguage } from '../lib/i18n';
import { useCatalog } from '../context/CatalogContext';
import { byFeatured } from '../lib/media';
import AppHeader from './AppHeader';
import { MediaRow } from './MediaRow';
import { CategoryChips, StateView } from './ui';

/** Mezmur and Films tabs: category chips over a list. Accepts ?category= to preselect a chip. */
export default function BrowseScreen({ type }: { type: MediaType }) {
  const { t } = useLanguage();
  const { mezmurs, films, categories, loading, error, refresh } = useCatalog();
  const params = useLocalSearchParams<{ category?: string }>();
  const [category, setCategory] = useState(params.category || 'all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (params.category) setCategory(params.category);
  }, [params.category]);

  const items = type === 'mezmur' ? mezmurs : films;
  const typeCategories = categories.filter((c) => c.type === type || c.type === 'both');
  const visible = useMemo(
    () => byFeatured(category === 'all' ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AppHeader title={type === 'mezmur' ? t.mezmurs : t.films} />
      {!items.length && (loading || error) ? (
        <StateView loading={loading} error={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <MediaRow item={item} />}
          ListHeaderComponent={
            <View style={styles.chips}>
              <CategoryChips categories={typeCategories} selected={category} onSelect={setCategory} />
              <Text style={styles.count}>
                {visible.length} {type === 'mezmur' ? t.mezmurs : t.films}
              </Text>
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>{t.noResults}</Text>}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold400} colors={[colors.gold500]} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  chips: { marginHorizontal: -16, paddingTop: 12, paddingBottom: 8 },
  count: { color: colors.textFaint, fontSize: 12, paddingHorizontal: 16, marginTop: 8 },
  empty: { color: colors.textFaint, textAlign: 'center', marginTop: 40 }
});
