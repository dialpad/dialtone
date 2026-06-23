import DtcControlSelection from './control_selection.vue';

import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';

const selections = ['selection1', 'selection2', 'selection3'];

const manySelections = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'epsilon',
  'zeta',
  'eta',
];

const inputValue = selections[1];

describe('control_selection.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper = shallowMount(DtcControlSelection, {
      props: {
        value: inputValue,
        validValues: selections,
        ...props,
      },
    });
  };

  beforeAll(function () {
    _mountWrapper();
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('When rendering options', function () {
    describe('Should create an option for each selection', function () {
      selections.forEach((selection) => {
        it(`Should have a computed option for selection '${selection}'`, function () {
          expect(wrapper.vm.options.some((o) => o.value === selection)).toBe(
            true,
          );
        });
      });
    });

    describe('When a value is provided', function () {
      it('Should display the label for the selected value', function () {
        expect(wrapper.vm.selectedLabel).toBe(inputValue.toString());
      });
    });

    it('Should not include a clear option in the dropdown', function () {
      _mountWrapper({ defaultValue: selections[0] });

      expect(wrapper.vm.options.some((option) => option.value === null)).toBe(false);
    });

    it('Should display a non-breaking space when the selection is empty', function () {
      _mountWrapper({ value: null });

      expect(wrapper.vm.selectedLabel).toBe('\u00A0');
    });

    it('Should disable the clear button for required selections', function () {
      _mountWrapper({ required: true });

      expect(wrapper.vm.clearDisabled).toBe(true);
    });

    it('Should hide the clear button when selection is not clearable', function () {
      _mountWrapper({ clearable: false });

      expect(wrapper.vm.clearDisabled).toBe(true);
      expect(wrapper.vm.clearHidden).toBe(true);
    });
  });

  describe('Search visibility', function () {
    it('Should not show search when options count is at or below threshold', function () {
      _mountWrapper({ validValues: selections }); // 3 options
      expect(wrapper.vm.showSearch).toBe(false);
    });

    it('Should not show search when options count equals threshold', function () {
      // defaultValue suppresses the prepended null option, giving exactly 5 options
      _mountWrapper({
        validValues: ['a', 'b', 'c', 'd', 'e'],
        defaultValue: 'a',
      });
      expect(wrapper.vm.showSearch).toBe(false);
    });

    it('Should show search when options count exceeds threshold', function () {
      // defaultValue suppresses the prepended null option, giving exactly 7 options
      _mountWrapper({
        validValues: manySelections,
        defaultValue: manySelections[0],
      });
      expect(wrapper.vm.showSearch).toBe(true);
    });
  });

  describe('Search filtering', function () {
    beforeEach(function () {
      _mountWrapper({
        validValues: manySelections,
        defaultValue: manySelections[0],
      });
    });

    it('Should return all options when query is empty', function () {
      wrapper.vm.query = '';
      expect(wrapper.vm.filteredOptions.length).toBe(wrapper.vm.options.length);
    });

    it('Should filter options by label', function () {
      wrapper.vm.query = 'alp';
      expect(wrapper.vm.filteredOptions).toHaveLength(1);
      expect(wrapper.vm.filteredOptions[0].value).toBe('alpha');
    });

    it('Should be case-insensitive', function () {
      wrapper.vm.query = 'ALPHA';
      expect(wrapper.vm.filteredOptions).toHaveLength(1);
      expect(wrapper.vm.filteredOptions[0].value).toBe('alpha');
    });

    it('Should return an empty list when no options match', function () {
      wrapper.vm.query = 'zzz';
      expect(wrapper.vm.filteredOptions).toHaveLength(0);
    });
  });

  describe('Keyboard handling', function () {
    let closeSpy;

    beforeEach(function () {
      _mountWrapper({
        validValues: manySelections,
        defaultValue: manySelections[0],
      });
      closeSpy = vi.fn();
    });

    it('Enter selects the first enabled option and closes', function () {
      wrapper.vm.query = 'alp';
      wrapper.vm.onSearchKeydown(
        { key: 'Enter', stopPropagation: vi.fn(), preventDefault: vi.fn() },
        closeSpy,
      );
      expect(closeSpy).toHaveBeenCalled();
    });

    it('Escape closes the dropdown', function () {
      wrapper.vm.onSearchKeydown(
        { key: 'Escape', stopPropagation: vi.fn(), preventDefault: vi.fn() },
        closeSpy,
      );
      expect(closeSpy).toHaveBeenCalled();
    });

    it('Enter does nothing when no options match', function () {
      wrapper.vm.query = 'zzz';
      wrapper.vm.onSearchKeydown(
        { key: 'Enter', stopPropagation: vi.fn(), preventDefault: vi.fn() },
        closeSpy,
      );
      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('selectFirst', function () {
    beforeEach(function () {
      _mountWrapper({
        validValues: manySelections,
        defaultValue: manySelections[0],
        disabledValues: new Set(['alpha']),
      });
    });

    it('Should skip disabled options and select the first enabled one', function () {
      wrapper.vm.query = '';
      const closeSpy = vi.fn();
      wrapper.vm.selectFirst(closeSpy);
      // 'alpha' is disabled — next enabled is 'beta'
      const emitted = wrapper.emitted('update:value');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0]).toBe('beta');
    });
  });
});
