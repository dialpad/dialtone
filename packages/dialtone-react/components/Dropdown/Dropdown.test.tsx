import { act, cleanup, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtListItem } from '../ListItem';
import { DtDropdown, type DtDropdownAnchorScope, type DtDropdownProps } from './Dropdown';

const MOCK_HIGHLIGHT_STUB = vi.fn();
const MOCK_UPDATE_OPEN_STUB = vi.fn();

const baseProps: DtDropdownProps = {
  open: true,
};
// Vue's list items have no ids. Here they do: an item without one can't be highlighted with the mouse (Vue's
// setHighlightId ignores an empty id), and the highlight tests use the mouse where Vue's call setHighlightIndex(1).
const baseSlots: Partial<DtDropdownProps> = {
  anchor: (attrs: DtDropdownAnchorScope) => <a id="anchor" href="#" {...attrs}>Link</a>,
  list: (
    <ul id="list">
      <li id="item-1" role="menuitem">1</li>
      <li id="item-2" role="menuitem">2</li>
      <li id="item-3" role="menuitem">3</li>
    </ul>
  ),
};
const baseAttrs: Partial<DtDropdownProps> = {};

let mockProps: Partial<DtDropdownProps> = {};
let mockSlots: Partial<DtDropdownProps> = {};
let mockAttrs: Partial<DtDropdownProps> = {};

// An initially open popover keeps aria-hidden on its content until it's next opened, as in Vue, so role queries
// include hidden elements.
const secondItem = () => screen.getByRole('menuitem', { name: '2', hidden: true });

// Vue Test Utils' flushPromises: lets the popover's awaits finish.
const flushPromises = () => act(() => new Promise<void>(resolve => { setTimeout(resolve, 0); }));

// Vue Test Utils' attachTo: the component mounts in a new element inside the target.
const attachTo = (target: Element) => target.appendChild(document.createElement('div'));

describe('DtDropdown Tests', () => {
  let result: RenderResult;
  let anchorElement: HTMLElement | null;
  let listWrapper: HTMLElement | null;
  let closeButton: HTMLElement | null;

  const updateWrapper = () => {
    result?.unmount();
    result = render(
      <DtDropdown
        {...baseProps}
        {...mockProps}
        {...baseSlots}
        {...mockSlots}
        {...baseAttrs}
        {...mockAttrs}
      />,
      { container: attachTo(document.body) },
    );

    anchorElement = document.getElementById('anchor');
    listWrapper = screen.queryByTestId('dt-dropdown-list-wrapper');
    closeButton = screen.queryByTestId('dt-sr-only-close-button');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
    MOCK_HIGHLIGHT_STUB.mockClear();
    MOCK_UPDATE_OPEN_STUB.mockClear();
    result.unmount();
    cleanup();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(result.container).not.toBeEmptyDOMElement();
    });

    it('should render the visually hidden close button', () => {
      expect(closeButton).toBeInTheDocument();
    });

    describe('When a list is provided', () => {
      it('should render the list wrapper', () => {
        expect(listWrapper).toBeInTheDocument();
      });

      it('should render the anchor', () => {
        expect(anchorElement).toBeInTheDocument();
      });

      it('should render the list', () => {
        expect(listWrapper?.querySelector('#list')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When the dropdown is not open', () => {
      it('aria-expanded should be "false"', () => {
        mockProps = { open: false };

        updateWrapper();

        expect(anchorElement).toHaveAttribute('aria-expanded', 'false');
      });
    });

    describe('When the dropdown is open', () => {
      it('aria-expanded should be "true"', () => {
        expect(anchorElement).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      mockAttrs = { onHighlight: MOCK_HIGHLIGHT_STUB, onOpenChange: MOCK_UPDATE_OPEN_STUB };

      updateWrapper();
    });

    describe('When the highlightIndex changes', () => {
      beforeEach(() => {
        fireEvent.mouseMove(secondItem());
      });

      it('should call listener', () => {
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalled();
      });

      it('should emit highlight event', () => {
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(1);
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledWith(1);
      });
    });

    it('should pass listeners to the popover', async () => {
      // Vue emits the popover's update:open by hand; here the popover closes on Escape and reports it.
      fireEvent.keyDown(screen.getByRole('menu', { hidden: true }), { key: 'Escape', code: 'Escape' });
      await finishTransitions();
      await flushPromises();

      expect(MOCK_UPDATE_OPEN_STUB).toHaveBeenCalledWith(false);
    });

    describe('When mouseleave is detected on the list wrapper', () => {
      it('should reset the highlightIndex', async () => {
        fireEvent.mouseMove(secondItem());
        fireEvent.mouseLeave(listWrapper as HTMLElement);

        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenLastCalledWith(-1);
      });
    });

    describe('When visually hidden close button is clicked', () => {
      it('should close the dropdown', async () => {
        await userEvent.click(closeButton as HTMLElement);

        expect(anchorElement).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Keyboard navigation', () => {
    const items = () => screen.getAllByRole('menuitem', { hidden: true });
    const pressOnList = (code: string, key = code) => {
      fireEvent.keyDown(listWrapper as HTMLElement, { code, key });
    };

    // The dropdown navigates once the popover reports it opened, after its enter transition.
    const opened = async () => {
      await finishTransitions();
      await flushPromises();
    };

    beforeEach(() => {
      mockSlots = {
        list: ['Apple', 'Banana', 'Cherry'].map(name => (
          <DtListItem key={name} id={`item-${name}`} role="menuitem" navigationType="arrow-keys">{name}</DtListItem>
        )),
      };
      mockAttrs = { onHighlight: MOCK_HIGHLIGHT_STUB };
      updateWrapper();
    });

    it('moves the highlight and focus with the arrow keys, wrapping at the ends', async () => {
      await opened();

      pressOnList('ArrowDown');
      expect(items()[0]).toHaveFocus();
      expect(items()[0]).toHaveClass('d-list-item--highlighted');
      expect(items()[1]).not.toHaveClass('d-list-item--highlighted');
      pressOnList('ArrowDown');
      expect(items()[1]).toHaveFocus();
      pressOnList('ArrowUp');
      expect(items()[0]).toHaveFocus();
      pressOnList('ArrowUp');
      expect(items()[2]).toHaveFocus();
      pressOnList('ArrowDown');
      expect(items()[0]).toHaveFocus();
    });

    it('jumps with Home and End', async () => {
      await opened();

      pressOnList('End');
      expect(items()[2]).toHaveFocus();
      pressOnList('Home');
      expect(items()[0]).toHaveFocus();
    });

    it('does not report highlighting the last item, as Vue', async () => {
      await opened();

      pressOnList('End');
      expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
      pressOnList('Home');
      expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledWith(0);
    });

    it('calls onEndOfList instead of wrapping when given', async () => {
      const onEndOfList = vi.fn();
      mockAttrs = { onEndOfList };
      updateWrapper();
      await opened();

      pressOnList('End');
      pressOnList('ArrowDown');

      expect(onEndOfList).toHaveBeenCalledTimes(1);
      expect(items()[2]).toHaveFocus();
    });

    it('highlights the next item starting with a typed letter', async () => {
      await opened();

      pressOnList('KeyB', 'b');

      expect(items()[1]).toHaveFocus();
      expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledWith(1);
    });

    it('reports every keydown through onKeyDown', async () => {
      const onKeyDown = vi.fn();
      mockAttrs = { onKeyDown };
      updateWrapper();
      await opened();

      pressOnList('KeyX', 'x');

      expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'x' }));
    });

    it('does not navigate with the arrow keys when navigationType is not arrow-keys', async () => {
      mockProps = { navigationType: 'tab' };
      updateWrapper();
      await opened();

      pressOnList('ArrowDown');

      expect(items()[0]).not.toHaveFocus();
    });
  });

  describe('When opened with the keyboard', () => {
    it('highlights the first item', async () => {
      const onOpened = vi.fn();
      mockProps = { open: null };
      mockAttrs = { onOpened, onHighlight: MOCK_HIGHLIGHT_STUB };
      updateWrapper();

      fireEvent.keyDown(anchorElement as HTMLElement, { key: 'ArrowDown', code: 'ArrowDown' });
      await finishTransitions();
      await flushPromises();

      expect(onOpened).toHaveBeenCalledWith(true);
      expect(anchorElement).toHaveAttribute('aria-expanded', 'true');
      expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledWith(0);
    });

    it('does not highlight an item when opened with the mouse', async () => {
      mockProps = { open: null };
      mockAttrs = { onHighlight: MOCK_HIGHLIGHT_STUB };
      updateWrapper();

      await userEvent.click(anchorElement as HTMLElement);
      await finishTransitions();
      await flushPromises();

      expect(anchorElement).toHaveAttribute('aria-expanded', 'true');
      expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
    });
  });

  describe('List classes', () => {
    it('applies the padding, listClass and context menu classes to the list wrapper', () => {
      mockProps = { padding: 'large', listClass: 'my-list', openOnContext: true };
      updateWrapper();

      expect(listWrapper).toHaveClass('d-dropdown-list', 'd-py-50', 'my-list', 'd-context-menu-list');
    });
  });
});
