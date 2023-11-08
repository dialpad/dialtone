import { mount } from '@vue/test-utils';
import DtAvatar from './avatar.vue';
import { AVATAR_KIND_MODIFIERS, AVATAR_SIZE_MODIFIERS } from './avatar_constants';

const MOCK_AVATAR_STUB = vi.fn();
const MOCK_IMAGE_SOURCE = 'image.png';
const MOCK_INITIALS = 'JN';
const MOCK_SIZE = 'lg';
const MOCK_GROUP = 25;
const MOCK_CUSTOM_CLASS = 'my-custom-class';
let MOCK_ELEMENT = null;

const baseProps = {
  fullName: 'Jaqueline Nackos',
};
const baseAttrs = {};

let mockProps = {};
let mockAttrs = {};
const testContext = {};

describe('DtAvatar Tests', () => {
  let wrapper;
  let image;
  let count;
  let presence;

  const updateWrapper = () => {
    wrapper = mount(DtAvatar, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      localVue: testContext.localVue,
    });

    image = wrapper.find('[data-qa="dt-avatar-image"]');
    count = wrapper.find('[data-qa="dt-avatar-count"]');
    presence = wrapper.find('[data-qa="dt-presence"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
  });

  describe('Presentation Tests', () => {
    describe('When the avatar renders', () => {
      it('should exists', () => {
        expect(wrapper.exists()).toBeTruthy();
      });

      it('should render the avatar', () => {
        expect(wrapper.exists()).toBe(true);
      });
    });

    describe('When the imageSrc is provided', () => {
      beforeEach(async () => {
        mockProps = { imageSrc: MOCK_IMAGE_SOURCE };

        updateWrapper();
      });

      it('image should exist', () => {
        expect(image).toBeTruthy();
      });

      it('src should match those provided by attrs', () => {
        expect(image.attributes('src')).toBe(MOCK_IMAGE_SOURCE);
      });

      it('alt should match those provided by attrs', () => {
        expect(image.attributes('alt')).toBe(baseProps.fullName);
      });
    });

    describe('When the iconName is provided', () => {
      beforeEach(async () => {
        mockProps = { iconName: 'accessibility' };

        updateWrapper();
        await vi.dynamicImportSettled();
      });

      it('icon should exist', () => {
        expect(wrapper.find('svg').exists()).toBeTruthy();
      });

      it('should have correct class', () => {
        expect(wrapper.find('svg').classes(AVATAR_KIND_MODIFIERS.icon)).toBe(true);
      });
    });

    describe('With no imageSrc or iconName is provided', () => {
      it('should display initials', () => {
        expect(wrapper.text()).toBe(MOCK_INITIALS);
      });

      it('should have correct class', () => {
        const avatarWithInitials = wrapper.find('.' + AVATAR_KIND_MODIFIERS.initials);

        expect(avatarWithInitials.exists()).toBeTruthy();
      });

      describe('When size is sm', () => {
        it('shows a single character', async () => {
          mockProps = { size: 'sm' };

          updateWrapper();

          expect(wrapper.text()).toBe(MOCK_INITIALS[0]);
        });
      });

      describe('When size is xs', () => {
        it('has no initials', () => {
          mockProps = { size: 'xs' };

          updateWrapper();

          expect(wrapper.text()).toBe('');
        });
      });
    });

    describe('When size is provided', () => {
      it('should have size variant class on the avatar', () => {
        mockProps = { size: MOCK_SIZE };

        updateWrapper();

        expect(wrapper.classes(AVATAR_SIZE_MODIFIERS[MOCK_SIZE])).toBe(true);
      });
    });

    describe('When group is provided', () => {
      beforeEach(async () => {
        mockProps = { group: MOCK_GROUP };

        updateWrapper();
      });

      it('should have group count', () => {
        expect(count).toBeTruthy();
      });

      it('should have the correct group number', () => {
        expect(count.text()).toBe(MOCK_GROUP.toString());
      });

      it('should not render group if group value is 1 or less', async () => {
        await wrapper.setProps({ group: 1 });

        count = wrapper.find('[data-qa="dt-avatar-count"]');

        expect(count.exists()).toBe(false);
      });

      it('should render "99+" if group is greater than 99', async () => {
        await wrapper.setProps({ group: 100 });

        count = wrapper.find('[data-qa="dt-avatar-count"]');

        expect(count.text()).toBe('99+');
      });
    });

    describe('When seed is set', () => {
      // note we keep these tests in sync with the android team, so do not change without communicating with them.
      it.each([
        ['a', 'd-avatar--color-800'],
        ['aaa', 'd-avatar--color-400'],
        ['bbbbb', 'd-avatar--color-1100'],
      ])('when seed is set to: %s color class: %s should be set on avatar', (seed, expectedClass) => {
        mockProps = { seed };

        updateWrapper();

        expect(wrapper.classes(expectedClass)).toBe(true);
      });
    });

    describe('With Presence', () => {
      it('should not render presence if presence prop is not defined', async () => {
        await wrapper.setProps({ presence: null });

        presence = wrapper.find('[data-qa="dt-presence"]');

        expect(presence.exists()).toBe(false);
      });

      it('should render presence when presence prop is defined', async () => {
        await wrapper.setProps({ presence: 'active' });

        presence = wrapper.find('[data-qa="dt-presence"]');

        expect(presence.exists()).toBe(true);
        expect(presence.classes('d-avatar__presence')).toBe(true);
      });

      it('should pass through data in presenceProps to the presence component', async () => {
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
      });

      it('should update presence styles based on Avatar size', async () => {
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

  describe('Interactivity Tests', () => {
    describe('When clickable is false (default)', () => {
      describe('When avatar is clicked', () => {
        beforeEach(async () => {
          mockAttrs = { onClick: MOCK_AVATAR_STUB };

          updateWrapper();

          await wrapper.trigger('click');
        });

        it('Should not call listener', async () => {
          expect(MOCK_AVATAR_STUB).toHaveBeenCalledTimes(0);
        });

        it('Should not emit click event', () => {
          expect(wrapper.emitted()).not.toHaveProperty('click');
        });
      });
    });
    describe('When clickable is true', () => {
      describe('When avatar is clicked', () => {
        beforeEach(async () => {
          mockProps = { clickable: true };
          mockAttrs = { onClick: MOCK_AVATAR_STUB };

          updateWrapper();

          await wrapper.trigger('click');
        });

        it('Should call listener', async () => {
          expect(MOCK_AVATAR_STUB).toBeCalledTimes(1);
        });

        it('Should emit click event', () => {
          expect(wrapper.emitted()).toHaveProperty('click');
        });
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Size Validator', () => {
      describe('When provided size is in AVATAR_SIZE_MODIFIERS', () => {
        it('passes custom prop validation', () => {
          expect(DtAvatar.props.size.validator(DtAvatar.props.size.default)).toBe(true);
        });
      });

      describe('When provided size is not in AVATAR_SIZE_MODIFIERS', () => {
        it('fails custom prop validation', () => {
          expect(DtAvatar.props.size.validator(`INVALID_SIZE`)).toBe(false);
        });
      });
    });

    describe('Group Validator', () => {
      describe('When provided group is valid to show group count', () => {
        it('passes custom prop validation', () => {
          expect(DtAvatar.props.group.validator(2)).toBe(true);
        });
      });

      describe('When provided group is not in the valid range (below min)', () => {
        it('fails custom prop validation', () => {
          expect(DtAvatar.props.group.validator(1)).toBe(false);
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When an avatar class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps.avatarClass = MOCK_CUSTOM_CLASS;

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="dt-avatar"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });
  });
});
