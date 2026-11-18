import { createElement, StrictMode, useState, type ReactNode } from 'react';
import { act, render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FOCUSGROUP_DEFAULTS } from './focusgroup_constants';
import {
  parseConfig,
  configsEqual,
  resolveSelector,
  resolveSkipDisabled,
  type FocusgroupValue,
} from './focusgroup_utils';
import { useFocusGroup, type FocusgroupMoveDetail } from './useFocusGroup';

// ── Helpers ─────────────────────────────────────────────────

interface ContainerProps {
  // `false` is Vue's template without `v-dt-focusgroup`; anything else is its binding value.
  config?: FocusgroupValue | false;
  role?: string;
  dir?: string;
  label?: string;
  children?: ReactNode;
}

// The element Vue's templates put `v-dt-focusgroup="config"` on.
function Container ({ config, role = 'toolbar', dir, label, children }: ContainerProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useFocusGroup(config === false ? null : el, config === false ? undefined : config);
  return createElement('div', { ref: setEl, role, dir, 'data-qa': 'container', 'aria-label': label }, children);
}

const button = (qa: string, text: string, extra: Record<string, unknown> = {}) =>
  createElement('button', { key: qa, 'data-qa': qa, ...extra }, text);

const toolbarButtons = () => [
  button('item-0', 'Bold'),
  button('item-1', 'Italic'),
  button('item-2', 'Underline'),
];

const abc = () => [button('item-0', 'A'), button('item-1', 'B'), button('item-2', 'C')];

// Vue's `wrapper.setData` is a rerender with new props.
const ui = (props: ContainerProps) => createElement(StrictMode, null, createElement(Container, props));

// ── Tests ───────────────────────────────────────────────────

describe('DtFocusgroupDirective', () => {
  let loopper: RenderResult | null = null;

  const mountWith = (props: ContainerProps) => {
    loopper = render(ui(props));
    return loopper;
  };
  const mountToolbar = (directive = true) => mountWith({
    config: directive ? undefined : false,
    label: 'Test toolbar',
    children: toolbarButtons(),
  });
  const mountWithConfig = (config: FocusgroupValue, children: ReactNode = abc(), role = 'toolbar') =>
    mountWith({ config, role, children });
  const find = (qa: string) => loopper!.getByTestId(qa);
  const getItems = () => [find('item-0'), find('item-1'), find('item-2')];
  const container = () => find('container');
  const press = (key: string) => userEvent.setup().keyboard(`{${key}}`);

  afterEach(() => {
    loopper?.unmount();
    loopper = null;
  });

  // ── Config Parsing ──────────────────────────────────────

  describe('parseConfig', () => {
    it('should return defaults for undefined', () => {
      expect(parseConfig(undefined)).toEqual(FOCUSGROUP_DEFAULTS);
    });

    it('should return defaults for true', () => {
      expect(parseConfig(true)).toEqual(FOCUSGROUP_DEFAULTS);
    });

    it('should parse "inline loop" tokens', () => {
      const config = parseConfig('horizontal loop');
      expect(config.axis).toBe('horizontal');
      expect(config.loop).toBe(true);
    });

    it('should parse "vertical noloop nomemory" tokens', () => {
      const config = parseConfig('vertical noloop nomemory');
      expect(config.axis).toBe('vertical');
      expect(config.loop).toBe(false);
      expect(config.memory).toBe(false);
    });

    it('should parse "horizontal loop nomemory noskipdisabled" tokens', () => {
      const config = parseConfig('horizontal loop nomemory noskipdisabled');
      expect(config.axis).toBe('horizontal');
      expect(config.loop).toBe(true);
      expect(config.memory).toBe(false);
      expect(config.skipDisabled).toBe(false);
    });

    it('should parse object config', () => {
      const config = parseConfig({ axis: 'horizontal', loop: false, selector: '[role="tab"]' });
      expect(config.axis).toBe('horizontal');
      expect(config.loop).toBe(false);
      expect(config.selector).toBe('[role="tab"]');
      expect(config.memory).toBe(true); // default preserved
    });
  });

  // ── Config Equality ─────────────────────────────────────

  describe('configsEqual', () => {
    it('should return true for identical configs', () => {
      const a = parseConfig('horizontal loop');
      const b = parseConfig('horizontal loop');
      expect(configsEqual(a, b)).toBe(true);
    });

    it('should return false when axis differs', () => {
      const a = parseConfig('horizontal');
      const b = parseConfig('vertical');
      expect(configsEqual(a, b)).toBe(false);
    });
  });

  // ── Selector Resolution ─────────────────────────────────

  describe('resolveSelector', () => {
    it('should use explicit selector when provided', () => {
      const el = document.createElement('div');
      expect(resolveSelector(el, { selector: '.my-item' })).toBe('.my-item');
    });

    it.each([
      ['tablist', '[role="tab"]'],
      ['listbox', '[role="option"]'],
      ['radiogroup', '[role="radio"]'],
      ['menu', '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'],
    ])('should use role-aware default for role="%s"', (role, expectedSelector) => {
      const el = document.createElement('div');
      el.setAttribute('role', role);
      expect(resolveSelector(el, { selector: null })).toBe(expectedSelector);
    });

    it('should fall back to all focusable elements for unknown role', () => {
      const el = document.createElement('div');
      el.setAttribute('role', 'region');
      expect(resolveSelector(el, { selector: null })).toContain('button');
    });
  });

  // ── Disabled Item Resolution ────────────────────────────

  describe('resolveSkipDisabled', () => {
    it('should use explicit skipDisabled when provided', () => {
      const el = document.createElement('div');
      expect(resolveSkipDisabled(el, { skipDisabled: false })).toBe(false);
    });

    it.each([
      ['tablist', false],
      ['radiogroup', true],
    ])('for role="%s", should default skipDisabled to %s', (role, expected) => {
      const el = document.createElement('div');
      el.setAttribute('role', role);
      expect(resolveSkipDisabled(el, { skipDisabled: null })).toBe(expected);
    });

    it('should default to true for unknown role', () => {
      const el = document.createElement('div');
      expect(resolveSkipDisabled(el, { skipDisabled: null })).toBe(true);
    });
  });

  // ── Presentation ────────────────────────────────────────

  describe('Presentation', () => {
    it('should set tabindex="0" on first item and "-1" on others', () => {
      mountToolbar();
      const [item0, item1, item2] = getItems();

      expect(item0).toHaveAttribute('tabindex', '0');
      expect(item1).toHaveAttribute('tabindex', '-1');
      expect(item2).toHaveAttribute('tabindex', '-1');
    });

    it('should find items at any nesting depth', () => {
      mountWith({
        children: [
          createElement('div', { key: 'a' }, button('item-0', 'A')),
          createElement('div', { key: 'b' }, createElement('div', null, button('item-1', 'B'))),
          button('item-2', 'C'),
        ],
      });

      const [item0, item1, item2] = getItems();
      expect(item0).toHaveAttribute('tabindex', '0');
      expect(item1).toHaveAttribute('tabindex', '-1');
      expect(item2).toHaveAttribute('tabindex', '-1');
    });

    it('should use role-aware selector for tablist', () => {
      mountWith({
        role: 'tablist',
        children: [
          button('item-0', 'Tab 1', { role: 'tab' }),
          button('item-1', 'Tab 2', { role: 'tab' }),
          button('non-tab', 'Not a tab'),
        ],
      });

      expect(find('item-0')).toHaveAttribute('tabindex', '0');
      expect(find('item-1')).toHaveAttribute('tabindex', '-1');
      // Non-tab button should not have tabindex set by the directive
      expect(find('non-tab')).not.toHaveAttribute('tabindex');
    });
  });

  // ── Arrow Key Navigation ────────────────────────────────

  describe('Arrow key navigation', () => {
    it('should move focus to next item on ArrowRight (default axis: both)', async () => {
      mountToolbar();
      const [item0, item1] = getItems();

      item0.focus();
      await press('ArrowRight');

      expect(document.activeElement).toBe(item1);
      expect(item1).toHaveAttribute('tabindex', '0');
      expect(item0).toHaveAttribute('tabindex', '-1');
    });

    it('should move focus to previous item on ArrowLeft', async () => {
      mountToolbar();
      const [item0, item1] = getItems();

      item1.focus();
      await press('ArrowLeft');

      expect(document.activeElement).toBe(item0);
    });

    it('should move focus on ArrowDown (default axis: both)', async () => {
      mountToolbar();
      const [item0, item1] = getItems();

      item0.focus();
      await press('ArrowDown');

      expect(document.activeElement).toBe(item1);
    });

    it('should move focus on ArrowUp', async () => {
      mountToolbar();
      const [item0, item1] = getItems();

      item1.focus();
      await press('ArrowUp');

      expect(document.activeElement).toBe(item0);
    });
  });

  // ── Axis Restriction ────────────────────────────────────

  describe('Axis restriction', () => {
    it('should ignore ArrowUp/Down when axis is inline', async () => {
      mountWithConfig('horizontal');

      const item0 = find('item-0');
      item0.focus();
      await press('ArrowDown');

      expect(document.activeElement).toBe(item0);
    });

    it('should ignore ArrowLeft/Right when axis is block', async () => {
      mountWithConfig('vertical');

      const item0 = find('item-0');
      item0.focus();
      await press('ArrowRight');

      expect(document.activeElement).toBe(item0);
    });

    it('should respond to ArrowDown when axis is block', async () => {
      mountWithConfig('vertical');

      find('item-0').focus();
      await press('ArrowDown');

      expect(document.activeElement).toBe(find('item-1'));
    });
  });

  // ── Wrapping ────────────────────────────────────────────

  describe('Wrapping', () => {
    it('should loop from last to first when loop is true (default)', async () => {
      mountToolbar();
      const [item0, , item2] = getItems();

      item2.focus();
      await press('ArrowRight');

      expect(document.activeElement).toBe(item0);
    });

    it('should loop from first to last going backwards', async () => {
      mountToolbar();
      const [item0, , item2] = getItems();

      item0.focus();
      await press('ArrowLeft');

      expect(document.activeElement).toBe(item2);
    });

    it('should NOT loop when noloop is set', async () => {
      mountWithConfig('noloop');

      const item2 = find('item-2');
      item2.focus();
      await press('ArrowRight');

      expect(document.activeElement).toBe(item2);
    });
  });

  // ── Home / End ──────────────────────────────────────────

  describe('Home / End keys', () => {
    it('should focus first item on Home', async () => {
      mountToolbar();
      const [item0, , item2] = getItems();

      item2.focus();
      await press('Home');

      expect(document.activeElement).toBe(item0);
    });

    it('should focus last item on End', async () => {
      mountToolbar();
      const [item0, , item2] = getItems();

      item0.focus();
      await press('End');

      expect(document.activeElement).toBe(item2);
    });
  });

  // ── Disabled Items ──────────────────────────────────────

  describe('Disabled items', () => {
    it('should skip aria-disabled items during navigation', async () => {
      mountWith({
        children: [button('item-0', 'A'), button('item-1', 'B', { 'aria-disabled': 'true' }), button('item-2', 'C')],
      });

      find('item-0').focus();
      await press('ArrowRight');

      expect(document.activeElement).toBe(find('item-2'));
    });

    it('should skip native disabled items during navigation', async () => {
      mountWith({
        children: [button('item-0', 'A'), button('item-1', 'B', { disabled: true }), button('item-2', 'C')],
      });

      find('item-0').focus();
      await press('ArrowRight');

      expect(document.activeElement).toBe(find('item-2'));
    });

    const tabs = () => [
      button('item-0', 'Tab 1', { role: 'tab' }),
      button('item-1', 'Tab 2', { role: 'tab', 'aria-disabled': 'true' }),
      button('item-2', 'Tab 3', { role: 'tab' }),
    ];

    it('should NOT skip disabled items for role="tablist" (noskipdisabled default)', async () => {
      mountWith({ role: 'tablist', children: tabs() });

      find('item-0').focus();
      await press('ArrowRight');

      expect(document.activeElement).toBe(find('item-1'));
    });

    it('should respect explicit skipdisabled override on tablist', async () => {
      mountWithConfig('horizontal skipdisabled', tabs(), 'tablist');

      find('item-0').focus();
      await press('ArrowRight');

      expect(document.activeElement).toBe(find('item-2'));
    });

    it('should skip disabled items on Home key', async () => {
      mountWith({
        children: [button('item-0', 'A', { 'aria-disabled': 'true' }), button('item-1', 'B'), button('item-2', 'C')],
      });

      find('item-2').focus();
      await press('Home');

      expect(document.activeElement).toBe(find('item-1'));
    });
  });

  // ── Opt-out ─────────────────────────────────────────────

  describe('Item opt-out', () => {
    it('should exclude items with data-dt-focusgroup-skip', async () => {
      mountWith({
        children: [
          button('item-0', 'A'),
          createElement('input', { key: 'skipped', 'data-qa': 'skipped', 'data-dt-focusgroup-skip': '' }),
          button('item-2', 'C'),
        ],
      });

      find('item-0').focus();
      await press('ArrowRight');

      expect(document.activeElement).toBe(find('item-2'));
    });
  });

  // ── Memory ──────────────────────────────────────────────

  describe('Memory', () => {
    it('should update tabindex when an item receives focus via click', async () => {
      mountToolbar();
      const [item0, , item2] = getItems();

      // Simulate click focus on third item — focusin event bubbles from item to container
      act(() => {
        item2.focus();
        item2.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      });

      expect(item2).toHaveAttribute('tabindex', '0');
      expect(item0).toHaveAttribute('tabindex', '-1');
    });
  });

  // ── dt-focusgroup-move Event ────────────────────────────

  describe('dt-focusgroup-move event', () => {
    it('should dispatch event with correct detail on arrow key navigation', async () => {
      mountToolbar();
      const [item0] = getItems();

      const moveHandler = vi.fn();
      container().addEventListener('dt-focusgroup-move', moveHandler);

      item0.focus();
      await press('ArrowRight');

      expect(moveHandler).toHaveBeenCalledTimes(1);
    });

    it('should include item, index, previousItem, previousIndex in event detail', async () => {
      mountToolbar();
      const [item0] = getItems();

      let detail: FocusgroupMoveDetail | undefined;
      container().addEventListener('dt-focusgroup-move', (e) => { detail = e.detail; });

      item0.focus();
      await press('ArrowRight');

      expect(detail).toEqual({
        item: find('item-1'),
        index: 1,
        previousItem: item0,
        previousIndex: 0,
      });
    });

    it('should dispatch event on Home/End navigation', async () => {
      mountToolbar();
      const [, , item2] = getItems();

      const moveHandler = vi.fn();
      container().addEventListener('dt-focusgroup-move', moveHandler);

      item2.focus();
      await press('Home');

      expect(moveHandler).toHaveBeenCalledTimes(1);
      expect(moveHandler.mock.calls[0][0].detail.index).toBe(0);
    });

    it('should NOT dispatch event when focus does not change', async () => {
      mountWithConfig('noloop', [button('item-0', 'A'), button('item-1', 'B')]);

      const moveHandler = vi.fn();
      container().addEventListener('dt-focusgroup-move', moveHandler);

      find('item-0').focus();
      await press('ArrowLeft');

      expect(moveHandler).not.toHaveBeenCalled();
    });
  });

  // ── nomemory / focusout ──────────────────────────────────

  describe('nomemory focusout reset', () => {
    it('should reset tabindex to first item when focus leaves container with nomemory', async () => {
      mountWithConfig('horizontal nomemory');

      const item2 = find('item-2');

      // Focus third item via arrow keys
      find('item-0').focus();
      await press('ArrowRight');
      await press('ArrowRight');

      expect(document.activeElement).toBe(item2);

      // Simulate focus leaving the container
      act(() => {
        container().dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      });

      // tabindex should reset to first item
      expect(find('item-0')).toHaveAttribute('tabindex', '0');
      expect(item2).toHaveAttribute('tabindex', '-1');
    });

    it('should NOT reset tabindex when focus leaves container with memory (default)', async () => {
      mountToolbar();
      const item2 = find('item-2');

      // Focus third item
      find('item-0').focus();
      await press('ArrowRight');
      await press('ArrowRight');

      // Simulate focus leaving
      act(() => {
        container().dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      });

      // tabindex should stay on last focused item
      expect(item2).toHaveAttribute('tabindex', '0');
    });
  });

  // ── RTL ─────────────────────────────────────────────────

  describe('RTL support', () => {
    it('should reverse ArrowRight/ArrowLeft in RTL context', async () => {
      mountWith({ config: 'horizontal', dir: 'rtl', children: abc() });

      find('item-0').focus();

      // In RTL, ArrowLeft should go forward (next), not backward
      await press('ArrowLeft');

      expect(document.activeElement).toBe(find('item-1'));
    });
  });

  // ── Dynamic config update ───────────────────────────────

  describe('Dynamic config update', () => {
    it('should apply new axis when config changes', async () => {
      const children = () => [button('item-0', 'A'), button('item-1', 'B')];
      mountWithConfig('horizontal', children());

      find('item-0').focus();

      // ArrowDown should be ignored with horizontal axis
      await press('ArrowDown');
      expect(document.activeElement).toBe(find('item-0'));

      // Change to vertical
      loopper!.rerender(ui({ config: 'vertical', children: children() }));

      // ArrowDown should now work
      find('item-0').focus();
      await press('ArrowDown');
      expect(document.activeElement).toBe(find('item-1'));
    });
  });

  // ── Lifecycle ───────────────────────────────────────────

  describe('Lifecycle', () => {
    it('should clean up listeners on unmount', async () => {
      mountToolbar();
      const el = container();
      const spy = vi.spyOn(el, 'removeEventListener');

      loopper!.unmount();

      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(spy).toHaveBeenCalledWith('focusin', expect.any(Function));
      expect(spy).toHaveBeenCalledWith('focusout', expect.any(Function));

      // Prevent double-unmount in afterEach
      loopper = null;
    });
  });
});

// React-only.
describe('useFocusGroup', () => {
  let wrapper: RenderResult | null = null;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    vi.restoreAllMocks();
  });

  const press = (key: string) => userEvent.setup().keyboard(`{${key}}`);

  it('leaves the items alone without the hook, like the template without the directive', () => {
    wrapper = render(ui({ config: false, children: abc() }));

    expect(wrapper.getByTestId('item-0')).not.toHaveAttribute('tabindex');
  });

  it('warns once about an unknown token, though StrictMode replays the effects', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    wrapper = render(ui({ config: 'horizontal bogus', children: abc() }));
    wrapper.rerender(ui({ config: 'horizontal bogus', children: abc() }));

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('Unknown token "bogus"');
  });

  it('warns once when no item matches, though StrictMode replays the effects', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    wrapper = render(ui({ role: 'tablist', children: button('item-0', 'Not a tab') }));

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('(inferred from role="tablist")');
  });

  it('does not attach again when it renders with an equal config', async () => {
    wrapper = render(ui({ config: { axis: 'horizontal' }, children: abc() }));
    wrapper.getByTestId('item-0').focus();
    await press('ArrowRight');

    wrapper.rerender(ui({ config: { axis: 'horizontal' }, children: abc() }));

    // Attaching again would have reset the roving tabindex to the first item.
    expect(wrapper.getByTestId('item-1')).toHaveAttribute('tabindex', '0');
  });

  it('handles each key once, though StrictMode replays the effects', async () => {
    wrapper = render(ui({ children: abc() }));
    wrapper.getByTestId('item-0').focus();

    await press('ArrowRight');

    expect(document.activeElement).toBe(wrapper.getByTestId('item-1'));
  });

  it('moves to an element passed in place of the first, as the directive does on a new element', async () => {
    function Swapper ({ second }: { second: boolean }) {
      const [el, setEl] = useState<HTMLElement | null>(null);
      useFocusGroup(el, 'horizontal');
      const props = { ref: setEl, role: 'toolbar', 'data-qa': second ? 'second' : 'first' };
      return createElement(second ? 'section' : 'div', { ...props, key: second ? 'b' : 'a' }, abc());
    }
    wrapper = render(createElement(Swapper, { second: false }));
    wrapper.rerender(createElement(Swapper, { second: true }));

    wrapper.getByTestId('item-0').focus();
    await press('ArrowRight');

    expect(document.activeElement).toBe(wrapper.getByTestId('item-1'));
  });

  it('keeps the config set last when two hooks share an element, until one lets go', async () => {
    function Shared ({ second }: { second: FocusgroupValue | null }) {
      const [el, setEl] = useState<HTMLElement | null>(null);
      useFocusGroup(el, 'horizontal');
      useFocusGroup(second === null ? null : el, second ?? undefined);
      return createElement('div', { ref: setEl, role: 'toolbar' }, abc());
    }
    wrapper = render(createElement(Shared, { second: 'vertical' }));
    wrapper.getByTestId('item-0').focus();

    await press('ArrowRight');
    expect(document.activeElement).toBe(wrapper.getByTestId('item-0'));
    await press('ArrowDown');
    expect(document.activeElement).toBe(wrapper.getByTestId('item-1'));

    wrapper.rerender(createElement(Shared, { second: null }));
    await press('ArrowRight');
    expect(document.activeElement).toBe(wrapper.getByTestId('item-2'));
  });
});
