import { BookOpen, SparklesIcon, Globe, Users, Shield, Music, School, Car, Book, Heart } from "lucide-react";

export const CHARACTERS = [
  {
    name: "Andy",
    trait: "The Friendly Leader",
    description: "Andy is a smart and friendly boy who loves to lead. He spends his days playing outside in the garden with his best friend and pet sheep, Shiloh.",
    color: "from-[#00BFFF] to-[#87CEEB]", // Sky Blue
    img: "/SK_Andy_Intro_Pose-removebg-preview.png",
    delay: 0.1
  },
  {
    name: "Libni",
    trait: "The Musical Neighbor",
    description: "Libni is Andy’s creative and giggly next-door neighbor who loves music. She spends her time picking flowers, singing, and making up new dances.",
    color: "from-[#E6E6FA] to-[#D8BFD8]", // Lavender
    img: "/SK_Libni_Intro_Pose-removebg-preview.png",
    delay: 0.2
  },
  {
    name: "Shiloh",
    trait: "The Playful Sheep",
    description: "Shiloh is Andy’s pet sheep and best friend. He is curious, helpful, and very playful! Shiloh loves resting in the warm sun and finding yummy snacks.",
    color: "from-[#98FF98] to-[#93D35C]", // Mint
    img: "/SK_Shiloh_Intro_Pose.png",
    delay: 0.3
  }
];

export const LATEST_VIDEOS = [
  {
    id: 1,
    title: "I Am Blessed",
    date: "LATEST",
    description: "A wonderful reminder that we are blessed by God! Sing along with Andy and Libni in this uplifting song.",
    category: "Music Video",
    language: "EN",
    gradient: "from-[#FF7F50] to-[#FF5C00]", // Coral
    img: "/thumb-i-am-blessed-en.jpg"
  },
  {
    id: 2,
    title: "The Good News",
    date: "FEATURED",
    description: "Join Andy, Libni, and Shiloh in their very first adventure as they learn about God's amazing love for us!",
    category: "Cartoon",
    language: "EN / ES",
    gradient: "from-[#00BFFF] to-[#87CEEB]", // Sky Blue
    img: "/thumb-good-news-en.jpg"
  }
];

export const WHY_FEATURES = [
  {
    title: "Bible-Based Stories",
    titleEs: "Historias Basadas en la Biblia",
    desc: "Every song and video is based on the Bible. We help kids learn about God and build a strong faith through engaging stories and music.",
    descEs: "Cada canción y video se basa en la Biblia. Ayudamos a los niños a aprender sobre Dios y construir una fe fuerte a través de historias y música cautivadoras.",
    icon: <BookOpen size={32} className="text-[#feb835]" />,
    color: "#feb835", // Gold
    bgColor: "bg-[#feb835]/10"
  },
  {
    title: "Awesome Animation",
    titleEs: "Animación Increíble",
    desc: "Our videos look amazing! We use top-quality animation to bring worship songs to life and keep kids entertained.",
    descEs: "¡Nuestros videos se ven increíbles! Usamos animación de alta calidad para dar vida a las canciones de adoración y mantener a los niños entretenidos.",
    icon: <SparklesIcon size={32} className="text-[#00BFFF]" />,
    color: "#00BFFF", // Sky
    bgColor: "bg-[#00BFFF]/10"
  },
  {
    title: "English & Spanish",
    titleEs: "Inglés y Español",
    desc: "Our videos are in both English and Spanish! Kids can learn about God and practice a new language at the same time.",
    descEs: "¡Nuestros videos están en inglés y español! Los niños pueden aprender sobre Dios y practicar un nuevo idioma al mismo tiempo.",
    icon: <Globe size={32} className="text-[#98FF98]" />,
    color: "#98FF98", // Mint
    bgColor: "bg-[#98FF98]/10"
  },
  {
    title: "Family Worship Time",
    titleEs: "Tiempo de Adoración en Familia",
    desc: "Our music is made for the whole family! Sing, dance, and worship together to create special memories.",
    descEs: "¡Nuestra música está hecha para toda la familia! Canten, bailen y adoren juntos para crear recuerdos especiales.",
    icon: <Users size={32} className="text-[#FF7F50]" />,
    color: "#FF7F50", // Coral
    bgColor: "bg-[#FF7F50]/10"
  },
  {
    title: "Safe for Kids",
    titleEs: "Seguro para Niños",
    desc: "Parents can relax! Selah Kids is a safe place with positive, uplifting videos that you can trust.",
    descEs: "¡Los padres pueden relajarse! Selah Kids es un lugar seguro con videos positivos y edificantes en los que puedes confiar.",
    icon: <Shield size={32} className="text-[#E6E6FA]" />,
    color: "#E6E6FA", // Lavender
    bgColor: "bg-[#E6E6FA]/10"
  },
  {
    title: "Catchy Original Music",
    titleEs: "Música Original Pegajosa",
    desc: "We write our own original, high-quality Christian songs for kids. They are easy to sing and hard to forget!",
    descEs: "¡Escribimos nuestras propias canciones cristianas originales y de alta calidad para niños. Son fáciles de cantar y difíciles de olvidar!",
    icon: <Music size={32} className="text-[#FFDAB9]" />,
    color: "#FFDAB9", // Peach
    bgColor: "bg-[#FFDAB9]/10"
  }
];

export const TESTIMONIALS = [
  {
    quote: "What joy I feel in my heart watching this beautiful program that's now available for families and little ones!",
    quoteEs: "Que gozo siento en mi corazón mirando que esta bella bendicion está disponible para los pequeños y toda la familia",
    author: "le_chosen",
    role: "YouTube Community",
    roleEs: "Comunidad de YouTube",
    icon: <Heart size={28} className="text-[#FF7F50]" />,
    color: "bg-[#FF7F50]/10",
    iconColor: "text-[#FF7F50]"
  },
  {
    quote: "I love that there are now amazing videos available like Selah Kids that children can learn about the Word of God!",
    quoteEs: "Me alegra mucho que haya videos divertidos como los de Selah Kids! para que los niños aprendan sobre la Palabra de Dios.",
    author: "kims_slice",
    role: "YouTube Community",
    roleEs: "Comunidad de YouTube",
    icon: <SparklesIcon size={28} className="text-[#00BFFF]" />,
    color: "bg-[#00BFFF]/10",
    iconColor: "text-[#00BFFF]"
  },
  {
    quote: "What a blessing! May God bless this project that is so special.",
    quoteEs: "¡Que bendición! Que Dios bendiga este trabajo tan especial.",
    author: "elizabeth.towerss",
    role: "YouTube Community",
    roleEs: "Comunidad de YouTube",
    icon: <Shield size={28} className="text-[#98FF98]" />,
    color: "bg-[#98FF98]/10",
    iconColor: "text-[#98FF98]"
  },
  {
    quote: "How beautiful and impactful Selah Kids! is that children can grow by listening to the Word of God in song!",
    quoteEs: "¡Que lindo e impactante para el crecimiento de los niños, oír la palabra de Dios en canción!",
    author: "amarobella",
    role: "YouTube Community",
    roleEs: "Comunidad de YouTube",
    icon: <Book size={28} className="text-[#E6E6FA]" />,
    color: "bg-[#E6E6FA]/10",
    iconColor: "text-[#E6E6FA]"
  },
  {
    quote: "My children have finally found songs about God that they like. The music is very good!",
    quoteEs: "Mis hijos por fin han encontrado canciones de dios que a ellos les gustan. ¡La música es muy buena!",
    author: "apallahdz",
    role: "YouTube Community",
    roleEs: "Comunidad de YouTube",
    icon: <Music size={28} className="text-[#FFD700]" />,
    color: "bg-[#FFD700]/10",
    iconColor: "text-[#FFD700]"
  }
];
