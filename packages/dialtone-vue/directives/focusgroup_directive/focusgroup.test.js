import { mount } from '@vue/test-utils';
import { DtFocusgroupDirective } from './focusgroup.js';
import {
  parseConfig,
  configsEqual,
  resolveSelector,
  resolveSkipDisabled,
  FOCUSGROUP_DEFAULTS,
} from './focusgroup_constants.js';

// ── Helpers ─────────────────────────────────────────────────

const PLUGINS = [DtFocusgroupDirective];

function mountToolbar (directive = true, options = {}) {
  return mount({
    template: `
      <div
        role="toolbar"
        ${directive ? 'v-dt-focusgroup' : ''}
        data-qa="container"
        aria-label="Test toolbar"
      >
        <button data-qa="item-0">Bold</button>
        <button data-qa="item-1">Italic</button>
        <button data-qa="item-2">Underline</button>
      </div>
    `,
    ...options,
  }, {
    global: { plugins: PLUGINS },
    attachTo: document.body,
  });
}

function mountWithConfig (config, template) {
  return mount({
    data () { return { config }; },
    template,
  }, {
    global: { plugins: PLUGINS },
    attachTo: document.body,
  });
}

function getItems (loopper) {
  return [
    loopper.find('[data-qa="item-0"]'),
    loopper.find('[data-qa="item-1"]'),
    loopper.find('[data-qa="item-2"]'),
  ];
}

// ── Tests ───────────────────────────────────────────────────

describe('DtFocusgroupDirective', () => {
  let loopper;

  afterEach(() => {
    loopper?.unmount();
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
      loopper = mountToolbar();
      const [item0, item1, item2] = getItems(loopper);

      expect(item0.attributes('tabindex')).toBe('0');
      expect(item1.attributes('tabindex')).toBe('-1');
      expect(item2.attributes('tabindex')).toBe('-1');
    });

    it('should find items at any nesting depth', () => {
      loopper = mount({
        template: `
          <div role="toolbar" v-dt-focusgroup data-qa="container">
            <div><button data-qa="item-0">A</button></div>
            <div><div><button data-qa="item-1">B</button></div></div>
            <button data-qa="item-2">C</button>
          </div>
        `,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });

      const [item0, item1, item2] = getItems(loopper);
      expect(item0.attributes('tabindex')).toBe('0');
      expect(item1.attributes('tabindex')).toBe('-1');
      expect(item2.attributes('tabindex')).toBe('-1');
    });

    it('should use role-aware selector for tablist', () => {
      loopper = mount({
        template: `
          <div role="tablist" v-dt-focusgroup data-qa="container">
            <button role="tab" data-qa="item-0">Tab 1</button>
            <button role="tab" data-qa="item-1">Tab 2</button>
            <button data-qa="non-tab">Not a tab</button>
          </div>
        `,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });

      expect(loopper.find('[data-qa="item-0"]').attributes('tabindex')).toBe('0');
      expect(loopper.find('[data-qa="item-1"]').attributes('tabindex')).toBe('-1');
      // Non-tab button should not have tabindex set by the directive
      expect(loopper.find('[data-qa="non-tab"]').attributes('tabindex')).toBeUndefined();
    });
  });

  // ── Arrow Key Navigation ────────────────────────────────

  describe('Arrow key navigation', () => {
    it('should move focus to next item on ArrowRight (default axis: both)', async () => {
      loopper = mountToolbar();
      const [item0, item1] = getItems(loopper);

      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(item1.element);
      expect(item1.attributes('tabindex')).toBe('0');
      expect(item0.attributes('tabindex')).toBe('-1');
    });

    it('should move focus to previous item on ArrowLeft', async () => {
      loopper = mountToolbar();
      const [item0, item1] = getItems(loopper);

      item1.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should move focus on ArrowDown (default axis: both)', async () => {
      loopper = mountToolbar();
      const [item0, item1] = getItems(loopper);

      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowDown' });

      expect(document.activeElement).toBe(item1.element);
    });

    it('should move focus on ArrowUp', async () => {
      loopper = mountToolbar();
      const [item0, item1] = getItems(loopper);

      item1.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowUp' });

      expect(document.activeElement).toBe(item0.element);
    });
  });

  // ── Axis Restriction ────────────────────────────────────

  describe('Axis restriction', () => {
    it('should ignore ArrowUp/Down when axis is inline', async () => {
      loopper = mountWithConfig('horizontal', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
          <button data-qa="item-2">C</button>
        </div>
      `);

      const item0 = loopper.find('[data-qa="item-0"]');
      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowDown' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should ignore ArrowLeft/Right when axis is block', async () => {
      loopper = mountWithConfig('vertical', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
          <button data-qa="item-2">C</button>
        </div>
      `);

      const item0 = loopper.find('[data-qa="item-0"]');
      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should respond to ArrowDown when axis is block', async () => {
      loopper = mountWithConfig('vertical', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
          <button data-qa="item-2">C</button>
        </div>
      `);

      const item0 = loopper.find('[data-qa="item-0"]');
      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowDown' });

      expect(document.activeElement).toBe(loopper.find('[data-qa="item-1"]').element);
    });
  });

  // ── Wrapping ────────────────────────────────────────────

  describe('Wrapping', () => {
    it('should loop from last to first when loop is true (default)', async () => {
      loopper = mountToolbar();
      const [item0, , item2] = getItems(loopper);

      item2.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should loop from first to last going backwards', async () => {
      loopper = mountToolbar();
      const [item0, , item2] = getItems(loopper);

      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(item2.element);
    });

    it('should NOT loop when noloop is set', async () => {
      loopper = mountWithConfig('noloop', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
          <button data-qa="item-2">C</button>
        </div>
      `);

      const item2 = loopper.find('[data-qa="item-2"]');
      item2.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(item2.element);
    });
  });

  // ── Home / End ──────────────────────────────────────────

  describe('Home / End keys', () => {
    it('should focus first item on Home', async () => {
      loopper = mountToolbar();
      const [item0, , item2] = getItems(loopper);

      item2.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'Home' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should focus last item on End', async () => {
      loopper = mountToolbar();
      const [item0, , item2] = getItems(loopper);

      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'End' });

      expect(document.activeElement).toBe(item2.element);
    });
  });

  // ── Disabled Items ──────────────────────────────────────

  describe('Disabled items', () => {
    it('should skip aria-disabled items during navigation', async () => {
      loopper = mount({
        template: `
          <div role="toolbar" v-dt-focusgroup data-qa="container">
            <button data-qa="item-0">A</button>
            <button data-qa="item-1" aria-disabled="true">B</button>
            <button data-qa="item-2">C</button>
          </div>
        `,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });

      const item0 = loopper.find('[data-qa="item-0"]');
      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(loopper.find('[data-qa="item-2"]').element);
    });

    it('should skip native disabled items during navigation', async () => {
      loopper = mount({
        template: `
          <div role="toolbar" v-dt-focusgroup data-qa="container">
            <button data-qa="item-0">A</button>
            <button data-qa="item-1" disabled>B</button>
            <button data-qa="item-2">C</button>
          </div>
        `,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });

      const item0 = loopper.find('[data-qa="item-0"]');
      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(loopper.find('[data-qa="item-2"]').element);
    });

    it('should NOT skip disabled items for role="tablist" (noskipdisabled default)', async () => {
      loopper = mount({
        template: `
          <div role="tablist" v-dt-focusgroup data-qa="container">
            <button role="tab" data-qa="item-0">Tab 1</button>
            <button role="tab" data-qa="item-1" aria-disabled="true">Tab 2</button>
            <button role="tab" data-qa="item-2">Tab 3</button>
          </div>
        `,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });

      const item0 = loopper.find('[data-qa="item-0"]');
      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(loopper.find('[data-qa="item-1"]').element);
    });

    it('should respect explicit skipdisabled override on tablist', async () => {
      loopper = mountWithConfig('horizontal skipdisabled', `
        <div role="tablist" v-dt-focusgroup="config" data-qa="container">
          <button role="tab" data-qa="item-0">Tab 1</button>
          <button role="tab" data-qa="item-1" aria-disabled="true">Tab 2</button>
          <button role="tab" data-qa="item-2">Tab 3</button>
        </div>
      `);

      const item0 = loopper.find('[data-qa="item-0"]');
      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(loopper.find('[data-qa="item-2"]').element);
    });

    it('should skip disabled items on Home key', async () => {
      loopper = mount({
        template: `
          <div role="toolbar" v-dt-focusgroup data-qa="container">
            <button data-qa="item-0" aria-disabled="true">A</button>
            <button data-qa="item-1">B</button>
            <button data-qa="item-2">C</button>
          </div>
        `,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });

      const item2 = loopper.find('[data-qa="item-2"]');
      item2.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'Home' });

      expect(document.activeElement).toBe(loopper.find('[data-qa="item-1"]').element);
    });
  });

  // ── Opt-out ─────────────────────────────────────────────

  describe('Item opt-out', () => {
    it('should exclude items with data-dt-focusgroup-skip', async () => {
      loopper = mount({
        template: `
          <div role="toolbar" v-dt-focusgroup data-qa="container">
            <button data-qa="item-0">A</button>
            <input data-qa="skipped" data-dt-focusgroup-skip />
            <button data-qa="item-2">C</button>
          </div>
        `,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });

      const item0 = loopper.find('[data-qa="item-0"]');
      item0.element.focus();
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(loopper.find('[data-qa="item-2"]').element);
    });
  });

  // ── Memory ──────────────────────────────────────────────

  describe('Memory', () => {
    it('should update tabindex when an item receives focus via click', async () => {
      loopper = mountToolbar();
      const [item0, , item2] = getItems(loopper);

      // Simulate click focus on third item — focusin event bubbles from item to container
      item2.element.focus();
      item2.element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await loopper.vm.$nextTick();

      expect(item2.attributes('tabindex')).toBe('0');
      expect(item0.attributes('tabindex')).toBe('-1');
    });
  });

  // ── dt-focusgroup-move Event ────────────────────────────

  describe('dt-focusgroup-move event', () => {
    it('should dispatch event with correct detail on arrow key navigation', async () => {
      loopper = mountToolbar();
      const container = loopper.find('[data-qa="container"]');
      const [item0] = getItems(loopper);

      const moveHandler = vi.fn();
      container.element.addEventListener('dt-focusgroup-move', moveHandler);

      item0.element.focus();
      await container.trigger('keydown', { key: 'ArrowRight' });

      expect(moveHandler).toHaveBeenCalledTimes(1);
    });

    it('should include item, index, previousItem, previousIndex in event detail', async () => {
      loopper = mountToolbar();
      const container = loopper.find('[data-qa="container"]');
      const [item0] = getItems(loopper);

      let detail;
      container.element.addEventListener('dt-focusgroup-move', (e) => { detail = e.detail; });

      item0.element.focus();
      await container.trigger('keydown', { key: 'ArrowRight' });

      expect(detail).toEqual({
        item: loopper.find('[data-qa="item-1"]').element,
        index: 1,
        previousItem: item0.element,
        previousIndex: 0,
      });
    });

    it('should dispatch event on Home/End navigation', async () => {
      loopper = mountToolbar();
      const container = loopper.find('[data-qa="container"]');
      const [, , item2] = getItems(loopper);

      const moveHandler = vi.fn();
      container.element.addEventListener('dt-focusgroup-move', moveHandler);

      item2.element.focus();
      await container.trigger('keydown', { key: 'Home' });

      expect(moveHandler).toHaveBeenCalledTimes(1);
      expect(moveHandler.mock.calls[0][0].detail.index).toBe(0);
    });

    it('should NOT dispatch event when focus does not change', async () => {
      loopper = mountWithConfig('noloop', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
        </div>
      `);

      const container = loopper.find('[data-qa="container"]');
      const moveHandler = vi.fn();
      container.element.addEventListener('dt-focusgroup-move', moveHandler);

      loopper.find('[data-qa="item-0"]').element.focus();
      await container.trigger('keydown', { key: 'ArrowLeft' });

      expect(moveHandler).not.toHaveBeenCalled();
    });
  });

  // ── nomemory / focusout ──────────────────────────────────

  describe('nomemory focusout reset', () => {
    it('should reset tabindex to first item when focus leaves container with nomemory', async () => {
      loopper = mountWithConfig('horizontal nomemory', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
          <button data-qa="item-2">C</button>
        </div>
      `);

      const container = loopper.find('[data-qa="container"]');
      const item2 = loopper.find('[data-qa="item-2"]');

      // Focus third item via arrow keys
      loopper.find('[data-qa="item-0"]').element.focus();
      await container.trigger('keydown', { key: 'ArrowRight' });
      await container.trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(item2.element);

      // Simulate focus leaving the container
      container.element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      await loopper.vm.$nextTick();

      // tabindex should reset to first item
      expect(loopper.find('[data-qa="item-0"]').attributes('tabindex')).toBe('0');
      expect(item2.attributes('tabindex')).toBe('-1');
    });

    it('should NOT reset tabindex when focus leaves container with memory (default)', async () => {
      loopper = mountToolbar();
      const container = loopper.find('[data-qa="container"]');
      const item2 = loopper.find('[data-qa="item-2"]');

      // Focus third item
      loopper.find('[data-qa="item-0"]').element.focus();
      await container.trigger('keydown', { key: 'ArrowRight' });
      await container.trigger('keydown', { key: 'ArrowRight' });

      // Simulate focus leaving
      container.element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      await loopper.vm.$nextTick();

      // tabindex should stay on last focused item
      expect(item2.attributes('tabindex')).toBe('0');
    });
  });

  // ── RTL ─────────────────────────────────────────────────

  describe('RTL support', () => {
    it('should reverse ArrowRight/ArrowLeft in RTL context', async () => {
      loopper = mount({
        template: `
          <div
            role="toolbar"
            dir="rtl"
            v-dt-focusgroup="'horizontal'"
            data-qa="container"
          >
            <button data-qa="item-0">A</button>
            <button data-qa="item-1">B</button>
            <button data-qa="item-2">C</button>
          </div>
        `,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });

      const item0 = loopper.find('[data-qa="item-0"]');
      item0.element.focus();

      // In RTL, ArrowLeft should go forward (next), not backward
      await loopper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(loopper.find('[data-qa="item-1"]').element);
    });
  });

  // ── Dynamic config update ───────────────────────────────

  describe('Dynamic config update', () => {
    it('should apply new axis when config changes', async () => {
      loopper = mount({
        data () { return { config: 'horizontal' }; },
        template: `
          <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
            <button data-qa="item-0">A</button>
            <button data-qa="item-1">B</button>
          </div>
        `,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });

      const container = loopper.find('[data-qa="container"]');
      loopper.find('[data-qa="item-0"]').element.focus();

      // ArrowDown should be ignored with horizontal axis
      await container.trigger('keydown', { key: 'ArrowDown' });
      expect(document.activeElement).toBe(loopper.find('[data-qa="item-0"]').element);

      // Change to vertical
      await loopper.setData({ config: 'vertical' });

      // ArrowDown should now work
      loopper.find('[data-qa="item-0"]').element.focus();
      await container.trigger('keydown', { key: 'ArrowDown' });
      expect(document.activeElement).toBe(loopper.find('[data-qa="item-1"]').element);
    });
  });

  // ── Lifecycle ───────────────────────────────────────────

  describe('Lifecycle', () => {
    it('should clean up listeners on unmount', async () => {
      loopper = mountToolbar();
      const container = loopper.find('[data-qa="container"]').element;
      const spy = vi.spyOn(container, 'removeEventListener');

      loopper.unmount();

      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(spy).toHaveBeenCalledWith('focusin', expect.any(Function));
      expect(spy).toHaveBeenCalledWith('focusout', expect.any(Function));

      // Prevent double-unmount in afterEach
      loopper = null;
    });
  });
});
