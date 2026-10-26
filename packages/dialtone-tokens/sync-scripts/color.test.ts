import { describe, it, expect, beforeEach } from 'vitest'

import { colorApproximatelyEqual, parseColor, parseCssColor, rgbToHex, gamutMapped, resetGamutLog, isTranslucent, composedColorFor } from './color.js'

describe('isTranslucent', () => {
  it('is true for a colour with an alpha below 1', () => {
    expect(isTranslucent('oklch(0.8 0.01 80 / 0.45)')).toBe(true)
    expect(isTranslucent('#00000080')).toBe(true)
  })

  it('is false for an opaque colour, with or without an alpha', () => {
    expect(isTranslucent('oklch(0.8 0.01 80)')).toBe(false)
    expect(isTranslucent('oklch(0.8 0.01 80 / 1)')).toBe(false)
    expect(isTranslucent('#000000')).toBe(false)
  })
})

describe('composedColorFor', () => {
  const alpha = (target: string, value: string) => ({ target, modifier: { type: 'alpha', value } })

  it('composes over an opaque target, with the opacity as a percentage', () => {
    expect(composedColorFor(alpha('color.surface.bold', '.6'), 'oklch(0.8 0.01 80)'))
      .toEqual({ colorAlias: 'color.surface.bold', opacity: 60 })
  })

  it('rounds away floating point noise in the opacity', () => {
    expect(composedColorFor(alpha('a.b', '.07'), '#000000')?.opacity).toBe(7)
  })

  // muted/active is muted/hover at 60%, and muted/hover is 45% itself: Figma
  // would render 0.45 where the CSS has 0.60.
  it('returns nothing over a translucent target, so the caller flattens', () => {
    expect(composedColorFor(alpha('action.color.background.muted.hover', '.6'), 'oklch(0.8 0.01 80 / 0.45)'))
      .toBeUndefined()
  })

  it('decides per call, so one token can compose in one mode and flatten in the other', () => {
    const from = alpha('color.surface.moderate-opaque', '.6')
    expect(composedColorFor(from, 'oklch(0.8 0.01 80)')).toBeDefined()
    expect(composedColorFor(from, 'oklch(0.3 0.01 80 / 0.5)')).toBeUndefined()
  })

  it('ignores modifiers other than alpha, which change the colour itself', () => {
    expect(composedColorFor({ target: 'a.b', modifier: { type: 'lighten', value: '.1' } }, '#000000')).toBeUndefined()
    expect(composedColorFor(undefined, '#000000')).toBeUndefined()
  })

  it('returns nothing for a non-numeric opacity', () => {
    expect(composedColorFor(alpha('a.b', 'nope'), '#000000')).toBeUndefined()
  })
})

describe('colorApproximatelyEqual', () => {
  it('compares by hex value', () => {
    expect(colorApproximatelyEqual({ r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 })).toBe(true)
    expect(colorApproximatelyEqual({ r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0, a: 1 })).toBe(true)
    expect(
      colorApproximatelyEqual({ r: 0, g: 0, b: 0, a: 0.5 }, { r: 0, g: 0, b: 0, a: 0.5 }),
    ).toBe(true)
    expect(colorApproximatelyEqual({ r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0, a: 0 })).toBe(false)

    expect(colorApproximatelyEqual({ r: 0, g: 0, b: 0 }, { r: 0.001, g: 0, b: 0 })).toBe(true)
    expect(colorApproximatelyEqual({ r: 0, g: 0, b: 0 }, { r: 0.0028, g: 0, b: 0 })).toBe(false)
  })
})

describe('parseColor', () => {
  it('parses hex values', () => {
    // 3-value syntax
    expect(parseColor('#000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(parseColor('#fff')).toEqual({ r: 1, g: 1, b: 1 })
    expect(parseColor('#FFF')).toEqual({ r: 1, g: 1, b: 1 })
    expect(parseColor('#f09')).toEqual({ r: 1, g: 0, b: 153 / 255 })
    expect(parseColor('#F09')).toEqual({ r: 1, g: 0, b: 153 / 255 })

    // 4-value syntax
    expect(parseColor('#0000')).toEqual({ r: 0, g: 0, b: 0, a: 0 })
    expect(parseColor('#000F')).toEqual({ r: 0, g: 0, b: 0, a: 1 })
    expect(parseColor('#f09a')).toEqual({ r: 1, g: 0, b: 153 / 255, a: 170 / 255 })

    // 6-value syntax
    expect(parseColor('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(parseColor('#ffffff')).toEqual({ r: 1, g: 1, b: 1 })
    expect(parseColor('#FFFFFF')).toEqual({ r: 1, g: 1, b: 1 })
    expect(parseColor('#ff0099')).toEqual({ r: 1, g: 0, b: 153 / 255 })
    expect(parseColor('#FF0099')).toEqual({ r: 1, g: 0, b: 153 / 255 })

    // 8-value syntax
    expect(parseColor('#00000000')).toEqual({ r: 0, g: 0, b: 0, a: 0 })
    expect(parseColor('#00000080')).toEqual({ r: 0, g: 0, b: 0, a: 128 / 255 })
    expect(parseColor('#000000ff')).toEqual({ r: 0, g: 0, b: 0, a: 1 })
    expect(parseColor('#5EE0DCAB')).toEqual({
      r: 0.3686274509803922,
      g: 0.8784313725490196,
      b: 0.8627450980392157,
      a: 0.6705882352941176,
    })
  })

  it('handles invalid hex values', () => {
    expect(() => parseColor('#')).toThrowError('Invalid color format')
    expect(() => parseColor('#0')).toThrowError('Invalid color format')
    expect(() => parseColor('#00')).toThrowError('Invalid color format')
    expect(() => parseColor('#0000000')).toThrowError('Invalid color format')
    expect(() => parseColor('#000000000')).toThrowError('Invalid color format')
    expect(() => parseColor('#hhh')).toThrowError('Invalid color format')
  })
})

describe('parseCssColor', () => {
  beforeEach(() => {
    resetGamutLog()
  })

  it('passes an in-gamut colour straight through', () => {
    const color = parseCssColor('oklch(0.6 0.1 250)')
    expect(gamutMapped).toHaveLength(0)
    // sanity check: round-trips to a plausible blue, not clamped to black/white
    const hex = rgbToHex(color)
    expect(hex).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('clips an out-of-gamut colour to match what a browser paints, not a hue-preserving chroma reduction', () => {
    // shell/color/foreground/warning, dark mode — confirmed against Chromium:
    // clipping renders amber (#ffd561), chroma-reduction renders a washed-out
    // pale peach (#ffe3c2) that does not match the product.
    const color = parseCssColor('oklch(0.93 0.16 71.7)', 'shell/color/foreground/warning')
    expect(rgbToHex(color)).toBe('#ffd561')
    expect(gamutMapped).toEqual([{ name: 'shell/color/foreground/warning', from: 'oklch(0.93 0.16 71.7)' }])
  })
})

describe('rgbToHex', () => {
  it('should convert rgb to hex', () => {
    expect(rgbToHex({ r: 1, g: 1, b: 1 })).toBe('#ffffff')
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
    expect(rgbToHex({ r: 0.5, g: 0.5, b: 0.5 })).toBe('#808080')
    expect(rgbToHex({ r: 0.3686274509803922, g: 0.8784313725490196, b: 0.8627450980392157 })).toBe(
      '#5ee0dc',
    )
  })

  it('should convert rgba to hex', () => {
    expect(rgbToHex({ r: 1, g: 1, b: 1, a: 1 })).toBe('#ffffff')
    expect(rgbToHex({ r: 0, g: 0, b: 0, a: 0.5 })).toBe('#00000080')
    expect(rgbToHex({ r: 0.5, g: 0.5, b: 0.5, a: 0.5 })).toBe('#80808080')
    expect(
      rgbToHex({ r: 0.3686274509803922, g: 0.8784313725490196, b: 0.8627450980392157, a: 0 }),
    ).toBe('#5ee0dc00')
  })
})
