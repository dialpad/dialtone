import { act, cleanup, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import { createRef } from 'react';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtHovercard, type DtHovercardHandle, type DtHovercardProps } from './Hovercard';

const MOCK_DEFAULT_SLOT_MESSAGE = 'Message';
const MOCK_HEADER_CONTENT = 'Hovercard Title';
const MOCK_FOOTER_CONTENT = 'Hovercard Footer';

const baseProps: DtHovercardProps = {
  id: 'hovercard-1',
  anchor: attrs => <button data-qa="dt-button" {...attrs}>Hover me</button>,
  content: MOCK_DEFAULT_SLOT_MESSAGE,
  headerContent: MOCK_HEADER_CONTENT,
  footerContent: MOCK_FOOTER_CONTENT,
};

// Vue Test Utils' flushPromises: lets tippy's popper, observers and the component's awaits finish. The timers are fake,
// so a real setTimeout can't be waited for: the promises are drained and the timers due now are run.
const flushPromises = () => act(async () => {
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
  vi.advanceTimersByTime(0);
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
});

// Vue's vi.runAllTimers, with what Vue Test Utils' transition stub does by itself: a hide or show ends at once, here
// when the transition has finished and React has applied the result.
const runAllTimers = async () => {
  await act(async () => { vi.runAllTimers(); });
  await finishTransitions();
  await flushPromises();
};

// Vue Test Utils' attachTo: the component mounts in a new element inside the target.
const attachTo = (target: Element) => target.appendChild(document.createElement('div'));

describe('DtHovercard Tests', () => {
  let result: RenderResult;
  let anchor: HTMLElement;
  let hovercardWindow: HTMLElement;
  let button: HTMLElement;

  const updateWrapper = () => {
    result = render(<DtHovercard {...baseProps} />, { container: attachTo(document.body) });
    hovercardWindow = screen.getByTestId('dt-hovercard');
    anchor = screen.getByTestId('dt-hovercard-anchor');
    button = screen.getByTestId('dt-button');
  };

  // Since tippy appends the element to the body, the assertion is done in
  // document insted of the wrapper
  const getHovercardContent = () => document.querySelector<HTMLElement>('[data-qa="dt-hovercard-content"]');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.runAllTimers();
    updateWrapper();
  });

  afterEach(() => {
    result.unmount();
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Presentation Tests', () => {
    describe('When mouseenter on anchor', () => {
      beforeEach(async () => {
        fireEvent.mouseEnter(anchor);
        await runAllTimers();
      });

      it('should render the hovercard content', () => {
        expect(getHovercardContent()).toHaveTextContent(MOCK_DEFAULT_SLOT_MESSAGE);
        expect(getHovercardContent()?.textContent).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });

      it('should render the component', () => {
        expect(result.container).not.toBeEmptyDOMElement();
      });

      it('should render the anchor slot', () => {
        expect(anchor.textContent).toBe('Hover me');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When mouse leave on anchor', () => {
      it('hovercard is not displayed', async () => {
        fireEvent.mouseEnter(anchor);
        await runAllTimers();
        fireEvent.mouseLeave(anchor);
        await runAllTimers();

        expect(getHovercardContent()).toBeNull();
      });
    });

    describe('When mouse enter on hovercard', () => {
      it('should still display the hovercard', async () => {
        fireEvent.mouseEnter(anchor);
        fireEvent.mouseEnter(hovercardWindow);
        await runAllTimers();

        expect(getHovercardContent()?.textContent).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });
    });

    describe('When focusin on anchor', () => {
      it('hovercard is not displayed', () => {
        fireEvent.focusIn(anchor);

        expect(getHovercardContent()).toBeNull();
      });
    });

    describe('When content is focused', () => {
      it('hovercard should remain visible', async () => {
        fireEvent.mouseEnter(anchor);
        await runAllTimers();

        expect(getHovercardContent()).not.toBeNull();

        // Focus on the hovercard content wrapper (which has the focusin event handler)
        const contentWrapper = getHovercardContent()?.querySelector('div') as HTMLElement;
        contentWrapper.tabIndex = -1; // Make it focusable
        act(() => contentWrapper.focus());
        await runAllTimers();

        // Leave the hovercard
        fireEvent.mouseLeave(anchor);
        await runAllTimers();

        // Hovercard should still be visible
        expect(getHovercardContent()).not.toBeNull();
        expect(getHovercardContent()?.textContent).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });
    });

    describe('When anchor is removed from DOM', () => {
      it('hovercardOpen is set to false', async () => {
        fireEvent.mouseEnter(anchor);
        await runAllTimers();
        expect(button).toHaveAttribute('aria-expanded', 'true');

        // Remove anchor from DOM
        anchor.parentNode?.removeChild(anchor);
        // Advance timers to allow hovercard to react
        await runAllTimers();

        // Vue reads the component's hovercardOpen; here it's the state the popover shows.
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(getHovercardContent()).toBeNull();
      });

      it('does not reopen when the enter timer is still pending', async () => {
        fireEvent.mouseEnter(anchor);

        // Remove anchor from DOM before the enter delay elapses, so inTimer is still pending
        anchor.parentNode?.removeChild(anchor);
        // Let the MutationObserver react to the removal
        await act(async () => {});

        await runAllTimers();

        expect(getHovercardContent()).toBeNull();
      });
    });
  });

  describe('With externalAnchorElement — show/hide API Tests', () => {
    let externalAnchorResult: RenderResult;
    let handle: React.RefObject<DtHovercardHandle | null>;

    beforeEach(() => {
      const externalEl = document.createElement('span');
      document.body.appendChild(externalEl);

      handle = createRef<DtHovercardHandle>();
      externalAnchorResult = render(
        <DtHovercard
          ref={handle}
          id="hovercard-external"
          externalAnchorElement={externalEl}
          content={MOCK_DEFAULT_SLOT_MESSAGE}
        />,
        { container: attachTo(document.body) },
      );
    });

    afterEach(() => {
      externalAnchorResult.unmount();
    });

    describe('When show() is called', () => {
      beforeEach(async () => {
        act(() => handle.current?.show());
        await runAllTimers();
      });

      it('should show the hovercard after the enter delay', () => {
        expect(getHovercardContent()?.textContent).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });
    });

    describe('When hide() is called after show()', () => {
      beforeEach(async () => {
        act(() => handle.current?.show());
        await runAllTimers();
        act(() => handle.current?.hide());
        await runAllTimers();
      });

      it('should hide the hovercard after the leave delay', () => {
        expect(getHovercardContent()).toBeNull();
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When hovercard is open', () => {
      beforeEach(() => {
        fireEvent.mouseEnter(anchor);
      });

      it('shows correct role', () => {
        expect(screen.getByTestId('dt-hovercard__dialog')).toHaveAttribute('role', 'dialog');
      });

      it('aria-controls should be set correctly on the anchor', () => {
        expect(button).toHaveAttribute('aria-controls', 'hovercard-1');
      });

      it('aria-haspopup should be set correctly on the anchor', () => {
        expect(button).toHaveAttribute('aria-haspopup', 'dialog');
      });
    });

    describe('Focus trapping', () => {
      // Reads DtPopover's props through findComponent: see skips.json. The two React-only tests below check what
      // focustrap does, through the DOM.
      it.skip('passes focustrap=true to DtPopover when hovercard is open', () => {});

      it.skip('passes a falsy focustrap to DtPopover when hovercard is closed', () => {});

      describe('With focusable content', () => {
        let trapResult: RenderResult;

        beforeEach(() => {
          trapResult = render(
            <DtHovercard
              id="hovercard-trap"
              data-qa="trap"
              anchor={attrs => <button data-qa="trap-anchor-button" {...attrs}>Anchor</button>}
              content={(
                <>
                  <button data-qa="trap-first">First</button>
                  <button data-qa="trap-last">Last</button>
                </>
              )}
            />,
            { container: attachTo(document.body) },
          );
        });

        afterEach(() => {
          trapResult.unmount();
        });

        it('wraps Tab from the last focusable element to the first when the hovercard is open', async () => {
          fireEvent.mouseEnter(screen.getByTestId('trap-anchor'));
          expect(screen.getByTestId('trap-anchor-button')).toHaveAttribute('aria-controls', 'hovercard-trap');
          await runAllTimers();

          // The popover's visually hidden close button follows the content, so it's the last focusable element.
          const last = screen.getByTestId('dt-sr-only-close-button');
          last.focus();
          fireEvent.keyDown(screen.getByTestId('trap__dialog'), { key: 'Tab' });

          expect(document.activeElement).toBe(screen.getByTestId('trap-first'));
        });

        it('does not wrap Tab when the hovercard is closed', () => {
          const anchorButton = screen.getByTestId('trap-anchor-button');
          anchorButton.focus();
          fireEvent.keyDown(screen.getByTestId('trap__dialog'), { key: 'Tab' });

          expect(document.activeElement).toBe(anchorButton);
        });
      });

      it('closes and restores focus to the anchor on Escape', async () => {
        // Focus the anchor before opening so the directive captures it as previousFocus
        act(() => button.focus());

        fireEvent.mouseEnter(anchor);
        await runAllTimers();

        // Trigger Escape on the portalled popover dialog (dt-lazy-show)
        fireEvent.keyDown(screen.getByTestId('dt-hovercard__dialog'), { key: 'Escape' });
        await flushPromises();

        expect(document.activeElement).toBe(button);
      });
    });
  });
});
