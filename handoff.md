# Handoff

## Current status
- Completed a Phase 5 pre-flight review on `feat/admin-merge`.
- Reviewed the planned Phase 5 ordering against the current layout, CMS, middleware, and admin settings wiring.
- Spot-checked public chrome, metadata plumbing, preview flow, locale navigation, and "today's pick" logic.
- Main findings:
  - Phase 5 should start with a public-only server layout boundary under `/[locale]`, not root-layout fetches.
  - `site_settings` vs `site_settings_fields` is still a split source of truth and should be unified before chrome/SEO work.
  - Current codebase still has a UTC-based "today's pick" bug, locale-dropping `/watch` navigations, and an unwired admin preview route.

## Most recent user prompts
- Asked to read `/tmp/phase5-plan-audit.md`, review the Phase 5 plan, and spot-check the codebase on `feat/admin-merge`.
- Asked for the answer in the exact two-section audit format from that file, with plan review primary and codebase audit secondary.

## Files changed
- `handoff.md`

## Validation
- Read the Phase 5 prompt spec from `/tmp/phase5-plan-audit.md`.
- Read layout/CMS/admin/public files directly in the repo.
- Ran `pnpm tsc --noEmit` successfully.
- No product code changed.

## Next steps
- If Phase 5 proceeds, first move public chrome data fetching into a public-only `/[locale]` server layout.
- Unify global settings storage before wiring navbar/footer/SEO.
- Fix the UTC date helper and locale-dropping `/watch` navigations before stacking more chrome work.
