# Codex Critique of AUDIT-v2-SYNTHESIS.md

**Date:** 2026-04-21
**Model:** gpt-5.3-codex via `codex exec -s read-only`
**Tokens used:** ~433k
**Target doc:** `docs/AUDIT-v2-SYNTHESIS.md`

---

## 1. Over-ambitious / wrong

1. The doc is partly written against the wrong app architecture. It tells you to add `src/hooks/useYouTubePlayer.ts`, but this repo has no hook layer for that and your own AGENTS rules explicitly say not to add custom hooks by default. It also assumes route-local click handlers in places that are currently hard-coded page components and a thin shell. See `src/components/LayoutShell.tsx:1`, `src/app/layout.tsx:1`.
2. **It hallucinates at least one problem.** M14 claims focus rings are missing, but there is already a global `:focus-visible` rule in `src/app/globals.css:161`.
3. It overstates reduced-motion as missing. There is already a global reduced-motion clamp in `src/app/globals.css:143`. The real issue is that animations are still authored everywhere, not that there is zero support.
4. **"Phase 1 in 2–3 days" is fantasy.** U01 + U02 + U04 + U12 + hero reel + nav collapse + a11y/perf cleanup crosses UX, embed APIs, state, layout, and content modeling. This codebase is mostly static client components with duplicated video data, not a reusable media platform: `src/app/watch/page.tsx:20`, `src/components/home/LatestVideosSection.tsx:31`.

## 2. Missing for a world-class kids site

1. **Real parental trust UX:** content ratings, age bands, runtime, sensory notes, autoplay policy, and "safe for independent viewing" labels. None exist in `src/app/watch/page.tsx:20`.
2. **Content system hygiene:** one canonical media catalog instead of duplicated arrays on home and watch. Right now it is copy-pasted data in two places: `src/app/watch/page.tsx:20`, `src/components/home/LatestVideosSection.tsx:31`.
3. **Basic kids UX:** favorites/history, resume watching, clear language persistence, and big-card browse rows.
4. **Parent-proof overlay behavior:** close, escape, focus trap, no accidental background interaction.

## 3. Phase 1 ship order

1. **U01 first.** Biggest retention win and forces the right abstraction: canonical video model + player state.
2. **U04 second.** Once U01 exists, homepage cards can reuse the same player open action instead of `window.open`.
3. **U02 third.** Music is currently a dead-end links page, but it is less core than watch: `src/app/music/page.tsx:9`.
4. **U12 fourth.** Persistent mini-player before U01 is wasteful; after U01 it becomes an extension of the same player state.

## 4. U01 blockers in this codebase

1. **No shared media state.** `LayoutShell` is just navbar/footer, no player host: `src/components/LayoutShell.tsx:6`.
2. **Video data is duplicated and inconsistent across pages,** so queueing/auto-advance has no single source: `src/app/watch/page.tsx:20`, `src/components/home/LatestVideosSection.tsx:31`.
3. **Current interaction model hard-exits the site with `window.open`,** so every caller must be refactored: `src/components/watch/WatchGrid.tsx:39`, `src/components/home/LatestVideosSection.tsx:146`.
4. **Language state is in-memory only,** so an overlay/queue won't be stable across refresh/navigation intent: `src/contexts/LanguageContext.tsx:14`.

## TL;DR

- **Wrong architecture assumptions**
- **Missing trust + catalog layer**
- **Ship U01 before everything**
- **Main blocker: no shared player state**
