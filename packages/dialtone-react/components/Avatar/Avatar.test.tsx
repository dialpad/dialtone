import type { ReactElement } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DtIconUser } from '../../icons';
import type { DtPresenceProps } from '../Presence';
import { DtAvatar, type DtAvatarProps } from './Avatar';
import { AVATAR_KIND_MODIFIERS, AVATAR_SIZE_MODIFIERS, colorToFamilyVariant } from './AvatarConstants';
import { extractInitialsFromName } from './Utils';

const MOCK_AVATAR_STUB = vi.fn();
const MOCK_IMAGE_SOURCE = 'image.png';
const MOCK_IMAGE_ALT = 'image alt';
const MOCK_INITIALS = 'JN';
const MOCK_SIZE = 'lg';
const MOCK_GROUP = 25;
const MOCK_CUSTOM_CLASS = 'my-custom-class';
const MOCK_ICON_SLOT = <DtIconUser />;
let MOCK_ELEMENT: HTMLElement | null = null;

const baseProps: DtAvatarProps = {
  fullName: 'Jaqueline Nackos',
  imageAlt: MOCK_IMAGE_ALT,
};
const baseAttrs: Partial<DtAvatarProps> = {};

let mockProps: DtAvatarProps = {};
let mockAttrs: Partial<DtAvatarProps> = {};
let mockSlots: Pick<DtAvatarProps, 'icon' | 'overlayIcon'> = {};

describe('DtAvatar Tests', () => {
  let unmount: (() => void) | null = null;
  let rerender: ((ui: ReactElement) => void) | null = null;
  let image: HTMLElement | null;
  let count: HTMLElement | null;
  let presence: HTMLElement | null;
  let iconWrapper: HTMLElement | null;

  const avatar = () => <DtAvatar {...baseProps} {...mockProps} {...baseAttrs} {...mockAttrs} {...mockSlots} />;

  const findParts = () => {
    image = screen.queryByTestId('dt-avatar-image');
    count = screen.queryByTestId('dt-avatar-count');
    presence = screen.queryByTestId('dt-presence');
    iconWrapper = screen.queryByTestId('dt-avatar-icon');
  };

  // Remounts, as Vue's mount does, rather than rendering a second avatar beside the first.
  const updateWrapper = () => {
    unmount?.();
    ({ unmount, rerender } = render(avatar()));
    findParts();
  };

  // Vue's wrapper.setProps: the same instance, with props merged in.
  const setProps = (props: DtAvatarProps) => {
    mockProps = { ...mockProps, ...props };
    rerender?.(avatar());
    findParts();
  };

  const root = () => screen.getByTestId('dt-avatar');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    unmount = null;
    rerender = null;
  });

  describe('Presentation Tests', () => {
    describe('When the avatar renders', () => {
      it('should exists', () => {
        expect(root()).toBeInTheDocument();
      });

      it('should render the avatar', () => {
        expect(root()).toHaveClass('d-avatar');
      });
    });

    describe('When the imageSrc is provided', () => {
      beforeEach(() => {
        mockProps = { imageSrc: MOCK_IMAGE_SOURCE };

        updateWrapper();
      });

      it('image should exist', () => {
        expect(image).toBeInTheDocument();
      });

      it('src should match those provided by attrs', () => {
        expect(image).toHaveAttribute('src', MOCK_IMAGE_SOURCE);
      });

      it('alt should match those provided by attrs', () => {
        expect(image).toHaveAttribute('alt', MOCK_IMAGE_ALT);
      });
    });

    describe('When the icon slot is provided', () => {
      beforeEach(() => {
        mockSlots = { icon: MOCK_ICON_SLOT };

        updateWrapper();
      });

      it('should render icon wrapper', () => {
        expect(iconWrapper).toBeInTheDocument();
      });

      it('should have correct class', () => {
        expect(iconWrapper).toHaveClass(AVATAR_KIND_MODIFIERS.icon);
      });

      it('should render the custom icon', () => {
        expect(within(iconWrapper!).getByTestId('dt-icon').tagName).toBe('svg');
      });
    });

    describe('With no imageSrc or iconName is provided', () => {
      it('should display initials', () => {
        expect(root()).toHaveTextContent(new RegExp(`^${MOCK_INITIALS}$`));
      });

      it('should have correct class', () => {
        const avatarWithInitials = root().querySelector('.' + AVATAR_KIND_MODIFIERS.initials);

        expect(avatarWithInitials).toBeInTheDocument();
      });

      describe('When size is sm', () => {
        it('shows a single character', () => {
          mockProps = { size: 'sm' };

          updateWrapper();

          expect(root()).toHaveTextContent(new RegExp(`^${MOCK_INITIALS[0]}$`));
        });
      });

      describe('When size is xs', () => {
        it('has no initials', () => {
          mockProps = { size: 'xs' };

          updateWrapper();

          expect(root().textContent).toBe('');
        });
      });
    });

    describe('When size is provided', () => {
      it('should have size variant class on the avatar', () => {
        mockProps = { size: MOCK_SIZE };

        updateWrapper();

        expect(root()).toHaveClass(AVATAR_SIZE_MODIFIERS[MOCK_SIZE]);
      });
    });

    describe('When group is provided', () => {
      beforeEach(() => {
        mockProps = { group: MOCK_GROUP };

        updateWrapper();
      });

      it('should have group count', () => {
        expect(count).toBeInTheDocument();
      });

      it('should have the correct group number', () => {
        expect(count).toHaveTextContent(new RegExp(`^${MOCK_GROUP}$`));
      });

      it('should not render group if group value is 1 or less', () => {
        setProps({ group: 1 });

        expect(count).not.toBeInTheDocument();
      });

      it.each([
        [9, true, false, false],
        [10, true, true, false],
        [99, true, true, false],
        [100, true, false, true],
      ])('group %i applies d-avatar--group=%s, digits-2=%s, digits-3=%s', (group, hasGroup, hasDigits2, hasDigits3) => {
        setProps({ group });
        expect(root().classList.contains('d-avatar--group')).toBe(hasGroup);
        expect(root().classList.contains('d-avatar--group-digits-2')).toBe(hasDigits2);
        expect(root().classList.contains('d-avatar--group-digits-3')).toBe(hasDigits3);
      });

      it('shows 99+ when group is 100 or more', () => {
        setProps({ group: 100 });
        expect(screen.getByTestId('dt-avatar-count')).toHaveTextContent(/^99\+$/);
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

        expect(root()).toHaveAttribute('data-avatar-family', expectedFamily);
        expect(root()).toHaveAttribute('data-avatar-variant', expectedVariant);
      });
    });

    describe('With Presence', () => {
      it('should not render presence if presence prop is not defined', () => {
        setProps({ presence: null });

        expect(presence).not.toBeInTheDocument();
      });

      it('should render presence when presence prop is defined', () => {
        setProps({ presence: 'active' });

        expect(presence).toBeInTheDocument();
        expect(presence).toHaveClass('d-avatar__presence');
        expect(root()).toHaveClass('d-avatar--presence');
      });

      it('should pass through data in presenceProps to the presence component', () => {
        setProps({
          presence: 'active',
          presenceProps: {
            'aria-live': 'assertive',
            'random-attribute': 'value',
          } as DtPresenceProps,
        });

        expect(presence).toBeInTheDocument();
        expect(presence).toHaveAttribute('aria-live', 'assertive');
        expect(presence).toHaveAttribute('random-attribute', 'value');
      });

      it('should update presence styles based on Avatar size', () => {
        setProps({
          size: 'md',
          presence: 'active',
        });

        expect(presence).toHaveClass('d-avatar__presence--md');

        setProps({
          size: 'lg',
          presence: 'active',
        });

        expect(presence).toHaveClass('d-avatar__presence--lg');
      });

      it('should not render presence or presence class when group is shown', () => {
        setProps({ presence: 'active', group: 25 });

        expect(presence).not.toBeInTheDocument();
        expect(root()).not.toHaveClass('d-avatar--presence');
      });
    });

    describe('When deactivated is provided', () => {
      it('should apply deactivated class when true', () => {
        setProps({ deactivated: true });

        expect(root()).toHaveClass('d-avatar--deactivated');
      });

      it('should not apply deactivated class when false', () => {
        setProps({ deactivated: false });

        expect(root()).not.toHaveClass('d-avatar--deactivated');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When interactive is false (default)', () => {
      describe('When avatar is clicked', () => {
        beforeEach(async () => {
          MOCK_AVATAR_STUB.mockClear();
          mockAttrs = { onClick: MOCK_AVATAR_STUB };

          updateWrapper();

          await userEvent.click(root());
        });

        it('Should not call listener', () => {
          expect(MOCK_AVATAR_STUB).toHaveBeenCalledTimes(0);
        });

        // Vue's listener and its emitted event are both the onClick prop in React.
        it('Should not emit click event', () => {
          expect(MOCK_AVATAR_STUB).not.toHaveBeenCalled();
          expect(root().tagName).toBe('DIV');
        });
      });
    });
    describe('When interactive is true', () => {
      describe('When avatar is clicked', () => {
        beforeEach(async () => {
          MOCK_AVATAR_STUB.mockClear();
          mockProps = { interactive: true };
          mockAttrs = { onClick: MOCK_AVATAR_STUB };

          updateWrapper();

          await userEvent.click(screen.getByRole('button'));
        });

        it('Should call listener', () => {
          expect(MOCK_AVATAR_STUB).toBeCalledTimes(1);
        });

        it('Should emit click event', () => {
          expect(MOCK_AVATAR_STUB).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
        });
      });
    });
    describe('When deprecated clickable prop is true', () => {
      describe('When avatar is clicked', () => {
        it.skip('Should call listener', () => {});

        it.skip('Should emit click event', () => {});
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Size Validator', () => {
      describe('When provided size is in AVATAR_SIZE_MODIFIERS', () => {
        it('passes custom prop validation', () => {
          expect(root()).toHaveClass(AVATAR_SIZE_MODIFIERS[300]);
        });
      });

      describe('When provided size is not in AVATAR_SIZE_MODIFIERS', () => {
        it('fails custom prop validation', () => {
          // @ts-expect-error: INVALID_SIZE isn't an avatar size
          mockProps = { size: 'INVALID_SIZE' };

          updateWrapper();

          expect([...root().classList].filter(name => /^d-avatar--(size-|xs|sm|md|lg|xl)/.test(name))).toEqual([]);
        });
      });
    });

    describe('Group Validator', () => {
      describe('When provided group is valid to show group count', () => {
        it('passes custom prop validation', () => {
          setProps({ group: 2 });

          expect(count).toBeInTheDocument();
        });
      });

      describe('When provided group is not in the valid range (below min)', () => {
        it('fails custom prop validation', () => {
          setProps({ group: 1 });

          expect(count).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When an avatar class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps.avatarClass = MOCK_CUSTOM_CLASS;

        updateWrapper();

        MOCK_ELEMENT = screen.getByTestId('dt-avatar');

        expect(document.querySelector('.my-custom-class')).toBe(MOCK_ELEMENT);
      });
    });
  });

  describe('avatarStyles passthrough', () => {
    it('should preserve incoming attrs.style object keys', () => {
      mockAttrs = { style: { color: 'red', fontSize: '14px' } };

      updateWrapper();

      const style = root().getAttribute('style');
      expect(style).toContain('color: red');
      expect(style).toContain('font-size: 14px');
    });

    // React's style is one object, so there's no string form: this checks the consumer's style is merged with the
    // component's own fallback color (jsdom has no oklch() support), rather than replacing it.
    it('should preserve incoming attrs.style string', () => {
      mockProps = { seed: 'a' };
      mockAttrs = { style: { color: 'red', fontSize: '14px' } };

      updateWrapper();

      const style = root().getAttribute('style');
      expect(style).toContain('color: red');
      expect(style).toContain('font-size: 14px');
      expect(root().style.getPropertyValue('--avatar-color-background')).toMatch(/^#[0-9a-f]{6}$/);
    });

    // No array form either: as in Vue's array, the consumer's entries come after the component's, so they win.
    it('should preserve incoming attrs.style array', () => {
      mockAttrs = { style: { color: 'red', fontSize: '14px', '--avatar-color-background': '#123456' } as DtAvatarProps['style'] };

      updateWrapper();

      const style = root().getAttribute('style');
      expect(style).toContain('color: red');
      expect(style).toContain('font-size: 14px');
      expect(root().style.getPropertyValue('--avatar-color-background')).toBe('#123456');
    });
  });

  describe('When family and variant props are provided', () => {
    it('should set data-avatar-family attribute', () => {
      mockProps = { family: 5, variant: 3 };

      updateWrapper();

      expect(root()).toHaveAttribute('data-avatar-family', '5');
    });

    it('should set data-avatar-variant attribute', () => {
      mockProps = { family: 5, variant: 3 };

      updateWrapper();

      expect(root()).toHaveAttribute('data-avatar-variant', '3');
    });

    it('should override seed-based color when explicit family/variant are set', () => {
      mockProps = { seed: 'test-user', family: 12, variant: 0 };

      updateWrapper();

      expect(root()).toHaveAttribute('data-avatar-family', '12');
      expect(root()).toHaveAttribute('data-avatar-variant', '0');
    });
  });

  describe('When iconOnly is provided', () => {
    it('should apply icon-only class when true', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };
      mockProps = { iconOnly: true };

      updateWrapper();

      expect(root()).toHaveClass('d-avatar--icon-only');
    });

    it('should omit data-avatar-family when iconOnly is true', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };
      mockProps = { iconOnly: true, family: 5, variant: 3 };

      updateWrapper();

      expect(root()).not.toHaveAttribute('data-avatar-family');
    });

    it('should omit data-avatar-variant when iconOnly is true', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };
      mockProps = { iconOnly: true, family: 5, variant: 3 };

      updateWrapper();

      expect(root()).not.toHaveAttribute('data-avatar-variant');
    });
  });

  describe('When icon slot determines family/variant', () => {
    it('should omit data-avatar-family when icon slot is provided', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };

      updateWrapper();

      expect(root()).not.toHaveAttribute('data-avatar-family');
    });

    it('should omit data-avatar-variant when icon slot is provided', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };

      updateWrapper();

      expect(root()).not.toHaveAttribute('data-avatar-variant');
    });
  });

  describe('Group digit capping by size', () => {
    it.each([
      ['100', 10, '9+'],
      ['150', 10, '9+'],
      ['200', 10, '9+'],
      ['250', 10, '9+'],
    ] as const)('size %s caps group %i to "%s"', (size, group, expected) => {
      mockProps = { size, group };

      updateWrapper();

      expect(screen.getByTestId('dt-avatar-count').textContent).toBe(expected);
    });

    it.each([
      ['300', 10, '10'],
      ['400', 99, '99'],
      ['500', 100, '99+'],
    ] as const)('size %s shows group %i as "%s"', (size, group, expected) => {
      mockProps = { size, group };

      updateWrapper();

      expect(screen.getByTestId('dt-avatar-count').textContent).toBe(expected);
    });

    it('small sizes show single-digit groups without capping', () => {
      mockProps = { size: '200', group: 5 };

      updateWrapper();

      expect(screen.getByTestId('dt-avatar-count').textContent).toBe('5');
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

    it.skip('applies color prop correctly via the component', () => {});
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

  describe('React-only Tests', () => {
    it('keeps the random color across re-renders when there is no seed', () => {
      mockProps = { seed: undefined };
      updateWrapper();
      const familyBefore = root().getAttribute('data-avatar-family');
      const variantBefore = root().getAttribute('data-avatar-variant');

      setProps({ deactivated: true });

      expect(root()).toHaveAttribute('data-avatar-family', familyBefore!);
      expect(root()).toHaveAttribute('data-avatar-variant', variantBefore!);
    });

    it('logs an error when imageSrc is set without imageAlt', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      unmount?.();
      ({ unmount, rerender } = render(<DtAvatar imageSrc={MOCK_IMAGE_SOURCE} />));

      expect(error).toHaveBeenCalledTimes(1);
      expect(error.mock.calls[0][0]).toMatch(/^image-alt required if image-src is provided/);
      error.mockRestore();
    });

    it('falls back to initials when the image fails to load, and retries a new imageSrc', () => {
      mockProps = { imageSrc: MOCK_IMAGE_SOURCE };
      updateWrapper();

      fireEvent.error(image!);
      findParts();
      expect(image).not.toBeInTheDocument();
      expect(root()).toHaveTextContent(new RegExp(`^${MOCK_INITIALS}$`));

      setProps({ imageSrc: 'other.png' });
      expect(image).toHaveAttribute('src', 'other.png');
    });

    it('marks the canvas when the image loads', () => {
      mockProps = { imageSrc: MOCK_IMAGE_SOURCE };
      updateWrapper();

      fireEvent.load(image!);

      expect(image!.parentElement!.parentElement).toHaveClass('d-avatar--image-loaded');
    });
  });
});
