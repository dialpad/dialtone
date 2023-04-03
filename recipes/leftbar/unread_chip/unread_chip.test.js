import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import { itBehavesLikeHasCorrectClass } from '@/tests/shared_examples/classes';
import DtRecipeUnreadChip from './unread_chip.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '@/tests/shared_examples/validation';
import { UNREAD_BADGE_DIRECTIONS, UNREAD_BADGE_KINDS } from '@/recipes/leftbar/unread_chip/unread_chip_constants';
import sinon from 'sinon';

// Constants
const baseProps = {
  kind: UNREAD_BADGE_KINDS[0],
  direction: UNREAD_BADGE_DIRECTIONS[0],
};
const baseSlots = {
  default: 'Unread mentions',
};

describe('DtRecipeUnreadChip Tests', function () {
  // Wrappers
  let wrapper;
  let unreadChipLabel;
  let unreadChipIcon;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = baseSlots;
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    unreadChipLabel = wrapper.find('[data-qa="dt-leftbar-unread-chip__label"]');
    unreadChipIcon = wrapper.find('[data-qa="dt-icon"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeUnreadChip, {
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
    describe('When the unread chip renders', function () {
      it('should exist', function () { assert.exists(wrapper); });
      it('should render the text', function () {
        assert.strictEqual(unreadChipLabel.text(), baseSlots.default);
      });
      it('should render the icon', function () {
        assert.exists(unreadChipIcon);
      });
    });

    describe('When the kind is messages', function () {
      beforeEach(async function () {
        await wrapper.setProps({ kind: 'messages' });
      });

      it('should contain the correct class', function () {
        itBehavesLikeHasCorrectClass(wrapper, 'dt-leftbar-unread-chip__messages');
      });
    });

    describe('When the kind is mentions', function () {
      beforeEach(async function () {
        await wrapper.setProps({ kind: 'mentions' });
      });

      it('should contain the correct class', function () {
        itBehavesLikeHasCorrectClass(wrapper, 'dt-leftbar-unread-chip__mentions');
      });
    });

    describe('When the direction is up', function () {
      beforeEach(async function () {
        await wrapper.setProps({ direction: 'up' });
      });

      it('should contain the correct class', function () {
        itBehavesLikeHasCorrectClass(unreadChipIcon, 'd-icon--arrow-up');
      });
    });

    describe('When the direction is down', function () {
      beforeEach(async function () {
        await wrapper.setProps({ direction: 'down' });
        _setChildWrappers();
      });

      it('should contain the correct class', function () {
        itBehavesLikeHasCorrectClass(unreadChipIcon, 'd-icon--arrow-down');
      });
    });
  });

  describe('Interactivity Tests', function () {
    const clickListenerSpy = sinon.spy();

    beforeEach(function () {
      attrs = { onClick: clickListenerSpy };
      _setWrappers();
    });

    describe('When the unread chip is clicked', function () {
      beforeEach(function () {
        wrapper.find('[data-qa="dt-chip"]').trigger('click');
      });

      it('should emit click', function () {
        assert.strictEqual(clickListenerSpy.callCount, 1);
      });
    });
  });

  describe('Validation Tests', function () {
    describe('Kind validator', function () {
      const prop = DtRecipeUnreadChip.props.kind;

      describe('When provided kind is in UNREAD_BADGE_KINDS', function () {
        itBehavesLikePassesCustomPropValidation(prop, UNREAD_BADGE_KINDS[0]);
      });

      describe('When provided kind is not in UNREAD_BADGE_KINDS', function () {
        itBehavesLikeFailsCustomPropValidation(prop, 'other_value');
      });
    });

    describe('Direction validator', function () {
      const prop = DtRecipeUnreadChip.props.direction;

      describe('When provided direction is in UNREAD_BADGE_DIRECTIONS', function () {
        itBehavesLikePassesCustomPropValidation(prop, UNREAD_BADGE_DIRECTIONS[0]);
      });

      describe('When provided kind is not in UNREAD_BADGE_DIRECTIONS', function () {
        itBehavesLikeFailsCustomPropValidation(prop, 'other_value');
      });
    });
  });
});
