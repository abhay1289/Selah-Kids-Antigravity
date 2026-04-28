# Gemini Critique of AUDIT-v2-SYNTHESIS.md

**Date:** 2026-04-21
**Model:** `blackbox-sub/gemini-3.1-pro-preview` via `pi -p`
**Target doc:** `docs/AUDIT-v2-SYNTHESIS.md`

---

## (a) What's MISSING for a World-Class Kids Worship Site

- **Ministry / Sunday School Portal:** Kids worship happens at church, not just home. You need a dedicated view for children's pastors featuring lyric-only track videos, bulk curriculum downloads, and presentation-safe players.
- **Bulletproof Walled Garden:** Relying on YouTube iframes is risky. Even with `rel=0`, it can leak suggested videos or ads. A world-class platform uses **Mux or Vimeo** for absolute brand safety and zero algorithmic rabbit holes.
- **Chord Charts / Sheet Music:** Parents and leaders want to play along at bedtime or Sunday morning.

## (b) Three Weak / Wrong Unlocks in the doc

1. **U13 Voice Commands ("Hey Libni"):** A massive COPPA/privacy red flag. Parents will instantly block microphone permissions on a kids' site.
2. **U19 AR Color Sheets:** Monumental friction, zero ROI. Parents hate web AR. Nobody is granting camera access and fighting lighting conditions for a 10-second BTS clip.
3. **U27 Live Prayer Chain:** SaaS-style FOMO counters ("47 families praying!") feel manipulative, easily faked, and inappropriate for a ministry context.

## (c) FIVE NEW Bilingual EN/ES Unlocks (Libni / Andy / Shiloh)

1. **Seamless Audio Swap:** A custom player toggle that instantly switches the video's audio track between English and Spanish *mid-song* without losing the playback position.
2. **Stacked Bilingual Karaoke:** Lyric overlay with English on top and Spanish directly beneath. Both highlight in sync so kids passively learn worship vocabulary in both languages.
3. **Shiloh's Sensory Room:** A dedicated low-stimulus route (hosted by Shiloh). Zero high-motion animation, dark mode by default, featuring looping ambient worship pads and soft, bilingual whispered scripture.
4. **Vocab Duets:** Interactive micro-interactions where Libni shouts a concept in English ("Grace!") and Andy echoes the translation in Spanish ("¡Gracia!"), accompanied by audio clips.
5. **Pastors' Cast Mode:** A UI-stripped, distraction-free playlist builder optimized for children's ministry leaders to AirPlay seamless bilingual sets to a classroom Apple TV.

## (d) Ruthless Phase 1 Ship Order

1. **U01: In-Site YouTube Player.** Stop bleeding sessions to the YouTube app. Trap the traffic.
2. **U02: Music iFrames.** Kill the outbound Spotify/Apple links. Productize the music page.
3. **M02: Hero Video Reel.** Kill the static hero image. Prove the product's value in the first second with a muted, autoplaying video loop.
4. **M04: Nav Collapse.** Slash the 7-item cognitive overload down to 4 actions: Watch, Listen, Characters, Parents.
5. **U04 (Today's Pick):** Replace the dead 2-video grid with a dynamic daily feature + horizontal scroll.
6. **U12 (Mini-Player):** Add the persistent global audio player last, once the underlying iframes are stable.
