import { mount } from '@vue/test-utils';
import DtToggle from './toggle.vue';
import {
  cleanSpy,
  initializeSpy,
  itBehavesLikeDoesNotRaiseAnyVueWarnings,
  // itBehavesLikeRaisesSingleVueWarning,
} from '../../tests/shared_examples/validation';

// Constants
const baseProps = {};
const baseSlotData = { default: 'My Toggle Label' };

describe('DtToggle Tests', () => {
  // Wrappers
  let wrapper;
  let button;
  let label;
  let icon;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = baseSlotData;

  // Helpers
  const _setChildWrappers = () => {
    button = wrapper.find('button');
    label = wrapper.find('[data-qa="toggle-label"]');
    icon = wrapper.find('.d-toggle__inner');
  };

  const _setWrappers = () => {
    wrapper = mount(DtToggle, {
      props,
      attrs,
      slots,
    });
    _setChildWrappers();
  };

  // Setup
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = baseSlotData;
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
            expect(button.element.disabled).toBe(true);
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
        props = {
          ...baseProps,
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
        props = {
          ...baseProps,
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
        props = {
          ...baseProps,
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

    describe('Accessibility Tests', function () {
      describe('aria-label validations', function () {
        // const warningMessage = '[Vue warn]: You must provide an aria-label when there is no label passed';

        // Test Setup
        beforeEach(function () {
          initializeSpy();
        });

        // Test Teardown
        afterEach(function () {
          cleanSpy();
        });

        describe('should not throw a Vue error if a label is provided', function () {
          beforeAll(function () {
            props = baseProps;
            slots = { default: 'My Label' };
            _setWrappers();
          });
          itBehavesLikeDoesNotRaiseAnyVueWarnings();
        });

        describe('should not throw a Vue error if a label is not provided, but an aria-label attr exists', () => {
          beforeAll(() => {
            props = { ...baseProps };
            attrs = { 'aria-label': 'my label' };
            slots = {};
            _setWrappers();
          });
          itBehavesLikeDoesNotRaiseAnyVueWarnings();
        });

        // todo: fix
        // describe('When neither ariaLabel attr nor a default slot exists', () => {
        //   beforeAll(() => {
        //     props = { ...baseProps };
        //     attrs = {};
        //     slots = {};
        //     _setWrappers();
        //   });
        //   itBehavesLikeRaisesSingleVueWarning(warningMessage);
        // });
      });
    });
  });
});
