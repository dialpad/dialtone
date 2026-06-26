import DtcControlSuggestion from './control_suggestion.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

function mountWrapper (props = {}) {
  return mount(DtcControlSuggestion, {
    props: {
      label: 'Suggestion',
      value: 'default',
      suggestions: ['default', 'subtle'],
      ...props,
    },
    global: {
      stubs: {
        DtcControlString: {
          name: 'DtcControlString',
          props: {
            label: {
              type: String,
              default: '',
            },
            value: {
              type: [String, null],
              default: null,
            },
            required: {
              type: Boolean,
              default: false,
            },
            clearable: {
              type: Boolean,
              default: true,
            },
          },
          template: '<div />',
        },
        DtRecipeComboboxWithPopover: {
          template: `
            <div>
              <slot
                name="input"
                :input-props="{}"
                :on-input="() => {}"
              />
              <slot
                name="list"
                :list-props="{}"
              />
            </div>
          `,
        },
        DtListItem: {
          template: '<li><slot /></li>',
        },
      },
    },
  });
}

describe('control_suggestion.vue test', function () {
  it('Should forward shared clearable state to the string control', function () {
    const wrapper = mountWrapper({
      value: null,
      required: true,
      clearable: true,
    });

    const stringControl = wrapper.findComponent({ name: 'DtcControlString' });

    expect(stringControl.props('value')).toBe(null);
    expect(stringControl.props('required')).toBe(true);
    expect(stringControl.props('clearable')).toBe(true);
  });
});
