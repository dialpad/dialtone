import type { ElementType } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HighlightIdContext } from '../../common/keyboard-list-navigation';
import { DtListItem, type DtListItemProps as ListItemProps } from './ListItem';

// The tests switch elementType, so props are typed for any element.
type DtListItemProps = ListItemProps<ElementType>;
import { LIST_ITEM_NAVIGATION_TYPES } from './ListItemConstants';

const MOCK_CLICK_STUB = vi.fn();

const baseProps: DtListItemProps = {
  id: 'dt-item',
  navigationType: LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS,
  role: 'option',
  onClick: MOCK_CLICK_STUB,
};
const baseHighlightId = () => 'dt-item2';

let mockProps: DtListItemProps = {};

describe('DtListItem tests', () => {
  let rerender: (ui: ReturnType<typeof tree>) => void;

  // Vue's `provide: { highlightId }` is the keyboard navigation context's value.
  const tree = (props: DtListItemProps) => (
    <HighlightIdContext.Provider value={baseHighlightId}>
      <DtListItem {...baseProps} {...props} />
    </HighlightIdContext.Provider>
  );

  const mountComponent = (props: DtListItemProps = mockProps) => {
    ({ rerender } = render(tree(props)));
  };

  // Vue's `wrapper.setProps`.
  const setProps = (props: DtListItemProps) => {
    rerender(tree({ ...mockProps, ...props }));
  };

  const getItem = () => screen.getByRole('option');
  const getListItemWrapper = () => screen.getByTestId('dt-list-item-wrapper');

  beforeEach(() => {
    MOCK_CLICK_STUB.mockClear();
    mountComponent();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(getItem()).toBeInTheDocument();
    });

    describe('When navigation type is set to tab', () => {
      beforeEach(() => {
        setProps({ navigationType: LIST_ITEM_NAVIGATION_TYPES.TAB });
      });

      it('should apply the focusable class to the wrapper.', () => {
        expect(getItem()).toHaveClass('d-list-item--focusable');
      });

      it('should add tabindex 0 to the wrapper.', () => {
        expect(getItem()).toHaveAttribute('tabindex', '0');
      });
    });

    describe('When navigation type is set to none', () => {
      beforeEach(() => {
        setProps({ navigationType: LIST_ITEM_NAVIGATION_TYPES.NONE });
      });

      it('should not apply the classes to the wrapper.', () => {
        expect(getItem()).not.toHaveClass('d-list-item--focusable');
        expect(getItem()).not.toHaveClass('d-list-item--highlighted');
      });

      it('should add tabindex -1 to the wrapper.', () => {
        expect(getItem()).toHaveAttribute('tabindex', '-1');
      });
    });

    describe('When item is not highlighted', () => {
      it('should not apply the class to the wrapper.', () => {
        expect(getItem()).not.toHaveClass('d-list-item--highlighted');
      });

      it('aria-selected should not be set', () => {
        expect(getItem()).toHaveAttribute('aria-selected', 'false');
      });
    });

    describe('When item is highlighted', () => {
      beforeEach(() => {
        setProps({ id: 'dt-item2' });
      });

      it('should apply the class to the wrapper.', () => {
        expect(getItem()).toHaveClass('d-list-item--highlighted');
      });

      it('aria-selected should be set to "true"', () => {
        expect(getItem()).toHaveAttribute('aria-selected', 'true');
      });
    });

    describe('When item is selected', () => {
      it('should render checkmark icon', () => {
        setProps({ selected: true });

        const icon = screen.getByTestId('dt-icon');

        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('d-icon--check');
      });
    });

    describe('When element type is provided', () => {
      it('should use the provided element type on the wrapper.', () => {
        setProps({ elementType: 'div' });

        expect(getItem().tagName).toBe('DIV');
      });
    });

    describe('When element type is not provided', () => {
      it('should use the default element type on the wrapper.', () => {
        expect(getItem().tagName).toBe('LI');
      });
    });
  });

  describe('Interactivity Tests', () => {
    // Vue's `wrapper.trigger('keydown', { code })`: the key goes to the focused item.
    const pressKey = async (key: string) => {
      act(() => { getItem().focus(); });
      await userEvent.keyboard(key);
    };

    describe('When "Enter" key is pressed', () => {
      beforeEach(async () => {
        await pressKey('[Enter]');
      });

      it('should call listener', async () => {
        expect(MOCK_CLICK_STUB).toHaveBeenCalled();
      });

      it('should emit click event', () => {
        expect(MOCK_CLICK_STUB).toHaveBeenCalledTimes(1);
      });
    });

    describe('When "Space" key is pressed', () => {
      beforeEach(async () => {
        await pressKey('[Space]');
      });

      it('should call listener', async () => {
        expect(MOCK_CLICK_STUB).toHaveBeenCalled();
      });

      it('should emit click event', () => {
        expect(MOCK_CLICK_STUB).toHaveBeenCalledTimes(1);
      });
    });

    describe('When mousemove is triggered', () => {
      it('should emit mousemove event', async () => {
        const onMouseMove = vi.fn();
        setProps({ onMouseMove });

        await userEvent.hover(getItem());

        expect(onMouseMove).toHaveBeenCalledTimes(1);
      });
    });

    describe('When mouseleave is triggered', () => {
      it('should emit mouseleave event', async () => {
        const onMouseLeave = vi.fn();
        setProps({ onMouseLeave });

        await userEvent.hover(getItem());
        await userEvent.unhover(getItem());

        expect(onMouseLeave).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Disabled Tests', () => {
    describe('When disabled is not set', () => {
      it('renders the same root attributes as before the prop existed', () => {
        const item = getItem();
        const attributes = Object.fromEntries(Array.from(item.attributes, a => [a.name, a.value]));
        expect(attributes).toEqual({
          id: 'dt-item',
          class: 'd-list-item',
          tabindex: '-1',
          role: 'option',
          'aria-selected': 'false',
        });
      });

      it('passes a consumer aria-disabled through and still emits click', async () => {
        setProps({ 'aria-disabled': 'true' });

        await userEvent.click(getItem());

        expect(getItem()).toHaveAttribute('aria-disabled', 'true');
        expect(getItem().className).toBe('d-list-item');
        expect(MOCK_CLICK_STUB).toHaveBeenCalledTimes(1);
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true };
        setProps({});
      });

      it('sets aria-disabled and the disabled modifier together', () => {
        expect(getItem()).toHaveAttribute('aria-disabled', 'true');
        expect(getItem().className).toBe('d-list-item d-list-item--disabled');
      });

      it('emits pointer events except click', async () => {
        const onMouseMove = vi.fn();
        const onMouseLeave = vi.fn();
        setProps({ onMouseMove, onMouseLeave });

        await userEvent.click(getItem());
        await userEvent.hover(getItem());
        await userEvent.unhover(getItem());

        expect(MOCK_CLICK_STUB).not.toHaveBeenCalled();
        expect(onMouseMove).toHaveBeenCalled();
        expect(onMouseLeave).toHaveBeenCalledTimes(1);
      });

      it('cancels the native activation of a disabled link row', () => {
        mockProps = { disabled: true, elementType: 'a', href: '/settings', role: 'menuitem' };
        setProps({});
        const link = screen.getByRole('menuitem');
        const click = new MouseEvent('click', { bubbles: true, cancelable: true });

        act(() => { link.dispatchEvent(click); });

        expect(click.defaultPrevented).toBe(true);
      });

      it('keeps the keyboard highlight', () => {
        // baseHighlightId highlights dt-item2.
        setProps({ id: 'dt-item2' });

        expect(getItem().className).toBe('d-list-item d-list-item--highlighted d-list-item--disabled');
        expect(getItem()).toHaveAttribute('aria-selected', 'true');
      });

      it('stays focusable for tab navigation', () => {
        setProps({ navigationType: LIST_ITEM_NAVIGATION_TYPES.TAB });

        expect(getItem()).toHaveAttribute('tabindex', '0');
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When type is "default" and "wrapperClass" prop is provided', () => {
      beforeEach(() => {
        setProps({ wrapperClass: 'custom-class' });
      });

      it('should apply the provided class to the wrapper.', () => {
        expect(getListItemWrapper()).toHaveClass('custom-class');
      });
    });
  });

  describe('Slot Forwarding Tests', () => {
    describe('When start slot is provided', () => {
      beforeEach(() => {
        mockProps = { start: 'start content' };
        setProps({});
      });

      it('should forward start slot to item layout', () => {
        expect(getItem()).toHaveTextContent('start content');
      });
    });

    describe('When end slot is provided', () => {
      beforeEach(() => {
        mockProps = { end: 'end content' };
        setProps({});
      });

      it('should forward end slot to item layout', () => {
        expect(getItem()).toHaveTextContent('end content');
      });
    });

    describe('When left slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockProps = { left: 'left content' };
        setProps({});
      });

      it('should forward left slot to item layout', () => {
        expect(getItem()).toHaveTextContent('left content');
      });
    });

    describe('When right slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockProps = { right: 'right content' };
        setProps({});
      });

      it('should forward right slot to item layout', () => {
        expect(getItem()).toHaveTextContent('right content');
      });
    });
  });
});

describe('ListItem contextual roles', () => {
  it('keeps ordinary selected list content as listitem', () => {
    render(<DtListItem selected />);
    const item = screen.getByRole('listitem');
    expect(item).not.toHaveAttribute('aria-selected');
    expect(item).not.toHaveAttribute('aria-checked');
  });

  it('keeps checked state independent of menu radio highlight', async () => {
    const tree = (selected: boolean) => (
      <DtListItem id="radio" role="menuitemradio" selected={selected} navigationType="arrow-keys" />
    );
    const { rerender } = render(tree(true));
    const item = screen.getByRole('menuitemradio');
    expect(item).toHaveAttribute('aria-checked', 'true');
    expect(item).not.toHaveAttribute('aria-selected');
    await userEvent.hover(item);
    expect(item).toHaveClass('d-list-item--highlighted');
    expect(item).toHaveAttribute('aria-checked', 'true');
    rerender(tree(false));
    expect(item).toHaveAttribute('aria-checked', 'false');
  });

  it.each(['Enter', 'Space'])('activates a menu radio once on %s with the default action prevented', async code => {
    const onClick = vi.fn();
    render(<DtListItem id="radio" role="menuitemradio" navigationType="arrow-keys" onClick={onClick} />);
    act(() => { screen.getByRole('menuitemradio').focus(); });
    await userEvent.keyboard(`[${code}]`);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].defaultPrevented).toBe(true);
  });

  it.each(['Enter', 'Space'])('refuses %s on a disabled menu radio with the default action still prevented', async code => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <DtListItem
        id="radio"
        role="menuitemradio"
        navigationType="arrow-keys"
        disabled
        onClick={onClick}
        onKeyDown={onKeyDown}
      />,
    );
    act(() => { screen.getByRole('menuitemradio').focus(); });
    await userEvent.keyboard(`[${code}]`);
    expect(onClick).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onKeyDown.mock.calls[0][0].defaultPrevented).toBe(true);
  });

  it.each(['menuitem', 'option'] as const)('preserves %s highlight markup without inferring a radio', async role => {
    render(<DtListItem role={role} selected navigationType="arrow-keys" />);
    const item = screen.getByRole(role);
    expect(item).toHaveAttribute('aria-selected', 'false');
    expect(item).not.toHaveAttribute('aria-checked');
    await userEvent.hover(item);
    expect(item).toHaveAttribute('aria-selected', 'true');
  });
});
