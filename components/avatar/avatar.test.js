import { assert } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtAvatar from './avatar.vue';
import { itBehavesLikeHasCorrectClass } from '../../tests/shared_examples/classes';
import { AVATAR_KIND_MODIFIERS, AVATAR_SIZE_MODIFIERS } from './avatar_constants';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeDoesNotRaiseAnyVueWarnings,
  itBehavesLikeRaisesSingleVueWarning,
} from '../../tests/shared_examples/validation';
import {
  itBehavesLikeAppliesClassToChild,
} from '../../tests/shared_examples/extendability';
import Vue from 'vue';
import sinon from 'sinon';

// Constants
const DEFAULT_SLOT = 'DP';
const IMAGE_ATTRS = {
  SRC: 'image.png',
  ALT: 'Avatar image',
};
const basePropsData = {};
const baseAttrs = {};

describe('DtAvatar Tests', function () {
  // Wrappers
  let wrapper;
  let image;
  let count;
  let presence;

  // Environment
  let propsData = basePropsData;
  let attrs = baseAttrs;
  let slots = {};

  // Helpers
  const _setChildWrappers = () => {
    image = wrapper.find('[data-qa="dt-avatar-image"]');
    count = wrapper.find('[data-qa="dt-avatar-count"]');
    presence = wrapper.find('[data-qa="dt-presence"]');
  };

  const _setWrappers = async () => {
    wrapper = shallowMount(DtAvatar, {
      propsData,
      attrs,
      slots,
      localVue: this.localVue,
    });
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
    slots = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    describe('When the avatar renders', function () {
      // Test Setup
      beforeEach(async function () {
        slots = { default: DEFAULT_SLOT };
        await _setWrappers();
      });

      it('should exists', function () { assert.exists(wrapper); });
      it('should render the avatar', function () { assert.isTrue(wrapper.exists()); });
    });

    describe('When the avatar renders image via slot', function () {
      // Test Environment
      const imageSlot = `<img src="${IMAGE_ATTRS.SRC}" alt="${IMAGE_ATTRS.ALT}" data-qa="dt-avatar-image">`;

      // Test Setup
      beforeEach(async function () {
        slots = { default: imageSlot };
        await _setWrappers();
      });

      it('image should exist', function () {
        assert.exists(image);
      });

      it('src should match those provided by attrs', function () {
        assert.strictEqual(image.attributes('src'), IMAGE_ATTRS.SRC);
      });

      it('alt should match those provided by attrs', function () {
        assert.strictEqual(image.attributes('alt'), IMAGE_ATTRS.ALT);
      });
    });

    describe('With icon in slot', function () {
      // Test Environment
      const icon = '<svg></svg>';

      // Test Setup
      beforeEach(async function () {
        slots = { default: icon };
        await _setWrappers();
      });

      it('icon slot should exist', function () {
        assert.exists(wrapper.find('svg'));
      });

      it('should have correct class', function () {
        itBehavesLikeHasCorrectClass(wrapper.find('svg'), AVATAR_KIND_MODIFIERS.icon);
      });
    });

    describe('With initials in slot', function () {
      // Test Environment
      const initials = 'DP';

      // Test Setup
      beforeEach(async function () {
        slots = { default: initials };
        await _setWrappers();
      });

      it('should display initials', function () {
        assert.strictEqual(wrapper.text(), initials);
      });

      it('should have correct class', function () {
        const avatarWithInitials = wrapper.find(AVATAR_KIND_MODIFIERS.initials);
        assert.exists(avatarWithInitials);
      });
    });

    describe('With initials in slot and size is sm', function () {
      // Test Environment
      const initials = 'DP';

      // Test Setup
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          size: 'sm',
        };
        slots = { default: initials };
        await _setWrappers();
      });

      it('shows a single character', async function () {
        assert.strictEqual(wrapper.text(), initials[0]);
      });
    });

    describe('With initials in slot and size is xs', function () {
      // Test Environment
      const initials = 'DP';

      // Test Setup
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          size: 'xs',
        };
        slots = { default: initials };
        await _setWrappers();
      });

      it('has no initials', function () {
        assert.strictEqual(wrapper.text(), '');
      });
    });

    describe('When a size is provided', function () {
      // Test Environment
      const size = 'lg';

      // Test Setup
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          size,
        };
        slots = { default: DEFAULT_SLOT };
        await _setWrappers();
      });

      it('should have size variant class on the avatar', function () {
        assert.isTrue(wrapper.classes(AVATAR_SIZE_MODIFIERS[size]));
      });
    });

    describe('When a group is provided', function () {
      // Test Environment
      const group = 25;

      // Test Setup
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          group,
        };
        slots = { default: DEFAULT_SLOT };
        await _setWrappers();
      });

      it('should have group count', function () {
        assert.exists(count);
      });

      it('should have the correct group number', function () {
        assert.strictEqual(count.text(), group.toString());
      });

      it('should not render group if group value is 1 or less', async function () {
        await wrapper.setProps({ group: 1 });
        _setChildWrappers();
        assert.isFalse(count.exists());
      });

      it('should render "99+" if group is greater than 99', async function () {
        await wrapper.setProps({ group: 100 });
        _setChildWrappers();
        assert.strictEqual(count.text(), '99+');
      });
    });

    describe('When setting gradient to not show', function () {
      // Test Environment
      const gradient = false;

      // Test Setup
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          gradient,
        };
        slots = { default: DEFAULT_SLOT };
        await _setWrappers();
      });

      it('should set the correct class', function () {
        assert.isTrue(wrapper.classes('d-avatar--no-gradient'));
      });
    });

    describe('With Presence', function () {
      const initials = 'DP';

      // Test Setup
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
        };
        slots = { default: initials };
        await _setWrappers();
      });

      it('should not render presence if presence prop is not defined', async function () {
        await wrapper.setProps({ presence: null });
        presence = wrapper.find('[data-qa="dt-presence"]');
        assert.isFalse(presence.exists());
      });

      it('should render presence when presence prop is defined', async function () {
        await wrapper.setProps({ presence: 'active' });
        presence = wrapper.find('[data-qa="dt-presence"]');
        assert.isTrue(presence.exists());
        assert.isTrue(presence.classes('d-avatar__presence'));
      });

      it('should pass through data in presenceProps to the presence component ', async function () {
        await wrapper.setProps({
          presence: 'active',
          presenceProps: {
            'aria-live': 'assertive',
            'random-attribute': 'value',
            propValue: 2,
          },
        });
        presence = wrapper.find('[data-qa="dt-presence"]');
        assert.isTrue(presence.exists());
        assert.equal(presence.attributes('aria-live'), 'assertive');
        assert.equal(presence.attributes('random-attribute'), 'value');
      });

      it('should update presence styles based on Avatar size', async function () {
        // default styles are for 'sm'
        await wrapper.setProps({
          size: 'md',
          presence: 'active',
        });
        presence = wrapper.find('[data-qa="dt-presence"]');
        assert.isTrue(presence.classes('d-avatar__presence--md'));
        await wrapper.setProps({
          size: 'lg',
          presence: 'active',
        });
        presence = wrapper.find('[data-qa="dt-presence"]');
        assert.isTrue(presence.classes('d-avatar__presence--lg'));
      });
    });
  });

  describe('Validation Tests', function () {
    describe('Size Validator', function () {
      // Test Environment
      const prop = DtAvatar.props.size;

      describe('When provided size is in AVATAR_SIZE_MODIFIERS', function () {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided size is not in AVATAR_SIZE_MODIFIERS', function () {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_SIZE`);
      });
    });

    describe('Group Validator', function () {
      // Test Environment
      const prop = DtAvatar.props.group;

      describe('When provided group is valid to show group count', function () {
        itBehavesLikePassesCustomPropValidation(prop, 2);
      });

      describe('When provided group is not in the valid range (below min)', function () {
        itBehavesLikeFailsCustomPropValidation(prop, 1);
      });
    });

    describe('Image Attrs Validation', function () {
      // Test Environment
      const warningMessage = 'src and alt attributes are required for image avatars';

      // Test Setup
      before(function () {
        Vue.config.silent = true;
        sinon.spy(Vue.util, 'warn');
      });

      // Test Teardown
      afterEach(function () {
        Vue.util.warn.resetHistory();
      });

      after(function () {
        Vue.util.warn.restore();
        Vue.config.silent = false;
      });

      describe('When image src and alt attributes are provided', function () {
        // Test Setup
        beforeEach(async function () {
          const imageSlot = `<img src="${IMAGE_ATTRS.SRC}" alt="${IMAGE_ATTRS.ALT}" data-qa="dt-avatar-image">`;

          slots = { default: imageSlot };
          await _setWrappers();
        });

        itBehavesLikeDoesNotRaiseAnyVueWarnings();
      });

      describe('When image alt attribute is not provided', function () {
        // Test Setup
        beforeEach(async function () {
          const imageSlot = `<img src="${IMAGE_ATTRS.SRC}" data-qa="dt-avatar-image">`;

          slots = { default: imageSlot };
          await _setWrappers();
        });

        itBehavesLikeRaisesSingleVueWarning(warningMessage);
      });

      describe('When image src attribute is not provided', function () {
        // Test Setup
        beforeEach(async function () {
          const imageSlot = `<img alt="${IMAGE_ATTRS.ALT}" data-qa="dt-avatar-image">`;

          slots = { default: imageSlot };
          await _setWrappers();
        });

        itBehavesLikeRaisesSingleVueWarning(warningMessage);
      });
    });
  });

  describe('Extendability Tests', function () {
    // Test Environment
    let element;
    const customClass = 'my-custom-class';

    // Helpers
    const _setupChildClassTest = async (childClassName, selector) => {
      propsData[childClassName] = customClass;
      slots = { default: DEFAULT_SLOT };
      await _setWrappers();
      element = wrapper.find(selector);
    };

    // Shared Examples
    const itBehavesLikeAppliesClassToChildLocal = () => {
      it('should apply custom class to child', function () {
        itBehavesLikeAppliesClassToChild(wrapper, '.my-custom-class', element);
      });
    };

    describe('When an avatar class is provided', function () {
      // Test Setup
      beforeEach(async function () {
        await _setupChildClassTest('avatarClass', '[data-qa="dt-avatar"]');
      });

      itBehavesLikeAppliesClassToChildLocal();
    });
  });
});
