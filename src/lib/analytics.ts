'use client';

/**
 * Typed analytics event helper.
 *
 * The site has not yet picked an analytics provider (Plausible, Umami,
 * PostHog, or Vercel's native Web Analytics are all candidates). This
 * helper centralises the vocabulary so call sites can `track('…')`
 * today without caring which SDK the backend task eventually plugs in.
 *
 * Current behaviour:
 *   - `window.plausible`, `window.umami`, and `window.posthog` each
 *     get a best-effort call if present. No-op if none are loaded.
 *   - Dev builds also mirror the event to `console.debug` so call
 *     sites are visibly wired during development.
 *
 * Call sites should use the named helpers at the bottom of the file
 * (`trackNewsletterSubmit` etc.) rather than freehanding event names —
 * the named helpers are the canonical vocabulary.
 */

export type AnalyticsEventName =
  | 'newsletter_subscribe_submit'
  | 'newsletter_subscribe_success'
  | 'newsletter_subscribe_error'
  | 'contact_submit'
  | 'contact_submit_success'
  | 'contact_submit_error'
  | 'donation_intent'
  | 'donation_frequency_change'
  | 'donation_amount_change'
  | 'donation_submit'
  | 'resource_card_click'
  | 'resource_download_modal_open'
  | 'resource_download_modal_submit'
  | 'resource_download_success'
  | 'video_play'
  | 'video_complete'
  | 'video_open_modal'
  | 'video_close_modal'
  | 'language_switch'
  | 'cta_click'
  | 'nav_link_click'
  | 'mobile_menu_open';

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

interface AnalyticsWindow extends Window {
  plausible?: (event: string, opts?: { props?: AnalyticsProps }) => void;
  umami?: { track: (event: string, props?: AnalyticsProps) => void };
  posthog?: { capture: (event: string, props?: AnalyticsProps) => void };
}

export function track(event: AnalyticsEventName, props?: AnalyticsProps): void {
  if (typeof window === 'undefined') return;
  const w = window as AnalyticsWindow;

  try {
    if (typeof w.plausible === 'function') {
      w.plausible(event, props ? { props } : undefined);
    }
    if (w.umami && typeof w.umami.track === 'function') {
      w.umami.track(event, props);
    }
    if (w.posthog && typeof w.posthog.capture === 'function') {
      w.posthog.capture(event, props);
    }
  } catch {
    // Analytics must never break the page. Swallow provider errors —
    // console.error would appear to end users through error-reporting
    // tools and add noise.
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, props ?? {});
  }
}

// ── Canonical helpers ─────────────────────────────────────────────────
// Name these when adding new track sites; prefer these over free-form
// calls so the event vocabulary stays stable.

export const trackNewsletterSubmit = (locale: 'en' | 'es', source: string) =>
  track('newsletter_subscribe_submit', { locale, source });

export const trackNewsletterSuccess = (locale: 'en' | 'es', source: string) =>
  track('newsletter_subscribe_success', { locale, source });

export const trackContactSubmit = (interest: string) =>
  track('contact_submit', { interest });

export const trackDonationIntent = (frequency: string, amount: number) =>
  track('donation_intent', { frequency, amount });

export const trackDonationAmountChange = (amount: number) =>
  track('donation_amount_change', { amount });

export const trackResourceDownload = (resourceId: string | number, title: string) =>
  track('resource_download_success', { resourceId: String(resourceId), title });

export const trackVideoPlay = (videoId: string, title: string) =>
  track('video_play', { videoId, title });

export const trackLanguageSwitch = (from: 'EN' | 'ES', to: 'EN' | 'ES') =>
  track('language_switch', { from, to });

export const trackCtaClick = (location: string, label: string) =>
  track('cta_click', { location, label });
