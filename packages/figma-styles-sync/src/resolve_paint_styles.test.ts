import { describe, it, expect, beforeAll } from 'vitest'

import { resolvePaintStyles, PaintStyleSpec } from './resolve_paint_styles.js'

describe('resolvePaintStyles', () => {
  let specs: PaintStyleSpec[]

  beforeAll(async () => {
    specs = await resolvePaintStyles()
  })

  it('resolves both gradient tokens', () => {
    expect(specs.map(s => s.name)).toEqual([
      'color/gradient/gold-red-magenta-purple',
      'color/gradient/magenta-purple',
    ])
  })

  it('keeps every stop position within the 0-1 range the Figma API expects', () => {
    for (const spec of specs) {
      for (const stop of spec.stops) {
        expect(stop.position).toBeGreaterThanOrEqual(0)
        expect(stop.position).toBeLessThanOrEqual(1)
      }
    }
  })

  it('binds a referenced stop to its variable instead of baking in a colour', () => {
    const magentaPurple = specs.find(s => s.name === 'color/gradient/magenta-purple')!
    expect(magentaPurple.angleDeg).toBe(135)
    expect(magentaPurple.stops).toEqual([
      { position: 0.1, variable: 'color/brand/magenta' },
      { position: 0.9, variable: 'color/brand/purple' },
    ])
  })

  it('keeps a literal stop as a colour, with no variable to bind', () => {
    const goldRedMagentaPurple = specs.find(s => s.name === 'color/gradient/gold-red-magenta-purple')!
    expect(goldRedMagentaPurple.stops.length).toBe(11)
    for (const stop of goldRedMagentaPurple.stops) {
      expect(stop.variable).toBeUndefined()
      expect(stop.color).toBeDefined()
    }
  })
})
