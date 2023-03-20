import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtBadge from './badge.vue';
import { BADGE_TYPE_MODIFIERS, BADGE_KIND_MODIFIERS, BADGE_DECORATION_MODIFIERS } from './badge_constants';
import { itBehavesLikeHasCorrectClass } from '../../tests/shared_examples/classes';

// Constants
const basePropsData = {};

describe('DtBadge Tests', function () {
  let wrapper;
  let badge;
  let iconLeftWrapper;
  let iconLeft;

  // Environment
  let propsData = basePropsData;
  let slots = {};

  // Helpers
  const _setChildWrappers = () => {
    badge = wrapper.find('[data-qa="dt-badge"]');
    iconLeftWrapper = wrapper.find('.d-badge__icon-left');
    if (iconLeftWrapper.exists()) {
      iconLeft = iconLeftWrapper.findComponent({ name: 'DtIcon' });
    }
  };

  const _setWrappers = () => {
    wrapper = mount(DtBadge, {
      propsData,
      slots,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    propsData = basePropsData;
    slots = {};
    _setWrappers();
  });

  describe('Presentation Tests', function () {
    // Shared Examples
    const itBehavesLikeRendersText = text => {
      it('should render the badge', function () { assert.isTrue(badge.exists()); });
      it('should display the correct text', function () { assert.strictEqual(badge.text(), text); });
    };

    const itBehavesLikeHasCorrectType = type => {
      it('should have correct type', async function () {
        await wrapper.setProps({ type });
        itBehavesLikeHasCorrectClass(badge, BADGE_TYPE_MODIFIERS[type]);
      });
    };

    const itBehavesLikeHasCorrectKind = kind => {
      it('should have correct kind', async function () {
        await wrapper.setProps({ kind });
        itBehavesLikeHasCorrectClass(badge, BADGE_KIND_MODIFIERS[kind]);
      });
    };

    const itBehavesLikeHasCorrectDecoration = decoration => {
      it('should have correct decoration', async function () {
        await wrapper.setProps({ decoration });
        const decorativeSpan = wrapper.find('.d-badge__decorative');
        assert(decorativeSpan.exists());
        itBehavesLikeHasCorrectClass(badge, BADGE_DECORATION_MODIFIERS[decoration]);
      });
    };

    describe('When the badge renders', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      it('should exist', function () { assert.exists(wrapper); });
    });

    describe('When a text is provided via slot', function () {
      // Test Environment
      const slotText = 'Default slot text';

      // Test Setup
      beforeEach(function () {
        slots = { default: slotText };
        _setWrappers();
      });

      itBehavesLikeRendersText(slotText);
    });

    describe('When a text is provided via prop', function () {
      // Test Environment
      const propText = 'Prop text';

      // Test Setup
      beforeEach(function () {
        propsData = { ...basePropsData, text: propText };
        _setWrappers();
      });

      itBehavesLikeRendersText(propText);
    });

    describe('When a type is provided via prop', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      describe('When type is info', function () { itBehavesLikeHasCorrectType('info'); });

      describe('When type is success', function () { itBehavesLikeHasCorrectType('success'); });

      describe('When type is warning', function () { itBehavesLikeHasCorrectType('warning'); });

      describe('When type is critical', function () { itBehavesLikeHasCorrectType('critical'); });

      describe('When type is ai', function () {
        beforeEach(async function () {
          await wrapper.setProps({ type: 'ai' });
          _setChildWrappers();
        });

        itBehavesLikeHasCorrectType('ai');

        it('renders ai icon in iconLeft slot by default', function () {
          assert.isTrue(iconLeft.attributes('data-name') === 'Dialpad Ai');
        });
      });
    });

    describe('When a kind is provided via prop', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      describe('When kind is count', function () { itBehavesLikeHasCorrectKind('count'); });
    });

    describe('When a decoration is provided via prop', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      describe('When decoration is black-900', function () { itBehavesLikeHasCorrectDecoration('black-900'); });

      describe('When decoration is red-400', function () { itBehavesLikeHasCorrectDecoration('red-400'); });

      describe('When decoration is purple-400', function () { itBehavesLikeHasCorrectDecoration('purple-400'); });

      describe('When decoration is gold-300', function () { itBehavesLikeHasCorrectDecoration('gold-300'); });
    });
  });
});
