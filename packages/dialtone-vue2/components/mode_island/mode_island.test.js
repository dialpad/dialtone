import { mount } from '@vue/test-utils';
import DtModeIsland from './mode_island.vue';

const baseProps = {};
const baseSlots = {
  default: '<div data-qa="test-content">Test Content</div>',
};
const baseAttrs = {};

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};

describe('DtModeIsland Tests', () => {
  let wrapper;
  let defaultContent;

  const updateWrapper = () => {
    wrapper = mount(DtModeIsland, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      attrs: { ...baseAttrs, ...mockAttrs },
    });
    defaultContent = wrapper.find('[data-qa="test-content"]');
  };

  beforeEach(() => {
    // Mock getRootMode and getRootContrast
    document.documentElement.setAttribute('data-dt-mode', 'light');
    document.documentElement.setAttribute('data-dt-contrast', 'default');
    updateWrapper();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-dt-mode');
    document.documentElement.removeAttribute('data-dt-contrast');
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
  });

  describe('Presentation Tests', () => {
    describe('When mode island renders', () => {
      it('should exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render content', () => {
        expect(defaultContent.exists()).toBe(true);
      });

      it('should have correct data attributes', () => {
        expect(wrapper.attributes('data-dt-mode')).toBeDefined();
        expect(wrapper.attributes('data-dt-contrast')).toBeDefined();
      });
    });
  });

  describe('Mode Tests', () => {
    describe('When mode is "light"', () => {
      it('should set data-dt-mode to light', () => {
        mockProps = { mode: 'light' };

        updateWrapper();

        expect(wrapper.attributes('data-dt-mode')).toBe('light');
      });
    });

    describe('When mode is "dark"', () => {
      it('should set data-dt-mode to dark', () => {
        mockProps = { mode: 'dark' };

        updateWrapper();

        expect(wrapper.attributes('data-dt-mode')).toBe('dark');
      });
    });

    describe('When mode is "inverted" (default)', () => {
      it('should invert root mode when no parent', () => {
        // Root is set to light in beforeEach
        expect(wrapper.attributes('data-dt-mode')).toBe('dark');
      });

      it('should invert dark root mode', async () => {
        document.documentElement.setAttribute('data-dt-mode', 'dark');
        updateWrapper();
        await wrapper.vm.$nextTick();
        expect(wrapper.attributes('data-dt-mode')).toBe('light');
      });
    });
  });

  describe('Contrast Tests', () => {
    it('should inherit contrast from root', () => {
      expect(wrapper.attributes('data-dt-contrast')).toBe('default');
    });

    it('should update contrast when root changes', async () => {
      document.documentElement.setAttribute('data-dt-contrast', 'high');
      // Trigger the mutation observer
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(wrapper.vm.currentContrast).toBe('high');
    });
  });

  describe('As Prop Tests', () => {
    it('should render as div by default', () => {
      expect(wrapper.element.tagName.toLowerCase()).toBe('div');
    });

    it('should render as specified element', () => {
      mockProps = { as: 'section' };

      updateWrapper();

      expect(wrapper.element.tagName.toLowerCase()).toBe('section');
    });
  });

  describe('Nested Mode Islands', () => {
    it('should invert parent mode island', async () => {
      const parentWrapper = mount({
        template: `
          <dt-mode-island mode="dark" data-qa="parent">
            <dt-mode-island mode="inverted" data-qa="child">
              <div>Nested Content</div>
            </dt-mode-island>
          </dt-mode-island>
        `,
        components: { DtModeIsland },
      });

      await parentWrapper.vm.$nextTick();
      const parent = parentWrapper.find('[data-qa="parent"]');
      const child = parentWrapper.find('[data-qa="child"]');

      expect(parent.attributes('data-dt-mode')).toBe('dark');
      expect(child.attributes('data-dt-mode')).toBe('light');
    });

    it('should handle multiple nesting levels', async () => {
      const nestedWrapper = mount({
        template: `
          <dt-mode-island mode="light" data-qa="level1">
            <dt-mode-island mode="inverted" data-qa="level2">
              <dt-mode-island mode="inverted" data-qa="level3">
                <div>Deep Nested</div>
              </dt-mode-island>
            </dt-mode-island>
          </dt-mode-island>
        `,
        components: { DtModeIsland },
      });

      await nestedWrapper.vm.$nextTick();
      const level1 = nestedWrapper.find('[data-qa="level1"]');
      const level2 = nestedWrapper.find('[data-qa="level2"]');
      const level3 = nestedWrapper.find('[data-qa="level3"]');

      expect(level1.attributes('data-dt-mode')).toBe('light');
      expect(level2.attributes('data-dt-mode')).toBe('dark');
      expect(level3.attributes('data-dt-mode')).toBe('light');
    });
  });

  describe('Brand Protection Tests', () => {
    it('should throw error when data-dt-brand is set', () => {
      expect(() => {
        mount(DtModeIsland, {
          attrs: { 'data-dt-brand': 'test' },
        });
      }).toThrow('[DtModeIsland] The data-dt-brand attribute is not allowed on mode islands');
    });
  });

  describe('Attribute Passthrough Tests', () => {
    it('should pass through class attribute', () => {
      mockAttrs = { class: 'd-p16 d-bgc-primary' };

      updateWrapper();

      expect(wrapper.classes()).toContain('d-p16');
      expect(wrapper.classes()).toContain('d-bgc-primary');
    });

    it('should pass through id attribute', () => {
      mockAttrs = { id: 'test-island' };

      updateWrapper();

      expect(wrapper.attributes('id')).toBe('test-island');
    });

    it('should pass through data attributes', () => {
      mockAttrs = { 'data-test': 'value' };

      updateWrapper();

      expect(wrapper.attributes('data-test')).toBe('value');
    });
  });

  describe('Cleanup Tests', () => {
    it('should cleanup MutationObserver on unmount', async () => {
      const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');
      updateWrapper();
      const observer = wrapper.vm.contrastObserver;
      expect(observer).toBeDefined();

      wrapper.destroy();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
