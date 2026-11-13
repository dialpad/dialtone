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
    { selected: new Array(1), useDropdown: false },
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

  it.each([
    { options: [{ value: 2, label: 'Invalid value' }] }, { options: [{ value: 'x', label: null }] },
    { options: [{ value: 'x', label: 'X', shortLabel: 12 }] }, { options: new Array(1) },
  ])(
    'rejects malformed option arrays: %j', ({ options: invalidOptions }) => {
      const state = getSelectionState(invalidOptions, [], { useDropdown: false });
      expect(state.valid).toBe(false);
      expect(state.options).toEqual([]);
    },
  );

  it('rejects a non-string single neutral value', () => {
    const state = getSelectionState(options, 'a', { useDropdown: true, neutralValue: 0 });
    expect(state.valid).toBe(false);
    expect(state.issues).toContain('neutralValue must be a string or null in single selection.');
  });

  it.each([undefined, null])('treats absent nullable optional fields (%j) as omitted', optional => {
    const record = Object.freeze({ value: 'a', label: 'A', shortLabel: optional });
    const state = getSelectionState(Object.freeze([record]), 'a', { useDropdown: true, neutralValue: optional });
    expect(state.valid).toBe(true);
    expect(state.isActive).toBe(true);
    expect(state.issues).toEqual([]);
    expect(state.selectedOptions[0].label).toBe('A');
    expect(record.shortLabel).toBe(optional);
    expect(getSelectionState(options, ['a'], { neutralValue: optional }).issues).toEqual([]);
  });

  it('preserves meaningful empty optional strings', () => {
    const state = getSelectionState([{ value: '', label: 'All', shortLabel: '' }], '', {
      useDropdown: true, neutralValue: '',
    });
    expect(state.valid).toBe(true);
    expect(state.isActive).toBe(false);
    expect(state.selectedOptions[0].shortLabel).toBe('');
  });

});
