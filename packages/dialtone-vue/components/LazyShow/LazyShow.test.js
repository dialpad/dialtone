import { mount } from '@vue/test-utils';
import DtLazyShow from './LazyShow.vue';

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtLazyShow Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper?.unmount();
    wrapper = mount(DtLazyShow, {
      props: { ...mockProps },
      attrs: { ...mockAttrs },
      slots: { ...mockSlots },
      global: { stubs: { transition: false } },
      attachTo: document.body,
    });
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
    wrapper = undefined;
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('should keep slot content unrendered until first shown', () => {
      mockSlots = { default: '<input data-qa="lazy-show-value">' };
      updateWrapper();

      expect(wrapper.find('[data-qa="dt-lazy-show"]').isVisible()).toBe(false);
      expect(wrapper.find('[data-qa="lazy-show-value"]').exists()).toBe(false);
    });

    it('should render slot content when initially shown', () => {
      mockProps = { show: true };
      mockSlots = { default: '<p data-qa="lazy-show-content">Content</p>' };
      updateWrapper();

      expect(wrapper.find('[data-qa="dt-lazy-show"]').isVisible()).toBe(true);
      expect(wrapper.find('[data-qa="lazy-show-content"]').text()).toBe('Content');
    });
  });

  describe('Interactivity Tests', () => {
    it('should preserve user-entered content when hidden and shown again', async () => {
      mockSlots = { default: '<input data-qa="lazy-show-value">' };
      updateWrapper();

      await wrapper.setProps({ show: true });
      await wrapper.find('[data-qa="lazy-show-value"]').setValue('Keep this value');
      await wrapper.setProps({ show: false });

      expect(wrapper.find('[data-qa="dt-lazy-show"]').isVisible()).toBe(false);
      expect(wrapper.find('[data-qa="lazy-show-value"]').element.value).toBe('Keep this value');

      await wrapper.setProps({ show: true });

      expect(wrapper.find('[data-qa="dt-lazy-show"]').isVisible()).toBe(true);
      expect(wrapper.find('[data-qa="lazy-show-value"]').element.value).toBe('Keep this value');
    });
  });

  describe('Accessibility Tests', () => {
    it('should forward caller attributes to the rendered content element', () => {
      mockAttrs = { id: 'lazy-content', class: 'custom-content', 'aria-describedby': 'description' };
      updateWrapper();

      const content = wrapper.find('[data-qa="dt-lazy-show"]');

      expect(content.attributes('id')).toBe('lazy-content');
      expect(content.classes()).toContain('custom-content');
      expect(content.attributes('aria-describedby')).toBe('description');
    });

    it('should preserve caller data-qa and visibility on the actual content div', async () => {
      mockAttrs = { 'data-qa': 'custom-content' };
      updateWrapper();

      const content = wrapper.find('[data-qa="custom-content"]');

      expect(content.element.tagName).toBe('DIV');
      expect(content.isVisible()).toBe(false);

      await wrapper.setProps({ show: true });
      expect(content.isVisible()).toBe(true);

      await wrapper.setProps({ show: false });
      expect(content.isVisible()).toBe(false);
      expect(content.attributes('data-qa')).toBe('custom-content');
    });
  });
});
