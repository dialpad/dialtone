import { act, cleanup, render, screen, within, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import type { Instance, Placement, ReferenceElement } from 'tippy.js';
import { DtTooltip, type DtTooltipProps } from './Tooltip';
import { TOOLTIP_DELAY_MS, TOOLTIP_DIRECTIONS, TOOLTIP_KIND_MODIFIERS } from './TooltipConstants';

// As in the Vue tests: no delay, and an explicit body rather than the 'body' lookup.
const baseProps: DtTooltipProps = { delay: false, appendTo: document.body };

let mockProps: DtTooltipProps = {};

// The library's hooks are data-qa attributes, and tippy's markup has classes rather than roles (except role="tooltip").
const qa = (name: string) => document.querySelector(`[data-qa="${name}"]`);
const tippyContent = () => document.body.querySelector('.tippy-content');
const tippyRoot = () => document.body.querySelector<HTMLElement>('[data-tippy-root]');
const anchorButton = () => screen.getByRole('button', { name: 'Hover me' });

// tippy keeps its instance on the anchor element.
const tippyInstance = (reference: Element = anchorButton()): Instance => {
  const instance = (reference as ReferenceElement)._tippy;
  if (!instance) throw new Error('The anchor has no tippy instance');
  return instance;
};

// Vue Test Utils' flushPromises: lets tippy's popper finish its promise-based first update.
const flushPromises = () => act(() => new Promise<void>(resolve => { setTimeout(resolve, 0); }));

const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

beforeAll(() => {
  // RequestAnimationFrame and cancelAnimationFrame are mocked as in the Vue tests, so tippy's sticky loop never runs.
  globalThis.requestAnimationFrame = vi.fn();
  globalThis.cancelAnimationFrame = vi.fn();
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  globalThis.requestAnimationFrame = originalRequestAnimationFrame;
  globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
});

describe('DtTooltip tests', () => {
  let result: RenderResult;
  let user: UserEvent;

  const tooltip = (props: DtTooltipProps) => (
    <DtTooltip {...baseProps} anchor={<button data-qa="dt-button">Hover me</button>} {...props}>Test message</DtTooltip>
  );
  const updateWrapper = () => {
    result = render(tooltip(mockProps));
  };
  // Vue's wrapper.setProps: re-render with the props merged in.
  const setProps = (props: DtTooltipProps) => {
    mockProps = { ...mockProps, ...props };
    result.rerender(tooltip(mockProps));
  };

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('when tooltip is open', () => {
      beforeEach(() => {
        mockProps = { open: true };

        updateWrapper();
      });

      it('should render the component', () => {
        expect(result.container).not.toBeEmptyDOMElement();
      });

      it('should render the container', () => {
        expect(qa('dt-tooltip-container')).toBeInTheDocument();
      });

      it('should render the tooltip', () => {
        expect(within(screen.getByRole('tooltip')).getByText('Test message')).toHaveAttribute('data-qa', 'dt-tooltip');
      });

      it('should render the anchor', () => {
        expect(qa('dt-tooltip-anchor')).toHaveTextContent(/^Hover me$/);
      });

      it('should render the message', () => {
        expect(screen.getByRole('tooltip')).toHaveTextContent(/^Test message$/);
      });

      it('should render an arrow by default', () => {
        expect(screen.getByRole('tooltip').querySelector('.tippy-svg-arrow')).not.toBeNull();
      });

      it('should not render an arrow initially when showArrow is false', () => {
        result.unmount();
        mockProps = { open: true, showArrow: false };
        updateWrapper();

        expect(screen.getByRole('tooltip').querySelector('.tippy-arrow, .tippy-svg-arrow')).toBeNull();
      });

      it('should remove the arrow when showArrow changes to false', () => {
        setProps({ showArrow: false });

        expect(screen.getByRole('tooltip').querySelector('.tippy-svg-arrow')).toBeNull();
      });

      it('should restore the arrow when showArrow changes to true', () => {
        result.unmount();
        mockProps = { open: true, showArrow: false };
        updateWrapper();

        setProps({ showArrow: true });

        expect(screen.getByRole('tooltip').querySelector('.tippy-svg-arrow')).not.toBeNull();
      });

      describe('When tooltip content is a space character', () => {
        it('should not render the content', () => {
          result.unmount();
          mockProps = { open: true, message: ' ' };
          updateWrapper();
          expect(tippyContent()).not.toHaveAttribute('data-state', 'visible');
        });
      });

      describe('When inverted is true', () => {
        it('should have the inverted class set', () => {
          setProps({ open: true, inverted: true });
          expect(qa('dt-tooltip')).toHaveClass(TOOLTIP_KIND_MODIFIERS.inverted);
        });
      });

      describe('When contentMode is set', () => {
        it('should set data-dt-mode on tooltip content', () => {
          setProps({ open: true, contentMode: 'dark' });

          expect(qa('dt-tooltip')).toHaveAttribute('data-dt-mode', 'dark');
        });

        it('should invert root mode when contentMode is invert', () => {
          document.documentElement.setAttribute('data-dt-mode', 'light');
          setProps({ open: true, contentMode: 'invert' });

          expect(qa('dt-tooltip')).toHaveAttribute('data-dt-mode', 'dark');

          document.documentElement.removeAttribute('data-dt-mode');
        });
      });

      it.each(TOOLTIP_DIRECTIONS)('when placement is %s should have correct data-placement attribute', async (placement) => {
        result.unmount();
        mockProps = { open: true, placement, fallbackPlacements: [] };
        updateWrapper();

        await flushPromises();

        expect(screen.getByRole('tooltip')).toHaveAttribute('data-placement', placement);
      });

      describe('When offset or fallbackPlacements are mutated in place', () => {
        it('should pass the mutated offset to the tippy instance', async () => {
          result.unmount();
          const offset: [number, number] = [0, 12];
          mockProps = { open: true, offset };
          updateWrapper();
          await flushPromises();

          const setPropsSpy = vi.spyOn(tippyInstance(), 'setProps');
          offset[1] = 20;
          // The next render carries the same, mutated array.
          setProps({});

          expect(setPropsSpy).toHaveBeenCalledWith(expect.objectContaining({
            offset: [0, 20],
          }));
        });

        it('should pass the mutated fallbackPlacements to the tippy instance', async () => {
          result.unmount();
          const fallbackPlacements: Placement[] = ['auto'];
          mockProps = { open: true, fallbackPlacements };
          updateWrapper();
          await flushPromises();

          const setPropsSpy = vi.spyOn(tippyInstance(), 'setProps');
          fallbackPlacements.push('bottom');
          setProps({});

          const { popperOptions } = setPropsSpy.mock.calls[0][0];
          const flipModifier = popperOptions?.modifiers?.find(modifier => modifier.name === 'flip');

          expect(flipModifier?.options?.fallbackPlacements).toEqual(['auto', 'bottom']);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When open prop is true', () => {
      it('should display tooltip', async () => {
        mockProps = { open: true };
        updateWrapper();
        await flushPromises();

        expect(tippyContent()).toHaveAttribute('data-state', 'visible');
      });
    });

    describe('When open prop is false', () => {
      it('should not display tooltip', () => {
        mockProps = { open: true };
        updateWrapper();
        const content = tippyContent();
        setProps({ open: false });

        expect(content).not.toHaveAttribute('data-state', 'visible');
      });
    });

    describe('When open prop is unset (default behaviour)', () => {
      beforeEach(() => {
        mockProps = { open: null };
        updateWrapper();
      });

      describe('When mouseenter tooltip', () => {
        it('should display tooltip', async () => {
          await user.hover(anchorButton());
          await flushPromises();

          expect(tippyContent()).toHaveAttribute('data-state', 'visible');
        });
      });

      describe('When mouseleave tooltip', () => {
        it('should hide tooltip', async () => {
          await user.hover(anchorButton());
          await user.unhover(anchorButton());
          await flushPromises();

          expect(tippyContent()).not.toHaveAttribute('data-state', 'visible');
        });
      });

      describe('When focusout tooltip', () => {
        it('should display tooltip', async () => {
          await user.hover(anchorButton());
          // Focus moves to the anchor, then out of it.
          await user.tab();
          await user.tab();
          await flushPromises();

          expect(anchorButton()).not.toHaveFocus();
          expect(tippyContent()).not.toHaveAttribute('data-state', 'visible');
        });
      });
    });

    describe('When enabled prop is false', () => {
      describe('When mouseenter on anchor', () => {
        it('should not display tooltip', async () => {
          mockProps = { enabled: false };
          updateWrapper();

          await user.hover(anchorButton());
          await flushPromises();

          expect(tippyContent()).toBeNull();
        });
      });
    });

    describe('Z-index behavior with modals', () => {
      afterEach(() => {
        // Clean up any modal elements added during tests
        const modals = document.querySelectorAll('.d-modal, .d-modal--transparent');
        modals.forEach(modal => modal.remove());
      });

      it('should have higher z-index when modal is present', async () => {
        // Create a mock modal element in the DOM
        const modalElement = document.createElement('div');
        modalElement.className = 'd-modal';
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.appendChild(modalElement);

        mockProps = { open: true };
        updateWrapper();
        await flushPromises();

        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        // Modal z-index is 600, modal-element is 650, so tooltip should be 651
        expect(tippyRoot()).toHaveStyle({ zIndex: '651' });
        expect(Number(tippyRoot()?.style.zIndex)).toBeGreaterThan(650); // Greater than modal-element z-index
      });

      it('should have higher z-index when transparent modal is present', async () => {
        // Create a mock transparent modal element in the DOM
        const modalElement = document.createElement('div');
        modalElement.className = 'd-modal--transparent';
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.appendChild(modalElement);

        mockProps = { open: true };
        updateWrapper();
        await flushPromises();

        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        expect(tippyRoot()).toHaveStyle({ zIndex: '651' });
        expect(Number(tippyRoot()?.style.zIndex)).toBeGreaterThan(650); // Greater than modal-element z-index
      });

      it('should have higher z-index when native dialog modal is open', async () => {
        // Create a mock native dialog modal with [open] attribute
        const modalElement = document.createElement('dialog');
        modalElement.className = 'd-modal';
        modalElement.setAttribute('open', '');
        document.body.appendChild(modalElement);

        mockProps = { open: true };
        updateWrapper();
        await flushPromises();

        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        expect(tippyRoot()).toHaveStyle({ zIndex: '651' });
        expect(Number(tippyRoot()?.style.zIndex)).toBeGreaterThan(650); // Greater than modal-element z-index
      });

      it('should have default z-index when no modal is present', async () => {
        mockProps = { open: true };
        updateWrapper();
        await flushPromises();

        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        // Default tooltip z-index should be 400
        expect(tippyRoot()).toHaveStyle({ zIndex: '400' });
      });
    });
  });

  describe('appendTo behavior', () => {
    describe('when anchor is inside a <dialog> element and appendTo is "body"', () => {
      it('should append the tooltip to the dialog element, not body', async () => {
        const dialogEl = document.createElement('dialog');
        document.body.appendChild(dialogEl);

        const localWrapper = render(tooltip({ delay: false, appendTo: 'body', open: true }), {
          container: dialogEl.appendChild(document.createElement('div')),
        });

        await flushPromises();

        const tippyBoxInDialog = dialogEl.querySelector('.tippy-box');
        expect(tippyBoxInDialog).not.toBeNull();

        localWrapper.unmount();
        document.body.removeChild(dialogEl);
      });
    });

    describe('when anchor is NOT inside a <dialog> element', () => {
      it('should append the tooltip to body', async () => {
        mockProps = { open: true };
        updateWrapper();
        await flushPromises();

        expect(tippyRoot()?.parentElement).toBe(document.body);
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    describe('when anchor is inside a <dialog> but appendTo is explicitly set to an HTMLElement', () => {
      it('should use the explicit appendTo target, bypassing dialog detection', async () => {
        const dialogEl = document.createElement('dialog');
        const explicitTarget = document.createElement('div');
        document.body.appendChild(dialogEl);
        document.body.appendChild(explicitTarget);

        const localWrapper = render(tooltip({ delay: false, appendTo: explicitTarget, open: true }), {
          container: dialogEl.appendChild(document.createElement('div')),
        });

        await flushPromises();

        expect(explicitTarget.querySelector('.tippy-box')).not.toBeNull();
        expect(dialogEl.querySelector('.tippy-box')).toBeNull();

        localWrapper.unmount();
        document.body.removeChild(dialogEl);
        document.body.removeChild(explicitTarget);
      });
    });
  });
});

// Behaviour the Vue suite doesn't cover. Each expectation was checked against dialtone-vue's DtTooltip in jsdom, except
// the text anchor: jsdom has no innerText, so there Vue keeps the text and appends an empty <span> as the anchor.
describe('DtTooltip React port', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  // Real timers: Testing Library's async wrapper (which user-event goes through) waits on a setTimeout that Vitest's
  // fake timers never run.
  it('shows on hover only once the delay has passed', async () => {
    render(<DtTooltip anchor={<button>Hover me</button>} message="Tip" appendTo={document.body} />);

    await user.hover(anchorButton());
    expect(tippyRoot()).toBeNull();

    await act(() => new Promise<void>(resolve => { setTimeout(resolve, TOOLTIP_DELAY_MS); }));
    await flushPromises();
    expect(tippyContent()).toHaveAttribute('data-state', 'visible');
  });

  it('calls onShown and onOpenChange where Vue emits shown and update:open', () => {
    const onShown = vi.fn();
    const onOpenChange = vi.fn();
    const ui = (open: boolean) => (
      <DtTooltip anchor={<button>Hover me</button>} message="Tip" delay={false} transition={false} appendTo={document.body}
        open={open} onShown={onShown} onOpenChange={onOpenChange} />
    );
    const { rerender } = render(ui(false));

    rerender(ui(true));
    expect(onShown.mock.calls).toEqual([[true]]);
    expect(onOpenChange.mock.calls).toEqual([[true]]);

    rerender(ui(false));
    expect(onShown.mock.calls).toEqual([[true], [false]]);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    expect(tippyRoot()).toBeNull();
  });

  it('calls only onShown when hovered without open', async () => {
    const onShown = vi.fn();
    const onOpenChange = vi.fn();
    render(<DtTooltip anchor={<button>Hover me</button>} message="Tip" delay={false} transition={false}
      appendTo={document.body} onShown={onShown} onOpenChange={onOpenChange} />);

    await user.hover(anchorButton());
    await user.unhover(anchorButton());

    expect(onShown.mock.calls).toEqual([[true], [false]]);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('reports the tooltip hidden when it unmounts while shown', async () => {
    const onShown = vi.fn();
    const onOpenChange = vi.fn();
    const { unmount } = render(<DtTooltip anchor={<button>Hover me</button>} message="Tip" appendTo={document.body}
      open onShown={onShown} onOpenChange={onOpenChange} />);
    await flushPromises();
    // With a transition, tippy reports shown when its transitionend fires, which jsdom never dispatches.
    expect(onShown).not.toHaveBeenCalled();

    unmount();

    expect(onShown.mock.calls).toEqual([[false]]);
    expect(onOpenChange.mock.calls).toEqual([[false]]);
    expect(tippyRoot()).toBeNull();
  });

  it('hides on Escape from within the anchor', async () => {
    render(<DtTooltip anchor={<button>Hover me</button>} message="Tip" delay={false} appendTo={document.body} />);
    await user.click(anchorButton());
    await flushPromises();
    expect(tippyContent()).toHaveAttribute('data-state', 'visible');

    await user.keyboard('{Escape}');

    expect(tippyContent()).toHaveAttribute('data-state', 'hidden');
  });

  it('does not show a blank message opened after mount', async () => {
    const ui = (open: boolean) => <DtTooltip anchor={<button>Hover me</button>} message=" " appendTo={document.body} open={open} />;
    const { rerender } = render(ui(false));

    rerender(ui(true));
    await flushPromises();

    expect(tippyRoot()).toBeNull();
  });

  it('wraps a text anchor in a span for tippy, as Vue does in a browser', () => {
    render(<DtTooltip anchor="Hover me" message="Tip" appendTo={document.body} />);

    expect(qa('dt-tooltip-anchor')?.innerHTML).toBe('<span>Hover me</span>');
    // The span holding the text is the element tippy attaches to.
    expect(screen.getByText('Hover me')).toHaveProperty('_tippy');
  });

  it('follows an external anchor element until it unmounts', async () => {
    const external = document.body.appendChild(document.createElement('button'));
    external.textContent = 'External';
    const { container, unmount } = render(<DtTooltip externalAnchorElement={external} message="Tip" delay={false}
      appendTo={document.body} />);
    expect(container.innerHTML).toBe('<div data-qa="dt-tooltip-container"></div>');

    await user.hover(external);
    await flushPromises();
    expect(tippyContent()).toHaveAttribute('data-state', 'visible');

    await user.unhover(external);
    expect(tippyContent()).toHaveAttribute('data-state', 'hidden');

    unmount();
    await user.hover(external);
    expect(tippyRoot()).toBeNull();
    expect((external as ReferenceElement)._tippy).toBeUndefined();
    external.remove();
  });
});
