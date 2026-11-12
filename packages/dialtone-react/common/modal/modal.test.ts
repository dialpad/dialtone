import { StrictMode } from 'react';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useModal, type TabPressEvent } from './useModal';

// dialtone-vue has no test for the modal mixin; these are React-only.
const mount = (html: string) => {
  const root = document.createElement('div');
  root.innerHTML = html;
  document.body.appendChild(root);
  return root;
};

const renderModal = (rootEl?: Node | null) =>
  renderHook(({ el }: { el?: Node | null }) => useModal(el), { initialProps: { el: rootEl }, wrapper: StrictMode });

const tabEvent = (shiftKey = false, key = 'Tab') => {
  const preventDefault = vi.fn();
  const event: TabPressEvent = { key, shiftKey, preventDefault };
  return { event, preventDefault };
};

describe('Modal Mixin Tests', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('getFirstFocusableElement', () => {
    it('returns the first focusable element, including tabindex="-1"', async () => {
      const root = mount('<span></span><button tabindex="-1" id="a">a</button><button id="b">b</button>');
      const { result } = renderModal(root);
      expect((await result.current.getFirstFocusableElement())?.id).toBe('a');
    });

    it('skips disabled, aria-disabled and presentation elements', async () => {
      const root = mount(`
        <button disabled>x</button>
        <button aria-disabled="true">x</button>
        <button role="presentation">x</button>
        <button id="ok">ok</button>`);
      const { result } = renderModal(root);
      expect((await result.current.getFirstFocusableElement())?.id).toBe('ok');
    });

    it('skips elements hidden with display: none or visibility: hidden', async () => {
      const root = mount(`
        <button style="display: none">x</button>
        <button style="visibility: hidden">x</button>
        <button id="ok">ok</button>`);
      const { result } = renderModal(root);
      expect((await result.current.getFirstFocusableElement())?.id).toBe('ok');
    });

    it('returns undefined when nothing is focusable', async () => {
      const root = mount('<p>nothing here</p>');
      const { result } = renderModal(root);
      expect(await result.current.getFirstFocusableElement()).toBeUndefined();
    });

    it('returns undefined without a root element', async () => {
      const { result } = renderModal(null);
      expect(await result.current.getFirstFocusableElement()).toBeUndefined();
    });

    it('uses the given element rather than the root', async () => {
      const root = mount('<button id="root-btn">a</button><div id="other"><button id="other-btn">b</button></div>');
      const { result } = renderModal(root);
      const other = root.querySelector('#other');
      expect((await result.current.getFirstFocusableElement(other))?.id).toBe('other-btn');
    });

    it('starts from the first element sibling when given a text node', async () => {
      const root = mount('text<div><button id="in">a</button></div>');
      const { result } = renderModal(root.firstChild);
      expect((await result.current.getFirstFocusableElement())?.id).toBe('in');
    });

    it('prefers the checked radio of the group when the first element is an unchecked radio', async () => {
      const root = mount(`
        <input type="radio" name="g" id="r1" />
        <input type="radio" name="g" id="r2" checked />
        <input type="radio" name="h" id="r3" checked />`);
      const { result } = renderModal(root);
      expect((await result.current.getFirstFocusableElement())?.id).toBe('r2');
    });

    it('keeps the first radio when none of its group is checked', async () => {
      const root = mount('<input type="radio" name="g" id="r1" /><input type="radio" name="g" id="r2" />');
      const { result } = renderModal(root);
      expect((await result.current.getFirstFocusableElement())?.id).toBe('r1');
    });
  });

  describe('focusFirstElement', () => {
    it('focuses the first focusable element, including tabindex="-1"', async () => {
      const root = mount('<button tabindex="-1" id="a">a</button><button id="b">b</button>');
      const { result } = renderModal(root);
      await result.current.focusFirstElement();
      expect(document.activeElement?.id).toBe('a');
    });

    it('focuses without scrolling', async () => {
      const root = mount('<button id="a">a</button>');
      const focus = vi.spyOn(HTMLElement.prototype, 'focus');
      const { result } = renderModal(root);
      await result.current.focusFirstElement();
      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    });

    it('focuses inside the given element', async () => {
      const root = mount('<button id="a">a</button><div id="other"><button id="b">b</button></div>');
      const { result } = renderModal(root);
      await result.current.focusFirstElement(root.querySelector('#other'));
      expect(document.activeElement?.id).toBe('b');
    });

    it('does nothing when there is nothing to focus', async () => {
      const root = mount('<p>nothing</p>');
      const { result } = renderModal(root);
      await result.current.focusFirstElement();
      expect(document.activeElement).toBe(document.body);
    });
  });

  describe('focusElementById', () => {
    it('focuses the element the selector matches', async () => {
      const root = mount('<button id="a">a</button><button id="b">b</button>');
      const { result } = renderModal(root);
      await result.current.focusElementById('#b');
      expect(document.activeElement?.id).toBe('b');
    });

    it('warns and focuses the first element when the selector matches nothing', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const root = mount('<button id="a">a</button><button id="b">b</button>');
      const { result } = renderModal(root);
      await result.current.focusElementById('#missing');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('initialFocusElement'));
      expect(document.activeElement?.id).toBe('a');
    });
  });

  describe('focusTrappedTabPress', () => {
    const buttons = '<button id="a">a</button><button id="b">b</button><button id="c">c</button>';

    it('ignores keys other than Tab', () => {
      const root = mount(buttons);
      root.querySelector<HTMLElement>('#c')?.focus();
      const { result } = renderModal(root);
      const { event, preventDefault } = tabEvent(false, 'Enter');
      result.current.focusTrappedTabPress(event);
      expect(preventDefault).not.toHaveBeenCalled();
      expect(document.activeElement?.id).toBe('c');
    });

    it('wraps from the last to the first element on Tab', () => {
      const root = mount(buttons);
      root.querySelector<HTMLElement>('#c')?.focus();
      const { result } = renderModal(root);
      const { event, preventDefault } = tabEvent();
      result.current.focusTrappedTabPress(event);
      expect(preventDefault).toHaveBeenCalled();
      expect(document.activeElement?.id).toBe('a');
    });

    it('wraps from the first to the last element on Shift+Tab', () => {
      const root = mount(buttons);
      root.querySelector<HTMLElement>('#a')?.focus();
      const { result } = renderModal(root);
      const { event, preventDefault } = tabEvent(true);
      result.current.focusTrappedTabPress(event);
      expect(preventDefault).toHaveBeenCalled();
      expect(document.activeElement?.id).toBe('c');
    });

    it('leaves Tab alone in the middle of the component', () => {
      const root = mount(buttons);
      root.querySelector<HTMLElement>('#b')?.focus();
      const { result } = renderModal(root);
      const forward = tabEvent();
      const backward = tabEvent(true);
      result.current.focusTrappedTabPress(forward.event);
      result.current.focusTrappedTabPress(backward.event);
      expect(forward.preventDefault).not.toHaveBeenCalled();
      expect(backward.preventDefault).not.toHaveBeenCalled();
      expect(document.activeElement?.id).toBe('b');
    });

    it('does not count tabindex="-1" elements as the last element', () => {
      const root = mount('<button id="a">a</button><button id="b">b</button><button id="c" tabindex="-1">c</button>');
      root.querySelector<HTMLElement>('#b')?.focus();
      const { result } = renderModal(root);
      const { event, preventDefault } = tabEvent();
      result.current.focusTrappedTabPress(event);
      expect(preventDefault).toHaveBeenCalled();
      expect(document.activeElement?.id).toBe('a');
    });

    it('prevents Tab when there is nothing tabbable', () => {
      const root = mount('<p>nothing</p>');
      const { result } = renderModal(root);
      const { event, preventDefault } = tabEvent();
      result.current.focusTrappedTabPress(event);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('traps within the given element rather than the root', () => {
      const root = mount('<button id="a">a</button><div id="other"><button id="b">b</button></div>');
      root.querySelector<HTMLElement>('#b')?.focus();
      const { result } = renderModal(root);
      const { event, preventDefault } = tabEvent();
      result.current.focusTrappedTabPress(event, root.querySelector('#other'));
      expect(preventDefault).toHaveBeenCalled();
      expect(document.activeElement?.id).toBe('b');
    });
  });

  describe('When the root element changes', () => {
    it('uses the new root element', async () => {
      const first = mount('<button id="a">a</button>');
      const second = mount('<button id="b">b</button>');
      const { result, rerender } = renderModal(first);
      rerender({ el: second });
      await result.current.focusFirstElement();
      expect(document.activeElement?.id).toBe('b');
    });

    it('keeps the same methods while the root element stays', () => {
      const root = mount('<button>a</button>');
      const { result, rerender } = renderModal(root);
      const before = result.current;
      rerender({ el: root });
      expect(result.current).toBe(before);
    });
  });
});
