import { getSelectionState } from './FilterPillSelection';

const options = Object.freeze([
  Object.freeze({ value: '', label: 'All' }),
  Object.freeze({ value: 'a', label: 'Duplicate label' }),
  Object.freeze({ value: 'b', label: 'Duplicate label' }),
]);

describe('FilterPill controlled input normalization', () => {
  it.each([
    { selected: [], useDropdown: true },
    { selected: 12, useDropdown: true },
    { selected: null, useDropdown: false },
    { selected: 'a', useDropdown: false },
    { selected: ['a', 12], useDropdown: false },
  ])('rejects the wrong selection shape: %j', ({ selected, useDropdown }) => {
    const state = getSelectionState(options, selected, { useDropdown });
    expect(state.valid).toBe(false);
    expect(state.issues).toContain('selected has the wrong shape for this selection pattern.');
  });

  it('deduplicates an owned multiple snapshot without rewriting consumer order or input', () => {
    const selected = Object.freeze(['b', 'a', 'b']);
    const state = getSelectionState(options, selected, { useDropdown: false });
    expect(state.valid).toBe(true);
    expect(state.value).toEqual(['b', 'a']);
    expect(selected).toEqual(['b', 'a', 'b']);
    expect(state.issues).toEqual(['selected contains duplicate values.']);
    expect(state.selectedOptions.map(option => option.value)).toEqual(['a', 'b']);
    expect(Object.isFrozen(state.selectedOptions[0])).toBe(true);
  });

  it.each([{ value: 2, label: 'Invalid value' }, { value: 'x', label: null }, { value: 'x', label: 'X', shortLabel: 12 }])(
    'rejects malformed option records: %j', option => {
      const state = getSelectionState([option], [], { useDropdown: false });
      expect(state.valid).toBe(false);
      expect(state.options).toEqual([]);
    },
  );

  it.each([null, 0, false])('rejects a non-string single neutral value: %j', neutralValue => {
    const state = getSelectionState(options, 'a', { useDropdown: true, neutralValue });
    expect(state.valid).toBe(false);
    expect(state.issues).toContain('neutralValue must be a string in single selection.');
  });

});
