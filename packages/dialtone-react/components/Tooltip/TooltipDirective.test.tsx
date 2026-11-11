import { StrictMode, useRef, type CSSProperties } from 'react';
import { act, cleanup, fireEvent, render, type RenderResult } from '@testing-library/react';
import type { ReferenceElement } from 'tippy.js';
import {
  useTooltipDirective,
  type DtTooltipDirectiveOptions,
  type DtTooltipDirectiveValue,
} from './TooltipDirective';
import { TOOLTIP_DELAY_MS, TOOLTIP_KIND_MODIFIERS, type TooltipDirection } from './TooltipConstants';
import type { DtTooltipProps } from './Tooltip';

const MOCK_TOOLTIP_TEXT = 'Tooltip text content';
const MOCK_ANCHOR_TEXT = 'Button placeholder';
const MOCK_TOOLTIP_PROPS: DtTooltipProps = {
  placement: 'bottom-start',
  delay: false,
  message: MOCK_TOOLTIP_TEXT,
  showArrow: false,
};

// The hook is the directive: one anchor per directive use, as in the Vue test's wrapper. Vue's `no delay in tests`
// (NODE_ENV === 'test') isn't ported, so a string value takes the `noDelay` option where Vue's test relied on it.
interface AnchorProps {
  qa: string;
  value: DtTooltipDirectiveValue;
  options?: DtTooltipDirectiveOptions;
  style?: CSSProperties;
}

function Anchor ({ qa, value, options, style }: AnchorProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useTooltipDirective(ref, value, options);
  return <button ref={ref} data-qa={qa} style={style}>{MOCK_ANCHOR_TEXT}</button>;
}

interface WrapperProps {
  placement?: TooltipDirection;
  tooltipText?: string | null;
}

function WrapperComponent ({ placement = 'top', tooltipText = 'foo' }: WrapperProps) {
  return (
    <div>
      <Anchor qa="dt-tooltip-placement" value={MOCK_TOOLTIP_TEXT} options={{ placement, noDelay: true }} />
      <Anchor qa="dt-tooltip-object" value={MOCK_TOOLTIP_PROPS} />
      <Anchor qa="dt-tooltip-changing" value={tooltipText} options={{ placement, noDelay: true }} />
      <Anchor qa="dt-tooltip-mode" value={MOCK_TOOLTIP_TEXT} options={{ contentMode: 'invert', noDelay: true }} />
    </div>
  );
}

const baseProps: WrapperProps = {};

let mockProps: WrapperProps = {};

const qa = (name: string) => document.querySelector(`[data-qa="${name}"]`);
const mouseEnter = (element: HTMLElement) => fireEvent.mouseEnter(element);
const tooltipContents = () => document.body.querySelectorAll('[data-qa="dt-tooltip"]');

// tippy keeps its instance on the anchor element.
const tippyPopper = (reference: Element) => {
  const instance = (reference as ReferenceElement)._tippy;
  if (!instance) throw new Error('The anchor has no tippy instance');
  return instance.popper;
};

const tippyProps = (reference: Element) => (reference as ReferenceElement)._tippy!.props;

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

describe('DtTooltipDirective Tests', () => {
  let result: RenderResult;
  let anchorButtonPlacement: HTMLElement;
  let anchorButtonObject: HTMLElement;
  let anchorButtonChanging: HTMLElement;

  const updateWrapper = () => {
    result = render(<WrapperComponent {...baseProps} {...mockProps} />);

    anchorButtonPlacement = result.container.querySelector<HTMLElement>('[data-qa="dt-tooltip-placement"]')!;
    anchorButtonObject = result.container.querySelector<HTMLElement>('[data-qa="dt-tooltip-object"]')!;
    anchorButtonChanging = result.container.querySelector<HTMLElement>('[data-qa="dt-tooltip-changing"]')!;
  };
  // Vue's wrapper.setProps / setData: re-render with the props merged in.
  const setProps = (props: WrapperProps) => {
    mockProps = { ...mockProps, ...props };
    result.rerender(<WrapperComponent {...baseProps} {...mockProps} />);
  };
  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('when tooltip with placement modifier is open', () => {
      beforeEach(async () => {
        updateWrapper();
        await flushPromises();
        mouseEnter(anchorButtonPlacement);
      });

      it('should render the component', () => {
        expect(result.container).not.toBeEmptyDOMElement();
      });

      it('should render the tooltip', () => {
        expect(tooltipContents().length).toBe(1);
      });

      it('should render the anchor', () => {
        expect(anchorButtonPlacement).toHaveTextContent(new RegExp(`^${MOCK_ANCHOR_TEXT}$`));
      });

      it('should render the message', () => {
        expect(tooltipContents()[0]!.textContent!.trim()).toBe(MOCK_TOOLTIP_TEXT);
      });
    });

    describe('when tooltip with object argument is open', () => {
      beforeEach(async () => {
        updateWrapper();
        await flushPromises();
        mouseEnter(anchorButtonObject);
      });

      it('should render the component', () => {
        expect(result.container).not.toBeEmptyDOMElement();
      });

      it('should render the tooltip', () => {
        expect(tooltipContents().length).toBe(1);
      });

      it('should render the anchor', () => {
        expect(anchorButtonObject).toHaveTextContent(new RegExp(`^${MOCK_ANCHOR_TEXT}$`));
      });

      it('should render the message', () => {
        expect(tooltipContents()[0]!.textContent!.trim()).toBe(MOCK_TOOLTIP_TEXT);
      });

      it('should pass component props through object syntax', () => {
        expect(tippyPopper(anchorButtonObject).querySelector('.tippy-svg-arrow')).toBeNull();
      });
    });

    describe('when tooltip with mode modifier is open', () => {
      beforeEach(async () => {
        document.documentElement.setAttribute('data-dt-mode', 'light');
        updateWrapper();
        await flushPromises();
        mouseEnter(qa('dt-tooltip-mode') as HTMLElement);
      });

      afterEach(() => {
        document.documentElement.removeAttribute('data-dt-mode');
      });

      it('should set data-dt-mode on the tooltip content', () => {
        const modeTooltip = Array.from(tooltipContents()).find(t => t.getAttribute('data-dt-mode'));
        expect(modeTooltip!.getAttribute('data-dt-mode')).toBe('dark');
      });
    });

    describe('when tooltip with dynamic argument is open', () => {
      beforeEach(async () => {
        updateWrapper();
        await flushPromises();
        mouseEnter(anchorButtonChanging);
      });

      it('should update the message when the argument updates', () => {
        expect(tooltipContents()[0]!.textContent!.trim()).toBe('foo');
        setProps({ tooltipText: 'bar' });
        expect(tooltipContents()[0]!.textContent!.trim()).toBe('bar');
      });

      it('should remove the tooltip when the argument becomes nullish', () => {
        expect(tooltipContents()[0]!.textContent!.trim()).toBe('foo');
        setProps({ tooltipText: null });
        expect(qa('dt-tooltip')).toBeNull();
      });
    });
  });
});

describe('useTooltipDirective', () => {
  const renderAnchor = (value: DtTooltipDirectiveValue, options?: DtTooltipDirectiveOptions) => {
    const ui = (next: DtTooltipDirectiveValue, nextOptions?: DtTooltipDirectiveOptions) => (
      <Anchor qa="anchor" value={next} options={nextOptions} />
    );
    const view = render(ui(value, options));
    const update = (next: DtTooltipDirectiveValue, nextOptions = options) => view.rerender(ui(next, nextOptions));
    return { ...view, update };
  };
  const anchor = () => qa('anchor') as HTMLElement;

  it('leaves the anchor in place, with no wrapper, and gives it a data-dt-tooltip-id', () => {
    const { container } = renderAnchor('Message');

    expect(container.firstElementChild).toBe(anchor());
    expect(anchor().parentElement).toBe(container);
    expect(anchor().getAttribute('data-dt-tooltip-id')).toBeTruthy();
  });

  it('keeps the same data-dt-tooltip-id across updates', () => {
    const { update } = renderAnchor('Message');
    const id = anchor().getAttribute('data-dt-tooltip-id');

    update('Another message');
    update(null);
    update('Message again');

    expect(anchor().getAttribute('data-dt-tooltip-id')).toBe(id);
  });

  it('gives each anchor its own data-dt-tooltip-id', () => {
    render(<><Anchor qa="first" value="One" /><Anchor qa="second" value="Two" /></>);

    expect(qa('first')!.getAttribute('data-dt-tooltip-id')).not.toBe(qa('second')!.getAttribute('data-dt-tooltip-id'));
  });

  it('gives the anchor an id that no other hook instance has, across roots', () => {
    const first = render(<Anchor qa="first" value="One" />);
    const second = render(<Anchor qa="second" value="Two" />);

    expect(qa('first')!.getAttribute('data-dt-tooltip-id')).not.toBe(qa('second')!.getAttribute('data-dt-tooltip-id'));
    first.unmount();
    second.unmount();
  });

  it('applies a mutated offset array', async () => {
    const offset: [number, number] = [0, 8];
    const { update } = renderAnchor({ message: 'Message', delay: false, offset });
    await flushPromises();
    mouseEnter(anchor());
    expect(tippyProps(anchor()).offset).toEqual([0, 8]);

    offset[1] = 20;
    update({ message: 'Message', delay: false, offset });
    await flushPromises();

    expect(tippyProps(anchor()).offset).toEqual([0, 20]);
  });

  it('removes the tooltip when the anchor detaches while the owner stays mounted', async () => {
    function Owner ({ show }: { show: boolean }) {
      const ref = useRef<HTMLButtonElement>(null);
      useTooltipDirective(ref, 'Message', { noDelay: true });
      return show ? <button ref={ref} data-qa="anchor">{MOCK_ANCHOR_TEXT}</button> : null;
    }
    const view = render(<Owner show />);
    await flushPromises();
    mouseEnter(anchor());
    expect(tooltipContents()).toHaveLength(1);

    view.rerender(<Owner show={false} />);
    expect(tooltipContents()).toHaveLength(0);

    view.rerender(<Owner show />);
    await flushPromises();
    mouseEnter(anchor());
    expect(tooltipContents()).toHaveLength(1);
  });

  it('renders every tooltip in one container appended to document.body', async () => {
    const options = { noDelay: true };
    render(<><Anchor qa="first" value="One" options={options} /><Anchor qa="second" value="Two" options={options} /></>);
    await flushPromises();
    mouseEnter(qa('first') as HTMLElement);
    mouseEnter(qa('second') as HTMLElement);

    const containers = document.body.querySelectorAll('[data-qa="dt-tooltip-container"]');
    expect(containers).toHaveLength(2);
    expect(containers[0]!.parentElement).toBe(containers[1]!.parentElement);
    expect(containers[0]!.parentElement!.parentElement!.parentElement).toBe(document.body);
    expect(tooltipContents()).toHaveLength(2);
  });

  it('removes the tooltip when the anchor unmounts', async () => {
    const { unmount } = renderAnchor('Message', { noDelay: true });
    await flushPromises();
    mouseEnter(anchor());
    expect(tooltipContents()).toHaveLength(1);

    unmount();

    expect(tooltipContents()).toHaveLength(0);
    expect(document.body.querySelectorAll('[data-qa="dt-tooltip-container"]')).toHaveLength(0);
  });

  it('shows the tooltip again after the value goes from nullish to a message', async () => {
    const { update } = renderAnchor(undefined, { noDelay: true });
    await flushPromises();
    mouseEnter(anchor());
    expect(tooltipContents()).toHaveLength(0);

    update('Back');
    await flushPromises();
    mouseEnter(anchor());

    expect(tooltipContents()[0]!.textContent).toBe('Back');
  });

  it('works in StrictMode', async () => {
    render(<StrictMode><Anchor qa="anchor" value="Message" options={{ noDelay: true }} /></StrictMode>);
    await flushPromises();
    mouseEnter(anchor());

    expect(tooltipContents()).toHaveLength(1);
  });

  it('places the tooltip on top by default', async () => {
    renderAnchor('Message', { noDelay: true });
    await flushPromises();
    mouseEnter(anchor());

    expect(tippyProps(anchor()).placement).toBe('top');
  });

  it('takes the placement option, over the placement of an object value', async () => {
    renderAnchor({ message: 'Message', placement: 'left', delay: false }, { placement: 'bottom-end' });
    await flushPromises();
    mouseEnter(anchor());

    expect(tippyProps(anchor()).placement).toBe('bottom-end');
  });

  it('takes the placement of an object value when there is no placement option', async () => {
    renderAnchor({ message: 'Message', placement: 'left', delay: false });
    await flushPromises();
    mouseEnter(anchor());

    expect(tippyProps(anchor()).placement).toBe('left');
  });

  it('applies the inverted option', async () => {
    renderAnchor('Message', { inverted: true, noDelay: true });
    await flushPromises();
    mouseEnter(anchor());

    expect(qa('dt-tooltip')).toHaveClass(TOOLTIP_KIND_MODIFIERS.inverted);
  });

  it('applies the noTransition option', async () => {
    renderAnchor('Message', { noTransition: true, noDelay: true });
    await flushPromises();
    mouseEnter(anchor());

    expect(tippyProps(anchor()).animation).toBe(false);
  });

  it('is sticky by default, and takes the sticky prop of an object value', async () => {
    const { update } = renderAnchor('Message', { noDelay: true });
    await flushPromises();
    mouseEnter(anchor());
    expect(tippyProps(anchor()).sticky).toBe(true);

    update({ message: 'Message', sticky: 'reference' });

    expect(tippyProps(anchor()).sticky).toBe('reference');
  });

  describe('delay', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('waits for the delay by default', () => {
      renderAnchor('Message');
      act(() => { vi.advanceTimersByTime(0); });
      mouseEnter(anchor());
      expect(tooltipContents()).toHaveLength(0);

      act(() => { vi.advanceTimersByTime(TOOLTIP_DELAY_MS); });

      expect(tooltipContents()).toHaveLength(1);
    });

    it('does not wait with delay: false in an object value', () => {
      renderAnchor({ message: 'Message', delay: false });
      act(() => { vi.advanceTimersByTime(0); });
      mouseEnter(anchor());

      expect(tooltipContents()).toHaveLength(1);
    });
  });

  it('logs an error, and renders no tooltip, for a value that is not a string, an object, null or undefined', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    // @ts-expect-error The value's type rejects a number.
    renderAnchor(42);

    expect(error).toHaveBeenCalledWith('DtTooltipDirective: binding value must be string, object, null or undefined');
    expect(anchor()).not.toHaveAttribute('data-dt-tooltip-id');
    error.mockRestore();
  });
});
