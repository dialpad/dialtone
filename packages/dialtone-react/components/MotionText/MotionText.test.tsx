import { Activity, StrictMode, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { act, render, type RenderResult } from '@testing-library/react';
import { DtMotionText, type DtMotionTextHandle, type DtMotionTextProps } from './MotionText';
import { MOTION_TEXT_ANIMATION_MODES, MOTION_TEXT_SPEEDS, MOTION_TEXT_TIMING_PRESETS } from './MotionTextConstants';
import { getGradientSlices } from './utils';

/**
 * Auxiliary variables
 */
// Reference sentence from the "Motion-Text-Effects" Figma spec (six words)
const MOCK_FIGMA_TEXT = 'The AI platform for customer experience';
const MOCK_FIGMA_WORDS = MOCK_FIGMA_TEXT.split(' ');
// Word lengths 2, 4, 2 give round gradient slices when widths fall back to character counts
const MOCK_GRADIENT_TEXT = 'we move on';
const MOCK_SCREEN_READER_TEXT = 'Alternative text';

// Track timings at speed 300, as authored in the Figma spec
const MOCK_ENTER_VARS = {
  '--d-motion-text-enter-delay': '0ms',
  '--d-motion-text-enter-stagger': '60ms',
  '--d-motion-text-enter-duration': '300ms',
};
const MOCK_REVEAL_VARS = {
  '--d-motion-text-reveal-delay': '250ms',
  '--d-motion-text-reveal-stagger': '50ms',
  '--d-motion-text-reveal-duration': '300ms',
};
const MOCK_SWEEP_VARS = {
  '--d-motion-text-sweep-delay': '350ms',
  '--d-motion-text-sweep-stagger': '120ms',
  '--d-motion-text-sweep-duration': '1400ms',
  '--d-motion-text-sweep-fade': '250ms',
};
const MOCK_SHIMMER_VARS = {
  '--d-motion-text-shimmer-delay': '0ms',
  '--d-motion-text-shimmer-stagger': '0ms',
  '--d-motion-text-shimmer-duration': '3000ms',
};
const MOCK_TRACK_VAR_NAMES = Object.keys({
  ...MOCK_ENTER_VARS,
  ...MOCK_REVEAL_VARS,
  ...MOCK_SWEEP_VARS,
  ...MOCK_SHIMMER_VARS,
});

const MOCK_MODE_TRACK_VARS: Record<string, Record<string, string>> = {
  'gradient-in': { ...MOCK_ENTER_VARS, ...MOCK_REVEAL_VARS },
  'fade-in': MOCK_ENTER_VARS,
  'slide-in': MOCK_ENTER_VARS,
  'slide-in-gradient': { ...MOCK_ENTER_VARS, ...MOCK_REVEAL_VARS },
  'gradient-sweep': MOCK_SWEEP_VARS,
  shimmer: MOCK_SHIMMER_VARS,
  none: {},
};

const MOCK_GRADIENT_MODES = ['gradient-in', 'slide-in-gradient', 'gradient-sweep'] as const;
const MOCK_SOLID_MODES = ['fade-in', 'slide-in', 'shimmer'] as const;

// Enter stagger for each speed, as a string or a number
const MOCK_SPEED_STAGGERS: Record<string, string> = {
  100: '18ms', 200: '36ms', 300: '60ms', 400: '90ms', 500: '126ms',
};

interface MockTimeline { wordEnds: number[]; restart: number }

// For the six-word reference sentence at speed 300: when each word settles, and when a looped
// animation restarts (the 2000ms and 2650ms loops of the Figma prototypes)
const MOCK_REVEAL_WORD_ENDS = [550, 600, 650, 700, 750, 800];
const MOCK_ENTER_WORD_ENDS = [300, 360, 420, 480, 540, 600];
const MOCK_SWEEP_WORD_ENDS = [1750, 1870, 1990, 2110, 2230, 2350];
// Shimmer sweeps one band across the whole text, so every word finishes together
const MOCK_SHIMMER_WORD_ENDS = [3000, 3000, 3000, 3000, 3000, 3000];
const MOCK_MODE_TIMELINES: [DtMotionTextProps['animationMode'], MockTimeline][] = [
  ['gradient-in', { wordEnds: MOCK_REVEAL_WORD_ENDS, restart: 2000 }],
  ['fade-in', { wordEnds: MOCK_ENTER_WORD_ENDS, restart: 2000 }],
  ['slide-in', { wordEnds: MOCK_ENTER_WORD_ENDS, restart: 2000 }],
  ['slide-in-gradient', { wordEnds: MOCK_REVEAL_WORD_ENDS, restart: 2000 }],
  ['gradient-sweep', { wordEnds: MOCK_SWEEP_WORD_ENDS, restart: 2650 }],
  ['shimmer', { wordEnds: MOCK_SHIMMER_WORD_ENDS, restart: 3000 }],
];
// Modes whose words settle one after another and hold before looping
const MOCK_STAGGERED_TIMELINES = MOCK_MODE_TIMELINES.filter(([mode]) => mode !== 'shimmer');

/**
 * Environment Constants variables
 */
const baseProps: DtMotionTextProps = {
  text: MOCK_FIGMA_TEXT,
  autoStart: false,
};
const baseAttrs = {};

/**
 * Environment variables
 */
let mockProps: DtMotionTextProps = {};
let mockAttrs: DtMotionTextProps = {};
let mockChildren: ReactNode;

type EventName = 'start' | 'complete' | 'progress' | 'pause' | 'resume';

describe('DtMotionText Tests', () => {
  let wrapper: RenderResult | null = null;
  let handle: DtMotionTextHandle | null = null;
  let emitted: Record<EventName, unknown[][]>;

  const record = (event: EventName) => (...args: unknown[]) => { emitted[event].push(args); };

  const element = () => (
    <StrictMode>
      <DtMotionText
        ref={(instance) => { handle = instance; }}
        {...baseProps}
        {...mockProps}
        {...baseAttrs}
        {...mockAttrs}
        onStart={record('start')}
        onComplete={record('complete')}
        onProgress={record('progress')}
        onPause={record('pause')}
        onResume={record('resume')}
      >
        {mockChildren}
      </DtMotionText>
    </StrictMode>
  );

  const updateWrapper = () => {
    wrapper?.unmount();
    emitted = { start: [], complete: [], progress: [], pause: [], resume: [] };
    wrapper = render(element());
  };

  // Vue Test Utils' setProps: the change renders, and what the watchers queued for the next tick is still pending
  const setProps = (props: DtMotionTextProps) => {
    mockProps = { ...mockProps, ...props };
    wrapper?.rerender(element());
  };

  const setChildren = (children: ReactNode) => {
    mockChildren = children;
    wrapper?.rerender(element());
  };

  const vm = () => handle as DtMotionTextHandle;
  const call = (method: 'start' | 'pause' | 'resume' | 'reset' | 'skipToEnd') => act(() => { vm()[method](); });

  // Helpers
  const getRoot = () => wrapper!.container.querySelector<HTMLElement>('[data-qa="dt-motion-text"]')!;
  const findContent = () => wrapper!.container.querySelector<HTMLElement>('[data-qa="dt-motion-text-content"]');
  const findWords = () => Array.from(
    wrapper!.container.querySelectorAll<HTMLElement>('[data-qa="dt-motion-text-word"]'),
  );
  const findScreenReaderText = () => wrapper!.container.querySelector('[data-qa="dt-motion-text-sr-only"]');
  const findWordTexts = () => findWords().map(word => word.textContent);
  const getWordStyle = (index: number, property: string) => findWords()[index].style.getPropertyValue(property);
  const getRootStyle = (property: string) => getRoot().style.getPropertyValue(property);
  const getEmittedCount = (event: EventName) => emitted[event].length;
  const getProgressPayloads = () => emitted.progress.map(([payload]) => payload as Record<string, number>);

  // Vue's nextTick: runs what the component queued for after its next render
  const nextTick = () => act(async () => {});

  const advance = (ms: number) => act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

  const start = async () => {
    await act(async () => { vm().start(); });
  };

  // autoStart calls start() on the tick after mount
  const flushAutoStart = nextTick;

  // Records the root's classes each time the component flushes its styles to replay the CSS animations
  const recordStyleFlushes = () => {
    const root = getRoot();
    const flushes: string[][] = [];
    vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => {
      flushes.push([...root.classList]);
      return new DOMRect();
    });
    return flushes;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    updateWrapper();
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    mockProps = {};
    mockAttrs = {};
    mockChildren = undefined;
  });

  describe('Presentation Tests', () => {
    describe('Default render', () => {
      it('should render the component with the base class', () => {
        expect(getRoot()).toBeInTheDocument();
        expect(getRoot()).toHaveClass('d-motion-text');
      });

      it('should apply the gradient-in mode class by default', () => {
        expect(getRoot()).toHaveClass('d-motion-text--gradient-in');
      });

      it('should render the text before the animation starts', () => {
        expect(findContent()?.textContent).toBe(MOCK_FIGMA_TEXT);
      });
    });

    describe('Animation mode variants', () => {
      it.each(MOTION_TEXT_ANIMATION_MODES)('should apply the d-motion-text--%s class', (mode) => {
        mockProps = { animationMode: mode };
        updateWrapper();

        expect(getRoot()).toHaveClass(`d-motion-text--${mode}`);
      });
    });

    describe('Track timing variables', () => {
      it('should define expected timings for every animation mode', () => {
        expect(Object.keys(MOCK_MODE_TRACK_VARS).sort()).toEqual([...MOTION_TEXT_ANIMATION_MODES].sort());
      });

      it.each(Object.entries(MOCK_MODE_TRACK_VARS))('should set only the %s track timings', (mode, expectedVars) => {
        mockProps = { animationMode: mode as DtMotionTextProps['animationMode'] };
        updateWrapper();

        MOCK_TRACK_VAR_NAMES.forEach(name => {
          expect(getRootStyle(name)).toBe(expectedVars[name] ?? '');
        });
      });
    });

    describe('Speed variants', () => {
      it.each([
        [100, '18ms', '90ms'],
        [200, '36ms', '180ms'],
        [300, '60ms', '300ms'],
        [400, '90ms', '450ms'],
        [500, '126ms', '630ms'],
      ] as const)('should scale the enter timings for speed %s', (speed, stagger, duration) => {
        mockProps = { animationMode: 'fade-in', speed };
        updateWrapper();

        expect(getRootStyle('--d-motion-text-enter-stagger')).toBe(stagger);
        expect(getRootStyle('--d-motion-text-enter-duration')).toBe(duration);
      });

      it('should accept the speed as a string', () => {
        mockProps = { animationMode: 'fade-in', speed: '100' };
        updateWrapper();

        expect(getRootStyle('--d-motion-text-enter-stagger')).toBe('18ms');
      });

      it('should scale every timing of a track', () => {
        mockProps = { animationMode: 'gradient-sweep', speed: 100 };
        updateWrapper();

        expect(getRootStyle('--d-motion-text-sweep-delay')).toBe('105ms');
        expect(getRootStyle('--d-motion-text-sweep-stagger')).toBe('36ms');
        expect(getRootStyle('--d-motion-text-sweep-duration')).toBe('420ms');
        expect(getRootStyle('--d-motion-text-sweep-fade')).toBe('75ms');
      });
    });

    describe('Gradient slices', () => {
      // jsdom has no layout, so word widths fall back to character counts (2, 4 and 2 here)
      it.each(MOCK_GRADIENT_MODES)('should give each word its slice of one continuous gradient in %s', async (mode) => {
        mockProps = { animationMode: mode, text: MOCK_GRADIENT_TEXT };
        updateWrapper();
        await start();

        expect(getWordStyle(0, '--d-motion-text-gradient-size')).toBe('400% 100%');
        expect(getWordStyle(0, '--d-motion-text-gradient-position')).toBe('0% 0%');
        expect(getWordStyle(1, '--d-motion-text-gradient-size')).toBe('200% 100%');
        expect(getWordStyle(1, '--d-motion-text-gradient-position')).toBe('50% 0%');
        expect(getWordStyle(2, '--d-motion-text-gradient-size')).toBe('400% 100%');
        expect(getWordStyle(2, '--d-motion-text-gradient-position')).toBe('100% 0%');
      });

      it('should use measured word widths when layout is available', async () => {
        const widths: Record<string, number> = { we: 20, move: 50, on: 30 };
        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
          return { width: widths[this.textContent ?? ''] ?? 0 } as DOMRect;
        });
        mockProps = { text: MOCK_GRADIENT_TEXT };
        updateWrapper();
        await start();

        expect(getWordStyle(0, '--d-motion-text-gradient-size')).toBe('500% 100%');
        expect(getWordStyle(1, '--d-motion-text-gradient-size')).toBe('200% 100%');
        expect(getWordStyle(1, '--d-motion-text-gradient-position')).toBe('40% 0%');
      });

      it('should show the whole gradient on a single word', async () => {
        mockProps = { text: 'Hello' };
        updateWrapper();
        await start();

        expect(getWordStyle(0, '--d-motion-text-gradient-size')).toBe('100% 100%');
        expect(getWordStyle(0, '--d-motion-text-gradient-position')).toBe('0% 0%');
      });

      it.each(MOCK_SOLID_MODES)('should not set gradient slices in %s', async (mode) => {
        mockProps = { animationMode: mode, text: MOCK_GRADIENT_TEXT };
        updateWrapper();
        await start();

        // Shimmer renders the text whole, so it has no words at all; fade and slide render a span per word
        expect(findContent()?.textContent).toBe(MOCK_GRADIENT_TEXT);
        expect(findWords()).toHaveLength(mode === 'shimmer' ? 0 : MOCK_GRADIENT_TEXT.split(' ').length);
        findWords().forEach((_word, index) => {
          expect(getWordStyle(index, '--d-motion-text-gradient-size')).toBe('');
          expect(getWordStyle(index, '--d-motion-text-gradient-position')).toBe('');
        });
      });
    });

    describe('State classes', () => {
      it('should have no playback state classes before starting', () => {
        expect(getRoot()).not.toHaveClass('d-motion-text--animating');
        expect(getRoot()).not.toHaveClass('d-motion-text--paused');
        expect(getRoot()).not.toHaveClass('d-motion-text--complete');
      });

      it('should add the animating class once started', async () => {
        await start();

        expect(getRoot()).toHaveClass('d-motion-text--animating');
      });

      it('should add the paused class while paused', async () => {
        await start();
        call('pause');
        await nextTick();

        expect(getRoot()).toHaveClass('d-motion-text--paused');
        expect(getRoot()).toHaveClass('d-motion-text--animating');
      });

      it('should swap animating for complete once every word has settled', async () => {
        await start();
        await advance(800);

        expect(getRoot()).toHaveClass('d-motion-text--complete');
        expect(getRoot()).not.toHaveClass('d-motion-text--animating');
      });

      it('should add the looped class when loop is true', async () => {
        setProps({ loop: true });

        expect(getRoot()).toHaveClass('d-motion-text--looped');
      });

      it('should not add the looped class by default', () => {
        expect(getRoot()).not.toHaveClass('d-motion-text--looped');
      });

      it('should add the respects-reduced-motion class by default', () => {
        expect(getRoot()).toHaveClass('d-motion-text--respects-reduced-motion');
      });

      it('should not add the respects-reduced-motion class when respectsReducedMotion is false', () => {
        mockProps = { respectsReducedMotion: false };
        updateWrapper();

        expect(getRoot()).not.toHaveClass('d-motion-text--respects-reduced-motion');
      });
    });
  });

  describe('Animation Control Tests', () => {
    describe('When autoStart is true', () => {
      it('should start on mount', async () => {
        mockProps = { autoStart: true };
        updateWrapper();
        await flushAutoStart();

        expect(getEmittedCount('start')).toBe(1);
        expect(getRoot()).toHaveClass('d-motion-text--animating');
      });

      it('should not start when there is no text', async () => {
        mockProps = { autoStart: true, text: '' };
        updateWrapper();
        await flushAutoStart();

        expect(getEmittedCount('start')).toBe(0);
      });
    });

    describe('When autoStart is false', () => {
      it('should not start on mount', async () => {
        await nextTick();

        expect(getEmittedCount('start')).toBe(0);
        expect(getRoot()).not.toHaveClass('d-motion-text--animating');
      });
    });

    it('should ignore start() while already animating', async () => {
      await start();
      await start();

      expect(getEmittedCount('start')).toBe(1);
    });

    it('should replay when started again after completing', async () => {
      await start();
      await advance(800);
      await start();

      expect(getEmittedCount('start')).toBe(2);
      expect(getRoot()).toHaveClass('d-motion-text--animating');
      expect(getRoot()).not.toHaveClass('d-motion-text--complete');
    });

    describe('Pause and resume', () => {
      beforeEach(() => {
        mockProps = { animationMode: 'fade-in' };
        updateWrapper();
      });

      it('should freeze the timeline while paused', async () => {
        await start();
        await advance(330);
        call('pause');
        await advance(5000);

        expect(getEmittedCount('pause')).toBe(1);
        expect(getEmittedCount('progress')).toBe(1);
        expect(getEmittedCount('complete')).toBe(0);
      });

      it('should continue from the elapsed time when resumed', async () => {
        await start();
        await advance(330);
        call('pause');
        await advance(5000);
        call('resume');

        // Second word settles at 360ms, 30ms after the pause point
        await advance(29);
        expect(getEmittedCount('progress')).toBe(1);
        await advance(1);
        expect(getEmittedCount('progress')).toBe(2);
        // Last word settles at 600ms
        await advance(239);
        expect(getEmittedCount('complete')).toBe(0);
        await advance(1);
        expect(getEmittedCount('progress')).toBe(6);
        expect(getEmittedCount('complete')).toBe(1);
      });

      it('should emit resume and drop the paused class when resumed', async () => {
        await start();
        call('pause');
        call('resume');
        await nextTick();

        expect(getEmittedCount('resume')).toBe(1);
        expect(getRoot()).not.toHaveClass('d-motion-text--paused');
      });

      it('should ignore pause() before the animation starts', async () => {
        call('pause');
        await nextTick();

        expect(getEmittedCount('pause')).toBe(0);
        expect(getRoot()).not.toHaveClass('d-motion-text--paused');
      });

      it('should ignore pause() while already paused', async () => {
        await start();
        call('pause');
        call('pause');

        expect(getEmittedCount('pause')).toBe(1);
      });

      it('should ignore resume() when not paused', async () => {
        await start();
        call('resume');

        expect(getEmittedCount('resume')).toBe(0);
      });
    });

    describe('Reset', () => {
      it('should clear every playback state class', async () => {
        await start();
        call('pause');
        call('reset');
        await nextTick();

        expect(getRoot()).not.toHaveClass('d-motion-text--animating');
        expect(getRoot()).not.toHaveClass('d-motion-text--paused');
        expect(getRoot()).not.toHaveClass('d-motion-text--complete');
      });

      it('should cancel pending events', async () => {
        mockProps = { animationMode: 'fade-in' };
        updateWrapper();
        await start();
        await advance(330);
        call('reset');
        await advance(5000);

        expect(getEmittedCount('progress')).toBe(1);
        expect(getEmittedCount('complete')).toBe(0);
      });

      it('should re-render the words in their starting state', async () => {
        await start();
        const previousWords = findWords();
        call('reset');
        await nextTick();

        expect(findWords()).toHaveLength(MOCK_FIGMA_WORDS.length);
        findWords().forEach(word => {
          expect(previousWords).not.toContain(word);
        });
      });

      it('should replay from the beginning when started again', async () => {
        mockProps = { animationMode: 'fade-in' };
        updateWrapper();
        await start();
        await advance(400);
        call('reset');
        await start();
        await advance(299);

        expect(getEmittedCount('progress')).toBe(2);
        await advance(1);
        expect(getProgressPayloads()[2].wordsComplete).toBe(1);
      });
    });

    describe('When the handle outlives the component', () => {
      it('should ignore skipToEnd() and emit nothing', async () => {
        await start();
        const detached = vm();
        wrapper!.unmount();
        wrapper = null;
        act(() => { detached.skipToEnd(); });
        await advance(5000);

        expect(getEmittedCount('complete')).toBe(0);
      });
    });

    describe('When the component is hidden and shown again with <Activity>', () => {
      it('should be startable again after being hidden mid-animation', async () => {
        const activity = (mode: 'visible' | 'hidden') => (
          <Activity mode={mode}>
            <DtMotionText
              ref={(instance) => { handle = instance; }}
              {...baseProps}
              onStart={record('start')}
              onComplete={record('complete')}
            />
          </Activity>
        );
        wrapper!.unmount();
        emitted = { start: [], complete: [], progress: [], pause: [], resume: [] };
        wrapper = render(activity('visible'));
        await start();
        wrapper.rerender(activity('hidden'));
        wrapper.rerender(activity('visible'));
        await start();
        await advance(MOCK_REVEAL_WORD_ENDS.at(-1)!);

        expect(getEmittedCount('start')).toBe(2);
        expect(getEmittedCount('complete')).toBe(1);
      });

      it('should keep slotted words and play them again after being hidden mid-animation', async () => {
        const activity = (mode: 'visible' | 'hidden') => (
          <Activity mode={mode}>
            <DtMotionText
              ref={(instance) => { handle = instance; }}
              animationMode="gradient-in"
              autoStart={false}
              onStart={record('start')}
              onProgress={record('progress')}
              onComplete={record('complete')}
            >
              {MOCK_FIGMA_TEXT}
            </DtMotionText>
          </Activity>
        );
        wrapper!.unmount();
        emitted = { start: [], complete: [], progress: [], pause: [], resume: [] };
        wrapper = render(activity('visible'));
        await start();
        await advance(100);
        wrapper.rerender(activity('hidden'));
        wrapper.rerender(activity('visible'));
        await nextTick();
        emitted.progress = [];
        await start();
        await advance(MOCK_REVEAL_WORD_ENDS.at(-1)!);

        expect(findWordTexts()).toEqual(MOCK_FIGMA_WORDS);
        expect(getProgressPayloads().at(-1)).toEqual({
          wordsComplete: 6,
          totalWords: 6,
          progress: 1,
        });
        expect(getEmittedCount('complete')).toBe(1);
      });

      it('should publish the stopped state when it keeps slotted words', async () => {
        const activity = (mode: 'visible' | 'hidden') => (
          <Activity mode={mode}>
            <DtMotionText ref={(instance) => { handle = instance; }} animationMode="gradient-in" autoStart={false}>
              {MOCK_FIGMA_TEXT}
            </DtMotionText>
          </Activity>
        );
        wrapper!.unmount();
        wrapper = render(activity('visible'));
        await start();
        await advance(100);
        expect(getRoot().classList).toContain('d-motion-text--animating');
        wrapper.rerender(activity('hidden'));
        wrapper.rerender(activity('visible'));
        await nextTick();

        expect(getRoot().classList).not.toContain('d-motion-text--animating');
        expect(getRoot().getAttribute('aria-live')).toBe('off');
        expect(findWordTexts()).toEqual(MOCK_FIGMA_WORDS);
      });

      it('should read the new slot content when it changed while hidden', async () => {
        const activity = (mode: 'visible' | 'hidden', children: string) => (
          <Activity mode={mode}>
            <DtMotionText ref={(instance) => { handle = instance; }} animationMode="gradient-in" autoStart={false}>
              {children}
            </DtMotionText>
          </Activity>
        );
        wrapper!.unmount();
        wrapper = render(activity('visible', 'Old status'));
        await nextTick();
        expect(findWordTexts()).toEqual(['Old', 'status']);
        wrapper.rerender(activity('hidden', 'Old status'));
        wrapper.rerender(activity('hidden', 'New status here'));
        wrapper.rerender(activity('visible', 'New status here'));
        await nextTick();

        expect(findWordTexts()).toEqual(['New', 'status', 'here']);
      });

      it('should play the new slot words when start() is called as the text prop is removed', async () => {
        let startOnAttach = false;
        const activity = (mode: 'visible' | 'hidden', text: string | undefined, children?: string) => (
          <Activity mode={mode}>
            <DtMotionText
              ref={(instance) => {
                handle = instance;
                if (startOnAttach) instance?.start();
              }}
              text={text}
              animationMode="gradient-in"
              autoStart={false}
              onStart={record('start')}
              onComplete={record('complete')}
              onProgress={record('progress')}
            >
              {children}
            </DtMotionText>
          </Activity>
        );
        wrapper!.unmount();
        emitted = { start: [], complete: [], progress: [], pause: [], resume: [] };
        wrapper = render(activity('visible', 'Some text'));
        await nextTick();
        wrapper.rerender(activity('hidden', 'Some text'));
        startOnAttach = true;
        wrapper.rerender(activity('visible', undefined, 'Slot words here'));
        await nextTick();

        // Playing the slot words, not completing on none
        expect(getRoot().classList).toContain('d-motion-text--animating');
        await advance(MOCK_REVEAL_WORD_ENDS.at(-1)!);

        expect(findWordTexts()).toEqual(['Slot', 'words', 'here']);
        expect(getEmittedCount('start')).toBe(1);
        expect(getEmittedCount('progress')).toBe(3);
        expect(getEmittedCount('complete')).toBe(1);
      });

      it('should play the slot words when start() is called as the mode switches from shimmer to a word mode', async () => {
        let startOnAttach = false;
        const activity = (mode: 'visible' | 'hidden', animationMode: 'shimmer' | 'gradient-in') => (
          <Activity mode={mode}>
            <DtMotionText
              ref={(instance) => {
                handle = instance;
                if (startOnAttach) instance?.start();
              }}
              animationMode={animationMode}
              autoStart={false}
              onStart={record('start')}
              onComplete={record('complete')}
              onProgress={record('progress')}
            >
              Slot words here
            </DtMotionText>
          </Activity>
        );
        wrapper!.unmount();
        emitted = { start: [], complete: [], progress: [], pause: [], resume: [] };
        wrapper = render(activity('visible', 'shimmer'));
        await nextTick();
        wrapper.rerender(activity('hidden', 'shimmer'));
        startOnAttach = true;
        wrapper.rerender(activity('visible', 'gradient-in'));
        await nextTick();

        expect(getRoot().classList).toContain('d-motion-text--animating');
        await advance(MOCK_REVEAL_WORD_ENDS.at(-1)!);

        expect(findWordTexts()).toEqual(['Slot', 'words', 'here']);
        expect(getEmittedCount('start')).toBe(1);
        expect(getEmittedCount('progress')).toBe(3);
        expect(getEmittedCount('complete')).toBe(1);
      });

      it.each([
        ['a word mode to shimmer', 'gradient-in', 'shimmer'],
        ['shimmer to a word mode', 'shimmer', 'gradient-in'],
      ] as const)('should autoStart again on a reveal after the mode switched from %s while hidden', async (_, from, to) => {
        const activity = (mode: 'visible' | 'hidden', animationMode: 'shimmer' | 'gradient-in') => (
          <Activity mode={mode}>
            <DtMotionText animationMode={animationMode} autoStart onStart={record('start')}>
              Slot words here
            </DtMotionText>
          </Activity>
        );
        wrapper!.unmount();
        emitted = { start: [], complete: [], progress: [], pause: [], resume: [] };
        wrapper = render(activity('visible', from));
        await nextTick();
        expect(getEmittedCount('start')).toBe(1);
        wrapper.rerender(activity('hidden', from));
        wrapper.rerender(activity('hidden', to));
        wrapper.rerender(activity('visible', to));
        await nextTick();
        await nextTick();

        expect(getEmittedCount('start')).toBe(2);
        expect(getRoot().classList).toContain('d-motion-text--animating');
      });
    });

    describe('When start() is called while the slot words are being read', () => {
      // A parent's layout effect runs after the component's watchers, so the text prop's removal has started the read
      const Parent = ({ text, then }: { text?: string; then?: 'skipToEnd' | 'pause' }) => {
        const ref = useRef<DtMotionTextHandle>(null);
        useLayoutEffect(() => {
          if (text !== undefined || !then) return;
          ref.current?.start();
          ref.current?.[then]();
        }, [text, then]);
        return (
          <DtMotionText
            ref={ref}
            text={text}
            animationMode="gradient-in"
            autoStart={false}
            onStart={record('start')}
            onComplete={record('complete')}
            onProgress={record('progress')}
          >
            Slot words here
          </DtMotionText>
        );
      };

      it.each(['skipToEnd', 'pause'] as const)('should stay at rest when %s() follows', async (then) => {
        wrapper!.unmount();
        emitted = { start: [], complete: [], progress: [], pause: [], resume: [] };
        wrapper = render(<Parent text="Some text" />);
        await nextTick();
        wrapper.rerender(<Parent then={then} />);
        await nextTick();
        await advance(MOCK_REVEAL_WORD_ENDS.at(-1)!);

        expect(findWordTexts()).toEqual(['Slot', 'words', 'here']);
        expect(getRoot().classList).not.toContain('d-motion-text--animating');
        expect(getEmittedCount('start')).toBe(0);
        expect(getEmittedCount('progress')).toBe(0);
      });

      it('should play the slot words once they are read', async () => {
        wrapper!.unmount();
        emitted = { start: [], complete: [], progress: [], pause: [], resume: [] };
        const Starter = () => {
          const ref = useRef<DtMotionTextHandle>(null);
          const [text, setText] = useState<string | undefined>('Some text');
          useLayoutEffect(() => { if (text === undefined) ref.current?.start(); }, [text]);
          starter = setText;
          return (
            <DtMotionText ref={ref} text={text} animationMode="gradient-in" autoStart={false}
              onStart={record('start')} onComplete={record('complete')} onProgress={record('progress')}>
              Slot words here
            </DtMotionText>
          );
        };
        let starter: (text: string | undefined) => void = () => {};
        wrapper = render(<Starter />);
        await nextTick();
        await act(async () => { starter(undefined); });
        await nextTick();
        await advance(MOCK_REVEAL_WORD_ENDS.at(-1)!);

        expect(getEmittedCount('start')).toBe(1);
        expect(getEmittedCount('progress')).toBe(3);
        expect(getEmittedCount('complete')).toBe(1);
      });
    });

    describe('When a consumer passes dangerouslySetInnerHTML', () => {
      it('should not accept it as a prop', () => {
        // @ts-expect-error dangerouslySetInnerHTML is not part of DtMotionTextProps
        const props: DtMotionTextProps = { dangerouslySetInnerHTML: { __html: '<b>x</b>' } };

        expect(props).toBeDefined();
      });

      it('should ignore it from an untyped caller and render the text', () => {
        const untyped = { text: MOCK_FIGMA_TEXT, autoStart: false, dangerouslySetInnerHTML: { __html: '<b>x</b>' } };
        wrapper!.unmount();
        wrapper = render(<DtMotionText {...untyped} />);

        expect(getRoot().querySelector('b')).toBeNull();
        expect(findWordTexts()).toEqual(MOCK_FIGMA_WORDS);
      });
    });

    describe('When start() is called from a callback ref', () => {
      it('should play slotted words from the mount, as a call made later does', async () => {
        wrapper!.unmount();
        emitted = { start: [], complete: [], progress: [], pause: [], resume: [] };
        wrapper = render(
          <DtMotionText
            ref={(instance) => {
              instance?.start();
              handle = instance;
            }}
            animationMode="gradient-in"
            autoStart={false}
            onStart={record('start')}
            onProgress={record('progress')}
            onComplete={record('complete')}
          >
            {MOCK_FIGMA_TEXT}
          </DtMotionText>,
        );
        await nextTick();

        expect(findWordTexts()).toEqual(MOCK_FIGMA_WORDS);
        expect(getRoot()).toHaveClass('d-motion-text--animating');

        await advance(MOCK_REVEAL_WORD_ENDS.at(-1)!);

        expect(getEmittedCount('start')).toBe(1);
        expect(getEmittedCount('progress')).toBe(MOCK_FIGMA_WORDS.length);
        expect(getEmittedCount('complete')).toBe(1);
      });
    });

    describe('Skip to end', () => {
      it('should settle every word immediately', async () => {
        await start();
        await advance(100);
        call('skipToEnd');
        await nextTick();

        expect(getRoot()).toHaveClass('d-motion-text--complete');
        expect(getRoot()).not.toHaveClass('d-motion-text--animating');
      });

      it('should emit complete once and stop the timeline', async () => {
        await start();
        await advance(100);
        call('skipToEnd');
        await advance(0);
        expect(getEmittedCount('complete')).toBe(1);

        await advance(5000);
        expect(getEmittedCount('complete')).toBe(1);
        expect(getEmittedCount('progress')).toBe(0);
      });
    });

    describe('When animationMode is none', () => {
      it('should render at rest and complete as soon as it starts', async () => {
        mockProps = { animationMode: 'none' };
        updateWrapper();
        await start();
        await advance(0);

        expect(getRoot()).toHaveClass('d-motion-text--complete');
        expect(getEmittedCount('complete')).toBe(1);
        expect(getEmittedCount('progress')).toBe(0);
      });
    });

    describe('When loop is true', () => {
      it.each(MOCK_STAGGERED_TIMELINES)('should restart %s after its Figma loop duration', async (mode, timeline) => {
        const cycleEnd = timeline.wordEnds.at(-1)!;
        mockProps = { animationMode: mode, loop: true };
        updateWrapper();
        await start();

        await advance(cycleEnd);
        expect(getEmittedCount('complete')).toBe(1);
        expect(getRoot()).toHaveClass('d-motion-text--animating');
        expect(getRoot()).not.toHaveClass('d-motion-text--complete');

        await advance(timeline.restart - cycleEnd - 1);
        expect(getEmittedCount('start')).toBe(1);
        await advance(1);
        expect(getEmittedCount('start')).toBe(2);
      });

      it('should restart shimmer back to back as soon as the band finishes', async () => {
        mockProps = { animationMode: 'shimmer', loop: true };
        updateWrapper();
        await start();

        await advance(2999);
        expect(getEmittedCount('start')).toBe(1);
        await advance(1);
        expect(getEmittedCount('complete')).toBe(1);
        expect(getEmittedCount('start')).toBe(2);
      });

      it('should replay the cycle on the same word elements', async () => {
        mockProps = { loop: true };
        updateWrapper();
        await start();
        const previousWords = findWords();
        await advance(2000);

        expect(getEmittedCount('start')).toBe(2);
        expect(findWords()).toHaveLength(previousWords.length);
        findWords().forEach((word, index) => {
          expect(word).toBe(previousWords[index]);
        });
      });

      // Vue renders its restarting class and drops it a tick later; the port puts it on and takes it off around the
      // style flush that replays the animations, so it's observed at that flush.
      it('should drop the animations for one style pass when the cycle restarts', async () => {
        mockProps = { loop: true };
        updateWrapper();
        await start();
        const flushes = recordStyleFlushes();
        await advance(2000);

        expect(getEmittedCount('start')).toBe(2);
        expect(flushes).toHaveLength(1);
        expect(flushes[0]).toContain('d-motion-text--restarting');
        expect(getRoot()).not.toHaveClass('d-motion-text--restarting');
      });

      it('should emit progress from the first word again on each cycle', async () => {
        mockProps = { animationMode: 'fade-in', loop: true };
        updateWrapper();
        await start();
        await advance(2000);
        await advance(300);

        expect(getProgressPayloads()).toHaveLength(MOCK_FIGMA_WORDS.length + 1);
        expect(getProgressPayloads().at(-1)!.wordsComplete).toBe(1);
      });

      it('should keep looping', async () => {
        mockProps = { loop: true };
        updateWrapper();
        await start();
        await advance(6000);

        expect(getEmittedCount('start')).toBe(4);
        expect(getEmittedCount('complete')).toBe(3);
      });

      it('should stop at the end of the cycle when loop is turned off during the hold', async () => {
        mockProps = { loop: true };
        updateWrapper();
        await start();
        await advance(1000);
        setProps({ loop: false });
        await advance(5000);

        expect(getEmittedCount('start')).toBe(1);
        expect(getRoot()).toHaveClass('d-motion-text--complete');
      });
    });

    describe('When loop is turned on mid-cycle', () => {
      it('should loop from the end of the current cycle', async () => {
        await start();
        await advance(100);
        setProps({ loop: true });
        await advance(1900);

        expect(getEmittedCount('start')).toBe(2);
      });
    });
  });

  describe('Mid-animation Changes', () => {
    describe('When animationMode changes while animating', () => {
      it('should restart with the new mode timing', async () => {
        await start();
        await advance(100);
        setProps({ animationMode: 'fade-in' });
        await nextTick();

        expect(getEmittedCount('start')).toBe(2);
        expect(getRootStyle('--d-motion-text-reveal-delay')).toBe('');

        await advance(MOCK_ENTER_WORD_ENDS.at(-1)!);
        expect(getEmittedCount('complete')).toBe(1);
      });
    });

    describe('When speed changes while animating', () => {
      it('should restart at the new speed', async () => {
        await start();
        await advance(100);
        setProps({ speed: 100 });
        await nextTick();

        expect(getEmittedCount('start')).toBe(2);

        await advance(MOCK_REVEAL_WORD_ENDS.at(-1)! * 0.3);
        expect(getEmittedCount('complete')).toBe(1);
      });
    });

    describe('When start() is called right after skipToEnd()', () => {
      it('should only emit complete when the new cycle ends', async () => {
        act(() => {
          vm().skipToEnd();
          vm().start();
        });
        await advance(0);

        expect(getEmittedCount('complete')).toBe(0);

        await advance(MOCK_REVEAL_WORD_ENDS.at(-1)!);
        expect(getEmittedCount('complete')).toBe(1);
      });
    });

    describe('When unmounted before autoStart runs', () => {
      it('should not start or emit any events', async () => {
        mockProps = { autoStart: true, loop: true };
        updateWrapper();
        wrapper!.unmount();
        wrapper = null;
        await flushAutoStart();
        await advance(5000);

        expect(getEmittedCount('start')).toBe(0);
        expect(getEmittedCount('progress')).toBe(0);
        expect(getEmittedCount('complete')).toBe(0);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('Live region', () => {
      it('should set aria-live to off before starting', () => {
        expect(getRoot()).toHaveAttribute('aria-live', 'off');
      });

      it('should set aria-live to polite while animating', async () => {
        await start();

        expect(getRoot()).toHaveAttribute('aria-live', 'polite');
      });

      it('should set aria-live to off once complete', async () => {
        await start();
        await advance(800);

        expect(getRoot()).toHaveAttribute('aria-live', 'off');
      });
    });

    describe('When screenReaderText is provided', () => {
      beforeEach(() => {
        mockProps = { screenReaderText: MOCK_SCREEN_READER_TEXT };
        updateWrapper();
      });

      it('should render the screen reader text in a visually hidden span', () => {
        const srText = findScreenReaderText();

        expect(srText).toBeInTheDocument();
        expect(srText).toHaveClass('d-motion-text__sr-only');
        expect(srText?.textContent?.trim()).toBe(MOCK_SCREEN_READER_TEXT);
      });

      it('should set aria-label', () => {
        expect(getRoot()).toHaveAttribute('aria-label', MOCK_SCREEN_READER_TEXT);
      });

      it('should hide the animated words from assistive technology', () => {
        expect(findContent()).toHaveAttribute('aria-hidden', 'true');
      });
    });

    describe('When screenReaderText is not provided', () => {
      it('should not render the screen reader span', () => {
        expect(findScreenReaderText()).not.toBeInTheDocument();
      });

      it('should not set aria-label', () => {
        expect(getRoot()).not.toHaveAttribute('aria-label');
      });

      it('should leave the animated words exposed to assistive technology', async () => {
        await start();

        expect(findContent()).not.toHaveAttribute('aria-hidden');
      });
    });

    describe('When the user prefers reduced motion', () => {
      beforeEach(() => {
        vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
      });

      it('should complete without animating', async () => {
        mockProps = { autoStart: true };
        updateWrapper();
        await flushAutoStart();
        await advance(0);

        expect(getEmittedCount('start')).toBe(1);
        expect(getEmittedCount('complete')).toBe(1);
        expect(getRoot()).toHaveClass('d-motion-text--complete');
        expect(getRoot()).not.toHaveClass('d-motion-text--animating');

        await advance(5000);
        expect(getEmittedCount('progress')).toBe(0);
      });

      it('should animate when respectsReducedMotion is false', async () => {
        mockProps = { autoStart: true, respectsReducedMotion: false };
        updateWrapper();
        await flushAutoStart();

        expect(getRoot()).toHaveClass('d-motion-text--animating');
      });
    });
  });

  describe('When the user turns on reduced motion mid-animation', () => {
    let onReducedMotionChange: (event: { matches: boolean }) => void;

    beforeEach(() => {
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
        matches: false,
        addEventListener: (_event: string, handler: typeof onReducedMotionChange) => {
          onReducedMotionChange = handler;
        },
        removeEventListener: vi.fn(),
      }));
      updateWrapper();
    });

    it('should finish the animation at rest', async () => {
      await start();
      act(() => onReducedMotionChange({ matches: true }));
      await nextTick();

      expect(getRoot()).toHaveClass('d-motion-text--complete');
      expect(getRoot()).not.toHaveClass('d-motion-text--animating');
    });

    it('should keep animating when respectsReducedMotion is false', async () => {
      setProps({ respectsReducedMotion: false });
      await start();
      act(() => onReducedMotionChange({ matches: true }));
      await nextTick();

      expect(getRoot()).toHaveClass('d-motion-text--animating');
    });
  });

  describe('Shimmer Tests', () => {
    // Shimmer animates the whole element, so its content renders as-is and stays live
    const slotContent = (name: string) => <><strong>{name}</strong> is typing</>;
    const mountShimmerWithSlot = (props: DtMotionTextProps = {}) => {
      mockProps = { animationMode: 'shimmer', text: '', ...props };
      mockChildren = slotContent('Francis');
      updateWrapper();
    };

    it('should render the text prop without splitting it into words', () => {
      mockProps = { animationMode: 'shimmer' };
      updateWrapper();

      expect(findWords()).toHaveLength(0);
      expect(findContent()?.textContent).toBe(MOCK_FIGMA_TEXT);
    });

    it('should keep slot markup', () => {
      mountShimmerWithSlot({ autoStart: false });

      expect(wrapper!.container.querySelector('strong')?.textContent).toBe('Francis');
    });

    it('should show slot updates as they happen', async () => {
      mountShimmerWithSlot({ autoStart: false });
      setChildren(slotContent('Tamara'));
      await nextTick();

      expect(wrapper!.container.querySelector('strong')?.textContent).toBe('Tamara');
    });

    describe('When the text changes while looping', () => {
      beforeEach(async () => {
        mockProps = { animationMode: 'shimmer', autoStart: true, loop: true };
        updateWrapper();
        await flushAutoStart();
        setProps({ text: 'Searching' });
      });

      it('should render the new text', () => {
        expect(findContent()?.textContent).toBe('Searching');
      });

      it('should keep animating', () => {
        expect(getRoot()).toHaveClass('d-motion-text--animating');
      });

      it('should not restart the animation', () => {
        expect(getEmittedCount('start')).toBe(1);
      });
    });

    describe('When the text changes after a single play has finished', () => {
      beforeEach(async () => {
        mockProps = { animationMode: 'shimmer', autoStart: true };
        updateWrapper();
        await flushAutoStart();
        await advance(3000);
        setProps({ text: 'Searching' });
        await flushAutoStart();
      });

      it('should play again', () => {
        expect(getEmittedCount('start')).toBe(2);
      });

      it('should be animating', () => {
        expect(getRoot()).toHaveClass('d-motion-text--animating');
      });
    });

    describe('When the text changes after a loop was stopped with skipToEnd()', () => {
      beforeEach(async () => {
        mockProps = { animationMode: 'shimmer', autoStart: true, loop: true };
        updateWrapper();
        await flushAutoStart();
        call('skipToEnd');
        await advance(0);
        setProps({ text: 'Here is the answer' });
        await flushAutoStart();
      });

      it('should not play again', () => {
        expect(getEmittedCount('start')).toBe(1);
      });

      it('should stay at rest', () => {
        expect(getRoot()).toHaveClass('d-motion-text--complete');
      });
    });

    describe('When the text changes after a finished play and autoStart is false', () => {
      beforeEach(async () => {
        mockProps = { animationMode: 'shimmer' };
        updateWrapper();
        await start();
        await advance(3000);
        setProps({ text: 'Searching' });
        await flushAutoStart();
      });

      it('should not play again', () => {
        expect(getEmittedCount('start')).toBe(1);
      });

      it('should stay at rest', () => {
        expect(getRoot()).toHaveClass('d-motion-text--complete');
      });
    });

    it('should start on mount even while its slot is empty', async () => {
      mockProps = { animationMode: 'shimmer', text: '', autoStart: true };
      updateWrapper();
      await flushAutoStart();

      expect(getRoot()).toHaveClass('d-motion-text--animating');
    });

    it('should replay from the first frame when reset', async () => {
      mockProps = { animationMode: 'shimmer' };
      updateWrapper();
      await start();
      const flushes = recordStyleFlushes();
      call('reset');
      await nextTick();

      expect(flushes).toHaveLength(1);
      expect(flushes[0]).toContain('d-motion-text--restarting');
      expect(getRoot()).not.toHaveClass('d-motion-text--restarting');
    });
  });

  describe('When autoStart turns true after mount', () => {
    it.each(['gradient-in', 'shimmer'] as const)('should start the %s animation', async (mode) => {
      mockProps = { animationMode: mode, autoStart: false };
      updateWrapper();
      setProps({ autoStart: true });
      await flushAutoStart();

      expect(getEmittedCount('start')).toBe(1);
      expect(getRoot()).toHaveClass('d-motion-text--animating');
    });

    it('should wait for content in word modes', async () => {
      mockProps = { text: '', autoStart: false };
      updateWrapper();
      setProps({ autoStart: true });
      await nextTick();

      expect(getEmittedCount('start')).toBe(0);
    });
  });

  describe('When a consumer sets animation-iteration-count on shimmer', () => {
    it('should complete after every iteration has played', async () => {
      mockProps = { animationMode: 'shimmer' };
      mockAttrs = { style: { animationIterationCount: 2 } };
      updateWrapper();
      await start();

      await advance(3000);
      expect(getEmittedCount('complete')).toBe(0);
      await advance(3000);
      expect(getEmittedCount('complete')).toBe(1);
    });
  });

  describe('When switching from shimmer to a word mode with slot content', () => {
    it('should split the current slot content into words', async () => {
      mockProps = { animationMode: 'shimmer', autoStart: false, text: '' };
      mockChildren = 'Thinking';
      updateWrapper();
      setChildren('Searching the web');
      await nextTick();
      setProps({ animationMode: 'gradient-in' });
      await nextTick();

      expect(findWordTexts()).toEqual(['Searching', 'the', 'web']);
    });
  });

  describe('Slot Tests', () => {
    beforeEach(() => {
      mockProps = { text: '' };
    });

    it('should split default slot text into words', async () => {
      mockChildren = 'Slotted   content here';
      updateWrapper();
      await nextTick();

      expect(findWordTexts()).toEqual(['Slotted', 'content', 'here']);
    });

    it('should use only the text of slot markup', async () => {
      mockChildren = <><strong>Bold</strong> claim</>;
      updateWrapper();
      await nextTick();

      expect(findWordTexts()).toEqual(['Bold', 'claim']);
      expect(wrapper!.container.querySelector('strong')).not.toBeInTheDocument();
    });

    it('should prefer the text prop over slot content', async () => {
      mockProps = { text: MOCK_GRADIENT_TEXT };
      mockChildren = 'Slotted content';
      updateWrapper();
      await nextTick();

      expect(findWordTexts()).toEqual(MOCK_GRADIENT_TEXT.split(' '));
    });

    it('should animate slot text when autoStart is true', async () => {
      mockProps = { text: '', autoStart: true };
      mockChildren = 'Slotted content';
      updateWrapper();
      await flushAutoStart();

      expect(getEmittedCount('start')).toBe(1);
    });

    describe('When the text prop is cleared', () => {
      it('should split and animate the slot content instead', async () => {
        mockProps = { text: MOCK_GRADIENT_TEXT, autoStart: true };
        mockChildren = 'Slotted content';
        updateWrapper();
        await flushAutoStart();
        setProps({ text: '' });
        await flushAutoStart();
        await nextTick();

        expect(findWordTexts()).toEqual(['Slotted', 'content']);
        expect(getEmittedCount('start')).toBe(2);
      });
    });
  });

  describe('Text Processing Tests', () => {
    it('should render one word span per word', () => {
      expect(findWordTexts()).toEqual(MOCK_FIGMA_WORDS);
    });

    it('should animate whole words rather than characters', () => {
      expect(findWords()).toHaveLength(MOCK_FIGMA_WORDS.length);
      findWords().forEach(word => {
        expect(word.children).toHaveLength(0);
      });
    });

    it('should index each word for the stagger', () => {
      expect(findWords()).toHaveLength(MOCK_FIGMA_WORDS.length);
      findWords().forEach((_word, index) => {
        expect(getWordStyle(index, '--d-motion-text-word-index')).toBe(String(index));
      });
    });

    it('should keep the whitespace between words, including line breaks', async () => {
      setProps({ text: '  Hello   wide\n world' });

      expect(findWordTexts()).toEqual(['Hello', 'wide', 'world']);
      expect(findContent()?.textContent).toBe('Hello   wide\n world');
    });

    it('should render nothing for whitespace-only text', async () => {
      setProps({ text: '   ' });

      expect(findWords()).toHaveLength(0);
    });

    it('should re-render the words when the text changes', async () => {
      setProps({ text: 'New text' });

      expect(findWordTexts()).toEqual(['New', 'text']);
    });

    it('should reset the animation when the text changes', async () => {
      await start();
      setProps({ text: 'New text' });
      await advance(5000);

      expect(getRoot()).not.toHaveClass('d-motion-text--animating');
      expect(getEmittedCount('progress')).toBe(0);
    });

    it('should restart the animation when the text changes and autoStart is true', async () => {
      mockProps = { autoStart: true };
      updateWrapper();
      await flushAutoStart();
      setProps({ text: 'New text' });
      await flushAutoStart();

      expect(getEmittedCount('start')).toBe(2);
    });
  });

  describe('Event Emission Tests', () => {
    it('should emit start when the animation starts', async () => {
      await start();

      expect(getEmittedCount('start')).toBe(1);
    });

    it.each(MOCK_STAGGERED_TIMELINES)('should emit progress as each word settles in %s', async (mode, timeline) => {
      mockProps = { animationMode: mode };
      updateWrapper();
      await start();

      let elapsed = 0;
      for (const [index, end] of timeline.wordEnds.entries()) {
        await advance(end - 1 - elapsed);
        expect(getEmittedCount('progress')).toBe(index);
        await advance(1);
        elapsed = end;
        expect(getProgressPayloads()[index]).toEqual({
          wordsComplete: index + 1,
          totalWords: MOCK_FIGMA_WORDS.length,
          progress: (index + 1) / MOCK_FIGMA_WORDS.length,
        });
      }
    });

    it('should emit complete without per-word progress when the shimmer band finishes', async () => {
      mockProps = { animationMode: 'shimmer' };
      updateWrapper();
      await start();

      await advance(2999);
      expect(getEmittedCount('complete')).toBe(0);
      await advance(1);
      expect(getEmittedCount('complete')).toBe(1);
      expect(getEmittedCount('progress')).toBe(0);
    });

    it.each(MOCK_MODE_TIMELINES)('should emit complete after the last word settles in %s', async (mode, timeline) => {
      const cycleEnd = timeline.wordEnds.at(-1)!;
      mockProps = { animationMode: mode };
      updateWrapper();
      await start();

      await advance(cycleEnd - 1);
      expect(getEmittedCount('complete')).toBe(0);
      await advance(1);
      expect(getEmittedCount('complete')).toBe(1);

      await advance(5000);
      expect(getEmittedCount('complete')).toBe(1);
      expect(getEmittedCount('start')).toBe(1);
    });

    it('should scale the timeline with speed', async () => {
      mockProps = { animationMode: 'fade-in', speed: 100 };
      updateWrapper();
      await start();

      await advance(89);
      expect(getEmittedCount('progress')).toBe(0);
      await advance(1);
      expect(getEmittedCount('progress')).toBe(1);
      await advance(89);
      expect(getEmittedCount('complete')).toBe(0);
      await advance(1);
      expect(getEmittedCount('complete')).toBe(1);
    });

    it('should emit pause and resume', async () => {
      await start();
      call('pause');
      call('resume');

      expect(getEmittedCount('pause')).toBe(1);
      expect(getEmittedCount('resume')).toBe(1);
    });
  });

  describe('Gradient Slice Tests', () => {
    it('should slice the gradient in reading order for left-to-right text', () => {
      expect(getGradientSlices([2, 4, 2]).map(slice => slice?.position)).toEqual(['0% 0%', '50% 0%', '100% 0%']);
    });

    it('should mirror the slices for right-to-left text', () => {
      expect(getGradientSlices([2, 4, 2], true).map(slice => slice?.position)).toEqual(['100% 0%', '50% 0%', '0% 0%']);
    });

    it('should skip words without a width', () => {
      expect(getGradientSlices([2, 0])[1]).toBeNull();
    });
  });

  // Vue's prop validators are the props' types here: a rejected value is a type error, and the tests check what the
  // component renders for it.
  describe('Validation Tests', () => {
    describe('animationMode', () => {
      it.each(MOTION_TEXT_ANIMATION_MODES)('should accept %s', (mode) => {
        mockProps = { animationMode: mode };
        updateWrapper();

        expect(getRoot()).toHaveClass(`d-motion-text--${mode}`);
        MOCK_TRACK_VAR_NAMES.forEach(name => {
          expect(getRootStyle(name)).toBe(MOCK_MODE_TRACK_VARS[mode][name] ?? '');
        });
      });

      it('should reject an unknown mode', async () => {
        // @ts-expect-error animationMode only accepts MOTION_TEXT_ANIMATION_MODES
        mockProps = { animationMode: 'gradient-out' };
        updateWrapper();
        await start();
        await advance(0);

        // Rendered at rest, like 'none'
        MOCK_TRACK_VAR_NAMES.forEach(name => {
          expect(getRootStyle(name)).toBe('');
        });
        expect(getRoot()).toHaveClass('d-motion-text--complete');
        expect(getEmittedCount('complete')).toBe(1);
      });
    });

    describe('speed', () => {
      it('should keep the deprecated timing preset keys', () => {
        expect(MOTION_TEXT_TIMING_PRESETS['300']).toEqual({ characterDelay: 30, wordDelay: 50, duration: 1000 });
      });

      it('should fall back to the default timing for an unsupported value', () => {
        // @ts-expect-error speed only accepts MOTION_TEXT_SPEEDS, as strings or numbers
        mockProps = { speed: 'md' };
        updateWrapper();

        expect(getRootStyle('--d-motion-text-enter-stagger')).toBe('60ms');
      });

      it.each(MOTION_TEXT_SPEEDS)('should accept %s as a string or number', (speed) => {
        mockProps = { animationMode: 'fade-in', speed };
        updateWrapper();
        expect(getRootStyle('--d-motion-text-enter-stagger')).toBe(MOCK_SPEED_STAGGERS[speed]);

        mockProps = { animationMode: 'fade-in', speed: Number(speed) as DtMotionTextProps['speed'] };
        updateWrapper();
        expect(getRootStyle('--d-motion-text-enter-stagger')).toBe(MOCK_SPEED_STAGGERS[speed]);
      });

      it('should reject an unknown speed', () => {
        // @ts-expect-error speed only accepts MOTION_TEXT_SPEEDS, as strings or numbers
        mockProps = { animationMode: 'fade-in', speed: 250 };
        updateWrapper();

        expect(getRootStyle('--d-motion-text-enter-stagger')).toBe('60ms');
      });
    });
  });
});
