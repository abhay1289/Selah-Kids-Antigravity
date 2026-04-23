/**
 * Theme token data — single source of truth for the `theme_colors` CMS
 * collection. Admin edits here override the Tailwind `@theme` defaults at
 * runtime via an inline `<style>` injected in the locale layout.
 *
 * Scoped to the base palette only for now — layout tokens (border-radius,
 * glass opacity) ride on `theme_tokens` and aren't surfaced until a future
 * sub-phase wires them into specific components.
 */

export interface ColorToken {
  id: string;
  label: string;
  cssVar: string;
  value: string;
}

export const INITIAL_THEME_COLORS: ColorToken[] = [
  { id: '1', label: 'Primary Orange', cssVar: '--color-selah-orange', value: '#FF5C00' },
  { id: '2', label: 'Dark Green', cssVar: '--color-selah-dark', value: '#3A6B44' },
  { id: '3', label: 'Lime Green', cssVar: '--color-selah-light', value: '#93D35C' },
  { id: '4', label: 'Yellow', cssVar: '--color-selah-yellow', value: '#FEB835' },
  { id: '5', label: 'Sky Blue', cssVar: '--color-selah-blue', value: '#00BFFF' },
  { id: '6', label: 'Muted Text', cssVar: '--color-selah-muted', value: '#5A7D62' },
  { id: '7', label: 'Border', cssVar: '--color-selah-border', value: '#D0D8D3' },
  { id: '8', label: 'Background', cssVar: '--color-selah-bg', value: '#F1F8E7' },
];
