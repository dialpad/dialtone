import { describe, it, expect } from 'vitest'

import {
  classify,
  figmaFontFamily,
  figmaTypeFor,
  SCOPES,
  VALID_SCOPES,
} from './variable_policy.js'
import type { ResolvedToken } from './resolve_tokens.js'

/**
 * A minimal token. Only the fields the policy reads are set, so a test says
 * what it depends on rather than carrying a full fixture around.
 */
function token (name: string, type = 'color', overrides: Partial<ResolvedToken> = {}): ResolvedToken {
  return {
    name,
    type,
    filePath: 'tokens/test.json',
    cssName: name.split('.').join('-'),
    modes: {
      light: { raw: '#000000', resolved: '#000000', alias: null },
      dark: { raw: '#ffffff', resolved: '#ffffff', alias: null },
    },
    ...overrides,
  }
}

/** The scopes the policy would give a token, or null if it is excluded. */
function scopesFor (t: ResolvedToken): string[] | null {
  const { emit } = classify([t])
  return emit.length ? (emit[0].scopes as string[]) : null
}

/** Why a token was excluded, or null if it was emitted. */
function exclusionFor (t: ResolvedToken): string | null {
  const { excluded } = classify([t])
  return excluded.length ? excluded[0].reason : null
}

describe('figmaTypeFor', () => {
  it('maps the token types we emit', () => {
    expect(figmaTypeFor('color')).toBe('COLOR')
    expect(figmaTypeFor('dimension')).toBe('FLOAT')
    expect(figmaTypeFor('number')).toBe('FLOAT')
    expect(figmaTypeFor('lineHeight')).toBe('FLOAT')
    expect(figmaTypeFor('fontWeight')).toBe('FLOAT')
    expect(figmaTypeFor('fontFamily')).toBe('STRING')
    expect(figmaTypeFor('boolean')).toBe('BOOLEAN')
  })

  it('returns null for a type Figma has no variable for', () => {
    // Composites. These become text and effect styles, not variables.
    expect(figmaTypeFor('typography')).toBeNull()
    expect(figmaTypeFor('boxShadow')).toBeNull()
    expect(figmaTypeFor('textCase')).toBeNull()
    expect(figmaTypeFor('somethingNew')).toBeNull()
  })
})

describe('figmaFontFamily', () => {
  it('picks the first recognised family, not the first entry', () => {
    // `-apple-system` is a platform keyword rather than a font, and it is what
    // the stack leads with. Resolving to it verbatim would name nothing.
    expect(figmaFontFamily('-apple-system, BlinkMacSystemFont, "SF Pro", sans-serif'))
      .toBe('SF Pro Text')
  })

  it('prefers a real family ahead of the platform keyword', () => {
    expect(figmaFontFamily('"Season Mix", -apple-system, sans-serif')).toBe('Season Mix')
  })

  it('handles the mono stack', () => {
    expect(figmaFontFamily('SFMono-Regular, "SF Mono", Consolas, monospace')).toBe('SF Mono')
  })

  it('returns null when nothing in the stack is recognised', () => {
    expect(figmaFontFamily('Comic Sans MS, cursive')).toBeNull()
    expect(figmaFontFamily('')).toBeNull()
  })
})

describe('exclusions', () => {
  it('drops a token the source itself marked deprecated', () => {
    expect(exclusionFor(token('typography.body.md.fontSize', 'dimension', {
      deprecated: 'Use text tokens instead.',
    }))).toMatch(/deprecated in the token source/)
  })

  it('drops the deprecated space and size scales', () => {
    expect(exclusionFor(token('space.400', 'dimension'))).toMatch(/deprecated scale/)
    expect(exclusionFor(token('size.400', 'dimension'))).toMatch(/deprecated scale/)
  })

  it('keeps size.radius and size.border, which are current and have no replacement', () => {
    // These hide inside the `size.` prefix but are not part of the retired
    // numeric ladder: a radius is neither whitespace nor structure, so neither
    // `spacing.*` nor `layout.*` covers them.
    expect(exclusionFor(token('size.radius.300', 'dimension'))).toBeNull()
    expect(exclusionFor(token('size.border.100', 'dimension'))).toBeNull()
  })

  it('drops negatives and percentages, which Figma cannot use', () => {
    expect(exclusionFor(token('spacing.400-negative', 'dimension'))).toMatch(/negative/)
    expect(exclusionFor(token('size.radius.circle', 'dimension', {
      modes: {
        light: { raw: '50%', resolved: '50%', alias: null },
        dark: { raw: '50%', resolved: '50%', alias: null },
      },
    }))).toMatch(/percentage/)
  })

  it('drops a gradient by its value, not its name', () => {
    // A token that *aliases* a gradient has the alias flattened when the
    // target is not emitted, which puts the gradient string back into the
    // payload under a name that looks innocent.
    expect(exclusionFor(token('badge.color.background.ai', 'color', {
      modes: {
        light: { raw: '{color.gradient.x}', resolved: 'linear-gradient(90deg, #000, #fff)', alias: null },
        dark: { raw: '{color.gradient.x}', resolved: 'linear-gradient(90deg, #000, #fff)', alias: null },
      },
    }))).toMatch(/gradient/)
  })

  it('drops the avatar colour computation inputs', () => {
    expect(exclusionFor(token('avatar.hue.offset', 'number'))).toMatch(/colour computation/)
    expect(exclusionFor(token('avatar.anchor.hue', 'color'))).toMatch(/colour computation/)
  })
})

describe('scope inference', () => {
  it('scopes colour by the surface it paints', () => {
    expect(scopesFor(token('color.surface.primary'))).toEqual(['FRAME_FILL', 'SHAPE_FILL'])
    expect(scopesFor(token('color.border.default'))).toEqual(['STROKE_COLOR'])
  })

  it('lets foreground reach shapes as well as text, so icons can use it', () => {
    // A Dialtone icon inherits the foreground colour, and an icon in Figma is a
    // vector. Text-only scoping would leave every icon unable to reach it.
    expect(scopesFor(token('color.foreground.primary'))).toEqual(['TEXT_FILL', 'SHAPE_FILL'])
    expect(scopesFor(token('color.link.primary'))).toEqual(['TEXT_FILL', 'SHAPE_FILL'])
  })

  it('matches a role that ends the path as well as one that continues', () => {
    expect(scopesFor(token('shell.base.color.surface'))).toEqual(['FRAME_FILL', 'SHAPE_FILL'])
    expect(scopesFor(token('shell.base.color.foreground'))).toEqual(['TEXT_FILL', 'SHAPE_FILL'])
  })

  it('matches a role carrying a state suffix', () => {
    expect(scopesFor(token('theme.topbar.field.color.background-hover')))
      .toEqual(['FRAME_FILL', 'SHAPE_FILL'])
    expect(scopesFor(token('theme.topbar.field.color.border-active')))
      .toEqual(['STROKE_COLOR'])
  })

  it('scopes numbers by the property they set', () => {
    expect(scopesFor(token('size.radius.300', 'dimension'))).toEqual(['CORNER_RADIUS'])
    expect(scopesFor(token('size.border.100', 'dimension'))).toEqual(['STROKE_FLOAT'])
    expect(scopesFor(token('spacing.400', 'dimension'))).toEqual(['GAP'])
    expect(scopesFor(token('layout.400', 'dimension'))).toEqual(['WIDTH_HEIGHT'])
    expect(scopesFor(token('opacity.600', 'number'))).toEqual(['OPACITY'])
  })

  it('does not give a colour scope to a border width', () => {
    // The border rule once matched on a bare `border` segment, which also
    // caught `size.border.100`. Figma rejects the entire payload for one colour
    // scope on a number, naming only that variable.
    expect(scopesFor(token('size.border.100', 'dimension'))).not.toContain('STROKE_COLOR')
  })

  it('sends FONT_STYLE for a font weight, which is what Figma stores', () => {
    // Figma accepts FONT_WEIGHT and then stores FONT_STYLE, so sending the
    // obvious one makes every run see a difference and rewrite the same
    // variables forever.
    expect(scopesFor(token('font.weight.medium', 'fontWeight'))).toEqual(['FONT_STYLE'])
  })

  it('scopes type by its part', () => {
    expect(scopesFor(token('text.body.md.fontSize', 'dimension'))).toEqual(['FONT_SIZE'])
    expect(scopesFor(token('text.body.md.lineHeight', 'lineHeight'))).toEqual(['LINE_HEIGHT'])
    expect(scopesFor(token('text.body.md.fontFamily', 'fontFamily'))).toEqual(['FONT_FAMILY'])
  })

  it('leaves the raw palettes unconstrained', () => {
    expect(scopesFor(token('color.purple.500'))).toEqual(['ALL_SCOPES'])
    expect(scopesFor(token('color.chart.categorical.01'))).toEqual(['ALL_SCOPES'])
    expect(scopesFor(token('material.sandstone.500'))).toEqual(['ALL_SCOPES'])
  })

  it('reports a colour that matched no specific rule rather than defaulting silently', () => {
    const { emit, unscoped } = classify([token('shell.logo.color.wordmark')])
    expect(unscoped).toEqual([])
    expect(emit[0].scopeRule).toBe('unclassified colour')
    expect(emit[0].scopes).toEqual(['ALL_SCOPES'])
  })
})

describe('scope validation', () => {
  it('never names a scope that no variable type accepts', () => {
    // Catches a typo in the table. A scope valid for no type at all could never
    // be sent successfully, and Figma would reject the whole payload naming one
    // variable out of a thousand.
    for (const rule of SCOPES) {
      for (const scope of rule.scopes) {
        const accepted = Object.values(VALID_SCOPES).some(allowed => allowed.has(scope))
        expect(accepted, `rule "${rule.label}" names ${scope}, which no type accepts`).toBe(true)
      }
    }
  })

  it('reports a type-and-scope mismatch instead of sending it', () => {
    // `textCase` maps to no Figma type, so this token is excluded before
    // scoping. Using a FLOAT with a colour scope proves the check fires.
    const { violations } = classify([token('color.border.default', 'dimension')])
    expect(violations).toHaveLength(1)
    expect(violations[0].figmaType).toBe('FLOAT')
    expect(violations[0].scopes).toEqual(['STROKE_COLOR'])
  })

  it('finds no violation in a well-formed set', () => {
    const { violations } = classify([
      token('color.surface.primary'),
      token('spacing.400', 'dimension'),
      token('font.weight.medium', 'fontWeight'),
      token('text.body.md.fontFamily', 'fontFamily'),
    ])
    expect(violations).toEqual([])
  })
})
