import { motion } from "framer-motion";
import { Music, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "../UI";
import { SectionHeader } from "../SectionHeader";
import { useRouter } from "next/navigation";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

export function AboutSection() {
  const router = useRouter();

  return (
    <motion.section 
      id="about" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-16 md:py-24 bg-white relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-selah-light rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-selah-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231c4425' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative group"
        >
          <div className="aspect-[4/5] rounded-[40px] md:rounded-[80px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-1000 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2),0_20px_40px_-10px_rgba(0,0,0,0.1)] group-hover:rotate-1">
            <img 
              src="/TGN_SingleFrames+28329.jpg" 
              alt="Selah Kids" 
              className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-selah-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [12, 8, 12] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -right-8 z-20"
          >
            <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/50 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-selah-orange animate-pulse" />
              <span className="font-sans font-bold text-selah-dark tracking-widest uppercase text-sm">Nature First</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col gap-10"
        >
          <SectionHeader 
            badge="Our Mission"
            title="Fun Bible Songs & Christian Cartoons"
            description="Selah Kids! was created by parents who wanted a safe place for kids to watch faith-based videos. We want to help families get up, move, and worship God together with our catchy Sunday school songs."
          />
          
          <div className="grid gap-8 mt-4">
            {[
              { icon: Music, title: "Original Bible Songs", desc: "Our Bible songs teach important lessons from scripture in a fun way that kids can easily understand.", color: "bg-selah-light/20", iconColor: "text-selah-dark" },
              { icon: BookOpen, title: "Stunning Animation", desc: "Our videos feature beautiful animation made by talented artists from around the world to bring Bible stories to life.", color: "bg-selah-yellow/20", iconColor: "text-selah-orange" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                whileHover={{ x: 10, backgroundColor: "rgba(0,0,0,0.02)" }}
                className="flex gap-8 items-start group p-6 -mx-6 rounded-3xl transition-colors duration-500 cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-[24px] ${feature.color} flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <feature.icon className={`${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-display text-selah-dark mb-3 group-hover:text-selah-orange transition-colors duration-300">{feature.title}</h4>
                  <p className="text-lg text-selah-muted font-sans leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="mt-4"
          >
            <Button 
              onClick={() => router.push("/about")}
              className="!px-10 !py-5 !text-lg shadow-[0_10px_30px_-10px_rgba(255,92,0,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(255,92,0,0.7)] hover:scale-105 transition-all flex items-center gap-3 group whitespace-nowrap"
            >
              Read Our Full Story
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
