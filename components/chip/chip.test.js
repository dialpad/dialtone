import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import EmptyComponentFixture from '../../tests/fixtures/component.vue';
import DtChip from './chip.vue';

// Constants
const basePropsData = {
  closeButtonProps: {
    ariaLabel: 'close',
  },
};

describe('DtChip Tests', function () {
  // Wrappers
  let wrapper;
  let chip;
  let icon;
  let avatar;
  let label;
  let remove;

  // Environment
  let propsData = basePropsData;
  let slots = {};
  let listeners;

  // Helpers
  const _setChildWrappers = () => {
    chip = wrapper.find('[data-qa="dt-chip"]');
    icon = wrapper.find('[data-qa="dt-chip-icon"]');
    avatar = wrapper.find('[data-qa="dt-chip-avatar"]');
    label = wrapper.find('[data-qa="dt-chip-label"]');
    remove = wrapper.find('[data-qa="dt-chip-close"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtChip, {
      propsData,
      slots,
      listeners,
    });
    _setChildWrappers();
  };

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    slots = {};
  });

  describe('Presentation Tests', function () {
    describe('When rendered with default props', function () {
      const defaultText = 'TEXT';
      beforeEach(function () {
        slots = { default: defaultText };
        _setWrappers();
      });
      it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
      it('should render chip', function () { assert.exists(chip, 'chip exists'); });
      it('should render remove button', function () { assert.exists(remove, 'close button exists'); });
      it('should render label', function () { assert.exists(label); });
      it('should display the correct text', function () { assert.strictEqual(label.text(), defaultText); });
      it('should not render icon', function () { assert.isFalse(icon.exists()); });
      it('should not render avatar', function () { assert.isFalse(avatar.exists()); });
      it('default interactive', function () {
        assert.strictEqual(chip.element.tagName, 'BUTTON');
      });
      it('chip should have aria-labelledby', function () {
        assert.property(chip.attributes(), 'aria-labelledby');
      });
      it('button should have aria-label', function () {
        assert.equal(remove.attributes('aria-label'), 'close');
      });
    });

    describe('When interactive is false', function () {
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          interactive: false,
        };
        await _setWrappers();
      });
      it('should not be interactive', function () {
        assert.strictEqual(chip.element.tagName, 'SPAN');
      });
    });

    describe('When hide close button', function () {
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          hideClose: true,
        };
        await _setWrappers();
      });
      it('should not render remove button', function () { assert.isFalse(remove.exists()); });
    });

    describe('When show avatar', function () {
      beforeEach(function () {
        propsData = {
          ...basePropsData,
          avatarProps: {
            SRC: 'image.png',
            ALT: 'Avatar image',
          },
        };
        _setWrappers();
      });
      it('should render avatar', function () { assert.exists(avatar); });
    });

    describe('With icon slot', function () {
      beforeEach(function () {
        slots = {
          icon: EmptyComponentFixture,
        };
        _setWrappers();
      });
      it('should render icon', function () { assert.exists(icon); });
    });
  });

  describe('Interactivity Tests', function () {
    beforeEach(function () {
      _setWrappers();
    });

    describe('When close button is clicked', function () {
      beforeEach(async function () {
        await remove.trigger('click');
      });
      it('should emit close event', function () {
        assert.property(wrapper.emitted(), 'close');
      });
    });

    describe('When delete is pressed on a chip', function () {
      beforeEach(async function () {
        await chip.trigger('keyup', { code: 'DELETE' });
      });
      it('should emit close event', function () {
        assert.property(wrapper.emitted(), 'close');
      });
    });
  });
});
