'use client';

interface AppleMusicEmbedProps {
  artistId?: string;
  country?: string;
  theme?: 'auto' | 'light' | 'dark';
  height?: number;
  className?: string;
}

export function AppleMusicEmbed({
  artistId = '1823099991',
  country = 'us',
  theme = 'auto',
  height = 450,
  className
}: AppleMusicEmbedProps) {
  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#FC3C44]/10 to-[#FC6E29]/10 p-1">
      <iframe
        allow="autoplay *; encrypted-media *;"
        src={`https://embed.music.apple.com/${country}/artist/selah-kids/${artistId}?theme=${theme}`}
        loading="lazy"
        frameBorder="0"
        style={{ borderRadius: '1rem', overflow: 'hidden', width: '100%', height }}
        className={className}
      />
    </div>
  );
}
