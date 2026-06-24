import DtcControlSegmented from './control_segmented.vue';

import { expect } from 'vitest';
import { nextTick } from 'vue';
import {
  mountClearableControl,
  ADD_BUTTON_SELECTOR as addButtonSelector,
  REMOVE_BUTTON_SELECTOR as clearButtonSelector,
} from '@/src/lib/test/utils_test';

const selections = ['100', '200', '300'];
const segmentedControlSelector = '[data-qa="dt-segmented-control"]';
const segmentedItemSelector = '[data-qa="dt-segmented-control-item"]';

describe('control_segmented.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper?.unmount();
    wrapper = mountClearableControl(DtcControlSegmented, {
      value: null,
      validValues: selections,
      ...props,
    });
  };

  beforeEach(function () {
    _mountWrapper();
  });

  afterEach(function () {
    wrapper?.unmount();
  });

  describe('When the value is empty', function () {
    it('Should render the label and add button without the segmented control', function () {
      expect(wrapper.text()).toContain('Label');
      expect(wrapper.find(addButtonSelector).exists()).toBe(true);
      expect(wrapper.find(segmentedControlSelector).exists()).toBe(false);
      expect(wrapper.find(clearButtonSelector).exists()).toBe(false);
    });

    it('Should expand, focus, and collapse on empty focusout', async function () {
      await wrapper.find(addButtonSelector).trigger('click');
      await nextTick();

      const firstItem = wrapper.find(segmentedItemSelector);
      expect(wrapper.find(segmentedControlSelector).exists()).toBe(true);
      expect(firstItem.exists()).toBe(true);
      expect(document.activeElement).toBe(firstItem.element);

      await wrapper.find(segmentedControlSelector).trigger('focusout');

      expect(wrapper.find(segmentedControlSelector).exists()).toBe(false);
      expect(wrapper.find(addButtonSelector).exists()).toBe(true);
    });
  });
});
