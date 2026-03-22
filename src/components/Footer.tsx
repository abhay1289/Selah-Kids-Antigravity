'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Youtube, Music, Star, Heart, Play, Users, Shield, BookOpen, Book, Mail } from "lucide-react";
import { Button } from "./UI";

export function Footer() {
  const router = useRouter();

  return (
    <footer className="relative bg-gradient-to-b from-selah-light/20 via-selah-bg to-white pt-20 pb-12 overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-selah-orange/30 to-transparent" />
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-selah-orange/5 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-selah-yellow/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-20">
          {/* Brand Card - Bento Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-white/60 border border-selah-orange/10 rounded-[2.5rem] p-10 backdrop-blur-xl group hover:border-selah-orange/20 transition-all duration-500 shadow-[0_8px_32px_rgba(255,92,0,0.06)]"
          >
            <Link href="/" className="flex items-center gap-4 mb-8 group/logo">
              <motion.div
                whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                className="w-14 h-14 bg-selah-orange rounded-2xl flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(255,107,0,0.4)] group-hover/logo:shadow-[0_20px_40px_-10px_rgba(255,107,0,0.6)] transition-shadow duration-500"
              >
                <span className="text-white font-black text-3xl">S</span>
              </motion.div>
              <span className="font-black text-4xl tracking-tighter text-selah-dark group-hover/logo:text-selah-orange transition-colors duration-500">
                SELAH<span className="text-selah-orange group-hover/logo:text-selah-dark transition-colors duration-500">KIDS</span>
              </span>
            </Link>
            <p className="text-xl text-selah-muted max-w-md leading-relaxed mb-10 font-medium text-balance">
              We're on a mission to fill every home with faith-filled melodies and stories that spark wonder in the hearts of children.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: "#", color: "hover:bg-[#1877F2]", shadow: "hover:shadow-[0_10px_20px_-10px_rgba(24,119,242,0.6)]" },
                { Icon: Instagram, href: "https://www.instagram.com/selah.kids", color: "hover:bg-[#E4405F]", shadow: "hover:shadow-[0_10px_20px_-10px_rgba(228,64,95,0.6)]" },
                { Icon: Youtube, href: "https://www.youtube.com/@selahkidsworship", color: "hover:bg-[#FF0000]", shadow: "hover:shadow-[0_10px_20px_-10px_rgba(255,0,0,0.6)]" },
                { Icon: Music, href: "#", color: "hover:bg-[#1DB954]", shadow: "hover:shadow-[0_10px_20px_-10px_rgba(29,185,84,0.6)]" }
              ].map(({ Icon, color, href, shadow }, i) => (
                <motion.a 
                  key={i} 
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  whileHover={{ y: -8, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-14 h-14 rounded-2xl bg-selah-bg border border-selah-border/50 flex items-center justify-center transition-all duration-500 group/icon ${color} ${shadow} hover:text-white hover:border-transparent`}
                >
                  <Icon size={24} className="text-selah-muted group-hover/icon:text-white transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-white/60 border border-selah-orange/10 rounded-[2.5rem] p-10 backdrop-blur-xl hover:border-selah-orange/20 transition-all duration-500 shadow-[0_8px_32px_rgba(255,92,0,0.06)]"
          >
            <h4 className="text-selah-dark content-h3 mb-8 tracking-tight">Explore</h4>
            <ul className="space-y-5">
              {[
                { label: "Home", icon: Star, href: "/" },
                { label: "About Us", icon: Heart, href: "/about" },
                { label: "Watch", icon: Play, href: "/watch" },
                { label: "Characters", icon: Users, href: "/characters" },
                { label: "For Parents", icon: Shield, href: "/parents" },
                { label: "Resources", icon: BookOpen, href: "/resources" },
                { label: "Blog", icon: Book, href: "/blog" },
                { label: "Contact Us", icon: Mail, href: "/contact" }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(link.href);
                      window.scrollTo(0, 0);
                    }}
                    className="text-selah-muted ui-button hover:text-selah-orange transition-all duration-300 flex items-center gap-3 group cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-xl bg-selah-bg flex items-center justify-center group-hover:bg-selah-orange/20 group-hover:text-selah-orange transition-colors shadow-sm">
                      <link.icon size={14} />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-8"
          >
            {/* Contact Mini-Card */}
            <div className="bg-white/60 border border-selah-orange/10 rounded-[2.5rem] p-8 backdrop-blur-xl hover:border-selah-orange/20 transition-all duration-500 flex-1 shadow-[0_8px_32px_rgba(255,92,0,0.06)]">
              <h4 className="text-selah-dark content-h3 mb-6 tracking-tight">Get in Touch</h4>
              <div className="space-y-4">
                <a href="mailto:hello@selahkids.com" className="flex items-center gap-4 p-4 rounded-2xl bg-selah-bg border border-selah-border/30 hover:bg-selah-orange/10 hover:border-selah-orange/20 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-selah-orange/20 flex items-center justify-center text-selah-orange group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-selah-muted/60 ui-label mb-0.5">Email Us</p>
                    <span className="text-selah-dark ui-button">hello@selahkids.com</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Newsletter Mini-Card */}
            <div className="bg-selah-orange rounded-[2.5rem] p-8 shadow-[0_20px_40px_-10px_rgba(255,107,0,0.4)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <h4 className="text-white content-h3 mb-3 tracking-tight relative z-10">Join the Family</h4>
              <div className="relative z-10 flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30 transition-all duration-300 text-sm shadow-inner"
                />
                <Button 
                  variant="white"
                  className="!px-6 !py-3 !text-xs !rounded-xl font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
                >
                  JOIN
                </Button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-selah-border/30 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-selah-muted/50 text-sm font-medium">
              © {new Date().getFullYear()} Selah Kids. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-selah-muted/50 hover:text-selah-orange ui-button transition-colors relative group">
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-selah-orange transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/terms" className="text-selah-muted/50 hover:text-selah-orange ui-button transition-colors relative group">
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-selah-orange transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-selah-bg border border-selah-border/30 text-selah-muted/60 ui-button shadow-sm"
          >
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={16} className="text-selah-orange fill-selah-orange drop-shadow-md" />
            </motion.div>
            <span>for the next generation</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
