import { parse, converter } from 'culori'

import { Color } from './figma_api.js'

const toRgb = converter('rgb')

/**
 * Counts colours that had to be pulled into sRGB. Figma stores variables as
 * sRGB, and Dialtone authors in OKLCH, which is wider, so a small number of
 * values cannot be represented exactly. Exposed so a sync run can report the
 * loss rather than let it pass silently.
 */
export const gamutMapped: { name: string; from: string }[] = []

export function resetGamutLog() {
  gamutMapped.length = 0
}

/**
 * Compares two colors for approximate equality since converting between Figma RGBA objects (from 0 -> 1) and
 * hex colors can result in slight differences.
 */
export function colorApproximatelyEqual(colorA: Color, colorB: Color) {
  // Compares channels directly rather than via hex.
  //
  // Quantising to hex first looks equivalent and is not, because rounding has
  // edges: Figma stores colours at single precision, so an alpha of 0.9 comes
  // back as 0.8999999761581421. Multiplied by 255 that is 229.49999, which
  // rounds to 229, while 0.9 rounds to 230. The two differ by four ten-millionths
  // and land on opposite sides of a boundary, so the sync decides the value
  // changed and rewrites it on every run.
  //
  // Half a step of an 8-bit channel is the same tolerance the hex comparison
  // gave, without the edge.
  const TOLERANCE = 1 / 255 / 2

  const close = (a: number, b: number) => Math.abs(a - b) < TOLERANCE

  return (
    close(colorA.r, colorB.r) &&
    close(colorA.g, colorB.g) &&
    close(colorA.b, colorB.b) &&
    close(colorA.a ?? 1, colorB.a ?? 1)
  )
}

export function parseColor(color: string): Color {
  color = color.trim()
  const hexRegex = /^#([A-Fa-f0-9]{6})([A-Fa-f0-9]{2}){0,1}$/
  const hexShorthandRegex = /^#([A-Fa-f0-9]{3})([A-Fa-f0-9]){0,1}$/

  if (hexRegex.test(color) || hexShorthandRegex.test(color)) {
    const hexValue = color.substring(1)
    const expandedHex =
      hexValue.length === 3 || hexValue.length === 4
        ? hexValue
            .split('')
            .map((char) => char + char)
            .join('')
        : hexValue

    const alphaValue = expandedHex.length === 8 ? expandedHex.slice(6, 8) : undefined

    return {
      r: parseInt(expandedHex.slice(0, 2), 16) / 255,
      g: parseInt(expandedHex.slice(2, 4), 16) / 255,
      b: parseInt(expandedHex.slice(4, 6), 16) / 255,
      ...(alphaValue ? { a: parseInt(alphaValue, 16) / 255 } : {}),
    }
  }

  return parseCssColor(color)
}

/**
 * Parses any CSS colour culori understands, which is what Dialtone actually
 * authors in: every base colour is `oklch(L C H)`, and a few carry an alpha.
 *
 * OKLCH describes colours sRGB cannot show. A Figma variable holds sRGB, so
 * those have to be brought into range, and *how* matters: reducing chroma
 * while holding lightness and hue sounds like the closer match, but it is
 * not what a browser actually paints for an out-of-gamut `oklch()` on an
 * sRGB display — measured against Chromium across every base colour,
 * clipping each channel independently matched 105 of 105 values where
 * chroma-reduction matched 10. Clipping it is, so Figma agrees with what a
 * designer sees in a browser rather than with a theoretically nicer
 * conversion nobody's screen performs.
 */
export function parseCssColor(color: string, name = ''): Color {
  const parsed = parse(color)
  if (!parsed) {
    throw new Error(`Invalid color format: ${color}`)
  }

  const direct = toRgb(parsed)
  if (!direct) {
    throw new Error(`Could not convert to rgb: ${color}`)
  }

  const outside =
    Math.min(direct.r, direct.g, direct.b) < -0.001 ||
    Math.max(direct.r, direct.g, direct.b) > 1.001

  const rgb = direct
  if (outside) {
    gamutMapped.push({ name, from: color })
  }

  const alpha = rgb.alpha ?? parsed.alpha

  return {
    r: clamp01(rgb.r),
    g: clamp01(rgb.g),
    b: clamp01(rgb.b),
    ...(alpha !== undefined && alpha !== 1 ? { a: clamp01(alpha) } : {}),
  }
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}

/** True when the colour has an alpha below 1, within rounding. */
export function isTranslucent(color: string): boolean {
  const { a } = parseColor(color)
  return a !== undefined && a < 0.999
}

/**
 * The Figma composed colour (alias + opacity) for an `alpha`-modified token, or
 * undefined when it has to stay a plain colour.
 *
 * Figma applies a composed colour's opacity only over an OPAQUE target. Over a
 * translucent one it keeps the target's own alpha and ignores the opacity, where
 * CSS (`oklch(from <target> l c h / <alpha>)`) replaces the alpha. So
 * `muted/active` (`muted/hover` at 60%, itself `moderate-opaque` at 45%) renders
 * 0.45 in Figma and 0.60 in CSS. A translucent target therefore gets no
 * composed colour, and the caller flattens it to the resolved literal, which
 * matches the CSS by construction.
 *
 * `targetResolved` is the target's resolved value in the same mode as the token.
 */
export function composedColorFor(
  from: { target: string; modifier: { type: string; value: string } } | undefined,
  targetResolved: string,
): { colorAlias: string; opacity: number } | undefined {
  if (from?.modifier.type !== 'alpha') return undefined
  if (isTranslucent(targetResolved)) return undefined
  // Rounded to 4 decimal places: ".07" * 100 is 7.000000000000001 in floating
  // point, which is noise in the payload and in every log line.
  const opacity = Math.round(Number.parseFloat(from.modifier.value) * 100 * 1e4) / 1e4
  return Number.isFinite(opacity) ? { colorAlias: from.target, opacity } : undefined
}

export function rgbToHex({ r, g, b, a }: Color) {
  if (a === undefined) {
    a = 1
  }

  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  const hex = [toHex(r), toHex(g), toHex(b)].join('')
  return `#${hex}` + (a !== 1 ? toHex(a) : '')
}
