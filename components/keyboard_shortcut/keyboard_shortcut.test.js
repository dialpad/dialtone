import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtKeyboardShortcut from './keyboard_shortcut.vue';
import { SHORTCUTS_ALIASES_LIST } from './keyboard_shortcut_constants';

import IconWindows from '@dialpad/dialtone/lib/dist/vue/icons/IconWindows';
import IconAdd from '@dialpad/dialtone/lib/dist/vue/icons/IconAdd';
import IconArrowDownward from '@dialpad/dialtone/lib/dist/vue/icons/IconArrowDownward';
import IconArrowUpward from '@dialpad/dialtone/lib/dist/vue/icons/IconArrowUpward';
import IconArrowForward from '@dialpad/dialtone/lib/dist/vue/icons/IconArrowForward';
import IconArrowBackward from '@dialpad/dialtone/lib/dist/vue/icons/IconArrowBackwards';

// Constants
const baseProps = {
  shortcut: SHORTCUTS_ALIASES_LIST.join('+').trim(),
};

describe('DtKeyboardShortcut Tests', function () {
  // Wrappers
  let wrapper;
  let mountedIcons = {};

  // Environment
  const props = baseProps;

  // Helpers
  const _setChildWrappers = () => {
    mountedIcons = {
      IconWindows: wrapper.findComponent(IconWindows),
      IconAdd: wrapper.findComponent(IconAdd),
      IconArrowDownward: wrapper.findComponent(IconArrowDownward),
      IconArrowUpward: wrapper.findComponent(IconArrowUpward),
      IconArrowForward: wrapper.findComponent(IconArrowForward),
      IconArrowBackward: wrapper.findComponent(IconArrowBackward),
    };
  };

  const _mountWrapper = () => {
    wrapper = mount(DtKeyboardShortcut, {
      props,
    });
    _setChildWrappers();
  };

  function itBehavesLikeIconWasRendered (iconName, mountedIcon) {
    it(`should render component with ${iconName}`, function () {
      assert.isTrue(mountedIcon.exists());
    });
  }

  describe('Presentation Tests', function () {
    // Setup
    _mountWrapper();

    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
    Object.entries(mountedIcons)
      .forEach(([iconName, mountedIcon]) =>
        itBehavesLikeIconWasRendered(iconName, mountedIcon));
  });
});
