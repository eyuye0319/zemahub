import type { MediaItem, MediaType, Mezmur, SpiritualFilm } from './types';

export const isMezmur = (item: MediaItem): item is Mezmur => 'singer' in item;

export const mediaType = (item: MediaItem): MediaType => (isMezmur(item) ? 'mezmur' : 'film');

export function creatorOf(item: MediaItem, pick: (am?: string, en?: string) => string) {
  return isMezmur(item)
    ? pick(item.singerAmharic, item.singerEnglish)
    : pick((item as SpiritualFilm).directorAmharic, (item as SpiritualFilm).directorEnglish);
}

export const thumbnailOf = (item: MediaItem) => `https://i.ytimg.com/vi/${item.youtubeVideoId}/mqdefault.jpg`;

export function formatViews(views: number) {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(views);
}

export const byFeatured = <T extends { featured?: boolean }>(items: T[]) => [
  ...items.filter((i) => i.featured),
  ...items.filter((i) => !i.featured)
];
