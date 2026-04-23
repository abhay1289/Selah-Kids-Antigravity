import React from 'react';
import type { Metadata } from 'next';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactSidebar } from '@/components/contact/ContactSidebar';
import { getPageContent, getSeoMetadata } from '@/lib/cms-server';
import { INITIAL_PAGE_CONTACT } from '@/data/page-content-contact';
import { isLocale } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getSeoMetadata('/contact', isLocale(locale) ? locale : 'en');
}

export default async function ContactPage() {
  const fields = await getPageContent('contact', INITIAL_PAGE_CONTACT);
  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Vivid Color Washes */}
      <div className="absolute top-0 right-0 w-[55vw] h-[50vh] bg-gradient-to-bl from-[#00BFFF]/8 via-[#FF69B4]/4 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[45vh] bg-gradient-to-tr from-selah-orange/8 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[5%] w-[35vw] h-[35vh] bg-[#93D35C]/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[25%] right-[10%] w-[30vw] h-[30vh] bg-[#FEB835]/8 rounded-full blur-[90px] pointer-events-none" />
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      <ContactHero fields={fields} />

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-6 mb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <ContactForm />
          <ContactSidebar />
        </div>
      </section>
    </div>
  );
}
