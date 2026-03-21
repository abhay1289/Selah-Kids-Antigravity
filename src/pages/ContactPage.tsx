import React from 'react';
import { ContactHero } from '../components/contact/ContactHero';
import { ContactForm } from '../components/contact/ContactForm';
import { ContactSidebar } from '../components/contact/ContactSidebar';

export const ContactPage = () => {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-selah-blue/10 via-selah-pink/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-selah-orange/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />

      <ContactHero />

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-6 mb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <ContactForm />
          <ContactSidebar />
        </div>
      </section>
    </div>
  );
};
