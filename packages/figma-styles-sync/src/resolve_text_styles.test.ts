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

  it('derives fontStyleName from the numeric weight, not the raw CSS value', () => {
    for (const spec of specs) {
      expect(['Regular', 'Medium', 'Semibold', 'Bold']).toContain(spec.fontStyleName)
    }
  })
})
