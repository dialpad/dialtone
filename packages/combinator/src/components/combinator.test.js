import DtcCombinator from './combinator.vue';

import { expect } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import { markRaw, nextTick } from 'vue';
import { getSupportedComponents } from '@/src/lib/test/utils_test';
import { DtButton, DtCard, DtFilterPill, DtInput, DtToggle } from '@dialpad/dialtone-vue';
import allDocs from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import variants from '@/src/variants/variants';
import filterPillVariants from '@/src/variants/variants_filter_pill';

const documentation = allDocs;
const buttonDoc = allDocs.find(d => d.displayName === 'DtButton');
const cardDoc = allDocs.find(d => d.displayName === 'DtCard');
const toggleDoc = allDocs.find(d => d.displayName === 'DtToggle');
const inputDoc = allDocs.find(d => d.displayName === 'DtInput');
const variantBank = variants();

function shallowMountCombinator (options) {
  return shallowMount(DtcCombinator, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ...options.global?.stubs,
        teleport: false,
      },
    },
  });
}

describe('combinator.vue test', function () {
  it('edits controlled scalar and array values with a locked pattern selector', async () => {
    const doc = allDocs.find(doc => doc.displayName === 'DtFilterPill');
    const wrapper = mount(DtcCombinator, {
      attachTo: document.body,
      props: {
        component: markRaw(DtFilterPill),
        documentation: {
          ...doc,
          props: doc.props.filter(prop => ['selected', 'useDropdown'].includes(prop.name)),
          slots: [],
          events: [],
        },
        variants: filterPillVariants,
      },
      global: {
        directives: { 'dt-focustrap': {}, 'dt-scrollbar': {} },
        stubs: { DtcRenderer: true, DtcCodePanel: true, DtInput: true, DtSelectMenu: true },
      },
    });
    try {
      const control = label => wrapper.findAllComponents({ name: 'DtcOptionBarControl' })
        .find(control => control.props('label') === label);
      expect(control('selected').findComponent({ name: 'DtcControlString' }).exists()).toBe(true);
      expect(control('selected').props('validControls')).toContain('null');
      expect(control('selected').props('validControls')).not.toContain('array');
      expect(control('use-dropdown').get('[role="switch"]').element.disabled).toBe(true);
      await wrapper.findAll('button').find(button => button.text().includes('DtFilterPill:')).trigger('click');
      await wrapper.findAllComponents({ name: 'DtListItem' })
        .find(item => item.text() === 'controlled multiple').trigger('click');
      expect(control('selected').findComponent({ name: 'DtcControlArray' }).exists()).toBe(true);
      expect(control('selected').props('validControls')).not.toContain('string');
      expect(control('selected').props('value')).toEqual(['phone']);
    } finally {
      wrapper.unmount();
    }
  });

  it('preserves an unrelated input instance across preset selection and Reset without bank metadata', async () => {
    const wrapper = mount(DtcCombinator, {
      attachTo: document.body,
      props: {
        component: markRaw(DtInput),
        documentation: inputDoc,
        variants: {
          default: { props: { modelValue: { initialValue: 'Alpha' }, label: { initialValue: 'Name' } } },
          Beta: { props: { modelValue: { initialValue: 'Beta' }, label: { initialValue: 'Name' } } },
        },
      },
      global: {
        directives: { 'dt-focustrap': {} },
        stubs: { DtcOptionBar: true, DtcCodePanel: true },
      },
    });
    try {
      await nextTick();
      await nextTick();
      const input = wrapper.get('input').element;
      await wrapper.findAll('button').find(button => button.text().includes('DtInput:')).trigger('click');
      const preset = wrapper.findAllComponents({ name: 'DtListItem' }).find(item => item.text() === 'Beta');
      await preset.trigger('click');
      expect(wrapper.get('input').element).toBe(input);
      expect(input.value).toBe('Beta');
      await wrapper.get('[aria-label="Reset"]').trigger('click');
      expect(wrapper.get('input').element).toBe(input);
      expect(input.value).toBe('Alpha');
    } finally {
      wrapper.unmount();
    }
  });

  it('resets an edited grid cell to its owned preset values', async () => {
    const wrapper = mount(DtcCombinator, {
      attachTo: document.body,
      props: {
        component: markRaw(DtFilterPill),
        documentation: allDocs.find(doc => doc.displayName === 'DtFilterPill'),
        variants: filterPillVariants,
      },
      global: {
        directives: { 'dt-focustrap': {} },
        stubs: { DtcOptionBar: true, DtcCodePanel: true },
      },
    });
    try {
      await wrapper.get('[aria-label="Toggle spec sheet view"]').trigger('click');
      await nextTick();
      await nextTick();
      const cell = () => wrapper.findAllComponents({ name: 'DtcRendererSpecSheetCell' })
        .find(cell => cell.props('name') === 'default');
      expect(cell().text()).toContain('Option 3');
      const first = cell().get('[data-qa="dt-filter-pill__button"]').element;
      await cell().get('[data-qa="dt-filter-pill__clear-button"]').trigger('click');
      expect(cell().text()).not.toContain('Option 3');
      expect(cell().get('[data-qa="dt-filter-pill__button"]').element).toBe(first);
      await wrapper.get('[aria-label="Reset"]').trigger('click');
      expect(cell().text()).toContain('Option 3');
      expect(cell().get('[data-qa="dt-filter-pill__button"]').element).not.toBe(first);
    } finally {
      wrapper.unmount();
    }
  });

  it('resets a controlled preview to its canonical neutral value with a new component instance', async () => {
    const wrapper = mount(DtcCombinator, {
      attachTo: document.body,
      props: {
        component: markRaw(DtFilterPill),
        documentation: allDocs.find(doc => doc.displayName === 'DtFilterPill'),
        variants: filterPillVariants,
      },
      global: {
        directives: { 'dt-focustrap': {} },
        stubs: { DtcOptionBar: true, DtcCodePanel: true },
      },
    });
    try {
      await nextTick();
      await nextTick();
      expect(wrapper.find('[aria-label="Reset"]').exists()).toBe(false);
      expect(wrapper.vm.selectedVariant).toBe('controlled default');
      const anchor = () => wrapper.get('[data-qa="dt-filter-pill__button"]');
      const first = anchor().element;
      const optionBar = wrapper.findComponent({ name: 'DtcOptionBar' });
      optionBar.vm.$emit('update:options', model => { model.props.selected = 'unread'; });
      await nextTick();
      expect(wrapper.get('.d-filter-pill__label-start').text()).toBe('Unread');
      expect(anchor().element).toBe(first);
      await wrapper.get('[aria-label="Reset"]').trigger('click');
      expect(wrapper.get('.d-filter-pill__label-start').text()).toBe('All');
      expect(anchor().element).not.toBe(first);
      expect(wrapper.vm.selectedVariant).toBe('controlled default');
      expect(wrapper.find('[aria-label="Reset"]').exists()).toBe(false);
    } finally {
      wrapper.unmount();
    }
  });

  const testComponents = getSupportedComponents();

  let wrapper;

  afterEach(function () {
    window.localStorage.clear();
  });

  describe(`Supported component tests`, function () {
    testComponents.forEach(component => {
      describe(`When mounted with component '${component.name}'`, function () {
        beforeEach(function () {
          wrapper = shallowMountCombinator({
            props: {
              component,
              documentation,
              variants: {},
            },
          });
        });

        afterEach(function () {
          wrapper.unmount();
        });

        it('Should render successfully', function () {
          expect(wrapper.exists()).toBe(true);
        });
      });
    });
  });

  describe('v-model writeback', function () {
    describe('boolean modelValue (DtToggle)', function () {
      beforeEach(function () {
        wrapper = shallowMountCombinator({
          props: {
            component: DtToggle,
            documentation: toggleDoc,
            variants: {},
          },
        });
      });

      afterEach(function () {
        wrapper.unmount();
      });

      it('updates options.props when the renderer emits an update:modelValue event', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });
        const initialValue = renderer.props('options').props.modelValue;

        await renderer.vm.$emit('event', 'update:modelValue', !initialValue);
        await nextTick();

        expect(renderer.props('options').props.modelValue).toBe(!initialValue);
      });

      it('does not mutate options.props for non-update events (e.g. "change")', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });
        const before = JSON.stringify(renderer.props('options').props);

        await renderer.vm.$emit('event', 'change', 'something');
        await nextTick();

        expect(JSON.stringify(renderer.props('options').props)).toBe(before);
      });
    });

    describe('string modelValue (DtInput)', function () {
      beforeEach(function () {
        wrapper = shallowMountCombinator({
          props: {
            component: DtInput,
            documentation: inputDoc,
            variants: {},
          },
        });
      });

      afterEach(function () {
        wrapper.unmount();
      });

      it('updates options.props when the renderer emits an update:modelValue event', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });

        await renderer.vm.$emit('event', 'update:modelValue', 'hello');
        await nextTick();

        expect(renderer.props('options').props.modelValue).toBe('hello');
      });

      it('reflects subsequent updates (simulates typing character by character)', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });

        for (const value of ['h', 'he', 'hel', 'hell', 'hello']) {
          await renderer.vm.$emit('event', 'update:modelValue', value);
          await nextTick();
        }

        expect(renderer.props('options').props.modelValue).toBe('hello');
      });
    });
  });

  describe('component changes', function () {
    beforeEach(function () {
      wrapper = shallowMountCombinator({
        props: {
          component: DtButton,
          documentation: buttonDoc,
          variants: variantBank.DtButton,
        },
      });
    });

    afterEach(function () {
      wrapper.unmount();
    });

    it('resets the active preset and options when the target component changes', async function () {
      wrapper.vm.updateVariant('icon only');
      await nextTick();

      await wrapper.setProps({
        component: DtCard,
        documentation: cardDoc,
        variants: variantBank.DtCard,
      });
      await nextTick();

      const renderer = wrapper.findComponent({ name: 'DtcRenderer' });

      expect(wrapper.vm.selectedVariant).toBe('default');
      expect(renderer.props('options').slots.content).toBe(
        variantBank.DtCard.default.slots.content.initialValue,
      );
    });
  });

  describe('fullscreen layout', function () {
    let host;

    beforeEach(function () {
      document.documentElement.setAttribute('data-overlayscrollbars', '');
      host = document.createElement('div');
      document.body.appendChild(host);
      wrapper = shallowMountCombinator({
        attachTo: host,
        props: {
          component: DtButton,
          documentation: buttonDoc,
          fullScreen: true,
          variants: {},
        },
      });
    });

    afterEach(function () {
      wrapper.unmount();
      host.remove();
      document.documentElement.removeAttribute('data-overlayscrollbars');
      document.documentElement.classList.remove('d-scrollbar-disabled', 'd-of-hidden');
    });

    it('teleports the fullscreen playground to the document body', function () {
      const fullscreenPlayground = Array.from(document.body.children).find(child => {
        return child.classList.contains('dialtone-playground--fullscreen');
      });

      expect(fullscreenPlayground).toBeTruthy();
      expect(host.querySelector('.dialtone-playground--fullscreen')).toBeNull();
    });

    it('keeps the fullscreen shell below modal popover layers', function () {
      const fullscreenPlayground = document.body.querySelector('.dialtone-playground--fullscreen');

      expect(fullscreenPlayground.classList.contains('d-zi-popover')).toBe(true);
    });

    it('locks the OverlayScrollbars root while fullscreen', async function () {
      expect(document.documentElement.classList.contains('d-scrollbar-disabled')).toBe(true);

      await wrapper.setProps({ fullScreen: false });

      expect(document.documentElement.classList.contains('d-scrollbar-disabled')).toBe(false);
    });
  });

  describe('control display settings', function () {
    beforeEach(function () {
      wrapper = shallowMountCombinator({
        props: {
          component: DtToggle,
          documentation: toggleDoc,
          variants: {},
        },
      });
    });

    afterEach(function () {
      wrapper.unmount();
    });

    it('persists control display settings and passes them to new component views', async function () {
      const optionBar = wrapper.findComponent({ name: 'DtcOptionBar' });

      expect(optionBar.props('settings').controls.hideDeprecated).toBe(true);

      await optionBar.vm.$emit('update:settings', (model) => {
        model.controls.hideDeprecated = false;
      });
      await nextTick();

      expect(window.localStorage.getItem('dialtoneCombinatorControlsHideDeprecated')).toBe('false');

      const nextWrapper = shallowMountCombinator({
        props: {
          component: DtInput,
          documentation: inputDoc,
          variants: {},
        },
      });

      expect(nextWrapper.findComponent({ name: 'DtcOptionBar' }).props('settings').controls.hideDeprecated).toBe(false);
      nextWrapper.unmount();
    });
  });
});
