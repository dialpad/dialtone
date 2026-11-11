import { StrictMode, useState, type CSSProperties } from 'react';
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
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  useTooltipDirective(anchor, value, options);
  return <button ref={setAnchor} data-qa={qa} style={style}>{MOCK_ANCHOR_TEXT}</button>;
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

  // A swapped-in element is a new mount, as in Vue: the element left behind loses its tooltip and keeps its id, and the
  // new one gets its own id and a tooltip that starts closed. The child swaps on its own state, which the owner's render
  // doesn't see; the callback ref does.
  it('treats an element a child swaps in as a new mount', async () => {
    function Child ({ setAnchor }: { setAnchor: (element: HTMLElement | null) => void }) {
      const [link, setLink] = useState(false);
      return (
        <>
          {link ? <a ref={setAnchor} data-qa="link" href="#x">Link</a> : <button ref={setAnchor} data-qa="anchor">Button</button>}
          <button data-qa="swap" onClick={() => setLink(value => !value)}>Swap</button>
        </>
      );
    }
    const swap = () => fireEvent.click(qa('swap') as HTMLElement);
    function Owner () {
      const [element, setElement] = useState<HTMLElement | null>(null);
      useTooltipDirective(element, 'Message', { noDelay: true });
      return <Child setAnchor={setElement} />;
    }
    render(<Owner />);
    await flushPromises();
    const button = anchor();
    const buttonId = button.getAttribute('data-dt-tooltip-id');
    expect(buttonId).toBeTruthy();
    mouseEnter(button);
    expect(tooltipContents()).toHaveLength(1);

    swap();
    await flushPromises();
    const link = qa('link') as HTMLElement;
    const linkId = link.getAttribute('data-dt-tooltip-id');
    expect(tooltipContents()).toHaveLength(0);
    expect(linkId).toBeTruthy();
    expect(linkId).not.toBe(buttonId);
    expect(button.getAttribute('data-dt-tooltip-id')).toBe(buttonId);
    mouseEnter(link);
    expect(tooltipContents()[0]!.textContent).toBe('Message');

    swap();
    await flushPromises();
    expect(tooltipContents()).toHaveLength(0);
    expect([buttonId, linkId]).not.toContain(anchor().getAttribute('data-dt-tooltip-id'));
    mouseEnter(anchor());
    expect(tooltipContents()[0]!.textContent).toBe('Message');
  });

  // Vue's `unmounted` removes the tooltip and leaves the id. In Vue the element goes with its directive; here it can
  // outlive the hook, and it keeps the id as it would after a nullish value.
  it('removes the tooltip, and leaves the id, when the hook unmounts and its element stays', async () => {
    function User ({ element }: { element: HTMLElement | null }) {
      useTooltipDirective(element, 'Message', { noDelay: true });
      return null;
    }
    function Parent ({ on }: { on: boolean }) {
      const [element, setElement] = useState<HTMLButtonElement | null>(null);
      return <><button ref={setElement} data-qa="anchor">{MOCK_ANCHOR_TEXT}</button>{on && <User element={element} />}</>;
    }
    const view = render(<Parent on />);
    await flushPromises();
    const id = anchor().getAttribute('data-dt-tooltip-id');
    mouseEnter(anchor());
    expect(tooltipContents()).toHaveLength(1);

    view.rerender(<Parent on={false} />);
    expect(tooltipContents()).toHaveLength(0);
    expect(anchor().getAttribute('data-dt-tooltip-id')).toBe(id);

    view.rerender(<Parent on />);
    await flushPromises();
    mouseEnter(anchor());
    expect(tooltipContents()).toHaveLength(1);
    expect(anchor().getAttribute('data-dt-tooltip-id')).toBe(id);
  });

  // The last hook leaving is Vue's `unmounted`, even when another hook arrives on the element in the same commit.
  it('closes the tooltip when the last hook leaves and another arrives on the element in the same commit', async () => {
    function User ({ element, value }: { element: HTMLElement | null; value: string }) {
      useTooltipDirective(element, value, { noDelay: true });
      return null;
    }
    function Parent ({ which }: { which: string }) {
      const [element, setElement] = useState<HTMLButtonElement | null>(null);
      return (
        <>
          <button ref={setElement} data-qa="anchor">{MOCK_ANCHOR_TEXT}</button>
          <User key={which} element={element} value={which} />
        </>
      );
    }
    const view = render(<Parent which="A" />);
    await flushPromises();
    mouseEnter(anchor());
    expect(tooltipContents()[0]!.textContent).toBe('A');

    view.rerender(<Parent which="B" />);
    await flushPromises();
    expect(tooltipContents()).toHaveLength(0);

    mouseEnter(anchor());
    expect(tooltipContents()[0]!.textContent).toBe('B');
  });

  // In Vue, a directive on a component lands on its root element, which may carry its own: DtSplitButton's start and end
  // put one on their DtButton.
  it('gives two directives on one element one tooltip, with the last value set', async () => {
    function Both () {
      const [element, setElement] = useState<HTMLButtonElement | null>(null);
      useTooltipDirective(element, 'First', { noDelay: true });
      useTooltipDirective(element, 'Second', { noDelay: true });
      return <button ref={setElement} data-qa="anchor">{MOCK_ANCHOR_TEXT}</button>;
    }
    render(<Both />);
    await flushPromises();
    mouseEnter(anchor());

    expect(tooltipContents()).toHaveLength(1);
    expect(tooltipContents()[0]!.textContent).toBe('Second');
  });

  // Vue's directives on one element unmount together. A hook can leave on its own (by unmounting, or for another
  // element), and the element keeps the tooltip of the hooks still on it, with the value set last.
  describe('when one of two hooks on an element leaves it', () => {
    function Other ({ element, value }: { element: HTMLElement | null; value: string }) {
      useTooltipDirective(element, value, { noDelay: true });
      return null;
    }
    function Own ({ other, otherOnOwnElement = true }: { other?: string; otherOnOwnElement?: boolean }) {
      const [element, setElement] = useState<HTMLButtonElement | null>(null);
      const [second, setSecond] = useState<HTMLButtonElement | null>(null);
      useTooltipDirective(element, 'Own', { noDelay: true });
      return (
        <>
          <button ref={setElement} data-qa="anchor">{MOCK_ANCHOR_TEXT}</button>
          <button ref={setSecond} data-qa="second">Second</button>
          {other && <Other element={otherOnOwnElement ? element : second} value={other} />}
        </>
      );
    }
    const renderBoth = async () => {
      const view = render(<Own other="Other" />);
      await flushPromises();
      view.rerender(<Own other="Other, set last" />);
      await flushPromises();
      mouseEnter(anchor());
      expect(tooltipContents()).toHaveLength(1);
      expect(tooltipContents()[0]!.textContent).toBe('Other, set last');
      return view;
    };

    it('keeps the tooltip of the hook that stays when the other unmounts', async () => {
      const view = await renderBoth();

      view.rerender(<Own />);
      await flushPromises();
      mouseEnter(anchor());

      expect(tooltipContents()).toHaveLength(1);
      expect(tooltipContents()[0]!.textContent).toBe('Own');
    });

    it('keeps the tooltip of the hook that stays when the other moves to another element', async () => {
      const view = await renderBoth();

      view.rerender(<Own other="Other, set last" otherOnOwnElement={false} />);
      await flushPromises();
      mouseEnter(anchor());
      mouseEnter(qa('second') as HTMLElement);

      expect(Array.from(tooltipContents(), content => content.textContent)).toEqual(['Own', 'Other, set last']);
    });
  });

  it('logs an error, and leaves the tooltip as it was, when the value becomes one Vue rejects', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { update } = renderAnchor('Hello', { noDelay: true });
    await flushPromises();
    const id = anchor().getAttribute('data-dt-tooltip-id');
    mouseEnter(anchor());
    expect(tooltipContents()[0]!.textContent).toBe('Hello');

    // @ts-expect-error The value's type rejects a number.
    update(42);
    // @ts-expect-error The value's type rejects a number.
    update(42);
    await flushPromises();

    expect(error).toHaveBeenCalledTimes(1);
    expect(tooltipContents()[0]!.textContent).toBe('Hello');
    expect(anchor().getAttribute('data-dt-tooltip-id')).toBe(id);
    update('Hello');
    await flushPromises();
    expect(tooltipContents()[0]!.textContent).toBe('Hello');
    error.mockRestore();
  });

  it('removes the tooltip when the anchor detaches while the owner stays mounted', async () => {
    function Owner ({ show }: { show: boolean }) {
      const [element, setElement] = useState<HTMLButtonElement | null>(null);
      useTooltipDirective(element, 'Message', { noDelay: true });
      return show ? <button ref={setElement} data-qa="anchor">{MOCK_ANCHOR_TEXT}</button> : null;
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

  // Here the element is set before the hooks mount, so StrictMode's extra cleanup and re-run release and hold it.
  it('keeps the value set last when StrictMode re-runs the effects of hooks that mount on a set element', async () => {
    function Users ({ element }: { element: HTMLElement | null }) {
      useTooltipDirective(element, 'First', { noDelay: true });
      useTooltipDirective(element, 'Second', { noDelay: true });
      return null;
    }
    function Parent ({ on }: { on: boolean }) {
      const [element, setElement] = useState<HTMLButtonElement | null>(null);
      return <><button ref={setElement} data-qa="anchor">{MOCK_ANCHOR_TEXT}</button>{on && <Users element={element} />}</>;
    }
    const view = render(<StrictMode><Parent on={false} /></StrictMode>);
    view.rerender(<StrictMode><Parent on /></StrictMode>);
    await flushPromises();
    mouseEnter(anchor());

    expect(tooltipContents()).toHaveLength(1);
    expect(tooltipContents()[0]!.textContent).toBe('Second');
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
