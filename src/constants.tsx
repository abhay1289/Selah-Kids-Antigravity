import { BookOpen, SparklesIcon, Globe, Users, Shield, Music, School, Car, Book, Heart } from "lucide-react";

export const CHARACTERS = [
  {
    name: "Andy",
    trait: "The Friendly Leader",
    description: "Andy is a smart and friendly boy who loves to lead. He spends his days playing outside in the garden with his best friend and pet sheep, Shiloh.",
    color: "from-[#00BFFF] to-[#87CEEB]", // Sky Blue
    img: "/TGN_SingleFrames+28229.jpg",
    delay: 0.1
  },
  {
    name: "Libni",
    trait: "The Musical Neighbor",
    description: "Libni is Andy’s creative and giggly next-door neighbor who loves music. She spends her time picking flowers, singing, and making up fun dances.",
    color: "from-[#E6E6FA] to-[#D8BFD8]", // Lavender
    img: "/TGN_SingleFrames+28329.jpg",
    delay: 0.2
  },
  {
    name: "Shiloh",
    trait: "The Funny Sheep",
    description: "Shiloh is Andy’s pet sheep and best friend. He is curious, helpful, and very funny! Shiloh loves resting in the warm sun and finding yummy snacks.",
    color: "from-[#98FF98] to-[#93D35C]", // Mint
    img: "/TGN_SingleFrames+28729.jpg",
    delay: 0.3
  }
];

export const LATEST_VIDEOS = [
  {
    id: 1,
    title: "Jesus Loves Me",
    date: "March 15, 2026",
    description: "A fun, upbeat version of the classic hymn that kids will love to sing along to.",
    category: "Music Video",
    language: "EN",
    gradient: "from-[#FF7F50] to-[#FF5C00]", // Coral
    img: "/TGN_SingleFrames+28729.jpg"
  },
  {
    id: 2,
    title: "The Fruit of the Spirit",
    date: "March 10, 2026",
    description: "Learn about love, joy, peace, and more in this catchy song based on Galatians 5:22-23.",
    category: "Bible Song",
    language: "EN",
    gradient: "from-[#00BFFF] to-[#87CEEB]", // Sky Blue
    img: "/TGN_SingleFrames+28329.jpg"
  },
  {
    id: 3,
    title: "He's Got the Whole World",
    date: "March 5, 2026",
    description: "A beautiful reminder of God's care for all of creation in this classic worship song.",
    category: "Worship",
    language: "EN",
    gradient: "from-[#FFD700] to-[#FEB835]", // Gold
    img: "/TGN_SingleFrames+28229.jpg"
  },
  {
    id: 4,
    title: "This Little Light of Mine",
    date: "March 1, 2026",
    description: "Encouraging children to let their light shine for Jesus every day through music.",
    category: "Music Video",
    language: "EN",
    gradient: "from-[#98FF98] to-[#93D35C]", // Mint
    img: "/TGN_SingleFrames+28729.jpg"
  }
];

export const WHY_FEATURES = [
  {
    title: "Bible-Based Stories",
    desc: "Every song and video is based on the Bible. We help kids learn about God and build a strong faith while having fun.",
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
    desc: "We write our own fun, high-quality Christian songs for kids. They are easy to sing and hard to forget!",
    icon: <Music size={32} className="text-[#FFDAB9]" />,
    color: "#FFDAB9", // Peach
    bgColor: "bg-[#FFDAB9]/10"
  }
];

export const TESTIMONIALS = [
  {
    quote: "My kids can't stop singing the songs! It's awesome to hear them singing about God all day. The songs are so catchy and fun.",
    author: "Sarah Jenkins",
    role: "Mother of three",
    icon: <Music size={28} className="text-[#FF7F50]" />,
    color: "bg-[#FF7F50]/10",
    iconColor: "text-[#FF7F50]"
  },
  {
    quote: "We are so happy to find videos we can trust. Selah Kids is perfect for our family. We don't have to worry about what our kids are watching.",
    author: "The Miller Family",
    role: "Parents of two",
    icon: <Shield size={28} className="text-[#00BFFF]" />,
    color: "bg-[#00BFFF]/10",
    iconColor: "text-[#00BFFF]"
  },
  {
    quote: "I use Selah Kids in Sunday School every week. The kids love it, and they learn so much about the Bible. It's the best tool we have!",
    author: "Pastor David",
    role: "Children's Ministry Leader",
    icon: <School size={28} className="text-[#98FF98]" />,
    color: "bg-[#98FF98]/10",
    iconColor: "text-[#98FF98]"
  },
  {
    quote: "The English and Spanish videos are amazing! My kids are learning Spanish while growing closer to God. It's fun and educational.",
    author: "Maria Rodriguez",
    role: "Homeschooling Mom",
    icon: <Globe size={28} className="text-[#E6E6FA]" />,
    color: "bg-[#E6E6FA]/10",
    iconColor: "text-[#E6E6FA]"
  },
  {
    quote: "Selah Kids is our favorite for car rides. Instead of being bored, the kids sing along to Noah's Ark. It makes trips so much better.",
    author: "James Wilson",
    role: "Father of four",
    icon: <Car size={28} className="text-[#FFD700]" />,
    color: "bg-[#FFD700]/10",
    iconColor: "text-[#FFD700]"
  },
  {
    quote: "The animation looks incredible! It's hard to find Christian videos that look this good. My kids love watching every episode.",
    author: "Emily Chen",
    role: "Graphic Designer & Mom",
    icon: <SparklesIcon size={28} className="text-[#FFB6C1]" />,
    color: "bg-[#FFB6C1]/10",
    iconColor: "text-[#FFB6C1]"
  },
  {
    quote: "As a teacher, I love how much kids learn from these stories. It's not just fun to watch; it helps them understand important lessons.",
    author: "Mr. Henderson",
    role: "Elementary Teacher",
    icon: <Book size={28} className="text-[#ADD8E6]" />,
    color: "bg-[#ADD8E6]/10",
    iconColor: "text-[#ADD8E6]"
  },
  {
    quote: "We've tried a lot of shows, but Selah Kids is the best at helping little ones worship God. It's full of joy and really special.",
    author: "The Thompson Family",
    role: "Worship Pastors",
    icon: <Heart size={28} className="text-[#F0E68C]" />,
    color: "bg-[#F0E68C]/10",
    iconColor: "text-[#F0E68C]"
  }
];
