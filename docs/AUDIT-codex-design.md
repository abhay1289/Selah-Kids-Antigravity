=== TIER 1: SHOW-STOPPERS (makes the site look amateur on first glance) ===

- [src/components/home/HeroSection.tsx:89](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L89) hero is trying to be Apple, Disney, Cocomelon, and Dribbble at the same time: six color washes, spotlight lighting, parallax characters, floating icons, blurred background art, shimmer badges, morphing platform buttons | Apple AirPods and Disney+ heroes pick one dominant visual story and let contrast, scale, and composition do the work | cut the hero to one background scene, one character cluster, one primary CTA, one supporting CTA, and remove 60-70% of the motion layers.

- [src/components/home/HomeClient.tsx:23](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HomeClient.tsx#L23) fake loading screen on a marketing homepage is a trust hit, not a delight; it delays content with invented progress and “burst” theatrics | Apple, Stripe, Vercel, Linear do not make users wait to admire the design team | remove the loader entirely or reduce it to a <300ms brand reveal only if it covers real app initialization.

- [src/app/globals.css:276](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/globals.css#L276) the typography system is fundamentally immature: nearly everything uses Fredoka, including nav, buttons, labels, headings, and many surfaces; this collapses hierarchy into one loud voice | Airbnb, Stripe, Linear, Vercel build hierarchy with serious contrast between display, UI, and reading text | keep Fredoka for selective hero accents only, move UI and most headings to a calmer system, and rebuild type scale with fewer sizes and stronger role separation.

- [src/components/UI.tsx:18](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/UI.tsx#L18) the global button primitive is over-engineered with magnetic movement, ripple, shimmer, glow, hover scale, icon wobble, and spring offsets on every CTA | Stripe and Vercel buttons feel expensive because they are restrained, not because six effects fire at once | strip the button down to 1 state transition, 1 shadow model, and 1 icon motion behavior across the site.

- [src/components/Navbar.tsx:44](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/Navbar.tsx#L44) navigation intercepts clicks, waits 600ms, fires custom events, then scrolls and routes; this is a theater layer on top of basic navigation | Linear and Airbnb nav feels instant and confident | remove artificial delay, use native `Link`, and let motion happen around route change instead of blocking it.

- [src/components/home/NewsletterSection.tsx:175](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/NewsletterSection.tsx#L175) fake social proof using `picsum.photos` avatars is acquisition-due-diligence poison; it signals “placeholder startup theater” immediately | world-class teams never fake proof on a parent-facing trust surface | replace with real families, real names, real quotes, or remove the count entirely.

- [src/app/resources/page.tsx:78](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/resources/page.tsx#L78) resources flow stores `resource: any`, gates downloads with `localStorage`, and simulates a premium funnel without real backend credibility | Stripe, Mercury, Raycast earn friction because the system feels real; fake gating feels manipulative | either make this a real lead-capture flow with consent, privacy copy, and delivery logic, or let resources download directly.

- [src/components/contact/ContactForm.tsx:130](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/contact/ContactForm.tsx#L130) contact form is fake submission UX with timeout-based success | this destroys trust if anyone tries to use it for partnerships, ministry, or press | wire a real endpoint or clearly mark it as coming soon. Right now it performs sincerity without function.

- [src/components/parents/ParentsHero.tsx:24](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/parents/ParentsHero.tsx#L24) “Trusted by Parents” is asserted with no proof right next to a glossy stock/family image | Bluey, PBS Kids, Disney Junior, and Airbnb back reassurance with concrete ecosystem signals | add real trust evidence: founder credentials, child-safety principles, platform counts, ministry partners, or remove the claim.

- [src/components/about/AboutBentoGrid.tsx:161](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/about/AboutBentoGrid.tsx#L161) “4K” and “60 FPS” are presented like premium hardware specs on a kids worship site | Apple can do spec theater because it ships hardware; here it reads insecure and random | replace vanity specs with meaningful proof: production pipeline, theology review, child development input, bilingual production, accessibility considerations.

- [src/components/contact/ContactHero.tsx:17](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/contact/ContactHero.tsx#L17) and [src/components/donate/DonateImpact.tsx:47](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/donate/DonateImpact.tsx#L47) use `text-selah-blue`, but `selah-blue` is not defined in [src/app/globals.css:17](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/globals.css#L17) | this is basic design-system quality control failure | define the token or stop referencing it. A world-class team does not ship phantom color tokens.

- [src/app/parents/page.tsx:8](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/parents/page.tsx#L8) imports `ParentsTrustBadges`, but [src/app/parents/page.tsx:31](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/parents/page.tsx#L31) never renders it | this is a broken content promise on the exact page where trust should be strongest | either render the section or delete it. Dead sections weaken confidence in the team.

=== TIER 2: POLISH GAPS (micro-issues that separate pro from amateur) ===

- Typography hierarchy: [src/app/globals.css:286](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/globals.css#L286), [src/app/globals.css:295](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/globals.css#L295), [src/app/globals.css:341](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/globals.css#L341) make display, content, and UI all variations of the same playful voice. That kills seriousness on parents, donate, legal, and blog pages.

- Spacing rhythm: [src/components/home/AboutSection.tsx:103](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/AboutSection.tsx#L103) uses `mt-[-2.5rem]`, [src/components/about/AboutMarqueeSection.tsx:11](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/about/AboutMarqueeSection.tsx#L11) uses rotated bands, and many sections swing between `py-8`, `py-10`, `py-12`, `py-16`, `py-32` without a consistent cadence. It feels collaged, not composed.

- Color tension: [src/components/home/HeroSection.tsx:92](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L92) to [src/components/home/HeroSection.tsx:97](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L97) adds coral, lime, yellow, pink, cyan, and purple at once. Bluey and PBS Kids are colorful but disciplined; this is noisy.

- Motion curves: [src/components/UI.tsx:120](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/UI.tsx#L120), [src/components/home/TestimonialsSection.tsx:83](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/TestimonialsSection.tsx#L83), [src/components/about/AboutPhotoCarousel.tsx:150](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/about/AboutPhotoCarousel.tsx#L150) create perpetual motion almost everywhere. Linear and Vercel use motion to clarify state; here motion becomes background noise.

- Shadow physics: [src/components/home/LatestVideosSection.tsx:152](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/LatestVideosSection.tsx#L152), [src/components/about/TeamSection.tsx:66](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/about/TeamSection.tsx#L66), [src/components/resources/ResourceCard.tsx:62](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/resources/ResourceCard.tsx#L62) use different shadow models per component. Real-world depth has consistency; this feels plugin-driven.

- Image quality: [src/components/home/HeroSection.tsx:120](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L120) sets hero background `quality={50}`, [src/components/home/HeroSection.tsx:151](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L151) and [src/components/home/HeroSection.tsx:180](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L180) use `quality={60}` on hero characters, and [src/components/resources/ResourceCard.tsx:105](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/resources/ResourceCard.tsx#L105) blurs the asset on purpose. That is the opposite of premium.

- Component inconsistency: pills are rounded-full in some places, rounded-2xl in others, rounded-[2.5rem] elsewhere; compare [src/components/SectionHeader.tsx:60](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/SectionHeader.tsx#L60), [src/components/watch/WatchCategories.tsx:31](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/watch/WatchCategories.tsx#L31), [src/components/contact/ContactSidebar.tsx:15](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/contact/ContactSidebar.tsx#L15). There is style consistency at the aesthetic level, but not at the system level.

- Copy tone mismatch: “enterprise-grade vibrancy,” “ultra-premium,” and “cinematic” comments in code like [src/app/resources/page.tsx:108](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/resources/page.tsx#L108) and [src/components/home/HeroSection.tsx:45](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L45) reveal the design intent is self-conscious. World-class teams do not narrate their aspiration in comments this way.

- Legal page polish: [src/app/terms/page.tsx:27](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/terms/page.tsx#L27) and [src/app/privacy/page.tsx:27](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/privacy/page.tsx#L27) use the same playful visual shell as the marketing pages. For parents and donors, legal pages should feel plain, serious, and trustworthy.

=== TIER 3: DEEP DESIGN (nature/physics-informed elevation opportunities) ===

- Apple’s AirPods pages feel expensive because light behaves consistently. Here, every section invents its own material. Glass, paper, candy gradients, felt-tip colors, giant blur glows, and plastic shadows all coexist. Pick one physical world: warm matte paper + soft sunlight + polished enamel accents would fit this brand.

- Real depth is missing. You have blur and shadow, but not mass. On Apple and Disney+ hero systems, foreground, midground, and background separate cleanly. Here, layers stack but do not create believable spatial hierarchy. Example: [src/components/home/HeroSection.tsx:126](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L126) places characters in 3D, but the text, wash, and background image all compete in the same visual depth band.

- Emotional narrative is absent. The site says “faith-filled” and “safe,” but it does not stage a feeling arc for parents. Apple sells aspiration, Disney+ sells anticipation, Bluey sells warmth, Airbnb sells belonging. Selah Kids should sell “calm, safe, spiritually nourishing family time.” Right now it sells “animated website.”

- There is no silence. Great pages use visual rest as a persuasive device. This site fills almost every section with glows, patterns, blur, float, shimmer, and badges. The brand needs quiet zones where the faith message can breathe.

- The design lacks ritual. For a faith-and-family brand, there should be more cues of rhythm, togetherness, and home life: morning devotion, bedtime calm, family sing-along, Sunday prep. Those are the emotional scenes that turn this from generic kids media to a trusted family habit.

=== TIER 4: IMAGERY & ASSETS ===

- [src/components/Navbar.tsx:92](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/Navbar.tsx#L92) and [src/components/Footer.tsx:37](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/Footer.tsx#L37) use `SK_Logo_FN.jpg`. A logo in JPG is a dead giveaway. Use SVG or at minimum transparent WebP/PNG.

- [src/components/home/HeroSection.tsx:145](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L145), [src/components/home/HeroSection.tsx:174](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L174), and [src/app/characters/page.tsx:65](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/characters/page.tsx#L65) rely on cutout PNG character art. The issue is not PNG itself; it is that the characters are dropped into scenes without a unifying render system, contact shadow logic, or environment response.

- [src/components/resources/ResourceCard.tsx:105](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/resources/ResourceCard.tsx#L105) intentionally blurs the resource preview. That makes downloadable assets feel low-quality before the user even clicks.

- [src/components/home/NewsletterSection.tsx:175](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/NewsletterSection.tsx#L175) and [src/components/home/JoinYouTubeSection.tsx:82](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/JoinYouTubeSection.tsx#L82) use random avatar generators. Replace with real parent-child photography or remove the avatar stack entirely.

- [src/components/about/AboutPhotoCarousel.tsx:9](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/about/AboutPhotoCarousel.tsx#L9) mixes renders, still frames, and behind-the-scenes images in one infinite marquee. This reads as asset dumping, not curation.

- WebP/AVIF + `srcSet` + blur-up would help on all heavy hero and gallery assets, especially [src/components/home/HeroSection.tsx:114](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HeroSection.tsx#L114), [src/components/about/AboutPhotoCarousel.tsx:77](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/about/AboutPhotoCarousel.tsx#L77), [src/components/blog/BlogGrid.tsx:72](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/blog/BlogGrid.tsx#L72), and [src/components/parents/ParentsHero.tsx:33](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/parents/ParentsHero.tsx#L33).

- Photography replacements that would elevate trust:
  Real family worship moments at home.
  Parent and child watching together on a couch, warm natural light.
  Creator/founder portraits in real environments, not just team cards.
  Sunday school / church-small-group usage photos.
  Production stills that show quality craft, not just frames from final output.

- Illustration system replacement:
  build one modular scene language with consistent line weight, edge softness, highlight behavior, background foliage treatment, and material response. Right now the characters are memorable, but the environment/asset system around them is ad hoc.

=== TIER 5: INFORMATION ARCHITECTURE ===

- Navigation is too broad for the amount of proof on the site. [src/components/Navbar.tsx:34](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/Navbar.tsx#L34) exposes Home, About, Watch, Characters, Families, Blog, Resources. For a trust-sensitive parent brand, top-level IA should guide users into 3 paths: Watch, For Parents, Resources.

- `/parents` is conceptually important but underpowered. [src/app/parents/page.tsx:22](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/parents/page.tsx#L22) renders hero, accordion, community only. It should be the trust conversion hub with safety policy, pedagogy, founder note, testimonials, FAQs, and resource CTA.

- `/donate` is incomplete relative to the stated page brief. [src/app/donate/page.tsx:23](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/donate/page.tsx#L23) renders hero and card only; impact stats section exists in code but is not used. That suggests unfinished IA.

- `/blog` has no category strategy in the rendered page. [src/components/blog/BlogCategories.tsx:1](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/blog/BlogCategories.tsx#L1) exists, but [src/app/blog/page.tsx:20](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/blog/page.tsx#L20) only renders hero and grid. That weakens discovery and signals incomplete editorial structure.

- `/music` is too thin for a top-nav destination. [src/app/music/page.tsx:11](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/app/music/page.tsx#L11) is just a platform list. This should likely be folded into watch or become a richer release page.

- CTA gravity is weak. Many pages end with generic “Watch our videos” or “Subscribe now.” The site rarely escalates commitment with narrative logic. World-class funnels sequence low-friction to high-intent asks.

=== TIER 6: TRUST/CONVERSION ===

- Social proof is weak or synthetic. [src/components/home/TestimonialsSection.tsx:92](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/TestimonialsSection.tsx#L92) may contain real copy, but the visual treatment feels carousel-for-carousel’s-sake. More importantly, it lacks specificity: no location, no church role, no context, no credibility tier.

- Founder voice is buried. [src/components/about/TeamSection.tsx:7](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/about/TeamSection.tsx#L7) has promising bios, especially the pediatric speech-language therapist angle. That credential should be surfaced much earlier, especially on home and parents pages.

- Safety narrative is underdeveloped. Parents need clear answers: ad-free? no scary content? no manipulative loops? theology review? sensory considerations? data collection? supervision model? The site gestures at this in [src/components/parents/ParentsAccordion.tsx:33](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/parents/ParentsAccordion.tsx#L33) but never turns it into a crisp trust framework.

- Conversion forms do not inspire confidence. [src/components/home/NewsletterSection.tsx:140](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/NewsletterSection.tsx#L140), [src/components/parents/ParentsCommunity.tsx:64](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/parents/ParentsCommunity.tsx#L64), and [src/components/Footer.tsx:131](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/Footer.tsx#L131) all present input fields, but none communicate privacy, deliverability, or real backend confidence.

- Press and partnership surfaces look fake because the underlying contact mechanism is fake. [src/components/contact/ContactSidebar.tsx:25](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/contact/ContactSidebar.tsx#L25) suggests press outreach readiness, but the system beneath it is not production-grade.

- The blog dates are current to 2026 in [src/data/blogPosts.ts:19](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/data/blogPosts.ts#L19), [src/data/blogPosts.ts:44](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/data/blogPosts.ts#L44), and [src/data/blogPosts.ts:75](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/data/blogPosts.ts#L75), which is good, but the blog design does not yet feel like a serious thought leadership surface.

=== PRIORITIZED ACTION PLAN ===

1. Rebuild the **home hero** from scratch.
   Effort: **M**
   Impact: **5**
   Sequencing: **first**
   One thing that would most change perception: replace the current effects-heavy hero with a single cinematic family-faith scene, restrained typography, and two disciplined CTAs.

2. Remove the **fake loader** and fake interaction theater.
   Effort: **S**
   Impact: **5**
   Sequencing: **first**
   Includes [src/components/home/HomeClient.tsx:23](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/home/HomeClient.tsx#L23) and [src/components/Navbar.tsx:44](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/Navbar.tsx#L44).

3. Redesign the **typography system**.
   Effort: **M**
   Impact: **5**
   Sequencing: **first**
   Reduce Fredoka usage, introduce a mature reading/UI stack, and normalize scale.

4. Establish a real **design system** for buttons, cards, shadows, and radii.
   Effort: **M**
   Impact: **4**
   Sequencing: **second**
   Start with [src/components/UI.tsx:18](/Users/codex/Downloads/Code/Selah-Kids-Antigravity/src/components/UI.tsx#L18).

5. Replace synthetic trust with **real proof**.
   Effort: **M**
   Impact: **5**
   Sequencing: **second**
   Remove fake avatars, add founder credential blocks, real family quotes, and ministry/platform evidence.

6. Make all forms and gated flows **real or remove them**.
   Effort: **M**
   Impact: **5**
   Sequencing: **second**
   Contact, newsletter, and resources are currently bluffing.

7. Turn `/parents` into the **trust hub**.
   Effort: **M**
   Impact: **4**
   Sequencing: **third**
   Render the missing trust badges, add safety principles, founder note, FAQs, and real parent proof.

8. Unify the **imagery system**.
   Effort: **L**
   Impact: **4**
   Sequencing: **third**
   Replace JPG logo, compress hero/gallery assets, standardize character integration, and introduce consistent family photography.

9. Simplify **motion** across the site by at least half.
   Effort: **M**
   Impact: **4**
   Sequencing: **third**
   Keep motion for hierarchy and delight, not constant spectacle.

10. Clean up **IA and unfinished sections**.
    Effort: **S**
    Impact: **3**
    Sequencing: **fourth**
    Render or remove unused sections, restore donate impact, bring blog categories into the page, and reconsider `/music` as a standalone destination.

Visual maturity score: **4.2/10**

Benchmarked against the **top 5%** of landing pages, this is not yet in the same league as Apple, Stripe, Linear, Vercel, Disney+, or Bluey. It has energy and effort, but not enough restraint, system discipline, or trust-grade realism. The current impression is **“talented team over-decorating”**, not **“world-class team shipping with conviction.”**

- **Main gap:** restraint
- **Biggest issue:** **hero**
- **Most damaging signal:** **fake trust / fake functionality**
- **Current tier:** **promising but amateur-coded premium**