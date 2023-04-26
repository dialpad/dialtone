import { createLocalVue, mount } from '@vue/test-utils';
import { itBehavesLikeHasCorrectClass } from '@/tests/shared_examples/classes';
import DtRecipeUnreadChip from './unread_chip.vue';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '@/tests/shared_examples/validation';
import { UNREAD_BADGE_DIRECTIONS, UNREAD_BADGE_KINDS } from '@/recipes/leftbar/unread_chip/unread_chip_constants';

// Constants
const baseProps = {
  kind: UNREAD_BADGE_KINDS[0],
  direction: UNREAD_BADGE_DIRECTIONS[0],
};
const baseSlots = {
  default: 'Unread mentions',
};

describe('DtRecipeUnreadChip Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let unreadChipLabel;
  let unreadChipIcon;

  // Environment
  let propsData = baseProps;
  let attrs = {};
  let slots = baseSlots;
  let provide = {};
  let listeners = {};

  // Helpers
  const _setChildWrappers = () => {
    unreadChipLabel = wrapper.find('[data-qa="dt-leftbar-unread-chip__label"]');
    unreadChipIcon = wrapper.find('[data-qa="dt-icon"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeUnreadChip, {
      propsData,
      attrs,
      slots,
      provide,
      listeners,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });
  beforeEach(() => {
    _setWrappers();
  });

  // Teardown
  afterEach(() => {
    propsData = baseProps;
    attrs = {};
    slots = baseSlots;
    provide = {};
    listeners = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('When the unread chip renders', () => {
      it('should exist', () => { expect(wrapper.exists()).toBeTruthy(); });
      it('should render the text', () => {
        expect(unreadChipLabel.text()).toBe(baseSlots.default);
      });
      it('should render the icon', () => {
        expect(unreadChipIcon.exists()).toBeTruthy();
      });
    });

    describe('When the kind is messages', () => {
      beforeEach(async () => {
        await wrapper.setProps({ kind: 'messages' });
      });

      it('should contain the correct class', () => {
        itBehavesLikeHasCorrectClass(wrapper, 'dt-leftbar-unread-chip__messages');
      });
    });

    describe('When the kind is mentions', () => {
      beforeEach(async () => {
        await wrapper.setProps({ kind: 'mentions' });
      });

      it('should contain the correct class', () => {
        itBehavesLikeHasCorrectClass(wrapper, 'dt-leftbar-unread-chip__mentions');
      });
    });

    describe('When the direction is up', () => {
      beforeEach(async () => {
        await wrapper.setProps({ direction: 'up' });
      });

      it('should contain the correct class', () => {
        itBehavesLikeHasCorrectClass(unreadChipIcon, 'd-icon--arrow-up');
      });
    });

    describe('When the direction is down', () => {
      beforeEach(async () => {
        await wrapper.setProps({ direction: 'down' });
      });

      it('should contain the correct class', () => {
        itBehavesLikeHasCorrectClass(unreadChipIcon, 'd-icon--arrow-down');
      });
    });
  });

  describe('Interactivity Tests', () => {
    const clickListenerSpy = jest.fn();

    beforeEach(() => {
      listeners = { click: clickListenerSpy };
      _setWrappers();
    });

    describe('When the unread chip is clicked', () => {
      beforeEach(() => {
        wrapper.find('[data-qa="dt-chip"]').trigger('click');
      });

      it('should emit click', () => {
        expect(clickListenerSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Kind validator', () => {
      const prop = DtRecipeUnreadChip.props.kind;

      describe('When provided kind is in UNREAD_BADGE_KINDS', () => {
        itBehavesLikePassesCustomPropValidation(prop, UNREAD_BADGE_KINDS[0]);
      });

      describe('When provided kind is not in UNREAD_BADGE_KINDS', () => {
        itBehavesLikeFailsCustomPropValidation(prop, 'other_value');
      });
    });

    describe('Direction validator', () => {
      const prop = DtRecipeUnreadChip.props.direction;

      describe('When provided direction is in UNREAD_BADGE_DIRECTIONS', () => {
        itBehavesLikePassesCustomPropValidation(prop, UNREAD_BADGE_DIRECTIONS[0]);
      });

      describe('When provided kind is not in UNREAD_BADGE_DIRECTIONS', () => {
        itBehavesLikeFailsCustomPropValidation(prop, 'other_value');
      });
    });
  });
});
