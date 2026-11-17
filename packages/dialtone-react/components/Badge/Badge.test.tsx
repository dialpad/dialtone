import { render, type RenderResult } from '@testing-library/react';
import { DtIcon } from '../Icon';
import { DtBadge, type DtBadgeProps } from './Badge';
import { BADGE_TYPE_MODIFIERS, BADGE_KIND_MODIFIERS, BADGE_DECORATION_MODIFIERS } from './BadgeConstants';

const MOCK_SLOT_TEXT = 'Default slot text';
const MOCK_PROP_TEXT = 'Prop text';

const iconPlus = <DtIcon name="plus" />;

describe('DtBadge Tests', () => {
  let result: RenderResult;
  let props: DtBadgeProps;

  const updateWrapper = (extra: DtBadgeProps = {}) => {
    props = extra;
    result?.unmount();
    result = render(<DtBadge {...extra} />);
  };

  // Vue's setProps: the same props, plus the new ones.
  const setProps = (extra: DtBadgeProps) => {
    props = { ...props, ...extra };
    result.rerender(<DtBadge {...props} />);
  };

  const badge = () => document.querySelector<HTMLElement>('[data-qa="dt-badge"]');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    result?.unmount();
  });

  describe('Presentation Tests', () => {
    describe('When the badge renders', () => {
      it('should exist', () => {
        expect(badge()).toBeInTheDocument();
      });
    });

    describe('When a text is provided via slot', () => {
      beforeEach(() => {
        updateWrapper({ children: MOCK_SLOT_TEXT });
      });

      it('should render the badge', () => {
        expect(badge()).toBeInTheDocument();
      });

      it('should display the correct text', () => {
        expect(badge()).toHaveTextContent(new RegExp(`^${MOCK_SLOT_TEXT}$`));
      });
    });

    describe('When a text is provided via prop', () => {
      beforeEach(() => {
        updateWrapper({ text: MOCK_PROP_TEXT });
      });

      it('should render the badge', () => {
        expect(badge()).toBeInTheDocument();
      });

      it('should display the correct text', () => {
        expect(badge()).toHaveTextContent(new RegExp(`^${MOCK_PROP_TEXT}$`));
      });
    });

    describe('When a type is provided via prop', () => {
      describe('When type is info', () => {
        it('should have correct type', () => {
          setProps({ type: 'info' });

          expect(badge()).toHaveClass(BADGE_TYPE_MODIFIERS.info);
        });
      });

      describe('When type is positive', () => {
        it('should have correct type', () => {
          setProps({ type: 'positive' });

          expect(badge()).toHaveClass(BADGE_TYPE_MODIFIERS.positive);
        });
      });

      describe('When type is warning', () => {
        it('should have correct type', () => {
          setProps({ type: 'warning' });

          expect(badge()).toHaveClass(BADGE_TYPE_MODIFIERS.warning);
        });
      });

      describe('When type is critical', () => {
        it('should have correct type', () => {
          setProps({ type: 'critical' });

          expect(badge()).toHaveClass(BADGE_TYPE_MODIFIERS.critical);
        });
      });

      describe('When type is ai', () => {
        beforeEach(() => {
          updateWrapper({ type: 'ai' });
        });

        it('should have correct type', () => {
          expect(badge()).toHaveClass(BADGE_TYPE_MODIFIERS.ai);
        });
      });
    });

    describe('When a kind is provided via prop', () => {
      describe('When kind is count', () => {
        it('should have correct kind', () => {
          setProps({ kind: 'count' });

          expect(badge()).toHaveClass(BADGE_KIND_MODIFIERS.count);
        });
      });
    });

    describe('When a startIcon slot is provided', () => {
      beforeEach(() => {
        updateWrapper({ startIcon: iconPlus });
      });

      it('should render the left icon wrapper', () => {
        expect(document.querySelector('.d-badge__icon-left')).toBeInTheDocument();
      });
    });

    describe('When an endIcon slot is provided', () => {
      beforeEach(() => {
        updateWrapper({ endIcon: iconPlus });
      });

      it('should render the right icon wrapper', () => {
        expect(document.querySelector('.d-badge__icon-right')).toBeInTheDocument();
      });
    });

    // The deprecated leftIcon and rightIcon slots aren't ported (skips.json).
    describe('Backward compatibility', () => {
      describe('When leftIcon slot is provided (deprecated)', () => {
        it.skip('should render the left icon wrapper', () => {});
      });

      describe('When rightIcon slot is provided (deprecated)', () => {
        it.skip('should render the right icon wrapper', () => {});
      });

      describe('When both startIcon and leftIcon slots are provided', () => {
        it.skip('should render the new startIcon content and suppress the deprecated leftIcon', () => {});
      });
    });

    describe('When a decoration is provided via prop', () => {
      describe('When decoration is black-900', () => {
        it('should have correct decoration', () => {
          setProps({ decoration: 'black-900' });

          expect(document.querySelector('.d-badge__decorative')).toBeInTheDocument();
          expect(badge()).toHaveClass(BADGE_DECORATION_MODIFIERS['black-900']);
        });
      });

      describe('When decoration is red-400', () => {
        it('should have correct decoration', () => {
          setProps({ decoration: 'red-400' });

          expect(document.querySelector('.d-badge__decorative')).toBeInTheDocument();
          expect(badge()).toHaveClass(BADGE_DECORATION_MODIFIERS['red-400']);
        });
      });

      describe('When decoration is purple-400', () => {
        it('should have correct decoration', () => {
          setProps({ decoration: 'purple-400' });

          expect(document.querySelector('.d-badge__decorative')).toBeInTheDocument();
          expect(badge()).toHaveClass(BADGE_DECORATION_MODIFIERS['purple-400']);
        });
      });

      describe('When decoration is gold-300', () => {
        it('should have correct decoration', () => {
          setProps({ decoration: 'gold-300' });

          expect(document.querySelector('.d-badge__decorative')).toBeInTheDocument();
          expect(badge()).toHaveClass(BADGE_DECORATION_MODIFIERS['gold-300']);
        });
      });
    });
  });

  describe('React API Tests', () => {
    it('should pass iconSize, 200 by default, to a function startIcon', () => {
      const startIcon = vi.fn(() => iconPlus);
      updateWrapper({ startIcon });

      expect(startIcon).toHaveBeenCalledWith({ iconSize: 200 });
      updateWrapper({ startIcon, iconSize: '300' });

      expect(startIcon).toHaveBeenLastCalledWith({ iconSize: '300' });
    });

    it('should pass iconSize to a function endIcon', () => {
      const endIcon = vi.fn(({ iconSize }) => <DtIcon name="plus" size={iconSize} />);
      updateWrapper({ endIcon, iconSize: '100' });

      expect(document.querySelector('.d-badge__icon-right svg')).toHaveClass('d-icon--size-100');
    });

    it('should not render an icon wrapper for an empty slot', () => {
      updateWrapper({ startIcon: '', endIcon: false });

      expect(document.querySelector('.d-badge__icon-left')).not.toBeInTheDocument();
      expect(document.querySelector('.d-badge__icon-right')).not.toBeInTheDocument();
    });

    it('should not render an icon wrapper for an empty Fragment slot', () => {
      updateWrapper({ startIcon: <>{[]}</>, endIcon: <><>{null}</></> });

      expect(document.querySelector('.d-badge__icon-left')).not.toBeInTheDocument();
      expect(document.querySelector('.d-badge__icon-right')).not.toBeInTheDocument();
    });

    it('should render an icon wrapper for a Fragment with content', () => {
      updateWrapper({ startIcon: <>{iconPlus}</> });

      expect(document.querySelector('.d-badge__icon-left svg')).toBeInTheDocument();
    });

    it('should apply the slot class props to their containers', () => {
      updateWrapper({
        startIcon: iconPlus, endIcon: iconPlus, startIconClass: 'start-x', endIconClass: 'end-x', labelClass: 'label-x',
      });

      expect(document.querySelector('.d-badge__icon-left')).toHaveClass('start-x');
      expect(document.querySelector('.d-badge__icon-right')).toHaveClass('end-x');
      expect(document.querySelector('.d-badge__label')).toHaveClass('label-x');
    });

    it('should add the subtle and outlined classes', () => {
      updateWrapper({ type: 'bulletin', subtle: true, outlined: true });

      expect(badge()).toHaveClass('d-badge--subtle', 'd-badge--outlined');
    });

    it('should put attributes, className and ref on the root', () => {
      let root: HTMLSpanElement | null = null;
      updateWrapper({ id: 'badge-id', className: 'extra', ref: el => { root = el; } });

      expect(badge()).toHaveAttribute('id', 'badge-id');
      expect(badge()).toHaveClass('d-badge', 'extra');
      expect(root).toBe(badge());
    });

    describe('Prop combination errors', () => {
      let consoleError: ReturnType<typeof vi.spyOn>;

      beforeEach(() => {
        consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      });

      afterEach(() => {
        consoleError.mockRestore();
      });

      it('should log an error for type ai with kind count', () => {
        updateWrapper({ type: 'ai', kind: 'count' });

        expect(consoleError).toHaveBeenCalledWith('DtBadge error: type: \'ai\' with kind: \'count\' is an invalid combination.');
      });

      it('should log an error for subtle without type bulletin', () => {
        updateWrapper({ subtle: true });

        expect(consoleError).toHaveBeenCalledWith('DtBadge error: subtle can only be used with type \'bulletin\'');
      });

      it('should log an error for a decoration with another type or kind', () => {
        updateWrapper({ decoration: 'red-400', type: 'info' });

        expect(consoleError).toHaveBeenCalledWith(
          'DtBadge error: decoration prop can only be used with kind: \'label\' and type: \'default\'.',
        );
      });

      it('should log an error for a decoration with icons', () => {
        updateWrapper({ decoration: 'red-400', startIcon: iconPlus });

        expect(consoleError).toHaveBeenCalledWith('DtBadge error: decoration prop cannot be used with startIcon or endIcon.');
      });

      it('should log nothing for a valid combination', () => {
        updateWrapper({ decoration: 'red-400', startIcon: undefined });

        expect(consoleError).not.toHaveBeenCalled();
      });

      it('should log again when a prop it checks changes, and not when an unrelated one does', () => {
        updateWrapper({ subtle: true });
        setProps({ text: 'other' });

        expect(consoleError).toHaveBeenCalledTimes(1);
        setProps({ type: 'info' });

        expect(consoleError).toHaveBeenCalledTimes(2);
      });
    });
  });
});
