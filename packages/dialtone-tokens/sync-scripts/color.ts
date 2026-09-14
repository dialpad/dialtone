import { parse, converter, clampChroma } from 'culori'

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
 * those have to be brought into range, and *how* matters: clipping each channel
 * independently shifts the hue and produces a visibly different colour. Reducing
 * chroma while holding lightness and hue is what browsers do when they paint an
 * out-of-gamut `oklch()` on an sRGB display, so it keeps Figma agreeing with
 * what a designer sees in a browser.
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

  const rgb = outside ? toRgb(clampChroma(parsed, 'oklch'))! : direct
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
