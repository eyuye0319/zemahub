import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../lib/theme';
import { useLanguage } from '../../lib/i18n';
import { useCatalog } from '../../context/CatalogContext';
import { useFavorites } from '../../context/FavoritesContext';
import AppHeader from '../../components/AppHeader';
import { MediaRow } from '../../components/MediaRow';

export default function SavedScreen() {
  const { t } = useLanguage();
  const { mezmurs, films } = useCatalog();
  const { favorites } = useFavorites();
  const items = [...mezmurs, ...films].filter((i) => favorites.includes(i.id));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AppHeader title={t.tabSaved} />
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <MediaRow item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color={colors.gold600} />
            <Text style={styles.emptyText}>{t.savedEmpty}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  emptyText: { color: colors.textMuted, textAlign: 'center', lineHeight: 21 }
});
