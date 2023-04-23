import { createLocalVue, mount } from '@vue/test-utils';
import { DtKeyboardShortcut } from '@/components/keyboard_shortcut';
import { DtIcon } from '@/components/icon';
import { SHORTCUTS_ALIASES_LIST } from './keyboard_shortcut_constants';

// Constants
const basePropsData = {
  shortcut: SHORTCUTS_ALIASES_LIST.join('+').trim(),
};

describe('DtKeyboardShortcut Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
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
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  describe('Presentation Tests', () => {
    // Setup
    _mountWrapper();

    it(
      'should render the component',
      () => { assert.exists(wrapper, 'wrapper exists'); }
    );
    it(
      'should render 11 icons',
      () => { expect(iconComponents.length === 11).toBe(true); }
    );
  });
});
