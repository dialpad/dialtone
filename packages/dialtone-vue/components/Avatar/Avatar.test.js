import { mount } from '@vue/test-utils';
import { DtIconUser } from '@dialpad/dialtone-icons/vue';
import DtAvatar from './Avatar.vue';
import { AVATAR_KIND_MODIFIERS, AVATAR_SIZE_MODIFIERS, colorToFamilyVariant } from './AvatarConstants';
import { extractInitialsFromName } from './Utils';

const MOCK_AVATAR_STUB = vi.fn();
const MOCK_IMAGE_SOURCE = 'image.png';
const MOCK_IMAGE_ALT = 'image alt';
const MOCK_INITIALS = 'JN';
const MOCK_SIZE = 'lg';
const MOCK_GROUP = 25;
const MOCK_CUSTOM_CLASS = 'my-custom-class';
const MOCK_ICON_SLOT = '<dt-icon-user />';
let MOCK_ELEMENT = null;

const baseProps = {
  fullName: 'Jaqueline Nackos',
  imageAlt: MOCK_IMAGE_ALT,
};
const baseAttrs = {};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtAvatar Tests', () => {
  let wrapper;
  let image;
  let count;
  let presence;
  let iconWrapper;

  const updateWrapper = () => {
    wrapper = mount(DtAvatar, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...mockSlots },
      global: {
        components: {
          DtIconUser,
        },
      },
    });

    image = wrapper.find('[data-qa="dt-avatar-image"]');
    count = wrapper.find('[data-qa="dt-avatar-count"]');
    presence = wrapper.find('[data-qa="dt-presence"]');
    iconWrapper = wrapper.find('[data-qa="dt-avatar-icon"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
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
      beforeEach(() => {
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
        expect(image.attributes('alt')).toBe(MOCK_IMAGE_ALT);
      });
    });

    describe('When the icon slot is provided', () => {
      beforeEach(() => {
        mockSlots = { icon: MOCK_ICON_SLOT };

        updateWrapper();
      });

      it('should render icon wrapper', () => {
        expect(iconWrapper.exists()).toBeTruthy();
      });

      it('should have correct class', () => {
        expect(iconWrapper.classes(AVATAR_KIND_MODIFIERS.icon)).toBe(true);
      });

      it('should render the custom icon', () => {
        expect(iconWrapper.findComponent(DtIconUser).exists()).toBe(true);
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
        it('shows a single character', () => {
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
      beforeEach(() => {
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

      it.each([
        [9, true, false, false],
        [10, true, true, false],
        [99, true, true, false],
        [100, true, false, true],
      ])('group %i applies d-avatar--group=%s, digits-2=%s, digits-3=%s', async (group, hasGroup, hasDigits2, hasDigits3) => {
        await wrapper.setProps({ group });
        expect(wrapper.classes('d-avatar--group')).toBe(hasGroup);
        expect(wrapper.classes('d-avatar--group-digits-2')).toBe(hasDigits2);
        expect(wrapper.classes('d-avatar--group-digits-3')).toBe(hasDigits3);
      });

      it('shows 99+ when group is 100 or more', async () => {
        await wrapper.setProps({ group: 100 });
        const count = wrapper.find('[data-qa="dt-avatar-count"]');
        expect(count.text()).toBe('99+');
      });
    });

    describe('When seed is set', () => {
      // note we keep these tests in sync with the android team, so do not change without communicating with them.
      // The seed determines family (1-12) and variant (0-9) deterministically via getRandomFamilyVariant()
      // Algorithm: hash seed string, family = (absHash % 12) + 1, variant = floor(absHash / 12) % 10
      it.each([
        ['a', '2', '8'],
        ['aaa', '10', '6'],
        ['bbbbb', '11', '0'],
      ])('when seed is set to: %s data-avatar-family: %s and data-avatar-variant: %s should be set', (seed, expectedFamily, expectedVariant) => {
        mockProps = { seed };

        updateWrapper();

        expect(wrapper.attributes('data-avatar-family')).toBe(expectedFamily);
        expect(wrapper.attributes('data-avatar-variant')).toBe(expectedVariant);
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
        expect(wrapper.classes('d-avatar--presence')).toBe(true);
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

      it('should not render presence or presence class when group is shown', async () => {
        await wrapper.setProps({ presence: 'active', group: 25 });

        presence = wrapper.find('[data-qa="dt-presence"]');

        expect(presence.exists()).toBe(false);
        expect(wrapper.classes('d-avatar--presence')).toBe(false);
      });
    });

    describe('When deactivated is provided', () => {
      it('should apply deactivated class when true', async () => {
        await wrapper.setProps({ deactivated: true });

        expect(wrapper.classes('d-avatar--deactivated')).toBe(true);
      });

      it('should not apply deactivated class when false', async () => {
        await wrapper.setProps({ deactivated: false });

        expect(wrapper.classes('d-avatar--deactivated')).toBe(false);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When interactive is false (default)', () => {
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
    describe('When interactive is true', () => {
      describe('When avatar is clicked', () => {
        beforeEach(async () => {
          mockProps = { interactive: true };
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
    describe('When deprecated clickable prop is true', () => {
      describe('When avatar is clicked', () => {
        beforeEach(async () => {
          MOCK_AVATAR_STUB.mockClear();
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

  describe('avatarStyles passthrough', () => {
    it('should preserve incoming attrs.style object keys', () => {
      mockAttrs = { style: { color: 'red', 'font-size': '14px' } };

      updateWrapper();

      const style = wrapper.attributes('style');
      expect(style).toContain('color: red');
      expect(style).toContain('font-size: 14px');
    });

    it('should preserve incoming attrs.style string', () => {
      mockAttrs = { style: 'color: red; font-size: 14px' };

      updateWrapper();

      const style = wrapper.attributes('style');
      expect(style).toContain('color: red');
      expect(style).toContain('font-size: 14px');
    });

    it('should preserve incoming attrs.style array', () => {
      mockAttrs = { style: [{ color: 'red' }, { 'font-size': '14px' }] };

      updateWrapper();

      const style = wrapper.attributes('style');
      expect(style).toContain('color: red');
      expect(style).toContain('font-size: 14px');
    });
  });

  describe('When family and variant props are provided', () => {
    it('should set data-avatar-family attribute', () => {
      mockProps = { family: 5, variant: 3 };

      updateWrapper();

      expect(wrapper.attributes('data-avatar-family')).toBe('5');
    });

    it('should set data-avatar-variant attribute', () => {
      mockProps = { family: 5, variant: 3 };

      updateWrapper();

      expect(wrapper.attributes('data-avatar-variant')).toBe('3');
    });

    it('should override seed-based color when explicit family/variant are set', () => {
      mockProps = { seed: 'test-user', family: 12, variant: 0 };

      updateWrapper();

      expect(wrapper.attributes('data-avatar-family')).toBe('12');
      expect(wrapper.attributes('data-avatar-variant')).toBe('0');
    });
  });

  describe('When iconOnly is provided', () => {
    it('should apply icon-only class when true', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };
      mockProps = { iconOnly: true };

      updateWrapper();

      expect(wrapper.classes('d-avatar--icon-only')).toBe(true);
    });

    it('should omit data-avatar-family when iconOnly is true', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };
      mockProps = { iconOnly: true, family: 5, variant: 3 };

      updateWrapper();

      expect(wrapper.attributes('data-avatar-family')).toBeUndefined();
    });

    it('should omit data-avatar-variant when iconOnly is true', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };
      mockProps = { iconOnly: true, family: 5, variant: 3 };

      updateWrapper();

      expect(wrapper.attributes('data-avatar-variant')).toBeUndefined();
    });
  });

  describe('When icon slot determines family/variant', () => {
    it('should omit data-avatar-family when icon slot is provided', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };

      updateWrapper();

      expect(wrapper.attributes('data-avatar-family')).toBeUndefined();
    });

    it('should omit data-avatar-variant when icon slot is provided', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };

      updateWrapper();

      expect(wrapper.attributes('data-avatar-variant')).toBeUndefined();
    });
  });

  describe('Group digit capping by size', () => {
    it.each([
      ['100', 10, '9+'],
      ['150', 10, '9+'],
      ['200', 10, '9+'],
      ['250', 10, '9+'],
    ])('size %s caps group %i to "%s"', (size, group, expected) => {
      mockProps = { size, group };

      updateWrapper();

      const countEl = wrapper.find('[data-qa="dt-avatar-count"]');
      expect(countEl.text()).toBe(expected);
    });

    it.each([
      ['300', 10, '10'],
      ['400', 99, '99'],
      ['500', 100, '99+'],
    ])('size %s shows group %i as "%s"', (size, group, expected) => {
      mockProps = { size, group };

      updateWrapper();

      const countEl = wrapper.find('[data-qa="dt-avatar-count"]');
      expect(countEl.text()).toBe(expected);
    });

    it('small sizes show single-digit groups without capping', () => {
      mockProps = { size: '200', group: 5 };

      updateWrapper();

      const countEl = wrapper.find('[data-qa="dt-avatar-count"]');
      expect(countEl.text()).toBe('5');
    });
  });

  describe('colorToFamilyVariant mapping', () => {
    it.each([
      ['100', 1, 0],
      ['540', 5, 4],
      ['1020', 10, 2],
      ['1290', 12, 9],
    ])('maps color code "%s" to family %i, variant %i', (code, expectedFamily, expectedVariant) => {
      const result = colorToFamilyVariant(code);
      expect(result).toEqual({ family: expectedFamily, variant: expectedVariant });
    });

    it('returns null for invalid color codes', () => {
      expect(colorToFamilyVariant('0')).toBeNull();
      expect(colorToFamilyVariant('1305')).toBeNull();
      expect(colorToFamilyVariant('abc')).toBeNull();
    });

    it('applies color prop correctly via the component', () => {
      mockProps = { color: '540' };

      updateWrapper();

      expect(wrapper.attributes('data-avatar-family')).toBe('5');
      expect(wrapper.attributes('data-avatar-variant')).toBe('4');
    });
  });

  describe('extractInitialsFromName Utility Tests', () => {
    describe('When provided with valid names', () => {
      it('should extract initials from first and last name', () => {
        expect(extractInitialsFromName('John Doe')).toBe('JD');
      });

      it('should extract initials from multiple names (first and last only)', () => {
        expect(extractInitialsFromName('John Michael Doe')).toBe('JD');
      });
    });

    describe('When provided with names containing special characters', () => {
      it('should remove special characters and extract initials', () => {
        expect(extractInitialsFromName('John Doe (General Manager)')).toBe('JM');
        expect(extractInitialsFromName('John Doe [Contractor]')).toBe('JC');
      });

      it('should handle names with numbers', () => {
        expect(extractInitialsFromName('John Doe 123')).toBe('J1');
      });
    });

    describe('When provided with international names', () => {
      it('should handle Japanese kanji characters', () => {
        expect(extractInitialsFromName('田中太郎')).toBe('田中');
      });
    });

    describe('When provided with emojis', () => {
      it('should remove emojis from names', () => {
        expect(extractInitialsFromName('John Doe 😀')).toBe('JD');
      });
    });
  });
});
