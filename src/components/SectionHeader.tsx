import { motion } from "motion/react";
import { Badge } from "./UI";
import { ReactNode } from "react";

interface SectionHeaderProps {
  badge: string;
  title: string;
  description?: string;
  badgeColor?: 'yellow' | 'light';
  dark?: boolean;
  align?: 'left' | 'center';
}

export function SectionHeader({ 
  badge, 
  title, 
  description, 
  badgeColor = 'yellow', 
  dark = false,
  align = 'left'
}: SectionHeaderProps) {
  return (
    <motion.div 
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col gap-6 mb-16 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}
    >
      <motion.div
        variants={{
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 }
        }}
      >
        <Badge color={badgeColor}>{badge}</Badge>
      </motion.div>

      <div className="relative">
        <motion.h2 
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`text-5xl md:text-6xl lg:text-7xl font-display leading-[1.1] tracking-tight drop-shadow-sm ${dark ? 'text-white' : 'text-selah-dark'}`}
        >
          {title}
        </motion.h2>
        
        {/* Decorative underline for center alignment */}
        {align === 'center' && (
          <motion.div 
            variants={{
              initial: { width: 0, opacity: 0 },
              animate: { width: 80, opacity: 1 }
            }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-1.5 bg-selah-orange mt-6 rounded-full mx-auto shadow-[0_2px_8px_rgba(255,92,0,0.3)]"
          />
        )}
      </div>

      {description && (
        <motion.p 
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-lg md:text-xl lg:text-2xl max-w-2xl font-sans font-medium leading-relaxed tracking-normal ${dark ? 'text-selah-border' : 'text-selah-muted'}`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
