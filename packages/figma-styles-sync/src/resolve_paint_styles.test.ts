import { describe, it, expect, beforeAll } from 'vitest'

import { resolvePaintStyles, PaintStyleSpec } from './resolve_paint_styles.js'

describe('resolvePaintStyles', () => {
  let specs: PaintStyleSpec[]

  beforeAll(async () => {
    specs = await resolvePaintStyles()
  })

  it('resolves every gradient token', () => {
    expect(specs.map(s => s.name)).toEqual([
      'color/gradient/gold-red-magenta-purple',
      'color/gradient/magenta-purple',
      'color/gradient/orange-red-magenta-purple',
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

  it('resolves the literal gradient to light mode\'s stop positions, not dark\'s', () => {
    // Known, accepted limitation, not an oversight: dark mode genuinely moves
    // these three stops (tokens/base/dark.json), but a Figma paint style has
    // no per-mode values for a baked literal to switch between. Pinned here
    // so a future change to either mode's token is a visible test failure
    // rather than a silent drift in which mode the style actually reflects.
    const goldRedMagentaPurple = specs.find(s => s.name === 'color/gradient/gold-red-magenta-purple')!
    const positions = goldRedMagentaPurple.stops.map(s => s.position)
    expect(positions[7]).toBeCloseTo(0.7008, 4)
    expect(positions[8]).toBeCloseTo(0.9002, 4)
    expect(positions[9]).toBeCloseTo(0.9729, 4)
  })
})
