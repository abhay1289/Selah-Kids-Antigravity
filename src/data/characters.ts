// Selah Kids character data
import { EpisodeLanguage } from './catalog';

export interface Character {
  // Required by the generic Collection shape (id: string). Characters have
  // always been keyed by `slug` externally; id mirrors slug for internal /
  // database use.
  id: string;
  slug: string;
  name: string;
  role: string;
  roleEs: string;
  pronouns: string;
  ageFeel: string;
  colorPrimary: string;
  colorAccent: string;
  catchphrase: { en: string; es: string };
  favoriteVerse: { ref: string; refEs?: string; text_en: string; text_es: string };
  voiceSampleUrl?: string;
  voiceIntro: { en: string; es: string };
  originStory: { en: string; es: string };
  personalityTraits: string[];
  favoriteSong: string;
  bestFriendWith: string[];
  posePng: string;
  episodeIds: string[];
  coloringPdfUrl?: string;
  /**
   * Optional per-locale slug overrides. When present, the public
   * /{locale}/characters/{slug} route resolves to `slugEn` on /en and
   * `slugEs` on /es so Spanish visitors can land on natural Spanish
   * URLs. When absent, both locales share the legacy `slug` field.
   *
   * Migration is soft: `resolveCharacter()` still matches the legacy
   * slug against both locales, so adding a slug pair never breaks the
   * old URL.
   */
  slugEn?: string;
  slugEs?: string;
}

/**
 * Resolve a character by slug + locale with a fallback chain:
 *   1. Prefer the locale-matching slug override.
 *   2. Accept the opposite-locale slug — keeps deep links alive during
 *      partial translations.
 *   3. Accept the legacy `slug` — unmigrated characters keep working.
 */
export function resolveCharacter(
  characters: Character[],
  slug: string,
  locale: 'en' | 'es',
): Character | undefined {
  return characters.find((c) => {
    const primary = locale === 'es' ? c.slugEs : c.slugEn;
    const secondary = locale === 'es' ? c.slugEn : c.slugEs;
    return primary === slug || secondary === slug || c.slug === slug;
  });
}

/**
 * Find the paired slug for the opposite locale so LanguageCrossPromo
 * can flip /en/characters/foo → /es/characters/foo-es without bouncing
 * the visitor back to the index. Returns null when no pair exists.
 */
export function pairedCharacterSlug(
  characters: Character[],
  currentSlug: string,
  targetLocale: 'en' | 'es',
): string | null {
  const character = characters.find(
    (c) => c.slug === currentSlug || c.slugEn === currentSlug || c.slugEs === currentSlug,
  );
  if (!character) return null;
  const pair = targetLocale === 'es' ? character.slugEs : character.slugEn;
  return pair ?? character.slug ?? null;
}

export const CHARACTERS: Character[] = [
  {
    id: 'libni',
    slug: 'libni',
    name: 'Libni',
    role: 'The Imaginative Neighbor',
    roleEs: 'La Vecina Imaginativa',
    pronouns: 'she/her',
    ageFeel: '6-8',
    colorPrimary: '#FF69B4',
    colorAccent: '#B668C7',
    catchphrase: { en: "Let's make a melody!", es: "¡Hagamos una melodía!" },
    favoriteVerse: { ref: 'Psalm 139:14', text_en: 'I am fearfully and wonderfully made.', text_es: 'Soy asombrosa y maravillosamente hecho.' },
    voiceSampleUrl: '/voices/libni.mp3',
    voiceIntro: { en: "Hi, I'm Libni! Do you hear that? The whole world is singing a song for God!", es: "¡Hola, soy Libni! ¿Lo oyes? ¡El mundo entero está cantando una canción para Dios!" },
    originStory: { 
      en: "Libni grew up just down the street from the Selah Kids clubhouse. With a heart full of song and a mind bursting with creativity, she finds music in everything—from the tapping of rain to the rustling of leaves. She believes that God gave everyone a unique melody to share. Her vivid imagination often turns ordinary afternoons into spectacular musical adventures, teaching everyone around her how to see the world through the colorful lens of faith and joy.", 
      es: "Libni creció muy cerca del club de Selah Kids. Con un corazón lleno de canciones y una mente rebosante de creatividad, encuentra música en todo, desde el sonido de la lluvia hasta el susurro de las hojas. Ella cree que Dios le dio a cada uno una melodía única para compartir. Su vívida imaginación a menudo convierte las tardes ordinarias en espectaculares aventuras musicales, enseñando a todos a su alrededor cómo ver el mundo a través de la colorida lente de la fe y la alegría." 
    },
    personalityTraits: ['whimsical', 'empathetic', 'daydreamer', 'musically-gifted'],
    favoriteSong: 'I Am Blessed',
    bestFriendWith: ['andy', 'shiloh'],
    posePng: '/SK_Libni_Intro_Pose-removebg-preview.png',
    episodeIds: [],
    coloringPdfUrl: '/coloring/libni.pdf'
  },
  {
    id: 'andy',
    slug: 'andy',
    name: 'Andy',
    role: 'The Natural-Born Leader',
    roleEs: 'El Líder Natural',
    pronouns: 'he/him',
    ageFeel: '7-9',
    colorPrimary: '#00BFFF',
    colorAccent: '#FEB835',
    catchphrase: { en: 'Adventure is waiting!', es: '¡La aventura nos espera!' },
    favoriteVerse: { ref: 'Joshua 1:9', text_en: 'Be strong and courageous. Do not be afraid.', text_es: 'Sé fuerte y valiente. No tengas miedo.' },
    voiceSampleUrl: '/voices/andy.mp3',
    voiceIntro: { en: "Hey, Andy here! Grab your gear, we've got a big mission for the Kingdom!", es: "¡Hola, aquí Andy! ¡Toma tus cosas, tenemos una gran misión para el Reino!" },
    originStory: { 
      en: "Andy has always been a natural explorer. Raised with a strong sense of justice and an unshakeable trust in God, he naturally steps up to guide his friends through any challenge. Whether he's building a fort or organizing a neighborhood rescue mission for a stranded kitten, Andy's energetic spirit is contagious. He learns alongside his friends that true leadership means serving others and relying on God's strength rather than just his own.", 
      es: "Andy siempre ha sido un explorador natural. Criado con un fuerte sentido de la justicia y una confianza inquebrantable en Dios, él naturalmente asume el liderazgo para guiar a sus amigos a través de cualquier desafío. Ya sea construyendo un fuerte o organizando una misión de rescate para un gatito, el espíritu enérgico de Andy es contagioso. Aprende junto a sus amigos que el verdadero liderazgo significa servir a los demás y depender de la fuerza de Dios." 
    },
    personalityTraits: ['energetic', 'protective', 'inquisitive', 'justice-driven'],
    favoriteSong: 'The Good News',
    bestFriendWith: ['libni', 'shiloh'],
    posePng: '/rroque_ALA_Shot1260_v01.png',
    episodeIds: [],
    coloringPdfUrl: '/coloring/andy.pdf'
  },
  {
    id: 'shiloh',
    slug: 'shiloh',
    name: 'Shiloh',
    role: 'The Faithful Toddler',
    roleEs: 'El Pequeño Fiel',
    pronouns: 'he/him',
    ageFeel: '3-5',
    colorPrimary: '#93D35C',
    colorAccent: '#FDFBF7',
    catchphrase: { en: 'Peace, peace!', es: '¡Paz, paz!' },
    favoriteVerse: { ref: 'Matthew 5:9', text_en: 'Blessed are the peacemakers.', text_es: 'Bienaventurados los pacificadores.' },
    voiceSampleUrl: '/voices/shiloh.mp3',
    voiceIntro: { en: "[gentle giggle] Hi! I'm Shiloh. Let's be kind today.", es: "[risa dulce] ¡Hola! Soy Shiloh. Seamos amables hoy." },
    originStory: { 
      en: "Shiloh is the youngest member of the group, a gentle toddler sheep who brings a calming presence to every adventure. Despite his small size, he has a giant heart and an intuitive sense of when someone needs comfort. Shiloh loves soft worship music, fuzzy blankets, and giving the best hugs. His innocent faith often reminds the older kids of the simple, peaceful truth of God's unconditional love, proving that you're never too young to make a difference.", 
      es: "Shiloh es el miembro más joven del grupo, una ovejita tierna que aporta una presencia tranquilizadora a cada aventura. A pesar de su pequeño tamaño, tiene un corazón gigante y un sentido intuitivo de cuándo alguien necesita consuelo. A Shiloh le encanta la música suave de adoración, las mantas peludas y dar los mejores abrazos. Su fe inocente a menudo recuerda a los niños mayores la verdad simple y pacífica del amor de Dios." 
    },
    personalityTraits: ['gentle', 'peacemaker', 'innocent', 'loyal'],
    favoriteSong: 'This Is How We Praise The Lord | Sensory',
    bestFriendWith: ['libni', 'andy'],
    posePng: '/SK_Libni_Intro_Pose-removebg-preview.png',
    episodeIds: [],
    coloringPdfUrl: '/coloring/shiloh.pdf'
  }
];

export const getCharacter = (slug: string) => CHARACTERS.find(c => c.slug === slug);
