// src/types.ts

export type Language = 'am' | 'en';

export type ContentType = 'all' | 'mezmur' | 'film';

export type SortOption = 'newest' | 'oldest' | 'most_viewed' | 'alphabetical';

export interface Mezmur {
  id: string;
  title: string;
  titleAmharic: string;
  titleEnglish: string;
  singer: string;
  singerAmharic: string;
  singerEnglish: string;
  year: number;
  language: 'Amharic' | 'English' | 'Ge\'ez' | string;
  category: string;
  categoryAmharic: string;
  categoryEnglish: string;
  youtubeVideoId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  description: string;
  descriptionAmharic: string;
  descriptionEnglish: string;
  lyrics?: string;
  duration?: string;
  views: number;
  shares?: number;
  sourceChannel?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpiritualFilm {
  id: string;
  title: string;
  titleAmharic: string;
  titleEnglish: string;
  director: string;
  directorAmharic: string;
  directorEnglish?: string;
  actors: string[];
  year: number;
  duration: string;
  language: 'Amharic' | 'English' | 'Ge\'ez' | string;
  category: string;
  categoryAmharic: string;
  categoryEnglish: string;
  youtubeVideoId: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  description: string;
  descriptionAmharic: string;
  descriptionEnglish: string;
  views: number;
  shares?: number;
  sourceChannel?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: string;
  nameAmharic: string;
  nameEnglish: string;
  type: 'mezmur' | 'film' | 'both';
  count?: number;
  iconName?: string;
  descriptionAmharic?: string;
  descriptionEnglish?: string;
}

export interface SingerArtist {
  id: string;
  nameAmharic: string;
  nameEnglish: string;
  titleAmharic: string;
  titleEnglish: string;
  bioAmharic: string;
  bioEnglish: string;
  photoUrl: string;
  featured?: boolean;
  mezmurCount?: number;
}

export interface PlatformStats {
  totalMezmurs: number;
  totalFilms: number;
  totalViews: number;
  totalSingers: number;
  totalCategories: number;
}

export interface SearchFilterState {
  query: string;
  contentType: ContentType;
  language: 'all' | 'Amharic' | 'English' | 'Ge\'ez' | string;
  year: string;
  category: string;
  singerOrDirector: string;
  sortBy: SortOption;
}

export type UserRole = 'admin' | 'user';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface MediaComment {
  id: string;
  mediaType: 'mezmur' | 'film';
  mediaId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}
