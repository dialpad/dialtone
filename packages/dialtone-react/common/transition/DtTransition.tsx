// Vue's <Transition> in React: runtime-dom's resolveTransitionProps (classes, end detection) over runtime-core's
// BaseTransition (hook order, cancellation), driven the way vShow and the renderer drive them for a child with v-show
// or v-if. The code follows Vue's step for step, quirks included (a cancelled enter's pending frame still adds
// `-enter-to`), so dialtone-css's transitions (fade, slide-down, pop, d-collapsible__*, d-motion-text-*…) behave as
// they do in dialtone-vue. Like Vue, it adds and removes the classes on the element itself, and merges them into the
// child's className on every render, as Vue's patchClass does, so a re-render mid-transition keeps them.
import {
  Children,
  cloneElement,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type Ref,
} from 'react';
import { cx } from '../cx';

/** A hook that gets the element. */
export type DtTransitionHook = (el: HTMLElement) => void;
/**
 * onEnter, onLeave, onAppear. As in Vue, a hook that declares the second parameter (`(el, done) => …`) ends the
 * transition itself by calling `done`; one that doesn't is called, and the transition ends as usual.
 */
export type DtTransitionAsyncHook = (el: HTMLElement, done: () => void) => void;

export interface DtTransitionProps {
  /** The `v-show` (or, with `unmountOnLeave`, `v-if`) condition on Vue's child. */
  show: boolean;
  /** Class name prefix: `<name>-enter-from` and so on. Vue's default is `v`. */
  name?: string;
  /** Run the enter transition, with the appear classes and hooks, when mounted with `show`. */
  appear?: boolean;
  /** `false`: no classes, hooks only, as Vue's `:css="false"`. */
  css?: boolean;
  /** Which end event to wait for when the element has both transitions and animations. */
  type?: 'transition' | 'animation';
  /** Milliseconds to wait, instead of reading the element's computed transition or animation timing. */
  duration?: number | { enter: number; leave: number };
  enterFromClass?: string;
  enterActiveClass?: string;
  enterToClass?: string;
  appearFromClass?: string;
  appearActiveClass?: string;
  appearToClass?: string;
  leaveFromClass?: string;
  leaveActiveClass?: string;
  leaveToClass?: string;
  /**
   * Vue's `v-if` on the child: it's mounted on enter and unmounted once the leave ends. Default: Vue's `v-show`,
   * where it stays mounted with `display: none`.
   */
  unmountOnLeave?: boolean;
  onBeforeEnter?: DtTransitionHook;
  onEnter?: DtTransitionAsyncHook;
  onAfterEnter?: DtTransitionHook;
  onEnterCancelled?: DtTransitionHook;
  onBeforeLeave?: DtTransitionHook;
  onLeave?: DtTransitionAsyncHook;
  onAfterLeave?: DtTransitionHook;
  onLeaveCancelled?: DtTransitionHook;
  /** The appear hooks default to the enter ones, as in Vue. */
  onBeforeAppear?: DtTransitionHook;
  onAppear?: DtTransitionAsyncHook;
  onAfterAppear?: DtTransitionHook;
  onAppearCancelled?: DtTransitionHook;
  /**
   * One element, which must accept `className`, `style` and `ref` and pass them to its DOM element (any host
   * element does). That element is what the classes and hooks apply to.
   */
  children: ReactElement;
}

type UserHook = 'onBeforeEnter' | 'onEnter' | 'onAfterEnter' | 'onEnterCancelled'
  | 'onBeforeLeave' | 'onLeave' | 'onAfterLeave' | 'onLeaveCancelled'
  | 'onBeforeAppear' | 'onAppear' | 'onAfterAppear' | 'onAppearCancelled';

/** What Vue keeps on the element itself: el[vtcKey], el[enterCbKey], el[leaveCbKey], _isLeaving and so on. */
interface ElementState {
  classes: Set<string>;
  enterCb?: (cancelled?: boolean) => void;
  leaveCb?: (cancelled?: boolean) => void;
  isLeaving: boolean;
  enterCancelled: boolean;
  endId: number;
}
const states = new WeakMap<HTMLElement, ElementState>();
const stateOf = (el: HTMLElement) => {
  let state = states.get(el);
  if (!state) states.set(el, state = { classes: new Set(), isLeaving: false, enterCancelled: false, endId: 0 });
  return state;
};
let endId = 0;

/** Frames, timers and listeners, all cancelled when the component unmounts. */
interface Scheduler {
  frame: (cb: () => void) => void;
  timeout: (cb: () => void, ms: number) => void;
  listen: (el: HTMLElement, type: string, cb: (event: Event) => void) => () => void;
}

/** One of BaseTransition's resolved hooks, and whether it ends through `done` (callAsyncHook's `hook.length > 1`). */
interface AsyncHook {
  run: (el: HTMLElement, done: () => void) => void;
  waits: boolean;
}

function addClass (el: HTMLElement, value: string) {
  value.split(/\s+/).forEach(c => c && el.classList.add(c));
  stateOf(el).classes.add(value);
}

function removeClass (el: HTMLElement, value: string) {
  value.split(/\s+/).forEach(c => c && el.classList.remove(c));
  stateOf(el).classes.delete(value);
}

const toMs = (s: string) => (s === 'auto' ? 0 : Number(s.slice(0, -1).replace(',', '.')) * 1000);

// The longest delay plus duration, delays repeated to cover every duration.
function timeoutOf (delays: string[], durations: string[]) {
  while (delays.length < durations.length) delays = delays.concat(delays);
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}

// runtime-dom's getTransitionInfo: which end event to wait for, how many, and the fallback timeout.
function transitionInfo (el: HTMLElement, expected: DtTransitionProps['type']) {
  const styles = window.getComputedStyle(el);
  const list = (key: 'transitionDelay' | 'transitionDuration' | 'animationDelay' | 'animationDuration') =>
    (styles[key] || '').split(', ');
  const transitionDurations = list('transitionDuration');
  const animationDurations = list('animationDuration');
  const transitionTimeout = timeoutOf(list('transitionDelay'), transitionDurations);
  const animationTimeout = timeoutOf(list('animationDelay'), animationDurations);
  const none = { type: null, timeout: 0, count: 0 };
  const transition = { type: 'transition', timeout: transitionTimeout, count: transitionDurations.length };
  const animation = { type: 'animation', timeout: animationTimeout, count: animationDurations.length };
  if (expected === 'transition') return transitionTimeout > 0 ? transition : none;
  if (expected === 'animation') return animationTimeout > 0 ? animation : none;
  if (Math.max(transitionTimeout, animationTimeout) <= 0) return none;
  return transitionTimeout > animationTimeout ? transition : animation;
}

// runtime-dom's nextFrame: two frames, so the -from classes are painted before the -to ones apply.
const nextFrame = (s: Scheduler, cb: () => void) => s.frame(() => s.frame(cb));

// runtime-dom's whenTransitionEnds: the explicit duration, else the end events (or a timeout one past the computed
// timing). A newer call on the same element makes this one stale.
function whenTransitionEnds (s: Scheduler, el: HTMLElement, expected: DtTransitionProps['type'],
  explicitTimeout: number | undefined, resolve: () => void) {
  const state = stateOf(el);
  const id = state.endId = ++endId;
  const resolveIfNotStale = () => { if (id === state.endId) resolve(); };
  if (explicitTimeout != null) {
    s.timeout(resolveIfNotStale, explicitTimeout);
    return;
  }
  const info = transitionInfo(el, expected);
  if (!info.type) {
    resolve();
    return;
  }
  let ended = 0;
  let stop = () => {};
  const end = () => { stop(); resolveIfNotStale(); };
  s.timeout(() => { if (ended < info.count) end(); }, info.timeout + 1);
  stop = s.listen(el, `${info.type}end`, (event) => {
    if (event.target === el && ++ended >= info.count) end();
  });
}

interface Options {
  props: DtTransitionProps;
  call: (hook: UserHook, el: HTMLElement, done?: () => void) => void;
  scheduler: Scheduler;
}

// runtime-dom's resolveTransitionProps: the hooks BaseTransition calls, wrapping the user's with the classes.
function resolveHooks ({ props, call, scheduler: s }: Options) {
  const has = (hook: UserHook) => typeof props[hook] === 'function';
  const explicit = (hook: UserHook) => ((props[hook] as ((...args: unknown[]) => void) | undefined)?.length ?? 0) > 1;
  const either = (appearHook: UserHook, enterHook: UserHook) => (has(appearHook) ? appearHook : enterHook);
  const user = (hook: UserHook): AsyncHook => ({ run: (el, done) => call(hook, el, done), waits: explicit(hook) });

  if (props.css === false) {
    return {
      beforeEnter: (el: HTMLElement) => call('onBeforeEnter', el),
      beforeAppear: (el: HTMLElement) => call(either('onBeforeAppear', 'onBeforeEnter'), el),
      enter: user('onEnter'),
      appear: user(either('onAppear', 'onEnter')),
      leave: user('onLeave'),
      enterCancelled: (el: HTMLElement) => call('onEnterCancelled', el),
      appearCancelled: (el: HTMLElement) => call(either('onAppearCancelled', 'onEnterCancelled'), el),
      leaveCancelled: (el: HTMLElement) => call('onLeaveCancelled', el),
    };
  }

  const name = props.name || 'v';
  const enterFrom = props.enterFromClass ?? `${name}-enter-from`;
  const enterActive = props.enterActiveClass ?? `${name}-enter-active`;
  const enterTo = props.enterToClass ?? `${name}-enter-to`;
  const appearFrom = props.appearFromClass ?? enterFrom;
  const appearActive = props.appearActiveClass ?? enterActive;
  const appearTo = props.appearToClass ?? enterTo;
  const leaveFrom = props.leaveFromClass ?? `${name}-leave-from`;
  const leaveActive = props.leaveActiveClass ?? `${name}-leave-active`;
  const leaveTo = props.leaveToClass ?? `${name}-leave-to`;
  const { duration, type } = props;
  const enterDuration = typeof duration === 'object' ? duration.enter : duration;
  const leaveDuration = typeof duration === 'object' ? duration.leave : duration;

  const finishEnter = (el: HTMLElement, isAppear: boolean, done?: () => void, cancelled = false) => {
    stateOf(el).enterCancelled = cancelled;
    removeClass(el, isAppear ? appearTo : enterTo);
    removeClass(el, isAppear ? appearActive : enterActive);
    done?.();
  };
  const finishLeave = (el: HTMLElement, done?: () => void) => {
    stateOf(el).isLeaving = false;
    removeClass(el, leaveFrom);
    removeClass(el, leaveTo);
    removeClass(el, leaveActive);
    done?.();
  };
  const makeEnter = (isAppear: boolean): AsyncHook => ({
    waits: true,
    run: (el, done) => {
      const hook = isAppear ? either('onAppear', 'onEnter') : 'onEnter';
      const resolve = () => finishEnter(el, isAppear, done);
      call(hook, el, resolve);
      nextFrame(s, () => {
        removeClass(el, isAppear ? appearFrom : enterFrom);
        addClass(el, isAppear ? appearTo : enterTo);
        if (!explicit(hook)) whenTransitionEnds(s, el, type, enterDuration, resolve);
      });
    },
  });
  const reflow = (el: HTMLElement) => el.ownerDocument.body.offsetHeight;

  return {
    beforeEnter: (el: HTMLElement) => {
      call('onBeforeEnter', el);
      addClass(el, enterFrom);
      addClass(el, enterActive);
    },
    beforeAppear: (el: HTMLElement) => {
      call(either('onBeforeAppear', 'onBeforeEnter'), el);
      addClass(el, appearFrom);
      addClass(el, appearActive);
    },
    enter: makeEnter(false),
    appear: makeEnter(true),
    leave: {
      waits: true,
      run: (el: HTMLElement, done: () => void) => {
        const state = stateOf(el);
        state.isLeaving = true;
        const resolve = () => finishLeave(el, done);
        addClass(el, leaveFrom);
        if (!state.enterCancelled) {
          reflow(el);
          addClass(el, leaveActive);
        } else {
          addClass(el, leaveActive);
          reflow(el);
        }
        nextFrame(s, () => {
          if (!state.isLeaving) return;
          removeClass(el, leaveFrom);
          addClass(el, leaveTo);
          if (!explicit('onLeave')) whenTransitionEnds(s, el, type, leaveDuration, resolve);
        });
        call('onLeave', el, resolve);
      },
    } satisfies AsyncHook,
    enterCancelled: (el: HTMLElement) => {
      finishEnter(el, false, undefined, true);
      call('onEnterCancelled', el);
    },
    appearCancelled: (el: HTMLElement) => {
      finishEnter(el, true, undefined, true);
      call(either('onAppearCancelled', 'onEnterCancelled'), el);
    },
    leaveCancelled: (el: HTMLElement) => {
      finishLeave(el);
      call('onLeaveCancelled', el);
    },
  };
}

// BaseTransition's beforeEnter, enter and leave (resolveTransitionHooks).
function transitionHooks (options: Options, isMounted: boolean) {
  const { props, call } = options;
  const resolved = resolveHooks(options);
  const appearing = !isMounted;
  const has = (hook: UserHook) => typeof props[hook] === 'function';
  return {
    beforeEnter (el: HTMLElement) {
      if (appearing && !props.appear) return;
      stateOf(el).leaveCb?.(true);
      (appearing ? resolved.beforeAppear : resolved.beforeEnter)(el);
    },
    enter (el: HTMLElement) {
      if (appearing && !props.appear) return;
      const hook = appearing ? resolved.appear : resolved.enter;
      const afterHook: UserHook = appearing && has('onAfterAppear') ? 'onAfterAppear' : 'onAfterEnter';
      const cancelHook = appearing ? resolved.appearCancelled : resolved.enterCancelled;
      const state = stateOf(el);
      let called = false;
      const cb = state.enterCb = (cancelled?: boolean) => {
        if (called) return;
        called = true;
        if (cancelled) cancelHook(el);
        else call(afterHook, el);
        state.enterCb = undefined;
      };
      hook.run(el, () => cb(false));
      if (!hook.waits) cb(false);
    },
    /** `remove` hides or unmounts the element; `after` defers the after hook until that's committed (v-if). */
    leave (el: HTMLElement, remove: () => void, after: (hook: () => void) => void) {
      const state = stateOf(el);
      state.enterCb?.(true);
      call('onBeforeLeave', el);
      let called = false;
      const cb = state.leaveCb = (cancelled?: boolean) => {
        if (called) return;
        called = true;
        remove();
        after(() => {
          if (cancelled) resolved.leaveCancelled(el);
          else call('onAfterLeave', el);
        });
        state.leaveCb = undefined;
      };
      resolved.leave.run(el, () => cb(false));
      if (!resolved.leave.waits) cb(false);
    },
  };
}

// React 19 calls a ref callback's returned cleanup on detach instead of calling it with null, so the merged callback
// returns one: each ref gets its own cleanup if it returned one, and null otherwise, as React would do itself.
function mergeRefs<T> (...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
      return undefined;
    });
    return () => {
      refs.forEach((ref, i) => {
        const cleanup = cleanups[i];
        if (typeof cleanup === 'function') cleanup();
        else if (typeof ref === 'function') ref(null);
        else if (ref) ref.current = null;
      });
    };
  };
}

type ChildProps = { className?: string; style?: CSSProperties; ref?: Ref<HTMLElement> };

/**
 * Vue's `<transition>` around one element with `v-show` (or `v-if`, with `unmountOnLeave`): adds
 * `<name>-enter-from` and `-enter-active`, swaps `-enter-from` for `-enter-to` two frames later, and removes them
 * when the element's transition or animation ends (its computed timing and `transitionend`/`animationend`, or
 * `duration`); the same for leave, after which the child is hidden (`display: none`) or unmounted. The hooks are
 * Vue's, at the same moments, except that none runs once DtTransition unmounts.
 */
export function DtTransition (props: DtTransitionProps) {
  const { show, unmountOnLeave = false, children } = props;
  // Whether the child is displayed (or, for v-if, mounted): it lags `show` until the enter starts and the leave ends.
  const [present, setPresent] = useState(show);
  // v-if: a new element for each enter that interrupts a leave, as Vue renders a new one while the old one leaves.
  const [generation, setGeneration] = useState(0);
  const elRef = useRef<HTMLElement | null>(null);
  const elGeneration = useRef(0);
  const lastShow = useRef<boolean | null>(null);
  // Work that waits for the next commit: v-if's after-leave hooks (Vue removes the element first) and the enter of a
  // remounted element.
  const queue = useRef<(() => void)[]>([]);
  const tasks = useRef(new Set<() => void>());

  const scheduler = useMemo<Scheduler>(() => {
    const track = (cancel: () => void) => { tasks.current.add(cancel); return () => tasks.current.delete(cancel); };
    return {
      frame: (cb) => {
        const untrack = track(() => cancelAnimationFrame(id));
        const id = requestAnimationFrame(() => { untrack(); cb(); });
      },
      timeout: (cb, ms) => {
        const untrack = track(() => clearTimeout(id));
        const id = setTimeout(() => { untrack(); cb(); }, ms);
      },
      listen: (el, type, cb) => {
        const stop = () => { el.removeEventListener(type, cb); untrack(); };
        const untrack = track(stop);
        el.addEventListener(type, cb);
        return stop;
      },
    };
  }, []);

  // Bumped on unmount (StrictMode's simulated one too). A `done` handed to a hook before that does nothing, so a hook
  // that ends its transition late changes nothing and calls no other hook.
  const life = useRef(0);
  const call = useEffectEvent((hook: UserHook, el: HTMLElement, done?: () => void) => {
    const at = life.current;
    (props[hook] as DtTransitionAsyncHook | undefined)?.(el, () => { if (done && life.current === at) done(); });
  });
  const hooks = useEffectEvent((isMounted: boolean) => transitionHooks({ props, call, scheduler }, isMounted));
  const isVIf = useEffectEvent(() => unmountOnLeave);
  // vShow's el[vShowOriginalDisplay]: the display to restore.
  const originalDisplay = useEffectEvent(() => {
    const display = (children.props as ChildProps).style?.display;
    return display === 'none' || display == null ? '' : String(display);
  });

  useLayoutEffect(() => {
    const previous = lastShow.current;
    lastShow.current = show;
    if (previous === show) return;
    const el = elRef.current;
    // Read through an effect event: switching between v-show and v-if mid-life isn't something Vue does either.
    const vIf = isVIf();
    // BaseTransition only runs hooks before it's mounted when `appear` is set.
    const transition = hooks(previous !== null);
    if (previous === null) {
      if (show && el) {
        transition.beforeEnter(el);
        transition.enter(el);
      }
      return;
    }
    if (show) {
      if (vIf && el && stateOf(el).leaveCb) {
        // Vue mounts a new element and finishes the old one's leave (its after-leave hook, not the cancelled one).
        stateOf(el).leaveCb?.();
        queue.current.push(() => {
          const next = elRef.current;
          if (!next) return;
          transition.beforeEnter(next);
          transition.enter(next);
        });
      } else if (el) {
        transition.beforeEnter(el); // cancels a running leave, which hides the element for a moment, as in Vue
        if (!vIf) el.style.display = originalDisplay(); // vShow's setDisplay(el, true)
        transition.enter(el);
      }
      // Last, so it wins over the hide of a leave cancelled above.
      setPresent(true);
      return;
    }
    if (!el) {
      setPresent(false);
      return;
    }
    if (vIf) {
      transition.leave(el, () => {
        setPresent(false);
        setGeneration(g => g + 1);
      }, hook => queue.current.push(hook));
    } else {
      transition.leave(el, () => {
        el.style.display = 'none'; // vShow's setDisplay(el, false), before the hook; the next render agrees
        setPresent(false);
      }, hook => hook());
    }
  }, [show]);

  // The commit that removed or replaced the element has happened: run what waited for it, in order.
  useLayoutEffect(() => {
    const work = queue.current;
    queue.current = [];
    work.forEach(fn => fn());
  }, [present, generation]);

  // Unmounting (and StrictMode's simulated unmount) stops everything without calling hooks, a `done` a hook still
  // holds included, and clears the classes, so a remount starts clean. Vue's <Transition> would still end a
  // pending transition and call its hooks on the detached element.
  useLayoutEffect(() => () => {
    life.current += 1;
    tasks.current.forEach(cancel => cancel());
    tasks.current.clear();
    queue.current = [];
    lastShow.current = null;
    const el = elRef.current;
    if (el) {
      stateOf(el).classes.forEach(value => value.split(/\s+/).forEach(c => c && el.classList.remove(c)));
      states.delete(el);
    }
  }, []);

  const child = Children.only(children) as ReactElement<ChildProps>;
  const childRef = child.props.ref;
  const ref = useMemo(() => mergeRefs<HTMLElement>(
    (node) => { elRef.current = node; if (node) elGeneration.current = generation; },
    childRef,
  ), [childRef, generation]);

  // v-if: mounted while shown or leaving. v-show: displayed from the enter's effect (so onBeforeEnter sees it hidden,
  // as vShow calls it before setDisplay) until the leave ends.
  if (unmountOnLeave && !show && !present) return null;
  const hidden = !unmountOnLeave && !present;
  // The transition classes on this element now, so a re-render keeps them (Vue's patchClass).
  const el = elRef.current;
  const classes = el && elGeneration.current === generation ? [...stateOf(el).classes] : [];
  return cloneElement(child, {
    key: unmountOnLeave ? generation : undefined,
    ref,
    className: cx(child.props.className, classes) || undefined,
    style: hidden ? { ...child.props.style, display: 'none' } : child.props.style,
  } as ChildProps & { key?: number });
}
