# Selah Kids — World-Class Design Plan
*Triad audit: Codex (architect), Gemini (creative director), Claude (browser walkthrough).*
*Current visual maturity: 4.2 / 10 vs top-5% landing pages. Target: 9.0 / 10.*

---

## Where All Three Reviewers Agreed (root causes)

| # | Root cause | Codex flag | Gemini framing | Claude (visual) |
|---|-----------|------------|----------------|-----------------|
| 1 | **Hero overload** | 6 color washes + parallax + shimmer + glow all firing at once `HeroSection.tsx:89` | "Photon Bomb — light everywhere destroys shadow, no shadow = no depth" | Characters scattered L-and-center; 40% of viewport is dead space on the right |
| 2 | **Monoculture typography** | Fredoka is display, UI, nav, buttons, body — all one loud voice `globals.css:276` | "Play-Doh scaffolding — marshmallow load-bearing wall" | Every page reads at same voice weight; trust surfaces (parents/donate/legal) feel childish |
| 3 | **Fake trust theater** | picsum avatars in Newsletter, fake 100K+ claim, unverified testimonials | "Biomimetic rejection — uncanny-valley community triggers distrust" | Avatar stack on newsletter is visibly generic |
| 4 | **Fake functionality** | Contact form = `setTimeout` fake success; Resources download = `localStorage` gate | "Newtonian Void — action without real reaction breeds instant distrust" | Form submit shows success, nothing actually sent |
| 5 | **Broken promises** | `ParentsTrustBadges` imported but not rendered; `DonateImpact` imported but not rendered; `selah-blue` token referenced but undefined | "Vaporware promise — promised gravity, delivered vacuum" | /donate shows only hero+card; /parents is very thin |
| 6 | **Motion used as decoration, not communication** | Perpetual float/shimmer/ripple on nearly every element | "Parallax nausea — when everything moves, nothing matters" | Every screenshot shows at least 3 looping animations |
| 7 | **Asset-system immaturity** | JPG logo, `quality={50}` hero, intentionally blurred printable previews, cutout PNG characters w/ no unified render system | "Plastic bag in the stream — rasterized opaque bounding box" | Logo renders as bitmap rainbow; printable thumbnails look low-quality before download |
| 8 | **IA thinness** | `/music` = 4 platform links; `/blog` has no category UI rendered; `/parents` is just hero+accordion+community | — | Confirmed on browser walkthrough |

---

## Tier 1 — Show-stoppers (ship in 2 weeks, no debate)

1. **Delete the 2.3s fake loader** (`HomeClient.tsx:23-61`). Marketing pages don't fake-load. Replace with instant content.
2. **Remove the 600 ms nav delay theatre** (`Navbar.tsx:44-70`). Use native `next/link`.
3. **Define or remove `selah-blue`** — currently referenced 4× but undefined in `globals.css:17`.
4. **Render `ParentsTrustBadges`** (imported, unused in `parents/page.tsx`).
5. **Render `DonateImpact`** on `/donate` (exists, not used).
6. **Replace `picsum.photos` avatars** (`NewsletterSection.tsx:175`, `JoinYouTubeSection.tsx:82`) with real parent photos or delete the stack.
7. **Wire contact form to Resend/Loops** — or replace with a static "Email us at info.selahkids@gmail.com" card until wired. Faking success is the single most damaging trust signal.
8. **Replace JPG logo with SVG** (`Navbar.tsx:92`, `Footer.tsx:37`).
9. **Drop vanity specs "4K / 60 FPS"** (`AboutBentoGrid.tsx:161`) — not credible on a kids-worship site. Replace with: "Every song theology-reviewed", "Bilingual (EN / ES) production", "Built by parents".
10. **Render `BlogCategories`** on `/blog/page.tsx:20`.

---

## Tier 2 — Design system v1 (3 weeks)

**A. Typography — introduce a calm utility stack**
- Keep **Fredoka** for display H1/H2 only (hero titles, section openers).
- Add **Inter** or **General Sans** for UI chrome, nav, buttons, forms, card titles, legal.
- Add **Source Serif** or **Fraunces** for editorial (blog body, devotionals) — serifs earn trust for parent/adult content.
- Collapse type scale to 6 steps: 12 / 14 / 16 / 20 / 28 / 44.

**B. Button primitive — strip to 1 shadow, 1 hover, 1 icon motion** (`UI.tsx:18`). Magnetic + ripple + shimmer + glow + scale + wobble all together is 6 fighting physics models. Stripe has 1.

**C. Shadow physics — one light source, one decay model**
- Tier A (2dp) cards: `0 1px 2px -1px rgba(0,0,0,.08), 0 1px 4px -1px rgba(0,0,0,.04)`
- Tier B (8dp) modals/hero: `0 8px 24px -8px rgba(0,0,0,.14), 0 2px 6px -2px rgba(0,0,0,.05)`
- Replace 27 ad-hoc shadows across the codebase.

**D. Radius system** — `--r-sm: 8px / --r-md: 16px / --r-lg: 24px / --r-xl: 40px`. Kill `rounded-[2.5rem]` in favor of tokens.

**E. Spacing rhythm** — adopt 8-point grid. Delete `mt-[-2.5rem]` (`AboutSection.tsx:103`) and similar fix-ups.

**F. Motion budget** — cut animations by ≥50 %. Motion communicates state (arrival, response, change), not ambience.

**G. Image pipeline** — force AVIF/WebP + blur-up + `srcSet`. Bump hero/character `quality` from 50/60 → 85. Remove the `blur-md` on `ResourceCard.tsx:105` — previews should look pristine.

---

## Tier 3 — Rebuild the Hero (the single highest-leverage change)

**Codex verdict:** "ONE thing that would most change perception — rebuild the hero."
**Gemini verdict:** "Material refraction, single divine light source."
**Claude verdict:** The right 50% of the viewport is empty.

**New hero brief:**
- **One cinematic scene**: all three characters Andy/Libni/Shiloh composed into a single tableau — morning light, soft fabric backdrop, contact shadows grounded on a visible surface plane. Shot like *apple.com/vision-pro* heroes.
- **One typography voice**: Fredoka display title ("Faith-filled music for little ones"), Inter supporting line, restrained badge.
- **Two CTAs**: Watch Now (orange primary, icon), Our Story (ghost outline). No "Available on" stub.
- **Mouse-light interaction only** (a single soft parallax follow), not six competing effects.
- **Mobile-first**: character tableau scales without breaking composition.

---

## Tier 4 — Turn /parents into the trust conversion hub

This is the page every parent checks before subscribing. Today it has 4 sections. It should have 10.

1. Hero — existing ("Built for Kids, Trusted by Parents") **with real photography, not stock**.
2. Render `ParentsTrustBadges` (ad-free, no tracking, theology-reviewed, screen-free alternatives).
3. **New — "What we never do" panel**: no autoplay loops, no scary imagery, no data sold, no in-app purchases, no ads. Plain-English.
4. Founder note + photo — **surface the pediatric speech-language therapist credential** that Codex spotted buried in `TeamSection.tsx:7`. This is a trust superpower.
5. **Safety-principle card set** — 5 principles with icon + 15-word description.
6. FAQ accordion — already exists, expand to 12 entries (screen time, ad-free status, pricing, COPPA, offline usage, sensory-friendly mode, language mix, Sunday-school usage license).
7. **Real parent testimonials** — name, city, church role, child's age, 2-line quote. No avatar stack unless real.
8. "Use in Sunday school" CTA — unlocks the ministry partnership loop.
9. Press mentions (if any) or "Featured in / trusted by" (real churches/ministries).
10. Newsletter signup — same pattern as home but with parent-specific copy.

---

## Tier 5 — IA resolution

- **/music** — fold into `/watch` as a "Stream on your favorite platform" subsection OR expand to a real release page (latest release art, play in-browser, lyrics, bible-verse pairing). Currently it's a dead-end.
- **/blog** — render `BlogCategories` + add search; 2026 dates are fine (they're intentional, keep), but the visual design needs an editorial upgrade (serif body, drop caps, citation blocks).
- **/watch** — hero has 400 vertical px of empty space. Add "Language toggle (EN/ES/bilingual)" as first-class chip row instead of the bottom "Switch to Spanish" emoji banner.
- **Navbar** — reduce from 7 items to 4 primary + "More" flyout: **Watch / For Parents / Resources / Donate**. Move About/Characters/Blog/Music into a disclosure.
- **Remove emoji flags** as language toggle — use plain `EN · ES` pill. Flag emojis are an amateur tell (the browser will render them differently on every OS).

---

## Tier 6 — Creative unlocks (Gemini's contribution — pick 3 for v1)

Ranked by (impact × feasibility × brand fit):

| Rank | Idea | What it is | Why it's right |
|------|------|------------|----------------|
| **🥇** | **Family Blessing Bridge** | Grandparents / deployed parents record 10s voice blessings; child taps a "family stone" to hear before each lesson. | Screens usually isolate — this makes the screen a village. Creates emotional lock-in no secular app can replicate. **This is Selah's defensible moat.** |
| 🥈 | **Quiet Time dimmer** | Physical slider globally slows animation, desaturates colors to pastels, low-passes audio. Gated to bedtime window. | Solves the *actual* parent pain (bedtime battles). Turns the site from stimulant into sleep-aid. |
| 🥉 | **Psalm-Sync color engine** | Daily scripture drives global CSS tokens. Morning star → dawn pinks. Still waters → deep aqua. | Easy engineering (cron-refreshed CSS var payload), high emotional lift. Site "breathes with the Word." |
| 4 | **Diegetic worship soundscape** | UI hovers/clicks emit softly recorded instruments tuned to C-major; clicks harmonize. Opt-in, volume-controlled. | Turns navigation into a worship act. Nobody else does this. |
| 5 | **IK companion character** | Rigged 2D Shiloh follows cursor, braces on fast scroll, "prays" on idle. Rive runtime. | Warmth without constant spectacle. Replaces the current float-everywhere noise. |
| 6 | **3D foldable craft previews** | `/resources` — spin the finished craft in 3D before downloading the PDF. | Bridges screen → physical family time. |
| 7 | **Prayer wall on /contact** | Submit → message becomes a glowing particle floating into a sky. Real form still fires. | Replaces fake setTimeout with real spiritual metaphor. |
| 8 | **Loaves-and-fishes donation multiplier** | As slider moves, a 3D pile of bibles/meals multiplies via physics. | Makes donation impact tangible instead of abstract dollar. |
| 9 | **Seamless Sunday PWA** | Service Worker pre-caches the week's featured video for church-basement offline use. | Unbeatable reliability for target audience. |
| 10 | **Legal plain-translation hover** | Hover any clause → warm plain-English tooltip. | Earns parent trust in the least-sexy place — multiplies brand goodwill. |

---

## Phased Execution Plan

| Phase | Duration | Scope | Exit criteria |
|-------|----------|-------|---------------|
| **P0 — Truth & Trust** | 1 week | Tier 1 show-stoppers (items 1-10). Real contact form. Delete fake avatars. Render unused sections. Swap JPG logo for SVG. | No fake functionality anywhere. Undefined tokens gone. |
| **P1 — Design System v1** | 3 weeks | Tier 2: type stack, buttons, shadows, radii, spacing, motion cuts, image pipeline. Document in a `design-tokens.md`. | All components import from tokens; motion budget enforced. |
| **P2 — Hero Rebuild** | 1 week | Tier 3: single cinematic hero per spec. Apply same restraint to all page heroes. | Codex + Gemini re-audit the hero → SHIP. |
| **P3 — /parents Trust Hub** | 2 weeks | Tier 4 build-out. Real testimonials collected. Founder story surfaced. | Parent can answer "Is this safe?" in under 30 seconds. |
| **P4 — IA Resolution** | 1 week | Tier 5 — nav reduction, /music redirect or expansion, /blog categories + serif editorial, /watch hero fix. | 4-item primary nav; no dead-end pages. |
| **P5 — Creative Unlocks v1** | 4 weeks | Ship top 3 from Tier 6: Family Blessing Bridge, Quiet Time dimmer, Psalm-Sync colors. | Each feature behind analytics + opt-in. |
| **P6 — Creative Unlocks v2** | 6 weeks | Ship 4-7 (soundscape, IK companion, 3D crafts, Prayer wall). | — |
| **P7 — Continuous polish** | ongoing | Shadow unification, image quality pass, copywriting restraint (remove "enterprise-grade"/"ultra-premium" self-narration from comments), accessibility (WCAG-AA audit), performance (LCP < 2s, CLS < 0.1). | Third-party Lighthouse + axe clean. |

---

## The ONE change that would most elevate perception
**Codex:** Rebuild the hero from scratch.
**Gemini:** Ship the Family Blessing Bridge.
**Claude:** Do both — but ship the trust-fixes first (P0), because no amount of creative brilliance recovers trust once a parent notices a fake submit handler.

**Recommendation:** P0 within 7 days. P2 hero within 14 days. P5 Family Blessing Bridge publicly teased by day 60 as the brand's defining innovation.

---

## Maturity score projection
- **Today:** 4.2 / 10 ("talented team over-decorating")
- **After P0+P1:** 6.5 / 10 ("credible modern kids brand")
- **After P2+P3+P4:** 8.0 / 10 ("sits next to Bluey / PBS Kids")
- **After P5+P6:** 9.0+ / 10 ("category-defining — journalists write about it")
