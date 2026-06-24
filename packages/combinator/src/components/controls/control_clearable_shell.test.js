import DtcControlClearableShell from './control_clearable_shell.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const addButtonSelector = '[aria-label="Add value"]';
const removeButtonSelector = '[aria-label="Remove value"]';
const expandedContentSelector = '[data-qa="expanded-content"]';

describe('control_clearable_shell.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper?.unmount();
    wrapper = mount(DtcControlClearableShell, {
      props: {
        empty: true,
        ...props,
      },
      slots: {
        label: 'Label',
        default: '<div data-qa="expanded-content">Expanded</div>',
      },
    });
  };

  afterEach(function () {
    wrapper?.unmount();
  });

  it.each([
    { disabled: true },
    { disabled: true, clearable: false },
  ])('Should collapse empty disabled controls with a visible disabled add button (%o)', function (props) {
    _mountWrapper(props);

    const addButton = wrapper.find(addButtonSelector);
    expect(wrapper.text()).toContain('Label');
    expect(addButton.exists()).toBe(true);
    expect(addButton.attributes('disabled')).toBeDefined();
    expect(addButton.classes()).not.toContain('d-o0');
    expect(wrapper.find(expandedContentSelector).exists()).toBe(false);
  });

  it('Should show a disabled remove button for non-clearable expanded controls', function () {
    _mountWrapper({ empty: false, clearable: false });

    const removeButton = wrapper.find(removeButtonSelector);
    expect(wrapper.find(expandedContentSelector).exists()).toBe(true);
    expect(removeButton.exists()).toBe(true);
    expect(removeButton.attributes('disabled')).toBeDefined();
    expect(removeButton.classes()).not.toContain('d-o0');
  });
});
