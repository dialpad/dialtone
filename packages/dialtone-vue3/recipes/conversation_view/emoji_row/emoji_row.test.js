import { mount } from '@vue/test-utils';
import {
  itBehavesLikeEmitsExpectedEvent,
} from '../../../tests/shared_examples/events';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '../../../tests/shared_examples/validation';
import DtRecipeEmojiRow from './emoji_row.vue';
import DtTooltip from '@/components/tooltip/tooltip.vue';

// Constants
const testEmojiObj = {
  emojiUnicodeOrShortname: '🙃',
  isSelected: false,
  ariaLabel: 'Emoji aria label',
  tooltip: 'You reacted with 🙃',
  num: 99,
};

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
    render: function (h) {
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
      attachTo: document.body,
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
      it('should render a reaction button', () => {
        expect(emojiReactionButton.attributes('aria-label')).toBe(testEmojiObj.ariaLabel);
      });
    });
  });

  describe('Interactivity Tests', function () {
    /*
     * Test(s) to ensure that the component correctly handles user input
     */

    describe('Click Emoji button event', async function () {
      it('Should emit a emoji clicked event', async () => {
        await emojiReactionButton.trigger('click');
        itBehavesLikeEmitsExpectedEvent(wrapper, 'emoji-clicked', testEmojiObj.emojiUnicodeOrShortname);
      });
    });

    describe('Hover Emoji button event', async function () {
      beforeEach(async () => {
        tooltip.vm.$emit('shown', true);
      });

      it('Should emit a hovered event', async () => {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'emoji-hovered', {
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
