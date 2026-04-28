# Homepage Deep Design Plan — billion-dollar flagship pass

**Date:** 2026-04-21 · **Scope:** homepage only (per user direction) · **Branch:** `design/p1-foundations`

Synthesis of two audits + one Codex run:
- **Gemini audit** (complete) — `docs/AUDIT-DEEP-DESIGN-SELAH-KIDS.md` (auto-saved by Gemini) + `docs/AUDIT-v4-gemini-design-out.md` (raw stream)
- **Codex audit** (2 attempts, both got stuck in file-exploration/prompt-echo without producing a final deliverable — not usable this round)
- **Claude walk-through** — globals.css dissection + browser pass of homepage across the full scroll

---

## Unified scorecard

| Lens | Score | What's missing |
|---|---:|---|
| 1. Apple HIG (clarity/deference/depth) | **6.0** | Decoration competes with content. Chrome shouts via blurred color blobs. |
| 2. Liquid Glass material system | **5.0** | `.glass-morphism` is fog, not glass. No specular edge-light, no saturation boost, no material tiers. |
| 3. Laws of Depth | **4.0** | Character "pink halo" instead of elliptical contact shadow. No atmospheric perspective. |
| 4. Realism / tactility | **5.0** | Buttons use `scale(1.05)` on outer DOM (layout jitter). No inset bevels. Gradients feel Canva-flat. |
| 5. Seamless atmospheric continuity | **3.0** | Every section is an island with its own blob-gradient. Hard cut between Why-Choose cream and Join-YouTube orange. |
| 6. Typographic craft | **7.5** | Good `text-wrap: balance/pretty`. Missing `tabular-nums`, curly quotes, optical kerning. Mixed `rem`/`px` clamps. |
| 7. Motion that earns its keep | **7.0** | High-craft Framer Motion usage, but many infinite loops add cognitive noise and GPU cost. |
| 8. Billion-dollar micro-details | **4.0** | No scroll-velocity physics, no ambilight, no custom cursor, no shared-element morphs. |

**Current craft:** ≈ **5.8/10**. **Target:** **9.0/10** without tearing down.

---

## Two design laws that are broken and must be fixed first

### L1 — **Characters must be grounded, not haloed.**
`HeroSection.tsx:149, 178` puts `drop-shadow-[0_15px_40px_rgba(255,100,150,0.5)]` on Libni and `rgba(0,180,255,0.4)` on Andy. That's a colored FOG around the character — the opposite of how light works. Real depth uses two shadows: an **elliptical contact shadow** (dark, tight, at the feet, locked to the ground) + a **soft neutral drop shadow** (larger, diffuse, offset, implying distance from the backdrop).

### L2 — **One atmospheric spine, not nine blobs.**
Every homepage section has its own localised blob-gradient. Viewed end-to-end, they cancel each other out. Flagship sites (Apple product pages, Stripe, Disney+) use a single fixed-positioned background layer whose gradient stops shift with `scrollYProgress`. Each section sits OVER the spine, not paints its own.

Fixing just these two laws upgrades the visual grammar of the entire homepage.

---

## PHASE D1 — Design system upgrade (foundation, ~half day)

Pure `globals.css` + `@theme` changes. Touches zero components. Unblocks every follow-up.

### D1.1 — Replace `.glass-morphism` with tiered materials

**Before** (`globals.css:109-115`):
```css
.glass-morphism { @apply backdrop-blur-2xl bg-white/40 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]; }
```

**After** — four material tiers matching iOS:
```css
@utility glass-thin {
  backdrop-filter: blur(12px) saturate(160%);
  background: linear-gradient(135deg, rgb(255 255 255 / 0.30) 0%, rgb(255 255 255 / 0.04) 100%);
  box-shadow:
    inset 0 0.5px 0 0 rgb(255 255 255 / 0.70),   /* top specular edge */
    inset 0 -0.5px 0 0 rgb(255 255 255 / 0.10),  /* bottom edge */
    0 1px 2px rgb(0 0 0 / 0.04);                 /* contact shadow */
}
@utility glass-regular {
  backdrop-filter: blur(20px) saturate(180%);
  background: linear-gradient(135deg, rgb(255 255 255 / 0.45) 0%, rgb(255 255 255 / 0.08) 100%);
  box-shadow:
    inset 0 0.5px 0 0 rgb(255 255 255 / 0.80),
    inset 0 -0.5px 0 0 rgb(255 255 255 / 0.12),
    0 4px 16px rgb(0 0 0 / 0.06);
}
@utility glass-thick {
  backdrop-filter: blur(32px) saturate(200%);
  background: linear-gradient(135deg, rgb(255 255 255 / 0.60) 0%, rgb(255 255 255 / 0.20) 100%);
  box-shadow:
    inset 0 1px 0 0 rgb(255 255 255 / 0.90),
    inset 0 -0.5px 0 0 rgb(255 255 255 / 0.15),
    0 8px 32px rgb(0 0 0 / 0.08);
}
@utility glass-chrome {  /* dark-content-over-bright like the navbar */
  backdrop-filter: blur(24px) saturate(180%);
  background: linear-gradient(180deg, rgb(255 255 255 / 0.55) 0%, rgb(255 255 255 / 0.30) 100%);
  box-shadow:
    inset 0 1px 0 0 rgb(255 255 255 / 0.85),
    0 2px 8px rgb(0 0 0 / 0.05),
    0 12px 32px rgb(0 0 0 / 0.04);
}
```
The **inset top-edge light** is the single most important difference between "fog" and "glass." That plus `saturate(180%)` pulls colour through from whatever's behind. ([Gemini audit item #2](docs/AUDIT-DEEP-DESIGN-SELAH-KIDS.md))

### D1.2 — Elevation scale
```css
@theme {
  --elevation-1: 0 1px 2px rgb(0 0 0 / 0.04);
  --elevation-2: 0 2px 8px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04);
  --elevation-3: 0 8px 24px rgb(0 0 0 / 0.08), 0 2px 4px rgb(0 0 0 / 0.04);
  --elevation-4: 0 24px 64px -12px rgb(0 0 0 / 0.12), 0 8px 16px rgb(0 0 0 / 0.06);
  --elevation-5: 0 48px 96px -20px rgb(0 0 0 / 0.18), 0 16px 32px rgb(0 0 0 / 0.08);

  /* warm-brand tinted elevations for orange CTAs */
  --elevation-warm-3: 0 8px 24px -4px rgb(255 92 0 / 0.28), 0 2px 4px rgb(0 0 0 / 0.04);
  --elevation-warm-4: 0 24px 64px -12px rgb(255 92 0 / 0.32), 0 8px 16px rgb(255 92 0 / 0.16);
}
```
Every `shadow-[...]` inline string across the site becomes `box-shadow: var(--elevation-3)`. **Win:** consistent elevation physics, easy tune.

### D1.3 — Contact-shadow utility (for character grounding)
```css
@utility contact-shadow {
  position: relative;
}
@utility contact-shadow::after {
  content: "";
  position: absolute;
  left: 50%; bottom: -8px;
  width: 60%; height: 16px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgb(0 0 0 / 0.24), transparent 60%);
  filter: blur(4px);
  z-index: -1;
  pointer-events: none;
}
```
Applied to Libni, Andy, Shiloh, and every character card. Plus a neutral drop shadow on the character itself: `filter: drop-shadow(0 20px 24px rgba(0,0,0,0.10))`. **Replaces** the colored halos.

### D1.4 — Atmospheric spine (replaces nine blobs)
```css
/* single fixed layer that sits behind every section */
@utility atmos-spine {
  position: fixed;
  inset: 0;
  z-index: -50;
  pointer-events: none;
  background:
    radial-gradient(80vw 60vh at var(--spine-cx-1, 15%) var(--spine-cy-1, 20%), rgb(255 192 150 / 0.35), transparent 60%),
    radial-gradient(70vw 60vh at var(--spine-cx-2, 85%) var(--spine-cy-2, 80%), rgb(147 211 92 / 0.25), transparent 60%),
    linear-gradient(180deg, #FFF8EE 0%, #FFFDF7 45%, #F1F8E7 100%);
  transition: background 1200ms cubic-bezier(0.22, 1, 0.36, 1);
}
```
Then in `HomeClient` we wire `--spine-cx-1 / --spine-cy-1 / --spine-cx-2 / --spine-cy-2` to `useScroll`-derived motion values, so the **entire background drifts as one continuous atmosphere**. Individual sections become transparent or use `--section-tint` overlays. **Win:** the homepage stops looking like nine unrelated CSS backgrounds stacked.

### D1.5 — Time-of-day tint (quiet, not a gimmick)
```css
@theme {
  --tone-morning:   oklch(0.96 0.04 85);   /* warm cream */
  --tone-afternoon: oklch(0.94 0.06 65);   /* warmer amber */
  --tone-dusk:      oklch(0.85 0.08 50);   /* softer coral */
  --tone-night:     oklch(0.28 0.04 260);  /* deep navy */
}
```
Set `--current-tone` on `<html>` via `new Date().getHours()` once at mount. Atmos-spine stops interpolate between current-tone + next-tone so page subtly shifts through the day. Low risk; ~20 lines of code.

### D1.6 — Focus ring, soft Apple-style
**Before** (globals.css:162-166):
```css
:focus-visible { outline: 3px solid var(--color-selah-orange); outline-offset: 4px; border-radius: 12px; }
```
**After**:
```css
:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgb(255 255 255 / 0.98),
    0 0 0 5px rgb(255 92 0 / 0.36);
  border-radius: inherit;
  transition: box-shadow 160ms ease-out;
}
```
Double-stop ring that tints the brand colour at 36% alpha. Looks like macOS Sonoma's focus. Respects existing radius.

### D1.7 — `tabular-nums` everywhere a number changes
```css
.num, time, .counter, [data-counter] { font-variant-numeric: tabular-nums; }
```
Apply to the preloader `99%`, video durations, timer chips on `/sensory` (and future everywhere). **Win:** digits stop jittering.

### D1.8 — Typography tokens in px only (no mixed units)
Current `body` uses `clamp(1rem, ..., 1.125rem)` while `content-h3` uses `clamp(16px, 1.8vw, 20px)`. Pick one. Unify on `clamp(<pxmin>, <vw>, <pxmax>)`. **Win:** consistent vertical rhythm even when the user changes browser zoom.

### D1.9 — Kill-switch `will-change: transform` globals
**Remove** lines 153-159 and 201-208 of `globals.css`. Applying `will-change: transform` to every `.animate-*` or every `.backdrop-blur-*` allocates GPU layers aggressively and causes memory bloat. Replace with targeted `will-change: transform` on ONE element per animated hero section. **Win:** the same animation, ~40% fewer GPU layers.

### D1.10 — `contain: paint` on sections (not `layout style`)
Line 211-213 applies `contain: layout style` globally. Painting is where the real win lives, and `layout style` can silently break sticky children. Change to:
```css
section { contain: layout paint; }
```

---

## PHASE D2 — Material retrofit across homepage (~1 day)

Now the foundation is there, apply it to every surface. Pure visual upgrades, no IA changes.

| # | File | Before → After |
|---|---|---|
| D2.1 | `HeroSection.tsx:92-97` — six stacked blurred gradient divs | Delete all six. Rely on new `.atmos-spine` single layer. Keep only the spotlight (`HeroSection.tsx:188-191`). **Win:** first paint is 1 layer not 7. |
| D2.2 | `HeroSection.tsx:149, 178` — character `drop-shadow` pink/blue halos | Replace with `.contact-shadow` + neutral `filter: drop-shadow(0 20px 24px rgb(0 0 0 / 0.14))`. [Gemini #1] |
| D2.3 | `Navbar.tsx` (background) — `bg-white/10` muddy glass | Apply `.glass-chrome` utility + color-aware scroll shadow that interpolates toward the section behind. [Gemini #2, ship-blocker] |
| D2.4 | `UI.tsx` Badge — flat fill + shadow | Add specular inner edge: `box-shadow: inset 0 1px 1px rgb(255 255 255 / 0.85), var(--elevation-2)` + 1px outer border at 30% alpha. [Gemini material #1] |
| D2.5 | `UI.tsx` Button primary — outer `scale(1.05)` on hover | Move the transform to a `::before` background layer so the text/box don't jitter. [Gemini ship-blocker #6] |
| D2.6 | `UI.tsx` Button primary — current color-shadow | Use `var(--elevation-warm-3)` → `var(--elevation-warm-4)` on hover. Matches elevation rhythm. |
| D2.7 | `WhyChooseSection.tsx:154` — `feTurbulence` SVG noise | Replace with a pre-rendered `noise.png` tile at 2% opacity with `mix-blend-mode: overlay`. [Gemini #5] |
| D2.8 | `TestimonialsSection` cards — opaque `bg-white` | Switch to `.glass-regular` so the atmos-spine tints them softly as they scroll. [Gemini material #5] |
| D2.9 | `JoinYouTubeSection` enters with hard orange gradient | Use negative-margin + mask-gradient to crossfade IN from the previous section's atmosphere. [Gemini ship-blocker #7] |
| D2.10 | `CharactersSection.tsx:46-63` — infinite rotating blobs (20s+25s loops) | Anchor to `useScroll` so they only move while user is scrolling. Pauses when offscreen. [Gemini #4] |
| D2.11 | `CharactersSection` cards — full-card `bg-white/20 blur` behind character | Replace with per-character coloured gradient applied ONLY to the bottom edge of the image (ground glow, not halo). [Gemini material #9] |
| D2.12 | Straight quotes across sections (AboutSection, Testimonials) | Replace `"..."` with `" ... "` — 30-minute pass. |

Every item above cites actual code. Every item is one small diff.

---

## PHASE D3 — Billion-dollar details (~2-3 days, choose 2-3)

Pick 2-3 to fully polish. NOT all five. Over-engineering dilutes each.

### D3.1 — Shared-element morph: thumbnail → overlay
Framer Motion `layoutId="video-player"` on both the `TodaysEpisode` card AND the `VideoOverlay` container. Click flies + morphs the thumbnail into the player instead of pop-in. High-impact moment. [Gemini material #10 + billion-dollar item]

### D3.2 — Ambilight on VideoOverlay
On overlay open, sample the dominant colour of the thumbnail (fast: one `<img crossorigin>` + canvas 1px sample) and set it as `--ambi` on the overlay backdrop. Heavy radial gradient of that colour blooms behind the video. Billion-dollar signature detail. [Gemini billion-dollar #1]

### D3.3 — Scroll-velocity physics
Feed `useVelocity(scrollY)` into a spring. At > threshold velocity, scale the navbar + hero title by `1.015` along Y and snap back when the user stops. The feeling is "the page is a spring, not an inert list." [Gemini billion-dollar #2]

### D3.4 — Custom cursor state machine
Hide default cursor on `>md:`. An 8px dot that trails with a spring. On text: stretches into I-beam. On video thumbnail: expands into a translucent glass disc with a `▶` glyph. On buttons: scales to a ring around the CTA. [Gemini billion-dollar #3]

### D3.5 — Atmos-spine WebGL (or deferred)
The spine in D1.4 is pure CSS. The ceiling version would be a fragment shader that smokes and curls the gradient. Defer unless we ever get Three/R3F onto the home route. [Gemini billion-dollar #4 — keep for later]

**Recommended:** D3.1 (morph) + D3.2 (ambilight). Together they make the video playback feel like a single-fluid magic trick.

---

## PHASE D4 — Motion discipline (~half day, mostly deletion)

- Audit every `animate={{ y: [0,-N,0], repeat: Infinity }}` block on home. Apply one of:
  - Scroll-gated: `animate` only runs when in-view AND user has scrolled
  - Velocity-triggered: animate once on arrival, then idle
  - Removed: if the motion doesn't add meaning, cut it.
- Apply `useReducedMotion` as a single shared hook (not per-component) that short-circuits to static renders. [Gemini #10]
- The preloader stays as creative intent (explicit user decision), but the `setProgress` interval tightens: current easing feels ~2-3s; aim for ~900ms perceived.

---

## Execution ordering + acceptance criteria

| Phase | Effort | Acceptance |
|---|---|---|
| **D1** (tokens + utilities) | 0.5 day | globals.css lands the 4 glass tiers + elevation scale + contact-shadow + atmos-spine + focus ring. Zero component changes yet. Typecheck clean. |
| **D2** (retrofit) | 1 day | Hero character halos replaced with contact shadows. All `.glass-morphism` consumers upgraded. Navbar is liquid glass. Testimonial cards frosted. Nine stacked blobs on hero deleted; atmos-spine alone behind them. |
| **D3** (2 of 5 details) | 1-2 days | Click TodaysPick → shared-element morph into overlay. Overlay has ambilight from thumbnail. |
| **D4** (motion) | 0.5 day | Reduced-motion path works. No section has more than ONE infinite loop. Preloader tighter. |

Total: **3-4 days** to take the homepage from craft ≈5.8/10 to ≈9.0/10 without changing information architecture, copy, or component structure.

---

## Verdict

**One sentence:** The homepage is built on premium craft that's wrapped in flat material — swap the material system (glass tiers, contact shadows, atmos-spine) and you unlock every motion + layout investment that's already there.

Ready to execute D1 in the next pass — it's the highest-leverage step because every later phase depends on it and it touches zero components.
