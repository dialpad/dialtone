import { mount } from '@vue/test-utils';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '@/tests/shared_examples/validation.js';
import DtRecipeEmojiRow from './emoji_row.vue';
import { DtTooltip } from '@/components/tooltip';
import { emojiToShortcode } from '@/common/emoji';

// Constants
const testEmojiObj = {
  emojiUnicodeOrShortname: '🙃',
  names: 'John Doe & Olivia Chen',
  isSelected: false,
  num: 2,
};
const emojiShortcode = emojiToShortcode(testEmojiObj.emojiUnicodeOrShortname);

// \u2068 and \u2069 are Unicode bidi isolation characters.
// They are non-printing characters that help text layout engines to ensure that the interpolated strings are handled correctly
// in the situation where the text direction of the substitution might not match the text direction of the localized text.
// https://github.com/django-ftl/fluent-compiler/blob/master/docs/usage.rst#formatting-messages
const MOCK_LOCALIZED_EMOJI_REACTION_ARIA_LABEL = `reacted with \u2068${emojiShortcode}\u2069`;

const basePropsData = {
  reactions: [
    testEmojiObj,
  ],
};

describe('DtRecipeEmojiRow Tests', function () {
  // Wrappers
  let wrapper;
  let emojiReactionButton;
  let tooltip;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    emojiReactionButton = wrapper.find('[data-qa="feed-item-reaction-button"');
    tooltip = wrapper.findComponent(DtTooltip);
  };

  const transitionStub = () => ({
    render: function () {
      return this.$options._renderChildren;
    },
  });

  const _setWrappers = () => {
    wrapper = mount(DtRecipeEmojiRow, {
      stubs: {
        // this gets around transition async problems. See https://v1.test-utils.vuejs.org/guides/common-tips.html
        transition: transitionStub(),
      },
      propsData,
      attrs,
      slots,
      provide,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(function () {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });

  beforeEach(function () {
    _setWrappers();
  });

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
  });
  afterAll(function () {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', function () {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    describe('Default render', function () {
      it('should exist', () => {
        expect(wrapper.exists()).toBe(true);
      });
      it('should render a tooltip component', () => {
        expect(tooltip.exists()).toBeTruthy();
      });
      it('should render a reaction button', () => {
        expect(emojiReactionButton.exists()).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', function () {
    /*
     * Test(s) to ensure that the component is accessible
     */

    describe('Default Render', function () {
      it('should render a reaction button with correct aria-label', () => {
        expect(emojiReactionButton.attributes('aria-label')).toContain(MOCK_LOCALIZED_EMOJI_REACTION_ARIA_LABEL);
      });
    });
  });

  describe('Interactivity Tests', function () {
    /*
     * Test(s) to ensure that the component correctly handles user input
     */

    describe('Click Emoji button event', function () {
      it('Should emit a emoji clicked event', async () => {
        await emojiReactionButton.trigger('click');
        expect(wrapper.emitted('emoji-clicked')[0][0]).toBe(testEmojiObj.emojiUnicodeOrShortname);
      });
    });

    describe('Hover Emoji button event', function () {
      beforeEach(async () => {
        tooltip.vm.$emit('shown', true);
      });

      it('Should emit a hovered event', async () => {
        expect(wrapper.emitted('emoji-hovered')[0][0]).toEqual({
          reaction: testEmojiObj.emojiUnicodeOrShortname,
          state: true,
        });
      });
    });
  });

  describe('Validation Tests', function () {
    /*
     * Test(s) to ensure that custom validators are working as expected
     */

    describe('reaction validator', () => {
      // Test Environment
      const prop = DtRecipeEmojiRow.props.reactions;

      describe('Valid reaction in an array', () => {
        itBehavesLikePassesCustomPropValidation(prop, [testEmojiObj]);
      });
      describe('Empty array', () => {
        itBehavesLikePassesCustomPropValidation(prop, []);
      });
      describe('Reaction with missing attributes', () => {
        itBehavesLikeFailsCustomPropValidation(prop, [{}]);
      });
    });
  });
});
