import { createLocalVue, mount } from '@vue/test-utils';
import { DtKeyboardShortcut } from '@/components/keyboard_shortcut';
import { SHORTCUTS_ALIASES_LIST } from './keyboard_shortcut_constants';

const baseProps = {
  shortcut: SHORTCUTS_ALIASES_LIST.join('+').trim(),
};

let mockProps = {};
const testContext = {};

describe('DtKeyboardShortcut Tests', () => {
  let wrapper;
  let iconComponents;

  const updateWrapper = () => {
    wrapper = mount(DtKeyboardShortcut, {
      propsData: { ...baseProps, ...mockProps },
      localVue: testContext.localVue,
    });

    iconComponents = wrapper.findAll('[data-qa="dt-icon"]');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render 13 icons', () => {
      expect(iconComponents.length === 13).toBe(true);
    });
  });

  describe('Accessibility Tests', () => {
    describe('Auto-generated aria-label', () => {
      it('should generate aria-label with icon aliases converted to text', () => {
        mockProps = {
          shortcut: '{cmd}+X',
        };
        updateWrapper();

        const srOnlySpan = wrapper.find('.d-keyboard-shortcut--sr-only');
        expect(srOnlySpan.text()).toBe('Command plus X');
      });

      it('should convert key abbreviations to full names', () => {
        mockProps = {
          shortcut: 'Ctrl+Alt+Del',
        };
        updateWrapper();

        const srOnlySpan = wrapper.find('.d-keyboard-shortcut--sr-only');
        expect(srOnlySpan.text()).toBe('Control plus Alt plus Delete');
      });

      it('should handle mixed icon aliases and key abbreviations', () => {
        mockProps = {
          shortcut: '{cmd}+Ctrl+X',
        };
        updateWrapper();

        const srOnlySpan = wrapper.find('.d-keyboard-shortcut--sr-only');
        expect(srOnlySpan.text()).toBe('Command plus Control plus X');
      });

      it('should handle arrow key icons', () => {
        mockProps = {
          shortcut: '{arrow-up}+{arrow-down}',
        };
        updateWrapper();

        const srOnlySpan = wrapper.find('.d-keyboard-shortcut--sr-only');
        expect(srOnlySpan.text()).toBe('Up Arrow plus Down Arrow');
      });

      it('should handle Windows key icon', () => {
        mockProps = {
          shortcut: '{win}+D',
        };
        updateWrapper();

        const srOnlySpan = wrapper.find('.d-keyboard-shortcut--sr-only');
        expect(srOnlySpan.text()).toBe('Windows plus D');
      });

      it('should handle Option key icon', () => {
        mockProps = {
          shortcut: '{opt}+C',
        };
        updateWrapper();

        const srOnlySpan = wrapper.find('.d-keyboard-shortcut--sr-only');
        expect(srOnlySpan.text()).toBe('Option plus C');
      });
    });

    describe('screenReaderText override', () => {
      it('should use screenReaderText when provided', () => {
        mockProps = {
          shortcut: '{cmd}+X',
          screenReaderText: 'Custom accessible text',
        };
        updateWrapper();

        const srOnlySpan = wrapper.find('.d-keyboard-shortcut--sr-only');
        expect(srOnlySpan.text()).toBe('Custom accessible text');
      });

      it('should use auto-generated aria-label when screenReaderText is not provided', () => {
        mockProps = {
          shortcut: '{cmd}+X',
        };
        updateWrapper();

        const srOnlySpan = wrapper.find('.d-keyboard-shortcut--sr-only');
        expect(srOnlySpan.text()).toBe('Command plus X');
      });
    });
  });
});
