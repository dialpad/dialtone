import { createLocalVue, mount } from '@vue/test-utils';
import { DtKeyboardShortcut } from '@/components/keyboard_shortcut';
import { DtIcon } from '@/components/icon';
import { SHORTCUTS_ALIASES_LIST } from './keyboard_shortcut_constants';

// Constants
const basePropsData = {
  shortcut: SHORTCUTS_ALIASES_LIST.join('+').trim(),
};

describe('DtKeyboardShortcut Tests', () => {
  let testContext = {
    localVue: null,
  };

  // Setup
  beforeAll(() => {
    testContext = {};
    testContext.localVue = createLocalVue();
  });

  // Wrappers
  let wrapper;
  let iconComponents;

  // Environment
  const propsData = basePropsData;

  // Helpers
  const _setChildWrappers = () => {
    iconComponents = wrapper.findAllComponents(DtIcon);
  };

  const _mountWrapper = () => {
    wrapper = mount(DtKeyboardShortcut, {
      propsData,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  describe('Presentation Tests', () => {
    // Setup
    beforeEach(() => {
      _mountWrapper();
    });

    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });
    it('should render 11 icons', () => {
      expect(iconComponents.length === 11).toBe(true);
    });
  });
});
