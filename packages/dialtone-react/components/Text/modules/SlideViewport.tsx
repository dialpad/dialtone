import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { cx } from '../../../common/cx';
import type { TextSlideMode } from '../TextConstants';
import {
  bindSlide,
  getSlideDuration,
  listenForEscape,
  prefersReducedMotion,
  readSlideConfig,
  watchSlideChanges,
  LOOP_HOLD,
  MAX_LOOPS,
} from './slide';

type SlidePhase = 'rest' | 'waiting' | 'moving' | 'at-end' | 'at-start';

/** What the viewport renders: Vue's reactive refs. */
interface SlideView {
  phase: SlidePhase;
  offset: number;
  duration: number;
  hasCopy: boolean;
  loopWrap: boolean;
}

const REST_VIEW: SlideView = { phase: 'rest', offset: 0, duration: 0, hasCopy: false, loopWrap: false };

interface SlideControllerOptions {
  viewport: () => HTMLSpanElement | null;
  content: () => HTMLSpanElement | null;
  copy: () => HTMLSpanElement | null;
  mode: () => TextSlideMode;
  /** Hands the view to React for the next render. */
  render: (view: SlideView) => void;
  /** Runs fn and commits what it rendered before returning. */
  commitNow: (fn: () => void) => void;
}

/**
 * Vue's SlideViewport script, unchanged in its steps. The view is kept here, so each step reads the one the previous
 * step left, as Vue's refs do, and React renders it.
 */
function createSlideController ({ viewport, content, copy, mode, render, commitNow }: SlideControllerOptions) {
  let view = REST_VIEW;
  // Non-reactive bookkeeping
  const runtime = {
    unbind: null as (() => void) | null,
    stopActive: [] as Array<() => void>,
    timers: [] as number[],
    distance: 0,
    restWidth: 0,
    loops: 0,
  };

  function update (patch: Partial<SlideView>) {
    const next = { ...view, ...patch };
    if ((Object.keys(next) as Array<keyof SlideView>).every((key) => next[key] === view[key])) return;
    view = next;
    render(view);
  }

  function bind () {
    unbind();
    const viewportEl = viewport();
    const contentEl = content();
    if (!viewportEl?.parentElement || !contentEl) return;
    runtime.unbind = bindSlide({
      // the DtText root: the host is the item around it, or the text itself
      el: viewportEl.parentElement,
      moveEl: contentEl,
      onEnter: activate,
      onLeave: deactivate,
      onTransitionEnd: moveDone,
    });
  }

  function unbind () {
    runtime.unbind?.();
    runtime.unbind = null;
    deactivate();
  }

  // the item is hovered or keyboard-focused: watch for Escape and for changes until it is left
  function activate () {
    const viewportEl = viewport();
    const contentEl = content();
    if (!viewportEl || !contentEl) return;
    runtime.stopActive = [
      listenForEscape(viewportEl, deactivate),
      // a new label width or more room: start again from rest with fresh widths
      watchSlideChanges(viewportEl, contentEl, () => {
        reset();
        enter();
      }),
    ];
    enter();
  }

  // left, Escape or unmounted: stop watching and snap back
  function deactivate () {
    runtime.stopActive.forEach((stop) => stop());
    runtime.stopActive = [];
    reset();
  }

  // Vue updates the DOM in a microtask after each step; React would leave it to its scheduler, or to the end of a
  // test's act(). The next step measures the label with or without the loop copy, so each timed step commits first.
  function after (ms: number, fn: () => void) {
    runtime.timers.push(window.setTimeout(() => commitNow(fn), ms));
  }

  function clearTimers () {
    runtime.timers.forEach((timer) => window.clearTimeout(timer));
    runtime.timers = [];
  }

  // snap to rest, no reverse animation
  function reset (next: SlidePhase = 'rest') {
    clearTimers();
    update({ ...REST_VIEW, phase: next });
  }

  // measures the label before each cycle (it may change during a hold); false when it fits
  function measure () {
    const el = content();
    if (!el) return false;
    runtime.distance = el.scrollWidth - el.clientWidth;
    runtime.restWidth = el.scrollWidth;
    return runtime.distance > 0;
  }

  function enter () {
    const viewportEl = viewport();
    if (view.phase !== 'rest' || !viewportEl || !measure()) {
      return;
    }

    runtime.loops = 0;
    update({ phase: 'waiting' });
    after(readSlideConfig(viewportEl).delay, start);
  }

  function start () {
    if (prefersReducedMotion()) {
      update({ phase: 'at-end', offset: runtime.distance });
    } else if (mode() === 'loop') {
      loop();
    } else {
      move(runtime.distance);
    }
  }

  function move (to: number) {
    const viewportEl = viewport();
    const time = viewportEl
      ? getSlideDuration(Math.abs(to - view.offset), readSlideConfig(viewportEl).speed, mode())
      : 0;
    clearTimers();
    update({ phase: 'moving', offset: to, duration: time });
    // in case transitionend does not fire
    after(time + 100, moveDone);
    return time;
  }

  function loop () {
    if (!measure()) {
      return;
    }
    // the copy has to be in the DOM to measure the full wrap-around distance (Vue awaits nextTick here)
    commitNow(() => update({ hasCopy: true }));
    const el = content();
    const copyEl = copy();
    if (!view.hasCopy || !el || !copyEl) {
      return;
    }
    // a static clone, cleaned while detached: slot components do not mount twice, and no ids,
    // form values, radio groups, validation or tab stops repeat
    const original = [...el.childNodes].filter((node) => node !== copyEl);
    const clone = el.ownerDocument.createDocumentFragment();
    clone.append(...original.map((node) => node.cloneNode(true)));
    clone.querySelectorAll('[id], [name]').forEach((node) => {
      node.removeAttribute('id');
      node.removeAttribute('name');
    });
    clone.querySelectorAll<HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea, button',
    ).forEach((node) => {
      node.disabled = true;
    });
    copyEl.replaceChildren(clone);
    const { restWidth } = runtime;
    const distance = el.scrollWidth - restWidth;
    const time = move(distance);
    runtime.loops += 1;
    // the start edge fades while the text slides out, then clears once the gap is
    // half past it, before the copy arrives (the scroll is linear, so time = distance)
    const gap = parseFloat(getComputedStyle(copyEl).paddingInlineStart) || 0;
    after(time * (restWidth + gap / 2) / distance, () => update({ loopWrap: true }));
  }

  function moveDone () {
    if (view.phase !== 'moving') {
      return;
    }
    if (mode() !== 'loop') {
      clearTimers();
      update({ phase: 'at-end' });
      return;
    }
    // the copy now sits exactly where the text began, so snap back unseen; stop after MAX_LOOPS
    reset('at-start');
    if (runtime.loops < MAX_LOOPS) {
      after(LOOP_HOLD, loop);
    }
  }

  // a sequence started in the old mode can end on the loop copy: start again from rest
  function modeChanged () {
    if (!runtime.stopActive.length) {
      return;
    }
    reset();
    // measure once the loop copy has left the DOM: React commits the reset before this microtask, as Vue's nextTick
    queueMicrotask(() => {
      if (runtime.stopActive.length) {
        enter();
      }
    });
  }

  return { bind, unbind, modeChanged };
}

export interface DtTextSlideViewportProps {
  /** 'once' or 'loop' */
  mode: TextSlideMode;
  children?: ReactNode;
}

type SlideViewportStyle = CSSProperties & { '--_slide-offset': string; '--_slide-duration': string };

/**
 * Internal to DtText: rendered only when `slide` is on, so plain text carries no slide state.
 * The outer span clips and fades the text; only the inner span moves, with transform.
 */
export function DtTextSlideViewport ({ mode, children }: DtTextSlideViewportProps) {
  const viewportRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLSpanElement>(null);
  const modeRef = useRef(mode);
  const [view, setView] = useState(REST_VIEW);

  const [controller] = useState(() => createSlideController({
    viewport: () => viewportRef.current,
    content: () => contentRef.current,
    copy: () => copyRef.current,
    mode: () => modeRef.current,
    render: setView,
    commitNow: flushSync,
  }));

  // Vue's watcher on the mode, which doesn't run on mount
  useLayoutEffect(() => {
    if (modeRef.current === mode) return;
    modeRef.current = mode;
    controller.modeChanged();
  }, [controller, mode]);

  // mounted / beforeUnmount. React's <Activity> runs the cleanup when it hides the text, as Vue's KeepAlive runs
  // onDeactivated: the host can vanish without a pointerleave or focusout.
  useLayoutEffect(() => {
    controller.bind();
    return () => controller.unbind();
  }, [controller]);

  const viewportClasses = cx('d-text__slide', {
    'd-text__slide--moving': view.phase === 'moving',
    'd-text__slide--end': view.phase === 'at-end',
    'd-text__slide--loop': view.phase === 'moving' && view.hasCopy,
    'd-text__slide--loop-wrap': view.loopWrap,
  });

  const viewportStyles: SlideViewportStyle | undefined = view.phase === 'rest'
    ? undefined
    : { '--_slide-offset': `${view.offset}px`, '--_slide-duration': `${view.duration}ms` };

  return (
    <span ref={viewportRef} className={viewportClasses} style={viewportStyles}>
      <span ref={contentRef} className="d-text__slide-content">
        {children}
        {/* loop only: filled with a static clone of the text while it moves */}
        {view.hasCopy && <span ref={copyRef} aria-hidden="true" inert className="d-text__slide-copy" />}
      </span>
    </span>
  );
}
