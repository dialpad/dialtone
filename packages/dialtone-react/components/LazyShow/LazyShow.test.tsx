import { cleanup, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtLazyShow, type DtLazyShowProps } from './LazyShow';

let mockProps: DtLazyShowProps = {};
let mockAttrs: Record<string, string> = {};
let mockSlots: { children?: React.ReactNode } = {};

describe('DtLazyShow Tests', () => {
  let result: RenderResult;

  const updateWrapper = () => {
    cleanup();
    result = render(<DtLazyShow {...mockProps} {...mockAttrs} {...mockSlots} />);
  };

  const setProps = async (props: DtLazyShowProps) => {
    mockProps = { ...mockProps, ...props };
    result.rerender(<DtLazyShow {...mockProps} {...mockAttrs} {...mockSlots} />);
    await finishTransitions();
  };

  const content = (qa = 'dt-lazy-show') => screen.getByTestId(qa);
  const isVisible = (el: HTMLElement) => el.style.display !== 'none';

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    cleanup();
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('should keep slot content unrendered until first shown', () => {
      mockSlots = { children: <input data-qa="lazy-show-value" /> };
      updateWrapper();

      expect(isVisible(content())).toBe(false);
      expect(screen.queryByTestId('lazy-show-value')).toBeNull();
    });

    it('should render slot content when initially shown', () => {
      mockProps = { show: true };
      mockSlots = { children: <p data-qa="lazy-show-content">Content</p> };
      updateWrapper();

      expect(isVisible(content())).toBe(true);
      expect(content('lazy-show-content').textContent).toBe('Content');
    });
  });

  describe('Interactivity Tests', () => {
    it('should preserve user-entered content when hidden and shown again', async () => {
      mockSlots = { children: <input data-qa="lazy-show-value" /> };
      updateWrapper();

      await setProps({ show: true });
      fireEvent.change(content('lazy-show-value'), { target: { value: 'Keep this value' } });
      await setProps({ show: false });

      expect(isVisible(content())).toBe(false);
      expect((content('lazy-show-value') as HTMLInputElement).value).toBe('Keep this value');

      await setProps({ show: true });

      expect(isVisible(content())).toBe(true);
      expect((content('lazy-show-value') as HTMLInputElement).value).toBe('Keep this value');
    });
  });

  describe('Accessibility Tests', () => {
    it('should forward caller attributes to the rendered content element', () => {
      mockAttrs = { id: 'lazy-content', className: 'custom-content', 'aria-describedby': 'description' };
      updateWrapper();

      const el = content();

      expect(el.getAttribute('id')).toBe('lazy-content');
      expect(el.classList).toContain('custom-content');
      expect(el.getAttribute('aria-describedby')).toBe('description');
    });

    it('should preserve caller data-qa and visibility on the actual content div', async () => {
      mockAttrs = { 'data-qa': 'custom-content' };
      updateWrapper();

      const el = content('custom-content');

      expect(el.tagName).toBe('DIV');
      expect(isVisible(el)).toBe(false);

      await setProps({ show: true });
      expect(isVisible(el)).toBe(true);

      await setProps({ show: false });
      expect(isVisible(el)).toBe(false);
      expect(el.getAttribute('data-qa')).toBe('custom-content');
    });
  });
});
