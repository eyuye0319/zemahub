// src/utils/searchHelper.ts
import { Mezmur, SpiritualFilm } from '../types';

/**
 * Normalizes text for resilient matching across Amharic character variants,
 * spelling differences (e.g. ተወዳሮስ vs ቴዎድሮስ), and case-insensitive English.
 */
export function normalizeSearchTerm(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    // Common Amharic vowel/character equivalences & normalization
    .replace(/[ሀሁሂሃሄህሆ]/g, (c) => c)
    .replace(/[ሐሑሒሓሔሕሖ]/g, (c) => 'ሀሁሂሃሄህሆ'['ሐሑሒሓሔሕሖ'.indexOf(c)] || c)
    .replace(/[ኀኁኂኃኄኅኆ]/g, (c) => 'ሀሁሂሃሄህሆ'['ኀኁኂኃኄኅኆ'.indexOf(c)] || c)
    .replace(/[ሠሡሢሣሤሥሦ]/g, (c) => 'ሰሱሲሳሴስሶ'['ሠሡሢሣሤሥሦ'.indexOf(c)] || c)
    .replace(/[ዐዑዒዓዔዕዖ]/g, (c) => 'አኡኢኣኤእኦ'['ዐዑዒዓዔዕዖ'.indexOf(c)] || c)
    .replace(/[ጸጹጺጻጼጽጾ]/g, (c) => 'ፀፁፂፃፄፅፆ'['ጸጹጺጻጼጽጾ'.indexOf(c)] || c);
}

/**
 * Checks if a search keyword matches a Mezmur record across all relevant fields,
 * including specific support for name spellings like "ተወዳሮስ", "ቴዎድሮስ", "Tewodros".
 */
export function matchMezmurSearch(mezmur: Mezmur, rawQuery: string): boolean {
  if (!rawQuery || !rawQuery.trim()) return true;

  const raw = rawQuery.toLowerCase().trim();
  const normalized = normalizeSearchTerm(raw);

  // 1. Direct field inclusion checks (fast path)
  const fieldsToSearch = [
    mezmur.title || '',
    mezmur.titleAmharic || '',
    mezmur.titleEnglish || '',
    mezmur.singer || '',
    mezmur.singerAmharic || '',
    mezmur.singerEnglish || '',
    mezmur.category || '',
    mezmur.categoryAmharic || '',
    mezmur.categoryEnglish || '',
    mezmur.description || '',
    mezmur.descriptionAmharic || '',
    mezmur.descriptionEnglish || '',
    mezmur.lyrics || '',
    String(mezmur.year || ''),
    mezmur.language || ''
  ];

  for (const field of fieldsToSearch) {
    const lower = field.toLowerCase();
    if (lower.includes(raw)) return true;
    if (normalizeSearchTerm(lower).includes(normalized)) return true;
  }

  // 2. Smart synonym and transliteration expansion
  // Dn. Tewodros Yoseph aliases (handling "ተወዳሮስ", "ቴዎድሮስ", "ቲዎድሮስ", "ትዎድሮስ", "tewodros", "tedros", "theodros", "yoseph", "yosef")
  const isTewodrosQuery = 
    raw.includes('ተወዳሮስ') ||
    raw.includes('ቴዎድሮስ') ||
    raw.includes('ቲዎድሮስ') ||
    raw.includes('ትዎድሮስ') ||
    raw.includes('ቴዎድሮስ ዮሴፍ') ||
    raw.includes('ተወዳሮስ ዮሴፍ') ||
    raw.includes('tewodros') ||
    raw.includes('theodros') ||
    raw.includes('tedros') ||
    raw.includes('yoseph') ||
    raw.includes('yosef');

  if (isTewodrosQuery) {
    const isTewodrosMezmur = 
      mezmur.singerAmharic.includes('ቴዎድሮስ') ||
      mezmur.singerAmharic.includes('ተወዳሮስ') ||
      mezmur.singerEnglish.toLowerCase().includes('tewodros') ||
      mezmur.singer.toLowerCase().includes('tewodros') ||
      mezmur.titleAmharic.includes('ቴዎድሮስ') ||
      mezmur.titleEnglish.toLowerCase().includes('tewodros');
    if (isTewodrosMezmur) return true;
  }

  // Dn. Yilma Hailu aliases
  const isYilmaQuery = 
    raw.includes('ይልማ') ||
    raw.includes('ይልማ ኃይሉ') ||
    raw.includes('yilma') ||
    raw.includes('hailu');

  if (isYilmaQuery) {
    const isYilmaMezmur =
      mezmur.singerAmharic.includes('ይልማ') ||
      mezmur.singerEnglish.toLowerCase().includes('yilma') ||
      mezmur.singer.toLowerCase().includes('yilma');
    if (isYilmaMezmur) return true;
  }

  return false;
}

/**
 * Checks if a search keyword matches a Film record.
 */
export function matchFilmSearch(film: SpiritualFilm, rawQuery: string): boolean {
  if (!rawQuery || !rawQuery.trim()) return true;

  const raw = rawQuery.toLowerCase().trim();
  const normalized = normalizeSearchTerm(raw);

  const fieldsToSearch = [
    film.title || '',
    film.titleAmharic || '',
    film.titleEnglish || '',
    film.director || '',
    film.directorAmharic || '',
    film.directorEnglish || '',
    ...(film.actors || []),
    film.category || '',
    film.categoryAmharic || '',
    film.categoryEnglish || '',
    film.description || '',
    film.descriptionAmharic || '',
    film.descriptionEnglish || '',
    String(film.year || ''),
    film.language || ''
  ];

  for (const field of fieldsToSearch) {
    const lower = field.toLowerCase();
    if (lower.includes(raw)) return true;
    if (normalizeSearchTerm(lower).includes(normalized)) return true;
  }

  return false;
}
