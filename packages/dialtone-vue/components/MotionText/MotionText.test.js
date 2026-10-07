import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DtMotionText from './MotionText.vue';
import { MOTION_TEXT_ANIMATION_MODES, MOTION_TEXT_SPEEDS } from './MotionTextConstants';
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
const MOCK_TRACK_VAR_NAMES = Object.keys({ ...MOCK_ENTER_VARS, ...MOCK_REVEAL_VARS, ...MOCK_SWEEP_VARS });

const MOCK_MODE_TRACK_VARS = {
  'gradient-in': { ...MOCK_ENTER_VARS, ...MOCK_REVEAL_VARS },
  'fade-in': MOCK_ENTER_VARS,
  'slide-in': MOCK_ENTER_VARS,
  'slide-in-gradient': { ...MOCK_ENTER_VARS, ...MOCK_REVEAL_VARS },
  'gradient-sweep': MOCK_SWEEP_VARS,
  shimmer: MOCK_SWEEP_VARS,
};

const MOCK_GRADIENT_MODES = ['gradient-in', 'slide-in-gradient', 'gradient-sweep'];
const MOCK_SOLID_MODES = ['fade-in', 'slide-in', 'shimmer'];

// For the six-word reference sentence at speed 300: when each word settles, and when a looped
// animation restarts (the 2000ms and 2650ms loops of the Figma prototypes)
const MOCK_REVEAL_WORD_ENDS = [550, 600, 650, 700, 750, 800];
const MOCK_ENTER_WORD_ENDS = [300, 360, 420, 480, 540, 600];
const MOCK_SWEEP_WORD_ENDS = [1750, 1870, 1990, 2110, 2230, 2350];
const MOCK_MODE_TIMELINES = [
  ['gradient-in', { wordEnds: MOCK_REVEAL_WORD_ENDS, restart: 2000 }],
  ['fade-in', { wordEnds: MOCK_ENTER_WORD_ENDS, restart: 2000 }],
  ['slide-in', { wordEnds: MOCK_ENTER_WORD_ENDS, restart: 2000 }],
  ['slide-in-gradient', { wordEnds: MOCK_REVEAL_WORD_ENDS, restart: 2000 }],
  ['gradient-sweep', { wordEnds: MOCK_SWEEP_WORD_ENDS, restart: 2650 }],
  ['shimmer', { wordEnds: MOCK_SWEEP_WORD_ENDS, restart: 2650 }],
];

/**
 * Environment Constants variables
 */
const baseProps = {
  text: MOCK_FIGMA_TEXT,
  autoStart: false,
};
const baseAttrs = {};
const baseSlots = {};

/**
 * Environment variables
 */
let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtMotionText Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtMotionText, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
    });
  };

  // Helpers
  const findContent = () => wrapper.find('[data-qa="dt-motion-text-content"]');
  const findWords = () => wrapper.findAll('[data-qa="dt-motion-text-word"]');
  const findScreenReaderText = () => wrapper.find('[data-qa="dt-motion-text-sr-only"]');
  const findWordTexts = () => findWords().map(word => word.element.textContent);
  const getWordStyle = (index, property) => findWords()[index].element.style.getPropertyValue(property);
  const getRootStyle = (property) => wrapper.element.style.getPropertyValue(property);
  const getEmittedCount = (event) => wrapper.emitted(event)?.length ?? 0;
  const getProgressPayloads = () => (wrapper.emitted('progress') ?? []).map(([payload]) => payload);

  const advance = async (ms) => {
    await vi.advanceTimersByTimeAsync(ms);
    await nextTick();
  };

  const start = async () => {
    wrapper.vm.start();
    await nextTick();
  };

  // autoStart calls start() on the tick after mount; the DOM reflects it a tick later
  const flushAutoStart = async () => {
    await nextTick();
    await nextTick();
  };

  beforeEach(() => {
    vi.useFakeTimers();
    updateWrapper();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('Default render', () => {
      it('should render the component with the base class', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.classes()).toContain('d-motion-text');
      });

      it('should apply the gradient-in mode class by default', () => {
        expect(wrapper.classes()).toContain('d-motion-text--gradient-in');
      });

      it('should render the text before the animation starts', () => {
        expect(findContent().element.textContent).toBe(MOCK_FIGMA_TEXT);
      });
    });

    describe('Animation mode variants', () => {
      it.each(MOTION_TEXT_ANIMATION_MODES)('should apply the d-motion-text--%s class', (mode) => {
        mockProps = { animationMode: mode };
        updateWrapper();

        expect(wrapper.classes()).toContain(`d-motion-text--${mode}`);
      });
    });

    describe('Track timing variables', () => {
      it('should define expected timings for every animation mode', () => {
        expect(Object.keys(MOCK_MODE_TRACK_VARS).sort()).toEqual([...MOTION_TEXT_ANIMATION_MODES].sort());
      });

      it.each(Object.entries(MOCK_MODE_TRACK_VARS))('should set only the %s track timings', (mode, expectedVars) => {
        mockProps = { animationMode: mode };
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
      ])('should scale the enter timings for speed %s', (speed, stagger, duration) => {
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
        const widths = { we: 20, move: 50, on: 30 };
        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
          return { width: widths[this.textContent] ?? 0 };
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

        findWords().forEach((word, index) => {
          expect(getWordStyle(index, '--d-motion-text-gradient-size')).toBe('');
          expect(getWordStyle(index, '--d-motion-text-gradient-position')).toBe('');
        });
      });
    });

    describe('State classes', () => {
      it('should have no playback state classes before starting', () => {
        expect(wrapper.classes()).not.toContain('d-motion-text--animating');
        expect(wrapper.classes()).not.toContain('d-motion-text--paused');
        expect(wrapper.classes()).not.toContain('d-motion-text--complete');
      });

      it('should add the animating class once started', async () => {
        await start();

        expect(wrapper.classes()).toContain('d-motion-text--animating');
      });

      it('should add the paused class while paused', async () => {
        await start();
        wrapper.vm.pause();
        await nextTick();

        expect(wrapper.classes()).toContain('d-motion-text--paused');
        expect(wrapper.classes()).toContain('d-motion-text--animating');
      });

      it('should swap animating for complete once every word has settled', async () => {
        await start();
        await advance(800);

        expect(wrapper.classes()).toContain('d-motion-text--complete');
        expect(wrapper.classes()).not.toContain('d-motion-text--animating');
      });

      it('should add the looped class when loop is true', async () => {
        await wrapper.setProps({ loop: true });

        expect(wrapper.classes()).toContain('d-motion-text--looped');
      });

      it('should not add the looped class by default', () => {
        expect(wrapper.classes()).not.toContain('d-motion-text--looped');
      });

      it('should add the respects-reduced-motion class by default', () => {
        expect(wrapper.classes()).toContain('d-motion-text--respects-reduced-motion');
      });

      it('should not add the respects-reduced-motion class when respectsReducedMotion is false', () => {
        mockProps = { respectsReducedMotion: false };
        updateWrapper();

        expect(wrapper.classes()).not.toContain('d-motion-text--respects-reduced-motion');
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
        expect(wrapper.classes()).toContain('d-motion-text--animating');
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
        expect(wrapper.classes()).not.toContain('d-motion-text--animating');
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
      expect(wrapper.classes()).toContain('d-motion-text--animating');
      expect(wrapper.classes()).not.toContain('d-motion-text--complete');
    });

    describe('Pause and resume', () => {
      beforeEach(() => {
        mockProps = { animationMode: 'fade-in' };
        updateWrapper();
      });

      it('should freeze the timeline while paused', async () => {
        await start();
        await advance(330);
        wrapper.vm.pause();
        await advance(5000);

        expect(getEmittedCount('pause')).toBe(1);
        expect(getEmittedCount('progress')).toBe(1);
        expect(getEmittedCount('complete')).toBe(0);
      });

      it('should continue from the elapsed time when resumed', async () => {
        await start();
        await advance(330);
        wrapper.vm.pause();
        await advance(5000);
        wrapper.vm.resume();

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
        wrapper.vm.pause();
        wrapper.vm.resume();
        await nextTick();

        expect(getEmittedCount('resume')).toBe(1);
        expect(wrapper.classes()).not.toContain('d-motion-text--paused');
      });

      it('should ignore pause() before the animation starts', async () => {
        wrapper.vm.pause();
        await nextTick();

        expect(getEmittedCount('pause')).toBe(0);
        expect(wrapper.classes()).not.toContain('d-motion-text--paused');
      });

      it('should ignore pause() while already paused', async () => {
        await start();
        wrapper.vm.pause();
        wrapper.vm.pause();

        expect(getEmittedCount('pause')).toBe(1);
      });

      it('should ignore resume() when not paused', async () => {
        await start();
        wrapper.vm.resume();

        expect(getEmittedCount('resume')).toBe(0);
      });
    });

    describe('Reset', () => {
      it('should clear every playback state class', async () => {
        await start();
        wrapper.vm.pause();
        wrapper.vm.reset();
        await nextTick();

        expect(wrapper.classes()).not.toContain('d-motion-text--animating');
        expect(wrapper.classes()).not.toContain('d-motion-text--paused');
        expect(wrapper.classes()).not.toContain('d-motion-text--complete');
      });

      it('should cancel pending events', async () => {
        mockProps = { animationMode: 'fade-in' };
        updateWrapper();
        await start();
        await advance(330);
        wrapper.vm.reset();
        await advance(5000);

        expect(getEmittedCount('progress')).toBe(1);
        expect(getEmittedCount('complete')).toBe(0);
      });

      it('should re-render the words in their starting state', async () => {
        await start();
        const previousWords = findWords().map(word => word.element);
        wrapper.vm.reset();
        await nextTick();

        findWords().forEach(word => {
          expect(previousWords).not.toContain(word.element);
        });
      });

      it('should replay from the beginning when started again', async () => {
        mockProps = { animationMode: 'fade-in' };
        updateWrapper();
        await start();
        await advance(400);
        wrapper.vm.reset();
        await start();
        await advance(299);

        expect(getEmittedCount('progress')).toBe(2);
        await advance(1);
        expect(getProgressPayloads()[2].wordsComplete).toBe(1);
      });
    });

    describe('Skip to end', () => {
      it('should settle every word immediately', async () => {
        await start();
        await advance(100);
        wrapper.vm.skipToEnd();
        await nextTick();

        expect(wrapper.classes()).toContain('d-motion-text--complete');
        expect(wrapper.classes()).not.toContain('d-motion-text--animating');
      });

      it('should emit complete once and stop the timeline', async () => {
        await start();
        await advance(100);
        wrapper.vm.skipToEnd();
        await advance(0);
        expect(getEmittedCount('complete')).toBe(1);

        await advance(5000);
        expect(getEmittedCount('complete')).toBe(1);
        expect(getEmittedCount('progress')).toBe(0);
      });
    });

    describe('When animationMode is the deprecated none mode', () => {
      it('should render at rest and complete as soon as it starts', async () => {
        mockProps = { animationMode: 'none' };
        updateWrapper();
        await start();
        await advance(0);

        expect(wrapper.classes()).toContain('d-motion-text--complete');
        expect(getEmittedCount('complete')).toBe(1);
        expect(getEmittedCount('progress')).toBe(0);
      });
    });

    describe('When loop is true', () => {
      it.each(MOCK_MODE_TIMELINES)('should restart %s after its Figma loop duration', async (mode, timeline) => {
        const cycleEnd = timeline.wordEnds.at(-1);
        mockProps = { animationMode: mode, loop: true };
        updateWrapper();
        await start();

        await advance(cycleEnd);
        expect(getEmittedCount('complete')).toBe(1);
        expect(wrapper.classes()).toContain('d-motion-text--animating');
        expect(wrapper.classes()).not.toContain('d-motion-text--complete');

        await advance(timeline.restart - cycleEnd - 1);
        expect(getEmittedCount('start')).toBe(1);
        await advance(1);
        expect(getEmittedCount('start')).toBe(2);
      });

      it('should replay the cycle on the same word elements', async () => {
        mockProps = { loop: true };
        updateWrapper();
        await start();
        const previousWords = findWords().map(word => word.element);
        await advance(2000);

        expect(getEmittedCount('start')).toBe(2);
        expect(findWords().map(word => word.element)).toEqual(previousWords);
      });

      it('should drop the animations for one style pass when the cycle restarts', async () => {
        mockProps = { loop: true };
        updateWrapper();
        await start();
        vi.advanceTimersByTime(2000);
        await nextTick();

        expect(wrapper.classes()).toContain('d-motion-text--restarting');

        await nextTick();
        expect(wrapper.classes()).not.toContain('d-motion-text--restarting');
      });

      it('should emit progress from the first word again on each cycle', async () => {
        mockProps = { animationMode: 'fade-in', loop: true };
        updateWrapper();
        await start();
        await advance(2000);
        await advance(300);

        expect(getProgressPayloads()).toHaveLength(MOCK_FIGMA_WORDS.length + 1);
        expect(getProgressPayloads().at(-1).wordsComplete).toBe(1);
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
        await wrapper.setProps({ loop: false });
        await advance(5000);

        expect(getEmittedCount('start')).toBe(1);
        expect(wrapper.classes()).toContain('d-motion-text--complete');
      });
    });

    describe('When loop is turned on mid-cycle', () => {
      it('should loop from the end of the current cycle', async () => {
        await start();
        await advance(100);
        await wrapper.setProps({ loop: true });
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
        await wrapper.setProps({ animationMode: 'fade-in' });
        await nextTick();

        expect(getEmittedCount('start')).toBe(2);
        expect(getRootStyle('--d-motion-text-reveal-delay')).toBe('');

        await advance(MOCK_ENTER_WORD_ENDS.at(-1));
        expect(getEmittedCount('complete')).toBe(1);
      });
    });

    describe('When speed changes while animating', () => {
      it('should restart at the new speed', async () => {
        await start();
        await advance(100);
        await wrapper.setProps({ speed: 100 });
        await nextTick();

        expect(getEmittedCount('start')).toBe(2);

        await advance(MOCK_REVEAL_WORD_ENDS.at(-1) * 0.3);
        expect(getEmittedCount('complete')).toBe(1);
      });
    });

    describe('When start() is called right after skipToEnd()', () => {
      it('should only emit complete when the new cycle ends', async () => {
        wrapper.vm.skipToEnd();
        wrapper.vm.start();
        await advance(0);

        expect(getEmittedCount('complete')).toBe(0);

        await advance(MOCK_REVEAL_WORD_ENDS.at(-1));
        expect(getEmittedCount('complete')).toBe(1);
      });
    });

    describe('When unmounted before autoStart runs', () => {
      it('should not start or emit any events', async () => {
        mockProps = { autoStart: true, loop: true };
        updateWrapper();
        wrapper.unmount();
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
        expect(wrapper.attributes('aria-live')).toBe('off');
      });

      it('should set aria-live to polite while animating', async () => {
        await start();

        expect(wrapper.attributes('aria-live')).toBe('polite');
      });

      it('should set aria-live to off once complete', async () => {
        await start();
        await advance(800);

        expect(wrapper.attributes('aria-live')).toBe('off');
      });
    });

    describe('When screenReaderText is provided', () => {
      beforeEach(() => {
        mockProps = { screenReaderText: MOCK_SCREEN_READER_TEXT };
        updateWrapper();
      });

      it('should render the screen reader text in a visually hidden span', () => {
        const srText = findScreenReaderText();

        expect(srText.exists()).toBe(true);
        expect(srText.text()).toBe(MOCK_SCREEN_READER_TEXT);
      });

      it('should set aria-label', () => {
        expect(wrapper.attributes('aria-label')).toBe(MOCK_SCREEN_READER_TEXT);
      });

      it('should hide the animated words from assistive technology', () => {
        expect(findContent().attributes('aria-hidden')).toBe('true');
      });
    });

    describe('When screenReaderText is not provided', () => {
      it('should not render the screen reader span', () => {
        expect(findScreenReaderText().exists()).toBe(false);
      });

      it('should not set aria-label', () => {
        expect(wrapper.attributes('aria-label')).toBeUndefined();
      });

      it('should leave the animated words exposed to assistive technology', async () => {
        await start();

        expect(findContent().attributes('aria-hidden')).toBeUndefined();
      });
    });

    describe('When the user prefers reduced motion', () => {
      let matchMedia;

      beforeEach(() => {
        matchMedia = vi.fn().mockReturnValue({ matches: true });
        vi.stubGlobal('matchMedia', matchMedia);
      });

      it('should complete without animating', async () => {
        mockProps = { autoStart: true };
        updateWrapper();
        await flushAutoStart();
        await advance(0);

        expect(getEmittedCount('start')).toBe(1);
        expect(getEmittedCount('complete')).toBe(1);
        expect(wrapper.classes()).toContain('d-motion-text--complete');
        expect(wrapper.classes()).not.toContain('d-motion-text--animating');

        await advance(5000);
        expect(getEmittedCount('progress')).toBe(0);
      });

      it('should animate when respectsReducedMotion is false', async () => {
        mockProps = { autoStart: true, respectsReducedMotion: false };
        updateWrapper();
        await flushAutoStart();

        expect(wrapper.classes()).toContain('d-motion-text--animating');
      });
    });
  });

  describe('When the user turns on reduced motion mid-animation', () => {
    let onReducedMotionChange;

    beforeEach(() => {
      vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
        matches: false,
        addEventListener: (event, handler) => { onReducedMotionChange = handler; },
        removeEventListener: vi.fn(),
      }));
      updateWrapper();
    });

    it('should finish the animation at rest', async () => {
      await start();
      onReducedMotionChange({ matches: true });
      await nextTick();

      expect(wrapper.classes()).toContain('d-motion-text--complete');
      expect(wrapper.classes()).not.toContain('d-motion-text--animating');
    });

    it('should keep animating when respectsReducedMotion is false', async () => {
      await wrapper.setProps({ respectsReducedMotion: false });
      await start();
      onReducedMotionChange({ matches: true });
      await nextTick();

      expect(wrapper.classes()).toContain('d-motion-text--animating');
    });
  });

  describe('Slot Tests', () => {
    beforeEach(() => {
      mockProps = { text: '' };
    });

    it('should split default slot text into words', async () => {
      mockSlots = { default: 'Slotted   content here' };
      updateWrapper();
      await nextTick();

      expect(findWordTexts()).toEqual(['Slotted', 'content', 'here']);
    });

    it('should use only the text of slot markup', async () => {
      mockSlots = { default: '<strong>Bold</strong> claim' };
      updateWrapper();
      await nextTick();

      expect(findWordTexts()).toEqual(['Bold', 'claim']);
      expect(wrapper.find('strong').exists()).toBe(false);
    });

    it('should prefer the text prop over slot content', async () => {
      mockProps = { text: MOCK_GRADIENT_TEXT };
      mockSlots = { default: 'Slotted content' };
      updateWrapper();
      await nextTick();

      expect(findWordTexts()).toEqual(MOCK_GRADIENT_TEXT.split(' '));
    });

    it('should animate slot text when autoStart is true', async () => {
      mockProps = { text: '', autoStart: true };
      mockSlots = { default: 'Slotted content' };
      updateWrapper();
      await flushAutoStart();

      expect(getEmittedCount('start')).toBe(1);
    });

    describe('When the text prop is cleared', () => {
      it('should split and animate the slot content instead', async () => {
        mockProps = { text: MOCK_GRADIENT_TEXT, autoStart: true };
        mockSlots = { default: 'Slotted content' };
        updateWrapper();
        await flushAutoStart();
        await wrapper.setProps({ text: '' });
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
      findWords().forEach(word => {
        expect(word.element.children).toHaveLength(0);
      });
    });

    it('should index each word for the stagger', () => {
      findWords().forEach((word, index) => {
        expect(getWordStyle(index, '--d-motion-text-word-index')).toBe(String(index));
      });
    });

    it('should collapse whitespace into single spaces between words', async () => {
      await wrapper.setProps({ text: '  Hello   wide\n world  ' });

      expect(findWordTexts()).toEqual(['Hello', 'wide', 'world']);
      expect(findContent().element.textContent).toBe('Hello wide world');
    });

    it('should render nothing for whitespace-only text', async () => {
      await wrapper.setProps({ text: '   ' });

      expect(findWords()).toHaveLength(0);
    });

    it('should re-render the words when the text changes', async () => {
      await wrapper.setProps({ text: 'New text' });

      expect(findWordTexts()).toEqual(['New', 'text']);
    });

    it('should reset the animation when the text changes', async () => {
      await start();
      await wrapper.setProps({ text: 'New text' });
      await advance(5000);

      expect(wrapper.classes()).not.toContain('d-motion-text--animating');
      expect(getEmittedCount('progress')).toBe(0);
    });

    it('should restart the animation when the text changes and autoStart is true', async () => {
      mockProps = { autoStart: true };
      updateWrapper();
      await flushAutoStart();
      await wrapper.setProps({ text: 'New text' });
      await flushAutoStart();

      expect(getEmittedCount('start')).toBe(2);
    });
  });

  describe('Event Emission Tests', () => {
    it('should emit start when the animation starts', async () => {
      await start();

      expect(getEmittedCount('start')).toBe(1);
    });

    it.each(MOCK_MODE_TIMELINES)('should emit progress as each word settles in %s', async (mode, timeline) => {
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

    it.each(MOCK_MODE_TIMELINES)('should emit complete after the last word settles in %s', async (mode, timeline) => {
      const cycleEnd = timeline.wordEnds.at(-1);
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
      wrapper.vm.pause();
      wrapper.vm.resume();

      expect(getEmittedCount('pause')).toBe(1);
      expect(getEmittedCount('resume')).toBe(1);
    });
  });

  describe('Gradient Slice Tests', () => {
    it('should slice the gradient in reading order for left-to-right text', () => {
      expect(getGradientSlices([2, 4, 2]).map(slice => slice.position)).toEqual(['0% 0%', '50% 0%', '100% 0%']);
    });

    it('should mirror the slices for right-to-left text', () => {
      expect(getGradientSlices([2, 4, 2], true).map(slice => slice.position)).toEqual(['100% 0%', '50% 0%', '0% 0%']);
    });

    it('should skip words without a width', () => {
      expect(getGradientSlices([2, 0])[1]).toBeNull();
    });
  });

  describe('Validation Tests', () => {
    describe('animationMode', () => {
      const { validator } = DtMotionText.props.animationMode;

      it.each(MOTION_TEXT_ANIMATION_MODES)('should accept %s', (mode) => {
        expect(validator(mode)).toBe(true);
      });

      it('should accept the deprecated none mode', () => {
        expect(validator('none')).toBe(true);
      });

      it('should reject an unknown mode', () => {
        expect(validator('gradient-out')).toBe(false);
      });
    });

    describe('speed', () => {
      it('should fall back to the default timing for an unsupported value', () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { speed: 'md' };
        updateWrapper();

        expect(getRootStyle('--d-motion-text-enter-stagger')).toBe('60ms');
      });

      const { validator } = DtMotionText.props.speed;

      it.each(MOTION_TEXT_SPEEDS)('should accept %s as a string or number', (speed) => {
        expect(validator(speed)).toBe(true);
        expect(validator(Number(speed))).toBe(true);
      });

      it('should reject an unknown speed', () => {
        expect(validator(250)).toBe(false);
      });
    });
  });
});
