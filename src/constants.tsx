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
    trait: "The Funny Sheep",
    description: "Shiloh is Andy’s pet sheep and best friend. He is curious, helpful, and very funny! Shiloh loves resting in the warm sun and finding yummy snacks.",
    color: "from-[#98FF98] to-[#93D35C]", // Mint
    img: "/SK_Shiloh_Intro_Pose-removebg-preview.png",
    delay: 0.3
  }
];

export const LATEST_VIDEOS = [
  {
    id: 1,
    title: "This Is How We Praise The Lord",
    date: "LATEST",
    description: "A high-energy sing-along that gets kids moving and praising God with all their heart!",
    category: "Sing-Along",
    language: "EN",
    gradient: "from-[#FF7F50] to-[#FF5C00]", // Coral
    img: "/TGN_SingleFrames+28729.jpg"
  },
  {
    id: 2,
    title: "Jesus Loves Me",
    date: "FEATURED",
    description: "The classic hymn brought to life with beautiful animation and soulful vocals for the whole family.",
    category: "Bible Song",
    language: "EN / ES",
    gradient: "from-[#00BFFF] to-[#87CEEB]", // Sky Blue
    img: "/TGN_SingleFrames+28329.jpg"
  }
];

export const WHY_FEATURES = [
  {
    title: "Bible-Based Stories",
    desc: "Every song and video is based on the Bible. We help kids learn about God and build a strong faith through engaging stories and music.",
    icon: <BookOpen size={32} className="text-[#feb835]" />,
    color: "#feb835", // Gold
    bgColor: "bg-[#feb835]/10"
  },
  {
    title: "Awesome Animation",
    desc: "Our videos look amazing! We use top-quality animation to bring Bible stories to life and keep kids entertained.",
    icon: <SparklesIcon size={32} className="text-[#00BFFF]" />,
    color: "#00BFFF", // Sky
    bgColor: "bg-[#00BFFF]/10"
  },
  {
    title: "English & Spanish",
    desc: "Our videos are in both English and Spanish! Kids can learn about God and practice a new language at the same time.",
    icon: <Globe size={32} className="text-[#98FF98]" />,
    color: "#98FF98", // Mint
    bgColor: "bg-[#98FF98]/10"
  },
  {
    title: "Family Worship Time",
    desc: "Our music is made for the whole family! Sing, dance, and worship together to create special memories.",
    icon: <Users size={32} className="text-[#FF7F50]" />,
    color: "#FF7F50", // Coral
    bgColor: "bg-[#FF7F50]/10"
  },
  {
    title: "Safe for Kids",
    desc: "Parents can relax! Selah Kids is a safe place with positive, uplifting videos that you can trust.",
    icon: <Shield size={32} className="text-[#E6E6FA]" />,
    color: "#E6E6FA", // Lavender
    bgColor: "bg-[#E6E6FA]/10"
  },
  {
    title: "Catchy Original Music",
    desc: "We write our own original, high-quality Christian songs for kids. They are easy to sing and hard to forget!",
    icon: <Music size={32} className="text-[#FFDAB9]" />,
    color: "#FFDAB9", // Peach
    bgColor: "bg-[#FFDAB9]/10"
  }
];

export const TESTIMONIALS = [
  {
    quote: "My kids can't stop singing the songs! It's awesome to hear them singing about God all day. The songs are so catchy and joyful.",
    quoteEs: "¡Mis hijos no pueden dejar de cantar las canciones! Es increíble escucharlos cantar sobre Dios todo el día. Las canciones son muy pegajosas y alegres.",
    author: "Sarah Jenkins",
    role: "Mother of three",
    roleEs: "Madre de tres",
    icon: <Music size={28} className="text-[#FF7F50]" />,
    color: "bg-[#FF7F50]/10",
    iconColor: "text-[#FF7F50]"
  },
  {
    quote: "We are so happy to find videos we can trust. Selah Kids is perfect for our family. We don't have to worry about what our kids are watching.",
    quoteEs: "Estamos muy felices de encontrar videos en los que podemos confiar. Selah Kids es perfecto para nuestra familia. No tenemos que preocuparnos por lo que ven nuestros hijos.",
    author: "The Miller Family",
    role: "Parents of two",
    roleEs: "Padres de dos",
    icon: <Shield size={28} className="text-[#00BFFF]" />,
    color: "bg-[#00BFFF]/10",
    iconColor: "text-[#00BFFF]"
  },
  {
    quote: "I use Selah Kids in Sunday School every week. The kids love it, and they learn so much about the Bible. It's the best tool we have!",
    quoteEs: "Uso Selah Kids en la Escuela Dominical cada semana. ¡A los niños les encanta y aprenden mucho sobre la Biblia. Es la mejor herramienta que tenemos!",
    author: "Pastor David",
    role: "Children's Ministry Leader",
    roleEs: "Líder de Ministerio Infantil",
    icon: <School size={28} className="text-[#98FF98]" />,
    color: "bg-[#98FF98]/10",
    iconColor: "text-[#98FF98]"
  },
  {
    quote: "The English and Spanish videos are amazing! My kids are learning Spanish while growing closer to God. It's engaging and educational.",
    quoteEs: "¡Los videos en inglés y español son increíbles! Mis hijos están aprendiendo inglés mientras se acercan más a Dios. Es atractivo y educativo.",
    author: "Maria Rodriguez",
    role: "Homeschooling Mom",
    roleEs: "Mamá Educadora en Casa",
    icon: <Globe size={28} className="text-[#E6E6FA]" />,
    color: "bg-[#E6E6FA]/10",
    iconColor: "text-[#E6E6FA]"
  },
  {
    quote: "Selah Kids is our favorite for car rides. Instead of being bored, the kids sing along to Noah's Ark. It makes trips so much better.",
    quoteEs: "Selah Kids es nuestro favorito para los viajes en auto. En vez de aburrirse, los niños cantan junto con el Arca de Noé. Hace los viajes mucho mejores.",
    author: "James Wilson",
    role: "Father of four",
    roleEs: "Padre de cuatro",
    icon: <Car size={28} className="text-[#FFD700]" />,
    color: "bg-[#FFD700]/10",
    iconColor: "text-[#FFD700]"
  },
  {
    quote: "The animation looks incredible! It's hard to find Christian videos that look this good. My kids love watching every episode.",
    quoteEs: "¡La animación se ve increíble! Es difícil encontrar videos cristianos que se vean tan bien. A mis hijos les encanta ver cada episodio.",
    author: "Emily Chen",
    role: "Graphic Designer & Mom",
    roleEs: "Diseñadora Gráfica y Mamá",
    icon: <SparklesIcon size={28} className="text-[#FFB6C1]" />,
    color: "bg-[#FFB6C1]/10",
    iconColor: "text-[#FFB6C1]"
  },
  {
    quote: "As a teacher, I love how much kids learn from these stories. It's not just entertaining to watch; it helps them understand important lessons.",
    quoteEs: "Como maestra, me encanta cuánto aprenden los niños de estas historias. No es solo entretenido de ver; les ayuda a entender lecciones importantes.",
    author: "Mr. Henderson",
    role: "Elementary Teacher",
    roleEs: "Maestro de Primaria",
    icon: <Book size={28} className="text-[#ADD8E6]" />,
    color: "bg-[#ADD8E6]/10",
    iconColor: "text-[#ADD8E6]"
  },
  {
    quote: "We've tried a lot of shows, but Selah Kids is the best at helping little ones worship God. It's full of joy and really special.",
    quoteEs: "Hemos probado muchos programas, pero Selah Kids es el mejor para ayudar a los pequeños a adorar a Dios. Está lleno de alegría y es muy especial.",
    author: "The Thompson Family",
    role: "Worship Pastors",
    roleEs: "Pastores de Adoración",
    icon: <Heart size={28} className="text-[#F0E68C]" />,
    color: "bg-[#F0E68C]/10",
    iconColor: "text-[#F0E68C]"
  }
];
