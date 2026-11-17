import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HighlightIdContext } from '../../common/keyboard-list-navigation';
import { DtListItem, type DtListItemProps } from './ListItem';
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
