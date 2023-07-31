import { createLocalVue, mount } from '@vue/test-utils';
import DtAvatar from './avatar.vue';
import { flushPromises } from '@/common/utils';
import { itBehavesLikeHasCorrectClass } from '@/tests/shared_examples/classes.js';
import { AVATAR_KIND_MODIFIERS, AVATAR_SIZE_MODIFIERS } from './avatar_constants';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '@/tests/shared_examples/validation.js';
import {
  itBehavesLikeAppliesClassToChild,
} from '@/tests/shared_examples/extendability.js';

// Constants
const imageSource = 'image.png';
const initials = 'JN';
const basePropsData = {
  fullName: 'Jaqueline Nackos',
};
const baseAttrs = {};

describe('DtAvatar Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

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
    wrapper = mount(DtAvatar, {
      propsData,
      attrs,
      slots,
      localVue: testContext.localVue,
    });
    await flushPromises();
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });
  beforeEach(() => {});

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = {};
    slots = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('When the avatar renders', () => {
      // Test Setup
      beforeEach(async () => {
        await _setWrappers();
      });

      it('should exists', () => { expect(wrapper.exists()).toBeTruthy(); });
      it(
        'should render the avatar',
        () => { expect(wrapper.exists()).toBe(true); },
      );
    });

    describe('When the imageSrc is provided', () => {
      // Test Setup
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          imageSrc: imageSource,
        };
        await _setWrappers();
      });

      it('image should exist', () => {
        expect(image).toBeTruthy();
      });

      it('src should match those provided by attrs', () => {
        expect(image.attributes('src')).toBe(imageSource);
      });

      it('alt should match those provided by attrs', () => {
        expect(image.attributes('alt')).toBe(basePropsData.fullName);
      });
    });

    describe('When the iconName is provided', () => {
      // Test Setup
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          iconName: 'accessibility',
        };
        await _setWrappers();
      });

      it('icon should exist', () => {
        expect(wrapper.find('svg').exists()).toBeTruthy();
      });

      // eslint-disable-next-line vitest/expect-expect
      it('should have correct class', () => {
        itBehavesLikeHasCorrectClass(wrapper.find('svg'), AVATAR_KIND_MODIFIERS.icon);
      });
    });

    describe('With no imageSrc or iconName is provided', () => {
      beforeEach(async () => {
        await _setWrappers();
      });

      it('should display initials', () => {
        expect(wrapper.text()).toBe(initials);
      });

      it('should have correct class', () => {
        const avatarWithInitials = wrapper.find('.' + AVATAR_KIND_MODIFIERS.initials);
        expect(avatarWithInitials.exists()).toBeTruthy();
      });

      describe('When size is sm', () => {
        beforeEach(async () => {
          propsData = {
            ...basePropsData,
            size: 'sm',
          };
          await _setWrappers();
        });

        it('shows a single character', async () => {
          expect(wrapper.text()).toBe(initials[0]);
        });
      });

      describe('When size is xs', () => {
        beforeEach(async () => {
          propsData = {
            ...basePropsData,
            size: 'xs',
          };
          await _setWrappers();
        });

        it('has no initials', () => {
          expect(wrapper.text()).toBe('');
        });
      });
    });

    describe('When size is provided', () => {
      // Test Environment
      const size = 'lg';

      // Test Setup
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          size,
        };
        await _setWrappers();
      });

      it('should have size variant class on the avatar', () => {
        expect(wrapper.classes(AVATAR_SIZE_MODIFIERS[size])).toBe(true);
      });
    });

    describe('When group is provided', () => {
      // Test Environment
      const group = 25;

      // Test Setup
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          group,
        };
        await _setWrappers();
      });

      it('should have group count', () => {
        expect(count).toBeTruthy();
      });

      it('should have the correct group number', () => {
        expect(count.text()).toBe(group.toString());
      });

      it('should not render group if group value is 1 or less', async () => {
        await wrapper.setProps({ group: 1 });
        _setChildWrappers();
        expect(count.exists()).toBe(false);
      });

      it('should render "99+" if group is greater than 99', async () => {
        await wrapper.setProps({ group: 100 });
        _setChildWrappers();
        expect(count.text()).toBe('99+');
      });
    });

    describe('With Presence', () => {
      // Test Setup
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
        };
        await _setWrappers();
      });

      it(
        'should not render presence if presence prop is not defined',
        async () => {
          await wrapper.setProps({ presence: null });
          presence = wrapper.find('[data-qa="dt-presence"]');
          expect(presence.exists()).toBe(false);
        },
      );

      it(
        'should render presence when presence prop is defined',
        async () => {
          await wrapper.setProps({ presence: 'active' });
          presence = wrapper.find('[data-qa="dt-presence"]');
          expect(presence.exists()).toBe(true);
          expect(presence.classes('d-avatar__presence')).toBe(true);
        },
      );

      it(
        'should pass through data in presenceProps to the presence component',
        async () => {
          await wrapper.setProps({
            presence: 'active',
            presenceProps: {
              'aria-live': 'assertive',
              'random-attribute': 'value',
              propValue: 2,
            },
          });
          presence = wrapper.find('[data-qa="dt-presence"]');
          expect(presence.exists()).toBe(true);
          expect(presence.attributes('aria-live')).toBe('assertive');
          expect(presence.attributes('random-attribute')).toBe('value');
        },
      );

      it('should update presence styles based on Avatar size', async () => {
        // default styles are for 'sm'
        await wrapper.setProps({
          size: 'md',
          presence: 'active',
        });
        presence = wrapper.find('[data-qa="dt-presence"]');
        expect(presence.classes('d-avatar__presence--md')).toBe(true);
        await wrapper.setProps({
          size: 'lg',
          presence: 'active',
        });
        presence = wrapper.find('[data-qa="dt-presence"]');
        expect(presence.classes('d-avatar__presence--lg')).toBe(true);
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Size Validator', () => {
      // Test Environment
      const prop = DtAvatar.props.size;

      describe('When provided size is in AVATAR_SIZE_MODIFIERS', () => {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided size is not in AVATAR_SIZE_MODIFIERS', () => {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_SIZE`);
      });
    });

    describe('Group Validator', () => {
      // Test Environment
      const prop = DtAvatar.props.group;

      describe('When provided group is valid to show group count', () => {
        itBehavesLikePassesCustomPropValidation(prop, 2);
      });

      describe('When provided group is not in the valid range (below min)', () => {
        itBehavesLikeFailsCustomPropValidation(prop, 1);
      });
    });
  });

  describe('Extendability Tests', () => {
    // Test Environment
    let element;
    const customClass = 'my-custom-class';

    // Helpers
    const _setupChildClassTest = async (childClassName, selector) => {
      propsData[childClassName] = customClass;
      await _setWrappers();
      element = wrapper.find(selector);
    };

    // Shared Examples
    const itBehavesLikeAppliesClassToChildLocal = () => {
      // eslint-disable-next-line vitest/expect-expect
      it('should apply custom class to child', () => {
        itBehavesLikeAppliesClassToChild(wrapper, '.my-custom-class', element);
      });
    };

    describe('When an avatar class is provided', () => {
      // Test Setup
      beforeEach(async () => {
        await _setupChildClassTest('avatarClass', '[data-qa="dt-avatar"]');
      });

      itBehavesLikeAppliesClassToChildLocal();
    });
  });
});
