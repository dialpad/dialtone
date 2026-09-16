import { mount } from '@vue/test-utils';
import { DtFocustrapDirective } from './focustrap.js';
import { FOCUSTRAP_DEFAULTS, FOCUSTRAP_STATE_KEY } from './focustrap_constants.js';
import { flushPromises } from '@/common/utils';

// ── Helpers ─────────────────────────────────────────────────

const PLUGINS = [DtFocustrapDirective];

function mountDialog (config = true, options = {}) {
  return mount({
    data () { return { config }; },
    template: `
      <div role="dialog" v-dt-focustrap="config" data-qa="trap" aria-label="Test dialog">
        <button data-qa="first">First</button>
        <input data-qa="second" />
        <a href="#" data-qa="third">Third</a>
      </div>
    `,
    ...options,
  }, {
    global: { plugins: PLUGINS },
    attachTo: document.body,
  });
}

function mountWithTemplate (config, template) {
  return mount({
    data () { return { config }; },
    template,
  }, {
    global: { plugins: PLUGINS },
    attachTo: document.body,
  });
}

// ── Tests ───────────────────────────────────────────────────

describe('DtFocustrapDirective', () => {
  let wrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  // ── Default rendering ──────────────────────────────────

  describe('Default rendering', () => {
    it('should mount without errors', async () => {
      wrapper = mountDialog();
      await flushPromises();

      expect(wrapper.find('[data-qa="trap"]').exists()).toBe(true);
    });

    it('should store state on the container element', async () => {
      wrapper = mountDialog();
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el[FOCUSTRAP_STATE_KEY]).toBeDefined();
    });

    it('should activate the trap on mount', async () => {
      wrapper = mountDialog();
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el[FOCUSTRAP_STATE_KEY].active).toBe(true);
    });

    it('should register a keydown listener on the container', async () => {
      wrapper = mountDialog();
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el[FOCUSTRAP_STATE_KEY].onKeydown).toBeTypeOf('function');
    });
  });

  // ── Tab wrapping ───────────────────────────────────────

  describe('Tab wrapping', () => {
    it('should wrap focus from last element to first on Tab', async () => {
      wrapper = mountDialog();
      await flushPromises();

      wrapper.find('[data-qa="third"]').element.focus();
      await wrapper.find('[data-qa="trap"]').trigger('keydown', { key: 'Tab' });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="first"]').element);
    });

    it('should wrap focus from first element to last on Shift+Tab', async () => {
      wrapper = mountDialog();
      await flushPromises();

      wrapper.find('[data-qa="first"]').element.focus();
      await wrapper.find('[data-qa="trap"]').trigger('keydown', { key: 'Tab', shiftKey: true });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="third"]').element);
    });

    it('should not interfere with Tab between middle elements', async () => {
      wrapper = mountDialog();
      await flushPromises();

      wrapper.find('[data-qa="second"]').element.focus();
      await wrapper.find('[data-qa="trap"]').trigger('keydown', { key: 'Tab' });

      expect(document.activeElement).toBe(wrapper.find('[data-qa="second"]').element);
    });
  });

  // ── Initial focus: auto ────────────────────────────────

  describe('Initial focus: auto', () => {
    it('should focus the first focusable element on activation', async () => {
      wrapper = mountDialog();
      await flushPromises();

      expect(document.activeElement).toBe(wrapper.find('[data-qa="first"]').element);
    });
  });

  // ── Initial focus: CSS selector ────────────────────────

  describe('Initial focus: CSS selector', () => {
    it('should focus the element matching the selector', async () => {
      wrapper = mountDialog({ active: true, initialFocus: '[data-qa="second"]' });
      await flushPromises();

      expect(document.activeElement).toBe(wrapper.find('[data-qa="second"]').element);
    });

    it('should fall back to container if selector matches nothing', async () => {
      wrapper = mountDialog({ active: true, initialFocus: '[data-qa="nonexistent"]' });
      await flushPromises();

      expect(document.activeElement).toBe(wrapper.find('[data-qa="trap"]').element);
    });
  });

  // ── Initial focus: false ───────────────────────────────

  describe('Initial focus: false', () => {
    it('should not move focus when initialFocus is false', async () => {
      const outsideBtn = document.createElement('button');
      outsideBtn.setAttribute('data-qa', 'outside');
      document.body.appendChild(outsideBtn);
      outsideBtn.focus();

      wrapper = mountDialog({ active: true, initialFocus: false });
      await flushPromises();

      expect(document.activeElement).toBe(outsideBtn);

      outsideBtn.remove();
    });
  });

  // ── Initial focus: radio button ────────────────────────

  describe('Initial focus: radio button', () => {
    it('should prefer checked radio over first unchecked radio', async () => {
      wrapper = mountWithTemplate({ active: true }, `
        <div role="dialog" v-dt-focustrap="config" data-qa="trap" aria-label="Radio dialog">
          <input type="radio" name="choice" value="a" data-qa="radio-a" />
          <input type="radio" name="choice" value="b" data-qa="radio-b" checked />
          <input type="radio" name="choice" value="c" data-qa="radio-c" />
        </div>
      `);
      await flushPromises();

      expect(document.activeElement).toBe(wrapper.find('[data-qa="radio-b"]').element);
    });

    it('should focus first radio when none is checked', async () => {
      wrapper = mountWithTemplate({ active: true }, `
        <div role="dialog" v-dt-focustrap="config" data-qa="trap" aria-label="Radio dialog">
          <input type="radio" name="choice" value="a" data-qa="radio-a" />
          <input type="radio" name="choice" value="b" data-qa="radio-b" />
        </div>
      `);
      await flushPromises();

      expect(document.activeElement).toBe(wrapper.find('[data-qa="radio-a"]').element);
    });
  });

  // ── Focus restoration ──────────────────────────────────

  describe('Focus restoration', () => {
    let outsideBtn;

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
      wrapper = mountWithTemplate(true, `
        <div>
          <div role="dialog" v-dt-focustrap="config" data-qa="trap" aria-label="Test dialog">
            <button data-qa="first">First</button>
          </div>
        </div>
      `);
      await flushPromises();

      await wrapper.setData({ config: false });
      await flushPromises();

      expect(document.activeElement).toBe(outsideBtn);
    });

    it('should not restore focus when restoreFocus is false', async () => {
      wrapper = mountWithTemplate({ active: true, restoreFocus: false }, `
        <div>
          <div role="dialog" v-dt-focustrap="config" data-qa="trap" aria-label="Test dialog">
            <button data-qa="first">First</button>
          </div>
        </div>
      `);
      await flushPromises();

      await wrapper.setData({ config: { active: false, restoreFocus: false } });
      await flushPromises();

      expect(document.activeElement).not.toBe(outsideBtn);
    });
  });

  // ── Reactive activation ────────────────────────────────

  describe('Reactive activation', () => {
    it('should set active state when binding changes from false to true', async () => {
      wrapper = mountDialog(false);
      await flushPromises();

      await wrapper.setData({ config: true });
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el[FOCUSTRAP_STATE_KEY].active).toBe(true);
    });

    it('should focus first element when binding changes from false to true', async () => {
      wrapper = mountDialog(false);
      await flushPromises();

      await wrapper.setData({ config: true });
      await flushPromises();

      expect(document.activeElement).toBe(wrapper.find('[data-qa="first"]').element);
    });

    it('should activate with object binding change', async () => {
      wrapper = mountDialog({ active: false });
      await flushPromises();

      await wrapper.setData({ config: { active: true } });
      await flushPromises();

      expect(document.activeElement).toBe(wrapper.find('[data-qa="first"]').element);
    });
  });

  // ── Reactive deactivation ──────────────────────────────

  describe('Reactive deactivation', () => {
    it('should set active state to false when binding changes from true to false', async () => {
      wrapper = mountDialog(true);
      await flushPromises();

      await wrapper.setData({ config: false });
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el[FOCUSTRAP_STATE_KEY].active).toBe(false);
    });

    it('should restore focus when binding changes from true to false', async () => {
      const outsideBtn = document.createElement('button');
      outsideBtn.setAttribute('data-qa', 'outside');
      document.body.appendChild(outsideBtn);
      outsideBtn.focus();

      wrapper = mountDialog(true);
      await flushPromises();

      await wrapper.setData({ config: false });
      await flushPromises();

      expect(document.activeElement).toBe(outsideBtn);

      outsideBtn.remove();
    });

    it('should remove keydown listener on deactivation', async () => {
      wrapper = mountDialog(true);
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el[FOCUSTRAP_STATE_KEY].onKeydown).toBeTypeOf('function');

      await wrapper.setData({ config: false });
      await flushPromises();

      expect(el[FOCUSTRAP_STATE_KEY].onKeydown).toBeNull();
    });
  });

  // ── Boolean binding ────────────────────────────────────

  describe('Boolean binding', () => {
    it('should activate the trap when bound to true', async () => {
      wrapper = mountDialog(true);
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el[FOCUSTRAP_STATE_KEY].active).toBe(true);
    });

    it('should focus first element when bound to true', async () => {
      wrapper = mountDialog(true);
      await flushPromises();

      expect(document.activeElement).toBe(wrapper.find('[data-qa="first"]').element);
    });

    it('should treat false as { active: false }', async () => {
      wrapper = mountDialog(false);
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el[FOCUSTRAP_STATE_KEY].active).toBe(false);
    });
  });

  // ── Zero focusable elements ────────────────────────────

  describe('Zero focusable elements', () => {
    it('should prevent Tab without errors when no focusable elements exist', async () => {
      wrapper = mountWithTemplate(true, `
        <div role="dialog" v-dt-focustrap="config" data-qa="trap" aria-label="Empty dialog">
          <p>No focusable elements here</p>
        </div>
      `);
      await flushPromises();

      const trap = wrapper.find('[data-qa="trap"]');
      await trap.trigger('keydown', { key: 'Tab' });
    });

    it('should call preventDefault on Tab when no focusable elements exist', async () => {
      wrapper = mountWithTemplate(true, `
        <div role="dialog" v-dt-focustrap="config" data-qa="trap" aria-label="Empty dialog">
          <p>No focusable elements here</p>
        </div>
      `);
      await flushPromises();

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      const spy = vi.spyOn(event, 'preventDefault');
      wrapper.find('[data-qa="trap"]').element.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });
  });

  // ── Dynamic content ────────────────────────────────────

  describe('Dynamic content', () => {
    const DYNAMIC_TEMPLATE = `
      <div role="dialog" v-dt-focustrap="config" data-qa="trap" aria-label="Dynamic dialog">
        <button data-qa="first">First</button>
        <button v-if="showMiddle" data-qa="middle">Middle</button>
        <button data-qa="last">Last</button>
      </div>
    `;

    it('should include newly added elements in Tab wrapping', async () => {
      wrapper = mount({
        data () { return { config: true, showMiddle: false }; },
        template: DYNAMIC_TEMPLATE,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });
      await flushPromises();

      await wrapper.setData({ showMiddle: true });
      await flushPromises();

      wrapper.find('[data-qa="last"]').element.focus();
      await wrapper.find('[data-qa="trap"]').trigger('keydown', { key: 'Tab' });
      expect(document.activeElement).toBe(wrapper.find('[data-qa="first"]').element);
    });

    it('should handle removed focusable elements', async () => {
      wrapper = mount({
        data () { return { config: true, showMiddle: true }; },
        template: DYNAMIC_TEMPLATE,
      }, {
        global: { plugins: PLUGINS },
        attachTo: document.body,
      });
      await flushPromises();

      await wrapper.setData({ showMiddle: false });
      await flushPromises();

      wrapper.find('[data-qa="last"]').element.focus();
      await wrapper.find('[data-qa="trap"]').trigger('keydown', { key: 'Tab' });
      expect(document.activeElement).toBe(wrapper.find('[data-qa="first"]').element);

      wrapper.find('[data-qa="first"]').element.focus();
      await wrapper.find('[data-qa="trap"]').trigger('keydown', { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(wrapper.find('[data-qa="last"]').element);
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
      wrapper = mountDialog();
      await flushPromises();

      wrapper.find('[data-qa="first"]').element.focus();
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      const spy = vi.spyOn(event, 'preventDefault');
      wrapper.find('[data-qa="trap"]').element.dispatchEvent(event);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ── Unmount cleanup ────────────────────────────────────

  describe('Unmount cleanup', () => {
    it('should remove keydown listener on unmount', async () => {
      wrapper = mountDialog();
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      const spy = vi.spyOn(el, 'removeEventListener');

      wrapper.unmount();

      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));

      wrapper = null;
    });

    it('should restore focus on unmount when trap was active', async () => {
      const outsideBtn = document.createElement('button');
      outsideBtn.setAttribute('data-qa', 'outside');
      document.body.appendChild(outsideBtn);
      outsideBtn.focus();

      wrapper = mountDialog(true);
      await flushPromises();

      wrapper.unmount();

      expect(document.activeElement).toBe(outsideBtn);

      outsideBtn.remove();
      wrapper = null;
    });

    it('should clear state key from element on unmount', async () => {
      wrapper = mountDialog();
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el[FOCUSTRAP_STATE_KEY]).toBeDefined();

      wrapper.unmount();

      expect(el[FOCUSTRAP_STATE_KEY]).toBeUndefined();
      wrapper = null;
    });
  });

  // ── Fallback: container focused ────────────────────────

  describe('Fallback focus', () => {
    it('should remove synthetic tabindex on deactivation', async () => {
      wrapper = mountWithTemplate(true, `
        <div>
          <div role="alertdialog" v-dt-focustrap="config" data-qa="trap" aria-label="Alert">
            <p>Are you sure?</p>
          </div>
        </div>
      `);
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el.getAttribute('tabindex')).toBe('-1');

      await wrapper.setData({ config: false });
      await flushPromises();

      expect(el.hasAttribute('tabindex')).toBe(false);
    });

    it('should add tabindex to container when no focusable children exist', async () => {
      wrapper = mountWithTemplate(true, `
        <div role="alertdialog" v-dt-focustrap="config" data-qa="trap" aria-label="Alert">
          <p>Are you sure?</p>
        </div>
      `);
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(el.getAttribute('tabindex')).toBe('-1');
    });

    it('should focus container when no focusable children exist', async () => {
      wrapper = mountWithTemplate(true, `
        <div role="alertdialog" v-dt-focustrap="config" data-qa="trap" aria-label="Alert">
          <p>Are you sure?</p>
        </div>
      `);
      await flushPromises();

      const el = wrapper.find('[data-qa="trap"]').element;
      expect(document.activeElement).toBe(el);
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
