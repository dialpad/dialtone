import { staleOverrides } from './stale_overrides.js'

describe('staleOverrides', () => {
  it('flags an existing override absent from the wanted set as stale', () => {
    const existing = { 'var/1': { 'mode/light': { r: 1, g: 0, b: 0, a: 1 } } }
    const wanted = new Map()

    expect(staleOverrides(existing, wanted, [])).toEqual([
      { variableId: 'var/1', modeId: 'mode/light' },
    ])
  })

  it('does not flag an override that is still wanted', () => {
    const existing = { 'var/1': { 'mode/light': { r: 1, g: 0, b: 0, a: 1 } } }
    const wanted = new Map([['var/1/mode/light', { variableId: 'var/1', modeId: 'mode/light', value: {} }]])

    expect(staleOverrides(existing, wanted, [])).toEqual([])
  })

  it('flags nothing at all when any override could not be addressed this run', () => {
    // The actual bug this guards: a renamed mode (or any lookup failure)
    // makes a genuinely-still-wanted override fall out of `wanted` for the
    // wrong reason. Without the guard, this would return the override below
    // as stale and queue it for deletion — exactly reproduced against a real
    // addressing failure before this fix existed.
    const existing = { 'var/1': { 'mode/light': { r: 1, g: 0, b: 0, a: 1 } } }
    const wanted = new Map()
    const unaddressable = ['some.token [light]']

    expect(staleOverrides(existing, wanted, unaddressable)).toEqual([])
  })
})
