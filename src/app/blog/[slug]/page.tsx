'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getPostBySlug, BLOG_POSTS } from '../../../data/blogPosts';
import { Badge, Button } from '../../../components/UI';
import BlogComments from '../../../components/blog/BlogComments';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const slug = params.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF8EE] to-white">
        <div className="text-center px-6">
          <h1 className="hero-headline mb-4">{t("Post Not Found", "Publicación No Encontrada")}</h1>
          <p className="body-text mx-auto mb-8">
            {t("The blog post you're looking for doesn't exist.", "La publicación que buscas no existe.")}
          </p>
          <Button onClick={() => router.push('/blog')} className="!px-8 !py-4 ui-button">
            <ArrowLeft size={18} className="mr-2" />
            {t("Back to Blog", "Volver al Blog")}
          </Button>
        </div>
      </div>
    );
  }

  const title = language === 'EN' ? post.titleEn : post.titleEs;
  const date = language === 'EN' ? post.dateEn : post.dateEs;
  const content = language === 'EN' ? post.contentEn : post.contentEs;

  // Find adjacent posts for navigation
  const currentIndex = BLOG_POSTS.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Vivid Color Washes */}
      <div className="absolute top-0 right-0 w-[55vw] h-[45vh] bg-gradient-to-bl from-[#FF7F50]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[45vh] bg-gradient-to-tr from-[#93D35C]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[35vw] h-[35vh] bg-[#FEB835]/6 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[25%] right-0 w-[30vw] h-[30vh] bg-[#00BFFF]/5 rounded-full blur-[100px] pointer-events-none" />
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      {/* Hero Section */}
      <div className="relative z-10 pt-28 md:pt-36">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-xl rounded-full border border-selah-dark/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-selah-dark ui-button group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              {t("Back to Blog", "Volver al Blog")}
            </Link>
          </motion.div>
        </div>

        {/* Title Block */}
        <div className="max-w-4xl mx-auto px-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Badge color="light" className="mb-6 shadow-sm bg-white border border-black/5 font-serif italic tracking-widest">
              <BookOpen size={12} className="inline mr-2" />
              {t("JOURNAL ENTRY", "ENTRADA DEL DIARIO")}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-6"
          >
            <Calendar size={16} className="text-selah-orange" />
            <span className="ui-caption text-selah-orange font-bold tracking-widest uppercase">{date}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm"
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-selah-dark/5 shadow-sm hover:shadow-md transition-all duration-300 text-selah-muted ui-caption hover:text-selah-orange"
            >
              <Share2 size={14} />
              {t("Share", "Compartir")}
            </button>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto px-6 mb-16"
        >
          <div className="relative w-full aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border-4 border-white/60">
            <Image
              src={post.img}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto px-6 mb-16"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)]">
            {/* Drop Cap First Letter Effect */}
            <div className="flex flex-col gap-6 text-selah-dark/80 text-lg leading-[1.85] max-w-none">
              {content.map((paragraph, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  {i === 0 ? (
                    <p
                      className="font-body text-lg leading-[1.85] first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-selah-orange first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none"
                      style={{ fontStyle: 'normal' }}
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  ) : (
                    <p
                      className="font-body text-lg leading-[1.85]"
                      style={{ fontStyle: 'normal' }}
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.article>

        {/* Post Navigation */}
        <div className="max-w-3xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex items-center gap-4 p-5 bg-white/80 backdrop-blur-xl rounded-2xl border border-selah-dark/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <ArrowLeft size={18} className="text-selah-orange group-hover:-translate-x-1 transition-transform shrink-0" />
                <div className="min-w-0">
                  <p className="ui-caption text-selah-muted/50 mb-1">{t("Previous", "Anterior")}</p>
                  <p className="content-h3 text-selah-dark truncate group-hover:text-selah-orange transition-colors">
                    {language === 'EN' ? prevPost.titleEn : prevPost.titleEs}
                  </p>
                </div>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex items-center gap-4 p-5 bg-white/80 backdrop-blur-xl rounded-2xl border border-selah-dark/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-right md:col-start-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="ui-caption text-selah-muted/50 mb-1">{t("Next", "Siguiente")}</p>
                  <p className="content-h3 text-selah-dark truncate group-hover:text-selah-orange transition-colors">
                    {language === 'EN' ? nextPost.titleEn : nextPost.titleEs}
                  </p>
                </div>
                <ArrowLeft size={18} className="text-selah-orange rotate-180 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="max-w-3xl mx-auto px-6 pb-24">
          <BlogComments />
        </div>
      </div>
    </div>
  );
}
