import type { ColorToken } from '../data/chrome-theme';

/**
 * Runtime CSS custom-property override. Renders a `<style>` tag that
 * re-declares each token on `:root`, overriding the Tailwind `@theme`
 * defaults. Only hex / rgb / hsl / named-color forms are allowed —
 * admin free-text is validated so an injected `</style><script>...`
 * payload can't escape the stylesheet.
 */
const COLOR_VALUE = /^(#[0-9a-fA-F]{3,8}|rgb\([0-9, .%]+\)|rgba\([0-9, .%]+\)|hsl\([0-9, .%]+\)|hsla\([0-9, .%]+\)|[a-zA-Z]+)$/;
const CSS_VAR = /^--[a-z0-9-]+$/i;

export function ThemeVars({ colors }: { colors: ColorToken[] }) {
  const decls = colors
    .filter((c) => CSS_VAR.test(c.cssVar) && COLOR_VALUE.test(c.value))
    .map((c) => `${c.cssVar}:${c.value};`)
    .join('');
  if (!decls) return null;
  return (
    <style
      data-theme-vars
      dangerouslySetInnerHTML={{ __html: `:root{${decls}}` }}
    />
  );
}
