// src/db/initial_data.ts
// Seed catalog. Every entry points to a real, embeddable YouTube upload; upload date,
// duration and view count were taken from YouTube when the catalog was compiled (Oct 2026).
import { Mezmur, SpiritualFilm, CategoryInfo, SingerArtist, PlatformStats } from '../types';

// Bump when the seed catalog changes so existing databases pick up the new content.
export const CATALOG_VERSION = 2;

export const initialCategories: CategoryInfo[] = [
  {
    id: 'mariam',
    nameAmharic: 'የእመቤታችን ቅድስት ድንግል ማርያም',
    nameEnglish: 'Saint Mary (Mariam)',
    type: 'mezmur',
    iconName: 'Heart',
    descriptionAmharic: 'ለእመቤታችን ለቅድስት ድንግል ማርያም የተዘመሩ ምስጋናዎችና ውዳሴዎች',
    descriptionEnglish: 'Hymns and praises dedicated to the Holy Virgin Mary'
  },
  {
    id: 'praise',
    nameAmharic: 'ምስጋናና አምልኮ',
    nameEnglish: 'Praise & Thanksgiving',
    type: 'mezmur',
    iconName: 'Sparkles',
    descriptionAmharic: 'ለእግዚአብሔር ቸርነትና ማዳን የሚቀርቡ የምስጋና መዝሙራት',
    descriptionEnglish: 'Hymns of thanksgiving for the goodness and salvation of God'
  },
  {
    id: 'repentance',
    nameAmharic: 'የንስሐ መዝሙራት',
    nameEnglish: 'Repentance (Nissiha)',
    type: 'mezmur',
    iconName: 'Flame',
    descriptionAmharic: 'ልብን ወደ ንስሐና ወደ እግዚአብሔር ምሕረት የሚመልሱ መዝሙራት',
    descriptionEnglish: 'Hymns that call the heart to repentance and God\'s mercy'
  },
  {
    id: 'angels_saints',
    nameAmharic: 'የቅዱሳን መላእክትና ጻድቃን',
    nameEnglish: 'Angels & Holy Saints',
    type: 'mezmur',
    iconName: 'Shield',
    descriptionAmharic: 'ለቅዱስ ሚካኤል፣ ገብርኤል፣ ጊዮርጊስና ጻድቃን የተዘመሩ',
    descriptionEnglish: 'Songs venerating Archangels Michael & Gabriel and holy martyrs'
  },
  {
    id: 'tsige',
    nameAmharic: 'ዘመነ ጽጌ',
    nameEnglish: 'Season of the Flower (Zemene Tsige)',
    type: 'mezmur',
    iconName: 'Sparkles',
    descriptionAmharic: 'በጽጌ ወራት የሚዘመሩ የማኅሌተ ጽጌ እና የፍቅር ዝማሬዎች',
    descriptionEnglish: 'Seasonal hymns sung during the sacred autumn flower season'
  },
  {
    id: 'meskel',
    nameAmharic: 'የበዓለ መስቀል',
    nameEnglish: 'Feast of the Holy Cross (Meskel)',
    type: 'mezmur',
    iconName: 'Cross',
    descriptionAmharic: 'የክቡር መስቀሉ ክብርና ምስጋና መዝሙራት',
    descriptionEnglish: 'Chants honoring the discovery and power of the Holy Cross'
  },
  {
    id: 'genna',
    nameAmharic: 'የልደት (ገና) መዝሙራት',
    nameEnglish: 'Nativity (Genna)',
    type: 'mezmur',
    iconName: 'Star',
    descriptionAmharic: 'የጌታችንን የኢየሱስ ክርስቶስን ልደት የሚያበስሩ መዝሙራት',
    descriptionEnglish: 'Hymns proclaiming the birth of our Lord Jesus Christ'
  },
  {
    id: 'timket',
    nameAmharic: 'የበዓለ ጥምቀትና ኤጲፋንያ',
    nameEnglish: 'Epiphany & Baptism (Timket)',
    type: 'mezmur',
    iconName: 'Sun',
    descriptionAmharic: 'የጥምቀትና የቃና ዘገሊላ ደማቅ የሆታ ዝማሬዎች',
    descriptionEnglish: 'Joyful melodies for Ethiopian Epiphany and the wedding at Cana'
  },
  {
    id: 'lent_fasika',
    nameAmharic: 'የዐቢይ ጾምና የትንሣኤ (ፋሲካ)',
    nameEnglish: 'Great Lent & Pascha (Fasika)',
    type: 'mezmur',
    iconName: 'Flame',
    descriptionAmharic: 'የሆሳዕና፣ የሕማማትና የትንሣኤ ብርሃን መዝሙራት',
    descriptionEnglish: 'Hymns of Hosanna, Holy Week passion, and the glorious Resurrection'
  },
  {
    id: 'yared',
    nameAmharic: 'ያሬዳዊ ዜማና ወረብ',
    nameEnglish: 'St. Yared Chant & Wereb',
    type: 'mezmur',
    iconName: 'BookOpen',
    descriptionAmharic: 'በቅዱስ ያሬድ ዜማ በግዕዝ የሚቀርቡ ወረቦችና ማኅሌቶች',
    descriptionEnglish: 'Ge\'ez liturgical chant and wereb in the tradition of St. Yared'
  },
  {
    id: 'english_hymns',
    nameAmharic: 'የእንግሊዝኛ ኦርቶዶክስ መዝሙራት',
    nameEnglish: 'English Orthodox Hymns',
    type: 'mezmur',
    iconName: 'Globe',
    descriptionAmharic: 'በዓለም ዙሪያ ላሉ ወጣቶች በእንግሊዝኛ የተዘጋጁ የኦርቶዶክስ መዝሙራት',
    descriptionEnglish: 'Orthodox Tewahedo hymns sung in the English language'
  },
  {
    id: 'saint_films',
    nameAmharic: 'የቅዱሳን ገድላትና ታሪክ',
    nameEnglish: 'Hagiographies & Lives of Saints',
    type: 'film',
    iconName: 'BookOpen',
    descriptionAmharic: 'የቅዱሳን ሰማዕታትና ጻድቃን ገድል የሚተርኩ ድንቅ ፊልሞች',
    descriptionEnglish: 'Films depicting the sacrifices and lives of holy martyrs and saints'
  },
  {
    id: 'biblical_dramas',
    nameAmharic: 'የመጽሐፍ ቅዱስ ታሪኮች',
    nameEnglish: 'Biblical Narrative Dramas',
    type: 'film',
    iconName: 'Film',
    descriptionAmharic: 'የብሉይና የሐዲስ ኪዳን ታሪኮች በድራማ መልክ',
    descriptionEnglish: 'Dramatic adaptations of Old and New Testament scripture'
  },
  {
    id: 'monastery_doc',
    nameAmharic: 'የገዳማት ታሪክና ዘጋቢ ፊልም',
    nameEnglish: 'Monasteries & Sacred Heritage',
    type: 'film',
    iconName: 'Compass',
    descriptionAmharic: 'የጥንታውያን ገዳማትና አብያተ ክርስቲያናት ታሪካዊ ዘጋቢ ፊልሞች',
    descriptionEnglish: 'Documentaries exploring ancient monasteries and churches'
  },
  {
    id: 'church_history',
    nameAmharic: 'የቤተ ክርስቲያን ታሪክና በዓላት',
    nameEnglish: 'Church History & Feasts',
    type: 'film',
    iconName: 'Globe',
    descriptionAmharic: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ታሪክ፣ ሊቃውንትና በዓላት',
    descriptionEnglish: 'The history, teachers and feasts of the Ethiopian Orthodox Tewahedo Church'
  }
];

const categoryById = new Map(initialCategories.map((c) => [c.id, c]));

function youtube(videoId: string) {
  return {
    youtubeVideoId: videoId,
    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  };
}

function categoryNames(id: string) {
  const c = categoryById.get(id);
  if (!c) throw new Error(`Unknown category in seed data: ${id}`);
  return { category: id, categoryAmharic: c.nameAmharic, categoryEnglish: c.nameEnglish };
}

function mezmurDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function filmDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

interface MezmurSeed {
  id: string;
  videoId: string;
  am: string;
  en: string;
  singerAm: string;
  singerEn: string;
  category: string;
  language?: string;
  uploaded: string;
  seconds: number;
  views: number;
  channel: string;
  descAm: string;
  descEn: string;
  lyrics?: string;
  featured?: boolean;
}

function mezmur(s: MezmurSeed): Mezmur {
  return {
    id: s.id,
    title: s.am,
    titleAmharic: s.am,
    titleEnglish: s.en,
    singer: s.singerAm,
    singerAmharic: s.singerAm,
    singerEnglish: s.singerEn,
    year: Number(s.uploaded.slice(0, 4)),
    language: s.language || 'Amharic',
    ...categoryNames(s.category),
    ...youtube(s.videoId),
    description: s.descAm,
    descriptionAmharic: s.descAm,
    descriptionEnglish: s.descEn,
    lyrics: s.lyrics,
    duration: mezmurDuration(s.seconds),
    views: s.views,
    shares: 0,
    sourceChannel: s.channel,
    featured: Boolean(s.featured),
    createdAt: `${s.uploaded}T00:00:00Z`,
    updatedAt: `${s.uploaded}T00:00:00Z`
  };
}

interface FilmSeed {
  id: string;
  videoId: string;
  am: string;
  en: string;
  producerAm: string;
  producerEn: string;
  category: string;
  language?: string;
  uploaded: string;
  seconds: number;
  views: number;
  channel: string;
  descAm: string;
  descEn: string;
  featured?: boolean;
}

function film(s: FilmSeed): SpiritualFilm {
  return {
    id: s.id,
    title: s.am,
    titleAmharic: s.am,
    titleEnglish: s.en,
    director: s.producerAm,
    directorAmharic: s.producerAm,
    directorEnglish: s.producerEn,
    actors: [],
    year: Number(s.uploaded.slice(0, 4)),
    duration: filmDuration(s.seconds),
    language: s.language || 'Amharic',
    ...categoryNames(s.category),
    ...youtube(s.videoId),
    description: s.descAm,
    descriptionAmharic: s.descAm,
    descriptionEnglish: s.descEn,
    views: s.views,
    shares: 0,
    sourceChannel: s.channel,
    featured: Boolean(s.featured),
    createdAt: `${s.uploaded}T00:00:00Z`,
    updatedAt: `${s.uploaded}T00:00:00Z`
  };
}

const TEWODROS = { singerAm: 'ሊቀ መዘምራን ቴዎድሮስ ዮሴፍ', singerEn: 'Lique Mezemran Tewodros Yoseph' };
const YILMA = { singerAm: 'ሊቀ መዘምራን ይልማ ኃይሉ', singerEn: 'Lique Mezemran Yilma Hailu' };
const ABEL = { singerAm: 'ዘማሪ ዲያቆን አቤል መክብብ', singerEn: 'Zemari Dn. Abel Mekbib' };
const AHADU = { singerAm: 'አሐዱ ስቱዲዮስ (የተዋሕዶ ወጣቶች)', singerEn: 'Ahadu Studios (Tewahedo Youth)' };
const MAHTOT = 'ማኅቶት ቲዩብ - Mahtot Tube';

export const initialMezmurs: Mezmur[] = [
  // ---- Saint Mary ----
  mezmur({
    id: 'mezmur-tewodros-libonaye', videoId: 'H0jd74NmdwY', ...TEWODROS, category: 'mariam',
    am: 'ልቦናዬ ያውጣ', en: 'Libonaye Yawta (My Heart Overflows)',
    uploaded: '2021-08-20', seconds: 440, views: 49715118, channel: MAHTOT, featured: true,
    descAm: 'ከመዝሙረ ዳዊት 44 "ልቤ መልካም ነገርን አወጣ" የተወሰደ፣ ሊቀ መዘምራን ቴዎድሮስ ዮሴፍ ለእመቤታችን ያቀረቡት እጅግ ተወዳጅ የምስጋና ዝማሬ።',
    descEn: 'Lique Mezemran Tewodros Yoseph\'s beloved Marian hymn, drawn from Psalm 45 (44) "My heart overflows with a good theme". One of the most-watched Orthodox mezmurs on YouTube.'
  }),
  mezmur({
    id: 'mezmur-tewodros-fidel', videoId: 'E549idFiso4', ...TEWODROS, category: 'mariam',
    am: 'ማርያም ፊደል ናት ኑ ተማሩ', en: 'Maryam Fidel Nat (Mary Is the Alphabet, Come and Learn)',
    uploaded: '2019-11-08', seconds: 384, views: 126564, channel: 'Ethiopian Orthodox Tewahido',
    descAm: 'እመቤታችንን የእምነት ፊደል አድርጎ የሚያቀርብ፣ ምዕመናን ከእርሷ ትሕትናና እምነት እንዲማሩ የሚጋብዝ ዝማሬ።',
    descEn: 'A hymn presenting the Virgin Mary as the "alphabet" of faith, inviting the faithful to learn humility and trust from her.'
  }),
  mezmur({
    id: 'mezmur-tewodros-aynachin', videoId: 'BbYUcjWHv1c', ...TEWODROS, category: 'mariam',
    am: 'አይናችን ነሽ ማርያም', en: 'Aynachin Nesh Maryam (Mary, You Are Our Eyes)',
    uploaded: '2020-01-29', seconds: 390, views: 19929733, channel: MAHTOT, featured: true,
    descAm: 'እመቤታችን ለምዕመናን ብርሃንና መመኪያ መሆኗን የሚዘክር የሊቀ መዘምራን ቴዎድሮስ ዮሴፍ ዝማሬ።',
    descEn: 'Tewodros Yoseph sings of the Virgin Mary as the light and pride of the faithful.'
  }),
  mezmur({
    id: 'mezmur-tewodros-yikuneni', videoId: 'KUVUr2-FZSA', ...TEWODROS, category: 'mariam',
    am: 'ይኩነኒ', en: 'Yikuneni (Let It Be unto Me)',
    uploaded: '2021-02-20', seconds: 401, views: 3248468, channel: MAHTOT,
    descAm: 'እመቤታችን ለመልአኩ ገብርኤል "እንደ ቃልህ ይሁንልኝ" (ሉቃ 1:38) ያለችውን የትሕትና ቃል የሚዘክር ዝማሬ።',
    descEn: 'Named after the Ge\'ez words of the Annunciation, "Let it be unto me according to your word" (Luke 1:38).'
  }),
  mezmur({
    id: 'mezmur-abel-mistiregnaye', videoId: 'JbnfgFR_8wQ', ...ABEL, category: 'mariam',
    am: 'ምስጢረኛዬ ነሽ', en: 'Mistiregnaye Nesh (You Are My Confidant)',
    uploaded: '2024-08-19', seconds: 519, views: 34579854, channel: MAHTOT, featured: true,
    descAm: 'ዘማሪ ዲያቆን አቤል መክብብ የልቡን ምስጢር ለእመቤታችን የሚያካፍልበት፣ በሚሊዮኖች የተደመጠ የፍቅር ዝማሬ።',
    descEn: 'Dn. Abel Mekbib\'s heartfelt Marian hymn of trust, watched by tens of millions.'
  }),
  mezmur({
    id: 'mezmur-fasika-kidane', videoId: 'KTTn8skuYVU', category: 'mariam',
    singerAm: 'ዘማሪት ሲስተር ፋሲካ መኮንን', singerEn: 'Zemarit Sister Fasika Mekonnen',
    am: 'ኪዳነ ምሕረት', en: 'Kidane Mihret (Covenant of Mercy)',
    uploaded: '2019-08-20', seconds: 343, views: 1371979, channel: MAHTOT,
    descAm: 'ጌታችን ለእመቤታችን የሰጣትን የምሕረት ቃል ኪዳን የሚዘክር ዝማሬ።',
    descEn: 'A hymn on Kidane Mihret, the Covenant of Mercy that Christ gave to His Mother.'
  }),
  mezmur({
    id: 'mezmur-zmk-maryam-anti', videoId: 'o4h4vZaO0O0', category: 'mariam',
    singerAm: 'ዜማ ወጥበብ ዘማኅበረ ቅዱሳን', singerEn: 'Zema WeTibeb (Mahibere Kidusan)',
    am: 'ማርያም አንቲ', en: 'Maryam Anti (Mary, You Are)',
    uploaded: '2023-08-22', seconds: 218, views: 205322, channel: 'ዜማ ወጥበብ ዘማኅበረ ቅዱሳን - Zema WeTibeb zMK',
    descAm: 'በማኅበረ ቅዱሳን የዜማና ሥነ ጥበብ ክፍል የቀረበ የእመቤታችን የምስጋና መዝሙር።',
    descEn: 'A Marian hymn from the music and arts department of Mahibere Kidusan.'
  }),
  mezmur({
    id: 'mezmur-yigerem-limta', videoId: 'Sn-dTxZaJ1I', category: 'mariam',
    singerAm: 'ዘማሪ አርቲስት ይገረም ደጀኔ', singerEn: 'Zemari Artist Yigerem Dejene',
    am: 'ልምጣ ከደጅሽ', en: 'Limta Kedejish (Let Me Come to Your Door)',
    uploaded: '2022-09-23', seconds: 422, views: 2060945, channel: 'ቃለ መዝሙር - Kale Mezmur',
    descAm: 'ወደ እመቤታችን ደጅ በእምነትና በተስፋ የሚመጣን ምዕመን ልብ የሚገልጽ ዝማሬ።',
    descEn: 'A hymn of a believer coming to the Virgin Mary\'s door in faith and hope.'
  }),
  mezmur({
    id: 'mezmur-selamawit-degfign', videoId: 'Qx1WIT9DvyA', category: 'mariam',
    singerAm: 'ዘማሪት ሰላማዊት ሶርሳ', singerEn: 'Zemarit Selamawit Sorsa',
    am: 'ደግፊኝ ልቁም አግዥኝ ማርያም', en: 'Degfign Likum (Hold Me Up, Mary)',
    uploaded: '2025-12-06', seconds: 454, views: 4601821, channel: 'Zemarit Selamawit Sorsa',
    descAm: 'በፈተና ጊዜ የእመቤታችንን አማላጅነትና እርዳታ የሚማጸን ዝማሬ።',
    descEn: 'A prayerful hymn asking the Virgin Mary\'s intercession and help in times of trial.'
  }),
  mezmur({
    id: 'mezmur-abraham-za-kidane', videoId: 'KM-hSbPxYF4', category: 'mariam', language: 'Tigrinya',
    singerAm: 'ዲያቆን አብርሃም መሓሪ', singerEn: 'Dn. Abraham Mehari',
    am: 'ዛ ኪዳነ ምሕረት', en: 'Za Kidane Mihret (This Kidane Mihret)',
    uploaded: '2021-09-25', seconds: 347, views: 8514341, channel: 'EriOrthodox',
    descAm: 'በትግርኛ የተዘመረ የኪዳነ ምሕረት መዝሙር፤ የኤርትራ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን።',
    descEn: 'A Tigrinya hymn to Kidane Mihret from the Eritrean Orthodox Tewahedo Church.'
  }),

  // ---- Praise & Thanksgiving ----
  mezmur({
    id: 'mezmur-tewodros-bega-bet', videoId: 'AWQj5SPgg8k', ...TEWODROS, category: 'praise',
    am: 'እግዚአብሔር በኛ ቤት', en: 'Egziabher Bega Bet (God in Our House)',
    uploaded: '2024-07-14', seconds: 419, views: 13727963, channel: MAHTOT, featured: true,
    descAm: 'እግዚአብሔር በቤታችንና በሕይወታችን ያደረገውን ቸርነት የሚያመሰግን ዝማሬ።',
    descEn: 'A hymn of thanksgiving for God\'s goodness in our homes and lives.'
  }),
  mezmur({
    id: 'mezmur-tewodros-moged', videoId: 'rtvWOcuO1m4', ...TEWODROS, category: 'praise',
    am: 'ሞገድ ሲመታኝ', en: 'Moged Simetagn (When the Waves Strike Me)',
    uploaded: '2019-11-11', seconds: 291, views: 10460164, channel: MAHTOT,
    descAm: 'በሕይወት ማዕበል መካከል ጌታ እንዳልተወን የሚመሰክር ዝማሬ፤ ጌታ ባሕሩን ያረጋጋበትን ታሪክ ያስታውሳል።',
    descEn: 'A testimony that the Lord does not leave us amid life\'s storms, recalling Christ calming the sea.'
  }),
  mezmur({
    id: 'mezmur-tewodros-dinkuane', videoId: 'Wdx3l0WUcVk', ...TEWODROS, category: 'praise',
    am: 'በድንኳኔ እልልታ ሙሉ ነው', en: 'Bedinkuanie Ililta Mulu New (My Tent Is Full of Joy)',
    uploaded: '2020-01-27', seconds: 261, views: 34999719, channel: MAHTOT, featured: true,
    descAm: 'ከመዝሙረ ዳዊት 118 "የእልልታና የመድኃኒት ድምፅ በጻድቃን ድንኳን ነው" የተወሰደ የደስታ ዝማሬ።',
    descEn: 'A joyful hymn from Psalm 118: "The voice of rejoicing and salvation is in the tents of the righteous."'
  }),
  mezmur({
    id: 'mezmur-yilma-haileh', videoId: '66Edk1PDb7I', ...YILMA, category: 'praise',
    am: 'ኃይልህ ሲገለጥ', en: 'Hayleh Sigelet (When Your Power Is Revealed)',
    uploaded: '2025-04-01', seconds: 482, views: 7294435, channel: 'Yilma Hailu', featured: true,
    descAm: 'የእግዚአብሔር ኃይል በሕይወታችን ሲገለጥ የሚፈጠረውን ደስታና ምስጋና የሚገልጽ የሊቀ መዘምራን ይልማ ኃይሉ ዝማሬ።',
    descEn: 'Lique Mezemran Yilma Hailu sings of the joy and thanksgiving that follow when God\'s power is revealed.'
  }),
  mezmur({
    id: 'mezmur-hiwot-nana-amanuel', videoId: 'i4C-QO5qANY', category: 'praise',
    singerAm: 'ዘማሪት ሲስተር ሕይወት ተፈሪ', singerEn: 'Zemarit Sister Hiwot Teferi',
    am: 'ናና አማኑኤል', en: 'Nana Amanuel (Come, Emmanuel)',
    uploaded: '2025-05-04', seconds: 373, views: 6166142, channel: 'Zemarit Sister Hiwot Teferi',
    descAm: 'አማኑኤል — "እግዚአብሔር ከእኛ ጋር" — ወደ ሕይወታችን እንዲመጣ የሚጣራ ዝማሬ።',
    descEn: 'A call for Emmanuel, "God with us", to come into our lives.'
  }),
  mezmur({
    id: 'mezmur-mk-gneyu', videoId: 'rGo0gUVxH-M', category: 'praise',
    singerAm: 'የማኅበረ ቅዱሳን መዘምራን', singerEn: 'Mahibere Kidusan Choir',
    am: 'ግነዩ', en: 'Gneyu (Give Thanks)',
    uploaded: '2021-01-28', seconds: 441, views: 391482, channel: 'Mahibere Kidusan',
    descAm: '"ግነዩ ለእግዚአብሔር እስመ ኄር" — ለእግዚአብሔር አመስግኑ ቸር ነውና (መዝ 136) የሚለውን የሚዘምር የማኅበረ ቅዱሳን መዝሙር።',
    descEn: 'From Psalm 136, "Give thanks to the Lord, for He is good", sung by the Mahibere Kidusan choir.'
  }),
  mezmur({
    id: 'mezmur-seblewongel-hager', videoId: 'xcHZScAhi3Q', category: 'praise',
    singerAm: 'ዘማሪት ሰብለ ወንጌል እሸቴ', singerEn: 'Zemarit Seblewongel Eshete',
    am: 'ኦርቶዶክስ ተዋሕዶ ሀገር ናት', en: 'Orthodox Tewahedo Hager Nat (Tewahedo Is a Homeland)',
    uploaded: '2020-05-31', seconds: 364, views: 6118836, channel: MAHTOT,
    descAm: 'ቤተ ክርስቲያን ለኢትዮጵያ ያበረከተችውን እምነት፣ ታሪክና ቅርስ የሚዘክር ዝማሬ።',
    descEn: 'A hymn celebrating the faith, history and heritage the Tewahedo Church has given Ethiopia.'
  }),

  // ---- Repentance ----
  mezmur({
    id: 'mezmur-tewodros-etebegn', videoId: 'hl3FH-wzRMs', ...TEWODROS, category: 'repentance',
    am: 'እጠበኝ ቆሽሻለሁ', en: 'Etebegn Kosheshalehu (Wash Me, I Am Unclean)',
    uploaded: '2019-03-21', seconds: 377, views: 6766807, channel: MAHTOT,
    descAm: 'ከመዝሙረ ዳዊት 51 "እጠበኝ ከበረዶም ይልቅ ነጭ እሆናለሁ" የተወሰደ የንስሐ ዝማሬ።',
    descEn: 'A hymn of repentance from Psalm 51: "Wash me, and I shall be whiter than snow."'
  }),
  mezmur({
    id: 'mezmur-yilma-dawit-lib', videoId: 'eO-SQUix7Vs', ...YILMA, category: 'repentance',
    am: 'በኃይልና በጥበብ (የዳዊት ልብ)', en: 'Behaylina Betibeb (The Heart of David)',
    uploaded: '2024-04-15', seconds: 352, views: 1439170, channel: 'Yilma Hailu',
    descAm: 'እንደ ንጉሥ ዳዊት የተሰበረና የተዋረደ ልብ ለእግዚአብሔር የሚያቀርብ የንስሐ ዝማሬ።',
    descEn: 'A repentance hymn offering God a broken and contrite heart, like King David.'
  }),
  mezmur({
    id: 'mezmur-abel-kidanish', videoId: 'ZbiR4W18i0g', ...ABEL, category: 'repentance',
    am: 'ኪዳንሽ ነው', en: 'Kidanish New (It Is Your Covenant)',
    uploaded: '2026-02-22', seconds: 324, views: 8055973, channel: MAHTOT,
    descAm: 'ኃጢአተኛው በእመቤታችን ቃል ኪዳን ተማምኖ ወደ ንስሐ የሚመለስበት የዐቢይ ጾም ዝማሬ።',
    descEn: 'A Lenten hymn of a sinner returning to repentance, trusting in the Covenant of Mercy.'
  }),

  // ---- Angels & Saints ----
  mezmur({
    id: 'mezmur-tewodros-bizu-lijoch', videoId: 'pGXj7JRUIe0', ...TEWODROS, category: 'angels_saints',
    am: 'ብዙ ልጆች አሉት ለስሙ ምስክር', en: 'Bizu Lijoch Alut (Many Children Bear Witness)',
    uploaded: '2020-01-20', seconds: 422, views: 15225492, channel: MAHTOT,
    descAm: 'የሊቀ መላእክት ቅዱስ ሚካኤልን ተራዳኢነት የሚመሰክሩ ብዙ ልጆች እንዳሉ የሚዘምር መዝሙር።',
    descEn: 'A hymn testifying to the many who have been helped by the Archangel St. Michael.'
  }),
  mezmur({
    id: 'mezmur-tewodros-gebriel-hayal', videoId: 'vN0EjtzFnPI', ...TEWODROS, category: 'angels_saints',
    am: 'ገብርኤል ኃያል', en: 'Gebriel Hayal (Mighty Gabriel)',
    uploaded: '2019-12-28', seconds: 348, views: 6331553, channel: MAHTOT,
    descAm: 'ሠለስቱ ደቂቅን ከእሳት ያዳነውን ኃያሉን መልአክ ቅዱስ ገብርኤልን የሚያመሰግን ዝማሬ (ታኅሣሥ 19)።',
    descEn: 'Honoring the mighty Archangel Gabriel, who saved the Three Youths from the furnace (feast of Tahsas 19).'
  }),
  mezmur({
    id: 'mezmur-abel-mikael', videoId: 'w7TAJIjniHk', ...ABEL, category: 'angels_saints',
    am: 'ሚካኤል ይለይብኛል', en: 'Mikael Yileyibignal (Michael Stands Out for Me)',
    uploaded: '2022-11-19', seconds: 522, views: 38782714, channel: MAHTOT, featured: true,
    descAm: 'የሊቀ መላእክት ቅዱስ ሚካኤልን ጠባቂነትና ምልጃ የሚዘምር፣ በብዙ ሚሊዮኖች የተደመጠ ዝማሬ።',
    descEn: 'Dn. Abel Mekbib\'s widely loved hymn on the protection and intercession of the Archangel Michael.'
  }),
  mezmur({
    id: 'mezmur-abel-gebriel-rama', videoId: '2Zw9BbSlJnM', ...ABEL, category: 'angels_saints',
    am: 'ገብርኤል መልአከ ራማ', en: 'Gebriel Melake Rama (Gabriel, Angel of Rama)',
    uploaded: '2021-08-24', seconds: 338, views: 22439993, channel: MAHTOT,
    descAm: 'የምሥራች መልአክ ለሆነው ለቅዱስ ገብርኤል የቀረበ የምስጋና ዝማሬ።',
    descEn: 'A hymn to St. Gabriel, the angel of good tidings.'
  }),
  mezmur({
    id: 'mezmur-abel-giorgis', videoId: 'bbkK8V6ttJ8', ...ABEL, category: 'angels_saints',
    am: 'ጊዮርጊስ', en: 'Giorgis (Saint George)',
    uploaded: '2022-06-29', seconds: 451, views: 2718893, channel: MAHTOT,
    descAm: 'የልዳውን ኮከብ ታላቁን ሰማዕት ቅዱስ ጊዮርጊስን የሚያወድስ ዝማሬ።',
    descEn: 'In praise of the great martyr St. George of Lydda.'
  }),
  mezmur({
    id: 'mezmur-gebreyohannes-mikael', videoId: 'R4YJJL3LXoc', category: 'angels_saints',
    singerAm: 'ዘማሪ ገብረዮሐንስ ገብረጻድቅ', singerEn: 'Zemari Gebreyohannes Gebretsadik',
    am: 'ኃያሉ ሚካኤል ድንቅን አደረገ', en: 'Hayalu Mikael Dinkin Aderege (Mighty Michael Did Wonders)',
    uploaded: '2021-06-17', seconds: 320, views: 10359756, channel: 'ቤተ ቅኔ - Bete Qene',
    descAm: 'ቅዱስ ሚካኤል ለሚታመኑበት ያደረገውን ድንቅ ሥራ የሚያወሳ ዝማሬ።',
    descEn: 'A hymn recounting the wonders St. Michael has done for those who trust in his intercession.'
  }),
  mezmur({
    id: 'mezmur-abayneh-giorgis', videoId: '68dTCYg2Hrk', category: 'angels_saints',
    singerAm: 'ዘማሪ ዓባይነህ ጌታቸው', singerEn: 'Zemari Abayneh Getachew',
    am: 'እኔም ልበልህ ጊዮርጊስ', en: 'Enem Libelih Giorgis (Let Me Also Call on You, George)',
    uploaded: '2023-05-31', seconds: 436, views: 428666, channel: MAHTOT,
    descAm: 'ለቅዱስ ጊዮርጊስ በዓል (ግንቦት 23) የተዘመረ የምስጋና መዝሙር።',
    descEn: 'A hymn for the feast of St. George (Ginbot 23).'
  }),

  // ---- Nativity (Genna) ----
  mezmur({
    id: 'mezmur-tewodros-yekibir-libs', videoId: '_OtBZM7h-fM', ...TEWODROS, category: 'genna',
    am: 'የክብር ልብስ ሆነን', en: 'Yekibir Libs Honen (He Became Our Robe of Glory)',
    uploaded: '2023-01-05', seconds: 389, views: 2726956, channel: MAHTOT,
    descAm: 'ሥጋችንን ተዋሕዶ የተወለደውን ጌታ የሚያመሰግን የልደት ዝማሬ።',
    descEn: 'A Nativity hymn praising the Lord who took on our flesh and clothed us in glory.'
  }),
  mezmur({
    id: 'mezmur-fantu-begol', videoId: '3-0-_TxT-FU', category: 'genna',
    singerAm: 'ዘማሪት ፋንቱ ወልዴ', singerEn: 'Zemarit Fantu Wolde',
    am: 'በጎል በጎል', en: 'Begol Begol (In the Manger)',
    uploaded: '2019-01-06', seconds: 254, views: 6003244, channel: 'Zemarit Fantu Wolde',
    descAm: '"በጎል ሰከበ" — በበረት ተኛ — የሚለውን ያሬዳዊ ዜማ መሠረት ያደረገ የገና መዝሙር።',
    descEn: 'A Genna (Christmas) hymn built on the Yaredic phrase "Begol Sekebe" — He lay in a manger.'
  }),
  mezmur({
    id: 'mezmur-eotc-esey', videoId: 'v6LMsoI3DD8', category: 'genna',
    singerAm: 'የቤተ ክርስቲያን መዘምራን', singerEn: 'EOTC Choir',
    am: 'እሰይ ተወለደ የዓለም መድኃኒት', en: 'Esey Tewelede (Rejoice, the Saviour Is Born)',
    uploaded: '2018-01-05', seconds: 297, views: 1052820, channel: 'EOTC (Orthodox Tewahedo) Channel',
    descAm: 'በየዓመቱ በገና የሚዘመር የዓለም መድኃኒት መወለዱን የሚያበስር ተወዳጅ መዝሙር።',
    descEn: 'A classic Genna hymn sung every Christmas, proclaiming the birth of the Saviour of the world.'
  }),

  // ---- Meskel ----
  mezmur({
    id: 'mezmur-meskel-abeba', videoId: 'm8xhCEDS2Fc', category: 'meskel',
    singerAm: 'የሰንበት ትምህርት ቤት መዘምራን', singerEn: 'Sunday School Choir',
    am: 'መስቀል አበባ ነህ ውብ አበባ', en: 'Meskel Abeba Neh (O Cross, You Are a Flower)',
    uploaded: '2022-08-22', seconds: 195, views: 227046, channel: 'Orthodox Biruk - ኦርቶዶክስ ብሩክ',
    descAm: 'በመስቀል በዓል ወቅት ከሚፈካው የመስቀል አበባ ጋር የክቡር መስቀሉን ውበት የሚያነጻጽር መዝሙር።',
    descEn: 'A Meskel hymn comparing the Holy Cross to the yellow Meskel daisy that blooms at the feast.'
  }),
  mezmur({
    id: 'mezmur-betehage-meskel-abera', videoId: '07C4NXtMzTY', category: 'meskel',
    singerAm: 'ቤተ ሐጌ ኅብረ ዝማሬ', singerEn: 'Bete Hage Choir',
    am: 'መስቀል አበራ', en: 'Meskel Abera (The Cross Has Shone)',
    uploaded: '2025-09-19', seconds: 1034, views: 367058, channel: 'ቤተ ሐጌ ሚዲያ - Bete Hage Media',
    descAm: 'ንግሥት ዕሌኒ የክቡር መስቀሉን ማግኘቷን የሚያከብር የደመራና የመስቀል በዓል ዝማሬ።',
    descEn: 'A Demera and Meskel hymn celebrating Empress Helena\'s finding of the True Cross.'
  }),

  // ---- Timket ----
  mezmur({
    id: 'mezmur-bruk-kristos-temeqe', videoId: 'EYHUNLEf-LE', category: 'timket',
    singerAm: 'መሪጌታ ብሩክ ጌትነት', singerEn: 'Merigeta Bruk Getnet',
    am: 'ክርስቶስ ተጠምቀ', en: 'Kristos Temeqe (Christ Was Baptized)',
    uploaded: '2025-01-18', seconds: 490, views: 147111, channel: 'Bruk media ቡሩክ ሚድያ',
    descAm: 'ጌታችን በዮርዳኖስ መጠመቁን የሚያበስር ያሬዳዊ የጥምቀት ዝማሬ።',
    descEn: 'A Yaredic Timket hymn proclaiming Christ\'s baptism in the Jordan.'
  }),

  // ---- Great Lent & Fasika ----
  mezmur({
    id: 'mezmur-yilma-hosanna', videoId: 'pI0RkQdf-0E', ...YILMA, category: 'lent_fasika',
    am: 'ናና የምስጋና ጌታ', en: 'Nana Yemisgana Geta (Come, Lord of Praise)',
    uploaded: '2024-04-27', seconds: 370, views: 620763, channel: 'Yilma Hailu',
    descAm: 'ጌታ ወደ ኢየሩሳሌም በክብር የገባበትን የሆሳዕና በዓል የሚያከብር ዝማሬ።',
    descEn: 'A Hosanna (Palm Sunday) hymn for the Lord\'s glorious entry into Jerusalem.'
  }),
  mezmur({
    id: 'mezmur-yilma-hemamat', videoId: '9klAgOuQeBA', ...YILMA, category: 'lent_fasika',
    am: 'በዕፀ መስቀሉ የተከፈለልኝ', en: 'Be\'etse Meskelu (Paid for Me on the Cross)',
    uploaded: '2024-05-02', seconds: 309, views: 1914656, channel: 'Yilma Hailu',
    descAm: 'በሰሙነ ሕማማት የሚደመጥ፣ ጌታ በመስቀል ላይ የከፈለውን ዋጋ የሚያስታውስ ዝማሬ።',
    descEn: 'A Holy Week (Hemamat) hymn remembering the price Christ paid on the Cross.'
  }),
  mezmur({
    id: 'mezmur-tewodros-tenestual', videoId: 'KHwUIAKnji4', ...TEWODROS, category: 'lent_fasika',
    am: 'እንደተናገረ ተነስቷል', en: 'Endetenagere Tenestual (He Is Risen as He Said)',
    uploaded: '2020-04-18', seconds: 396, views: 1299864, channel: MAHTOT,
    descAm: 'መልአኩ ለሴቶቹ "እንደ ተናገረ ተነሥቷል" (ማቴ 28:6) ያለውን የምሥራች የሚዘምር የትንሣኤ መዝሙር።',
    descEn: 'A Resurrection hymn on the angel\'s words to the women: "He is risen, as He said" (Matthew 28:6).'
  }),
  mezmur({
    id: 'mezmur-yilma-eyuna-emenu', videoId: 'PFbekyVhaq8', ...YILMA, category: 'lent_fasika',
    am: 'እዩና እመኑ ሰዎች', en: 'Eyuna Emenu Sewoch (Come, See and Believe)',
    uploaded: '2024-05-06', seconds: 208, views: 440605, channel: 'Yilma Hailu',
    descAm: 'ባዶውን መቃብር አይተው እንዲያምኑ የሚጋብዝ የትንሣኤ ዝማሬ።',
    descEn: 'An Easter hymn inviting all to see the empty tomb and believe.'
  }),

  // ---- Zemene Tsige ----
  mezmur({
    id: 'mezmur-betehage-kesete-demena', videoId: '4hXWvyb1ocw', category: 'tsige',
    singerAm: 'ቤተ ሐጌ ኅብረ ዝማሬ', singerEn: 'Bete Hage Choir',
    am: 'ቀስተ ደመና', en: 'Kesete Demena (The Rainbow)',
    uploaded: '2025-02-21', seconds: 394, views: 116459, channel: 'ቤተ ሐጌ ሚዲያ - Bete Hage Media',
    descAm: 'እመቤታችንን የኖኅ ቃል ኪዳን ምልክት በሆነው ቀስተ ደመና የሚመስል ኅብረ ዝማሬ።',
    descEn: 'A choral hymn likening the Virgin Mary to the rainbow, sign of God\'s covenant with Noah.'
  }),
  mezmur({
    id: 'mezmur-tsige-wereb', videoId: 'NLMAIhU5NpE', category: 'tsige', language: 'Ge\'ez',
    singerAm: 'የማኅሌት ሊቃውንት', singerEn: 'Mahlet Chanters',
    am: 'ማኅሌተ ጽጌ ወረብ — ጥቅምት 2', en: 'Mahlete Tsige Wereb — Tikimt 2',
    uploaded: '2025-10-06', seconds: 924, views: 36475, channel: 'ሥርዓተ ቤተ ክርስቲያን ሚዲያ',
    descAm: 'በዘመነ ጽጌ ቅዳሜ ሌሊት በሚቆመው ማኅሌተ ጽጌ የሚቀርቡ ወረቦች በዜማ።',
    descEn: 'Wereb from the all-night Mahlete Tsige vigil sung during the Season of Flowers.'
  }),

  // ---- St. Yared Chant ----
  mezmur({
    id: 'mezmur-yared-way-zema', videoId: 'uclbVCGyGKY', category: 'yared', language: 'Ge\'ez',
    singerAm: 'ያሬዳውያን ሊቃውንት', singerEn: 'Yaredic Chanters',
    am: 'ዋይ ዜማ — ዝክረ ቅዱስ ያሬድ', en: 'Way Zema — Remembering St. Yared',
    uploaded: '2020-11-14', seconds: 602, views: 394728, channel: 'Begena Tube',
    descAm: 'ቅዱስ ያሬድን የሚዘክር፣ በጥንታዊው ያሬዳዊ ዜማ የቀረበ መዝሙር።',
    descEn: 'A tribute to St. Yared, the 6th-century father of Ethiopian sacred music, in traditional Yaredic chant.'
  }),
  mezmur({
    id: 'mezmur-yared-hosanna', videoId: 'SgGV6xbEQJY', category: 'yared', language: 'Ge\'ez',
    singerAm: 'መዝሙረ ተዋሕዶ ዘቅዱስ ያሬድ', singerEn: 'Mezmure Tewahdo ZeKidus Yared',
    am: 'ሆሳዕና ለወልደ ዳዊት', en: 'Hosanna LeWolde Dawit (Hosanna to the Son of David)',
    uploaded: '2019-04-17', seconds: 163, views: 198580, channel: 'መዝሙረ ተዋህዶ ዘቅዱስ ያሬድ Mezmure Tewahdo ZeKidus Yared',
    descAm: 'በሆሳዕና በዓል የሚዘመረው "ሆሳዕና ለወልደ ዳዊት" የግዕዝ ያሬዳዊ ዜማ።',
    descEn: 'The Ge\'ez Yaredic chant "Hosanna to the Son of David", sung on Palm Sunday.'
  }),

  // ---- English Orthodox Hymns ----
  mezmur({
    id: 'mezmur-ahadu-saved-me', videoId: 'JmPYFSgH23c', ...AHADU, category: 'english_hymns', language: 'English',
    am: 'ያዳነኝን አውቀዋለው', en: 'I Know the One Who Has Saved Me',
    uploaded: '2022-10-30', seconds: 430, views: 1793655, channel: 'Ahadu Studios', featured: true,
    descAm: 'በተዋሕዶ ወጣቶች በእንግሊዝኛና በአማርኛ የቀረበ የጌታችንን አዳኝነት የሚመሰክር መዝሙር።',
    descEn: 'An English and Amharic Orthodox Tewahedo youth hymn testifying to Christ the Saviour.'
  }),
  mezmur({
    id: 'mezmur-ahadu-praise-you', videoId: 'RDNDcWwU-lQ', ...AHADU, category: 'english_hymns', language: 'English',
    am: 'ላመስግንህ የኔ ጌታ', en: 'I Will Praise You',
    uploaded: '2023-09-02', seconds: 506, views: 406047, channel: 'Ahadu Studios',
    descAm: 'የተወደደው "ላመስግንህ የኔ ጌታ" መዝሙር በእንግሊዝኛ ትርጉም።',
    descEn: 'The beloved Amharic mezmur "Lamesginih Yene Geta" rendered in English.'
  }),
  mezmur({
    id: 'mezmur-ahadu-cana', videoId: 'hAoyUXx0mws', ...AHADU, category: 'english_hymns', language: 'English',
    am: 'ቃና ዘገሊላ', en: 'Cana of Galilee',
    uploaded: '2023-04-23', seconds: 345, views: 135386, channel: 'Ahadu Studios',
    descAm: 'ጌታ በቃና ሰርግ ውኃውን ወደ ወይን የለወጠበትን ተአምር የሚዘምር የእንግሊዝኛ መዝሙር።',
    descEn: 'An English hymn on the miracle at the wedding in Cana, celebrated right after Timket.'
  }),
  mezmur({
    id: 'mezmur-ahadu-yared-melody', videoId: 'c_dgQujBR7Q', ...AHADU, category: 'english_hymns', language: 'English',
    am: 'የያሬድ ውብ ዜማ', en: 'Melody of Yared',
    uploaded: '2022-08-22', seconds: 452, views: 509723, channel: 'Ahadu Studios',
    descAm: 'የቅዱስ ያሬድን ዜማ ውበት ለአዲሱ ትውልድ በእንግሊዝኛ የሚያስተዋውቅ መዝሙር።',
    descEn: 'A hymn introducing the beauty of St. Yared\'s melody to a new generation in English.'
  }),
  mezmur({
    id: 'mezmur-spot-my-savior', videoId: 'ymbPCyhm0jk', category: 'english_hymns', language: 'English',
    singerAm: 'የስፖት መዘምራን', singerEn: 'SPOT Choir',
    am: 'መድኃኒቴ ሆይ', en: 'O My Savior',
    uploaded: '2024-12-11', seconds: 307, views: 6322, channel: 'SPOT Church',
    descAm: 'በዲያስፖራ የሚገኙ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ወጣቶች መዘምራን ያቀረቡት የእንግሊዝኛ መዝሙር።',
    descEn: 'An English EOTC hymn by the SPOT youth choir in the diaspora.'
  }),
  mezmur({
    id: 'mezmur-agni-parthene', videoId: '4uiIwkgmE0o', category: 'english_hymns', language: 'English',
    singerAm: 'የኦርቶዶክስ መዘምራን', singerEn: 'Orthodox Choir',
    am: 'ድንግል ንጽሕት (አግኒ ፓርቴኔ)', en: 'O Virgin Pure (Agni Parthene)',
    uploaded: '2019-03-27', seconds: 484, views: 396647, channel: 'In Hoc Signo Vinces',
    descAm: 'በግሪካዊው ቅዱስ ኔክታርዮስ የተደረሰ፣ በመላው ዓለም ኦርቶዶክሳውያን ዘንድ የሚዘመር የእመቤታችን ውዳሴ በእንግሊዝኛ።',
    descEn: 'The Marian hymn "Agni Parthene", written by St. Nektarios of Aegina and loved across the Orthodox world, sung in English.',
    lyrics: `O Virgin pure, immaculate, O Lady Theotokos,
O rejoice, Bride unwedded!
O Virgin Queen and Mother pure, O fleece bedewed with heaven's grace,
O rejoice, Bride unwedded!
More radiant than the rays of sun, and higher than the heavens,
O rejoice, Bride unwedded!
Delight of virgin choruses, superior to angels,
O rejoice, Bride unwedded!`
  })
];

export const initialFilms: SpiritualFilm[] = [
  // ---- Lives of Saints ----
  film({
    id: 'film-st-george-1', videoId: '-uvESyrY9RI', category: 'saint_films',
    producerAm: 'ኢትዮጵያ ተዋሕዶ', producerEn: 'Ethiopia Tewahedo',
    am: 'ቅዱስ ጊዮርጊስ — ክፍል ፩', en: 'The Life of Saint George — Part 1',
    uploaded: '2022-01-31', seconds: 4026, views: 86988, channel: 'ኢትዮጵያ ተዋሕዶ Ethiopia Tewahedo', featured: true,
    descAm: 'የልዳው ሰማዕት ቅዱስ ጊዮርጊስ በአረማዊው ንጉሥ ፊት በእምነቱ ጸንቶ የተቀበለውን መከራ የሚያሳይ መንፈሳዊ ፊልም፤ በአማርኛ።',
    descEn: 'A spiritual film, in Amharic, on how the martyr St. George of Lydda stood firm in his faith before a pagan king.'
  }),
  film({
    id: 'film-st-george-2', videoId: 'ATIDfioX8pI', category: 'saint_films',
    producerAm: 'የቅዱሳን ታሪክ ፊልም', producerEn: 'Saint George Film',
    am: 'ቅዱስ ጊዮርጊስ — ክፍል ፪ (በእንግሊዝኛ ንዑስ ጽሑፍ)', en: 'Saint George — Part 2 (English Subtitles)',
    uploaded: '2015-06-09', seconds: 4060, views: 59192, channel: 'SORASORAFFFF',
    descAm: 'የቅዱስ ጊዮርጊስ የሰማዕትነት ታሪክ ሁለተኛ ክፍል በእንግሊዝኛ ንዑስ ጽሑፍ።',
    descEn: 'The second part of the martyrdom of St. George, with English subtitles.'
  }),
  film({
    id: 'film-tekle-haymanot', videoId: 'jO4r1wxbKTY', category: 'saint_films',
    producerAm: 'ሰማያት ሚዲያ (ተራኪ ዘላለም ኃይሉ)', producerEn: 'Semayat Media (narrated by Zelalem Hailu)',
    am: 'የአቡነ ተክለ ሃይማኖት ታሪክ', en: 'The Life of Abune Tekle Haymanot',
    uploaded: '2023-08-30', seconds: 3586, views: 932910, channel: 'Semayat Media', featured: true,
    descAm: 'የደብረ ሊባኖስ መሥራች፣ ጻድቁ አቡነ ተክለ ሃይማኖት ከልደታቸው እስከ ዕረፍታቸው ያለውን ገድል የሚተርክ።',
    descEn: 'The life of Abune Tekle Haymanot, founder of Debre Libanos and one of Ethiopia\'s most beloved saints, from birth to repose.'
  }),
  film({
    id: 'film-gebre-menfes-kidus', videoId: 'BQkkp1B-l3M', category: 'saint_films',
    producerAm: 'መና ቲዩብ', producerEn: 'Mena Tube',
    am: 'አቡነ ገብረ መንፈስ ቅዱስ — መንፈሳዊ ፊልም', en: 'Abune Gebre Menfes Kidus — Spiritual Film',
    uploaded: '2025-10-02', seconds: 1355, views: 149116, channel: 'መና ቲዩብ - Mena Tube',
    descAm: 'ከአራዊት ጋር በበረሃ በጾምና በጸሎት የኖሩትን የጻድቁ አቡነ ገብረ መንፈስ ቅዱስን ሕይወት የሚያሳይ ፊልም።',
    descEn: 'A film on the ascetic Abune Gebre Menfes Kidus, who lived in fasting and prayer among wild animals in the wilderness.'
  }),
  film({
    id: 'film-path-of-yared', videoId: 'Ksyq4foZEHM', category: 'saint_films',
    producerAm: 'ዜማ ወጥበብ ዘማኅበረ ቅዱሳን', producerEn: 'Zema WeTibeb (Mahibere Kidusan)',
    am: 'የያሬድ መንገድ', en: 'The Path of Yared',
    uploaded: '2026-01-14', seconds: 4031, views: 98566, channel: 'ዜማ ወጥበብ ዘማኅበረ ቅዱሳን - Zema WeTibeb zMK', featured: true,
    descAm: 'በማኅበረ ቅዱሳን የተዘጋጀ፣ የቅዱስ ያሬድን ሕይወትና ዜማ የሚያሳይ መንፈሳዊ ፊልም።',
    descEn: 'A spiritual feature film by Mahibere Kidusan on the life and calling of St. Yared.'
  }),
  film({
    id: 'film-virgin-mary', videoId: 'vPqtt2PcJdU', category: 'saint_films',
    producerAm: 'ማህተም ቲዩብ እና ኀይመት ሚዲያ', producerEn: 'Mahtem Tube & Haymet Media',
    am: 'የእመቤታችን ቅድስት ድንግል ማርያም ታሪክ', en: 'The Life of the Holy Virgin Mary',
    uploaded: '2025-12-24', seconds: 4393, views: 46600, channel: 'ማህተም ቲዩብ - MAHTEM TUBE',
    descAm: 'የእመቤታችንን ልደት፣ በቤተ መቅደስ ማደግና የጌታችን እናት መሆኗን የሚያሳይ ሙሉ መንፈሳዊ ፊልም።',
    descEn: 'A full-length spiritual film on the birth of the Virgin Mary, her upbringing in the Temple, and her becoming the Mother of God.'
  }),
  film({
    id: 'film-flight-to-egypt', videoId: 'qPxf9JAcYns', category: 'saint_films',
    producerAm: 'ሰማያት ሚዲያ (ተራኪ ዘላለም ኃይሉ)', producerEn: 'Semayat Media (narrated by Zelalem Hailu)',
    am: 'የእመቤታችን ስደት', en: 'The Flight of Our Lady to Egypt',
    uploaded: '2023-10-27', seconds: 2381, views: 443872, channel: 'Semayat Media',
    descAm: 'እመቤታችን ከሕፃኑ ጌታ ጋር ከሄሮድስ ሸሽታ ወደ ግብፅ የተሰደደችበትን ታሪክ የሚተርክ (በጾመ ጽጌ ወቅት የሚታሰብ)።',
    descEn: 'The story of the Holy Family\'s flight from Herod to Egypt, remembered during the Season of Flowers.'
  }),
  film({
    id: 'film-arsema', videoId: 'GaNKdPDxRdI', category: 'saint_films',
    producerAm: 'የተዋህዶ መዝሙሮች', producerEn: 'Ye Tewahido Mezmur',
    am: 'ቅድስት አርሴማ', en: 'Saint Arsema',
    uploaded: '2024-07-21', seconds: 4393, views: 78220, channel: 'Ye Tewahido Mezmur | የተዋህዶ መዝሙሮች',
    descAm: 'ከንጉሥ ድርጣድስ ጋብቻን እምቢ ብላ ለክርስቶስ በድንግልና ሰማዕትነትን የተቀበለችውን የቅድስት አርሴማን ታሪክ የሚያሳይ ፊልም።',
    descEn: 'The story of St. Arsema, who refused marriage to King Tiridates and accepted martyrdom for Christ.'
  }),
  film({
    id: 'film-justina-cyprian', videoId: '-ySqU0sbST8', category: 'saint_films',
    producerAm: 'የቅዱሳን ታሪክ', producerEn: 'Yekidusan Tarik',
    am: 'ቅድስት ዮስቲና እና ቅዱስ ቆጵርያኖስ — ክፍል ፩', en: 'Saints Justina and Cyprian — Part 1',
    uploaded: '2017-12-24', seconds: 3500, views: 278523, channel: 'የቅዱሳን ታሪክ / Yekidusan Tarik',
    descAm: 'ጠንቋዩ ቆጵርያኖስ በቅድስት ዮስቲና እምነት ተሸንፎ ክርስቲያንና ሰማዕት የሆነበትን ታሪክ የሚያሳይ ፊልም።',
    descEn: 'How the sorcerer Cyprian was overcome by the faith of St. Justina and became a Christian and martyr.'
  }),
  film({
    id: 'film-mary-of-egypt', videoId: 'jZmRbYLj5lw', category: 'saint_films',
    producerAm: 'ዜማ ወጥበብ ዘማኅበረ ቅዱሳን', producerEn: 'Zema WeTibeb (Mahibere Kidusan)',
    am: 'ማርያም ግብጻዊት', en: 'Saint Mary of Egypt',
    uploaded: '2026-02-21', seconds: 5772, views: 227355, channel: 'ዜማ ወጥበብ ዘማኅበረ ቅዱሳን - Zema WeTibeb zMK', featured: true,
    descAm: 'ከኃጢአት ሕይወት ተመልሳ በበረሃ በንስሐ የኖረችውን የቅድስት ማርያም ግብጻዊትን ሕይወት የሚያሳይ የማኅበረ ቅዱሳን ፊልም።',
    descEn: 'A Mahibere Kidusan film on St. Mary of Egypt, who turned from a life of sin to decades of repentance in the desert.'
  }),
  film({
    id: 'film-habte-mariam', videoId: '0v3mNX6SFgw', category: 'saint_films',
    producerAm: 'የድንቅ ዓለም', producerEn: 'Ye Dink Alem',
    am: 'ገድለ አቡነ ሐብተ ማርያም', en: 'The Gedl of Abune Habte Mariam',
    uploaded: '2022-11-05', seconds: 7956, views: 301751, channel: 'የድንቅ ዓለም',
    descAm: 'የጻድቁ አቡነ ሐብተ ማርያም ገድል በትረካ፤ ከገድላት አንደበት።',
    descEn: 'A narrated reading of the Gedl (hagiography) of the righteous Abune Habte Mariam.'
  }),
  film({
    id: 'film-afomia', videoId: 'nyWW8U9jatQ', category: 'saint_films',
    producerAm: 'ፍኖተ ወንጌል', producerEn: 'Finote Wongel',
    am: 'ቅድስት አፎምያ', en: 'Saint Afomia',
    uploaded: '2025-06-18', seconds: 1055, views: 184182, channel: 'ፍኖተ ወንጌል',
    descAm: 'በቅዱስ ሚካኤል ተራዳኢነት ከሰይጣን ፈተና የዳነችውን የቅድስት አፎምያን ታሪክ የሚያሳይ መንፈሳዊ ፊልም።',
    descEn: 'The story of St. Afomia, delivered from the devil\'s temptation through the help of the Archangel Michael.'
  }),

  // ---- Biblical Dramas ----
  film({
    id: 'film-job', videoId: 'TX2N0L0DoS4', category: 'biblical_dramas',
    producerAm: 'የቅዱሳን ታሪክ', producerEn: 'Yekidusan Tarik',
    am: 'ትዕግስተኛው ቅዱስ ኢዮብ', en: 'Job the Patient',
    uploaded: '2017-09-13', seconds: 3445, views: 874974, channel: 'የቅዱሳን ታሪክ / Yekidusan Tarik', featured: true,
    descAm: 'ሁሉን አጥቶ በእምነቱ የጸናውን የጻድቁ ኢዮብን ታሪክ የሚያሳይ ሙሉ ፊልም።',
    descEn: 'A full film of the righteous Job, who lost everything yet held fast to his faith in God.'
  }),
  film({
    id: 'film-prophet-samuel', videoId: 'XITDtfFBoSM', category: 'biblical_dramas',
    producerAm: 'ኦርቶዶክስ', producerEn: 'Orthodox',
    am: 'ነቢዩ ሳሙኤል', en: 'The Prophet Samuel',
    uploaded: '2023-02-07', seconds: 3329, views: 12011, channel: 'ኦርቶዶክስ | Orthodox',
    descAm: 'ከእናቱ ከሐና ጸሎት የተወለደውን የነቢዩ ሳሙኤልን ሕይወት የሚያሳይ ሙሉ ፊልም።',
    descEn: 'The life of the Prophet Samuel, born in answer to his mother Hannah\'s prayer.'
  }),
  film({
    id: 'film-joseph', videoId: 'pY2hnOxIHyk', category: 'biblical_dramas', language: 'Tigrinya',
    producerAm: 'ቅዱስ ጊዮርጊስ ቲዩብ', producerEn: 'Qdus Giyorgis Tube',
    am: 'ዮሴፍ ወዲ ያዕቆብ — ክፍል ፩', en: 'Joseph, Son of Jacob — Part 1',
    uploaded: '2024-12-25', seconds: 5509, views: 211477, channel: 'qdus giyorgis Tube',
    descAm: 'በወንድሞቹ ተሸጦ በግብፅ የከበረውን የዮሴፍን ታሪክ የሚያሳይ በትግርኛ የተዘጋጀ ኦርቶዶክሳዊ ፊልም።',
    descEn: 'A Tigrinya Orthodox film on Joseph, sold by his brothers and raised to honor in Egypt.'
  }),

  // ---- Church History & Feasts ----
  film({
    id: 'film-st-yared-doc', videoId: 'HuEJIivmEkg', category: 'church_history',
    producerAm: 'ማኅቶት ቲዩብ', producerEn: 'Mahtot Tube',
    am: 'የቅዱስ ያሬድ ዘጋቢ ፊልም', en: 'Saint Yared — Documentary',
    uploaded: '2021-02-21', seconds: 3986, views: 235487, channel: MAHTOT,
    descAm: 'የኢትዮጵያ ዜማ አባት የቅዱስ ያሬድን ሕይወት፣ ሥራዎችና ዛሬም ሕያው የሆነውን ቅርሱን የሚያሳይ ዘጋቢ ፊልም።',
    descEn: 'A documentary on St. Yared, father of Ethiopian sacred music, his works and his living legacy.'
  }),
  film({
    id: 'film-eotc-history', videoId: 'iTe2M54EYuY', category: 'church_history', language: 'English',
    producerAm: 'አሐዱ ስቱዲዮስ', producerEn: 'Ahadu Studios',
    am: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ታሪክ', en: 'History of the Ethiopian Orthodox Tewahedo Church',
    uploaded: '2020-10-24', seconds: 2277, views: 44259, channel: 'Ahadu Studios',
    descAm: 'ከጃንደረባው እስከ ዛሬ ያለውን የቤተ ክርስቲያናችንን ታሪክ በእንግሊዝኛ የሚያቀርብ።',
    descEn: 'The history of the Church in English, from the Ethiopian eunuch of Acts 8 to the present day.'
  }),
  film({
    id: 'film-eotc-explained', videoId: '-8W1zuAOZeA', category: 'church_history', language: 'English',
    producerAm: 'ሌትስ ቶክ ሪሊጅን', producerEn: 'Let\'s Talk Religion',
    am: 'የኢትዮጵያ ኦርቶዶክስ ቤተ ክርስቲያን ሲብራራ', en: 'The Ethiopian Orthodox Church Explained',
    uploaded: '2024-09-27', seconds: 2087, views: 647755, channel: 'Let\'s Talk Religion',
    descAm: 'የቤተ ክርስቲያኒቱን ታሪክ፣ ቀኖና፣ ሥርዓተ አምልኮና ልዩ ትውፊቶች ለውጭው ዓለም የሚያስረዳ የእንግሊዝኛ ዘጋቢ።',
    descEn: 'An English explainer on the Church\'s history, biblical canon, liturgy and distinctive traditions.'
  }),
  film({
    id: 'film-keepers-of-ark', videoId: 'JFxaZ-dkebw', category: 'church_history', language: 'English',
    producerAm: 'ታይምላይን', producerEn: 'Timeline — World History Documentaries',
    am: 'የታቦተ ጽዮን ጠባቂዎች', en: 'Keepers of the Lost Ark',
    uploaded: '2019-05-25', seconds: 3022, views: 2247268, channel: 'Timeline - World History Documentaries', featured: true,
    descAm: 'በአክሱም ጽዮን ማርያም ይገኛል ተብሎ የሚታመነውን ታቦተ ጽዮንና ጠባቂዎቹን የሚመረምር ዘጋቢ ፊልም።',
    descEn: 'A documentary investigating the Ethiopian tradition that the Ark of the Covenant rests at St. Mary of Zion in Axum.'
  }),
  film({
    id: 'film-timkat-natgeo', videoId: 'm83UAO2ThGM', category: 'church_history', language: 'English',
    producerAm: 'ናሽናል ጂኦግራፊክ', producerEn: 'National Geographic',
    am: 'ጥምቀት', en: 'Timkat',
    uploaded: '2007-12-17', seconds: 307, views: 92859, channel: 'National Geographic',
    descAm: 'ታቦታት ወደ ጥምቀተ ባሕር የሚወርዱበትን የጥምቀት በዓል የሚያሳይ የናሽናል ጂኦግራፊክ አጭር ዘጋቢ።',
    descEn: 'A short National Geographic film on Timkat, when the tabots process to the water to celebrate Christ\'s baptism.'
  }),

  // ---- Monasteries & Heritage ----
  film({
    id: 'film-lalibela', videoId: 'excYNB26fhs', category: 'monastery_doc', language: 'English',
    producerAm: '60 ሚኒትስ (ሲቢኤስ ኒውስ)', producerEn: '60 Minutes (CBS News)',
    am: 'ላሊበላ — ከአለት የተፈለፈሉ ቅዱሳት መካናት', en: 'Inside Lalibela',
    uploaded: '2020-12-25', seconds: 814, views: 2384565, channel: '60 Minutes', featured: true,
    descAm: 'በገና በዓል 200,000 ምዕመናን የሚጎርፉባቸውን ከአንድ ወጥ አለት የተፈለፈሉ የላሊበላ አብያተ ክርስቲያናት የሚያሳይ ዘጋቢ።',
    descEn: 'A 60 Minutes report from the rock-hewn churches of Lalibela, where some 200,000 pilgrims gather for Genna.'
  }),
  film({
    id: 'film-abuna-yemata', videoId: 'IJCy64adY3Y', category: 'monastery_doc', language: 'English',
    producerAm: 'ግሬት ቢግ ስቶሪ', producerEn: 'Great Big Story',
    am: 'አቡነ የማታ ጉህ — በሰማይ ያለች ቤተ ክርስቲያን', en: 'Ethiopia\'s Chapel in the Sky (Abuna Yemata Guh)',
    uploaded: '2018-07-24', seconds: 202, views: 6030900, channel: 'Great Big Story',
    descAm: 'በትግራይ ገደል ላይ ተፈልፍላ ካህናቱ በየቀኑ ወጥተው የሚያገለግሉባትን የአቡነ የማታ ጉህ ቤተ ክርስቲያን የሚያሳይ።',
    descEn: 'Abuna Yemata Guh in Tigray, a church carved high into a cliff face that its priest climbs to every day.'
  }),
  film({
    id: 'film-debre-libanos', videoId: 'mpaRVOaEGYE', category: 'monastery_doc',
    producerAm: 'ኢቢኤስ ቲቪ', producerEn: 'EBS TV',
    am: 'የቃል ኪዳኑ ስፍራ — ደብረ ሊባኖስ ገዳም', en: 'Debre Libanos Monastery',
    uploaded: '2020-12-18', seconds: 1738, views: 191111, channel: 'ebstv worldwide',
    descAm: 'በአቡነ ተክለ ሃይማኖት የተመሠረተውን በሰሜን ሸዋ የሚገኘውን የደብረ ሊባኖስ ገዳምን የሚያስጎበኝ ፕሮግራም።',
    descEn: 'A visit to Debre Libanos in North Shewa, the monastery founded by Abune Tekle Haymanot.'
  }),
  film({
    id: 'film-waldba', videoId: 'C-_NapjoOZc', category: 'monastery_doc',
    producerAm: 'ሄሪቴጅስ ቲዩብ', producerEn: 'Heritages Tube',
    am: 'የታላቁ ዋልድባ ገዳም ዘጋቢ ፊልም', en: 'Waldba Monastery — Documentary',
    uploaded: '2018-11-16', seconds: 4503, views: 9051, channel: 'Heritages Tube',
    descAm: 'መነኮሳት በጽኑ ተጋድሎ የሚኖሩበትን ጥንታዊውን የዋልድባ ገዳም ሕይወትና ታሪክ የሚያሳይ ዘጋቢ ፊልም።',
    descEn: 'A documentary on the ancient Waldba monastery and the strict ascetic life of its monks.'
  }),
  film({
    id: 'film-gishen', videoId: 'XUZ-i4pqSeU', category: 'monastery_doc',
    producerAm: 'ይላቅ ግሬስ', producerEn: 'Yilak Grace',
    am: 'የግሸን ደብረ ከርቤ ታሪክና ግማደ መስቀሉ', en: 'Gishen Debre Kerbe and the Relic of the True Cross',
    uploaded: '2022-01-24', seconds: 2916, views: 186238, channel: 'Yilak Grace - ይላቅ ግሬስ',
    descAm: 'የክቡር መስቀሉ ግማድ ያረፈበትን የግሸን ደብረ ከርቤ ማርያምን ታሪክ የሚተርክ።',
    descEn: 'The history of Gishen Debre Kerbe Mariam, where a fragment of the True Cross is kept.'
  })
];

export const initialSingers: SingerArtist[] = [
  {
    id: 'singer-tewodros',
    nameAmharic: 'ሊቀ መዘምራን ቴዎድሮስ ዮሴፍ',
    nameEnglish: 'Lique Mezemran Tewodros Yoseph',
    titleAmharic: 'ሊቀ መዘምራን',
    titleEnglish: 'Chief of Hymnists',
    bioAmharic: 'በዓለም ዙሪያ በሚገኙ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ምዕመናን ዘንድ እጅግ ተወዳጅ የሆኑ በርካታ የእመቤታችንና የበዓላት መዝሙራትን ያበረከቱ ሊቀ መዘምራን።',
    bioEnglish: 'One of the most celebrated Ethiopian Orthodox hymnists, known for Marian hymns like "Libonaye Yawta" and "Aynachin Nesh Maryam".',
    photoUrl: 'https://img.youtube.com/vi/H0jd74NmdwY/hqdefault.jpg',
    featured: true
  },
  {
    id: 'singer-abel',
    nameAmharic: 'ዘማሪ ዲያቆን አቤል መክብብ',
    nameEnglish: 'Zemari Dn. Abel Mekbib',
    titleAmharic: 'ዘማሪ ዲያቆን',
    titleEnglish: 'Deacon & Hymnist',
    bioAmharic: 'በቅዱሳን መላእክትና በእመቤታችን መዝሙራቱ የሚታወቅ፣ ሥራዎቹ በአሥር ሚሊዮኖች የተደመጡ ዘማሪ።',
    bioEnglish: 'A deacon and hymnist known for hymns to the Archangels and the Virgin Mary, with tens of millions of views.',
    photoUrl: 'https://img.youtube.com/vi/w7TAJIjniHk/hqdefault.jpg',
    featured: true
  },
  {
    id: 'singer-yilma',
    nameAmharic: 'ሊቀ መዘምራን ይልማ ኃይሉ',
    nameEnglish: 'Lique Mezemran Yilma Hailu',
    titleAmharic: 'አንጋፋ ሊቀ መዘምራን',
    titleEnglish: 'Veteran Chief of Hymnists',
    bioAmharic: 'ለአሥርት ዓመታት በርካታ የንስሐ፣ የሕማማትና የምስጋና መዝሙራትን ያበረከቱ አንጋፋ ሊቀ መዘምራን።',
    bioEnglish: 'A veteran hymnist whose repentance, Holy Week and thanksgiving hymns have blessed generations.',
    photoUrl: 'https://img.youtube.com/vi/66Edk1PDb7I/hqdefault.jpg',
    featured: true
  },
  {
    id: 'singer-hiwot',
    nameAmharic: 'ዘማሪት ሲስተር ሕይወት ተፈሪ',
    nameEnglish: 'Zemarit Sister Hiwot Teferi',
    titleAmharic: 'ዘማሪት',
    titleEnglish: 'Hymnist',
    bioAmharic: 'በንስሐና በምስጋና መዝሙሮቿ የምትታወቅ የኦርቶዶክስ ተዋሕዶ ዘማሪት።',
    bioEnglish: 'An Orthodox Tewahedo hymnist known for her repentance and thanksgiving mezmurs.',
    photoUrl: 'https://img.youtube.com/vi/i4C-QO5qANY/hqdefault.jpg',
    featured: true
  },
  {
    id: 'singer-ahadu',
    nameAmharic: 'አሐዱ ስቱዲዮስ',
    nameEnglish: 'Ahadu Studios',
    titleAmharic: 'የእንግሊዝኛ ኦርቶዶክስ መዝሙራት',
    titleEnglish: 'English Orthodox Hymnody',
    bioAmharic: 'ለዲያስፖራ ወጣቶች የኦርቶዶክስ ተዋሕዶ መዝሙራትንና ትምህርቶችን በእንግሊዝኛ የሚያዘጋጅ ስቱዲዮ።',
    bioEnglish: 'A studio producing Orthodox Tewahedo hymns and teaching in English for youth in the diaspora.',
    photoUrl: 'https://img.youtube.com/vi/JmPYFSgH23c/hqdefault.jpg',
    featured: true
  }
];

export const initialStats: PlatformStats = {
  totalMezmurs: initialMezmurs.length,
  totalFilms: initialFilms.length,
  totalViews: [...initialMezmurs, ...initialFilms].reduce((sum, item) => sum + item.views, 0),
  totalSingers: initialSingers.length,
  totalCategories: initialCategories.length
};
