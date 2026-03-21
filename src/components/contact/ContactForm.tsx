import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { Button } from '../UI';

export const ContactForm = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-7 bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.08)] border border-white"
    >
      <h2 className="text-4xl font-display text-selah-dark mb-10">Send a Message</h2>
      
      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 group">
            <label htmlFor="name" className="text-xs font-sans font-bold text-selah-muted tracking-widest uppercase group-focus-within:text-selah-blue transition-colors">Name</label>
            <input 
              type="text" 
              id="name" 
              className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-selah-blue focus:outline-none transition-all duration-500 font-sans font-medium text-xl text-selah-dark placeholder-selah-muted/30"
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-3 group">
            <label htmlFor="email" className="text-xs font-sans font-bold text-selah-muted tracking-widest uppercase group-focus-within:text-selah-blue transition-colors">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-selah-blue focus:outline-none transition-all duration-500 font-sans font-medium text-xl text-selah-dark placeholder-selah-muted/30"
              placeholder="jane@example.com"
            />
          </div>
        </div>

        <div className="space-y-3 group">
          <label htmlFor="subject" className="text-xs font-sans font-bold text-selah-muted tracking-widest uppercase group-focus-within:text-selah-blue transition-colors">Subject</label>
          <input 
            type="text" 
            id="subject" 
            className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-selah-blue focus:outline-none transition-all duration-500 font-sans font-medium text-xl text-selah-dark placeholder-selah-muted/30"
            placeholder="How can we help?"
          />
        </div>

        <div className="space-y-3 group">
          <label htmlFor="message" className="text-xs font-sans font-bold text-selah-muted tracking-widest uppercase group-focus-within:text-selah-blue transition-colors">Message</label>
          <textarea 
            id="message" 
            rows={4}
            className="w-full px-0 py-4 bg-transparent border-b-2 border-black/10 focus:border-selah-blue focus:outline-none transition-all duration-500 font-sans font-medium text-xl text-selah-dark placeholder-selah-muted/30 resize-none"
            placeholder="Tell us more about your inquiry..."
          />
        </div>

        <Button 
          icon={MessageSquare}
          className="w-full md:w-auto !bg-selah-dark hover:!bg-black !text-white !border-none !py-6 !px-12 !text-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] transition-all duration-500 hover:scale-[1.02] mt-8 rounded-full"
        >
          Send Message
        </Button>
      </form>
    </motion.div>
  );
};
