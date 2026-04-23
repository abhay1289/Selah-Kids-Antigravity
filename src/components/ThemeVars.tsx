import type { ColorToken } from '../data/chrome-theme';

/**
 * Runtime CSS custom-property override. Renders a `<style>` tag that
 * re-declares each token on `:root`, overriding the Tailwind `@theme`
 * defaults.
 *
 * Admin-authored values pass through two regex gates before injection:
 * one restricts the variable name to `--[a-z0-9-]+` (no quotes, angle
 * brackets, or separators that could close the `<style>` tag), the
 * other restricts the value to well-known colour forms (hex, rgb[a],
 * hsl[a], or named colours). Input is trimmed and type-checked so
 * whitespace-only edits or `null`/`undefined` rows can't sneak through.
 */
const COLOR_VALUE =
  /^(#[0-9a-fA-F]{3,8}|rgba?\([0-9a-zA-Z, .%\/]+\)|hsla?\([0-9a-zA-Z, .%\/]+\)|[a-zA-Z]+)$/;
const CSS_VAR = /^--[a-z0-9-]+$/i;

export function ThemeVars({ colors }: { colors: ColorToken[] }) {
  const decls = colors
    .map((c) => ({
      cssVar: typeof c.cssVar === 'string' ? c.cssVar.trim() : '',
      value: typeof c.value === 'string' ? c.value.trim() : '',
    }))
    .filter(({ cssVar, value }) => CSS_VAR.test(cssVar) && COLOR_VALUE.test(value))
    .map(({ cssVar, value }) => `${cssVar}:${value};`)
    .join('');
  if (!decls) return null;
  return (
    <style
      data-theme-vars
      dangerouslySetInnerHTML={{ __html: `:root{${decls}}` }}
    />
  );
}
