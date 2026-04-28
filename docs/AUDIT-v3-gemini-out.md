YOLO mode is enabled. All tool calls will be automatically approved.
YOLO mode is enabled. All tool calls will be automatically approved.
MCP issues detected. Run /mcp list for status.# DEEP HOMEPAGE AUDIT — SELAH KIDS

This isn't an enterprise-grade product yet; it’s a "nice template" trying to mask structural flaws with gratuitous Framer Motion springs. When building for kids and parents (millennials/Gen Z), you are competing with the frictionless magic of Disney+ and the rigorous typographic discipline of Apple. Parents scan for trust and safety; kids react to immediate, tactile delight. Right now, this homepage exhausts the parent and misleads the kid. 

Here is the brutal truth on how to take this from a Dribbble experiment to a world-class platform.

### 1. First-impression failures
The first 800ms dictate if a parent trusts you with their child's brain. 
* **The Fake Loader:** `HomeClient.tsx:34` artificially holds the user hostage with a random `setInterval` just to show off an animation. A 3-year-old doesn't care about your "enterprise real loading curve." Never block time-to-value with fake progress.
* **The Blog Progress Bar:** `HomeClient.tsx:162` places a reading progress bar at the top of the screen. This is a media/entertainment app, not a Medium article. It ruins cinematic immersion.
* **Pixelated LCP:** `HeroSection.tsx:254` sets `quality={50}` on the massive hero background. The first texture the user sees is compressed JPEG artifacts, instantly killing the "premium" vibe.
* **GPU-Thrashing Blurs:** `HeroSection.tsx:232-237` stacks six overlapping `blur-[100px]` gradient divs. Before the user even reads the headline, their phone's GPU is screaming.
* **Over-engineered Parallax:** `HeroSection.tsx:210` boasts "ULTRA-PREMIUM 3D TRACKING" but it’s just tying `rotateX/Y` to mouse coordinates. On mobile, this does nothing; on desktop, it makes the UI feel slippery rather than grounded.

### 2. Motion + smoothness
You are confusing "movement" with "emotion." Good motion directs the eye; bad motion induces motion sickness.
* **Frame-Dropping Blurs:** `HomeClient.tsx:112` animates `filter: "blur(15px)"` alongside scale and opacity. Animating CSS filters is a notorious performance killer on mobile WebKit.
* **Missing Reduced Motion:** You have zero `useReducedMotion` hooks. You are forcing constant infinite looping springs on users who may have vestibular disorders.
* **Runaway Carousel:** `TestimonialsSection.tsx:1016` runs an infinite 40s linear pan but fails to pause on hover/focus. Parents literally cannot read a testimonial before it slides away.
* **Hover State Chaos:** `AboutSection.tsx:517` makes feature cards scale, rotate, and shift X simultaneously on hover. It feels like an amusement park ride breaking down.
* **Main-Thread Abuse:** `NewsletterSection.tsx:1223` uses `repeating-conic-gradient` with an infinite CSS spin. If this isn't hardware-accelerated, it will drain laptop batteries just by being open.

### 3. Typography + hierarchy
The typography feels CMS-generated rather than art-directed.
* **Shattered Headlines:** `HeroSection.tsx:294` splits the main headline word-by-word and bounces them in. It destroys legibility and rhythm. Kids can't read it, and parents won't wait for it.
* **Generic Copy:** "Why Selah Kids?" and "Our Latest Videos" are placeholder copy. Headlines must do heavy lifting (e.g., "Screen Time You Can Actually Trust").
* **Dangerous Line Heights:** `WhyChooseSection.tsx:644` uses `leading-[1.05]` on a responsive H2. On certain viewports, descenders will crash directly into ascenders.
* **Straight Quotes:** `TestimonialsSection.tsx:1043` uses straight quotes (`"`) instead of typographic curly quotes (`“ ”`). This is a dead giveaway of amateur typesetting.
* **Weak Button Labels:** `HeroSection.tsx:327` "Our Story" is a generic secondary CTA. It should be "For Parents" or "Our Mission."

### 4. Color + atmosphere
The color palette is currently "candy store explosion." It lacks the depth and safety of a premium brand.
* **Contrast Failures:** `JoinYouTubeSection.tsx:1096` puts white text over a gradient of `#FF7F50` to yellow. This explicitly fails WCAG AA contrast for parents trying to read while holding a squirming toddler.
* **The Noise Filter Trap:** `WhyChooseSection.tsx:624` uses an SVG `<feTurbulence>` filter for texture. This is a massive render-blocking operation on low-end Android devices. Use a pre-rendered optimized PNG noise overlay instead.
* **Cheap Badges:** The "Premium Pill Badge" (`HeroSection.tsx:283`) claims to be premium but uses a heavy border, a shadow, and an animated skew shine. Pick one. Glassmorphism plus heavy borders looks muddy.
* **Atmospheric Depth:** Everything relies on generic Tailwind drop-shadows. Real depth requires directional lighting and color-cast shadows, not just `rgba(0,0,0,0.1)`.
* **Saturated Fatigue:** There is no "rest" color. Every section introduces a new pastel or neon background. Introduce deep, calm navy or rich forest green to anchor the brights.

### 5. Layout + pace
The page lacks a cinematic scroll narrative; it feels like stacked blocks.
* **The Dead Zone:** The transition between `HeroSection` and `TodaysEpisode.tsx:406` abruptly cuts from an immersive 3D scene to a flat, generic flex-row layout. 
* **Cramped Testimonials:** The `gap-8` on `TestimonialsSection.tsx:1016` isn't enough horizontal whitespace to let individual reviews breathe. They bleed into a wall of text.
* **Repetitive Pacing:** `JoinYouTubeSection` and `NewsletterSection` are stacked back-to-back. Both are heavy, colorful, full-width blocks with a left/center text block and a primary CTA. The user suffers from CTA fatigue.

### 6. Creative direction — brand soul
Right now, the brand soul is "Generic Christian Cocomelon." You need a sharper point of view.
* **Brave Move 1: The Tactile World.** Stop using digital vector gradients. Lean into a "Sunday School Craft" aesthetic—felt textures, paper cutouts, claymation lighting. Make it feel physical.
* **Brave Move 2: Dual-Mode Architecture.** Design the UI to shift contexts. A giant, swipeable "Kids Mode" that locks the screen to video playback, and a dense, informative "Parents Mode" with theology breakdowns and screen-time stats.
* **Brave Move 3: Silent Autoplay.** Instead of static thumbnails, hovering over a video card should seamlessly scrub a silent video preview with beautiful kinetic typography displaying the lyrics.

### 7. Functional dead ends
Never lie to the user's cursor.
* **The Fake Player:** `JoinYouTubeSection.tsx:1126` draws a meticulously fake video player complete with a progress bar and play button. Clicking it just opens a new YouTube tab. This is a bait-and-switch that instantly erodes trust.
* **Unclickable Cards:** `AboutSection.tsx:520` gives feature cards a `role="button"`, a `tabIndex`, and intense hover physics, but no `onClick` handler exists. It's a literal dead end.
* **Deceptive Hitboxes:** The social links in `HeroSection.tsx:340` have massive invisible hitboxes due to padding, but the visual targets are tiny icons.
* **Placebo Forms:** `NewsletterSection.tsx:1264` accepts an email and instantly triggers a success confetti state without an actual API call. 

### 8. Performance + accessibility
* **LCP Sabotage:** As noted, `quality={50}` on the hero image and fake loading delays hurt your Core Web Vitals heavily.
* **SVG Turbulence:** The `feTurbulence` noise filter will cause severe scrolling jank on mobile.
* **Unlabeled External Links:** Your YouTube out-links open in `_blank` but lack screen-reader text warning users that a new window is opening.
* **Missing Focus Rings:** Your custom `ui-button` classes override default focus states, and I see no custom `:focus-visible` outlines defined in the component props. Keyboard users are flying blind.
* **Reduced Motion:** Frame-heavy animations like the confetti (`NewsletterSection.tsx:1298`) must be wrapped in `if (!shouldReduceMotion)`.

### 9. Unlocks — 10 ambitious moves
To take this from 7.5/10 to 9.5/10, build these:

1. **The Hero Gaze:** Tie Shiloh/Andy’s pupil coordinates to the mouse/gyroscope. They don't just tilt; they actively look at what the user is doing.
2. **Theater Mode Expansion:** When clicking a video in `LatestVideosSection`, use Framer Motion's `layoutId` to seamlessly expand the thumbnail to fill the entire viewport, instantly transitioning into a custom player without a page load.
3. **Time-Aware Atmosphere:** If the user loads the site after 6 PM, shift the CSS variables from "Morning Sun" to "Nightlight." Swap upbeat videos for sleep-stories and lullabies automatically.
4. **Living Chalkboard:** Make a section background an actual HTML5 canvas where kids can drag their finger to draw chalk trails while the parent reads the copy above it.
5. **Harmonic Scroll:** Map the scroll position to an invisible Web Audio API synth. As the user scrolls down the page, it plays a soft, ambient, perfectly tuned C-major chord progression.
6. **The Memory Verse Builder:** As you scroll through the `CharactersSection`, typographic blocks physically fall from the top of the screen and stack up to form the memory verse of the week.
7. **Parent's ROI Dashboard:** Replace the generic "Newsletter" with a "Curriculum Peek." Let parents type their child's age, and instantly animate a personalized 4-week viewing curriculum.
8. **Interactive Lyrics:** On the `TodaysEpisode` card, show a synchronized, karaoke-style bouncing ball over the lyrics of the current song playing silently in the background.
9. **Easter Egg Hunt:** Hide 3 tiny glowing stars across the homepage. If a kid taps all 3, the entire UI temporarily bursts into a celebratory confetti mode with a special hidden video link.
10. **Tactile Haptics:** (For mobile) Trigger the `navigator.vibrate()` API with tiny, subtle clicks that match the physics of the Framer Motion spring bounces when expanding cards.

### 10. Verdict
**Current craft score: 4.5/10.** 
*Ship-blockers: 4 (Fake loading gate, SVG filter performance cliff, fake video player bait-and-switch, missing reduced-motion accessibility).* Remove the gimmicks, respect the parent's time, and elevate the tactile delight for the child.
