import DtcOptionBarSettings from './option_bar_settings.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const settings = {
  root: {
    theme: 'light',
  },
  controls: {
    hideDeprecated: true,
    hideInactive: false,
  },
};

function mountWrapper () {
  return mount(DtcOptionBarSettings, {
    props: {
      settings,
    },
    global: {
      directives: {
        'dt-tooltip': {},
      },
      stubs: {
        DtButton: {
          template: '<button><slot /><slot name="icon" :icon-size="100" /></button>',
        },
        DtIconSettings: {
          template: '<span />',
        },
        DtPopover: {
          template: '<div><slot name="anchor" :attrs="{}" /><slot name="content" /></div>',
        },
        DtStack: {
          template: '<div><slot /></div>',
        },
        DtToggle: {
          name: 'DtToggle',
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template: '<button @click="$emit(\'update:modelValue\', !modelValue)"><slot /></button>',
        },
      },
    },
  });
}

describe('option_bar_settings.vue test', function () {
  it('Should render only the planned control display toggles', function () {
    const wrapper = mountWrapper();

    expect(wrapper.findAllComponents({ name: 'DtToggle' }).map(toggle => toggle.text())).toEqual([
      'Hide Deprecated',
      'Hide Disabled',
    ]);
  });

  it('Should emit a settings updater when a toggle changes', async function () {
    const wrapper = mountWrapper();

    await wrapper.findAllComponents({ name: 'DtToggle' })[0].trigger('click');

    const updater = wrapper.emitted('update:settings')[0][0];
    const model = structuredClone(settings);
    updater(model);

    expect(model.controls.hideDeprecated).toBe(false);
  });
});
