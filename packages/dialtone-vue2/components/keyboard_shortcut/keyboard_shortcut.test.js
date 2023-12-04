import { createLocalVue, mount } from '@vue/test-utils';
import { DtKeyboardShortcut } from '@/components/keyboard_shortcut';
import { DtIcon } from '@/components/icon';
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

    iconComponents = wrapper.findAllComponents(DtIcon);
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

    it('should render 11 icons', () => {
      expect(iconComponents.length === 11).toBe(true);
    });
  });
});
