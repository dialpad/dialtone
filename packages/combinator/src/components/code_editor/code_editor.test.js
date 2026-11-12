import DtcCodeEditor from './code_editor.vue';
import JSON5 from 'json5-with-undefined';

import { expect } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { reactive } from 'vue';
import { DtFilterPill } from '@dialpad/dialtone-vue';
import allDocs from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import { buildVariantState, computeDisabledMembers } from '@/src/lib/variant_state';
import filterPillVariants from '@/src/variants/variants_filter_pill';

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

function mountWrapper (className = '', attachTo) {
  return mount(DtcCodeEditor, {
    attachTo,
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
  it('omits the legacy model from controlled clipboard formats', async () => {
    const state = buildVariantState(DtFilterPill,
      allDocs.find(doc => doc.displayName === 'DtFilterPill'), filterPillVariants, 'controlled default');
    const wrapper = mountWrapper();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    vi.useFakeTimers();
    try {
      await wrapper.setProps({
        ...state,
        verbose: true,
        devMode: true,
        hasChanges: true,
        disabledMembers: computeDisabledMembers(state.info, state.options.props, state.options.slots),
      });
      await wrapper.findAll('button').find(button => button.text() === 'Copy').trigger('click');
      expect(writeText.mock.calls[0][0]).not.toContain('model-value=');
      expect(writeText.mock.calls[0][0]).toContain('<!-- Configuration snapshot. Bind selected with v-model:selected');
      await wrapper.findAll('button')
        .find(button => button.text().replace(/\s+/g, ' ') === 'Copy JSON').trigger('click');
      const preset = Object.values(JSON5.parse(`{${writeText.mock.calls.at(-1)[0]}}`))[0];
      expect(preset.props).not.toHaveProperty('modelValue');
      expect(preset.props.selected).toEqual({ initialValue: 'all' });
      expect(preset.metadata.copyNotice).toContain('v-model:selected');
      expect(preset.metadata.lookupExclude.owner).toMatch(/\S/);
      await vi.runAllTimersAsync();
    } finally {
      wrapper.unmount();
      vi.useRealTimers();
      vi.unstubAllGlobals();
    }
  });

  it.each(['', null])('roundtrips scalar %j and empty neutral identity through Copy JSON', async selected => {
    const doc = allDocs.find(doc => doc.displayName === 'DtFilterPill');
    const bank = {
      ...filterPillVariants,
      fixture: { props: {
        options: { initialValue: [{ value: '', label: 'All outcomes' }, { value: 'resolved', label: 'Resolved' }] },
        selected: { initialValue: selected }, neutralValue: { initialValue: '' },
        useDropdown: { initialValue: true }, label: { initialValue: 'Outcome' },
      } },
    };
    const state = buildVariantState(DtFilterPill, doc, bank, 'fixture');
    const editor = mountWrapper();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { language: 'en-US', languages: ['en-US'], clipboard: { writeText } });
    vi.useFakeTimers();
    let pill;
    try {
      await editor.setProps({ ...state, devMode: true, hasChanges: true,
        disabledMembers: computeDisabledMembers(state.info, state.options.props, state.options.slots) });
      await editor.findAll('button')
        .find(button => button.text().replace(/\s+/g, ' ') === 'Copy JSON').trigger('click');
      const preset = Object.values(JSON5.parse(`{${writeText.mock.calls.at(-1)[0]}}`))[0];
      expect(preset.props.selected).toEqual({ initialValue: selected });
      expect(preset.props.neutralValue).toEqual({ initialValue: '' });
      expect(preset.props).not.toHaveProperty('startTooltipText');
      const recovered = buildVariantState(DtFilterPill, doc, { ...filterPillVariants, recovered: preset }, 'recovered');
      const disabled = computeDisabledMembers(recovered.info, recovered.options.props, recovered.options.slots);
      pill = mount(DtFilterPill, { attachTo: document.body,
        props: { ...Object.fromEntries(Object.entries(recovered.options.props).filter(([name]) =>
          !disabled.has(name))),
        'onUpdate:selected': value => pill.setProps({ selected: value }) },
        global: { directives: { 'dt-focustrap': {} } },
      });
      await pill.get('[data-qa="dt-filter-pill__button"]').trigger('click');
      await flushPromises();
      const menu = document.getElementById(pill.get('[data-qa="dt-filter-pill__button"]').attributes('aria-controls'));
      expect(menu.querySelector('[role="menuitemradio"]').getAttribute('aria-checked')).toBe(String(selected === ''));
      menu.querySelectorAll('[role="menuitemradio"]')[1].click();
      await flushPromises();
      await pill.get('[data-qa="dt-filter-pill__clear-button"]').trigger('click');
      expect(pill.emitted('update:selected').at(-1)).toEqual(['']);
      await pill.get('[data-qa="dt-filter-pill__button"]').trigger('click');
      await flushPromises();
      expect(menu.querySelector('[role="menuitemradio"]').getAttribute('aria-checked')).toBe('true');
      expect(pill.get('.d-filter-pill__label-start').text()).toBe('All outcomes');
      await pill.get('[data-qa="dt-filter-pill__button"]').trigger('click');
      await flushPromises();
      await vi.runAllTimersAsync();
    } finally {
      pill?.unmount();
      editor.unmount();
      vi.useRealTimers();
      vi.unstubAllGlobals();
    }
  });

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
  it('keeps editing focus when default-slot scope changes', async () => {
    const options = reactive({
      slots: { default: '{{ label }}' },
      bindings: { get: () => ({}) },
    });
    const wrapper = mountWrapper('', document.body);
    try {
      await wrapper.setProps({
        info: {
          displayName: 'DtFilterPill',
          slots: [{ name: 'default', bindings: [{ name: 'label' }] }],
          bindings: { get: () => [] },
        },
        options,
        'onUpdate:options': update => update(options),
      });
      const input = wrapper.find('[contenteditable]');
      input.element.focus();
      for (const content of ['Plain text', '{{ label }}']) {
        input.element.textContent = content;
        await input.trigger('input');
        expect(wrapper.find('[contenteditable]').element).toBe(input.element);
        expect(document.activeElement).toBe(input.element);
      }
    } finally {
      wrapper.unmount();
    }
  });

  it.each([
    { name: 'simple', info: createInfo(), options: createOptions(), disabled: [], expected: '<dt-card />' },
    {
      name: 'scoped slots and excluded members',
      info: {
        displayName: 'DtButton',
        slots: [
          { name: 'startIcon', bindings: [{ name: 'icon-size' }] },
          { name: 'default', bindings: [{ name: 'label' }] },
          { name: 'hidden' },
        ],
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
      name: 'scoped default slot',
      info: {
        displayName: 'DtFilterPill',
        slots: [{ name: 'default', bindings: [{ name: 'label' }, { name: 'active-filters' }] }],
        bindings: { get: () => [] },
      },
      options: {
        slots: { default: '<strong>{{ label }}: {{ activeFilters.length }}</strong>' },
        bindings: { get: () => ({}) },
      },
      disabled: [],
      displayedScope: '#default="{ label, activeFilters }"',
      expected: '<dt-filter-pill>\n  <template #default="{ label, activeFilters }">\n' +
        '    <strong>{{ label }}: {{ activeFilters.length }}</strong>\n' +
        '  </template>\n</dt-filter-pill>',
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
      copyJson: true,
      expected: '<dt-dropdown>\n  <template #anchor="anchorAttrs">\n' +
        '    <dt-button\n' +
        '  :aria-expanded="anchorAttrs[\'aria-expanded\']"\n' +
        '  :aria-controls="anchorAttrs[\'aria-controls\']"\n' +
        '  :aria-haspopup="anchorAttrs[\'aria-haspopup\']"\n' +
        '>\n  Actions\n</dt-button>\n' +
        '  </template>\n</dt-dropdown>',
    },
  ])('preserves actual clipboard output for $name', async ({
    info, options, disabled, expected, displayedScope, copyJson,
  }) => {
    const wrapper = mountWrapper();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    vi.useFakeTimers();
    try {
      await wrapper.setProps({
        info,
        options,
        disabledMembers: new Set(disabled),
        devMode: Boolean(copyJson),
        hasChanges: Boolean(copyJson),
      });
      if (displayedScope) expect.soft(wrapper.text()).toContain(displayedScope);
      await wrapper.findAll('button').find(button => button.text() === 'Copy').trigger('click');
      expect.soft(writeText.mock.calls[0][0]).toBe(expected);
      if (copyJson) {
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
