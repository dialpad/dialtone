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

function getItems (wrapper) {
  return [
    wrapper.find('[data-qa="item-0"]'),
    wrapper.find('[data-qa="item-1"]'),
    wrapper.find('[data-qa="item-2"]'),
  ];
}

// ── Tests ───────────────────────────────────────────────────

describe('DtFocusgroupDirective', () => {
  let wrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  // ── Config Parsing ──────────────────────────────────────

  describe('parseConfig', () => {
    it('should return defaults for undefined', () => {
      expect(parseConfig(undefined)).toEqual(FOCUSGROUP_DEFAULTS);
    });

    it('should return defaults for true', () => {
      expect(parseConfig(true)).toEqual(FOCUSGROUP_DEFAULTS);
    });

    it('should parse "inline wrap" tokens', () => {
      const config = parseConfig('inline wrap');
      expect(config.axis).toBe('inline');
      expect(config.wrap).toBe(true);
    });

    it('should parse "block nowrap nomemory" tokens', () => {
      const config = parseConfig('block nowrap nomemory');
      expect(config.axis).toBe('block');
      expect(config.wrap).toBe(false);
      expect(config.memory).toBe(false);
    });

    it('should parse "inline wrap nomemory noskipdisabled" tokens', () => {
      const config = parseConfig('inline wrap nomemory noskipdisabled');
      expect(config.axis).toBe('inline');
      expect(config.wrap).toBe(true);
      expect(config.memory).toBe(false);
      expect(config.skipDisabled).toBe(false);
    });

    it('should parse object config', () => {
      const config = parseConfig({ axis: 'inline', wrap: false, selector: '[role="tab"]' });
      expect(config.axis).toBe('inline');
      expect(config.wrap).toBe(false);
      expect(config.selector).toBe('[role="tab"]');
      expect(config.memory).toBe(true); // default preserved
    });
  });

  // ── Config Equality ─────────────────────────────────────

  describe('configsEqual', () => {
    it('should return true for identical configs', () => {
      const a = parseConfig('inline wrap');
      const b = parseConfig('inline wrap');
      expect(configsEqual(a, b)).toBe(true);
    });

    it('should return false when axis differs', () => {
      const a = parseConfig('inline');
      const b = parseConfig('block');
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
    ])('should default to %s for role="%s"', (role, expected) => {
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
      wrapper = mountToolbar();
      const [item0, item1, item2] = getItems(wrapper);

      expect(item0.attributes('tabindex')).toBe('0');
      expect(item1.attributes('tabindex')).toBe('-1');
      expect(item2.attributes('tabindex')).toBe('-1');
    });

    it('should find items at any nesting depth', () => {
      wrapper = mount({
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

      const [item0, item1, item2] = getItems(wrapper);
      expect(item0.attributes('tabindex')).toBe('0');
      expect(item1.attributes('tabindex')).toBe('-1');
      expect(item2.attributes('tabindex')).toBe('-1');
    });

    it('should use role-aware selector for tablist', () => {
      wrapper = mount({
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

      expect(wrapper.find('[data-qa="item-0"]').attributes('tabindex')).toBe('0');
      expect(wrapper.find('[data-qa="item-1"]').attributes('tabindex')).toBe('-1');
      // Non-tab button should not have tabindex set by the directive
      expect(wrapper.find('[data-qa="non-tab"]').attributes('tabindex')).toBeUndefined();
    });
  });

  // ── Arrow Key Navigation ────────────────────────────────

  describe('Arrow key navigation', () => {
    it('should move focus to next item on ArrowRight (default axis: both)', async () => {
      wrapper = mountToolbar();
      const [item0, item1] = getItems(wrapper);

      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(item1.element);
      expect(item1.attributes('tabindex')).toBe('0');
      expect(item0.attributes('tabindex')).toBe('-1');
    });

    it('should move focus to previous item on ArrowLeft', async () => {
      wrapper = mountToolbar();
      const [item0, item1] = getItems(wrapper);

      item1.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should move focus on ArrowDown (default axis: both)', async () => {
      wrapper = mountToolbar();
      const [item0, item1] = getItems(wrapper);

      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowDown' });

      expect(document.activeElement).toBe(item1.element);
    });

    it('should move focus on ArrowUp', async () => {
      wrapper = mountToolbar();
      const [item0, item1] = getItems(wrapper);

      item1.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowUp' });

      expect(document.activeElement).toBe(item0.element);
    });
  });

  // ── Axis Restriction ────────────────────────────────────

  describe('Axis restriction', () => {
    it('should ignore ArrowUp/Down when axis is inline', async () => {
      wrapper = mountWithConfig('inline', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
          <button data-qa="item-2">C</button>
        </div>
      `);

      const item0 = wrapper.find('[data-qa="item-0"]');
      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowDown' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should ignore ArrowLeft/Right when axis is block', async () => {
      wrapper = mountWithConfig('block', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
          <button data-qa="item-2">C</button>
        </div>
      `);

      const item0 = wrapper.find('[data-qa="item-0"]');
      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should respond to ArrowDown when axis is block', async () => {
      wrapper = mountWithConfig('block', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
          <button data-qa="item-2">C</button>
        </div>
      `);

      const item0 = wrapper.find('[data-qa="item-0"]');
      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowDown' });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="item-1"]').element);
    });
  });

  // ── Wrapping ────────────────────────────────────────────

  describe('Wrapping', () => {
    it('should wrap from last to first when wrap is true (default)', async () => {
      wrapper = mountToolbar();
      const [item0, , item2] = getItems(wrapper);

      item2.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should wrap from first to last going backwards', async () => {
      wrapper = mountToolbar();
      const [item0, , item2] = getItems(wrapper);

      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(item2.element);
    });

    it('should NOT wrap when nowrap is set', async () => {
      wrapper = mountWithConfig('nowrap', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
          <button data-qa="item-2">C</button>
        </div>
      `);

      const item2 = wrapper.find('[data-qa="item-2"]');
      item2.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(item2.element);
    });
  });

  // ── Home / End ──────────────────────────────────────────

  describe('Home / End keys', () => {
    it('should focus first item on Home', async () => {
      wrapper = mountToolbar();
      const [item0, , item2] = getItems(wrapper);

      item2.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'Home' });

      expect(document.activeElement).toBe(item0.element);
    });

    it('should focus last item on End', async () => {
      wrapper = mountToolbar();
      const [item0, , item2] = getItems(wrapper);

      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'End' });

      expect(document.activeElement).toBe(item2.element);
    });
  });

  // ── Disabled Items ──────────────────────────────────────

  describe('Disabled items', () => {
    it('should skip aria-disabled items during navigation', async () => {
      wrapper = mount({
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

      const item0 = wrapper.find('[data-qa="item-0"]');
      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="item-2"]').element);
    });

    it('should skip native disabled items during navigation', async () => {
      wrapper = mount({
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

      const item0 = wrapper.find('[data-qa="item-0"]');
      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="item-2"]').element);
    });

    it('should NOT skip disabled items for role="tablist" (noskipdisabled default)', async () => {
      wrapper = mount({
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

      const item0 = wrapper.find('[data-qa="item-0"]');
      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="item-1"]').element);
    });

    it('should respect explicit skipdisabled override on tablist', async () => {
      wrapper = mountWithConfig('inline wrap skipdisabled', `
        <div role="tablist" v-dt-focusgroup="config" data-qa="container">
          <button role="tab" data-qa="item-0">Tab 1</button>
          <button role="tab" data-qa="item-1" aria-disabled="true">Tab 2</button>
          <button role="tab" data-qa="item-2">Tab 3</button>
        </div>
      `);

      const item0 = wrapper.find('[data-qa="item-0"]');
      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="item-2"]').element);
    });

    it('should skip disabled items on Home key', async () => {
      wrapper = mount({
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

      const item2 = wrapper.find('[data-qa="item-2"]');
      item2.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'Home' });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="item-1"]').element);
    });
  });

  // ── Opt-out ─────────────────────────────────────────────

  describe('Item opt-out', () => {
    it('should exclude items with data-dt-focusgroup-skip', async () => {
      wrapper = mount({
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

      const item0 = wrapper.find('[data-qa="item-0"]');
      item0.element.focus();
      await wrapper.find('[data-qa="container"]').trigger('keydown', { key: 'ArrowRight' });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="item-2"]').element);
    });
  });

  // ── Memory ──────────────────────────────────────────────

  describe('Memory', () => {
    it('should update tabindex when an item receives focus via click', async () => {
      wrapper = mountToolbar();
      const [item0, , item2] = getItems(wrapper);

      // Simulate click focus on third item — focusin event bubbles from item to container
      item2.element.focus();
      item2.element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await wrapper.vm.$nextTick();

      expect(item2.attributes('tabindex')).toBe('0');
      expect(item0.attributes('tabindex')).toBe('-1');
    });
  });

  // ── dt-focusgroup-move Event ────────────────────────────

  describe('dt-focusgroup-move event', () => {
    it('should dispatch event with correct detail on arrow key navigation', async () => {
      wrapper = mountToolbar();
      const container = wrapper.find('[data-qa="container"]');
      const [item0] = getItems(wrapper);

      const moveHandler = vi.fn();
      container.element.addEventListener('dt-focusgroup-move', moveHandler);

      item0.element.focus();
      await container.trigger('keydown', { key: 'ArrowRight' });

      expect(moveHandler).toHaveBeenCalledTimes(1);
    });

    it('should include item, index, previousItem, previousIndex in event detail', async () => {
      wrapper = mountToolbar();
      const container = wrapper.find('[data-qa="container"]');
      const [item0] = getItems(wrapper);

      let detail;
      container.element.addEventListener('dt-focusgroup-move', (e) => { detail = e.detail; });

      item0.element.focus();
      await container.trigger('keydown', { key: 'ArrowRight' });

      expect(detail).toEqual({
        item: wrapper.find('[data-qa="item-1"]').element,
        index: 1,
        previousItem: item0.element,
        previousIndex: 0,
      });
    });

    it('should dispatch event on Home/End navigation', async () => {
      wrapper = mountToolbar();
      const container = wrapper.find('[data-qa="container"]');
      const [, , item2] = getItems(wrapper);

      const moveHandler = vi.fn();
      container.element.addEventListener('dt-focusgroup-move', moveHandler);

      item2.element.focus();
      await container.trigger('keydown', { key: 'Home' });

      expect(moveHandler).toHaveBeenCalledTimes(1);
      expect(moveHandler.mock.calls[0][0].detail.index).toBe(0);
    });

    it('should NOT dispatch event when focus does not change', async () => {
      wrapper = mountWithConfig('nowrap', `
        <div role="toolbar" v-dt-focusgroup="config" data-qa="container">
          <button data-qa="item-0">A</button>
          <button data-qa="item-1">B</button>
        </div>
      `);

      const container = wrapper.find('[data-qa="container"]');
      const moveHandler = vi.fn();
      container.element.addEventListener('dt-focusgroup-move', moveHandler);

      wrapper.find('[data-qa="item-0"]').element.focus();
      await container.trigger('keydown', { key: 'ArrowLeft' });

      expect(moveHandler).not.toHaveBeenCalled();
    });
  });

  // ── Lifecycle ───────────────────────────────────────────

  describe('Lifecycle', () => {
    it('should clean up listeners on unmount', async () => {
      wrapper = mountToolbar();
      const container = wrapper.find('[data-qa="container"]').element;
      const spy = vi.spyOn(container, 'removeEventListener');

      wrapper.unmount();

      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(spy).toHaveBeenCalledWith('focusin', expect.any(Function));

      // Prevent double-unmount in afterEach
      wrapper = null;
    });
  });
});
