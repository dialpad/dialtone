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

describe('FilterPill dropdown-only option fields', () => {
  it('derives disabled, description and group for single-selection rows', () => {
    const typeOptions = Object.freeze([
      Object.freeze({ value: 'all', label: 'All types' }),
      Object.freeze({ value: 'calls', label: 'Calls', disabled: false, description: null, group: null }),
      Object.freeze({
        value: 'archived', label: 'Archived', disabled: true, description: 'Choose All under Status', group: 'Other views',
      }),
    ]);
    const state = getSelectionState(typeOptions, 'all', { useDropdown: true });
    expect(state.rows).toEqual([
      { option: typeOptions[0], disabled: false, description: null, group: null },
      { option: typeOptions[1], disabled: false, description: null, group: null },
      { option: typeOptions[2], disabled: true, description: 'Choose All under Status', group: 'Other views' },
    ]);
    expect(state.issues).toEqual([]);
  });

  it('treats an empty description or group as absent', () => {
    const record = Object.freeze({ value: 'calls', label: 'Calls', description: '', group: '' });
    const state = getSelectionState([record], null, { useDropdown: true });
    expect(state.rows).toEqual([{ option: record, disabled: false, description: null, group: null }]);
  });

  it.each([
    { field: { disabled: 'true' }, issue: 'option disabled must be a boolean or null; malformed values are ignored.' },
    { field: { description: 12 }, issue: 'option description must be a string or null; malformed values are ignored.' },
    { field: { group: ['Other views'] }, issue: 'option group must be a string or null; malformed values are ignored.' },
  ])('ignores a malformed field without invalidating the options: $field', ({ field, issue }) => {
    const record = Object.freeze({ value: 'calls', label: 'Calls', ...field });
    const state = getSelectionState([record], 'calls', { useDropdown: true });
    expect(state.valid).toBe(true);
    expect(state.options).toEqual([record]);
    expect(state.rows).toEqual([{ option: record, disabled: false, description: null, group: null }]);
    expect(state.issues).toEqual([issue]);
  });

  it('groups consecutive rows into sections in data order', () => {
    const records = [
      Object.freeze({ value: 'all', label: 'All types' }),
      Object.freeze({ value: 'archived', label: 'Archived', group: 'Other views' }),
      Object.freeze({ value: 'spam', label: 'Spam', group: 'Other views' }),
      Object.freeze({ value: 'calls', label: 'Calls' }),
    ];
    const state = getSelectionState(records, 'all', { useDropdown: true });
    expect(state.sections).toEqual([
      { group: null, rows: [state.rows[0]] },
      { group: 'Other views', rows: [state.rows[1], state.rows[2]] },
      { group: null, rows: [state.rows[3]] },
    ]);
    expect(state.issues).toEqual([]);
  });

  it('keeps a non-adjacent repeat of a group as its own section and reports it', () => {
    const records = [
      Object.freeze({ value: 'archived', label: 'Archived', group: 'Other views' }),
      Object.freeze({ value: 'calls', label: 'Calls' }),
      Object.freeze({ value: 'spam', label: 'Spam', group: 'Other views' }),
    ];
    const state = getSelectionState(records, null, { useDropdown: true });
    expect(state.sections).toEqual([
      { group: 'Other views', rows: [state.rows[0]] },
      { group: null, rows: [state.rows[1]] },
      { group: 'Other views', rows: [state.rows[2]] },
    ]);
    expect(state.issues).toEqual([
      'option group "Other views" repeats after other options and renders as a separate group.',
    ]);
  });

  it('reports the fields once as ignored in multiple selection without invalidating the options', () => {
    const records = [
      Object.freeze({ value: 'calls', label: 'Calls', disabled: true }),
      Object.freeze({ value: 'archived', label: 'Archived', description: 'Unavailable', group: 'Other views' }),
    ];
    const state = getSelectionState(records, [], { useDropdown: false });
    expect(state.valid).toBe(true);
    expect(state.issues).toEqual(['option disabled, description and group are ignored in multiple selection.']);
  });
});
