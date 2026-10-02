import React, { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { MediaType, Mezmur, SpiritualFilm } from '../../../lib/types';
import { api, shareUrlFor } from '../../../lib/api';
import { colors, radius } from '../../../lib/theme';
import { useLanguage } from '../../../lib/i18n';
import { creatorOf, formatViews, isMezmur } from '../../../lib/media';
import { useCatalog } from '../../../context/CatalogContext';
import { useFavorites } from '../../../context/FavoritesContext';
import YouTubePlayer from '../../../components/YouTubePlayer';
import CommentsSection from '../../../components/CommentsSection';
import { MediaRow } from '../../../components/MediaRow';
import { StateView } from '../../../components/ui';

type Tab = 'about' | 'comments' | 'related';

export default function MediaScreen() {
  const { type, id } = useLocalSearchParams<{ type: MediaType; id: string }>();
  const { t, pick } = useLanguage();
  const { findMedia, mezmurs, films, loading, error, refresh } = useCatalog();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [tab, setTab] = useState<Tab>('about');

  const media = findMedia(type, id);

  useEffect(() => {
    setTab('about');
    if (media) {
      api(`/api/${type === 'mezmur' ? 'mezmur' : 'films'}/${media.id}/view`, { method: 'POST' }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, id, Boolean(media)]);

  if (!media) {
    return (
      <View style={styles.screen}>
        <StateView loading={loading} error={error || t.noResults} onRetry={refresh} />
      </View>
    );
  }

  const title = pick(media.titleAmharic, media.titleEnglish);
  const otherTitle = pick(media.titleEnglish, media.titleAmharic);
  const saved = isFavorite(media.id);
  const pool: (Mezmur | SpiritualFilm)[] = isMezmur(media) ? mezmurs : films;
  const related = pool
    .filter((m) => m.id !== media.id && (m.category === media.category || creatorOf(m, pick) === creatorOf(media, pick)))
    .slice(0, 6);

  const share = async () => {
    const url = shareUrlFor(type, media.id);
    try {
      const result = await Share.share({ message: `${media.titleAmharic} — ${media.titleEnglish}\n${t.shareMessage}: ${url}` });
      if (result.action === Share.sharedAction) {
        api(`/api/share/${type}/${media.id}`, { method: 'POST' }).catch(() => {});
      }
    } catch {}
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: '' }} />
      <YouTubePlayer videoId={media.youtubeVideoId} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {otherTitle !== title ? <Text style={styles.otherTitle}>{otherTitle}</Text> : null}
        <Text style={styles.creator}>{creatorOf(media, pick)}</Text>
        <Text style={styles.meta}>
          {pick(media.categoryAmharic, media.categoryEnglish)} • {media.year} • {formatViews(media.views)} {t.views}
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <Action icon={saved ? 'heart' : 'heart-outline'} label={saved ? t.saved : t.save} onPress={() => toggleFavorite(media.id)} active={saved} />
          <Action icon="share-social-outline" label={t.share} onPress={share} />
          <Action icon="logo-youtube" label="YouTube" onPress={() => Linking.openURL(media.youtubeUrl)} />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['about', 'comments', 'related'] as Tab[]).map((k) => (
            <Pressable key={k} onPress={() => setTab(k)} style={[styles.tab, tab === k && styles.tabActive]}>
              <Text style={[styles.tabText, tab === k && styles.tabTextActive]}>{t[k]}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'about' ? (
          <View style={{ gap: 12 }}>
            <Text style={styles.description}>{pick(media.descriptionAmharic, media.descriptionEnglish)}</Text>
            <View style={styles.facts}>
              <Fact label={t.year} value={String(media.year)} />
              <Fact label={t.language} value={media.language} />
              {media.duration ? <Fact label="⏱" value={media.duration} /> : null}
              {media.sourceChannel ? <Fact label={t.source} value={media.sourceChannel} /> : null}
            </View>
            {isMezmur(media) && media.lyrics ? (
              <View style={styles.lyrics}>
                <Text style={styles.lyricsTitle}>{t.lyrics}</Text>
                <Text style={styles.lyricsText}>{media.lyrics}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {tab === 'comments' ? <CommentsSection type={type} id={media.id} /> : null}

        {tab === 'related' ? (
          <View style={{ gap: 10 }}>
            {related.map((m) => (
              <MediaRow key={m.id} item={m} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Action({ icon, label, onPress, active }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; onPress: () => void; active?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icon} size={20} color={active ? '#f43f5e' : colors.gold400} />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 6, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800', lineHeight: 27 },
  otherTitle: { color: colors.gold300, fontSize: 13, fontStyle: 'italic' },
  creator: { color: colors.gold400, fontSize: 14, fontWeight: '700', marginTop: 4 },
  meta: { color: colors.textFaint, fontSize: 12 },
  actions: { flexDirection: 'row', gap: 10, marginVertical: 12 },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  actionText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 14 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.gold400 },
  tabText: { color: colors.textFaint, fontWeight: '700' },
  tabTextActive: { color: colors.gold300 },
  description: { color: colors.textMuted, fontSize: 14, lineHeight: 22 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fact: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '100%'
  },
  factLabel: { color: colors.textFaint, fontSize: 12 },
  factValue: { color: colors.text, fontSize: 12, fontWeight: '700', flexShrink: 1 },
  lyrics: { padding: 14, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  lyricsTitle: { color: colors.gold300, fontWeight: '800', marginBottom: 8 },
  lyricsText: { color: colors.text, fontSize: 14, lineHeight: 22 }
});
