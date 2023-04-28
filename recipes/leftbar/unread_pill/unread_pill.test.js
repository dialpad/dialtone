import { mount } from '@vue/test-utils';
import { itBehavesLikeHasCorrectClass } from '@/tests/shared_examples/classes';
import DtRecipeUnreadPill from './unread_pill.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '@/tests/shared_examples/validation';
import { UNREAD_PILL_DIRECTIONS, UNREAD_PILL_KINDS } from '@/recipes/leftbar/unread_pill/unread_pill_constants';

// Constants
const baseProps = {
  kind: UNREAD_PILL_KINDS[0],
  direction: UNREAD_PILL_DIRECTIONS[0],
};
const baseSlots = {
  default: 'Unread mentions',
};

describe('DtRecipeUnreadPill Tests', () => {
  // Wrappers
  let wrapper;
  let unreadPillLabel;
  let unreadPillIcon;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = baseSlots;
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    unreadPillLabel = wrapper.find('[data-qa="dt-leftbar-unread-pill__label"]');
    unreadPillIcon = wrapper.find('[data-qa="dt-icon"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeUnreadPill, {
      props,
      attrs,
      slots,
      provide,
    });
    _setChildWrappers();
  };

  beforeEach(function () {
    _setWrappers();
  });

  // Teardown
  afterEach(() => {
    props = baseProps;
    attrs = {};
    slots = baseSlots;
    provide = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('When the unread pill renders', () => {
      it('should exist', () => { expect(wrapper.exists()).toBeTruthy(); });
      it('should render the text', () => {
        expect(unreadPillLabel.text()).toBe(baseSlots.default);
      });
      it('should render the icon', () => {
        expect(unreadPillIcon.exists()).toBeTruthy();
      });
    });

    describe('When the kind is messages', () => {
      beforeEach(async () => {
        await wrapper.setProps({ kind: 'messages' });
      });

      it('should contain the correct class', () => {
        itBehavesLikeHasCorrectClass(wrapper, 'dt-leftbar-unread-pill--messages');
      });
    });

    describe('When the kind is mentions', () => {
      beforeEach(async () => {
        await wrapper.setProps({ kind: 'mentions' });
      });

      it('should contain the correct class', () => {
        itBehavesLikeHasCorrectClass(wrapper, 'dt-leftbar-unread-pill--mentions');
      });
    });

    describe('When the direction is up', () => {
      beforeEach(async () => {
        await wrapper.setProps({ direction: 'up' });
      });

      it('should contain the correct class', () => {
        itBehavesLikeHasCorrectClass(unreadPillIcon, 'd-icon--arrow-up');
      });
    });

    describe('When the direction is down', () => {
      beforeEach(async () => {
        await wrapper.setProps({ direction: 'down' });
        _setChildWrappers();
      });

      it('should contain the correct class', () => {
        itBehavesLikeHasCorrectClass(unreadPillIcon, 'd-icon--arrow-down');
      });
    });
  });

  describe('Interactivity Tests', () => {
    const clickListenerSpy = jest.fn();

    beforeEach(function () {
      attrs = { onClick: clickListenerSpy };
      _setWrappers();
    });

    describe('When the unread pill is clicked', () => {
      beforeEach(() => {
        wrapper.trigger('click');
      });

      it('should emit click', () => {
        expect(clickListenerSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Kind validator', () => {
      const prop = DtRecipeUnreadPill.props.kind;

      describe('When provided kind is in UNREAD_PILL_KINDS', () => {
        itBehavesLikePassesCustomPropValidation(prop, UNREAD_PILL_KINDS[0]);
      });

      describe('When provided kind is not in UNREAD_PILL_KINDS', () => {
        itBehavesLikeFailsCustomPropValidation(prop, 'other_value');
      });
    });

    describe('Direction validator', () => {
      const prop = DtRecipeUnreadPill.props.direction;

      describe('When provided direction is in UNREAD_PILL_DIRECTIONS', () => {
        itBehavesLikePassesCustomPropValidation(prop, UNREAD_PILL_DIRECTIONS[0]);
      });

      describe('When provided kind is not in UNREAD_PILL_DIRECTIONS', () => {
        itBehavesLikeFailsCustomPropValidation(prop, 'other_value');
      });
    });
  });
});
