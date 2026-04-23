/**
 * Team members — Phase 3 seed source for the `team` collection.
 *
 * Extracted from src/components/about/TeamSection.tsx so this data can be
 * (a) imported by cms-fallbacks for the seed script, and (b) shared with
 * any future server-driven about page without duplicating the literal.
 *
 * The TeamSection component still renders from a static import of TEAM_MEMBERS
 * for now — the full CMS-fetch migration waits on the about page becoming a
 * Server Component (currently it runs useScroll / useTransform for the
 * parallax header, which requires 'use client').
 */

export interface TeamMember {
  id: string;
  name: string;
  titleEn: string;
  titleEs: string;
  img: string;
  bioEn: string;
  bioEs: string;
  color: string;
  bgTheme: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'leah',
    name: 'Leah',
    titleEn: 'Creator',
    titleEs: 'Creadora',
    img: '/leah.png',
    bioEn:
      "Leah is a singer-songwriter and worship leader who recognizes the impact that music can have on the heart, mind, body and soul. In addition to being a licensed pediatric speech-language therapist, she is also a mother of four active children and knows first hand the challenges that families face when seeking safe and wholesome content online.\n\nTogether with her husband, Gachener, Leah launched Selah Kids! in December 2024 in order to create an enriching, biblically sound, research-based, and child-approved space for families around the world.",
    bioEs:
      'Leah es cantautora y líder de alabanza, que reconoce el impacto que la música puede tener en el corazón, la mente y el alma. Como madre de cuatro hijos activos y licenciada en terapia del habla y el lenguaje pediátrico, comprende de primera mano los retos que enfrentan las familias actuales al buscar contenido digital seguro en línea.\n\nEn diciembre de 2024, junto a su esposo Gachener, Leah fundó Selah Kids!. Su misión es clara: ofrecer un espacio enriquecedor con fundamentos bíblicos, basado en investigaciones y "aprobado por niños" para familias de todo el mundo.',
    color: 'from-[#FF7F50] to-[#FF5C00]',
    bgTheme: 'bg-[#FF7F50]/5',
  },
  {
    id: 'rey',
    name: 'Rey',
    titleEn: 'Director of Animation',
    titleEs: 'Director de Animación',
    img: '/rey.png',
    bioEn:
      'Rey is the creative lead for the Selah Kids! art design and animation. Drawing from experience in feature film, television, and games, he values impactful storytelling and uses the most up-to-date technologies to bring Selah Kids! to life. Rey takes pride in helping raise the creative bar.\n\nThrough his animation studio, Veyra Studios, Rey creates work that not only connects with audiences worldwide, but also reflects a deeper commitment to excellence and faith.',
    bioEs:
      'Rey es el líder creativo a cargo del diseño artístico y la animación de Selah Kids!. Con una trayectoria forjada en equipos creativos para cine, televisión y videojuegos, valora la narración de historias con impacto y emplea las tecnologías más avanzadas para dar vida a Selah Kids!. Teniendo como base su valiosa experiencia, Rey se dedica a elevar el estándar visual del contenido infantil.\n\nA través de su estudio de animación, Veyra Studios, Rey crea obras que no solo cautivan a audiencias de todo el mundo, sino que también reflejan un compromiso inquebrantable con la excelencia y la fe.',
    color: 'from-[#00BFFF] to-[#87CEEB]',
    bgTheme: 'bg-[#00BFFF]/5',
  },
  {
    id: 'carla',
    name: 'Carla',
    titleEn: 'Social Media Editor',
    titleEs: 'Editora de Redes Sociales',
    img: '/carla.png',
    bioEn:
      'Carla is a passionate educator who finds her greatest joy in using her talents to serve God and His Kingdom. For Carla, being part of Selah Kids! is a mission that allows her to be a blessing to families, combining her love for teaching with her creativity to create content that inspires minds young and old.\n\nCarla enjoys sowing seeds of faith and core values into every home by crafting each message with the dedication and affection of someone who is contributing to a project with a higher eternal purpose.',
    bioEs:
      'Carla es una educadora apasionada que encuentra su mayor alegría en poner sus talentos al servicio de Dios. Para ella, formar parte de Selah Kids! es una misión que le permite bendecir a las familias, uniendo su amor por la enseñanza con su creatividad para generar contenidos que inspiren a los más pequeños.\n\nSu propósito es sembrar semillas de fe y valores en cada hogar, preparando cada mensaje con la dedicación y el cariño de quien sabe que está contribuyendo a un proyecto con propósito eterno.',
    color: 'from-[#FFD700] to-[#FEB835]',
    bgTheme: 'bg-[#FFD700]/5',
  },
];
