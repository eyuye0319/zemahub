import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { MediaItem, Mezmur, SpiritualFilm } from '../lib/types';
import { api } from '../lib/api';
import { colors, radius } from '../lib/theme';
import { useLanguage } from '../lib/i18n';
import { MediaRow } from '../components/MediaRow';

// Uses the server's search, which understands Amharic spelling variants and singer name aliases.
export default function SearchScreen() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const timer = setTimeout(() => {
      api<{ mezmurs: Mezmur[]; films: SpiritualFilm[] }>(`/api/search?q=${encodeURIComponent(q)}`)
        .then((data) => !cancelled && setResults([...data.mezmurs, ...data.films]))
        .catch(() => !cancelled && setResults([]))
        .finally(() => !cancelled && setSearching(false));
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: '' }} />
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.gold400} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t.searchPlaceholder}
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          autoFocus
          returnKeyType="search"
        />
        {searching ? <ActivityIndicator color={colors.gold400} size="small" /> : null}
      </View>
      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <MediaRow item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={query.trim() && !searching ? <Text style={styles.empty}>{t.noResults}</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.burgundy950
  },
  input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  empty: { color: colors.textFaint, textAlign: 'center', marginTop: 40 }
});
