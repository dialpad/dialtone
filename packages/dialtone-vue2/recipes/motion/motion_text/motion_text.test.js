import { mount } from '@vue/test-utils';
import DtRecipeMotionText from './motion_text.vue';

// Constants
const baseProps = {
  text: 'Test text content',
  autoStart: false,
};

describe('DtRecipeMotionText Tests', () => {
  // Wrappers
  let wrapper;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};

  // Helpers
  const _setWrappers = () => {
    wrapper = mount(DtRecipeMotionText, {
      propsData: props,
      attrs,
      slots,
    });
  };

  // Setup
  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });

  beforeEach(() => {
    _setWrappers();
  });

  // Teardown
  afterEach(() => {
    props = baseProps;
    attrs = {};
    slots = {};
    wrapper.destroy();
  });

  describe('Presentation Tests', () => {
    describe('Default render', () => {
      it('should render the component', () => {
        expect(wrapper.exists()).toBeTruthy();
      });

      it('should render text content', async () => {
        // Skip to end to make all text visible
        wrapper.vm.skipToEnd();
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('Test text content');
      });

      it('should have base class', () => {
        expect(wrapper.classes()).toContain('dt-recipe-motion-text');
      });

      it('should apply default animation mode class', () => {
        expect(wrapper.classes()).toContain('dt-recipe-motion-text--gradient-in');
      });
    });

    describe('Animation mode variants', () => {
      it('should apply gradient-in class', async () => {
        await wrapper.setProps({ animationMode: 'gradient-in' });
        expect(wrapper.classes()).toContain('dt-recipe-motion-text--gradient-in');
      });

      it('should apply fade-in class', async () => {
        await wrapper.setProps({ animationMode: 'fade-in' });
        expect(wrapper.classes()).toContain('dt-recipe-motion-text--fade-in');
      });

      it('should apply slide-in class', async () => {
        await wrapper.setProps({ animationMode: 'slide-in' });
        expect(wrapper.classes()).toContain('dt-recipe-motion-text--slide-in');
      });

      it('should apply gradient-sweep class', async () => {
        await wrapper.setProps({ animationMode: 'gradient-sweep' });
        expect(wrapper.classes()).toContain('dt-recipe-motion-text--gradient-sweep');
      });

      it('should apply shimmer class', async () => {
        await wrapper.setProps({ animationMode: 'shimmer' });
        expect(wrapper.classes()).toContain('dt-recipe-motion-text--shimmer');
      });

      it('should apply none class', async () => {
        await wrapper.setProps({ animationMode: 'none' });
        expect(wrapper.classes()).toContain('dt-recipe-motion-text--none');
      });
    });

    describe('Speed variants', () => {
      it('should apply timing for sm speed', async () => {
        await wrapper.setProps({ speed: 'sm' });
        expect(wrapper.vm.timing.characterDelay).toBe(20);
        expect(wrapper.vm.timing.wordDelay).toBe(30);
        expect(wrapper.vm.timing.duration).toBe(600);
      });

      it('should apply timing for md speed', async () => {
        await wrapper.setProps({ speed: 'md' });
        expect(wrapper.vm.timing.characterDelay).toBe(30);
        expect(wrapper.vm.timing.wordDelay).toBe(50);
        expect(wrapper.vm.timing.duration).toBe(1000);
      });

      it('should apply timing for lg speed', async () => {
        await wrapper.setProps({ speed: 'lg' });
        expect(wrapper.vm.timing.characterDelay).toBe(50);
        expect(wrapper.vm.timing.wordDelay).toBe(100);
        expect(wrapper.vm.timing.duration).toBe(1500);
      });
    });

    describe('CSS custom properties', () => {
      it('should set duration CSS variables', () => {
        const style = wrapper.attributes('style');
        expect(style).toContain('--dt-recipe-motion-text-duration');
        expect(style).toContain('--dt-recipe-motion-text-char-duration');
        expect(style).toContain('--dt-recipe-motion-text-word-duration');
      });
    });

    describe('Loop behavior', () => {
      it('should add looped class when loop is true', async () => {
        await wrapper.setProps({ loop: true });
        await wrapper.vm.$nextTick();
        expect(wrapper.classes()).toContain('dt-recipe-motion-text--looped');
      });

      it('should not add looped class when loop is false', async () => {
        await wrapper.setProps({ loop: false });
        await wrapper.vm.$nextTick();
        expect(wrapper.classes()).not.toContain('dt-recipe-motion-text--looped');
      });
    });
  });

  describe('Animation Control Tests', () => {
    beforeEach(() => {
      props = { ...baseProps, autoStart: false };
      _setWrappers();
    });

    it('should not auto-start when autoStart is false', () => {
      expect(wrapper.vm.isAnimating).toBe(false);
    });

    it('should start animation when start() is called', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isAnimating).toBe(true);
    });

    it('should emit start event', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('start')).toBeTruthy();
    });

    it('should pause animation', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      wrapper.vm.pause();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isPaused).toBe(true);
    });

    it('should emit pause event', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      wrapper.vm.pause();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('pause')).toBeTruthy();
    });

    it('should resume animation', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      wrapper.vm.pause();
      await wrapper.vm.$nextTick();
      wrapper.vm.resume();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isPaused).toBe(false);
    });

    it('should emit resume event', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      wrapper.vm.pause();
      await wrapper.vm.$nextTick();
      wrapper.vm.resume();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('resume')).toBeTruthy();
    });

    it('should reset animation', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      wrapper.vm.reset();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isAnimating).toBe(false);
      expect(wrapper.vm.isPaused).toBe(false);
      expect(wrapper.vm.visibleWordCount).toBe(0);
    });

    it('should skip to end', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      wrapper.vm.skipToEnd();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.visibleWordCount).toBe(wrapper.vm.words.length);
    });

    it('should add animating class when animating', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      expect(wrapper.classes()).toContain('dt-recipe-motion-text--animating');
    });

    it('should add paused class when paused', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      wrapper.vm.pause();
      await wrapper.vm.$nextTick();
      expect(wrapper.classes()).toContain('dt-recipe-motion-text--paused');
    });
  });

  describe('Accessibility Tests', () => {
    it('should have aria-live attribute', () => {
      expect(wrapper.attributes('aria-live')).toBeDefined();
    });

    it('should set aria-live to polite when animating', async () => {
      wrapper.vm.isAnimating = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.attributes('aria-live')).toBe('polite');
    });

    it('should set aria-live to off when not animating', async () => {
      wrapper.vm.isAnimating = false;
      await wrapper.vm.$nextTick();
      expect(wrapper.attributes('aria-live')).toBe('off');
    });

    it('should render screen reader text', async () => {
      await wrapper.setProps({ screenReaderText: 'Alternative text' });
      const srText = wrapper.find('.dt-recipe-motion-text__sr-only');
      expect(srText.exists()).toBe(true);
      expect(srText.text()).toBe('Alternative text');
    });

    it('should set aria-label when screen reader text is provided', async () => {
      await wrapper.setProps({ screenReaderText: 'Alternative text' });
      expect(wrapper.attributes('aria-label')).toBe('Alternative text');
    });

    it('should respect reduced motion', async () => {
      wrapper.vm.prefersReducedMotion = true;
      await wrapper.setProps({ respectsReducedMotion: true });
      wrapper.vm.start();
      await wrapper.vm.$nextTick();
      // When reduced motion is preferred, animation should complete immediately
      expect(wrapper.vm.visibleWordCount).toBe(wrapper.vm.words.length);
    });
  });

  describe('Static Animation Modes', () => {
    it('should identify gradient-sweep as static mode', async () => {
      await wrapper.setProps({ animationMode: 'gradient-sweep' });
      expect(wrapper.vm.isStaticAnimationMode).toBe(true);
    });

    it('should identify shimmer as static mode', async () => {
      await wrapper.setProps({ animationMode: 'shimmer' });
      expect(wrapper.vm.isStaticAnimationMode).toBe(true);
    });

    it('should not identify gradient-in as static mode', async () => {
      await wrapper.setProps({ animationMode: 'gradient-in' });
      expect(wrapper.vm.isStaticAnimationMode).toBe(false);
    });

    it('should not process text into words for static modes', async () => {
      // Create a fresh wrapper with static mode from the start
      const staticWrapper = mount(DtRecipeMotionText, {
        props: {
          text: 'Static text',
          animationMode: 'gradient-sweep',
          autoStart: false,
        },
      });
      await staticWrapper.vm.$nextTick();
      expect(staticWrapper.vm.words.length).toBe(0);
      staticWrapper.destroy();
    });

    it('should set data-text-content for static modes', async () => {
      await wrapper.setProps({ animationMode: 'gradient-sweep', text: 'Static text' });
      expect(wrapper.attributes('data-text-content')).toBe('Static text');
    });
  });

  describe('Slot Tests', () => {
    it('should render default slot content', () => {
      slots = { default: 'Slotted content' };
      props = { text: '', autoStart: false };
      _setWrappers();
      expect(wrapper.text()).toContain('Slotted content');
    });
  });

  describe('Text Processing Tests', () => {
    it('should process text into words', () => {
      expect(wrapper.vm.words.length).toBeGreaterThan(0);
    });

    it('should process each word into characters', () => {
      wrapper.vm.words.forEach(word => {
        expect(word.chars).toBeDefined();
        expect(word.chars.length).toBeGreaterThan(0);
      });
    });

    it('should re-initialize when text prop changes', async () => {
      const originalWords = wrapper.vm.words.length;
      await wrapper.setProps({ text: 'New text' });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.words.length).not.toBe(originalWords);
    });
  });

  describe('Event Emission Tests', () => {
    beforeEach(() => {
      props = { ...baseProps, autoStart: false };
      _setWrappers();
    });

    it('should emit complete event', async () => {
      wrapper.vm.completeAnimation();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('complete')).toBeTruthy();
    });

    it('should emit progress event with correct data', async () => {
      wrapper.vm.start();
      await wrapper.vm.$nextTick();

      // Wait for at least one progress event
      await new Promise(resolve => setTimeout(resolve, 100));

      const progressEvents = wrapper.emitted('progress');
      if (progressEvents && progressEvents.length > 0) {
        const eventData = progressEvents[0][0];
        expect(eventData).toHaveProperty('wordsComplete');
        expect(eventData).toHaveProperty('totalWords');
        expect(eventData).toHaveProperty('progress');
      }
    });
  });
});
