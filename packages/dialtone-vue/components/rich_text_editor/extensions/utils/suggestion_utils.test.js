import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  DEFAULT_PLACEMENT,
  DEFAULT_Z_INDEX,
  createDefaultVirtualElement,
  createVirtualElement,
  updateFloatingPosition,
  initializeFloatingElement,
  showFloatingElement,
  hideFloatingElement,
  createEscapeHandler,
  attachEscapeHandler,
  detachEscapeHandler,
  createSuggestionComponent,
  cleanupSuggestionPopup,
} from './suggestion_utils';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn(() => Promise.resolve({ x: 100, y: 200 })),
  flip: vi.fn(() => 'flip-middleware'),
  shift: vi.fn(() => 'shift-middleware'),
  offset: vi.fn(() => 'offset-middleware'),
}));

vi.mock('@tiptap/vue-3', () => ({
  VueRenderer: vi.fn().mockImplementation(function () {
    return {
      element: document.createElement('div'),
      destroy: vi.fn(),
      updateProps: vi.fn(),
      ref: { onKeyDown: vi.fn() },
    };
  }),
}));

vi.mock('vue', () => ({
  markRaw: vi.fn((component) => component),
}));

describe('suggestion_utils', () => {
  describe('Constants', () => {
    it('DEFAULT_PLACEMENT should be top-start', () => {
      expect(DEFAULT_PLACEMENT).toBe('top-start');
    });

    it('DEFAULT_Z_INDEX should be 650', () => {
      expect(DEFAULT_Z_INDEX).toBe('650');
    });
  });

  describe('createDefaultVirtualElement', () => {
    it('should return an object with getBoundingClientRect method', () => {
      const virtualEl = createDefaultVirtualElement();
      expect(typeof virtualEl.getBoundingClientRect).toBe('function');
    });

    it('should return zero dimensions from getBoundingClientRect', () => {
      const virtualEl = createDefaultVirtualElement();
      const rect = virtualEl.getBoundingClientRect();

      expect(rect).toEqual({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      });
    });
  });

  describe('createVirtualElement', () => {
    it('should wrap clientRect function in an object', () => {
      const mockClientRect = vi.fn(() => ({ top: 10, left: 20 }));
      const virtualEl = createVirtualElement(mockClientRect);

      expect(virtualEl.getBoundingClientRect).toBe(mockClientRect);
    });

    it('should call the provided clientRect function when getBoundingClientRect is called', () => {
      const mockClientRect = vi.fn(() => ({ top: 10, left: 20 }));
      const virtualEl = createVirtualElement(mockClientRect);

      const result = virtualEl.getBoundingClientRect();

      expect(mockClientRect).toHaveBeenCalled();
      expect(result).toEqual({ top: 10, left: 20 });
    });
  });

  describe('updateFloatingPosition', () => {
    let floatingEl;
    let virtualEl;

    beforeEach(() => {
      floatingEl = document.createElement('div');
      virtualEl = createDefaultVirtualElement();
    });

    it('should return early if floatingEl is null', async () => {
      await updateFloatingPosition(null, virtualEl);
      // No error should be thrown
    });

    it('should return early if virtualEl is null', async () => {
      await updateFloatingPosition(floatingEl, null);
      // No error should be thrown
    });

    it('should return early if virtualEl has no getBoundingClientRect', async () => {
      await updateFloatingPosition(floatingEl, {});
      // No error should be thrown
    });

    it('should update floatingEl position styles', async () => {
      await updateFloatingPosition(floatingEl, virtualEl);

      expect(floatingEl.style.left).toBe('100px');
      expect(floatingEl.style.top).toBe('200px');
    });
  });

  describe('initializeFloatingElement', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
    });

    it('should set position to absolute', () => {
      initializeFloatingElement(element);
      expect(element.style.position).toBe('absolute');
    });

    it('should set default z-index', () => {
      initializeFloatingElement(element);
      expect(element.style.zIndex).toBe('650');
    });

    it('should set display to none', () => {
      initializeFloatingElement(element);
      expect(element.style.display).toBe('none');
    });

    it('should use custom z-index when provided', () => {
      initializeFloatingElement(element, { zIndex: '999' });
      expect(element.style.zIndex).toBe('999');
    });
  });

  describe('showFloatingElement', () => {
    it('should set display to block', () => {
      const element = document.createElement('div');
      element.style.display = 'none';

      showFloatingElement(element);

      expect(element.style.display).toBe('block');
    });

    it('should not throw if element is null', () => {
      expect(() => showFloatingElement(null)).not.toThrow();
    });
  });

  describe('hideFloatingElement', () => {
    it('should set display to none', () => {
      const element = document.createElement('div');
      element.style.display = 'block';

      hideFloatingElement(element);

      expect(element.style.display).toBe('none');
    });

    it('should not throw if element is null', () => {
      expect(() => hideFloatingElement(null)).not.toThrow();
    });
  });

  describe('createEscapeHandler', () => {
    it('should return a function', () => {
      const handler = createEscapeHandler(vi.fn(), () => true);
      expect(typeof handler).toBe('function');
    });

    it('should call onEscape when Escape is pressed and isActive returns true', () => {
      const onEscape = vi.fn();
      const isActive = vi.fn(() => true);
      const handler = createEscapeHandler(onEscape, isActive);

      handler({ key: 'Escape' });

      expect(isActive).toHaveBeenCalled();
      expect(onEscape).toHaveBeenCalled();
    });

    it('should not call onEscape when isActive returns false', () => {
      const onEscape = vi.fn();
      const isActive = vi.fn(() => false);
      const handler = createEscapeHandler(onEscape, isActive);

      handler({ key: 'Escape' });

      expect(isActive).toHaveBeenCalled();
      expect(onEscape).not.toHaveBeenCalled();
    });

    it('should not call onEscape for non-Escape keys', () => {
      const onEscape = vi.fn();
      const isActive = vi.fn(() => true);
      const handler = createEscapeHandler(onEscape, isActive);

      handler({ key: 'Enter' });

      expect(onEscape).not.toHaveBeenCalled();
    });
  });

  describe('attachEscapeHandler', () => {
    it('should add keydown event listener to document', () => {
      const handler = vi.fn();
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      attachEscapeHandler(handler);

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', handler);

      addEventListenerSpy.mockRestore();
    });
  });

  describe('detachEscapeHandler', () => {
    it('should remove keydown event listener from document', () => {
      const handler = vi.fn();
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      detachEscapeHandler(handler);

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', handler);

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('createSuggestionComponent', () => {
    it('should create a VueRenderer with correct props', async () => {
      const { VueRenderer } = await import('@tiptap/vue-3');
      VueRenderer.mockClear();

      const listComponent = { name: 'ListComponent' };
      const itemComponent = { name: 'ItemComponent' };
      const itemType = 'test-type';
      const props = { editor: {}, items: [] };

      createSuggestionComponent(listComponent, itemComponent, itemType, props);

      expect(VueRenderer).toHaveBeenCalledWith(listComponent, {
        props: {
          itemComponent,
          itemType,
          editor: {},
          items: [],
        },
        editor: {},
      });
    });
  });

  describe('cleanupSuggestionPopup', () => {
    let state;

    beforeEach(() => {
      state = {
        escHandler: vi.fn(),
        floatingEl: document.createElement('div'),
        component: { destroy: vi.fn() },
      };
      document.body.appendChild(state.floatingEl);
    });

    afterEach(() => {
      state.floatingEl?.remove();
    });

    it('should detach escape handler if present', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      cleanupSuggestionPopup(state);

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', state.escHandler);

      removeEventListenerSpy.mockRestore();
    });

    it('should remove floating element from DOM', () => {
      cleanupSuggestionPopup(state);

      expect(document.body.contains(state.floatingEl)).toBe(false);
    });

    it('should destroy the component', () => {
      cleanupSuggestionPopup(state);

      expect(state.component.destroy).toHaveBeenCalled();
    });

    it('should handle null escHandler', () => {
      state.escHandler = null;

      expect(() => cleanupSuggestionPopup(state)).not.toThrow();
    });

    it('should handle null floatingEl', () => {
      state.floatingEl = null;

      expect(() => cleanupSuggestionPopup(state)).not.toThrow();
    });

    it('should handle null component', () => {
      state.component = null;

      expect(() => cleanupSuggestionPopup(state)).not.toThrow();
    });
  });
});
