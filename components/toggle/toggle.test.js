import { mount } from '@vue/test-utils';
import DtToggle from './toggle.vue';

const baseProps = {};
const baseSlot = { default: 'My Toggle Label' };
const baseAttrs = {};

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};

describe('DtToggle Tests', () => {
  let wrapper;
  let button;
  let label;
  let icon;

  const updateWrapper = () => {
    wrapper = mount(DtToggle, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlot, ...mockSlots },
    });

    button = wrapper.find('button');
    label = wrapper.find('[data-qa="toggle-label"]');
    icon = wrapper.find('.d-toggle__inner');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('Common toggle button attrs', () => {
      it('should exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should have d-toggle class', () => {
        expect(button.classes().includes('d-toggle')).toBe(true);
      });

      it('should have type button', () => {
        expect(button.attributes('type')).toBe('button');
      });

      it('should have role switch', () => {
        expect(button.attributes('role')).toBe('switch');
      });

      it('should show the icon', () => {
        expect(icon.exists()).toBe(true);
      });

      it('should hide the icon when showIcon prop is false', async () => {
        await wrapper.setProps({ showIcon: false });

        icon = wrapper.find('.d-toggle__inner');

        expect(icon.exists()).toBe(false);
      });

      describe('disabled behaviour', () => {
        it('should set correct disabled attributes when disabled prop is false', () => {
          expect(button.attributes('aria-disabled')).toBe('false');
          expect(button.attributes().disabled).toBeUndefined();
          expect(button.classes().includes('d-toggle--disabled')).toBe(false);
        });

        it('should set correct disabled attributes when disabled prop is true', async () => {
          await wrapper.setProps({ disabled: true });

          expect(button.attributes('aria-disabled')).toBe('true');
          expect(button.element.disabled).toBe(true);
          expect(button.classes().includes('d-toggle--disabled')).toBe(true);
        });

        it('should set correct size class', async () => {
          await wrapper.setProps({ size: 'sm' });

          expect(button.classes().includes('d-toggle--small')).toBe(true);
        });
      });
    });

    describe('Unchecked Toggle', () => {
      beforeEach(() => {
        mockProps = { checked: false };

        updateWrapper();
      });

      it('should exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      describe('checked behaviour', () => {
        it('should set correct checked attributes when checked prop is false', () => {
          expect(button.attributes('aria-checked')).toBe('false');
          expect(button.classes().includes('d-toggle--checked')).toBe(false);
        });
      });

      describe('label behaviour', () => {
        it('should exist', () => {
          expect(label.exists()).toBe(true);
        });

        it('should match provided label prop', () => {
          expect(label.text()).toBe(baseSlot.default);
        });
      });
    });

    describe('Checked Toggle', () => {
      beforeEach(() => {
        mockProps = {
          checked: true,
          disabled: false,
        };

        updateWrapper();
      });

      it('should exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      describe('checked behaviour', () => {
        it('should set correct checked attributes when checked prop is true', () => {
          expect(button.attributes('aria-checked')).toBe('true');
          expect(button.classes().includes('d-toggle--checked')).toBe(true);
        });
      });

      describe('label behaviour', () => {
        it('should exist', () => {
          expect(label.exists()).toBe(true);
        });

        it('should match provided label prop', () => {
          expect(label.text()).toBe(baseSlot.default);
        });
      });
    });

    describe('Indeterminate Toggle', () => {
      beforeEach(() => {
        mockProps = { checked: 'mixed' };

        updateWrapper();
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
        let MOCK_CONSOLE_ERROR_SPY;
        let MOCK_CONSOLE_WARN_SPY;

        beforeEach(() => {
          MOCK_CONSOLE_ERROR_SPY = vi.spyOn(console, 'error');
          MOCK_CONSOLE_WARN_SPY = vi.spyOn(console, 'warn');
        });

        afterEach(() => {
          MOCK_CONSOLE_ERROR_SPY.mockRestore();
          MOCK_CONSOLE_WARN_SPY.mockRestore();
        });

        describe('should not throw a Vue error if a label is provided', () => {
          it('should not raise any warnings', () => {
            mockSlots = { default: 'My Label' };

            updateWrapper();

            expect(console.warn).not.toHaveBeenCalled();
          });
        });

        describe('should not throw a Vue error if a label is not provided, but an aria-label attr exists', () => {
          it('should not raise any warnings', () => {
            mockSlots = { default: '' };
            mockAttrs = { 'aria-label': 'my label' };

            updateWrapper();

            expect(console.warn).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
