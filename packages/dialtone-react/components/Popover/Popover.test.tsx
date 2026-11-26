import { act, cleanup, fireEvent, render, screen, within, type RenderResult } from '@testing-library/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Instance, ReferenceElement } from 'tippy.js';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtDropdown } from '../Dropdown';
import { DtListItem } from '../ListItem';
import { DtPopover, type DtPopoverAnchorScope, type DtPopoverProps } from './Popover';
import { getPopperOptions } from './TippyUtils';

const MOCK_DEFAULT_SLOT_MESSAGE = 'Message';
const MOCK_HEADER_CONTENT = 'Popover Title';
const MOCK_FOOTER_CONTENT = 'Popover Footer';

const anchorSlot = ({ attrs }: DtPopoverAnchorScope) => <button data-qa="dt-button" {...attrs}>Click me</button>;

const baseProps: DtPopoverProps = {
  id: 'popover-id',
  showCloseButton: true,
  initialFocusElement: 'first',
};
const baseSlots: Partial<DtPopoverProps> = {
  content: MOCK_DEFAULT_SLOT_MESSAGE,
  headerContent: MOCK_HEADER_CONTENT,
  footerContent: MOCK_FOOTER_CONTENT,
  anchor: anchorSlot,
};

let mockProps: DtPopoverProps = {};
let mockSlots: Partial<DtPopoverProps> = {};

// tippy keeps its instance on the anchor element.
const tippyInstance = (reference: Element): Instance => {
  const instance = (reference as ReferenceElement)._tippy;
  if (!instance) throw new Error('The anchor has no tippy instance');
  return instance;
};

// Vue Test Utils' flushPromises: lets tippy's popper, observers and the component's awaits finish.
const flushPromises = () => act(() => new Promise<void>(resolve => { setTimeout(resolve, 0); }));

const flipModifierOf = (instance: Instance) => instance.props.popperOptions.modifiers
  ?.find(modifier => modifier.name === 'flip') as { options: { boundary: unknown; fallbackPlacements: unknown } };

// Vue's tests turn the content's transition off, so a close ends at once; here the leave transition runs, and the
// popover unmounts tippy once it (and, when modal, the focus restoration that follows) has finished.
const finishLeave = async () => {
  await finishTransitions();
  await flushPromises();
};

// Vue's tests stub the transition and emit its after-enter / after-leave by hand (completeTransition); here the
// transition is the real one, which ends once the helper lets it.
const completeTransition = finishLeave;

// Vue Test Utils' attachTo: the component mounts in a new element inside the target.
const attachTo = (target: Element) => target.appendChild(document.createElement('div'));

// What the "open-change" tests wrap DtPopover and DtDropdown in: an existing wrapper that reports its `open` changes
// (a non-immediate watcher in Vue).
function OpenChangeWrapper ({ name, open, onOpenChange }: {
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const previous = useRef(open);
  useEffect(() => {
    if (previous.current === open) return;
    previous.current = open;
    onOpenChange(open);
  }, [open, onOpenChange]);
  return name === 'DtDropdown'
    ? <DtDropdown open={open} anchor={<button>Open</button>} list={<li role="menuitem">Action</li>} />
    : <DtPopover open={open} anchor={<button>Open</button>} content={<p>Action</p>} />;
}

const OVERLAYS = [
  { name: 'DtPopover' },
  { name: 'DtDropdown' },
];

afterEach(() => {
  cleanup();
});

describe('DtPopover Tests', () => {
  let result: RenderResult;
  // The content element: tippy moves it into its popper (and out of the document when hidden), so it's kept from the
  // first render, as Vue's wrapper keeps its component.
  let popoverWindow: HTMLElement;
  let button: HTMLElement;

  const popover = () => <DtPopover {...baseProps} {...baseSlots} {...mockProps} {...mockSlots} />;

  const updateWrapper = () => {
    result?.unmount();
    result = render(popover(), { container: attachTo(document.body) });
    popoverWindow = document.getElementById('popover-id') as HTMLElement;
    button = screen.getByTestId('dt-button');
  };

  // Vue's wrapper.setProps: re-render with the props merged in.
  const setProps = (props: Partial<DtPopoverProps>) => {
    mockProps = { ...mockProps, ...props };
    result.rerender(popover());
  };

  const anchor = () => screen.getByTestId('dt-popover-anchor');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    vi.restoreAllMocks();
    result.unmount();
  });

  describe('Presentation Tests', () => {
    describe('When Popover is open', () => {
      beforeEach(() => {
        fireEvent.click(button);
      });

      it('should render the component', () => {
        expect(result.container).not.toBeEmptyDOMElement();
      });

      it('should render the popover', () => {
        expect(popoverWindow).toBeInTheDocument();
      });

      it('should render the main content', () => {
        expect(screen.getByTestId('dt-popover-content')).toHaveTextContent(MOCK_DEFAULT_SLOT_MESSAGE);
      });

      it('should render the header content', () => {
        const header = within(popoverWindow).getAllByTestId('dt-popover-header-footer')[0];

        expect(header.textContent).toBe(MOCK_HEADER_CONTENT);
      });

      it('should render the footer content', () => {
        const footer = within(popoverWindow).getAllByTestId('dt-popover-header-footer')[1];

        expect(footer.textContent).toBe(MOCK_FOOTER_CONTENT);
      });

      it('should render the anchor slot', () => {
        expect(anchor().textContent).toBe('Click me');
      });

      it('should not render the visually hidden close button', () => {
        expect(screen.queryByTestId('dt-sr-only-close-button')).not.toBeInTheDocument();
      });

      describe('When showCloseButton is false', () => {
        beforeEach(() => {
          setProps({ showCloseButton: false });
        });

        it('should contain a visually hidden close button', () => {
          expect(screen.getByTestId('dt-sr-only-close-button')).toBeInTheDocument();
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When open prop is true', () => {
      it('popover content is displayed', () => {
        setProps({ open: true });

        expect(popoverWindow).toBeVisible();
      });

      describe('When anchor is clicked', () => {
        it('should not close the popover', () => {
          fireEvent.click(button);

          expect(popoverWindow).toBeVisible();
        });
      });
    });

    describe('When open prop is false', () => {
      beforeEach(() => {
        setProps({ open: false });
      });

      it('popover content should not be displayed', () => {
        expect(popoverWindow).not.toBeVisible();
      });

      describe('When anchor is clicked', () => {
        it('should not open the popover', () => {
          fireEvent.click(button);

          expect(popoverWindow).not.toBeVisible();
        });
      });

      describe('When anchor is clicked but it\'s disabled', () => {
        it('should not open the popover', () => {
          (button as HTMLButtonElement).disabled = true;
          fireEvent.click(button);

          expect(popoverWindow).not.toBeVisible();

          (button as HTMLButtonElement).disabled = false;
        });
      });
    });

    describe('When openOnContext prop is true', () => {
      beforeEach(() => {
        setProps({ openOnContext: true });
      });

      it('popover content should not be displayed', () => {
        expect(popoverWindow).not.toBeVisible();
      });

      describe('When anchor is clicked', () => {
        beforeEach(() => {
          fireEvent.click(button);
        });

        it('should not open the popover', () => {
          expect(popoverWindow).not.toBeVisible();
        });
      });

      describe('When anchor is right-clicked', () => {
        it('should open the popover', () => {
          fireEvent.contextMenu(button);

          expect(popoverWindow).toBeVisible();
        });
      });
    });

    describe('When open prop is unset (default behaviour)', () => {
      beforeEach(() => {
        mockProps = { open: null };

        updateWrapper();
      });

      describe('When anchor is clicked', () => {
        beforeEach(() => {
          fireEvent.click(button);
        });

        it('should open the popover', () => {
          expect(popoverWindow).toBeVisible();
        });

        describe('When a "dt-popover-close" event is emitted in the window object', () => {
          it('should close opened popover', async () => {
            fireEvent.click(button);

            act(() => {
              window.dispatchEvent(new window.Event('dt-popover-close'));
            });
            await finishLeave();

            expect(popoverWindow).not.toBeVisible();
          });
        });

        describe('When esc is pressed', () => {
          it('should close the popover', async () => {
            fireEvent.keyDown(popoverWindow, { key: 'Escape' });
            await finishLeave();

            expect(popoverWindow).not.toBeVisible();
          });
        });

        describe('When close button is activated', () => {
          it('should close the popover', async () => {
            fireEvent.click(within(popoverWindow).getByTestId('dt-popover-close'));
            await finishLeave();

            expect(popoverWindow).not.toBeVisible();
          });
        });

        describe('When sr-only close button is enabled and activated', () => {
          it('should close the popover', async () => {
            setProps({ showCloseButton: false });
            fireEvent.click(screen.getByTestId('dt-sr-only-close-button'));
            await finishLeave();

            expect(popoverWindow).not.toBeVisible();
          });
        });
      });
    });
  });

  it('completes real lazy-show enter and leave hooks', async () => {
    const onOpened = vi.fn();
    mockProps = { onOpened };
    updateWrapper();

    fireEvent.click(button);
    await completeTransition();
    expect(onOpened.mock.calls[0][0]).toBe(true);

    fireEvent.click(button);
    await completeTransition();
    expect(onOpened.mock.calls[1]).toEqual([false]);
  });

  describe('Popper Options Tests', () => {
    it('defaults the boundary to "clippingParents"', () => {
      fireEvent.click(button);

      expect(flipModifierOf(tippyInstance(button)).options.boundary).toBe('clippingParents');
    });

    describe('When boundary prop is set', () => {
      beforeEach(() => {
        mockProps = { boundary: document.body };
        updateWrapper();
      });

      it('passes the boundary to the flip modifier options', () => {
        fireEvent.click(button);

        expect(flipModifierOf(tippyInstance(button)).options.boundary).toBe(document.body);
      });
    });

    describe('When boundary prop changes while the popover is open', () => {
      it('updates the tippy instance with the new popperOptions', () => {
        setProps({ open: true });
        const setPropsSpy = vi.spyOn(tippyInstance(button), 'setProps');

        setProps({ boundary: document.body });

        expect(setPropsSpy).toHaveBeenCalledWith({
          popperOptions: getPopperOptions({
            fallbackPlacements: ['auto'],
            tether: true,
            hasHideModifierEnabled: true,
            boundary: document.body,
          }),
        });
      });
    });

    describe('When offset or fallbackPlacements are mutated in place', () => {
      it('passes the mutated offset to the tippy instance', async () => {
        const offset: [number, number] = [0, 4];
        mockProps = { open: true, offset };
        updateWrapper();
        await flushPromises();

        const setPropsSpy = vi.spyOn(tippyInstance(button), 'setProps');
        offset[1] = 20;
        setProps({});

        expect(setPropsSpy).toHaveBeenCalledWith(expect.objectContaining({
          offset: [0, 20],
        }));
      });

      it('passes the mutated fallbackPlacements to the tippy instance', async () => {
        const fallbackPlacements: DtPopoverProps['fallbackPlacements'] = ['auto'];
        mockProps = { open: true, fallbackPlacements };
        updateWrapper();
        await flushPromises();

        const setPropsSpy = vi.spyOn(tippyInstance(button), 'setProps');
        fallbackPlacements.push('bottom');
        setProps({});

        const { popperOptions } = setPropsSpy.mock.calls[0][0];
        const flipModifier = popperOptions?.modifiers?.find(modifier => modifier.name === 'flip');

        expect(flipModifier?.options?.fallbackPlacements).toEqual(['auto', 'bottom']);
      });
    });
  });

  describe('getReferenceClientRect fallback (DLT-3607)', () => {
    it('returns a zero rect instead of undefined when anchorEl is null', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      setProps({ open: true });
      const instance = tippyInstance(button);

      // The anchor goes: the instance is destroyed, but popper can still call it.
      setProps({ anchor: null });
      await flushPromises();

      const rect = instance.props.getReferenceClientRect?.();

      expect(rect).toEqual({ width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0 });
    });
  });

  describe('When isOpen becomes true before an anchor element has been resolved (DLT-3607)', () => {
    it('does not initialize a tippy instance with a null anchor', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      setProps({ open: false, anchor: null });
      await flushPromises();

      setProps({ open: true });

      expect(warn).toHaveBeenCalledWith('No anchor found for popover');
      expect(document.querySelector('[data-tippy-root]')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    describe('When popover is open', () => {
      beforeEach(() => {
        setProps({ open: true });
      });

      it('aria-expanded should be set correctly on the anchor', () => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });

      it('aria-controls should be set correctly on the anchor', () => {
        expect(button).toHaveAttribute('aria-controls', 'popover-id');
      });

      it('aria-haspopup should be set correctly on the anchor', () => {
        expect(button).toHaveAttribute('aria-haspopup', 'dialog');
      });

      it('aria-hidden should be set correctly on the content window', () => {
        expect(popoverWindow).toHaveAttribute('aria-hidden', 'false');
      });

      it('aria-labelledby should be set correctly on the content window', () => {
        expect(popoverWindow).toHaveAttribute('aria-labelledby', anchor().id);
      });

      it('uses an explicit accessible label without an automatic label reference', () => {
        setProps({ ariaLabel: 'Filter by' });

        expect(popoverWindow).toHaveAttribute('aria-label', 'Filter by');
        expect(popoverWindow).not.toHaveAttribute('aria-labelledby');
      });
    });

    describe('When popover is closed', () => {
      beforeEach(() => {
        setProps({ open: false });
      });

      it('should have correct aria attributes on the anchor', () => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });

      it('should have correct aria attributes on the content window', () => {
        expect(popoverWindow).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Built-in menu close semantics', () => {
    it.each([
      { showCloseButton: false, modal: false },
      { showCloseButton: false, modal: true },
      { showCloseButton: true, modal: false },
      { showCloseButton: true, modal: true },
    ])('updates popup and native Close semantics with showCloseButton=$showCloseButton, modal=$modal',
      async ({ showCloseButton, modal }) => {
        const onOpened = vi.fn();
        mockProps = { role: 'dialog', showCloseButton, modal, onOpened };
        updateWrapper();
        fireEvent.click(button);
        await completeTransition();
        const closeTestId = showCloseButton ? 'dt-popover-close' : 'dt-sr-only-close-button';
        const close = within(popoverWindow).getByTestId(closeTestId);
        expect(close).not.toHaveAttribute('role');
        expect(close.tagName).toBe('BUTTON');
        expect(close.tabIndex).toBe(0);

        setProps({ role: 'menu' });
        expect(popoverWindow).not.toHaveAttribute('aria-modal');
        expect(close).toHaveAttribute('role', 'menuitem');
        // Only the screen-reader-only Close leaves the menu Tab sequence; the visible Close stays tabbable.
        expect(close.tabIndex).toBe(showCloseButton ? 0 : -1);
        expect(close).toHaveAttribute('aria-label', 'Click to close');
        expect(within(popoverWindow).getByTestId(closeTestId)).toBe(close);
        setProps({ role: 'dialog' });
        expect(close).not.toHaveAttribute('role');
        expect(close.tabIndex).toBe(0);
        setProps({ role: 'menu' });

        close.focus();
        fireEvent.click(close);
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(onOpened.mock.calls.map(([open]) => open)).toEqual([true]);
        await completeTransition();
        expect(onOpened.mock.calls.map(([open]) => open)).toEqual([true, false]);
        if (modal) expect(document.activeElement).toBe(button);
      });
  });

  describe('Focus trapping', () => {
    const MOCK_TRAP_CONTENT: ReactNode = (
      <>
        <button data-qa="trap-first">One</button>
        <button data-qa="trap-last">Two</button>
      </>
    );

    describe('When modal and open', () => {
      beforeEach(async () => {
        mockProps = { modal: true };
        mockSlots = { content: MOCK_TRAP_CONTENT };

        updateWrapper();
        setProps({ open: true });
        await flushPromises();
      });

      it('wraps focus from the last element to the first on Tab', () => {
        const first = within(popoverWindow).getByTestId('dt-popover-close');
        const last = within(popoverWindow).getByTestId('trap-last');

        last.focus();
        fireEvent.keyDown(popoverWindow, { key: 'Tab' });

        expect(document.activeElement).toBe(first);
      });

      it('wraps focus from the first element to the last on Shift+Tab', () => {
        const first = within(popoverWindow).getByTestId('dt-popover-close');
        const last = within(popoverWindow).getByTestId('trap-last');

        first.focus();
        fireEvent.keyDown(popoverWindow, { key: 'Tab', shiftKey: true });

        expect(document.activeElement).toBe(last);
      });

      it('keeps the dialog exposed until dismissal restores focus', async () => {
        within(popoverWindow).getByTestId('trap-last').focus();

        // Closing flips isOpen at once; that alone must not hide the dialog from assistive technology, since a
        // descendant may still hold focus and the leave transition hasn't restored it yet. Only the end of the leave
        // transition may do that, once focus has actually moved off the dialog. (Vue's test holds the focus lookup
        // open to look at that moment; the hook's isn't reachable, so this looks before the transition ends.)
        fireEvent.keyDown(popoverWindow, { key: 'Escape' });
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(popoverWindow).toHaveAttribute('aria-hidden', 'false');

        await completeTransition();

        expect(document.activeElement).toBe(button);
        expect(popoverWindow).toHaveAttribute('aria-hidden', 'true');
      });
    });

    describe('When not modal', () => {
      beforeEach(async () => {
        mockProps = { modal: false };
        mockSlots = { content: MOCK_TRAP_CONTENT };

        updateWrapper();
        setProps({ open: true });
        await flushPromises();
      });

      it('does not trap focus (Tab is not wrapped)', () => {
        const last = within(popoverWindow).getByTestId('trap-last');

        last.focus();
        fireEvent.keyDown(popoverWindow, { key: 'Tab' });

        expect(document.activeElement).toBe(last);
      });
    });

    describe('When focustrap is true and not modal', () => {
      beforeEach(async () => {
        mockProps = { modal: false, focustrap: true };
        mockSlots = { content: MOCK_TRAP_CONTENT };

        updateWrapper();
        setProps({ open: true });
        await flushPromises();
      });

      it('wraps focus from the last element to the first on Tab', () => {
        const first = within(popoverWindow).getByTestId('dt-popover-close');
        const last = within(popoverWindow).getByTestId('trap-last');

        last.focus();
        fireEvent.keyDown(popoverWindow, { key: 'Tab' });

        expect(document.activeElement).toBe(first);
      });

      it('wraps focus from the first element to the last on Shift+Tab', () => {
        const first = within(popoverWindow).getByTestId('dt-popover-close');
        const last = within(popoverWindow).getByTestId('trap-last');

        first.focus();
        fireEvent.keyDown(popoverWindow, { key: 'Tab', shiftKey: true });

        expect(document.activeElement).toBe(last);
      });

      it('closes the popover on Escape', async () => {
        fireEvent.keyDown(popoverWindow, { key: 'Escape' });
        await finishTransitions();
        await flushPromises();

        expect(popoverWindow).toHaveAttribute('aria-hidden', 'true');
      });

      it('restores focus to the previously focused element on Escape', async () => {
        // Close so the trap deactivates, then set a known previous focus
        setProps({ open: false });
        await finishTransitions();
        await flushPromises();
        button.focus();

        // Reopen — the trap activates and captures button as previousFocus
        setProps({ open: true });
        await flushPromises();
        // Focus is inside the popover when it closes, so only the trap's restoration can bring it back.
        within(popoverWindow).getByTestId('trap-first').focus();
        expect(document.activeElement).not.toBe(button);

        fireEvent.keyDown(popoverWindow, { key: 'Escape' });
        await flushPromises();

        expect(document.activeElement).toBe(button);
      });
    });

    describe('When there are no focusable elements and the content ref is unset (DLT-3550)', () => {
      beforeEach(async () => {
        mockProps = { showCloseButton: false, initialFocusElement: 'first' };
        mockSlots = { content: 'No focusable elements here' };

        updateWrapper();
        setProps({ open: true });
        await flushPromises();
      });

      it('does not throw when a delayed after-enter callback fires against a stale content ref', async () => {
        // The content has nothing focusable, so the after-enter callback falls back to focusing the dialog.
        await expect(finishTransitions().then(flushPromises)).resolves.toBeUndefined();

        expect(document.activeElement).toBe(popoverWindow);
      });
    });
  });

  describe('Pass-through class props', () => {
    it('Should apply anchorClass to the anchor wrapper', () => {
      mockProps = { anchorClass: 'my-anchor-class' };
      updateWrapper();

      expect(anchor()).toHaveClass('my-anchor-class');
    });
  });

  describe('contentMode Tests', () => {
    it('should set data-dt-mode on dialog when contentMode is set', () => {
      mockProps = { contentMode: 'dark' };
      updateWrapper();

      expect(popoverWindow).toHaveAttribute('data-dt-mode', 'dark');
    });

    it('should invert root mode when contentMode is invert', () => {
      document.documentElement.setAttribute('data-dt-mode', 'light');
      mockProps = { contentMode: 'invert' };
      updateWrapper();

      expect(popoverWindow).toHaveAttribute('data-dt-mode', 'dark');

      document.documentElement.removeAttribute('data-dt-mode');
    });
  });

  describe('When component is unmounting', () => {
    const onOpened = vi.fn();
    const onOpenChange = vi.fn();

    beforeEach(() => {
      onOpened.mockClear();
      onOpenChange.mockClear();
      mockProps = { onOpened, onOpenChange };
      updateWrapper();
    });

    it('sets transition: none on content element to cancel in-flight transitions', () => {
      result.unmount();

      expect(popoverWindow.style.transition).toBe('none');
    });

    it('does not emit "opened" when leave transition completes', async () => {
      fireEvent.click(button);
      await finishTransitions();
      await flushPromises();
      onOpened.mockClear();

      fireEvent.keyDown(popoverWindow, { key: 'Escape' });
      result.unmount();
      await finishTransitions();
      await flushPromises();

      expect(onOpened).not.toHaveBeenCalled();
    });

    it('emits "opened" and respects open prop when leave transition completes and not unmounting', async () => {
      fireEvent.click(button);
      await finishTransitions();
      await flushPromises();
      onOpened.mockClear();

      fireEvent.keyDown(popoverWindow, { key: 'Escape' });
      await finishTransitions();
      await flushPromises();

      expect(onOpened).toHaveBeenCalled();
      expect(onOpened.mock.calls[0]).toEqual([false]);
      // uncontrolled (open === null): update:open is not emitted
      expect(onOpenChange).not.toHaveBeenCalled();
      // controlled (open !== null): update:open is emitted
      setProps({ open: true });
      await finishTransitions();
      await flushPromises();
      setProps({ open: false });
      await finishTransitions();
      await flushPromises();
      expect(onOpenChange).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it('does not emit "opened" when enter transition completes', async () => {
      fireEvent.click(button);
      result.unmount();
      await finishTransitions();
      await flushPromises();

      expect(onOpened).not.toHaveBeenCalled();
    });

    it('emits "opened" and respects open prop when enter transition completes and not unmounting', async () => {
      fireEvent.click(button);
      await finishTransitions();
      await flushPromises();

      expect(onOpened).toHaveBeenCalled();
      expect(onOpened.mock.calls[0][0]).toBe(true);
      // uncontrolled (open === null): update:open is not emitted
      expect(onOpenChange).not.toHaveBeenCalled();
      // controlled (open !== null): update:open is emitted
      fireEvent.keyDown(popoverWindow, { key: 'Escape' });
      await finishTransitions();
      await flushPromises();
      setProps({ open: true });
      await finishTransitions();
      await flushPromises();
      expect(onOpenChange).toHaveBeenCalled();
      expect(onOpenChange.mock.calls[0]).toEqual([true]);
    });
  });

  // Vue's tests listen for the event on the root through an `onOpenChange` attribute; React's `onOpenChange` is the
  // component's own prop, so the listener is a native one on the element the component is rendered in.
  it.each(OVERLAYS)('preserves bubbling open-change DOM events through $name', ({ name }) => {
    const listener = vi.fn();
    const dispatchOpenChange = (event: { currentTarget: HTMLElement }) => {
      event.currentTarget.dispatchEvent(new CustomEvent('open-change', { bubbles: true, detail: 'consumer-state' }));
    };
    const container = attachTo(document.body);
    container.addEventListener('open-change', listener);
    const local = render(name === 'DtDropdown'
      ? (
        <DtDropdown
          open
          appendTo="parent"
          modal={false}
          anchor={<button>Open</button>}
          list={<DtListItem role="menuitem" data-qa="custom-event" onClick={dispatchOpenChange}>Dispatch</DtListItem>}
        />
      )
      : (
        <DtPopover
          open
          appendTo="parent"
          modal={false}
          anchor={<button>Open</button>}
          content={<button data-qa="custom-event" onClick={dispatchOpenChange}>Dispatch</button>}
        />
      ), { container });

    expect(listener).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('custom-event'));

    expect(listener.mock.calls).toEqual([[expect.objectContaining({ detail: 'consumer-state' })]]);
    local.unmount();
  });

  it.each(OVERLAYS)('preserves an existing wrapper open-change around $name', ({ name }) => {
    const listener = vi.fn();
    const local = render(
      <OpenChangeWrapper name={name} open={false} onOpenChange={listener} />,
      { container: attachTo(document.body) },
    );

    local.rerender(<OpenChangeWrapper name={name} open onOpenChange={listener} />);
    local.rerender(<OpenChangeWrapper name={name} open={false} onOpenChange={listener} />);

    expect(listener.mock.calls).toEqual([[true], [false]]);
    local.unmount();
  });

  describe('logical visibility and transition generations', () => {
    let scrollWasLocked: boolean;
    const visibilityChanges = vi.fn();
    const onOpened = vi.fn();
    const onOpenChange = vi.fn();

    beforeEach(() => {
      scrollWasLocked = document.documentElement.classList.contains('d-of-hidden');
      document.documentElement.classList.remove('d-of-hidden');
      visibilityChanges.mockClear();
      onOpened.mockClear();
      onOpenChange.mockClear();
      mockProps = { visibilityChangeCallback: visibilityChanges, onOpened, onOpenChange };
      mockSlots = {
        content: ({ close }) => <button data-qa="inside" onClick={close}>Action</button>,
      };
      updateWrapper();
    });

    afterEach(() => {
      document.documentElement.classList.toggle('d-of-hidden', scrollWasLocked);
    });

    // Vue's tests hold the focus lookup open (`getFirstFocusableElement`, a method of the component) and emit the
    // transition's after-enter / after-leave through `.vm`. The hook's lookup isn't reachable from React, so the
    // four tests that need it are skipped (skips.json); the focus listener tests below exercise the same generation
    // checks.

    it('reports an initially open state during creation before terminal notifications', async () => {
      // Vue calls the callback during creation, before the anchor renders; React's first chance is the layout effect
      // of the first commit, which still comes before any terminal notification.
      const logicalChanges: boolean[] = [];
      mockProps = {
        open: true,
        visibilityChangeCallback: value => { logicalChanges.push(value); },
        onOpened,
        onOpenChange,
      };
      updateWrapper();
      await act(async () => { await Promise.resolve(); });

      expect(logicalChanges).toEqual([true]);
      expect(popoverWindow).toHaveAttribute('aria-hidden', 'false');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(onOpened).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();

      await completeTransition();

      expect(onOpened.mock.calls[0][0]).toBe(true);
      expect(onOpenChange.mock.calls).toEqual([[true]]);
      expect(logicalChanges).toHaveLength(1);
    });

    it('notifies actual logical changes synchronously once per change', () => {
      fireEvent.click(button);
      expect(visibilityChanges.mock.calls).toEqual([[true]]);

      fireEvent.keyDown(popoverWindow, { key: 'Escape' });
      expect(visibilityChanges.mock.calls).toEqual([[true], [false]]);

      fireEvent.keyDown(popoverWindow, { key: 'Escape' });
      expect(visibilityChanges.mock.calls).toEqual([[true], [false]]);
      expect(onOpened).not.toHaveBeenCalled();
    });

    it.each([null, false])('retains completed transition updates with open=%s', async (open) => {
      setProps({ open });
      if (open === null) fireEvent.click(button);
      else setProps({ open: true });
      expect(onOpened).not.toHaveBeenCalled();
      await completeTransition();
      expect(onOpened.mock.calls[0][0]).toBe(true);

      fireEvent.click(within(popoverWindow).getByTestId('inside'));
      expect(onOpened).toHaveBeenCalledTimes(1);
      await completeTransition();

      expect(onOpened.mock.calls[1]).toEqual([false]);
      expect(onOpenChange.mock.calls).toEqual(open === null ? [] : [[true], [false]]);
    });

    it('does not treat a same-flush prop rewrite as a reopen request', () => {
      setProps({ open: true });
      fireEvent.keyDown(popoverWindow, { key: 'Escape' });

      // Both props land in one render, as Vue's watcher sees only the last: `open` is still true, so nothing changed.
      act(() => {
        setProps({ open: false });
        setProps({ open: true });
      });
      expect(button).toHaveAttribute('aria-expanded', 'false');

      setProps({ open: false });
      setProps({ open: true });
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('ignores a canceled leave without requiring an after-leave callback', async () => {
      setProps({ open: true });
      await completeTransition();

      setProps({ open: false });
      setProps({ open: true });

      expect(visibilityChanges.mock.calls).toEqual([[true], [false], [true]]);
      expect(onOpened).toHaveBeenCalledTimes(1);
      expect(popoverWindow).toHaveAttribute('aria-hidden', 'false');
    });

    it('finishes initial focus before notifying a consumer that chooses another target', async () => {
      mockSlots = {
        content: (
          <>
            <button data-qa="first-target">First</button>
            <input data-qa="consumer-target" />
          </>
        ),
      };
      mockProps = {
        ...mockProps,
        onOpened: (opened) => {
          if (opened) within(popoverWindow).getByTestId('consumer-target').focus();
        },
      };
      updateWrapper();

      setProps({ open: true });
      await completeTransition();

      expect(document.activeElement).toBe(within(popoverWindow).getByTestId('consumer-target'));
    });

    it('focuses a documented HTMLElement target inside the popover', async () => {
      setProps({ open: true });
      const target = within(popoverWindow).getByTestId('inside');

      setProps({ initialFocusElement: target });
      await completeTransition();

      expect(document.activeElement).toBe(target);
      expect(onOpened.mock.calls[0][0]).toBe(true);
    });

    it.skip('stops a running leave before stale focus and terminal effects after reopen', () => {});

    it.skip('stops a running enter before stale focus and terminal effects after close', () => {});

    it('keeps consumer focus when closing and replacing the initial target during enter', async () => {
      mockProps = { ...mockProps, modal: false };
      mockSlots = {
        content: (
          <>
            <button
              data-qa="inside"
              onFocus={() => {
                flushSync(() => {
                  setProps({
                    open: false,
                    initialFocusElement: within(popoverWindow).getByTestId('replacement-target'),
                  });
                });
                button.focus();
              }}
            >
              First action
            </button>
            <button data-qa="replacement-target">Next opening target</button>
          </>
        ),
      };
      updateWrapper();

      setProps({ open: true });
      await completeTransition();

      expect(document.activeElement).toBe(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(onOpened).not.toHaveBeenCalled();
    });

    it('stops stale enter effects when a focus listener closes the popover', async () => {
      setProps({ initialFocusElement: 'dialog' });
      setProps({ open: true });
      popoverWindow.addEventListener('focus', () => {
        flushSync(() => setProps({ open: false }));
      }, { once: true });

      await completeTransition();

      expect(onOpened).not.toHaveBeenCalled();
      expect(document.documentElement).not.toHaveClass('d-of-hidden');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('stops stale leave effects when a focus listener reopens the popover', async () => {
      setProps({ open: true });
      await completeTransition();
      setProps({ open: false });
      button.addEventListener('focus', () => {
        flushSync(() => setProps({ open: true }));
      }, { once: true });

      await completeTransition();

      expect(onOpened).toHaveBeenCalledTimes(1);
      expect(document.documentElement).toHaveClass('d-of-hidden');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it.skip.each(['enter', 'leave'])('stops a suspended %s completion after disposal', () => {});

    it('does not forward or toggle boolean anchor arrows without opt-in', () => {
      const onKeyDown = vi.fn();
      setProps({ open: false, onKeyDown });
      let arrowEvent: Event | undefined;
      button.addEventListener('keydown', (event) => { arrowEvent = event; }, { once: true });

      fireEvent.keyDown(button, { key: 'ArrowDown', code: 'ArrowDown' });
      expect(arrowEvent?.defaultPrevented).toBe(true);
      expect(onKeyDown).not.toHaveBeenCalled();

      setProps({ forwardAnchorArrowKeys: true });
      fireEvent.keyDown(button, { key: 'ArrowDown', code: 'ArrowDown' });
      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('appendTo behavior', () => {
    const mountPopover = (props: DtPopoverProps, target: Element) => {
      const container = attachTo(target);
      const local = render(<DtPopover {...baseProps} {...baseSlots} {...props} />, { container });
      return {
        local,
        anchorButton: within(container).getByTestId('dt-button'),
        rerender: (next: DtPopoverProps) => local.rerender(<DtPopover {...baseProps} {...baseSlots} {...next} />),
      };
    };

    describe('when anchor is inside a <dialog> element and appendTo is "body"', () => {
      it('should append the popover to the dialog element, not body', () => {
        const dialogEl = document.createElement('dialog');
        document.body.appendChild(dialogEl);

        const { local, anchorButton } = mountPopover({ open: null }, dialogEl);
        fireEvent.click(anchorButton);

        expect(tippyInstance(anchorButton).popper.parentElement).toBe(dialogEl);

        local.unmount();
        document.body.removeChild(dialogEl);
      });
    });

    describe('when anchor is NOT inside a <dialog> element and appendTo is "body"', () => {
      it('should append the popover to document.body', () => {
        const { local, anchorButton } = mountPopover({ open: null }, document.body);
        fireEvent.click(anchorButton);

        expect(tippyInstance(anchorButton).popper.parentElement).toBe(document.body);

        local.unmount();
      });
    });

    describe('when anchor is inside a <dialog> but appendTo is explicitly set', () => {
      it('should use the explicit appendTo target, bypassing dialog detection', () => {
        const dialogEl = document.createElement('dialog');
        document.body.appendChild(dialogEl);

        const { local, anchorButton } = mountPopover({ open: null, appendTo: 'parent' }, dialogEl);
        fireEvent.click(anchorButton);

        // 'parent' means the popover container element, not the dialog
        expect(tippyInstance(anchorButton).popper.parentElement).not.toBe(dialogEl);

        local.unmount();
        document.body.removeChild(dialogEl);
      });
    });

    describe('scrim target (modal=true)', () => {
      const mountModalPopover = async (extraProps: DtPopoverProps, target: Element) => {
        const props = { open: true, modal: true, ...extraProps };
        const mounted = mountPopover(props, target);
        await flushPromises();
        return { ...mounted, props };
      };

      const scrimIn = (target: Element) => target.querySelector('[data-qa="dt-popover-scrim"]');

      describe('when appendTo is "body" (default) and anchor is inside a <dialog>', () => {
        it('places the scrim in the dialog, matching the content target', async () => {
          const dialogEl = document.createElement('dialog');
          document.body.appendChild(dialogEl);

          const { local, anchorButton } = await mountModalPopover({}, dialogEl);
          const scrim = scrimIn(dialogEl);

          expect(scrim?.parentElement).toBe(dialogEl);
          expect(tippyInstance(anchorButton).popper.parentElement).toBe(dialogEl);

          local.unmount();
          document.body.removeChild(dialogEl);
        });
      });

      describe('when appendTo is "body" (default) and anchor is NOT inside a <dialog>', () => {
        it('places the scrim in document.body, matching the content target', async () => {
          const { local, anchorButton } = await mountModalPopover({}, document.body);
          const scrim = scrimIn(document.body);

          expect(scrim?.parentElement).toBe(document.body);
          expect(tippyInstance(anchorButton).popper.parentElement).toBe(document.body);

          local.unmount();
        });
      });

      describe('when appendTo is "parent"', () => {
        it('places the scrim under the anchor\'s parent element', async () => {
          const container = document.createElement('div');
          document.body.appendChild(container);

          const { local, anchorButton } = await mountModalPopover({ appendTo: 'parent' }, container);
          const scrim = scrimIn(container);

          expect(scrim?.parentElement).toBe(anchorButton.parentElement);

          local.unmount();
          document.body.removeChild(container);
        });
      });

      describe('when appendTo is "root"', () => {
        it('places the scrim in window.parent.document.body when same-origin', async () => {
          const { local } = await mountModalPopover({ appendTo: 'root' }, document.body);
          const scrim = scrimIn(document.body);

          expect(scrim?.parentElement).toBe(window.parent.document.body);

          local.unmount();
        });

        it('falls back to the anchor\'s parent element when the parent window is cross-origin', async () => {
          // Matches the content's own fallback: initTippyInstance falls back to Tippy's 'parent' sentinel (the
          // anchor's parentElement) when window.parent throws.
          vi.spyOn(console, 'error').mockImplementation(() => {});
          const originalParentDescriptor = Object.getOwnPropertyDescriptor(window, 'parent') as PropertyDescriptor;
          Object.defineProperty(window, 'parent', {
            configurable: true,
            get () {
              throw new Error('cross-origin');
            },
          });

          // window.parent is shared global state — restore it in finally so a failed mount/assertion here can't leave
          // every later test unable to access window.parent.
          let mounted: Awaited<ReturnType<typeof mountModalPopover>> | undefined;
          try {
            mounted = await mountModalPopover({ appendTo: 'root' }, document.body);
            const scrim = scrimIn(document.body);

            expect(scrim?.parentElement).toBe(mounted.anchorButton.parentElement);
          } finally {
            mounted?.local.unmount();
            Object.defineProperty(window, 'parent', originalParentDescriptor);
          }
        });
      });

      describe('when appendTo is an explicit HTMLElement', () => {
        it('places the scrim in that element, matching the content target', async () => {
          const customTarget = document.createElement('div');
          document.body.appendChild(customTarget);

          const { local, anchorButton } = await mountModalPopover({ appendTo: customTarget }, document.body);
          const scrim = scrimIn(customTarget);

          expect(scrim?.parentElement).toBe(customTarget);
          expect(tippyInstance(anchorButton).popper.parentElement).toBe(customTarget);

          local.unmount();
          document.body.removeChild(customTarget);
        });
      });

      describe('when appendTo changes while the popover is already open', () => {
        it('does not move the scrim independently of the content (both stay put until reopened)', async () => {
          // The scrim target is resolved when tippy is created, at the same moment as the content's target, not live
          // off appendTo -- otherwise the scrim would follow a mid-open appendTo change while the already-rendered
          // Tippy content (which only re-resolves on open) stayed behind, drifting apart.
          const container = document.createElement('div');
          document.body.appendChild(container);

          const { local, anchorButton, rerender, props } = await mountModalPopover({}, document.body);
          const scrimParentBefore = scrimIn(document.body)?.parentElement;
          const contentParentBefore = tippyInstance(anchorButton).popper.parentElement;

          rerender({ ...props, appendTo: 'parent' });

          const scrim = scrimIn(document.body);

          expect(scrim?.parentElement).toBe(scrimParentBefore);
          expect(tippyInstance(anchorButton).popper.parentElement).toBe(contentParentBefore);

          local.unmount();
          document.body.removeChild(container);
        });

        it('resolves both scrim and content to the new target on the next open', async () => {
          const container = document.createElement('div');
          document.body.appendChild(container);

          const { local, anchorButton, rerender, props } = await mountModalPopover({}, container);

          rerender({ ...props, open: false });
          await flushPromises();
          rerender({ ...props, appendTo: 'parent', open: true });
          await flushPromises();

          const scrim = scrimIn(container);

          expect(scrim?.parentElement).toBe(anchorButton.parentElement);
          expect(tippyInstance(anchorButton).popper.parentElement).toBe(anchorButton.parentElement);

          local.unmount();
          document.body.removeChild(container);
        });
      });
    });
  });

  describe('When anchor slot content changes', () => {
    it('should attach the tippy instance to the new DOM node', async () => {
      interface TestProps { showAlternateAnchor?: boolean; showExtraneous?: boolean; open?: boolean }
      const component = ({ showAlternateAnchor, showExtraneous, open }: TestProps) => (
        <DtPopover
          open={open}
          anchor={(
            <>
              {/* Keys, as Vue's v-if/v-else renders two different elements. */}
              {showAlternateAnchor
                ? <div key="1" className="testanchor">Anchor 1</div>
                : <div key="2" className="testanchor">Anchor 2</div>}
              {showExtraneous && <div>will not be the anchor</div>}
            </>
          )}
          content={<div className="content">Hello</div>}
        />
      );
      let props: TestProps = { showAlternateAnchor: false };
      const local = render(component(props), { container: attachTo(document.body) });
      const setLocalProps = async (next: TestProps) => {
        props = { ...props, ...next };
        local.rerender(component(props));
        // The anchor is read again by a MutationObserver, as in Vue; and the transition ends, as in Vue's tests.
        await finishLeave();
      };

      const localWindow = within(local.container).getByTestId('dt-popover');
      expect(localWindow).not.toBeVisible();
      await setLocalProps({ open: true });
      expect(localWindow).toBeVisible();
      await setLocalProps({ open: false });
      expect(localWindow).not.toBeVisible();

      await setLocalProps({ showAlternateAnchor: true });

      expect(localWindow).not.toBeVisible();
      await setLocalProps({ open: true });
      expect(localWindow).toBeVisible();
      expect(tippyInstance(within(local.container).getByText('Anchor 1'))).toBeDefined();
      await setLocalProps({ open: false });
      expect(localWindow).not.toBeVisible();

      await setLocalProps({ open: true });
      const instance = tippyInstance(within(local.container).getByText('Anchor 1'));
      await setLocalProps({ showExtraneous: true });
      expect(tippyInstance(within(local.container).getByText('Anchor 1'))).toBe(instance);

      local.unmount();
    });
  });
});
