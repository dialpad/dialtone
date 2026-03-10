import { mount } from '@vue/test-utils';
import { DtModeDirective } from './mode.js';
import DtModeIsland from '@/components/mode_island/mode_island.vue';

describe('DtModeDirective Tests', () => {
  let wrapper;

  beforeEach(() => {
    document.documentElement.setAttribute('data-dt-mode', 'light');
    document.documentElement.setAttribute('data-dt-contrast', 'default');
  });

  afterEach(() => {
    wrapper?.unmount();
    document.documentElement.removeAttribute('data-dt-mode');
    document.documentElement.removeAttribute('data-dt-contrast');
  });

  describe('Explicit Mode Tests', () => {
    it('should set data-dt-mode to light with v-dt-mode:light', () => {
      wrapper = mount({
        template: '<section v-dt-mode:light data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('light');
    });

    it('should set data-dt-mode to dark with v-dt-mode:dark', () => {
      wrapper = mount({
        template: '<section v-dt-mode:dark data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('dark');
    });
  });

  describe('Invert Mode Tests', () => {
    it('should invert root mode when no arg is provided (default)', () => {
      wrapper = mount({
        template: '<section v-dt-mode data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      // Root is light, so invert should be dark
      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('dark');
    });

    it('should invert root mode with explicit :invert arg', () => {
      wrapper = mount({
        template: '<section v-dt-mode:invert data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('dark');
    });

    it('should invert dark root mode', () => {
      document.documentElement.setAttribute('data-dt-mode', 'dark');

      wrapper = mount({
        template: '<section v-dt-mode data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('light');
    });

    it('should invert nearest parent with data-dt-mode', () => {
      wrapper = mount({
        template: `
          <div data-dt-mode="dark">
            <section v-dt-mode:invert data-qa="target">Content</section>
          </div>
        `,
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('light');
    });
  });

  describe('Contrast Tests', () => {
    it('should set data-dt-contrast from root', () => {
      wrapper = mount({
        template: '<section v-dt-mode:dark data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-contrast')).toBe('default');
    });

    it('should update data-dt-contrast when root changes', async () => {
      wrapper = mount({
        template: '<section v-dt-mode:dark data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      document.documentElement.setAttribute('data-dt-contrast', 'high');
      // Wait for MutationObserver callback
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-contrast')).toBe('high');
    });
  });

  describe('Reactive Tests', () => {
    it('should re-invert when root mode changes', async () => {
      wrapper = mount({
        template: '<section v-dt-mode data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('dark');

      document.documentElement.setAttribute('data-dt-mode', 'dark');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('light');
    });

    it('should not apply mode when value is false', () => {
      wrapper = mount({
        template: '<section v-dt-mode:invert="false" data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBeUndefined();
      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-contrast')).toBeUndefined();
    });

    it('should apply mode when value changes from false to true', async () => {
      wrapper = mount({
        template: '<section v-dt-mode:invert="enabled" data-qa="target">Content</section>',
        data () {
          return { enabled: false };
        },
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBeUndefined();

      await wrapper.setData({ enabled: true });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('dark');
    });

    it('should remove mode when value changes from true to false', async () => {
      wrapper = mount({
        template: '<section v-dt-mode:invert="enabled" data-qa="target">Content</section>',
        data () {
          return { enabled: true };
        },
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('dark');

      await wrapper.setData({ enabled: false });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBeUndefined();
    });

    it('should re-initialize when dynamic arg changes', async () => {
      wrapper = mount({
        template: '<section v-dt-mode:[mode] data-qa="target">Content</section>',
        data () {
          return { mode: 'dark' };
        },
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('dark');

      await wrapper.setData({ mode: 'light' });

      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('light');
    });
  });

  describe('Nesting Tests', () => {
    it('should read parent mode from DtModeIsland correctly', () => {
      wrapper = mount({
        template: `
          <dt-mode-island mode="dark" data-qa="parent">
            <section v-dt-mode:invert data-qa="child">Content</section>
          </dt-mode-island>
        `,
        components: { DtModeIsland },
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="parent"]').attributes('data-dt-mode')).toBe('dark');
      expect(wrapper.find('[data-qa="child"]').attributes('data-dt-mode')).toBe('light');
    });

    it('should nest directive inside directive correctly', async () => {
      wrapper = mount({
        template: `
          <div v-dt-mode:dark data-qa="outer">
            <section v-dt-mode:invert data-qa="inner">Content</section>
          </div>
        `,
      }, {
        global: { plugins: [DtModeDirective] },
      });

      // Wait for MutationObserver to propagate (child mounted fires before parent)
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(wrapper.find('[data-qa="outer"]').attributes('data-dt-mode')).toBe('dark');
      expect(wrapper.find('[data-qa="inner"]').attributes('data-dt-mode')).toBe('light');
    });

    it('should alternate correctly with triple nesting', async () => {
      wrapper = mount({
        template: `
          <div v-dt-mode:light data-qa="level1">
            <div v-dt-mode:invert data-qa="level2">
              <div v-dt-mode:invert data-qa="level3">Content</div>
            </div>
          </div>
        `,
      }, {
        global: { plugins: [DtModeDirective] },
      });

      // Wait for MutationObserver to propagate through nesting levels
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(wrapper.find('[data-qa="level1"]').attributes('data-dt-mode')).toBe('light');
      expect(wrapper.find('[data-qa="level2"]').attributes('data-dt-mode')).toBe('dark');
      expect(wrapper.find('[data-qa="level3"]').attributes('data-dt-mode')).toBe('light');
    });
  });

  describe('Cleanup Tests', () => {
    it('should disconnect MutationObservers on unmount', () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');

      wrapper = mount({
        template: '<section v-dt-mode data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      wrapper.unmount();
      expect(disconnectSpy).toHaveBeenCalled();
      disconnectSpy.mockRestore();
    });
  });

  describe('Validation Tests', () => {
    it('should suggest "invert" when "inverted" is used', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      wrapper = mount({
        template: '<section v-dt-mode:inverted data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Did you mean "invert"?'),
      );
      // Falls back to invert — root is light, so should be dark
      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('dark');
      warnSpy.mockRestore();
    });

    it('should warn and fall back to invert on invalid arg', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      wrapper = mount({
        template: '<section v-dt-mode:invalid data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid mode "invalid"'),
      );
      // Falls back to invert — root is light, so should be dark
      expect(wrapper.find('[data-qa="target"]').attributes('data-dt-mode')).toBe('dark');
      warnSpy.mockRestore();
    });
  });

  describe('Class Tests', () => {
    it('should NOT auto-add d-mode-island class', () => {
      wrapper = mount({
        template: '<section v-dt-mode:dark data-qa="target">Content</section>',
      }, {
        global: { plugins: [DtModeDirective] },
      });

      expect(wrapper.find('[data-qa="target"]').classes()).not.toContain('d-mode-island');
    });
  });
});
