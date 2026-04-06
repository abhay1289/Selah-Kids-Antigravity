import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';
import { SectionHeader } from '../SectionHeader';

const TEAM_MEMBERS = [
  {
    name: "Leah",
    titleEn: "Creator",
    titleEs: "Creadora",
    img: "/leah.png",
    bioEn: "Leah is a singer-songwriter and worship leader who recognizes the impact that music can have on the heart, mind, body and soul. In addition to being a licensed pediatric speech-language therapist, she is also a mother of four active children and knows first hand the challenges that families face when seeking safe and wholesome content online.\n\nTogether with her husband, Gachener, Leah launched Selah Kids! in December 2024 in order to create an enriching, biblically sound, research-based, and child-approved space for families around the world.",
    bioEs: "Leah es cantautora y líder de alabanza, que reconoce el impacto que la música puede tener en el corazón, la mente y el alma. Como madre de cuatro hijos activos y licenciada en terapia del habla y el lenguaje pediátrico, comprende de primera mano los retos que enfrentan las familias actuales al buscar contenido digital seguro en línea.\n\nEn diciembre de 2024, junto a su esposo Gachener, Leah fundó Selah Kids!. Su misión es clara: ofrecer un espacio enriquecedor con fundamentos bíblicos, basado en investigaciones y \"aprobado por niños\" para familias de todo el mundo.",
    color: "from-[#FF7F50] to-[#FF5C00]",
    bgTheme: "bg-[#FF7F50]/5"
  },
  {
    name: "Rey",
    titleEn: "Director of Animation",
    titleEs: "Director de Animación",
    img: "/rey.png",
    bioEn: "Rey is the creative lead for the Selah Kids! art design and animation. Drawing from experience in feature film, television, and games, he values impactful storytelling and uses the most up-to-date technologies to bring Selah Kids! to life. Rey takes pride in helping raise the creative bar. Through his animation studio, Veyra Studios, Rey creates work that not only connects with audiences worldwide, but also reflects a deeper commitment to excellence and faith.",
    bioEs: "Rey es el líder creativo a cargo del diseño artístico y la animación de Selah Kids!. Con una trayectoria forjada en equipos creativos para cine, televisión y videojuegos, valora la narración de historias con impacto y emplea las tecnologías más avanzadas para dar vida a Selah Kids!. A través de su estudio de animación, Veyra Studios, se dedica a elevar el estándar visual del contenido infantil, creando obras que no solo cautivan a audiencias de todo el mundo, sino que también reflejan un compromiso inquebrantable con la excelencia y la fe.",
    color: "from-[#00BFFF] to-[#87CEEB]",
    bgTheme: "bg-[#00BFFF]/5"
  },
  {
    name: "Carla",
    titleEn: "Social Media Editor",
    titleEs: "Editora de Redes Sociales",
    img: "/carla.png",
    bioEn: "Carla is a passionate educator who finds her greatest joy in using her talents to serve God and His Kingdom. For Carla, being part of Selah Kids! is a mission that allows her to be a blessing to families, combining her love for teaching with her creativity to create content that inspires minds young and old.\n\nCarla enjoys sowing seeds of faith and core values into every home by crafting each message with the dedication and affection of someone who is contributing to a project with a higher eternal purpose.",
    bioEs: "Carla es una educadora apasionada que encuentra su mayor alegría en poner sus talentos al servicio de Dios. Para ella, formar parte de Selah Kids! es una misión que le permite bendecir a las familias, uniendo su amor por la enseñanza con su creatividad para generar contenidos que inspiren a los más pequeños.\n\nSu propósito es sembrar semillas de fe y valores en cada hogar, preparando cada mensaje con la dedicación y el cariño de quien sabe que está contribuyendo a un proyecto con propósito eterno.",
    color: "from-[#FFD700] to-[#FEB835]",
    bgTheme: "bg-[#FFD700]/5"
  }
];

export function TeamSection() {
  const { t, language } = useLanguage();

  return (
    <section className="py-20 md:py-32 relative bg-white overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-selah-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-selah-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <SectionHeader 
          badge={t("The Team", "El Equipo")}
          title={t("Meet the Selah Kids Team!", "¡Conoce al Equipo Selah Kids!")}
          description={t("The passionate people bringing these stories to life.", "Las personas apasionadas que dan vida a estas historias.")}
          align="center"
        />

        <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col h-full rounded-[3rem] p-8 md:p-10 ${member.bgTheme} border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.02)]`}
            >
              {/* Image & Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] mb-6 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-20`} />
                  <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white bg-white">
                    <Image 
                      src={member.img} 
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-3xl font-display font-black text-selah-dark mb-2 text-center">
                  {member.name}
                </h3>
                <span className={`inline-block px-4 py-1.5 rounded-full text-white font-bold text-sm bg-gradient-to-r ${member.color} shadow-sm`}>
                  {language === 'EN' ? member.titleEn : member.titleEs}
                </span>
              </div>

              {/* Bio Content */}
              <div className="flex-1 text-selah-dark/70 text-lg leading-relaxed space-y-4">
                {(language === 'EN' ? member.bioEn : member.bioEs).split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
