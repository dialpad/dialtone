import { describe, it, expect, beforeAll } from 'vitest'

import { resolveEffectStyles, EffectStyleSpec } from './resolve_effect_styles.js'

const BINDABLE_FIELDS = ['blur', 'color', 'offsetX', 'offsetY', 'spread'] as const

describe('resolveEffectStyles', () => {
  let specs: EffectStyleSpec[]

  beforeAll(async () => {
    specs = await resolveEffectStyles()
  })

  it('resolves all 8 shadow composites', () => {
    expect(specs.length).toBe(8)
  })

  it('sorts by name', () => {
    const names = specs.map(s => s.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('flags the -inset shadow as an inner shadow, and its alias along with it', () => {
    // `shadow.focus` is a pure alias of `shadow.focus-inset` in the token
    // source, and the production CSS it feeds renders as an inner ring — but
    // the alias doesn't survive Style Dictionary's per-field explosion, so
    // this can only be caught by the two shadows resolving to identical values.
    const inset = specs.filter(s => s.isInset).map(s => s.name).sort()
    expect(inset).toEqual(['shadow/focus', 'shadow/focus-inset'])
  })

  it('gives every layer a variable for every bindable field', () => {
    for (const spec of specs) {
      expect(spec.layers.length).toBeGreaterThan(0)
      // A single-layer shadow's token has no numeric index (`shadow.focus.blur`,
      // not `shadow.focus.1.blur`), so its variable name omits one too.
      for (const [i, layer] of spec.layers.entries()) {
        const layerPrefix = spec.layers.length === 1 ? spec.name : `${spec.name}/${i + 1}`
        for (const field of BINDABLE_FIELDS) {
          expect(layer.variables[field]).toBe(`${layerPrefix}/${field}`)
        }
      }
    }
  })
})
