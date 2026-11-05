import DtcCodeEditor from './code_editor.vue';
import JSON5 from 'json5-with-undefined';

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

  it.each([false, true])('omits removed values from displayed and copied examples (verbose=%s)', async verbose => {
    const wrapper = mountWrapper();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    vi.useFakeTimers();
    try {
      await wrapper.setProps({
        verbose,
        info: {
          displayName: 'DtText',
          slots: [],
          bindings: { get: () => [
            { name: 'maxLines', label: 'max-lines', defaultValue: null },
            { name: 'progress', label: 'progress', defaultValue: 1 },
            { name: 'disabled', label: 'disabled', defaultValue: true },
          ] },
        },
        options: {
          slots: {},
          bindings: { get: () => ({ maxLines: undefined, progress: 0, disabled: false }) },
        },
      });
      expect(wrapper.text()).not.toContain('max-lines');
      expect(wrapper.text()).toContain(':progress="0"');
      expect(wrapper.text()).toContain(':disabled="false"');
      await wrapper.findAll('button').find(button => button.text() === 'Copy').trigger('click');
      const copied = writeText.mock.calls[0][0];
      expect(copied).not.toContain('max-lines');
      expect(copied).toContain(':progress="0"');
      expect(copied).toContain(':disabled="false"');
      await vi.runAllTimersAsync();
    } finally {
      wrapper.unmount();
      vi.useRealTimers();
      vi.unstubAllGlobals();
    }
  });
  it.each([
    { name: 'simple', info: createInfo(), options: createOptions(), disabled: [], expected: '<dt-card />' },
    {
      name: 'scoped slots and excluded members',
      info: {
        displayName: 'DtButton',
        slots: [{ name: 'startIcon', bindings: [{ name: 'icon-size' }] }, { name: 'default' }, { name: 'hidden' }],
        bindings: { get: () => [{ name: 'disabled', label: 'disabled', defaultValue: false }] },
      },
      options: {
        slots: { startIcon: '<dt-icon-wrench :size="iconSize" />', default: 'Save', hidden: 'Hidden' },
        bindings: { get: () => ({ disabled: true }) },
      },
      disabled: ['hidden'],
      expected: '<dt-button\n  disabled\n>\n' +
        '  <template #startIcon="{ iconSize }">\n    <dt-icon-wrench :size="iconSize" />\n' +
        '  </template>\n  Save\n</dt-button>',
    },
    {
      name: 'raw scoped-slot alias',
      info: {
        displayName: 'DtDropdown',
        slots: [{
          name: 'anchor',
          scopeName: 'anchorAttrs',
          bindings: [{ name: 'ref' }, { name: 'aria-expanded' }, { name: 'aria-controls' }, { name: 'aria-haspopup' }],
        }],
        bindings: { get: () => [] },
      },
      options: {
        slots: {
          anchor: '<dt-button\n' +
            '  :aria-expanded="anchorAttrs[\'aria-expanded\']"\n' +
            '  :aria-controls="anchorAttrs[\'aria-controls\']"\n' +
            '  :aria-haspopup="anchorAttrs[\'aria-haspopup\']"\n' +
            '>\n  Actions\n</dt-button>',
        },
        bindings: { get: () => ({}) },
      },
      disabled: [],
      displayedScope: '#anchor="anchorAttrs"',
      expected: '<dt-dropdown>\n  <template #anchor="anchorAttrs">\n' +
        '    <dt-button\n' +
        '  :aria-expanded="anchorAttrs[\'aria-expanded\']"\n' +
        '  :aria-controls="anchorAttrs[\'aria-controls\']"\n' +
        '  :aria-haspopup="anchorAttrs[\'aria-haspopup\']"\n' +
        '>\n  Actions\n</dt-button>\n' +
        '  </template>\n</dt-dropdown>',
    },
  ])('preserves actual clipboard output for $name', async ({ info, options, disabled, expected, displayedScope }) => {
    const wrapper = mountWrapper();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    vi.useFakeTimers();
    try {
      await wrapper.setProps({
        info,
        options,
        disabledMembers: new Set(disabled),
        devMode: Boolean(displayedScope),
        hasChanges: Boolean(displayedScope),
      });
      if (displayedScope) expect.soft(wrapper.text()).toContain(displayedScope);
      await wrapper.findAll('button').find(button => button.text() === 'Copy').trigger('click');
      expect.soft(writeText.mock.calls[0][0]).toBe(expected);
      if (displayedScope) {
        await wrapper.findAll('button')
          .find(button => button.text().replace(/\s+/g, ' ') === 'Copy JSON').trigger('click');
        const preset = Object.values(JSON5.parse(`{${writeText.mock.calls.at(-1)[0]}}`))[0];
        expect(preset.slots.anchor).toEqual({
          initialValue: options.slots.anchor,
          scopeName: 'anchorAttrs',
        });
      }
      await vi.runAllTimersAsync();
    } finally {
      wrapper.unmount();
      vi.useRealTimers();
      vi.unstubAllGlobals();
    }
  });

});
