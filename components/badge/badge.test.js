import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import DtBadge from './badge.vue';
import { BADGE_COLOR_MODIFIERS } from './badge_constants';
import { itBehavesLikeHasCorrectClass } from '../../tests/shared_examples/classes';

// Constants
const baseProps = {};

describe('Dialtone Vue Badge tests', function () {
  let wrapper;
  let badge;

  // Environment
  let props = baseProps;
  let slots = {};

  // Helpers
  const _setChildWrappers = () => {
    badge = wrapper.find('[data-qa="dt-badge"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtBadge, {
      props,
      slots,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Teardown
  afterEach(function () {
    props = baseProps;
    slots = {};
  });

  describe('Presentation Tests', function () {
    // Shared Examples
    const itBehavesLikeRendersText = text => {
      it('should render the badge', function () { assert.isTrue(badge.exists()); });
      it('should display the correct text', function () { assert.strictEqual(badge.text(), text); });
    };

    const itBehavesLikeHasCorrectColorClass = color => {
      it('should have correct class', async function () {
        await wrapper.setProps({ color });
        itBehavesLikeHasCorrectClass(badge, BADGE_COLOR_MODIFIERS[color]);
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
        props = { ...baseProps, text: propText };
        _setWrappers();
      });

      itBehavesLikeRendersText(propText);
    });

    describe('When a color is provided via prop', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      describe('When color is black-700', function () { itBehavesLikeHasCorrectColorClass('black-700'); });

      describe('When color is green-400', function () { itBehavesLikeHasCorrectColorClass('green-400'); });

      describe('When color is orange-400', function () { itBehavesLikeHasCorrectColorClass('orange-400'); });

      describe('When color is pink-300', function () { itBehavesLikeHasCorrectColorClass('pink-300'); });

      describe('When color is pink-500', function () { itBehavesLikeHasCorrectColorClass('pink-500'); });

      describe('When color is pink-600', function () { itBehavesLikeHasCorrectColorClass('pink-600'); });

      describe('When color is pink-700', function () { itBehavesLikeHasCorrectColorClass('pink-700'); });

      describe('When color is purple-100', function () { itBehavesLikeHasCorrectColorClass('purple-100'); });

      describe('When color is purple-300', function () { itBehavesLikeHasCorrectColorClass('purple-300'); });

      describe('When color is purple-500', function () { itBehavesLikeHasCorrectColorClass('purple-500'); });

      describe('When color is purple-700', function () { itBehavesLikeHasCorrectColorClass('purple-700'); });

      describe('When color is red-500', function () { itBehavesLikeHasCorrectColorClass('red-500'); });

      describe('When color is white', function () { itBehavesLikeHasCorrectColorClass('white'); });

      describe('When color is yellow-300', function () { itBehavesLikeHasCorrectColorClass('yellow-300'); });
    });
  });
});
