"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Reply, Heart, Send, ChevronDown, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  likes: number;
  liked: boolean;
  replies: Comment[];
}

function generateId() {
  return Math.random().toString(36).substring(2, 12);
}

function formatTimeAgo(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return lang === 'EN' ? 'Just now' : 'Ahora mismo';
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return lang === 'EN' ? `${m}m ago` : `hace ${m}m`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return lang === 'EN' ? `${h}h ago` : `hace ${h}h`;
  }
  const d = Math.floor(diff / 86400);
  return lang === 'EN' ? `${d}d ago` : `hace ${d}d`;
}

/* ── Single Comment Row ─────────────────────────────── */
function CommentItem({
  comment,
  onReply,
  onLike,
  depth = 0,
  language,
  t,
}: {
  comment: Comment;
  onReply: (parentId: string, text: string, author: string) => void;
  onLike: (id: string) => void;
  depth?: number;
  language: string;
  t: (en: string, es: string) => string;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [showReplies, setShowReplies] = useState(true);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyAuthor.trim()) return;
    onReply(comment.id, replyText, replyAuthor);
    setReplyText('');
    setReplyAuthor('');
    setShowReplyForm(false);
  };

  const ACCENT_COLORS = ['bg-selah-orange', 'bg-[#00BFFF]', 'bg-[#FFD700]', 'bg-[#FF69B4]', 'bg-[#93D35C]', 'bg-[#9B59B6]'];
  const avatarColor = ACCENT_COLORS[comment.author.length % ACCENT_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`${depth > 0 ? 'ml-6 md:ml-12 pl-4 md:pl-6 border-l-2 border-selah-orange/10' : ''}`}
    >
      <div className="group py-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-display font-bold text-sm md:text-base shrink-0 shadow-sm`}>
            {comment.author.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-display font-bold text-selah-dark text-sm md:text-base">{comment.author}</span>
              <span className="text-selah-muted/50 ui-caption">{formatTimeAgo(comment.date, language)}</span>
            </div>

            {/* Text */}
            <p className="text-selah-dark/80 text-sm md:text-base leading-relaxed mb-3 font-body" style={{ fontStyle: 'normal' }}>
              {comment.text}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1.5 text-xs md:text-sm font-display font-medium transition-colors duration-200 ${comment.liked ? 'text-selah-orange' : 'text-selah-muted/50 hover:text-selah-orange'}`}
              >
                <Heart size={14} className={comment.liked ? 'fill-selah-orange' : ''} />
                {comment.likes > 0 && comment.likes}
              </button>
              {depth < 2 && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1.5 text-xs md:text-sm font-display font-medium text-selah-muted/50 hover:text-selah-orange transition-colors duration-200"
                >
                  <Reply size={14} />
                  {t("Reply", "Responder")}
                </button>
              )}
            </div>

            {/* Reply Form */}
            <AnimatePresence>
              {showReplyForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmitReply}
                  className="mt-4 overflow-hidden"
                >
                  <div className="bg-selah-bg/50 rounded-2xl p-4 border border-selah-border/20">
                    <input
                      type="text"
                      value={replyAuthor}
                      onChange={(e) => setReplyAuthor(e.target.value)}
                      placeholder={t("Your name", "Tu nombre")}
                      className="w-full bg-white rounded-xl px-4 py-2.5 text-sm text-selah-dark placeholder:text-selah-muted/40 focus:outline-none focus:ring-2 focus:ring-selah-orange/30 border border-selah-border/20 mb-2 font-display"
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={t("Write a reply...", "Escribe una respuesta...")}
                        className="flex-1 bg-white rounded-xl px-4 py-2.5 text-sm text-selah-dark placeholder:text-selah-muted/40 focus:outline-none focus:ring-2 focus:ring-selah-orange/30 border border-selah-border/20 font-display"
                        required
                      />
                      <button
                        type="submit"
                        className="w-10 h-10 bg-selah-orange text-white rounded-xl flex items-center justify-center hover:bg-selah-orange/90 transition-colors shadow-sm shrink-0"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies.length > 0 && (
        <div>
          {!showReplies && (
            <button
              onClick={() => setShowReplies(true)}
              className="flex items-center gap-2 ml-14 md:ml-16 mb-2 text-selah-orange ui-caption font-bold hover:underline"
            >
              <ChevronDown size={14} />
              {t(`View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`, `Ver ${comment.replies.length} ${comment.replies.length === 1 ? 'respuesta' : 'respuestas'}`)}
            </button>
          )}
          <AnimatePresence>
            {showReplies && comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                depth={depth + 1}
                language={language}
                t={t}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

/* ── Main Comments Section ──────────────────────────── */
export default function BlogComments() {
  const { language, t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) return;

    const comment: Comment = {
      id: generateId(),
      author: newAuthor.trim(),
      text: newComment.trim(),
      date: new Date().toISOString(),
      likes: 0,
      liked: false,
      replies: [],
    };
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const addReply = (parentId: string, text: string, author: string) => {
    const reply: Comment = {
      id: generateId(),
      author: author.trim(),
      text: text.trim(),
      date: new Date().toISOString(),
      likes: 0,
      liked: false,
      replies: [],
    };

    const addReplyToComment = (list: Comment[]): Comment[] => {
      return list.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...c.replies, reply] };
        }
        return { ...c, replies: addReplyToComment(c.replies) };
      });
    };

    setComments(prev => addReplyToComment(prev));
  };

  const toggleLike = (targetId: string) => {
    const toggleInList = (list: Comment[]): Comment[] => {
      return list.map(c => {
        if (c.id === targetId) {
          return {
            ...c,
            liked: !c.liked,
            likes: c.liked ? c.likes - 1 : c.likes + 1,
          };
        }
        return { ...c, replies: toggleInList(c.replies) };
      });
    };
    setComments(prev => toggleInList(prev));
  };

  const totalComments = (list: Comment[]): number => {
    return list.reduce((sum, c) => sum + 1 + totalComments(c.replies), 0);
  };

  return (
    <section className="mt-16 md:mt-24">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-selah-orange/10 rounded-2xl flex items-center justify-center">
          <MessageCircle size={24} className="text-selah-orange" />
        </div>
        <div>
          <h2 className="content-h2 !text-selah-dark tracking-tight">
            {t("Discussion", "Discusión")}
          </h2>
          <p className="text-selah-muted/60 ui-caption mt-1">
            {totalComments(comments)} {t("comments", "comentarios")}
          </p>
        </div>
      </div>

      {/* New Comment Form */}
      <form onSubmit={addComment} className="mb-10">
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-selah-dark/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-selah-bg border-2 border-dashed border-selah-border/40 flex items-center justify-center shrink-0">
              <User size={18} className="text-selah-muted/40" />
            </div>
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder={t("Your name", "Tu nombre")}
                className="w-full bg-selah-bg/50 rounded-xl px-4 py-3 text-sm md:text-base text-selah-dark placeholder:text-selah-muted/40 focus:outline-none focus:ring-2 focus:ring-selah-orange/30 border border-selah-border/20 font-display transition-all duration-300"
                required
              />
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("Share your thoughts...", "Comparte tus pensamientos...")}
                rows={3}
                className="w-full bg-selah-bg/50 rounded-xl px-4 py-3 text-sm md:text-base text-selah-dark placeholder:text-selah-muted/40 focus:outline-none focus:ring-2 focus:ring-selah-orange/30 border border-selah-border/20 resize-none font-display transition-all duration-300"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-selah-orange text-white rounded-xl ui-button shadow-[0_8px_20px_-8px_rgba(255,92,0,0.4)] hover:shadow-[0_16px_30px_-8px_rgba(255,92,0,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Send size={16} />
                  {t("Post Comment", "Publicar Comentario")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-selah-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={32} className="text-selah-muted/30" />
          </div>
          <p className="content-h3 text-selah-muted/50 mb-2">
            {t("No comments yet", "Aún no hay comentarios")}
          </p>
          <p className="text-selah-muted/40 ui-caption">
            {t("Be the first to share your thoughts!", "¡Sé el primero en compartir tus pensamientos!")}
          </p>
        </motion.div>
      ) : (
        <div className="divide-y divide-selah-border/10">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={addReply}
              onLike={toggleLike}
              language={language}
              t={t}
            />
          ))}
        </div>
      )}
    </section>
  );
}
