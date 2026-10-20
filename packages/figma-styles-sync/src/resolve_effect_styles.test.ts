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

  it('flags only the -inset shadow as an inner shadow', () => {
    const inset = specs.filter(s => s.isInset).map(s => s.name)
    expect(inset).toEqual(['shadow/focus-inset'])
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
