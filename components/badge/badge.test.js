import { mount } from '@vue/test-utils';
import DtBadge from './badge.vue';
import { BADGE_TYPE_MODIFIERS, BADGE_KIND_MODIFIERS, BADGE_DECORATION_MODIFIERS } from './badge_constants';
import { itBehavesLikeHasCorrectClass } from '../../tests/shared_examples/classes';

// Constants
const baseProps = {};

describe('DtBadge Tests', () => {
  let wrapper;
  let badge;
  let iconLeftWrapper;
  let iconLeft;

  // Environment
  let props = baseProps;
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
      props,
      slots,

    });
    _setChildWrappers();
  };

  beforeEach(() => {
    props = baseProps;
    slots = {};
    _setWrappers();
  });

  describe('Presentation Tests', () => {
    // Shared Examples
    const itBehavesLikeRendersText = text => {
      it('should render the badge', () => { expect(badge.exists()).toBe(true); });
      it(
        'should display the correct text',
        () => { expect(badge.text()).toBe(text); },
      );
    };

    const itBehavesLikeHasCorrectType = type => {
      it('should have correct type', async () => {
        await wrapper.setProps({ type });
        itBehavesLikeHasCorrectClass(badge, BADGE_TYPE_MODIFIERS[type]);
      });
    };

    const itBehavesLikeHasCorrectKind = kind => {
      it('should have correct kind', async () => {
        await wrapper.setProps({ kind });
        itBehavesLikeHasCorrectClass(badge, BADGE_KIND_MODIFIERS[kind]);
      });
    };

    const itBehavesLikeHasCorrectDecoration = decoration => {
      it('should have correct decoration', async () => {
        await wrapper.setProps({ decoration });
        const decorativeSpan = wrapper.find('.d-badge__decorative');
        expect(decorativeSpan.exists()).toBeTruthy();
        itBehavesLikeHasCorrectClass(badge, BADGE_DECORATION_MODIFIERS[decoration]);
      });
    };

    describe('When the badge renders', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it('should exist', () => { expect(wrapper.exists()).toBeTruthy(); });
    });

    describe('When a text is provided via slot', () => {
      // Test Environment
      const slotText = 'Default slot text';

      // Test Setup
      beforeEach(() => {
        slots = { default: slotText };
        _setWrappers();
      });

      itBehavesLikeRendersText(slotText);
    });

    describe('When a text is provided via prop', () => {
      // Test Environment
      const propText = 'Prop text';

      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, text: propText };
        _setWrappers();
      });

      itBehavesLikeRendersText(propText);
    });

    describe('When a type is provided via prop', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      describe('When type is info', () => { itBehavesLikeHasCorrectType('info'); });

      describe('When type is success', () => { itBehavesLikeHasCorrectType('success'); });

      describe('When type is warning', () => { itBehavesLikeHasCorrectType('warning'); });

      describe('When type is critical', () => { itBehavesLikeHasCorrectType('critical'); });

      describe('When type is ai', () => {
        beforeEach(async () => {
          await wrapper.setProps({ type: 'ai' });
          _setChildWrappers();
        });

        itBehavesLikeHasCorrectType('ai');

        it('renders ai icon in iconLeft slot by default', () => {
          expect(iconLeft.attributes('data-name') === 'Dialpad Ai').toBe(true);
        });
      });
    });

    describe('When a kind is provided via prop', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      describe('When kind is count', () => { itBehavesLikeHasCorrectKind('count'); });
    });

    describe('When a decoration is provided via prop', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      describe('When decoration is black-900', () => { itBehavesLikeHasCorrectDecoration('black-900'); });

      describe('When decoration is red-400', () => { itBehavesLikeHasCorrectDecoration('red-400'); });

      describe('When decoration is purple-400', () => { itBehavesLikeHasCorrectDecoration('purple-400'); });

      describe('When decoration is gold-300', () => { itBehavesLikeHasCorrectDecoration('gold-300'); });
    });
  });
});
