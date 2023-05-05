import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtToggle from './toggle.vue';
import Vue from 'vue';
import {
  itBehavesLikeDoesNotRaiseAnyVueWarnings,
  itBehavesLikeRaisesSingleVueWarning,
} from '../../tests/shared_examples/validation';

// Constants
const basePropsData = {};
const baseSlotData = { default: 'My Toggle Label' };

describe('DtToggle Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let button;
  let label;
  let icon;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = baseSlotData;
  let provide = {};
  let listeners = {};

  // Helpers
  const _setChildWrappers = () => {
    button = wrapper.find('button');
    label = wrapper.find('[data-qa="toggle-label"]');
    icon = wrapper.find('.d-toggle__inner');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtToggle, {
      propsData,
      attrs,
      slots,
      provide,
      listeners,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });
  beforeEach(() => {});

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = {};
    slots = baseSlotData;
    provide = {};
    listeners = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('Common toggle button attrs', () => {
      // Test Setup
      beforeEach(() => {
        _setWrappers();
      });
      it('should exist', () => { expect(wrapper.exists()).toBe(true); });
      it('should have d-toggle class', () => {
        expect(button.classes().includes('d-toggle')).toBe(true);
      });
      it(
        'should have type button',
        () => { expect(button.attributes('type')).toBe('button'); },
      );
      it(
        'should have role switch',
        () => { expect(button.attributes('role')).toBe('switch'); },
      );

      it('should show the icon', () => {
        expect(icon.exists()).toBe(true);
      });

      it('should hide the icon when showIcon prop is false', async () => {
        await wrapper.setProps({ showIcon: false });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
        expect(icon.exists()).toBe(false);
      });

      describe('disabled behaviour', () => {
        it(
          'should set correct disabled attributes when disabled prop is false',
          () => {
            expect(button.attributes('aria-disabled')).toBe('false');
            expect(button.attributes().disabled).toBeUndefined();
            expect(button.classes().includes('d-toggle--disabled')).toBe(false);
          },
        );

        it(
          'should set correct disabled attributes when disabled prop is true',
          async () => {
            await wrapper.setProps({ disabled: true });
            expect(button.attributes('aria-disabled')).toBe('true');
            expect(button.attributes().disabled).toBe('disabled');
            expect(button.classes().includes('d-toggle--disabled')).toBe(true);
          },
        );

        it('should set correct size class', async () => {
          await wrapper.setProps({ size: 'sm' });
          expect(button.classes().includes('d-toggle--small')).toBe(true);
        });
      });
    });
    describe('Unchecked Toggle', () => {
      // Test Setup
      beforeEach(() => {
        propsData = {
          ...basePropsData,
          checked: false,
        };
        _setWrappers();
      });

      it('should exist', () => { expect(wrapper.exists()).toBe(true); });

      describe('checked behaviour', () => {
        it(
          'should set correct checked attributes when checked prop is false',
          () => {
            expect(button.attributes('aria-checked')).toBe('false');
            expect(button.classes().includes('d-toggle--checked')).toBe(false);
          },
        );
      });

      describe('label behaviour', () => {
        it('should exist', () => { expect(label.exists()).toBe(true); });
        it(
          'should match provided label prop',
          () => { expect(label.text()).toBe(slots.default); },
        );
      });
    });

    describe('Checked Toggle', () => {
      // Test Setup
      beforeEach(() => {
        propsData = {
          ...basePropsData,
          checked: true,
          disabled: false,
        };
        _setWrappers();
      });

      it('should exist', () => { expect(wrapper.exists()).toBe(true); });

      describe('checked behaviour', () => {
        it(
          'should set correct checked attributes when checked prop is true',
          () => {
            expect(button.attributes('aria-checked')).toBe('true');
            expect(button.classes().includes('d-toggle--checked')).toBe(true);
          },
        );
      });

      describe('label behaviour', () => {
        it('should exist', () => { expect(label.exists()).toBe(true); });
        it(
          'should match provided label prop',
          () => { expect(label.text()).toBe(slots.default); },
        );
      });
    });

    describe('Indeterminate Toggle', () => {
      // Test Setup
      beforeEach(() => {
        propsData = {
          ...basePropsData,
          checked: 'mixed',
        };
        _setWrappers();
      });

      it('should set indeterminate state when checked prop is mixed', () => {
        expect(button.classes().includes('d-toggle--indeterminate')).toBe(true);
      });

      it('should set the correct aria-checked attribute', () => {
        expect(button.attributes('aria-checked')).toBe('mixed');
      });
    });

    describe('Accessibility Tests', () => {
      describe('aria-label validations', () => {
        const warningMessage = 'You must provide an aria-label when there is no label passed';

        beforeAll(() => {
          Vue.config.silent = true;
          vi.spyOn(Vue.util, 'warn').mockClear();
        });

        afterAll(() => {
          Vue.util.warn.mockRestore();
          Vue.config.silent = false;
        });

        describe('should not throw a Vue error if a label is provided', () => {
          beforeAll(() => {
            propsData = basePropsData;
            slots = { default: 'My Label' };
            _setWrappers();
          });
          itBehavesLikeDoesNotRaiseAnyVueWarnings();
        });

        describe('should not throw a Vue error if a label is not provided, but an aria-label attr exists', () => {
          beforeAll(() => {
            propsData = { ...basePropsData };
            attrs = { 'aria-label': 'my label' };
            slots = {};
            _setWrappers();
          });
          itBehavesLikeDoesNotRaiseAnyVueWarnings();
        });

        describe('When neither ariaLabel attr nor a default slot exists', () => {
          beforeAll(() => {
            propsData = { ...basePropsData };
            attrs = {};
            slots = {};
            _setWrappers();
          });
          itBehavesLikeRaisesSingleVueWarning(warningMessage);
        });
      });
    });
  });
});
