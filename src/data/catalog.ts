// Canonical video catalog
export type EpisodeCategory = 'music-video' | 'sing-along' | 'sensory';
export type EpisodeLanguage = 'EN' | 'ES';
export type AgeBand = '2-4' | '3-6' | '5-8' | 'all';

export interface Episode {
  id: string;                    // unique, slug-safe, e.g. 'i-am-blessed-en'
  youtubeId: string;             // 11-char YouTube video ID
  title: string;
  titleEs?: string;
  description: string;
  descriptionEs?: string;
  category: EpisodeCategory;
  language: EpisodeLanguage;
  thumbnail: string;             // public/ path or full URL
  dateIso: string;               // 'YYYY-MM-DD'
  dateLabel: string;             // 'MAR 2025'
  durationSec: number;
  ageBand: AgeBand;
  tags: string[];                // ['joy','praise','psalm-139',...]
  sensoryFriendly: boolean;      // quiet/soft enough for bedtime/sensory mode
  pairedId?: string;             // id of the same-song-other-language pair, if exists
}

export const EPISODES: Episode[] = [
  {
    id: 'good-news-en',
    youtubeId: 'lSEEuAj90yg',
    title: 'The Good News',
    description: "Join Andy, Libni, and Shiloh in their very first adventure as they learn about God's amazing love for us!",
    category: 'music-video',
    language: 'EN',
    thumbnail: '/thumb-good-news-en.jpg',
    dateIso: '2024-12-01',
    dateLabel: 'DEC 2024',
    durationSec: 215,
    ageBand: 'all',
    tags: ['love', 'good-news', 'worship'],
    sensoryFriendly: false,
    pairedId: 'jesus-me-ama-es'
  },
  {
    id: 'good-news-singalong-en',
    youtubeId: 'I4CcFUSW9B0',
    title: 'The Good News | Sing-Along',
    description: 'Sing along with the lyrics on screen to the catchy theme song from The Good News episode!',
    category: 'sing-along',
    language: 'EN',
    thumbnail: '/thumb-good-news-singalong-en.jpg',
    dateIso: '2024-12-01',
    dateLabel: 'DEC 2024',
    durationSec: 215,
    ageBand: 'all',
    tags: ['love', 'good-news', 'sing-along'],
    sensoryFriendly: true,
    pairedId: 'jesus-me-ama-singalong-es'
  },
  {
    id: 'sensory-good-news-en',
    youtubeId: 'taaL8fXYRL8',
    title: 'The Good News | Sensory',
    description: 'A calming sensory video with gentle music from The Good News to help kids relax and unwind.',
    category: 'sensory',
    language: 'EN',
    thumbnail: '/thumb-sensory-good-news-en.jpg',
    dateIso: '2024-12-01',
    dateLabel: 'DEC 2024',
    durationSec: 300,
    ageBand: 'all',
    tags: ['calm', 'sensory', 'bedtime'],
    sensoryFriendly: true,
    pairedId: 'sensory-fruto-es'
  },
  {
    id: 'praise-lord-en',
    youtubeId: '7zSjDUVGPqk',
    title: 'This Is How We Praise The Lord',
    description: 'A high-energy sing-along that gets kids moving and praising God with all their heart!',
    category: 'music-video',
    language: 'EN',
    thumbnail: '/thumb-praise-lord-en.jpg',
    dateIso: '2025-03-01',
    dateLabel: 'MAR 2025',
    durationSec: 184,
    ageBand: 'all',
    tags: ['praise', 'dance', 'worship', 'energy'],
    sensoryFriendly: false,
    pairedId: 'asi-le-adoramos-es'
  },
  {
    id: 'praise-lord-singalong-en',
    youtubeId: 'LlwrkJqF78k',
    title: 'This Is How We Praise The Lord | Sing-Along',
    description: 'Follow along with the lyrics and sing This Is How We Praise The Lord with your family!',
    category: 'sing-along',
    language: 'EN',
    thumbnail: '/thumb-praise-lord-singalong-en.jpg',
    dateIso: '2025-03-01',
    dateLabel: 'MAR 2025',
    durationSec: 184,
    ageBand: 'all',
    tags: ['praise', 'sing-along', 'worship'],
    sensoryFriendly: false,
    pairedId: 'asi-le-adoramos-singalong-es'
  },
  {
    id: 'praise-dance-sensory-en',
    youtubeId: 'bBZWxQ-iyQg',
    title: 'This Is How We Praise The Lord | Sensory',
    description: 'A soothing sensory video featuring gentle visuals and the praise song for a calming worship experience.',
    category: 'sensory',
    language: 'EN',
    thumbnail: '/thumb-praise-dance-sensory-en.jpg',
    dateIso: '2025-03-01',
    dateLabel: 'MAR 2025',
    durationSec: 360,
    ageBand: 'all',
    tags: ['calm', 'sensory', 'worship'],
    sensoryFriendly: true,
    pairedId: 'asi-le-adoramos-sensory-es'
  },
  {
    id: 'i-am-blessed-en',
    youtubeId: 'UlPvIR9lOtQ',
    title: 'I Am Blessed',
    description: 'A wonderful reminder that we are blessed by God! Sing along with Andy and Libni in this uplifting song.',
    category: 'music-video',
    language: 'EN',
    thumbnail: '/thumb-i-am-blessed-en.jpg',
    dateIso: '2025-04-01',
    dateLabel: 'APR 2025',
    durationSec: 198,
    ageBand: 'all',
    tags: ['blessed', 'joy', 'worship'],
    sensoryFriendly: false,
    pairedId: 'bendecido-estoy-es'
  },
  {
    id: 'jesus-me-ama-es',
    youtubeId: '_hr_gpb7eF4',
    title: 'Jesús Me Ama',
    titleEs: 'Jesús Me Ama',
    description: '¡Únete a Andy, Libni y Shiloh mientras aprenden sobre el asombroso amor de Dios por nosotros!',
    descriptionEs: '¡Únete a Andy, Libni y Shiloh mientras aprenden sobre el asombroso amor de Dios por nosotros!',
    category: 'music-video',
    language: 'ES',
    thumbnail: '/thumb-jesus-me-ama-es.jpg',
    dateIso: '2024-12-01',
    dateLabel: 'DIC 2024',
    durationSec: 215,
    ageBand: 'all',
    tags: ['amor', 'adoración', 'niños'],
    sensoryFriendly: false,
    pairedId: 'good-news-en'
  },
  {
    id: 'jesus-me-ama-singalong-es',
    youtubeId: 'TEe85CM3Dy8',
    title: 'Jesús Me Ama | Canta Conmigo',
    titleEs: 'Jesús Me Ama | Canta Conmigo',
    description: '¡Canta junto con las letras en pantalla esta hermosa canción de adoración para niños!',
    descriptionEs: '¡Canta junto con las letras en pantalla esta hermosa canción de adoración para niños!',
    category: 'sing-along',
    language: 'ES',
    thumbnail: '/thumb-jesus-me-ama-singalong-es.jpg',
    dateIso: '2024-12-01',
    dateLabel: 'DIC 2024',
    durationSec: 215,
    ageBand: 'all',
    tags: ['amor', 'canta-conmigo', 'adoración'],
    sensoryFriendly: true,
    pairedId: 'good-news-singalong-en'
  },
  {
    id: 'sensory-fruto-es',
    youtubeId: 'W13CYmXJL4A',
    title: 'Jesús Me Ama | Sensorial',
    titleEs: 'Jesús Me Ama | Sensorial',
    description: 'Un video sensorial relajante con música suave y animaciones gentiles para momentos de tranquilidad.',
    descriptionEs: 'Un video sensorial relajante con música suave y animaciones gentiles para momentos de tranquilidad.',
    category: 'sensory',
    language: 'ES',
    thumbnail: '/thumb-sensory-fruto-es.jpg',
    dateIso: '2024-12-01',
    dateLabel: 'DIC 2024',
    durationSec: 300,
    ageBand: 'all',
    tags: ['tranquilidad', 'sensorial', 'dormir'],
    sensoryFriendly: true,
    pairedId: 'sensory-good-news-en'
  },
  {
    id: 'asi-le-adoramos-es',
    youtubeId: 'NGyayfO4j7o',
    title: 'Así Le Adoramos',
    titleEs: 'Así Le Adoramos',
    description: '¡Una canción llena de energía que hace que los niños se muevan y alaben a Dios con todo su corazón!',
    descriptionEs: '¡Una canción llena de energía que hace que los niños se muevan y alaben a Dios con todo su corazón!',
    category: 'music-video',
    language: 'ES',
    thumbnail: '/thumb-asi-le-adoramos-es.jpg',
    dateIso: '2025-03-01',
    dateLabel: 'MAR 2025',
    durationSec: 184,
    ageBand: 'all',
    tags: ['alabanza', 'danza', 'adoración', 'energía'],
    sensoryFriendly: false,
    pairedId: 'praise-lord-en'
  },
  {
    id: 'asi-le-adoramos-singalong-es',
    youtubeId: 'HLkc_LuYikQ',
    title: 'Así Le Adoramos | Canta Conmigo',
    titleEs: 'Así Le Adoramos | Canta Conmigo',
    description: '¡Sigue las letras y canta Así Le Adoramos junto con tu familia!',
    descriptionEs: '¡Sigue las letras y canta Así Le Adoramos junto con tu familia!',
    category: 'sing-along',
    language: 'ES',
    thumbnail: '/thumb-asi-le-adoramos-singalong-es.jpg',
    dateIso: '2025-03-01',
    dateLabel: 'MAR 2025',
    durationSec: 184,
    ageBand: 'all',
    tags: ['alabanza', 'canta-conmigo', 'adoración'],
    sensoryFriendly: false,
    pairedId: 'praise-lord-singalong-en'
  },
  {
    id: 'asi-le-adoramos-sensory-es',
    youtubeId: 'DLl17_SA1pg',
    title: 'Así Le Adoramos | Sensorial',
    titleEs: 'Así Le Adoramos | Sensorial',
    description: 'Un video sensorial relajante con la canción Así Le Adoramos para una experiencia de adoración calmante.',
    descriptionEs: 'Un video sensorial relajante con la canción Así Le Adoramos para una experiencia de adoración calmante.',
    category: 'sensory',
    language: 'ES',
    thumbnail: '/thumb-asi-le-adoramos-sensory-es.jpg',
    dateIso: '2025-03-01',
    dateLabel: 'MAR 2025',
    durationSec: 360,
    ageBand: 'all',
    tags: ['tranquilidad', 'sensorial', 'adoración'],
    sensoryFriendly: true,
    pairedId: 'praise-dance-sensory-en'
  },
  {
    id: 'bendecido-estoy-es',
    youtubeId: 'cHXnDnRLrEU',
    title: 'Bendecido Estoy',
    titleEs: 'Bendecido Estoy',
    description: '¡Un hermoso recordatorio de que somos bendecidos por Dios! Canta junto con Andy y Libni.',
    descriptionEs: '¡Un hermoso recordatorio de que somos bendecidos por Dios! Canta junto con Andy y Libni.',
    category: 'music-video',
    language: 'ES',
    thumbnail: '/thumb-bendecido-estoy-es.jpg',
    dateIso: '2025-04-01',
    dateLabel: 'ABR 2025',
    durationSec: 198,
    ageBand: 'all',
    tags: ['bendecido', 'gozo', 'adoración'],
    sensoryFriendly: false,
    pairedId: 'i-am-blessed-en'
  }
];

export const getEpisode = (id: string): Episode | undefined => EPISODES.find(e => e.id === id);
export const getEpisodesByLanguage = (lang: EpisodeLanguage) => EPISODES.filter(e => e.language === lang);
export const getEpisodesByCategory = (cat: EpisodeCategory) => EPISODES.filter(e => e.category === cat);
export const getSensoryEpisodes = () => EPISODES.filter(e => e.sensoryFriendly);
export const getTodaysPick = (dateIso: string): Episode => {
  // deterministic by date-mod-length
  const days = Math.floor(new Date(dateIso).getTime() / 86400000);
  return EPISODES[days % EPISODES.length];
};
