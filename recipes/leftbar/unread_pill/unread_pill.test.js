import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import { itBehavesLikeHasCorrectClass } from '@/tests/shared_examples/classes';
import DtRecipeUnreadPill from './unread_pill.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '@/tests/shared_examples/validation';
import { UNREAD_PILL_DIRECTIONS, UNREAD_PILL_KINDS } from '@/recipes/leftbar/unread_pill/unread_pill_constants';
import sinon from 'sinon';

// Constants
const baseProps = {
  kind: UNREAD_PILL_KINDS[0],
  direction: UNREAD_PILL_DIRECTIONS[0],
};
const baseSlots = {
  default: 'Unread mentions',
};

describe('DtRecipeUnreadPill Tests', function () {
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

  // Setup
  before(function () {});
  beforeEach(function () {
    _setWrappers();
  });

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = baseSlots;
    provide = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    describe('When the unread pill renders', function () {
      it('should exist', function () { assert.exists(wrapper); });
      it('should render the text', function () {
        assert.strictEqual(unreadPillLabel.text(), baseSlots.default);
      });
      it('should render the icon', function () {
        assert.exists(unreadPillIcon);
      });
    });

    describe('When the kind is messages', function () {
      beforeEach(async function () {
        await wrapper.setProps({ kind: 'messages' });
      });

      it('should contain the correct class', function () {
        itBehavesLikeHasCorrectClass(wrapper, 'dt-leftbar-unread-pill--messages');
      });
    });

    describe('When the kind is mentions', function () {
      beforeEach(async function () {
        await wrapper.setProps({ kind: 'mentions' });
      });

      it('should contain the correct class', function () {
        itBehavesLikeHasCorrectClass(wrapper, 'dt-leftbar-unread-pill--mentions');
      });
    });

    describe('When the direction is up', function () {
      beforeEach(async function () {
        await wrapper.setProps({ direction: 'up' });
      });

      it('should contain the correct class', function () {
        itBehavesLikeHasCorrectClass(unreadPillIcon, 'd-icon--arrow-up');
      });
    });

    describe('When the direction is down', function () {
      beforeEach(async function () {
        await wrapper.setProps({ direction: 'down' });
        _setChildWrappers();
      });

      it('should contain the correct class', function () {
        itBehavesLikeHasCorrectClass(unreadPillIcon, 'd-icon--arrow-down');
      });
    });
  });

  describe('Interactivity Tests', function () {
    const clickListenerSpy = sinon.spy();

    beforeEach(function () {
      attrs = { onClick: clickListenerSpy };
      _setWrappers();
    });

    describe('When the unread pill is clicked', function () {
      beforeEach(function () {
        wrapper.trigger('click');
      });

      it('should emit click', function () {
        assert.strictEqual(clickListenerSpy.callCount, 1);
      });
    });
  });

  describe('Validation Tests', function () {
    describe('Kind validator', function () {
      const prop = DtRecipeUnreadPill.props.kind;

      describe('When provided kind is in UNREAD_PILL_KINDS', function () {
        itBehavesLikePassesCustomPropValidation(prop, UNREAD_PILL_KINDS[0]);
      });

      describe('When provided kind is not in UNREAD_PILL_KINDS', function () {
        itBehavesLikeFailsCustomPropValidation(prop, 'other_value');
      });
    });

    describe('Direction validator', function () {
      const prop = DtRecipeUnreadPill.props.direction;

      describe('When provided direction is in UNREAD_PILL_DIRECTIONS', function () {
        itBehavesLikePassesCustomPropValidation(prop, UNREAD_PILL_DIRECTIONS[0]);
      });

      describe('When provided kind is not in UNREAD_PILL_DIRECTIONS', function () {
        itBehavesLikeFailsCustomPropValidation(prop, 'other_value');
      });
    });
  });
});
