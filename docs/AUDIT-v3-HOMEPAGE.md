# Homepage Deep Audit v3 — Design, Motion, Functionality, Brand Soul

**Date:** 2026-04-21
**Branch:** `design/p1-foundations`
**Scorecard today:** Craft **5/10**. Ship-blockers: **4**. (Gemini said 4.5/10; Claude says 5.0/10 after giving credit for preloader craft and hero parallax; the 4 ship-blockers are agreed.)

Two audits ran in parallel:
- **Gemini (senior design director persona)** — `docs/AUDIT-v3-gemini-out.md`
- **Claude** — sections below labelled "CLAUDE" are things Gemini did not catch

---

## TL;DR — Ship-blockers (must fix before any "launch")

| # | File / location | What it is | Why it's a blocker |
|---|---|---|---|
| **SB1** | `NewsletterSection.tsx:142-147, 172` | Placebo newsletter form — submits to nothing; fabricated "Join 100,000+ families" stat | Writes a trust contract the brand can't honor. FTC + COPPA-adjacent risk if parents think they're subscribing. |
| **SB2** | `JoinYouTubeSection.tsx:89-131` | Fake YouTube player UI with fake progress bar "04:20 / 10:00" and fake CC buttons, click just opens YouTube in new tab | Classic bait-and-switch. Parents who tap-test this lose trust in 1 second. |
| **SB3** | `HomeClient.tsx:244-250` vs session plan | Homepage still renders `LatestVideosSection` (hardcoded duplicate catalog + `window.open` to YouTube) and does **not** render `TodaysEpisode` or `CharactersSection` that Phase-1 built | The Phase-1 in-site player unlock is invisible from the homepage. Watch a kid tap a video → they get launched to YouTube, not the overlay. |
| **SB4** | `HomeClient.tsx:29-52` | 2-3s fake preloader (setInterval → 99% → "converging" → "burst") that blocks LCP even on fast networks | Blocks parent time-to-content. A `3-year-old` doesn't care about cinematic intros when they already saw the YouTube thumbnail and want to tap. |

Before anything else on this homepage ships, those four are removed or rewired.

---

## Section-by-section findings

### 1. HeroSection
**What's good:** Character entrance choreography (Libni/Andy spring in with blur + scale), word-by-word H1 reveal, platform availability pills (YouTube/Spotify/Apple), quality of the glassmorphic badge, cursor spotlight on desktop.

**What's broken:**
- `HeroSection.tsx:120` — `quality={50}` on the hero background image (LCP) — this is the first pixel the user sees; it should be `quality={85}` at minimum.
- `HeroSection.tsx:92-97` — six stacked `blur-[100-120px]` gradient blobs. On a 2019 Android device this scorches the first paint. One layered `bg-conic-gradient` would be cheaper.
- `HeroSection.tsx:126-183` — "3D mouse tracking" rotateX/Y on character images. Feels slippery not grounded; zero mobile fallback.
- The "Watch Now" CTA routes to `/watch` (OK) but "Our Story" routes to `/about`. Neither surfaces the in-site player. The hero CTA should open TodaysPick in VideoOverlay directly.
- Copy-hierarchy: "Christian Music for Kids" is technically accurate, emotionally flat. Peers (Apple TV, Disney+) use promise-over-category language.
- No `useReducedMotion` anywhere in Hero. The infinite float loops on Libni/Andy (y/rotate every 6-7s) run for users with vestibular disorders.
- **CLAUDE:** `HeroSection.tsx:185` comment says *"Shiloh removed to balance the left/right composition"* — the third character is missing from the hero. Brand has 3 characters; featuring only 2 on the landing page signals "Shiloh is sidekick." If the whole site centers the Sensory Room on Shiloh, she belongs in the hero.

### 2. LatestVideosSection (SHOULD BE REMOVED)
- `LatestVideosSection.tsx:39-108` hardcodes its own `LATEST_VIDEOS` array (duplicate of `EPISODES`).
- `LatestVideosSection.tsx:147, 153` — still uses `window.open(url, "_blank")`. Same bug the WatchGrid had before this session's refactor.
- **CLAUDE:** This section exists to be replaced by `TodaysEpisode.tsx`. The file is orphaned in the mounting order.

### 3. AboutSection
- "NATURE FIRST" floating pill at `AboutSection.tsx:81` — left-over template copy; makes no sense for a faith brand. Must be replaced with something like `"MADE BY PARENTS"` or `"7-MINUTE BIBLE STORIES"`.
- `AboutSection.tsx:115-128` — feature cards set `role="button"` + `tabIndex={0}` but there's **no `onClick`**. Dead affordance Gemini flagged.
- Two feature cards ("Original Worship Songs" / "Stunning Animation") do real work, but the imagery is a single stock-ish frame `TGN_SingleFrames+(9).jpg`. Peers use layered animated illustration or silent looping video here.

### 4. WhyChooseSection
- `WhyChooseSection.tsx:154` — `<feTurbulence>` SVG noise filter. Gemini is right: on lower-end Android, render-blocking during scroll. Ship a pre-rendered PNG noise overlay instead.
- `WhyChooseSection.tsx:185` — `leading-[1.05]` on responsive H2. Crashes ascenders/descenders at some breakpoints.
- Core copy "Why Selah Kids?" → generic. Should be promise-first, e.g. *"Screen time you don't have to apologize for."*
- Card body copy leans into "lesson"/"educational" — parent-facing, not kid-facing. One copy track can't serve both; split to a parent-mode row + kid-mode row.

### 5. CharactersSection (NOT RENDERED)
- `CharactersSection.tsx:92` — every card links to `/characters` (index), not the new `/characters/[slug]` depth pages.
- `HomeClient.tsx` never imports this section at all — it's orphaned. **The landing page doesn't introduce the characters.** That's the single highest-impact copy/IA gap.

### 6. TodaysEpisode (NOT RENDERED)
- Built in Phase-1, wires into `useMedia.openEpisode`, looks correct. But **never mounted** on the homepage. Pure dead code today.
- The `rest` catalog row at `TodaysEpisode.tsx:17` shows 6 episodes from ALL languages — should filter by current `language`.

### 7. TestimonialsSection
- Infinite marquee. Doesn't pause on hover/focus (Gemini). Uses straight `"` quotes, not typographic `" "`.
- Same generic "parent testimonials" trope as every other kids site. No faces, no kid-in-the-frame. Hero peer (Khan Academy Kids) uses short audio clips of parents reading the testimonial. Here: static text only.

### 8. JoinYouTubeSection (SHIP-BLOCKER SB2)
- Fake player (see SB2). The 04:20 timestamp and fake CC squares are the worst offense.
- Huge full-bleed orange gradient — same color DNA as hero + newsletter; nothing signals "we moved to a new section."
- Even if fixed, the YouTube subscribe CTA doesn't belong on the homepage twice (again in footer). Pick one place.

### 9. NewsletterSection (SHIP-BLOCKER SB1)
- Placebo form (see SB1). Confetti success screen. Fabricated "100,000+ families" stat.
- `repeating-conic-gradient` + `animation: spin 120s linear infinite` — drains CPU even when off-screen.
- Two newsletter forms (this + footer) = CTA fatigue.

### 10. Footer (not in this audit's file list but relevant)
- Missing `/music`, `/sensory`, `/characters/[slug]` links — Phase-1 routes orphaned from nav.
- "Designed by Engaze Digital" credit line cheapens the brand.
- Duplicate "Join the Family" newsletter.

---

## Cross-cutting findings

### Motion craft
- **No `useReducedMotion` outside SensoryHero.** Gemini is right: every section has infinite springs. Homepage is a trigger for vestibular-sensitive users.
- Infinite decorative loops across 6+ sections compound; battery drain even when tab not focused.
- Preloader blocks TTI (SB4).
- Section-to-section choreography doesn't exist. Each section does its own "fade + rise" with `viewport={{ once: true }}`. The transitions feel like CMS blocks, not a directed film.

### Typography & voice
- The H1 word-bounce (`HeroSection.tsx:232-254`) adds ~700ms of unreadable flux before headline stabilises.
- Straight quotes throughout. Missing typographic em-dashes.
- Copy is in the "worship + learning" neutral lane — no point-of-view that cuts through.

### Color & atmosphere
- 4-5 orange-dominant sections in a row. No breathing color. No "night mode" or evening palette.
- No depth: all shadows are neutral-black-based. For a warm-palette brand, colored shadows (e.g., `rgba(255,107,0,0.15)`) would give atmosphere.

### Information architecture
- Homepage does NOT surface `/music`, `/sensory`, `/characters/[slug]`, or the in-site VideoOverlay.
- Nav has 7 flat items — no hierarchy. The nav collapse to 4+More was planned and didn't land.
- Two newsletter CTAs, two YouTube CTAs.

### Accessibility
- Missing focus-visible rings on custom buttons.
- External `_blank` links lack screen-reader text.
- Confetti runs regardless of `prefers-reduced-motion`.

### Performance
- `quality={50}` on hero LCP.
- Stacked large-radius blurs on every section (SB4 compounds).
- `feTurbulence` noise filter (WhyChoose).
- Infinite CSS spinners (Newsletter).

---

## Brand soul — what's missing

Today the brand says: *"cheerful faith-filled songs for kids."* That's a category, not a point-of-view.

Peers that *actually* differentiate:
- **Khan Academy Kids** → "free forever." Trust through refusal of ads.
- **Headspace** → "mind-first." Everything is breath + color temperature.
- **Moshi Kids** → "sleep-first." Every feature ladders to bedtime.
- **Duolingo** → "streaks + mascot emotional stakes."
- **Pixar.com** → "one moving hero scene, nothing else above the fold."

**Three point-of-view moves for Selah Kids** (Claude + Gemini agree on at least one of these):

1. **"7 minutes is enough."** — The parent-trust promise. Every episode is 7 minutes; every feature is 7-minute-shaped. A visible countdown. A "dinner's on in 7" mode.
2. **"Bedtime is sacred."** — Shiloh's Sensory Room becomes the brand's evening mode. 6pm swap: palette dims, autoplay → sensory only, hero music goes to soft strings. Competitors don't do this.
3. **"Parents see scripture; kids see joy."** — Dual-mode UX. Parent-mode surfaces which Bible verse each song anchors, why this lyric, what age-band. Kid-mode hides all of that and is pure thumbnail joy.

Pick one and commit; don't ship all three as features.

---

## Phased plan — "Homepage that matches the Phase-1 unlocks"

Three phases: `P2a` (ship-blockers + wiring, 1 day), `P2b` (IA + section rewrite, 2-3 days), `P2c` (creative direction, 3-5 days). Each phase is independently shippable.

---

### **P2a — Remove lies, wire the unlocks** (~1 day, highest ROI)

Ship-blocker elimination + wiring the Phase-1 work into the homepage. Zero new design needed.

**P2a.1 — Kill SB1 (fake newsletter).** Two choices:
- Wire to a real ESP (Mailchimp/Buttondown/Resend audiences) — need user to provide API key.
- OR remove the second form entirely; keep only footer form with a clearly-labelled "coming soon" state + "for now, follow us on YouTube".

Delete the fabricated `100,000+ families` stat (`NewsletterSection.tsx:172`).

**P2a.2 — Kill SB2 (fake YouTube player).** Replace with either:
- A real in-site play: use the `useMedia.openEpisode` + TodaysPick; keep the red YouTube icon as the subscribe CTA.
- OR a simple YouTube iframe embed (lose parallax, gain honesty).

**P2a.3 — Kill SB3 (unwired Phase-1 work).**
```
HomeClient.tsx mount order → 
  HeroSection
  TodaysEpisode         ← mount (replaces LatestVideosSection)
  CharactersSection     ← mount (previously orphaned)
  WhyChooseSection
  JoinYouTubeSection    ← after P2a.2 fix
  TestimonialsSection
  NewsletterSection     ← or delete per P2a.1
```
Delete `LatestVideosSection.tsx`. Fix `CharactersSection.tsx:92` to link to `/characters/${slug}`.

**P2a.4 — Kill SB4 (fake preloader).** Replace with either:
- A brand-animated "splash screen" that resolves on real `document.readyState === 'complete'` OR 400ms max (whichever first).
- OR remove the preloader entirely on the homepage; keep only a very thin scroll progress bar.

**P2a.5 — Nav + footer IA.** Land the 4+More nav. Add `/music`, `/sensory`, `/characters` to footer. Remove the duplicate footer newsletter. Drop the "Designed by Engaze Digital" credit (or move to a properly-designed `/colophon`).

**P2a.6 — `prefers-reduced-motion` respect (homepage-wide).** One hook in a shared `useMotionSafe()` wrapper; every infinite `animate={...}` loop short-circuits to static.

**Acceptance:** parent runs devtools → sees no fake player, no fake newsletter, no "100,000+ families"; kid clicks a thumbnail anywhere on homepage → in-site VideoOverlay opens; reduced-motion users see static homepage with crossfades only.

---

### **P2b — Information architecture + section rewrite** (~2-3 days)

Assuming P2a shipped, the homepage still feels like a CMS block pile. P2b reorders, rewrites, and introduces the Phase-1 unlocks in their best form.

**P2b.1 — Section order rewrite:**
```
1. Hero              — + add Shiloh; + hero CTA opens TodaysPick in-site
2. TodaysEpisode     — daily pick + filtered catalog row
3. CharactersSection — now links to depth pages
4. WhyChooseSection  — promise-first copy rewrite
5. A new "Bedtime is sacred" module (/sensory teaser) — NEW
6. TestimonialsSection — pause-on-hover fix; typographic quotes
7. JoinYouTubeSection — stripped-down; no fake player
(no newsletter here — move to a slim footer-only variant)
```

**P2b.2 — Copy rewrites** (promise-first):
- Hero H1 → parent-promise version in EN/ES.
- WhyChoose title → `"Screen time you don't have to apologize for."`
- WhyChoose cards → kid-joy phrase first, parent-trust phrase second, one line each.
- AboutSection "NATURE FIRST" pill → `"MADE BY PARENTS"` or `"7-MINUTE EPISODES"`.

**P2b.3 — Bedtime teaser module (NEW).**
Full-bleed black panel between Why + Testimonials: dim Shiloh render, "From 6pm, the room dims" copy, CTA to `/sensory`. Uses real `Date.now()` to soften palette after dusk if visited in evening.

**P2b.4 — Color discipline:** Mandate that consecutive sections cannot share the same dominant color band (cream → cream → orange → orange today). Rotate cream / deep navy / warm amber / forest. Anchor bright sections with one calm section.

**P2b.5 — Typography pass:** Curly quotes, em-dashes, `line-height` audit per H-level, one display font for H1/H2 only, reset H3 to body font weight.

**Acceptance:** homepage scroll feels like 6 chapters of a 2-minute story, not 9 stacked CMS blocks; every Phase-1 unlock has a doorway from the homepage.

---

### **P2c — Creative direction** (~3-5 days, product differentiation)

Pick **ONE** of the three POV moves ("7 minutes," "bedtime is sacred," or "parents see scripture"). Full polish pass through that lens.

**P2c.1 — Hero living-chalkboard / pupil-gaze.** (From Gemini's Unlock #1 and #4.)
- Characters' pupils track the cursor (desktop) / device gyro (mobile). Light DOM-only ask — two `<circle>` SVG overlays on Libni/Andy heads.

**P2c.2 — Theater-mode `layoutId` transition.** (Gemini Unlock #2.)
- Clicking a thumbnail uses Framer Motion shared-layout to expand the thumbnail into the VideoOverlay instead of a pop-in. We already have VideoOverlay; wrap the opening card and the overlay frame in a common `layoutId`.

**P2c.3 — Time-aware atmosphere.** (Gemini Unlock #3.)
- One CSS custom-property layer (`--tone: morning | afternoon | dusk | night`), derived from `new Date().getHours()`. Every section reads the tokens. Moves brand color slowly through the day — this is the "bedtime is sacred" POV made structural.

**P2c.4 — Interactive lyrics karaoke on TodaysEpisode.** (Gemini Unlock #8.)
- On the TodaysPick card, run a silent loop of the video with the currently-sung lyric kinetic-typed in front. When the user taps, the VideoOverlay opens with audio unmuted from the same timestamp.

**P2c.5 — Reduced-motion premium mode.** Users with `prefers-reduced-motion: reduce` don't get a dead homepage — they get a *quieter* one with slow crossfades + longer read-times. This itself becomes a brand signal.

**Acceptance:** opening the page on a Sunday morning at 7am looks obviously different from a Tuesday at 8pm. Tapping Libni on the hero makes her look at the cursor. Clicking a thumbnail expands into the player with a single seamless transition instead of "modal pops in."

---

## Appendix A — Gemini's 10 unlocks ranked for shippability

| # | Unlock | Phase | Complexity | Shippable in Next+FM+Tailwind? |
|---|---|---|---|---|
| 1 | Hero pupil-gaze | P2c.1 | 3/10 | yes |
| 2 | Theater-mode `layoutId` | P2c.2 | 4/10 | yes |
| 3 | Time-aware atmosphere | P2c.3 | 5/10 | yes |
| 4 | Living chalkboard canvas | P2c+ | 7/10 | yes, but adds a canvas dep |
| 5 | Harmonic scroll Web Audio | defer | 6/10 | yes, but privacy + autoplay issues |
| 6 | Memory-verse Tetris stack | P2c+ | 6/10 | yes |
| 7 | Parent curriculum peek | P3 | 7/10 | yes |
| 8 | Interactive lyrics karaoke | P2c.4 | 6/10 | needs LRC/VTT files; content dependency |
| 9 | Easter-egg stars | defer | 2/10 | trivial, add as polish |
| 10 | Haptics | P2c+ | 2/10 | trivial, use `navigator.vibrate` |

## Appendix B — things to DELETE, not redesign

- `src/components/home/LatestVideosSection.tsx` (replaced by TodaysEpisode)
- Fake player block in `JoinYouTubeSection.tsx:88-131`
- Fake success/confetti block in `NewsletterSection.tsx:176-245`
- Fabricated "100,000+ families" stat
- "NATURE FIRST" pill in AboutSection
- Duplicate footer newsletter (keep one)
- "Designed by Engaze Digital" footer credit

Deletion IS design work. Cutting these four items is more valuable than adding four new ones.
