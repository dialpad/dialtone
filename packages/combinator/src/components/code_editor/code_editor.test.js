import DtcCodeEditor from './code_editor.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

function createInfo () {
  return {
    displayName: 'DtCard',
    slots: [],
    bindings: {
      get () {
        return [
          {
            name: 'class',
            label: 'class',
            defaultValue: '',
          },
        ];
      },
    },
  };
}

function createOptions (className = '') {
  return {
    attributes: {
      class: className,
    },
    slots: {},
    bindings: {
      get () {
        return {
          class: className,
        };
      },
    },
  };
}

function mountWrapper (className = '') {
  return mount(DtcCodeEditor, {
    props: {
      options: createOptions(className),
      info: createInfo(),
      theme: 'dark',
      verbose: false,
      indentSpaces: 2,
      disabledMembers: new Set(),
    },
    global: {
      stubs: {
        DtButton: {
          template: '<button><slot /><slot name="icon" :icon-size="100" /></button>',
        },
        DtIconBraces: {
          template: '<span />',
        },
        DtIconCheck: {
          template: '<span />',
        },
        DtIconCopy: {
          template: '<span />',
        },
        DtStack: {
          template: '<div><slot /></div>',
        },
      },
    },
  });
}

describe('code_editor.vue test', function () {
  it('Should render native class attributes in generated code', function () {
    const wrapper = mountWrapper('d-w50p');

    expect(wrapper.text()).toContain('class="d-w50p"');
  });

  it('Should not render an empty native class attribute in generated code', function () {
    const wrapper = mountWrapper();

    expect(wrapper.text()).not.toContain('class=""');
  });
});
