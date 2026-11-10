import { act, StrictMode, createRef, type ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { DtTransition, type DtTransitionProps } from './DtTransition';
import { SCENARIOS, run, type Scenario } from '../../parity/transition-scenarios.mjs';
import vueTraces from '../../parity/transition-traces.json';
import { FAKE_TIMERS, settle } from '../../parity/settle.mjs';
import { finishTransitions } from '../../tests/helpers/transition';

type Trace = [string, string][];

const styleObject = (css: string) => Object.fromEntries(css.split(';').map(d => d.trim()).filter(Boolean)
  .map((d) => {
    const i = d.indexOf(':');
    return [d.slice(0, i).trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()), d.slice(i + 1).trim()];
  }));

// The same scenarios through DtTransition: the React side of parity/vue/transition-traces.test.js.
async function reactTrace (scenario: Scenario): Promise<Trace> {
  let rerender: (ui: ReactElement) => void = () => {};
  let unmount = () => {};
  let props: Partial<DtTransitionProps> = {};
  let style = {};
  let vIf = false;
  const ui = (show: boolean) => (
    <DtTransition {...props} show={show} unmountOnLeave={vIf}>
      <div data-qa="x" className="base" style={style} />
    </DtTransition>
  );
  return run({
    async mount (p: Partial<DtTransitionProps>, show: boolean, css: string, v: boolean) {
      props = p;
      style = styleObject(css);
      vIf = v;
      await act(async () => { ({ rerender, unmount } = render(ui(show))); });
    },
    async set (show: boolean) { await act(async () => { rerender(ui(show)); }); },
    async advance (ms: number) { await act(async () => { vi.advanceTimersByTime(ms); }); },
    async fire (el: Element | null, type: string) { await act(async () => { el?.dispatchEvent(new Event(type)); }); },
    async unmount () { unmount(); },
  }, scenario);
}

describe('DtTransition', () => {
  beforeEach(() => { vi.useFakeTimers(FAKE_TIMERS as Parameters<typeof vi.useFakeTimers>[0]); });
  afterEach(() => { vi.useRealTimers(); });

  describe('matches Vue\'s <Transition>', () => {
    for (const [name, scenario] of Object.entries(SCENARIOS)) {
      it(name, async () => {
        const vue = (vueTraces as unknown as Record<string, Trace>)[name];
        const expected = vue.map(([step, state]): [string, string] => {
          // The one known difference: Vue calls onBeforeEnter before it inserts a v-if or appearing element; React
          // has inserted it by the time an effect can run.
          const inserting = scenario.vif || (scenario.initial && scenario.props.appear);
          return step === 'hook:BeforeEnter' && inserting ? [step, state.replace(/\|false$/, '|true')] : [step, state];
        });
        expect(await reactTrace(scenario)).toEqual(expected);
      });
    }
  });

  it('keeps the transition classes through a re-render mid-transition', async () => {
    const ui = (className: string) => (
      <DtTransition show name="fade" appear><div data-qa="x" className={className} /></DtTransition>
    );
    const { rerender } = render(ui('one'));
    rerender(ui('two'));
    expect(screen.getByTestId('x')).toHaveClass('two', 'fade-enter-from', 'fade-enter-active');
    await finishTransitions();
    expect(screen.getByTestId('x').className).toBe('two');
  });

  it('runs appear once under StrictMode', async () => {
    const onAfterEnter = vi.fn();
    render(
      <StrictMode>
        <DtTransition show name="pop" appear onAfterEnter={onAfterEnter}><div data-qa="x" /></DtTransition>
      </StrictMode>,
    );
    expect(screen.getByTestId('x')).toHaveClass('pop-enter-from', 'pop-enter-active');
    await finishTransitions();
    expect(screen.getByTestId('x').className).toBe('');
    expect(onAfterEnter).toHaveBeenCalledOnce();
  });

  it('passes the element to the child\'s ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DtTransition show><div data-qa="x" ref={ref} /></DtTransition>);
    expect(ref.current).toBe(screen.getByTestId('x'));
  });

  it('keeps a child ref\'s React 19 cleanup: it runs on unmount, and the ref is never called with null', () => {
    const cleanup = vi.fn();
    const nodes: (HTMLDivElement | null)[] = [];
    const ref = (node: HTMLDivElement | null) => { nodes.push(node); return cleanup; };
    render(<DtTransition show><div ref={ref} /></DtTransition>).unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(nodes).toEqual([expect.any(HTMLDivElement)]);
  });

  it('moves to a new child ref on re-render: the old ref\'s cleanup runs once, then the new ref attaches', () => {
    const first = vi.fn();
    const second = vi.fn();
    const nodes: (HTMLDivElement | null)[] = [];
    const refA = (node: HTMLDivElement | null) => { nodes.push(node); return first; };
    const refB = (node: HTMLDivElement | null) => { nodes.push(node); return second; };
    const { rerender, unmount } = render(<DtTransition show><div ref={refA} /></DtTransition>);
    rerender(<DtTransition show><div ref={refB} /></DtTransition>);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
    unmount();
    expect(second).toHaveBeenCalledTimes(1);
    expect(nodes).toEqual([expect.any(HTMLDivElement), expect.any(HTMLDivElement)]);
  });

  it('resets a child ref without a cleanup on unmount', () => {
    const object = createRef<HTMLDivElement>();
    render(<DtTransition show><div ref={object} /></DtTransition>).unmount();
    expect(object.current).toBeNull();
    const nodes: (HTMLDivElement | null)[] = [];
    render(<DtTransition show><div ref={(node) => { nodes.push(node); }} /></DtTransition>).unmount();
    expect(nodes).toEqual([expect.any(HTMLDivElement), null]);
  });

  it('restores the child\'s own display when shown again', async () => {
    const ui = (show: boolean) => (
      <DtTransition show={show} name="fade"><div data-qa="x" style={{ display: 'flex' }} /></DtTransition>
    );
    const { rerender } = render(ui(true));
    rerender(ui(false));
    await finishTransitions();
    expect(screen.getByTestId('x')).toHaveStyle({ display: 'none' });
    rerender(ui(true));
    expect(screen.getByTestId('x')).toHaveStyle({ display: 'flex' });
  });

  it('stops without calling hooks when unmounted mid-transition', async () => {
    const onAfterLeave = vi.fn();
    const onLeaveCancelled = vi.fn();
    const ui = (show: boolean) => (
      <DtTransition show={show} name="fade" onAfterLeave={onAfterLeave} onLeaveCancelled={onLeaveCancelled}>
        <div data-qa="x" />
      </DtTransition>
    );
    const { rerender, unmount } = render(ui(true));
    rerender(ui(false));
    unmount();
    await finishTransitions();
    expect(onAfterLeave).not.toHaveBeenCalled();
    expect(onLeaveCancelled).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('settles under the parity harness, which fires transitionend', async () => {
    // A browser would report the inline duration; jsdom doesn't, so read it from the style as the harness does.
    const computed = vi.spyOn(window, 'getComputedStyle').mockImplementation(el => (el as HTMLElement).style);
    const onAfterLeave = vi.fn();
    const ui = (show: boolean) => (
      <DtTransition show={show} name="fade" onAfterLeave={onAfterLeave}>
        <div data-qa="x" style={{ transitionDuration: '20s' }} />
      </DtTransition>
    );
    const { rerender } = render(ui(true));
    rerender(ui(false));
    await settle((ms: number) => act(async () => { vi.advanceTimersByTime(ms); }));
    // 20s is past the harness's two 10s advances, so only its transitionend can have ended the leave.
    expect(onAfterLeave).toHaveBeenCalledOnce();
    expect(screen.getByTestId('x').className).toBe('');
    expect(screen.getByTestId('x')).toHaveStyle({ display: 'none' });
    computed.mockRestore();
  });

  it('finishTransitions works with real timers', async () => {
    vi.useRealTimers();
    const ui = (show: boolean) => (
      <DtTransition show={show} name="fade" unmountOnLeave><div data-qa="x" /></DtTransition>
    );
    const { rerender } = render(ui(true));
    rerender(ui(false));
    expect(screen.getByTestId('x')).toHaveClass('fade-leave-active');
    await finishTransitions();
    expect(screen.queryByTestId('x')).toBeNull();
  });
});
