/**
 * Barrel export for shared design primitives.
 *
 * Consumers should import from `@/components/design` rather than the
 * individual files so the surface stays small and renaming the internal
 * files doesn't ripple.
 */
export { AtmosSpine, type AtmosSpineProps } from './AtmosSpine';
export { PageShell, type PageShellProps } from './PageShell';
export { ScrapbookCard, type ScrapbookCardProps } from './ScrapbookCard';
export { FloatingBadge, type FloatingBadgeProps } from './FloatingBadge';
export {
  MarqueeStrip,
  type MarqueeStripProps,
  type MarqueeStripItem,
  type MarqueeIcon,
} from './MarqueeStrip';
export { SectionShell, type SectionShellProps } from './SectionShell';
export { LanguageCrossPromo, type LanguageCrossPromoProps } from './LanguageCrossPromo';
