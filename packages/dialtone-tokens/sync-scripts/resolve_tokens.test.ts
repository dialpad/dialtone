import { describe, it, expect } from 'vitest'

import { compareTokenNames } from './resolve_tokens.js'

/**
 * Ordering is load-bearing rather than cosmetic: Figma has no ordering field,
 * so a variable's position in every picker is the order its CREATE arrived in,
 * and the only way to change it afterwards is to rebuild the collection, which
 * breaks every binding in every consuming file.
 */
const sorted = (names: string[]) => [...names].sort(compareTokenNames)

describe('compareTokenNames', () => {
  it('orders a numeric ramp the way a person reads it', () => {
    // Sorted as strings this is 100, 1000, 200, …, 50, which puts 1000 second
    // in every ramp and strands 50 in the middle.
    expect(sorted([
      'color.purple.1000', 'color.purple.50', 'color.purple.200',
      'color.purple.100', 'color.purple.950',
    ])).toEqual([
      'color.purple.50', 'color.purple.100', 'color.purple.200',
      'color.purple.950', 'color.purple.1000',
    ])
  })

  it('puts a value-named step after the numbered ones in the same group', () => {
    // `layout.1px` names its value; `layout.25` names its step. Sorting purely
    // by number interleaves the two conventions.
    expect(sorted(['layout.1px', 'layout.25', 'layout.2px', 'layout.50']))
      .toEqual(['layout.25', 'layout.50', 'layout.1px', 'layout.2px'])
  })

  it('sorts a named step after the numbers, since letters follow digits', () => {
    expect(sorted(['size.radius.pill', 'size.radius.100', 'size.radius.0']))
      .toEqual(['size.radius.0', 'size.radius.100', 'size.radius.pill'])
  })

  it('leads with the general scales, so a picker offers them before component sizes', () => {
    // Sizing a frame should offer `layout` before `icon.size`; a radius should
    // offer `size.radius` before `button.size.radius`. Figma filters a picker
    // by type and then by scope, so one sequence has to serve every picker.
    const order = sorted([
      'icon.size.100', 'layout.100', 'checkbox.size.width', 'spacing.100',
    ])
    expect(order.indexOf('layout.100')).toBeLessThan(order.indexOf('icon.size.100'))
    expect(order.indexOf('layout.100')).toBeLessThan(order.indexOf('checkbox.size.width'))
    expect(order.indexOf('spacing.100')).toBeLessThan(order.indexOf('icon.size.100'))
  })

  it('puts layout before spacing, and both before radius and border', () => {
    // Radius and border are left in alphabetical order relative to each other.
    // They never share a picker: a corner radius offers only `size.radius`, a
    // stroke weight only `size.border`, so their relative order is invisible.
    expect(sorted(['size.radius.100', 'spacing.100', 'layout.100', 'size.border.100']))
      .toEqual(['layout.100', 'spacing.100', 'size.border.100', 'size.radius.100'])
  })

  it('keeps colour first, so a fill picker opens on the semantic colours', () => {
    const order = sorted(['layout.100', 'color.surface.primary', 'spacing.100'])
    expect(order[0]).toBe('color.surface.primary')
  })

  it('opens a fill picker on surface, then foreground', () => {
    // The two a designer reaches for when painting. The curated list cannot
    // decide this: it is keyed by token name, and a group path is not a token
    // name, so every colour group tied and the tiebreak fell through to the
    // group string. That is alphabetical, which opened the picker on
    // `color.berry`.
    const order = sorted([
      'color.purple.500', 'color.foreground.primary', 'color.berry.500',
      'color.surface.primary', 'color.black.50',
    ])
    expect(order.slice(0, 2))
      .toEqual(['color.surface.primary', 'color.foreground.primary'])
  })

  it('puts the semantics ahead of the primitives they resolve to', () => {
    // A primitive is the fallback, not the default. Ordering them the other way
    // round means scrolling twenty hue ramps to reach `color/surface/primary`.
    const order = sorted([
      'color.black.50', 'color.surface.primary', 'shell.color.surface',
      'action.color.background.base.primary', 'color.teal.500',
    ])
    expect(order).toEqual([
      'color.surface.primary',            // global semantics
      'shell.color.surface',              // app chrome
      'color.black.50',                   // primitives
      'color.teal.500',
      'action.color.background.base.primary', // component semantics, last
    ])
  })

  it('puts the real ramps ahead of the chart palettes', () => {
    // Both are primitives, but a designer picking a colour by hand wants black
    // or blue long before one of the 160 chart swatches. `color.chart` is the
    // longer prefix, so it wins the match for its own subtree, and sits after
    // the catch-all in the list, so it sorts behind it.
    const order = sorted([
      'color.chart.categorical.01', 'color.blue.500',
      'color.chart.sequential.range.01', 'color.black.50',
    ])
    expect(order).toEqual([
      'color.black.50', 'color.blue.500',
      'color.chart.categorical.01', 'color.chart.sequential.range.01',
    ])
  })

  it('lets a named colour group beat the catch-all that also matches it', () => {
    // `color` sits in the primitives band so the hue ramps need no entry each.
    // `color.surface.primary` matches both it and `color.surface`, and has to
    // take the more specific one regardless of which appears first in the list.
    const order = sorted(['color.gold.500', 'color.surface.primary'])
    expect(order[0]).toBe('color.surface.primary')
  })

  it('keeps a component float behind the general scales', () => {
    // The component entries are whole namespaces, so `icon` catches
    // `icon.size.100` as well as any icon colour. Banding them with the colour
    // semantics put a component's floats in front of `layout` and `spacing`.
    const order = sorted([
      'icon.size.100', 'checkbox.size.width', 'layout.100', 'spacing.100',
      'action.color.background.base.primary',
    ])
    expect(order.slice(0, 2)).toEqual(['layout.100', 'spacing.100'])
  })

  it('honours the curated colour order rather than sorting alphabetically', () => {
    // Lifted from the Dialtone 9 file: importance, then intensity, then
    // variants. No sort function can derive this from the names.
    expect(sorted([
      'color.foreground.muted', 'color.foreground.primary',
      'color.foreground.disabled', 'color.foreground.secondary',
    ])).toEqual([
      'color.foreground.primary', 'color.foreground.secondary',
      'color.foreground.muted', 'color.foreground.disabled',
    ])
  })

  it('groups a namespace together rather than interleaving it', () => {
    const order = sorted([
      'color.surface.primary', 'layout.100', 'color.border.default',
      'spacing.100', 'color.foreground.primary',
    ])
    const colours = order.filter(n => n.startsWith('color.'))
    const firstColour = order.indexOf(colours[0])
    const lastColour = order.indexOf(colours[colours.length - 1])
    expect(lastColour - firstColour).toBe(colours.length - 1)
  })

  it('is a stable total order', () => {
    // A comparator that disagrees with itself produces a different collection
    // on every run, and the order cannot be corrected without a rebuild.
    const names = [
      'color.surface.primary', 'layout.100', 'layout.1px', 'spacing.0',
      'size.radius.pill', 'text.body.md.fontSize', 'icon.size.100',
      'opacity.600', 'material.sandstone.50', 'color.purple.1000',
    ]
    const once = sorted(names)
    const twice = sorted([...names].reverse())
    expect(twice).toEqual(once)

    for (const a of names) {
      for (const b of names) {
        // `+ 0` normalises -0, which Object.is treats as distinct from 0.
        expect(Math.sign(compareTokenNames(a, b)) + 0)
          .toBe(-Math.sign(compareTokenNames(b, a)) + 0)
      }
    }
  })

  it('is transitive', () => {
    // The failure this guards against is not hypothetical. A version that chose
    // its rules per pair, using the number for two numeric leaves and the
    // curated position otherwise, was antisymmetric and still wrong: three
    // names formed a cycle, and `Array.sort` put `1000` between `600` and
    // `700`. Every pair looked right when checked on its own.
    const names = [
      // A ramp the old file covers only partly, mixed with a curated group and
      // a named leaf, which is exactly where the cycle appeared.
      'color.black.50', 'color.black.150', 'color.black.200', 'color.black.400',
      'color.foreground.primary', 'color.foreground.muted',
      'color.brand.gold', 'color.neutral.white',
      'size.radius.100', 'size.radius.pill', 'layout.1px', 'layout.25',
    ]

    for (const a of names) {
      for (const b of names) {
        for (const c of names) {
          if (compareTokenNames(a, b) < 0 && compareTokenNames(b, c) < 0) {
            expect(
              compareTokenNames(a, c),
              `${a} < ${b} < ${c}, but ${a} is not before ${c}`,
            ).toBeLessThan(0)
          }
        }
      }
    }
  })

  it('orders a ramp correctly even when the curated list covers it only partly', () => {
    // The old file lists 50, 100, 200 and 400 but not 150 or 250, because the
    // February migration removed its irregular stops. Deferring to it here put
    // the covered steps first and stranded the rest behind them.
    expect(sorted([
      'color.black.400', 'color.black.150', 'color.black.50',
      'color.black.200', 'color.black.100', 'color.black.250',
    ])).toEqual([
      'color.black.50', 'color.black.100', 'color.black.150',
      'color.black.200', 'color.black.250', 'color.black.400',
    ])
  })
})
