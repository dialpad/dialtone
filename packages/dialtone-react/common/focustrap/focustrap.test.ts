import { act, createElement, StrictMode, useState, type ReactNode } from 'react';
import { fireEvent, render, type RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FOCUSTRAP_DEFAULTS, FOCUSTRAP_STATE_KEY } from './focustrap_constants';
import { useFocusTrap, type FocusTrapHost, type FocusTrapValue } from './useFocusTrap';

// ── Helpers ─────────────────────────────────────────────────

// Vue's flushPromises: let the trap's microtask (the initial focus) run.
const flushPromises = () => act(async () => {});

interface DialogProps {
  config?: FocusTrapValue;
  role?: string;
  label?: string;
  children?: ReactNode;
}

const defaultChildren = () => [
  createElement('button', { key: 'first', 'data-qa': 'first' }, 'First'),
  createElement('input', { key: 'second', 'data-qa': 'second' }),
  createElement('a', { key: 'third', href: '#', 'data-qa': 'third' }, 'Third'),
];

// The element Vue's templates put `v-dt-focustrap="config"` on.
function Dialog ({ config, role = 'dialog', label = 'Test dialog', children = defaultChildren() }: DialogProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useFocusTrap(el, config);
  return createElement('div', { ref: setEl, role, 'data-qa': 'trap', 'aria-label': label }, children);
}

// Vue's `wrapper.setData` is a rerender with new props.
const ui = (props: DialogProps) => createElement(StrictMode, null, createElement(Dialog, props));

const radio = (name: string, value: string, extra: Record<string, unknown> = {}) =>
  createElement('input', { key: value, type: 'radio', name, value, 'data-qa': `radio-${value}`, ...extra });

const dynamicChildren = (showMiddle: boolean) => [
  createElement('button', { key: 'first', 'data-qa': 'first' }, 'First'),
  showMiddle ? createElement('button', { key: 'middle', 'data-qa': 'middle' }, 'Middle') : null,
  createElement('button', { key: 'last', 'data-qa': 'last' }, 'Last'),
];

// ── Tests ───────────────────────────────────────────────────

describe('DtFocustrapDirective', () => {
  let wrapper: RenderResult | null;

  const mountWith = (props: DialogProps) => {
    wrapper = render(ui(props));
    return wrapper;
  };
  const mountDialog = (config: FocusTrapValue = true) => mountWith({ config });
  const setConfig = (props: DialogProps) => wrapper!.rerender(ui(props));
  const find = (qa: string) => wrapper!.getByTestId(qa);
  const trap = () => find('trap') as FocusTrapHost;
  const tab = (shiftKey = false) => fireEvent.keyDown(find('trap'), { key: 'Tab', shiftKey });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
  });

  // ── Default rendering ──────────────────────────────────

  describe('Default rendering', () => {
    it('should mount without errors', async () => {
      mountDialog();
      await flushPromises();

      expect(wrapper!.queryByTestId('trap')).toBeInTheDocument();
    });

    it('should store state on the container element', async () => {
      mountDialog();
      await flushPromises();

      expect(trap()[FOCUSTRAP_STATE_KEY]).toBeDefined();
    });

    it('should activate the trap on mount', async () => {
      mountDialog();
      await flushPromises();

      expect(trap()[FOCUSTRAP_STATE_KEY]!.active).toBe(true);
    });

    it('should register a keydown listener on the container', async () => {
      mountDialog();
      await flushPromises();

      expect(trap()[FOCUSTRAP_STATE_KEY]!.onKeydown).toBeTypeOf('function');
    });
  });

  // ── Tab wrapping ───────────────────────────────────────

  describe('Tab wrapping', () => {
    it('should wrap focus from last element to first on Tab', async () => {
      mountDialog();
      await flushPromises();

      find('third').focus();
      tab();

      expect(document.activeElement).toBe(find('first'));
    });

    it('should wrap focus from first element to last on Shift+Tab', async () => {
      mountDialog();
      await flushPromises();

      find('first').focus();
      tab(true);

      expect(document.activeElement).toBe(find('third'));
    });

    it('should not interfere with Tab between middle elements', async () => {
      mountDialog();
      await flushPromises();

      find('second').focus();
      // fireEvent returns false when the handler cancelled the event; a middle Tab must be left to the browser.
      const notCancelled = tab();

      expect(notCancelled).toBe(true);
      expect(document.activeElement).toBe(find('second'));
    });
  });

  // ── Initial focus: auto ────────────────────────────────

  describe('Initial focus: auto', () => {
    it('should focus the first focusable element on activation', async () => {
      mountDialog();
      await flushPromises();

      expect(document.activeElement).toBe(find('first'));
    });
  });

  // ── Initial focus: CSS selector ────────────────────────

  describe('Initial focus: CSS selector', () => {
    it('should focus the element matching the selector', async () => {
      mountDialog({ active: true, initialFocus: '[data-qa="second"]' });
      await flushPromises();

      expect(document.activeElement).toBe(find('second'));
    });

    it('should fall back to container if selector matches nothing', async () => {
      mountDialog({ active: true, initialFocus: '[data-qa="nonexistent"]' });
      await flushPromises();

      expect(document.activeElement).toBe(find('trap'));
    });
  });

  // ── Initial focus: false ───────────────────────────────

  describe('Initial focus: false', () => {
    it('should not move focus when initialFocus is false', async () => {
      const outsideBtn = document.createElement('button');
      outsideBtn.setAttribute('data-qa', 'outside');
      document.body.appendChild(outsideBtn);
      outsideBtn.focus();

      mountDialog({ active: true, initialFocus: false });
      await flushPromises();

      expect(document.activeElement).toBe(outsideBtn);

      outsideBtn.remove();
    });
  });

  // ── Initial focus: radio button ────────────────────────

  describe('Initial focus: radio button', () => {
    it('should prefer checked radio over first unchecked radio', async () => {
      mountWith({
        config: { active: true },
        label: 'Radio dialog',
        children: [radio('choice', 'a'), radio('choice', 'b', { defaultChecked: true }), radio('choice', 'c')],
      });
      await flushPromises();

      expect(document.activeElement).toBe(find('radio-b'));
    });

    it('should focus first radio when none is checked', async () => {
      mountWith({
        config: { active: true },
        label: 'Radio dialog',
        children: [radio('choice', 'a'), radio('choice', 'b')],
      });
      await flushPromises();

      expect(document.activeElement).toBe(find('radio-a'));
    });
  });

  // ── Focus restoration ──────────────────────────────────

  describe('Focus restoration', () => {
    let outsideBtn: HTMLButtonElement;

    beforeEach(() => {
      outsideBtn = document.createElement('button');
      outsideBtn.setAttribute('data-qa', 'outside');
      document.body.appendChild(outsideBtn);
      outsideBtn.focus();
    });

    afterEach(() => {
      outsideBtn.remove();
    });

    it('should restore focus to previously focused element on deactivation', async () => {
      mountWith({ config: true, children: createElement('button', { 'data-qa': 'first' }, 'First') });
      await flushPromises();

      setConfig({ config: false, children: createElement('button', { 'data-qa': 'first' }, 'First') });
      await flushPromises();

      expect(document.activeElement).toBe(outsideBtn);
    });

    it('should not restore focus when restoreFocus is false', async () => {
      const first = () => createElement('button', { 'data-qa': 'first' }, 'First');
      mountWith({ config: { active: true, restoreFocus: false }, children: first() });
      await flushPromises();

      setConfig({ config: { active: false, restoreFocus: false }, children: first() });
      await flushPromises();

      expect(document.activeElement).not.toBe(outsideBtn);
    });
  });

  // ── Reactive activation ────────────────────────────────

  describe('Reactive activation', () => {
    it('should set active state when binding changes from false to true', async () => {
      mountDialog(false);
      await flushPromises();

      setConfig({ config: true });
      await flushPromises();

      expect(trap()[FOCUSTRAP_STATE_KEY]!.active).toBe(true);
    });

    it('should focus first element when binding changes from false to true', async () => {
      mountDialog(false);
      await flushPromises();

      setConfig({ config: true });
      await flushPromises();

      expect(document.activeElement).toBe(find('first'));
    });

    it('should activate with object binding change', async () => {
      mountDialog({ active: false });
      await flushPromises();

      setConfig({ config: { active: true } });
      await flushPromises();

      expect(document.activeElement).toBe(find('first'));
    });
  });

  // ── Reactive deactivation ──────────────────────────────

  describe('Reactive deactivation', () => {
    it('should set active state to false when binding changes from true to false', async () => {
      mountDialog(true);
      await flushPromises();

      setConfig({ config: false });
      await flushPromises();

      expect(trap()[FOCUSTRAP_STATE_KEY]!.active).toBe(false);
    });

    it('should restore focus when binding changes from true to false', async () => {
      const outsideBtn = document.createElement('button');
      outsideBtn.setAttribute('data-qa', 'outside');
      document.body.appendChild(outsideBtn);
      outsideBtn.focus();

      mountDialog(true);
      await flushPromises();

      setConfig({ config: false });
      await flushPromises();

      expect(document.activeElement).toBe(outsideBtn);

      outsideBtn.remove();
    });

    it('should remove keydown listener on deactivation', async () => {
      mountDialog(true);
      await flushPromises();

      const state = trap()[FOCUSTRAP_STATE_KEY]!;
      expect(state.onKeydown).toBeTypeOf('function');

      setConfig({ config: false });
      await flushPromises();

      expect(state.onKeydown).toBeNull();
    });
  });

  // ── Boolean binding ────────────────────────────────────

  describe('Boolean binding', () => {
    it('should activate the trap when bound to true', async () => {
      mountDialog(true);
      await flushPromises();

      expect(trap()[FOCUSTRAP_STATE_KEY]!.active).toBe(true);
    });

    it('should focus first element when bound to true', async () => {
      mountDialog(true);
      await flushPromises();

      expect(document.activeElement).toBe(find('first'));
    });

    it('should treat false as { active: false }', async () => {
      mountDialog(false);
      await flushPromises();

      expect(trap()[FOCUSTRAP_STATE_KEY]!.active).toBe(false);
    });
  });

  // ── Zero focusable elements ────────────────────────────

  describe('Zero focusable elements', () => {
    const emptyDialog = () => mountWith({
      config: true,
      role: 'dialog',
      label: 'Empty dialog',
      children: createElement('p', null, 'No focusable elements here'),
    });

    it('should prevent Tab without errors when no focusable elements exist', async () => {
      emptyDialog();
      await flushPromises();

      // Vue's test asserts nothing, so it can't fail. fireEvent returns false when the event was cancelled.
      expect(tab()).toBe(false);
    });

    it('should call preventDefault on Tab when no focusable elements exist', async () => {
      emptyDialog();
      await flushPromises();

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      const spy = vi.spyOn(event, 'preventDefault');
      find('trap').dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });
  });

  // ── Dynamic content ────────────────────────────────────

  describe('Dynamic content', () => {
    it('should include newly added elements in Tab wrapping', async () => {
      mountWith({ config: true, label: 'Dynamic dialog', children: dynamicChildren(false) });
      await flushPromises();

      setConfig({ config: true, label: 'Dynamic dialog', children: dynamicChildren(true) });
      await flushPromises();

      find('last').focus();
      tab();
      expect(document.activeElement).toBe(find('first'));
    });

    it('should handle removed focusable elements', async () => {
      mountWith({ config: true, label: 'Dynamic dialog', children: dynamicChildren(true) });
      await flushPromises();

      setConfig({ config: true, label: 'Dynamic dialog', children: dynamicChildren(false) });
      await flushPromises();

      find('last').focus();
      tab();
      expect(document.activeElement).toBe(find('first'));

      find('first').focus();
      tab(true);
      expect(document.activeElement).toBe(find('last'));
    });
  });

  // ── Non-Tab keys ignored ───────────────────────────────

  describe('Non-Tab keys ignored', () => {
    it.each([
      'ArrowRight',
      'ArrowLeft',
      'ArrowDown',
      'ArrowUp',
      'Enter',
      'Escape',
      ' ',
    ])('should not interfere with %s key', async (key) => {
      mountDialog();
      await flushPromises();

      find('first').focus();
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      const spy = vi.spyOn(event, 'preventDefault');
      find('trap').dispatchEvent(event);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ── Unmount cleanup ────────────────────────────────────

  describe('Unmount cleanup', () => {
    it('should remove keydown listener on unmount', async () => {
      mountDialog();
      await flushPromises();

      const spy = vi.spyOn(find('trap'), 'removeEventListener');

      wrapper!.unmount();

      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));

      wrapper = null;
    });

    it('should restore focus on unmount when trap was active', async () => {
      const outsideBtn = document.createElement('button');
      outsideBtn.setAttribute('data-qa', 'outside');
      document.body.appendChild(outsideBtn);
      outsideBtn.focus();

      mountDialog(true);
      await flushPromises();

      wrapper!.unmount();

      expect(document.activeElement).toBe(outsideBtn);

      outsideBtn.remove();
      wrapper = null;
    });

    it('should clear state key from element on unmount', async () => {
      mountDialog();
      await flushPromises();

      const el = trap();
      expect(el[FOCUSTRAP_STATE_KEY]).toBeDefined();

      wrapper!.unmount();

      expect(el[FOCUSTRAP_STATE_KEY]).toBeUndefined();
      wrapper = null;
    });
  });

  // ── Fallback: container focused ────────────────────────

  describe('Fallback focus', () => {
    const alert = (config: FocusTrapValue) => ({
      config,
      role: 'alertdialog',
      label: 'Alert',
      children: createElement('p', null, 'Are you sure?'),
    });

    it('should remove synthetic tabindex on deactivation', async () => {
      mountWith(alert(true));
      await flushPromises();

      const el = trap();
      expect(el.getAttribute('tabindex')).toBe('-1');

      setConfig(alert(false));
      await flushPromises();

      expect(el.hasAttribute('tabindex')).toBe(false);
    });

    it('should add tabindex to container when no focusable children exist', async () => {
      mountWith(alert(true));
      await flushPromises();

      expect(trap().getAttribute('tabindex')).toBe('-1');
    });

    it('should focus container when no focusable children exist', async () => {
      mountWith(alert(true));
      await flushPromises();

      expect(document.activeElement).toBe(trap());
    });
  });

  // ── Constants ──────────────────────────────────────────

  describe('FOCUSTRAP_DEFAULTS', () => {
    it('should have expected default values', () => {
      expect(FOCUSTRAP_DEFAULTS).toEqual({
        active: true,
        initialFocus: 'auto',
        restoreFocus: true,
      });
    });

    it('should be frozen', () => {
      expect(Object.isFrozen(FOCUSTRAP_DEFAULTS)).toBe(true);
    });
  });
});

// React-only.
describe('useFocusTrap', () => {
  let wrapper: RenderResult | null;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
  });

  it('is active without options, like the directive without a binding value', async () => {
    wrapper = render(ui({ config: undefined }));
    await flushPromises();

    expect(document.activeElement).toBe(wrapper.getByTestId('first'));
  });

  it('focuses an element passed as initialFocus', async () => {
    const target = document.createElement('button');
    document.body.appendChild(target);

    wrapper = render(ui({ config: { initialFocus: target } }));
    await flushPromises();

    expect(document.activeElement).toBe(target);
    target.remove();
  });

  it('does not take focus back when it renders again with the same options', async () => {
    wrapper = render(ui({ config: { active: true } }));
    await flushPromises();
    wrapper.getByTestId('second').focus();

    wrapper.rerender(ui({ config: { active: true } }));
    await flushPromises();

    expect(document.activeElement).toBe(wrapper.getByTestId('second'));
  });

  it('keeps the trap working after StrictMode re-runs its effects', async () => {
    wrapper = render(ui({ config: true }));
    await flushPromises();

    wrapper.getByTestId('third').focus();
    fireEvent.keyDown(wrapper.getByTestId('trap'), { key: 'Tab' });

    expect(document.activeElement).toBe(wrapper.getByTestId('first'));
  });
});
