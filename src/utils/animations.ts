import { Variants } from 'framer-motion';

// FADING
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// SLIDING (Usually more stiff/fast than fading)
export const slideInUp: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
};
export const slideInDown: Variants = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
};
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
};
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
};

// ZOOMING
export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};
export const zoomInUp: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};
export const zoomInDown: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};
export const zoomInLeft: Variants = {
  hidden: { opacity: 0, scale: 0.8, x: -50 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};
export const zoomInRight: Variants = {
  hidden: { opacity: 0, scale: 0.8, x: 50 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

// ROTATING
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -90, scale: 0.8 },
  visible: { opacity: 1, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};
export const rotateInUp: Variants = {
  hidden: { opacity: 0, rotateZ: -15, y: 100 },
  visible: { opacity: 1, rotateZ: 0, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
};
export const rotateInDown: Variants = {
  hidden: { opacity: 0, rotateZ: 15, y: -100 },
  visible: { opacity: 1, rotateZ: 0, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

// SPECIAL
export const rollIn: Variants = {
  hidden: { opacity: 0, x: -100, rotate: -120 },
  visible: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 80, damping: 12 } }
};
export const lightSpeedIn: Variants = {
  hidden: { opacity: 0, x: "100%", skewX: -30 },
  visible: { opacity: 1, x: 0, skewX: 0, transition: { type: "spring", stiffness: 120, damping: 12 } }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};
