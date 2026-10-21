import { describe, it, expect, beforeAll } from 'vitest'

import { resolveTextStyles, TextStyleSpec } from './resolve_text_styles.js'

describe('resolveTextStyles', () => {
  let specs: TextStyleSpec[]

  beforeAll(async () => {
    specs = await resolveTextStyles()
  })

  it('resolves every text, typography.inputs, and typography.button composite', () => {
    expect(specs.length).toBe(29)
  })

  it('sorts by name', () => {
    const names = specs.map(s => s.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('gives every spec a Figma variable name per bindable field', () => {
    for (const spec of specs) {
      expect(spec.fontFamily.variable).toBe(`${spec.name}/fontFamily`)
      expect(spec.fontSize.variable).toBe(`${spec.name}/fontSize`)
      expect(spec.fontWeight.variable).toBe(`${spec.name}/fontWeight`)
      expect(spec.lineHeight.variable).toBe(`${spec.name}/lineHeight`)
    }
  })

  it('resolves a known body style to the expected family, size, and weight', () => {
    const bodyMd = specs.find(s => s.name === 'text/body/md')
    expect(bodyMd).toBeDefined()
    expect(bodyMd!.figmaFamily).toBe('SF Pro Text')
    expect(bodyMd!.fontSize.value).toBe('16px')
    expect(bodyMd!.fontStyleName).toBe('Regular')
  })

  it('maps each real weight in use to its own named style, not just a valid one', () => {
    // Membership in the valid-name list alone would still pass with any two
    // entries of WEIGHT_TO_STYLE transposed, since every real weight here
    // maps to a *different* name — assert the exact pairing per weight instead.
    const byWeight = new Map(specs.map(s => [s.fontWeight.value, s.fontStyleName]))
    expect(byWeight.get('400')).toBe('Regular')
    expect(byWeight.get('500')).toBe('Medium')
    expect(byWeight.get('600')).toBe('Semibold')
    expect(byWeight.get('700')).toBe('Bold')
  })
})
