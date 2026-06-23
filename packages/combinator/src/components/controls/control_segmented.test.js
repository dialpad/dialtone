import DtcControlSegmented from './control_segmented.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

const selections = ['100', '200', '300'];
const addButtonSelector = '[aria-label="Add value"]';
const clearButtonSelector = '[aria-label="Remove value"]';
const segmentedControlSelector = '[data-qa="dt-segmented-control"]';
const segmentedItemSelector = '[data-qa="dt-segmented-control-item"]';

describe('control_segmented.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper?.unmount();
    wrapper = mount(DtcControlSegmented, {
      attachTo: document.body,
      props: {
        value: null,
        validValues: selections,
        ...props,
      },
      slots: {
        default: 'Label',
      },
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
