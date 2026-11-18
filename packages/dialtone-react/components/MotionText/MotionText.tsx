import {
  Fragment,
  useImperativeHandle,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../common/cx';
import {
  MOTION_TEXT_MODE_SETTINGS,
  MOTION_TEXT_TIMING_PRESETS,
  MOTION_TEXT_TRACKS,
  type MotionTextAnimationMode,
  type MotionTextModeSettings,
  type MotionTextSpeed,
} from './MotionTextConstants';
import { getGradientSlices, splitWords, type MotionTextWord } from './utils';

const DEFAULT_PRESET = MOTION_TEXT_TIMING_PRESETS['300'];
// Unsupported modes render the text at rest, like 'none'
const RESTING_SETTINGS: MotionTextModeSettings = { tracks: [], gradient: false, loopHold: 0 };
const RESTARTING_CLASS = 'd-motion-text--restarting';

/** The `progress` payload. */
export interface MotionTextProgress {
  wordsComplete: number;
  totalWords: number;
  progress: number;
}

/** What a `ref` to DtMotionText gets: Vue's public methods, and the root element. */
export interface DtMotionTextHandle {
  /** The root element (Vue's `$el`). */
  readonly element: HTMLSpanElement | null;
  /** Start the animation. */
  start: () => void;
  /** Pause the animation. */
  pause: () => void;
  /** Resume the animation. */
  resume: () => void;
  /** Reset the animation to initial state. */
  reset: () => void;
  /** Skip to the end of the animation. */
  skipToEnd: () => void;
}

// onPause and onProgress are media events on HTMLAttributes; here they're the component's own events.
// The component renders the root's children itself, and React throws when a root has both children and inner HTML.
type NativeAttributes = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'dangerouslySetInnerHTML' | 'onPause' | 'onProgress'
>;

export interface DtMotionTextProps extends NativeAttributes {
  /** Vue's public methods (`start`, `pause`, `resume`, `reset`, `skipToEnd`) and the root element. */
  ref?: Ref<DtMotionTextHandle>;

  /** The text content to animate. */
  text?: string;

  /**
   * The animation mode to use for the text reveal. `none` renders the text without animation.
   * @values gradient-in, fade-in, slide-in, slide-in-gradient, gradient-sweep, shimmer, none
   */
  animationMode?: MotionTextAnimationMode;

  /**
   * Animation speed. 300 plays the motion spec as designed; lower values are faster.
   * @values 100, 200, 300, 400, 500
   */
  speed?: MotionTextSpeed;

  /**
   * Whether to start animation automatically when component is mounted.
   * @values true, false
   */
  autoStart?: boolean;

  /**
   * Whether to loop the animation continuously.
   * @values true, false
   */
  loop?: boolean;

  /**
   * Whether to respect the user's prefers-reduced-motion system setting.
   * @values true, false
   */
  respectsReducedMotion?: boolean;

  /**
   * Alternative text for screen readers. If provided, this will be announced
   * instead of the animated text.
   */
  screenReaderText?: string;

  /** Text content to animate when not using the text prop. Only the text is animated; markup is not preserved. */
  children?: ReactNode;

  /** Called when the animation starts, and at the start of each looped cycle. */
  onStart?: () => void;

  /** Called when the animation completes, and at the end of each looped cycle. */
  onComplete?: () => void;

  /** Called as each word finishes animating. */
  onProgress?: (progress: MotionTextProgress) => void;

  /** Called when the animation is paused. */
  onPause?: () => void;

  /** Called when the animation resumes. */
  onResume?: () => void;
}

type LatestProps = Required<Pick<DtMotionTextProps,
  'text' | 'animationMode' | 'speed' | 'autoStart' | 'loop' | 'respectsReducedMotion'>> &
  Pick<DtMotionTextProps, 'children' | 'onStart' | 'onComplete' | 'onProgress' | 'onPause' | 'onResume'>;

/** Vue's `data`: the playback state the timeline reads and writes synchronously. */
interface Machine {
  words: MotionTextWord[];
  wordWidths: number[];
  isRtl: boolean;
  isAnimating: boolean;
  isPaused: boolean;
  isComplete: boolean;
  isUnmounted: boolean;
  /** Bumped on unmount, so callbacks a microtask is still holding for the previous mount (StrictMode's) never run. */
  mountGeneration: number;
  animationTimeouts: ReturnType<typeof setTimeout>[];
  timelineStartedAt: number;
  timelineElapsed: number;
  prefersReducedMotion: boolean;
  animationKey: number;
  cssIterations: number;
  /** The slot input (children) the words were last tokenized from, to tell whether retained words are still valid. */
  slotSource: ReactNode;
  /** The slot is waiting to be read after its words were cleared, so the words aren't there to play yet. */
  slotReadPending: boolean;
  /** start() was called while the slot read was pending; it plays once the words are read. */
  startRequested: boolean;
}

/** The part of the machine that renders. */
type View = Pick<Machine, 'words' | 'wordWidths' | 'isRtl' | 'isAnimating' | 'isPaused' | 'isComplete' | 'animationKey'>;

const viewOf = (m: Machine): View => ({
  words: m.words,
  wordWidths: m.wordWidths,
  isRtl: m.isRtl,
  isAnimating: m.isAnimating,
  isPaused: m.isPaused,
  isComplete: m.isComplete,
  animationKey: m.animationKey,
});

const getModeSettings = (mode: string): MotionTextModeSettings =>
  (MOTION_TEXT_MODE_SETTINGS as Record<string, MotionTextModeSettings>)[mode] ?? RESTING_SETTINGS;

/** Multiplier applied to every motion timing for the current speed. */
const getSpeedScale = (speed: MotionTextSpeed): number => {
  const preset = (MOTION_TEXT_TIMING_PRESETS as Record<string, { duration: number }>)[String(speed)] ?? DEFAULT_PRESET;
  return preset.duration / DEFAULT_PRESET.duration;
};

/** Track timings for the current mode as CSS variables, e.g. --d-motion-text-enter-stagger */
const getComponentStyles = (settings: MotionTextModeSettings, speedScale: number): Record<string, string> => {
  const styles: Record<string, string> = {};
  settings.tracks.forEach(track => {
    Object.entries(MOTION_TEXT_TRACKS[track]).forEach(([key, value]) => {
      styles[`--d-motion-text-${track}-${key}`] = `${Math.round(value * speedScale)}ms`;
    });
  });
  return styles;
};

interface ControllerDeps {
  machine: Machine;
  props: () => LatestProps;
  root: () => HTMLSpanElement | null;
  content: () => HTMLSpanElement | null;
  slot: () => HTMLSpanElement | null;
  /** Renders the machine's current state. */
  commit: () => void;
  /** Vue's $nextTick: runs the callback after the next commit, a microtask later. */
  nextTick: (callback: () => void) => void;
}

/**
 * Vue's methods and watchers, on a mutable machine so that calls in a row (pause() twice, reset() then start()) see
 * each other's state at once, as Vue's do. The timeline runs on timers, so it never waits for React to render.
 */
function createController ({ machine: m, props, root, content, slot, commit, nextTick }: ControllerDeps) {
  const modeSettings = () => getModeSettings(props().animationMode);
  const isWholeText = () => Boolean(modeSettings().wholeText);
  const speedScale = () => getSpeedScale(props().speed);

  /** Time (ms) at which each word finishes its last track */
  const wordEndTimes = () => m.words.map((_word, index) => {
    const ends = modeSettings().tracks.map(track => {
      const { delay, stagger, duration } = MOTION_TEXT_TRACKS[track];
      return delay + stagger * index + duration;
    });
    return Math.max(0, ...ends) * speedScale();
  });

  /** Time (ms) at which one cycle of the animation ends */
  const cycleDuration = () => {
    if (!isWholeText()) return Math.max(0, ...wordEndTimes());

    const ends = modeSettings().tracks.map(track => {
      const { delay, duration } = MOTION_TEXT_TRACKS[track];
      return delay + duration;
    });
    return Math.max(0, ...ends) * speedScale() * m.cssIterations;
  };

  /** Collect the text of slot content, ignoring markup */
  const getSlotText = () => slot()?.textContent || '';

  /**
   * Track the reduced motion preference, finishing any running animation if it turns on.
   * Returns what stops tracking it.
   */
  function initWatchReducedMotion (): (() => void) | undefined {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event: { matches: boolean }) => {
      m.prefersReducedMotion = event.matches;
      if (event.matches && props().respectsReducedMotion && m.isAnimating) skipToEnd();
    };

    m.prefersReducedMotion = query.matches;
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }

  /**
   * Measure rendered word widths so each word can show its slice of the gradient.
   * Falls back to character counts when layout is unavailable (e.g. not yet rendered).
   */
  function measureWords () {
    if (!modeSettings().gradient) return;

    const wordEls = content()?.querySelectorAll('.d-motion-text__word') ?? [];
    const widths = Array.from(wordEls, el => el.getBoundingClientRect().width);

    const el = root();
    m.isRtl = el ? window.getComputedStyle(el).direction === 'rtl' : false;
    m.wordWidths = widths.length === m.words.length && widths.every(width => width > 0)
      ? widths
      : m.words.map(word => word.text.length);
    commit();
  }

  /** Clear all animation timeouts */
  function clearTimeouts () {
    m.animationTimeouts.forEach(timeout => clearTimeout(timeout));
    m.animationTimeouts = [];
  }

  function schedule (delay: number, callback: () => void) {
    m.animationTimeouts.push(setTimeout(callback, Math.max(0, delay)));
  }

  /**
   * Schedule progress, completion and (when looping) restart events for the remainder
   * of the current cycle. CSS runs the animation itself; this keeps events in step with it.
   */
  function runTimeline () {
    const elapsed = m.timelineElapsed;
    const totalWords = m.words.length;
    const cycleEnd = cycleDuration();

    m.timelineStartedAt = Date.now() - elapsed;

    // Whole-text modes have no per-word progress
    const wordEnds = isWholeText() ? [] : wordEndTimes();
    wordEnds.forEach((end, index) => {
      if (end <= elapsed) return;
      schedule(end - elapsed, () => {
        props().onProgress?.({
          wordsComplete: index + 1,
          totalWords,
          progress: (index + 1) / totalWords,
        });
      });
    });

    if (cycleEnd > elapsed) {
      schedule(cycleEnd - elapsed, () => completeAnimation());
    }

    if (props().loop) {
      const restartAt = cycleEnd + modeSettings().loopHold * speedScale();
      schedule(restartAt - elapsed, () => restartCycle());
    } else if (cycleEnd <= elapsed) {
      // The cycle already ended while looping (e.g. loop turned off during the hold)
      finishAnimation();
    }
  }

  /** Start the animation */
  function start () {
    if (m.isAnimating || m.isUnmounted) return;

    // The words are being re-read from the slot: play them once they're there, rather than completing on none
    if (m.slotReadPending) {
      m.startRequested = true;
      return;
    }

    clearTimeouts();
    m.isAnimating = true;
    m.isPaused = false;
    m.isComplete = false;
    commit();
    props().onStart?.();

    // Skip animation if reduced motion is preferred and enabled
    if (props().respectsReducedMotion && m.prefersReducedMotion) {
      showAllContent();
      return;
    }

    if (!modeSettings().tracks.length || (!isWholeText() && !m.words.length)) {
      showAllContent();
      return;
    }

    measureWords();
    m.cssIterations = readCssIterations();
    m.timelineElapsed = 0;
    runTimeline();
  }

  /** Whole-text animations honor a consumer's animation-iteration-count override (e.g. 2 sweeps) */
  function readCssIterations () {
    const el = root();
    if (!isWholeText() || props().loop || !el) return 1;

    const count = parseFloat(window.getComputedStyle(el).animationIterationCount);
    return Number.isFinite(count) && count > 1 ? count : 1;
  }

  /** Pause the animation */
  function pause () {
    if (!m.isAnimating || m.isPaused) return;

    m.timelineElapsed = Date.now() - m.timelineStartedAt;
    clearTimeouts();
    m.isPaused = true;
    commit();
    props().onPause?.();
  }

  /** Resume the animation */
  function resume () {
    if (!m.isPaused) return;

    m.isPaused = false;
    commit();
    props().onResume?.();
    runTimeline();
  }

  /** Reset the animation to initial state */
  function reset () {
    clearTimeouts();
    m.isAnimating = false;
    m.isPaused = false;
    m.isComplete = false;
    m.timelineElapsed = 0;
    m.startRequested = false;
    m.animationKey++;
    commit();
    // Whole-text modes animate the root, which re-keying the words doesn't reset
    replayAnimations();
  }

  /** Skip to the end of the animation */
  function skipToEnd () {
    // A handle kept past unmount must not schedule events for a listener that's gone (Vue's emit is a no-op there)
    if (m.isUnmounted) return;

    showAllContent();
  }

  /** Show all content immediately in its resting state */
  function showAllContent () {
    finishAnimation();
    m.isPaused = false;
    commit();
    schedule(0, () => props().onComplete?.());
  }

  function finishAnimation () {
    clearTimeouts();
    m.isAnimating = false;
    m.isComplete = true;
    commit();
  }

  function restartIfAnimating () {
    if (!m.isAnimating) return;

    reset();
    nextTick(start);
  }

  /** End of a cycle. Looped animations keep animating through the hold before restarting. */
  function completeAnimation () {
    props().onComplete?.();
    if (!props().loop) finishAnimation();
  }

  /**
   * Drop the CSS animations for one style pass so they replay from their first frame on the same elements, keeping
   * text selection and not re-inserting anything into the aria-live region. Vue renders its restarting class and
   * removes it a tick later; here the class goes on and off the root around a forced style flush, all at once, so the
   * replay never waits for React to render (a timer's update can render after a paint, or, under act(), not until
   * the timers have all run).
   */
  function replayAnimations (callback?: () => void) {
    const el = root();
    if (el) {
      el.classList.add(RESTARTING_CLASS);
      // Flush styles while the animations are removed
      el.getBoundingClientRect();
      el.classList.remove(RESTARTING_CLASS);
    }
    callback?.();
  }

  /** Restart a looped animation: everything returns to its starting state at once */
  function restartCycle () {
    if (m.isUnmounted) return;

    clearTimeouts();
    replayAnimations(() => {
      measureWords();
      m.timelineElapsed = 0;
      props().onStart?.();
      runTimeline();
    });
  }

  /** Initialize content based on text prop or slot content */
  function initializeContent () {
    m.slotReadPending = false;

    if (props().text || slot()) {
      m.words = splitWords(props().text || getSlotText());
      m.wordWidths = [];
      m.slotSource = props().children;
    } else if (m.words.length && m.slotSource !== props().children) {
      // Word mode renders slot text as words, so the slot isn't mounted on an <Activity> reconnect. The words kept
      // from it are stale when the slot changed meanwhile: render the slot again and read it once it's there.
      readSlotNextTick();
      return;
    }
    // Otherwise the retained words are still valid (reading the missing slot would empty them). Either way the
    // stopped flags are published, as a reconnect after <Activity> hid a playing instance has them out of date.
    commit();

    // Whole-text modes start even while empty, e.g. a slot that streams its content in
    const startRequested = m.startRequested;
    m.startRequested = false;
    if ((props().autoStart || startRequested) && (isWholeText() || m.words.length > 0)) {
      nextTick(start);
    }
  }

  /** Clear the words so the slot renders, then read it on the next tick. start() waits for that read. */
  function readSlotNextTick () {
    m.words = [];
    m.wordWidths = [];
    commit();
    m.slotReadPending = true;
    nextTick(initializeContent);
  }

  // Vue's watchers

  function onTextChange () {
    // Whole-text modes render the text live and keep animating, as they always have
    if (isWholeText()) {
      m.words = splitWords(props().text);
      commit();

      // A finished single play runs again for the new text; a loop stopped with skipToEnd() stays at rest
      if (m.isComplete && props().autoStart && !props().loop) {
        reset();
        nextTick(start);
      }
      return;
    }

    reset();

    if (props().text) {
      initializeContent();
      return;
    }

    // Slot content only renders once the words are cleared, so read it on the next tick
    readSlotNextTick();
  }

  function onAnimationModeChange (oldMode: string) {
    const wasWholeText = Boolean(getModeSettings(oldMode).wholeText);

    // Whole-text modes render the slot live, so read it again when switching to or from word mode
    if (!props().text && wasWholeText !== isWholeText()) {
      const wasAnimating = m.isAnimating;
      reset();
      m.words = [];
      commit();
      m.slotReadPending = true;
      nextTick(() => {
        m.slotReadPending = false;
        m.words = splitWords(getSlotText());
        m.wordWidths = [];
        m.slotSource = props().children;
        commit();
        const startRequested = m.startRequested;
        m.startRequested = false;
        if (wasAnimating || startRequested) nextTick(start);
      });
      return;
    }

    restartIfAnimating();
  }

  function onAutoStartChange () {
    if (props().autoStart && !m.isAnimating && (isWholeText() || m.words.length)) {
      nextTick(start);
    }
  }

  function onLoopChange () {
    // Reschedule so the current cycle ends (or restarts) according to the new value
    if (m.isAnimating && !m.isPaused) {
      m.timelineElapsed = Date.now() - m.timelineStartedAt;
      clearTimeouts();
      runTimeline();
    }
  }

  return {
    start,
    pause,
    resume,
    reset,
    skipToEnd,
    measureWords,
    clearTimeouts,
    initWatchReducedMotion,
    initializeContent,
    restartIfAnimating,
    onTextChange,
    onAnimationModeChange,
    onAutoStartChange,
    onLoopChange,
  };
}

/**
 * Motion text animates text word by word, or as a whole, with a gradient, fade, slide, sweep or shimmer.
 * @see https://dialtone.dialpad.com/components/motion-text.html
 */
export function DtMotionText ({
  text = '',
  animationMode = 'gradient-in',
  speed = 300,
  autoStart = true,
  loop = false,
  respectsReducedMotion = true,
  screenReaderText = '',
  children,
  onStart,
  onComplete,
  onProgress,
  onPause,
  onResume,
  className,
  style,
  ref,
  ...restWithHtml
}: DtMotionTextProps) {
  // Not in the props type; dropped so an untyped caller can't make React throw on the root
  const { dangerouslySetInnerHTML: _dangerouslySetInnerHTML, ...rest } =
    restWithHtml as typeof restWithHtml & Pick<HTMLAttributes<HTMLSpanElement>, 'dangerouslySetInnerHTML'>;
  const rootRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);

  const current: LatestProps = {
    text, animationMode, speed, autoStart, loop, respectsReducedMotion, children,
    onStart, onComplete, onProgress, onPause, onResume,
  };
  // The props the timeline's timers and the handle's methods read. Updated after each commit, before the watchers run.
  const latest = useRef(current);
  const previous = useRef(current);

  const machineRef = useRef<Machine | null>(null);
  if (!machineRef.current) {
    machineRef.current = {
      words: splitWords(text),
      wordWidths: [],
      isRtl: false,
      isAnimating: false,
      isPaused: false,
      isComplete: false,
      isUnmounted: false,
      mountGeneration: 0,
      animationTimeouts: [],
      timelineStartedAt: 0,
      timelineElapsed: 0,
      prefersReducedMotion: false,
      animationKey: 0,
      cssIterations: 1,
      slotSource: children,
      slotReadPending: false,
      startRequested: false,
    };
  }
  const machine = machineRef.current;

  const [view, setView] = useState<View>(() => viewOf(machine));
  const [, forceRender] = useReducer((count: number) => count + 1, 0);
  const tickQueue = useRef<(() => void)[]>([]);

  const [controller] = useState(() => createController({
    machine,
    props: () => latest.current,
    root: () => rootRef.current,
    content: () => contentRef.current,
    slot: () => slotRef.current,
    commit: () => setView(viewOf(machine)),
    nextTick: (callback) => {
      tickQueue.current.push(callback);
      forceRender();
    },
  }));

  useLayoutEffect(() => {
    latest.current = current;
  });

  // Vue's watchers, in their declaration order. Vue runs them before it renders, with every prop already updated;
  // this runs them right after, before paint.
  useLayoutEffect(() => {
    const prev = previous.current;
    previous.current = latest.current;
    if (prev.text !== text) controller.onTextChange();
    if (prev.animationMode !== animationMode) controller.onAnimationModeChange(prev.animationMode);
    if (prev.autoStart !== autoStart) controller.onAutoStartChange();
    if (prev.speed !== speed) controller.restartIfAnimating();
    if (prev.loop !== loop) controller.onLoopChange();
  }, [controller, text, animationMode, autoStart, speed, loop]);

  // mounted / beforeUnmount
  useLayoutEffect(() => {
    machine.isUnmounted = false;
    const stopWatchingReducedMotion = controller.initWatchReducedMotion();
    controller.initializeContent();

    // Word widths change once web fonts load, which would misalign the gradient slices
    let active = true;
    document.fonts?.ready.then(() => {
      if (active && !machine.isUnmounted && machine.isAnimating) controller.measureWords();
    });

    return () => {
      active = false;
      machine.isUnmounted = true;
      machine.mountGeneration++;
      // React 19's <Activity> disconnects this effect without unmounting the component and reconnects it later. The
      // timers go with the cleanup, so a playing animation can't carry on: leave it startable.
      machine.isAnimating = false;
      machine.isPaused = false;
      machine.slotReadPending = false;
      machine.startRequested = false;
      tickQueue.current = [];
      controller.clearTimeouts();
      stopWatchingReducedMotion?.();
    };
  }, [controller, machine]);

  // Runs what nextTick() queued, once the commit it waited for is in the DOM. A microtask later, as Vue's nextTick, so
  // an unmount in the same task still cancels an autoStart.
  useLayoutEffect(() => {
    if (!tickQueue.current.length) return;
    const queued = tickQueue.current;
    tickQueue.current = [];
    const generation = machine.mountGeneration;
    queueMicrotask(() => {
      if (machine.isUnmounted || generation !== machine.mountGeneration) return;
      queued.forEach(callback => callback());
    });
  });

  // Declared after the effects above, which read the slot and the motion preference, so a callback ref that calls
  // start() on mount finds the content initialized and plays the same run as a call made later. React publishes the
  // handle (and calls a callback ref) from this layout effect, in declaration order.
  useImperativeHandle(ref, () => ({
    get element () {
      return rootRef.current;
    },
    start: controller.start,
    pause: controller.pause,
    resume: controller.resume,
    reset: controller.reset,
    skipToEnd: controller.skipToEnd,
  }), [controller]);

  const modeSettings = getModeSettings(animationMode);
  const isWholeText = Boolean(modeSettings.wholeText);
  const componentStyles = getComponentStyles(modeSettings, getSpeedScale(speed));

  // Per-word index (drives the stagger) and, in gradient modes, the slice of the shared gradient each word shows so it
  // reads as one continuous gradient across the text.
  const slices = modeSettings.gradient ? getGradientSlices(view.wordWidths, view.isRtl) : [];
  const wordStyles = view.words.map((_word, index) => {
    const slice = slices[index];
    return {
      '--d-motion-text-word-index': index,
      ...(slice && {
        '--d-motion-text-gradient-size': slice.size,
        '--d-motion-text-gradient-position': slice.position,
      }),
    } as CSSProperties;
  });

  const contentHidden = screenReaderText ? 'true' : undefined;

  let content: ReactNode;
  if (isWholeText) {
    // Whole-text modes animate the root, so the text and slot render as-is and stay live
    content = (
      <span
        key="whole-text"
        ref={slotRef}
        data-qa="dt-motion-text-content"
        className="d-motion-text__content"
        aria-hidden={contentHidden}
      >{text}{!text && children}</span>
    );
  } else if (view.words.length) {
    // Word-by-word animated content
    content = (
      <span
        key={`words-${view.animationKey}`}
        ref={contentRef}
        data-qa="dt-motion-text-content"
        className="d-motion-text__content"
        aria-hidden={contentHidden}
      >
        {view.words.map((word, wordIdx) => (
          <Fragment key={`${view.animationKey}-${wordIdx}`}>
            <span
              data-qa="dt-motion-text-word"
              className="d-motion-text__word"
              style={wordStyles[wordIdx]}
            >{word.text}</span>{word.space}
          </Fragment>
        ))}
      </span>
    );
  } else {
    // Slot content, rendered until its text has been split into words
    content = (
      <span
        key="fallback"
        ref={slotRef}
        className="d-motion-text__fallback"
      >
        {children}
      </span>
    );
  }

  return (
    <span
      data-qa="dt-motion-text"
      className={cx(
        'd-motion-text',
        `d-motion-text--${animationMode}`,
        {
          'd-motion-text--animating': view.isAnimating,
          'd-motion-text--paused': view.isPaused,
          'd-motion-text--complete': view.isComplete,
          'd-motion-text--looped': loop,
          'd-motion-text--respects-reduced-motion': respectsReducedMotion,
        },
        className,
      )}
      style={{ ...componentStyles, ...style } as CSSProperties}
      aria-live={view.isAnimating ? 'polite' : 'off'}
      aria-label={screenReaderText || undefined}
      {...rest}
      ref={rootRef}
    >
      {screenReaderText ? (
        <span
          data-qa="dt-motion-text-sr-only"
          className="d-motion-text__sr-only"
        >
          {screenReaderText}
        </span>
      ) : null}
      {content}
    </span>
  );
}
