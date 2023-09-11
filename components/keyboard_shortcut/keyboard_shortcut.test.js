import { mount } from '@vue/test-utils';
import { DtKeyboardShortcut } from '@/components/keyboard_shortcut';
import { DtIcon } from '@/components/icon';
import { SHORTCUTS_ALIASES_LIST } from './keyboard_shortcut_constants';

const baseProps = {
  shortcut: SHORTCUTS_ALIASES_LIST.join('+').trim(),
};

let mockProps = {};

describe('DtKeyboardShortcut Tests', () => {
  let wrapper;
  let iconComponents;

  const updateWrapper = () => {
    wrapper = mount(DtKeyboardShortcut, {
      propsData: { ...baseProps, ...mockProps },
    });

    iconComponents = wrapper.findAllComponents(DtIcon);
  };

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

    it('should render 11 icons', () => {
      expect(iconComponents.length === 11).toBe(true);
    });
  });
});
