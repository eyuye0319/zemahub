import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { MediaItem } from '../lib/types';
import { colors, radius } from '../lib/theme';
import { useLanguage } from '../lib/i18n';
import { creatorOf, formatViews, mediaType, thumbnailOf } from '../lib/media';
import { useFavorites } from '../context/FavoritesContext';

export function openMedia(item: MediaItem) {
  router.push({ pathname: '/media/[type]/[id]', params: { type: mediaType(item), id: item.id } });
}

/** Full-width list row: thumbnail, title, creator, and a save button. */
export function MediaRow({ item }: { item: MediaItem }) {
  const { pick } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(item.id);

  return (
    <Pressable onPress={() => openMedia(item)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View>
        <Image source={thumbnailOf(item)} style={styles.thumb} contentFit="cover" transition={150} />
        {item.duration ? <Text style={styles.duration}>{item.duration}</Text> : null}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {pick(item.titleAmharic, item.titleEnglish)}
        </Text>
        <Text style={styles.creator} numberOfLines={1}>
          {creatorOf(item, pick)}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.year} • {formatViews(item.views)} • {item.language}
        </Text>
      </View>
      <Pressable hitSlop={10} onPress={() => toggleFavorite(item.id)} style={styles.heart}>
        <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? '#f43f5e' : colors.gold400} />
      </Pressable>
    </Pressable>
  );
}

/** Card for horizontal carousels. */
export function MediaCard({ item, width = 220 }: { item: MediaItem; width?: number }) {
  const { pick } = useLanguage();
  return (
    <Pressable onPress={() => openMedia(item)} style={({ pressed }) => [{ width }, pressed && styles.pressed]}>
      <View>
        <Image source={thumbnailOf(item)} style={[styles.cardThumb, { width }]} contentFit="cover" transition={150} />
        {item.duration ? <Text style={styles.duration}>{item.duration}</Text> : null}
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {pick(item.titleAmharic, item.titleEnglish)}
      </Text>
      <Text style={styles.creator} numberOfLines={1}>
        {creatorOf(item, pick)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  pressed: { opacity: 0.75 },
  thumb: { width: 128, height: 72, borderRadius: radius.sm, backgroundColor: colors.burgundy950 },
  duration: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    paddingHorizontal: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.75)',
    color: '#fff',
    fontSize: 10,
    fontWeight: '600'
  },
  info: { flex: 1, gap: 2 },
  title: { color: colors.text, fontSize: 14, fontWeight: '700' },
  creator: { color: colors.gold400, fontSize: 12 },
  meta: { color: colors.textFaint, fontSize: 11 },
  heart: { padding: 4 },
  cardThumb: { aspectRatio: 16 / 9, borderRadius: radius.md, backgroundColor: colors.burgundy950 },
  cardTitle: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 8 }
});
