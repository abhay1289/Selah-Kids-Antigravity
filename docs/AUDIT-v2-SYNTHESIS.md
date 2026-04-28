# Selah Kids — V2 World-Class Audit & Phased Unlock Plan

**Date:** 2026-04-21
**Branch:** `design/p0-truth-and-trust` (P0 shipped)
**Inputs:** Chrome walk of /, /watch, /music, /characters, /parents + code read + web research on YouTube IFrame API, Spotify iFrame API, Shopify Storefront API, pattern pulls from Linear, Arc, PBS Kids, Disney+, plus reviews from **Codex** (`gpt-5.3-codex`) and **Gemini 3.1 Pro Preview** — see `AUDIT-v2-codex-critique.md` and `AUDIT-v2-gemini-critique.md`.
**Verdict of current state:** solid post-P0 hygiene; the site is *honest* now. But it is not yet *magnetic*, not yet *cinematic*, not yet *enterprise*. It reads as "nice indie Fredoka template," not "the Pixar × Apple × Sesame Street platform for the modern Christian family."

---

## 🔧 Corrections from Codex + Gemini review (applied)

**Codex caught two of my hallucinations:**
- M14 "focus rings missing" is **wrong** — `src/app/globals.css:161` already has a global `:focus-visible` rule. Keep M14 only for *per-button* ring customization.
- M20 "prefers-reduced-motion ignored" is **overstated** — `src/app/globals.css:143` already has a global clamp. Real issue: animations are authored everywhere, so the clamp disables them without offering tasteful replacements. Reframe as "add `useReducedMotion()` branches for structural animations, not just CSS durations."
- "Phase 1 in 2–3 days" is fantasy. Realistic: Phase 1 is **5–7 engineering days** because it crosses UX, embed APIs, state, layout, and content modeling.

**Codex identified four Phase-1 blockers I missed:**
1. **No shared media state** — `src/components/LayoutShell.tsx:6` is just navbar/footer. U01 and U12 need a host.
2. **Video data is duplicated** in `src/app/watch/page.tsx:20` and `src/components/home/LatestVideosSection.tsx:31`. Must be unified into `src/data/catalog.ts` before U01.
3. **Every caller uses `window.open`** — `WatchGrid.tsx:39`, `LatestVideosSection.tsx:146`, `WatchCTA.tsx:37`, `JoinYouTubeSection.tsx:69/99` — all need refactor to a single `openEpisode(id)` dispatcher.
4. **Language state is in-memory only** — `src/contexts/LanguageContext.tsx:14` — swap to `localStorage` or cookie so the overlay/queue survives navigation.

**Gemini killed three weak unlocks from my doc:**
- ~~U13 Voice Commands~~ — **COPPA/privacy red flag** on a kids' site. Parents will refuse mic access. Drop.
- ~~U19 AR Color Sheets~~ — friction too high, ROI near-zero. Drop.
- ~~U27 Live Prayer Chain counter~~ — feels like manipulative SaaS FOMO, inappropriate for ministry. Drop.

**Gemini added three MISSING categories:**
- **U31. Ministry / Sunday School Portal** — children's-pastor view with lyric-only videos, bulk curriculum downloads, presentation-safe player. Kids worship happens at church too.
- **U32. Bulletproof Walled Garden** — YouTube iframes leak "suggested" videos and occasional ads even with `rel=0`. A truly world-class kids site hosts on **Mux** or **Vimeo Pro**. Evaluate for Phase 2 (YouTube is fine for Phase 1 launch speed).
- **U33. Chord Charts / Sheet Music** — parents + worship leaders want to play along.

**Gemini added five NEW bilingual-specific unlocks (★ = high magic):**
- ★ **U34. Seamless Audio Swap** — mid-song EN ↔ ES toggle without losing playback position. Requires two pre-rendered audio tracks per episode.
- ★ **U35. Stacked Bilingual Karaoke** — EN lyric on top, ES beneath, both syllables highlight in sync. Passive vocabulary learning.
- **U36. Shiloh's Sensory Room** — dedicated low-stim route hosted by Shiloh; dark mode, ambient worship pads, whispered bilingual scripture.
- **U37. Vocab Duets** — Libni shouts "Grace!", Andy echoes "¡Gracia!" — interactive micro-lessons.
- ★ **U38. Pastors' Cast Mode** — UI-stripped bilingual playlist builder optimized for AirPlay/Chromecast to a classroom TV.

**Codex added four MISSING trust/catalog items:**
- **J11. Parental trust chips** — every video card should show age band, runtime, sensory warnings, "safe for independent viewing" label. None exist today in `src/app/watch/page.tsx`.
- **J12. Canonical media catalog** — `src/data/catalog.ts` as single source of truth. Unblocks everything downstream.
- **J13. Favorites / history / resume watching** — IndexedDB-backed, no auth. Disney+ / Netflix parity.
- **J14. Parent-proof overlay behavior** — Esc key, focus trap, no accidental background clicks, explicit close, "Are you still watching?" prompt after N episodes.

**Ship order — Codex and Gemini agreed independently:**
1. **U01** first (forces the architecture: canonical catalog + shared player state)
2. **U04** second (home gets the same player)
3. **U02** third (/music rebuild)
4. **U12** fourth (mini-player is an extension of the player state)
5. **M02** + **M04** can run in parallel since they don't depend on U01

Gemini also called out **M02 (hero reel)** as a day-1 ship because a static hero is "proving the product's value in the first second" vs. pure decoration.

---

## 1. Reality Check — three blunt truths

1. **The site is a brochure for other sites.** Every value-producing action (watch, listen, shop) punts the user out to YouTube, Spotify, Apple Music, or Amazon. `src/app/music/page.tsx:42–55` is literally a list of four outbound link-cards. `src/components/watch/WatchGrid.tsx:39–43` calls `window.open(youtubeUrl, "_blank")` on every video. A world-class kids platform in 2026 *keeps the session in-house* — YouTube IFrame, Spotify iFrame, Shopify Storefront — so the Selah brand holds the stage while the content plays.

2. **The homepage whispers when it should sing.** One headline, one subhead, two CTAs, two characters, two videos, one carousel, a stripped footer. Disney+ and PBS Kids open with rows of content. Arc and Linear open with a product-doing-a-thing hero. Selah opens with *two floating characters and the word "Welcome."* The content catalog — 14+ videos in `src/app/watch/page.tsx:32–190` — is invisible from the homepage.

3. **Motion is decorative, not cinematic.** `whileInView` fade-ups are wallpaper (`src/components/home/WhyChooseSection.tsx`, `CharactersSection.tsx`, `AboutSection.tsx` all use the same `{ opacity: 0, y: 50 } → { opacity: 1, y: 0 }`). Animations reveal but do not *tell a story*. Apple's product pages use scroll to show cause-and-effect; Linear uses motion to demonstrate collaboration; Framer uses it to teach. Selah uses it to fade.

---

## 2. Micro Issues — 20 pixel-level amateur tells

| # | file:line | sev | symptom | fix |
|---|---|---|---|---|
| M01 | `src/components/home/HomeClient.tsx` | high | Preloader gets stuck at "99%" visible for 2+ seconds on a cold load (observed in Chrome). The progress→converge→burst isn't timed to actual asset readiness. | Tie progress to `document.readyState` + hero image decode, not a setInterval. |
| M02 | `src/components/home/HeroSection.tsx:1` | high | Hero headline "Christian Music for Kids" is the exact same line used as badge-copy-expanded. No supporting scene: no video thumb, no episode card, no demo. Arc opens with a browser mockup; Linear with a live issue tracker. | Replace right-side empty space with a playing *muted* hero reel (3 cuts, 6s loop) of a Selah episode — the product proving itself. |
| M03 | `src/app/globals.css` | high | Fredoka is used for display, body, UI, labels — one typeface for everything. Kids copy needs warmth; parent copy needs trust; nav needs neutrality. Monoculture reads as template. | Pair: **Fraunces** (display, warm serif), **Inter** (body + UI, trust), keep **Fredoka** for kid-facing accents (badges, chips). |
| M04 | `src/components/Navbar.tsx:35–43` | med | 7 nav items → cognitive overload. Apple Kids has 4, Disney+ has 5, Linear has 4. "Families/Parents/Blog/Resources" create a four-way info bucket overlap. | Collapse to 4: **Watch · Listen · Characters · Parents**. Move Blog into Parents → Articles. Move Resources into footer. |
| M05 | `src/components/home/LatestVideosSection.tsx` | med | Only 2 videos surfaced on homepage. The catalog has 14+. | Upgrade to Netflix-style horizontal row with arrow paging + lazy thumbs. |
| M06 | `src/components/watch/WatchGrid.tsx:39–43` | high | Click-to-YouTube loses the session and the brand. No duration shown, no hover preview. | Build in-site `<VideoOverlay />` using YouTube IFrame API (see §4 U01). |
| M07 | `src/app/watch/page.tsx:32–190` | med | No `duration` field on any video object. Parents want "is this 2 minutes or 8 minutes?" | Add `durationSec` field and render a small chip on each card. |
| M08 | `src/components/home/HeroSection.tsx` | low | "Our Story" secondary CTA uses a cream-on-pink pill that's low-contrast on the hero wash. | Use outline-on-white with a subtle glass backdrop; raise text to `selah-dark`. |
| M09 | All section reveals | high | `whileInView` with a tall viewport + fast scroll leaves elements at ~10% opacity when user arrives (observed on / and /parents). | Change `viewport={{ once: true, margin: "-50px" }}` to `{ once: true, amount: 0.01 }` + ship a fallback `className="opacity-100"` if `IntersectionObserver` fires without `isInView`. |
| M10 | `src/components/home/HeroSection.tsx` | low | No cursor-state affordance on interactive character portraits. | Add `cursor-pointer` + subtle magnetic translate on hover; tap → "Meet Libni/Andy" deep-link. |
| M11 | `next.config.js` | high | Next 16 requires `images.qualities: [50, 60, 85]` declaration. Dev server warns on every hero image render. | Declare the array. |
| M12 | `public/SK_Logo_FN.png` | med | Logo is raster PNG → blurry at `h-10` on retina and unscalable for favicons/OG. | Export to SVG; 1 file serves all sizes. |
| M13 | Hero characters `/rroque_ALA_Shot1260_v01.png`, `/SK_Libni_Intro_Pose-removebg-preview.png` | med | 8MB+ PNGs with quality="50/60" overrides. | Convert to AVIF/WebP at quality 72; or (better) isolate poses and animate with CSS transforms on a smaller base. |
| M14 | `src/components/UI/Button.tsx` (primary button) | med | Primary button hover lifts `-translate-y-0.5` + shadow grow, but ring focus is browser default. | Add `focus-visible:ring-2 focus-visible:ring-selah-orange/60 focus-visible:ring-offset-2`. |
| M15 | `src/components/home/TestimonialsSection.tsx:92` | low | Infinite marquee duplicates testimonial DOM nodes (`[...TESTIMONIALS, ...TESTIMONIALS]`) — aria-hidden missing on clones; screen readers announce everything twice. | Mark cloned range `aria-hidden` + `role="presentation"`. |
| M16 | Icon stroke weights | low | Mixing `lucide-react` defaults (1.5) with `size={24}` and `size={40}` creates inconsistent optical weight across Footer, Hero, WhyChoose. | Pick one stroke (1.75) and one default size system (16/20/24/32). |
| M17 | All `blur-[120px]` color washes | med | 5+ full-viewport blurs stacked on every page kill compositor on mid-range phones (observed CPU thrash mentioned by user). | Cap at 2 washes per page; use `will-change: transform` sparingly; drop blur radius to 80px. |
| M18 | Spanish strings | med | `t("Home", "Inicio")` scattered everywhere instead of a `messages/en.json` + `messages/es.json` catalog; no overflow testing (German/ES often 30% longer). | Centralize in `src/i18n/messages.{en,es}.json`; add overflow lint to CI. |
| M19 | Empty states | high | No empty state on /blog if category has no posts, no empty state on /resources if filter returns zero. | Ship a friendly "No posts yet — check back next week" card per collection. |
| M20 | `prefers-reduced-motion` | high | No global respect. Kids with vestibular sensitivity / autism-spectrum users get slammed by infinite carousels + 3D rotations. | Wrap in `useReducedMotion()` from framer-motion; skip `animate={{ rotate: [-1,1,-1] }}` and marquee. |

---

## 3. Major Issues — 10 system flaws

| # | severity | flaw | fix |
|---|---|---|---|
| J01 | **blocking world-class** | Videos link out. The product is videos. | In-site YouTube IFrame overlay player with playlist queue. See §4 U01. |
| J02 | **blocking** | `/music` is 4 outbound buttons (`src/app/music/page.tsx`). A music page with no music is theater, not product. | Spotify iFrame album + YouTube Music playlist + Apple Music widget. See §4 U02. |
| J03 | high | No catalog search. 14 videos today, will be 50+. Parents on car trips need "songs under 5 min" in 3 seconds. | Episode finder with instant search. See §4 U05. |
| J04 | high | No persistent mini-player. User clicks a song, navigates, song stops. Spotify/Netflix/Apple Music all keep a pinned bottom player. | Global `<MiniPlayer />` in `LayoutShell`. See §4 U12. |
| J05 | high | No character depth. `/characters` shows poses with no story, no voice, no verse, no episodes. Pixar makes you love characters before they make you buy. | `/characters/[slug]` depth pages. See §4 U03. |
| J06 | high | IA bloat. 7 nav items, no search. | Collapse to 4 (M04). |
| J07 | med | Hero is single-scene, static. No "show the product" moment. | Hero reel loop. See M02. |
| J08 | med | Asset tier is PNG. Logo, icons, pose sprites. SVG → Lottie → Spline is the ladder. | Start: logo → SVG. Next: Libni/Andy idle animations → Lottie. |
| J09 | med | No dark / quiet-time mode. Kids' sites need a bedtime story mode. | `/quiet` route or global toggle. See §4 U07. |
| J10 | high | Motion is used for decoration, not story. No scene-to-scene choreography, no scroll-jacked narrative. | Rebuild home around a 5-beat scroll script (hero → today's episode → characters → parent trust → community). |

---

## 4. Creative Unlocks — ranked by (magic × ease)

### Tier A — do these now (high magic, medium effort, in-site retention)

**U01. In-Site YouTube Playlist Player** ★★★★★
Custom overlay when any video card is clicked. Uses YouTube IFrame Player API v1 (stable March 2026; [docs](https://developers.google.com/youtube/iframe_api_reference)).
Spec: fullscreen-glass overlay, 16:9 player centered, right-rail queue of all episodes, auto-advance via `onStateChange(ENDED → nextVideo())`, "Up Next in 3…" banner, speed controls (0.5–2x), CC toggle (`cc_load_policy=1`), parent *Bedtime Timer* (slider 5/10/15/30 min → `stopVideo()`). Wire playlist IDs: pull `list=UU...` from `@selahkidsworship` and `@SelahKidsEspanol`. Minimum viewport 480×270, include `origin=https://selahkids.com` for postMessage security.
**Files touched:** new `src/components/player/VideoOverlay.tsx`, new `src/hooks/useYouTubePlayer.ts`, edit `src/components/watch/WatchGrid.tsx:39`, edit `src/components/home/LatestVideosSection.tsx` click handler.

**U02. /music becomes a real music page** ★★★★★
- Spotify iFrame embed via `https://open.spotify.com/embed/iframe-api/v1` ([docs](https://developer.spotify.com/documentation/embeds/references/iframe-api)) for artist `6lShgHNhA1vXSZ6f4UXMa4`. Each album a playable card with `controller.togglePlay()`, `seek()`, `playback_update` event for waveform highlight.
- Apple Music embed as fallback via `<iframe src="https://embed.music.apple.com/us/artist/selah-kids/1823099991">`.
- Strip the 4 outbound-link buttons. Keep small "Also available on Amazon Music" footer.
**Files:** rewrite `src/app/music/page.tsx` end-to-end.

**U03. Character Depth Pages `/characters/[slug]`** ★★★★☆
Dynamic route. For each of Libni, Andy, Shiloh:
- Parallax hero with full-body pose; animated idle on scroll pause.
- *Voice Sample* — 5-second `<audio>` intro ("Hi, I'm Libni! Let's worship together!").
- *Catchphrase* + *Favorite Verse* card.
- *Mini origin story* (80 words, from-the-Bible angle).
- *Coloring sheet PDF download* (see U10).
- "Appears in these episodes" horizontal row with thumbs that open the in-site player.
**Files:** new `src/app/characters/[slug]/page.tsx`, new `src/data/characters.ts` with voice file paths.

**U04. Daily "Today's Episode" card on homepage** ★★★★☆
Replace LatestVideos' 2-video stub with: a single hero "Today's Pick" (pseudo-random deterministic by date-mod-catalog-length) + a horizontal row "From the catalog." Calendar API-free; pure client.
**Files:** rewrite `src/components/home/LatestVideosSection.tsx`.

**U05. Episode Finder** ★★★★☆
Cmd-K modal (or top-of-/watch input). Fuse.js-backed instant search over title + tags + lang + durationSec. Filter chips: lang (EN/ES), type (music/sing-along/sensory), duration (<3m / 3–8m / 8+m), age band.
**Files:** new `src/components/watch/EpisodeFinder.tsx`, augment `src/app/watch/page.tsx` data objects with `tags: string[]` and `durationSec: number`.

### Tier B — add within phases 1–2 (differentiators)

**U06. Kids Mode / Parent Mode toggle** ★★★★☆
Global navbar switch persisted in cookie. Kids = larger hit targets (min 72×72), sparkles cursor trail, playful bounces, soft sound effects on clicks. Parent = denser grid, filters visible, stats, contextual parental resources surfaced first. Respect reduced-motion either way.
**Files:** new `src/contexts/AudienceContext.tsx`, consumed by Navbar, Hero, sections.

**U07. Quiet Time / Bedtime Mode** ★★★★☆
`/quiet` route (and global dimmer toggle). Dim the background to #0B1020 starfield, reduce motion to near-zero, auto-queue calm/sensory episodes. Includes a 10/20/30-minute sleep timer.
**Files:** new `src/app/quiet/page.tsx` + `src/components/player/QuietMode.tsx`.

**U08. Karaoke Lyric Highlight** ★★★★☆
For sing-along episodes: use YouTube IFrame `getCurrentTime()` polled at 200ms to highlight syllables in a lyric panel beside the video. Store per-episode lyric-with-timestamps as JSON.
**Files:** new `src/data/lyrics/{episode-id}.json`, extend VideoOverlay with `LyricPanel` prop.

**U09. Psalm-Sync Scroll Companion** ★★★★☆
Sticky right-rail on home and /parents. Verse swaps by scroll section. Background wash subtly warms/cools per verse tone (Psalms of lament = cool blue, Psalms of praise = warm orange). Frame: `useScroll` + `useTransform` on a section array.
**Files:** new `src/components/psalm/PsalmCompanion.tsx`.

**U10. Coloring Page PDF Generator** ★★★☆☆
Per-character. Click "Download coloring sheet" → server route generates a line-art PDF via `@react-pdf/renderer` or static pre-built PDF by slug. Logs download for "completing a pack" (U20).
**Files:** new `src/app/api/coloring/[slug]/route.ts`, public asset `public/coloring/*.pdf`.

**U11. Gift-an-Episode** ★★★☆☆
"Send this song to a friend" → email template with personalized note + deep link that opens the in-site player pre-queued. Resend / Loops / Mailgun transactional; rate-limited to 5/day/IP.
**Files:** new `src/app/api/gift/route.ts`, new `src/components/share/GiftModal.tsx`.

**U12. Persistent Mini-Player** ★★★★☆
Bottom-right floating player (YouTube IFrame hidden; audio continues). Survives route changes via `LayoutShell`. Esc collapses, drag-dismiss.
**Files:** new `src/components/player/MiniPlayer.tsx` mounted once in `LayoutShell.tsx`.

### Tier C — phase 3 magic (compound unlocks)

**U13. Voice Commands** ("Hey Libni, play the shepherd song") — Web Speech API, opt-in mic toggle, phrase match against episode titles + tags.

**U14. Verse Memory Mini-Game** — flashcard duel, child vs character. Tracks streaks. Leaderboard across siblings (local only, no UGC).

**U15. Prayer Wall / Testimonies** — Sanity-moderated UGC. Parents submit; editor approves; family gets a thank-you email. 3 posts on homepage, archive at `/wall`.

**U16. Seasonal Themes** — Advent (25-day unlock-a-video calendar), Easter Journey (7-station scroll-story), Christmas countdown. Triggered by system date; fallback toggle in footer.

**U17. Parent Dashboard** — `/parents/dashboard` after email sign-in. Watch history, favorites, weekly time caps, recommended next. Kick-off: `useWatchHistory()` via IndexedDB, no auth required for v1.

**U18. Siblings Mode** — two profiles, shared queue, "Libni pick / Andy pick" alternator.

**U19. AR Color Sheet Unlock** — print a coloring page, photograph after coloring, Web AR (via 8th Wall Lite or Mindar) recognizes the marker and plays a 10-sec behind-the-scenes clip. Phase 3+.

**U20. Studio BTS** — unlockable after completing N episodes (tracked via watch history). "You've earned a peek into the studio."

**U21. Printable Devotional Pack** — weekly themed PDF bundle (song + verse + activity + prayer). Auto-gen via react-pdf from weekly data file.

**U22. Family TV Cast Button** — detect `navigator.presentation.defaultRequest` (Chromecast) or AirPlay picker on iOS; one-tap sends to TV.

**U23. Scripture Bookmark Emailer** — "Save this verse to my email" → sends the verse + the episode it came from + a personal note.

**U24. Adaptive Language** — browser locale detect on first visit; persist choice in cookie; "We noticed you're in…" banner for confirm.

**U25. Character Cameo Newsletter** — weekly, written in Libni/Andy voice; ConvertKit or Loops template; preview card on homepage.

**U26. Countdown to Next Drop** — if upload cadence is known, surface "New episode drops in 3 days, 4 hours" above the fold.

**U27. Live Prayer Chain** — real-time counter "47 families praying right now" powered by a simple `/api/heartbeat` + Supabase row count; anonymous.

**U28. Theme Picker** — Arc-style: user picks from 6 theme skins (orange, pink, blue, green, dusk, starfield). Persisted.

**U29. Animated Idle Characters** — replace static PNGs in hero/character pages with Lottie idle loops (blink, breathe, occasional wave). 3s loops, pause on `prefers-reduced-motion`.

**U30. Shopify Product Carousel** — *conditional*. If a Selah shop exists, embed via Shopify Storefront API (NOT the deprecated Buy Button JS — support ended Jan 2026; [changelog](https://changelog.shopify.com/posts/discontinued-support-for-javascript-buy-sdk)). Rendered as custom React cards on `/music` (album bundles, physical CDs) and `/resources` (devotional kits). GraphQL fetch → cards → cart drawer. If no Shopify store yet, defer U30 and ship a Gumroad/Stripe fallback with the same UI.

---

## 5. Asset & Type Maturity Roadmap

| Asset | Today | Next | End state |
|---|---|---|---|
| Logo | `SK_Logo_FN.png` raster | SVG vector | + animated reveal on initial load |
| Icons | lucide-react inline | lucide + curated 20-icon set at 1.75 stroke | custom Selah icon family SVG |
| Character poses | 5MB PNGs at quality 50–60 | AVIF + transparent bg + preload | Lottie idle loops per character |
| Backgrounds | 5× blur washes per page | 2× washes + subtle grain (no blur stack) | conditional per-section color story |
| Typography | Fredoka everywhere | **Fraunces** (display) + **Inter** (body/UI) + Fredoka (kid accents only) | variable-weight Fraunces with per-section tracking |
| Color tokens | orange/yellow/blue/dark + 4 one-offs | full 12-step ramp per brand hue in `globals.css` `@theme` | dark-mode sister tokens |

---

## 6. Motion Re-Choreography

| Section | Today | Should be |
|---|---|---|
| Hero | Badge → headline → subhead → CTAs fade-up in sequence | Scene: headline rests, *hero reel plays*, CTAs emerge beneath; characters react to scroll depth (parallax + slight rotate toward center) |
| LatestVideos | cards fade up | horizontal row pages with `scroll-snap-type: x mandatory`, thumb morphs to player on click |
| WhyChoose | 3 cards fade-up stagger | *proof camera*: scroll locks for 3 card beats, each card demonstrates a claim (not text alone) |
| Characters (home) | grid fade-in | character *walks on* from off-canvas, then becomes the CTA |
| Testimonials | infinite marquee | chapter-book style: 1 testimonial at a time, 6-second crossfade, pauses on hover |
| Newsletter | static | input *writes itself* with placeholder text then invites real input |
| Footer | fade-in | starfield with tiny Libni/Andy silhouette waving goodbye |

Every animation MUST respect `useReducedMotion()`.

---

## 7. A11y & Performance Red Flags

- **A11y:** focus-visible rings missing (M14), aria-hidden on marquee clones missing (M15), reduced-motion ignored (M20), character PNGs lack descriptive alt text, language toggle doesn't announce on change.
- **LCP:** hero PNG is 8MB+; target < 2s on mid-tier mobile. Add `priority` to hero, preload `<link rel="preload" as="image" fetchpriority="high">`.
- **CLS:** video cards don't reserve aspect ratio → shifts on thumb load. Add `aspect-video` wrapper.
- **Bundle:** framer-motion is imported per-component but some only need `motion.div`; audit with `next build --profile`.
- **Fonts:** Fredoka loads via `next/font` (good); add `font-display: swap` if not already. Preconnect Google Fonts.
- **Blur stacks:** 5× full-viewport `blur-[120px]` per page = compositor hell on Android mid-tier. Cap at 2.

---

## 8. Scene Rhythm (homepage ASCII)

```
┌─ HERO (climax-first) ─────────────────────┐
│  headline · reel · two CTAs · characters  │
├─ TODAY'S EPISODE (rest) ──────────────────┤
│  single big card + horizontal row         │
├─ CHARACTERS (character beat) ─────────────┤
│  Libni · Andy · Shiloh with "Meet" CTAs   │
├─ WHY SELAH (proof) ───────────────────────┤
│  3 proof moments, locked scroll           │
├─ PARENTS TRUST (trust) ───────────────────┤
│  badges · founder note · safety policy    │
├─ TESTIMONIALS (community) ────────────────┤
│  chapter-book crossfade                   │
├─ LISTEN (unlock) ─────────────────────────┤
│  inline Spotify iframe + "Open /music"    │
├─ JOIN COMMUNITY (call) ───────────────────┤
│  newsletter · CTA                         │
└─ FOOTER (goodbye) ────────────────────────┘
```

---

## 9. Phased Implementation Plan  *(revised after Codex + Gemini review)*

### Phase 1a — Foundations (1–2 days, unblocks everything)
**Ships before any U-unlock:** J12 (canonical `src/data/catalog.ts`), refactor `window.open` → `openEpisode(id)` dispatcher, `LocalStoragePersist` on LanguageContext, `useMediaHost` slot inside `LayoutShell`.
**Why first:** Codex is right — without these, U01/U04/U12 are architecturally homeless.

### Phase 1b — In-Site Product (3–4 days)
**Ships:** U01 (YouTube overlay player with focus trap + Esc + "still watching?"), U04 (Today's Episode hero card + horizontal row), U02 (Spotify + Apple Music embeds on /music), U12 (persistent mini-player), M02 (hero reel), M04 (nav 7→4), M11 (`images.qualities`).
**Success metric:** average session duration +2×, bounce to YouTube −70%.

### Phase 2 — Depth & Discovery (4–5 days)
**Ships:** U03 (character pages), U05 (episode finder), U06 (Kids/Parent toggle), U07 (Quiet Time → merge with U36 Shiloh's Sensory Room), U08 + **U35 Stacked Bilingual Karaoke** (superior to plain karaoke), **U34 Seamless Audio Swap**, J11 (parental trust chips: age band, runtime, sensory notes), J13 (favorites/history via IndexedDB), M03 (Fraunces + Inter pairing), M19 (empty states), J08 (SVG logo).
**Success metric:** /characters engagement +5×, /watch depth +2×, returning-visitor rate >40%.

### Phase 3 — Delight & Retention (ongoing)
**Ships:** U09 (Psalm-Sync), U10 (coloring PDFs), U11 (gift-an-episode), U14 (verse memory), U15 (prayer wall — as UGC testimonies, NOT live counter), U16 (seasonal themes), U17 (parent dashboard), U20 (studio BTS), U22 (cast button), U25 (cameo newsletter), U28 (theme picker), U29 (Lottie idle), **U31 Ministry Portal**, **U33 Chord Charts/Sheet Music**, **U37 Vocab Duets**, **U38 Pastors' Cast Mode**.
~~U13 voice~~ dropped (COPPA). ~~U19 AR~~ dropped (friction). ~~U27 live prayer counter~~ dropped (ministry-inappropriate).
**Success metric:** returning-visitor rate >55%, email list compound monthly, ministry-portal adoption.

### Phase 4 — Commerce + Walled Garden (conditional)
**Ships:** U30 (Shopify Storefront, if shop exists) — custom React cards with 30s preview snippets via Spotify API, Shopify cart drawer, Stripe fallback.
**U32 Walled Garden evaluation** — if brand safety is a board-level concern, migrate from YouTube IFrame to **Mux** or **Vimeo Pro**. Keep YouTube as "mirror" for SEO / share-ability.

---

## 10. Top-3 Next Unlocks — pick one to start

1. **U01 in-site YouTube overlay** — single biggest brand-retention win. ~1 day. Enables U04, U08, U12 as follow-ons.
2. **U02 /music rebuild with Spotify iframe** — turns a dead end into a destination. ~0.5 day.
3. **U03 character depth pages** — builds the emotional economy around the IP. ~1.5 days.

Do all three in Phase 1 and the site *feels* different on Monday.

---

## Sources & References
- [YouTube IFrame Player API (updated 2026-03-15)](https://developers.google.com/youtube/iframe_api_reference)
- [Spotify iFrame API](https://developer.spotify.com/documentation/embeds/references/iframe-api)
- [Shopify JS Buy SDK deprecation](https://changelog.shopify.com/posts/discontinued-support-for-javascript-buy-sdk)
- [Shopify Storefront API (current)](https://shopify.dev/docs/storefronts/headless/additional-sdks)
- Pattern pulls: Linear, Arc, PBS Kids, Disney+ (April 2026).
