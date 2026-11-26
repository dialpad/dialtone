import { useLayoutEffect, useState, type ReactNode } from 'react';
import { act, cleanup, fireEvent, render, screen, within, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtListItem } from '../ListItem';
import { DtListItemGroup } from '../ListItemGroup';
import { DtPopover } from '../Popover';
import { DtDropdown, type DtDropdownAnchorScope, type DtDropdownProps } from './Dropdown';

const MOCK_HIGHLIGHT_STUB = vi.fn();
const MOCK_UPDATE_OPEN_STUB = vi.fn();

const baseProps: DtDropdownProps = {
  open: true,
};
// Vue's list items have no ids. Here they do: an item without one can't be highlighted with the mouse (Vue's
// setHighlightId ignores an empty id), and the highlight tests use the mouse where Vue's call setHighlightIndex(1).
const baseSlots: Partial<DtDropdownProps> = {
  anchor: (attrs: DtDropdownAnchorScope) => (
    <button
      id="anchor"
      ref={(element) => { consumerTrigger = element; }}
      aria-expanded={attrs['aria-expanded']}
      aria-controls={attrs['aria-controls']}
      aria-haspopup={attrs['aria-haspopup']}
    >
      Open menu
    </button>
  ),
  list: (
    <ul id="list">
      <li id="item-1" role="menuitem">1</li>
      <li id="item-2" role="menuitem">2</li>
      <li id="item-3" role="menuitem">3</li>
    </ul>
  ),
};
const baseAttrs: Partial<DtDropdownProps> = {};

let consumerTrigger: HTMLButtonElement | null = null;
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
      it('should forward popup attributes without overwriting the consumer ref', () => {
        const popoverContent = screen.getByRole('menu', { hidden: true });
        expect(anchorElement).toHaveAttribute('aria-expanded', 'true');
        expect(anchorElement).toHaveAttribute('aria-controls', popoverContent.id);
        expect(anchorElement).toHaveAttribute('aria-haspopup', 'menu');
        expect(consumerTrigger).toBe(anchorElement);
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

    // The built-in Close is not part of arrow, Home or End navigation.
    const close = () => screen.getByTestId('dt-sr-only-close-button');

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

    it('jumps with Home, and to the last item with End', async () => {
      await opened();

      pressOnList('End');
      expect(items()[2]).toHaveFocus();
      pressOnList('Home');
      expect(items()[0]).toHaveFocus();
    });

    it('does not report highlighting the last item, as Vue', async () => {
      await opened();

      pressOnList('End');
      expect(items()[2]).toHaveFocus();
      expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
      pressOnList('Home');
      expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledWith(0);
    });

    it('returns arrows from a focused screen-reader Close to the rows', async () => {
      await opened();

      close().focus();
      fireEvent.keyDown(close(), { code: 'ArrowDown', key: 'ArrowDown' });
      expect(items()[0]).toHaveFocus();
      close().focus();
      fireEvent.keyDown(close(), { code: 'ArrowUp', key: 'ArrowUp' });
      expect(items()[2]).toHaveFocus();
    });

    it('calls onEndOfList instead of wrapping to the first item when given', async () => {
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

describe('Dropdown menu roles and controlled arrow opt-in', () => {
  let result: RenderResult;
  let visibilityChanges: ReturnType<typeof vi.fn<(open: boolean) => void>>;
  let highlight: ReturnType<typeof vi.fn<(index: number) => void>>;
  let keydown: ReturnType<typeof vi.fn<(event: KeyboardEvent) => void>>;
  let actions: string[];
  // Vue's wrapper.setProps, which a test can also call from inside an event handler.
  let setProps: (next: Partial<DtDropdownProps>) => void;

  beforeEach(() => {
    visibilityChanges = vi.fn();
    highlight = vi.fn();
    keydown = vi.fn();
    actions = [];
  });

  const defaultList = () => [
    <li key="heading" role="presentation" data-qa="heading">Choices</li>,
    <DtListItem
      key="radio-one"
      role="menuitemradio"
      id="radio:one"
      data-qa="radio-one"
      selected
      navigationType="arrow-keys"
      onClick={() => actions.push('Alpha')}
    >
      Alpha
    </DtListItem>,
    <li key="separator" role="separator" />,
    <DtListItem
      key="action"
      role="menuitem"
      id="action"
      data-qa="action-row"
      navigationType="arrow-keys"
      onClick={() => actions.push('Beta')}
    >
      Beta
    </DtListItem>,
    <DtListItem
      key="radio-two"
      role="menuitemradio"
      id="radio two"
      data-qa="radio-two"
      navigationType="arrow-keys"
      onClick={() => actions.push('Bravo')}
    >
      <span role="img" aria-label="Bravo icon" data-qa="nested-role">Bravo</span>
    </DtListItem>,
    <li key="no-id" role="menuitemradio" tabIndex={-1}>No ID</li>,
  ];

  function Harness ({ initial }: { initial: DtDropdownProps }) {
    const [props, setState] = useState(initial);
    useLayoutEffect(() => {
      setProps = next => setState(current => ({ ...current, ...next }));
    }, []);
    return <DtDropdown {...props} />;
  }

  const mountMenu = (
    props: Partial<DtDropdownProps> = {},
    onKeyDown?: (event: KeyboardEvent) => void,
    list?: () => ReactNode,
    attrs: Partial<DtDropdownProps> = {},
  ) => {
    keydown.mockImplementation(event => onKeyDown?.(event));
    result = render(
      <Harness
        initial={{
          open: true,
          visibilityChangeCallback: visibilityChanges,
          ...props,
          onKeyDown: keydown,
          onHighlight: highlight,
          ...attrs,
          anchor: anchorAttrs => (
            <button data-qa="trigger" aria-expanded={anchorAttrs['aria-expanded']}>Choose</button>
          ),
          list: (list ?? defaultList)(),
        }}
      />,
      { container: attachTo(document.body) },
    );
    // Vue's popover content ref: the dialog element that holds this dropdown's list (once it has opened).
    const listWrapper = screen.queryAllByTestId('dt-dropdown-list-wrapper')[0];
    return listWrapper?.closest<HTMLElement>('[data-qa="dt-popover"]') as HTMLElement;
  };

  // DtListItemGroup's list shares the dropdown list's data-qa; the dropdown's comes first.
  const dropdownList = () => screen.getAllByTestId('dt-dropdown-list-wrapper')[0];

  const update = (next: Partial<DtDropdownProps>) => act(() => { setProps(next); });
  const trigger = () => screen.getByTestId('trigger');
  const settle = async () => {
    await finishTransitions();
    await flushPromises();
  };

  afterEach(() => {
    result.unmount();
    cleanup();
    vi.restoreAllMocks();
  });

  it('preserves consumer popup classes alongside the arrow-key menu class', async () => {
    // React has no kebab-case attribute alias: both of Vue's class bindings are one dialogClass.
    const content = mountMenu({}, undefined, undefined, {
      dialogClass: [['consumer-kebab', { 'consumer-active': true }], { 'consumer-camel': true, 'consumer-inactive': false }],
    });
    await settle();
    expect(content).toHaveClass('consumer-kebab', 'consumer-active', 'consumer-camel', 'd-dropdown__menu--arrow-keys');
    expect(content).not.toHaveClass('consumer-inactive');
    for (const navigationType of ['tab', 'none'] as const) {
      await update({ navigationType });
      expect(content).not.toHaveClass('d-dropdown__menu--arrow-keys');
      expect(content).toHaveClass('consumer-kebab', 'consumer-active', 'consumer-camel');
    }
    await update({ navigationType: 'arrow-keys' });
    expect(content).toHaveClass('d-dropdown__menu--arrow-keys');
    await update({ dialogClass: ['consumer-updated', ['consumer-kebab-updated']] });
    expect(content).toHaveClass('consumer-updated', 'consumer-kebab-updated', 'd-dropdown__menu--arrow-keys');
    expect(content).not.toHaveClass('consumer-camel');
    expect(content).not.toHaveClass('consumer-kebab');
  });

  it('navigates mixed menu roles without changing the checked row', async () => {
    mountMenu();
    await settle();
    const list = dropdownList();
    const send = (key: string, code = key) => fireEvent.keyDown(list, { key, code });
    send('ArrowDown');
    expect(document.activeElement?.id).toBe('radio:one');
    send('ArrowDown');
    expect(document.activeElement?.id).toBe('action');
    send('b', 'KeyB');
    expect(document.activeElement?.id).toBe('radio two');
    send('End');
    expect(document.activeElement?.id).toBe('radio two');
    send('ArrowDown');
    expect(document.activeElement?.id).toBe('radio:one');
    send('ArrowUp');
    expect(document.activeElement?.id).toBe('radio two');
    send('Home');
    expect(document.activeElement?.id).toBe('radio:one');
    expect(screen.getByTestId('radio-one')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('radio-two')).toHaveAttribute('aria-checked', 'false');
  });

  // Assistive technology can move focus onto the hidden Close; arrows return to the rows from there.
  it('returns arrows from a focused screen-reader Close to the first and last rows', async () => {
    const content = mountMenu();
    await settle();
    const close = within(content).getByTestId('dt-sr-only-close-button');
    // Start each press from the middle row so the result comes from Close, not from the row position.
    for (const [key, row] of [['ArrowDown', 'radio:one'], ['ArrowUp', 'radio two']]) {
      within(content).getByTestId('action-row').focus();
      fireEvent.mouseMove(within(content).getByTestId('action-row'));
      close.focus();
      fireEvent.keyDown(close, { key, code: key });
      expect(document.activeElement?.id).toBe(row);
    }
  });

  it('targets the owning menu row when hovering nested-role content', async () => {
    const menu = mountMenu();
    await settle();
    menu.focus();
    fireEvent.mouseMove(screen.getByTestId('nested-role'));
    expect(document.activeElement?.id).toBe('radio two');
    fireEvent.mouseMove(screen.getByTestId('action-row'));
    expect(document.activeElement?.id).toBe('action');
    fireEvent.keyDown(screen.getByTestId('action-row'), { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(screen.getByTestId('action-row'), { key: ' ', code: 'Space' });
    expect(actions).toEqual(['Beta', 'Beta']);
    expect(highlight.mock.calls).toEqual([[1]]);
  });

  it('keeps focus off the hidden Close in an empty keyboard-opened menu', async () => {
    mountMenu({ open: null }, undefined, () => []);
    fireEvent.keyDown(trigger(), { key: 'ArrowDown', code: 'ArrowDown' });
    await settle();
    const content = screen.getByTestId('dt-popover');
    const close = within(content).getByTestId('dt-sr-only-close-button');
    for (const key of ['ArrowUp', 'ArrowDown', 'Home', 'End']) {
      expect(document.activeElement).not.toBe(close);
      fireEvent.keyDown(content, { key, code: key });
    }
    expect(document.activeElement).not.toBe(close);
  });

  it.each([
    { target: 'a consumer focus target', attrs: { initialFocusElement: '#refresh' }, focused: 'refresh' },
    { target: 'an unset focus target', attrs: { initialFocusElement: undefined }, focused: 'export' },
  ] as const)('opens a menu with a disabled first row by keyboard onto $target', async ({ attrs, focused }) => {
    mountMenu({ open: null }, undefined, () => [
      <DtListItem key="export" id="export" role="menuitem" navigationType="arrow-keys" disabled>Export</DtListItem>,
      <DtListItem key="rename" id="rename" role="menuitem" navigationType="arrow-keys">Rename</DtListItem>,
      <DtListItem key="refresh" id="refresh" role="menuitem" navigationType="arrow-keys">Refresh</DtListItem>,
    ], attrs);
    fireEvent.keyDown(trigger(), { key: 'ArrowDown', code: 'ArrowDown' });
    await settle();
    expect(document.activeElement?.id).toBe(focused);
  });

  it.each(['dialog', 'listbox'] as const)('preserves legacy row boundaries with popup role=%s', async (role) => {
    const content = mountMenu({ role });
    await settle();
    expect(content).toHaveAttribute('role', role);
    expect(content).not.toHaveClass('d-dropdown__menu--arrow-keys');
    fireEvent.keyDown(content, { key: 'End', code: 'End' });
    expect(document.activeElement?.id).toBe('radio two');
    fireEvent.keyDown(content, { key: 'ArrowDown', code: 'ArrowDown' });
    expect(document.activeElement?.id).toBe('radio:one');
    fireEvent.keyDown(content, { key: 'ArrowUp', code: 'ArrowUp' });
    expect(document.activeElement?.id).toBe('radio two');
  });

  it('preserves custom callbacks at the application row boundaries', async () => {
    const beginning = vi.fn();
    const end = vi.fn();
    const content = mountMenu({ onBeginningOfList: beginning, onEndOfList: end });
    await settle();
    fireEvent.keyDown(content, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(content, { key: 'ArrowUp', code: 'ArrowUp' });
    expect(beginning).toHaveBeenCalledExactlyOnceWith();
    expect(document.activeElement?.id).toBe('radio:one');
    fireEvent.keyDown(content, { key: 'End', code: 'End' });
    expect(document.activeElement?.id).toBe('radio two');
    fireEvent.keyDown(content, { key: 'ArrowDown', code: 'ArrowDown' });
    expect(end).toHaveBeenCalledExactlyOnceWith();
    expect(document.activeElement?.id).toBe('radio two');
    expect(actions).toEqual([]);
  });

  it.each([false, true])('dismisses the owning Close without a choice event with showCloseButton=%s',
    async (showCloseButton) => {
      const foreign = render(
        <DtPopover open modal={false} anchor={<button data-qa="foreign-trigger">Another popup</button>} />,
        { container: attachTo(document.body) },
      );
      try {
        const content = mountMenu({ showCloseButton });
        await settle();
        const close = within(content).getByTestId(showCloseButton ? 'dt-popover-close' : 'dt-sr-only-close-button');
        if (showCloseButton) fireEvent.click(close);
        else fireEvent.keyDown(close, { key: ' ', code: 'Space' });
        await settle();
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
        expect(document.activeElement).toBe(trigger());
        expect(screen.getByTestId('foreign-trigger')).toHaveAttribute('aria-expanded', 'true');
        expect(highlight.mock.calls).toEqual([[-1]]);
        expect(actions).toEqual([]);
        expect(visibilityChanges.mock.calls).toEqual([[true], [false]]);
      } finally {
        foreign.unmount();
      }
    });

  it('preserves non-li rows without pointer-driven menu focus or highlight events', async () => {
    const content = mountMenu({}, undefined, () => [
      <DtListItem key="first" id="div-first" role="menuitem" elementType="div" navigationType="arrow-keys">
        First
      </DtListItem>,
      <DtListItem key="second" id="div-second" role="menuitem" elementType="div" navigationType="arrow-keys">
        Second
      </DtListItem>,
    ]);
    await settle();
    content.focus();
    fireEvent.mouseMove(document.getElementById('div-second') as HTMLElement);
    expect(document.activeElement).toBe(content);
    expect(highlight).not.toHaveBeenCalled();
  });

  it('navigates anchor arrows when initially open with the opt-in', async () => {
    mountMenu({ open: true, forwardAnchorArrowKeys: true });
    await settle();
    fireEvent.keyDown(trigger(), { key: 'ArrowDown', code: 'ArrowDown' });
    expect(visibilityChanges.mock.calls).toEqual([[true]]);
    expect(keydown.mock.calls[0][0].defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('radio:one');
  });

  it('preserves legacy highlight notifications when hovering a group heading', async () => {
    mountMenu({}, undefined, () => (
      <DtListItemGroup id="sort-options" heading="Sort order">
        <DtListItem id="newest" role="menuitemradio" selected navigationType="arrow-keys">Newest</DtListItem>
        <DtListItem id="oldest" role="menuitemradio" navigationType="arrow-keys">Oldest</DtListItem>
        <DtListItem id="refresh" role="menuitem" navigationType="arrow-keys">Refresh</DtListItem>
      </DtListItemGroup>
    ));
    await settle();
    const byId = (id: string) => document.getElementById(id) as HTMLElement;
    fireEvent.mouseMove(byId('oldest'));
    expect(highlight.mock.calls).toEqual([[1]]);
    fireEvent.mouseMove(byId('sort-options-heading'));
    fireEvent.mouseMove(byId('sort-options-heading'));
    expect(highlight.mock.calls).toEqual([[1], [-1]]);
    expect(byId('oldest')).not.toHaveClass('d-list-item--highlighted');
    expect(document.activeElement?.id).toBe('oldest');
    expect(byId('newest')).toHaveAttribute('aria-checked', 'true');
  });

  it('moves the pointer highlight onto a disabled row while the menu keeps focus', async () => {
    const menu = mountMenu({}, undefined, () => [
      <DtListItem key="rename" id="rename" data-qa="rename-row" role="menuitem" navigationType="arrow-keys">
        Rename
      </DtListItem>,
      <DtListItem key="export" id="export" data-qa="export-row" role="menuitem" navigationType="arrow-keys" disabled>
        Export
      </DtListItem>,
      <DtListItem key="refresh" id="refresh" data-qa="refresh-row" role="menuitem" navigationType="arrow-keys">
        Refresh
      </DtListItem>,
    ]);
    await settle();
    // Start with focus on an enabled row, so hovering the disabled one must move it.
    fireEvent.mouseMove(screen.getByTestId('rename-row'));
    fireEvent.mouseMove(screen.getByTestId('export-row'));
    // Focusing the row would show the keyboard focus ring under the pointer.
    expect(document.activeElement).toBe(menu);
    fireEvent.keyDown(menu, { key: 'ArrowDown', code: 'ArrowDown' });
    expect(document.activeElement?.id).toBe('refresh');
  });

  it('keeps Space from scrolling the menu while the pointer rests on a disabled row', async () => {
    const menu = mountMenu({}, undefined, () => [
      <DtListItem key="newest" id="newest" data-qa="newest-row" role="menuitemradio" navigationType="arrow-keys">
        Newest
      </DtListItem>,
      <DtListItem
        key="archived"
        id="archived"
        data-qa="archived-row"
        role="menuitemradio"
        navigationType="arrow-keys"
        disabled
      >
        Archived
      </DtListItem>,
    ]);
    await settle();
    fireEvent.mouseMove(screen.getByTestId('archived-row'));
    const space = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true, cancelable: true });
    menu.dispatchEvent(space);
    expect(space.defaultPrevented).toBe(true);
  });

  it('focuses a hovered disabled row when the menu content cannot take focus', async () => {
    mountMenu({}, undefined, () => [
      <DtListItem key="rename" id="rename" data-qa="rename-row" role="menuitem" navigationType="arrow-keys">
        Rename
      </DtListItem>,
      <DtListItem key="export" id="export" data-qa="export-row" role="menuitem" navigationType="arrow-keys" disabled>
        Export
      </DtListItem>,
    ], { contentTabindex: null });
    await settle();
    fireEvent.mouseMove(screen.getByTestId('rename-row'));
    fireEvent.mouseMove(screen.getByTestId('export-row'));
    // Leaving focus on Rename would let Enter activate a row the pointer isn't on.
    expect(document.activeElement?.id).toBe('export');
  });

  it('keeps the menu context through a neutral wrapper and an explicitly labelled group', async () => {
    const menu = mountMenu({}, undefined, () => [
      <DtListItemGroup key="group" id="sort-group" heading="Sort order">
        <DtListItem role="menuitemradio" selected navigationType="arrow-keys">Newest</DtListItem>
      </DtListItemGroup>,
      <DtListItem key="refresh" role="menuitem" navigationType="arrow-keys">Refresh</DtListItem>,
    ]);
    await settle();
    const list = dropdownList();
    const group = list.querySelector('[role="group"]') as HTMLElement;
    expect(menu).toHaveAttribute('role', 'menu');
    expect(list).toHaveAttribute('role', 'none');
    expect(group.querySelector('[role="menuitemradio"]')?.parentElement).toBe(group);
    expect(group.parentElement).toBe(list);
    expect(group.parentElement?.closest('ul:not([role]), ol:not([role])')).toBeNull();
    expect(list.querySelector('[role="menuitem"]')?.parentElement).toBe(list);
  });

  it('keeps closing-content arrows out of the closed-anchor opening path', async () => {
    mountMenu({ open: true, forwardAnchorArrowKeys: true });
    await settle();
    const list = dropdownList();
    // Vue holds the leave open by stubbing DtPopover's focus lookup; here the arrow arrives before the leave
    // transition has run, while the dropdown is already logically closed.
    await update({ open: false });
    expect(visibilityChanges.mock.calls).toEqual([[true], [false]]);
    fireEvent.keyDown(list, { key: 'ArrowDown', code: 'ArrowDown' });
    expect(keydown).toHaveBeenCalledTimes(1);
    expect(keydown.mock.calls[0][0].defaultPrevented).toBe(true);
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    await settle();
  });

  it.each([
    { code: 'ArrowUp', showCloseButton: false },
    { code: 'ArrowDown', showCloseButton: true },
  ])('preserves first-row keyboard focus on $code opening with showCloseButton=$showCloseButton',
    async ({ code, showCloseButton }) => {
      mountMenu({ open: null, showCloseButton });
      fireEvent.keyDown(trigger(), { key: code, code });
      await settle();
      expect(keydown).toHaveBeenCalledTimes(1);
      expect(document.activeElement?.id).toBe('radio:one');
    });

  it('forwards one closed controlled arrow without suppressing an ancestor and forgets ignored modality', async () => {
    mountMenu({ open: false, forwardAnchorArrowKeys: true });
    const ancestor = vi.fn();
    // The dropdown's root element's parent, as Vue's wrapper.element.parentElement.
    result.container.addEventListener('keydown', ancestor);
    fireEvent.keyDown(trigger(), { key: 'ArrowDown', code: 'ArrowDown' });
    expect(keydown).toHaveBeenCalledTimes(1);
    const event = keydown.mock.calls[0][0];
    expect(ancestor).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(false);
    await flushPromises();
    await userEvent.click(trigger());
    await update({ open: true });
    await settle();
    expect(document.activeElement?.getAttribute('role')).toBe('menu');
    result.container.removeEventListener('keydown', ancestor);
  });

  it('records keyboard modality before the parent accepts opening', async () => {
    mountMenu({ open: false, forwardAnchorArrowKeys: true }, () => {
      setProps({ open: true });
    });
    fireEvent.keyDown(trigger(), { key: 'ArrowDown', code: 'ArrowDown' });
    await settle();
    expect(visibilityChanges.mock.calls).toEqual([[true]]);
    expect(document.activeElement?.id).toBe('radio:one');
  });

  it('keeps controlled anchor arrows silent by default', async () => {
    mountMenu({ open: false });
    fireEvent.keyDown(trigger(), { key: 'ArrowDown', code: 'ArrowDown' });
    expect(keydown).not.toHaveBeenCalled();
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });
});
