import { DtDropdown } from '@/components/Dropdown';
import { DtListItem } from '@/components/ListItem';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { DtPopover } from '@/components/Popover';
import { DtFocustrapDirective } from '@/directives/focustrap_directive';
import { flushPromises } from '@/common/utils';
import SrOnlyCloseButtonComponent from '@/common/sr_only_close_button.vue';

const MOCK_DEFAULT_SLOT_MESSAGE = 'Message';
const MOCK_HEADER_CONTENT = 'Popover Title';
const MOCK_FOOTER_CONTENT = 'Popover Footer';

const baseProps = {
  id: 'popover-id',
  showCloseButton: true,
  initialFocusElement: 'first',
};
const baseSlots = {
  content: MOCK_DEFAULT_SLOT_MESSAGE,
  headerContent: MOCK_HEADER_CONTENT,
  footerContent: MOCK_FOOTER_CONTENT,
  anchor: '<template #anchor="{ attrs }">' +
                  '<button data-qa="dt-button" v-bind="attrs">Click me</button>' +
                '</template>',
};

let manualTransitions = false;
let mockProps = {};
let mockSlots = {};

describe('DtPopover Tests', () => {
  let wrapper;
  let popoverWindow;
  let anchor;
  let button;
  let mainContent;
  let headerContent;
  let footerContent;
  let closeButton;

  const updateWrapper = () => {
    wrapper = mount(DtPopover, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        plugins: [DtFocustrapDirective],
        stubs: {
          transition: manualTransitions,
        },
      },
      attachTo: document.body,
    });

    popoverWindow = wrapper.findComponent({ ref: 'content' });
    anchor = wrapper.find('[data-qa="dt-popover-anchor"]');
    button = wrapper.find('[data-qa="dt-button"]');
    mainContent = popoverWindow.find('[data-qa="dt-popover-content"]');
    headerContent = wrapper.findComponent({ ref: 'popover__header' });
    footerContent = wrapper.findComponent({ ref: 'popover__footer' });
    closeButton = popoverWindow.find('[data-qa="dt-popover-close"]');
  };

  const completeTransition = async phase => {
    popoverWindow.vm.$emit(`after-${phase}`);
    await flushPromises();
  };

  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    manualTransitions = false;
    vi.restoreAllMocks();
    wrapper.unmount();
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', () => {
    describe('When Popover is open', () => {
      beforeEach(async () => {
        await button.trigger('click');
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render the popover', () => {
        expect(popoverWindow.exists()).toBe(true);
      });

      it.skip('should render the main content', () => {
        mainContent = wrapper.findComponent({ ref: 'popover__content' });

        expect(mainContent.text()).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });

      it('should render the header content', () => {
        headerContent = wrapper.findComponent({ ref: 'popover__header' });

        expect(headerContent.text()).toBe(MOCK_HEADER_CONTENT);
      });

      it('should render the footer content', () => {
        footerContent = wrapper.findComponent({ ref: 'popover__footer' });

        expect(footerContent.text()).toBe(MOCK_FOOTER_CONTENT);
      });

      it('should render the anchor slot', () => {
        expect(anchor.text()).toBe('Click me');
      });

      it('should not render the visually hidden close button', () => {
        const buttonExists = wrapper.findComponent(SrOnlyCloseButtonComponent).exists();

        expect(buttonExists).toBe(false);
      });

      describe('When showCloseButton is false', () => {
        beforeEach(async () => {
          await wrapper.setProps({ showCloseButton: false });
        });

        it('should contain a visually hidden close button', async () => {
          const buttonExists = await wrapper.findComponent(SrOnlyCloseButtonComponent).exists();

          expect(buttonExists).toBe(true);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When open prop is true', () => {
      it('popover content is displayed', async () => {
        await wrapper.setProps({ open: true });

        expect(popoverWindow.isVisible()).toBe(true);
      });

      describe('When anchor is clicked', () => {
        it('should not close the popover', async () => {
          await button.trigger('click');

          expect(popoverWindow.isVisible()).toBe(true);
        });
      });
    });

    describe('When open prop is false', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: false });
      });

      it('popover content should not be displayed', async () => {
        expect(popoverWindow.isVisible()).toBe(false);
      });

      describe('When anchor is clicked', () => {
        it('should not open the popover', async () => {
          await button.trigger('click');

          expect(popoverWindow.isVisible()).toBe(false);
        });
      });

      describe('When anchor is clicked but it\'s disabled', () => {
        it('should not open the popover', async () => {
          button.element.disabled = 'disabled';
          await button.trigger('click');

          expect(popoverWindow.isVisible()).toBe(false);

          button.element.disabled = undefined;
        });
      });
    });

    describe('When openOnContext prop is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ openOnContext: true });
      });

      it('popover content should not be displayed', async () => {
        expect(popoverWindow.isVisible()).toBe(false);
      });

      describe('When anchor is clicked', () => {
        beforeEach(async () => {
          await button.trigger('click');
        });

        it('should not open the popover', () => {
          expect(popoverWindow.isVisible()).toBe(false);
        });
      });

      describe('When anchor is right-clicked', () => {
        it('should open the popover', async () => {
          await button.trigger('contextmenu');

          expect(popoverWindow.isVisible()).toBe(true);
        });
      });
    });

    describe('When open prop is unset (default behaviour)', () => {
      beforeEach(async () => {
        mockProps = { open: null };

        updateWrapper();
      });

      describe('When anchor is clicked', () => {
        beforeEach(async () => {
          await button.trigger('click');
        });

        it('should open the popover', async () => {
          expect(popoverWindow.isVisible()).toBe(true);
        });

        describe('When a "dt-popover-close" event is emitted in the window object', () => {
          it('should close opened popover', async () => {
            await button.trigger('click');

            window.dispatchEvent(new window.Event('dt-popover-close'));

            expect(popoverWindow.isVisible()).toBe(false);
          });
        });

        describe('When esc is pressed', () => {
          it('should close the popover', async () => {
            await popoverWindow.trigger('keydown', { key: 'Escape' });

            expect(popoverWindow.isVisible()).toBe(false);
          });
        });

        describe.skip('When close button is activated', () => {
          it('should close the popover', async () => {
            closeButton = wrapper.find('[data-qa="dt-popover-close"]');

            await closeButton.trigger('click');

            expect(popoverWindow.isVisible()).toBe(false);
          });
        });

        describe('When sr-only close button is enabled and activated', () => {
          it('should close the popover', async () => {
            await wrapper.setProps({ showCloseButton: false });
            await wrapper.findComponent(SrOnlyCloseButtonComponent).trigger('click');

            expect(popoverWindow.isVisible()).toBe(false);
          });
        });
      });
    });
  });

  it('completes real lazy-show enter and leave hooks', async () => {
    await button.trigger('click');
    await flushPromises();
    expect(wrapper.emitted('opened')[0][0]).toBe(true);
    await button.trigger('click');
    await flushPromises();
    expect(wrapper.emitted('opened')[1]).toEqual([false]);
  });

  describe('Popper Options Tests', () => {
    it('defaults the boundary to "clippingParents"', () => {
      const flipModifier = wrapper.vm.popperOptions().modifiers.find(modifier => modifier.name === 'flip');

      expect(flipModifier.options.boundary).toBe('clippingParents');
    });

    describe('When boundary prop is set', () => {
      beforeEach(() => {
        mockProps = { boundary: document.body };
        updateWrapper();
      });

      it('passes the boundary to the flip modifier options', () => {
        const flipModifier = wrapper.vm.popperOptions().modifiers.find(modifier => modifier.name === 'flip');

        expect(flipModifier.options.boundary).toBe(document.body);
      });
    });

    describe('When boundary prop changes while the popover is open', () => {
      it('updates the tippy instance with the new popperOptions', async () => {
        await wrapper.setProps({ open: true });
        const setPropsSpy = vi.spyOn(wrapper.vm.tip, 'setProps');

        await wrapper.setProps({ boundary: document.body });

        expect(setPropsSpy).toHaveBeenCalledWith({ popperOptions: wrapper.vm.popperOptions() });
      });
    });

    describe('When offset or fallbackPlacements are mutated in place', () => {
      it('passes the mutated offset to the tippy instance', async () => {
        mockProps = { open: true, offset: [0, 4] };
        updateWrapper();
        await flushPromises();

        const setPropsSpy = vi.spyOn(wrapper.vm.tip, 'setProps');
        wrapper.vm.offset[1] = 20;
        await wrapper.vm.$nextTick();

        expect(setPropsSpy).toHaveBeenCalledWith(expect.objectContaining({
          offset: [0, 20],
        }));
      });

      it('passes the mutated fallbackPlacements to the tippy instance', async () => {
        mockProps = { open: true, fallbackPlacements: ['auto'] };
        updateWrapper();
        await flushPromises();

        const setPropsSpy = vi.spyOn(wrapper.vm.tip, 'setProps');
        wrapper.vm.fallbackPlacements.push('bottom');
        await wrapper.vm.$nextTick();

        const { popperOptions } = setPropsSpy.mock.calls[0][0];
        const flipModifier = popperOptions.modifiers.find(modifier => modifier.name === 'flip');

        expect(flipModifier.options.fallbackPlacements).toEqual(['auto', 'bottom']);
      });
    });
  });

  describe('getReferenceClientRect fallback (DLT-3607)', () => {
    it('returns a zero rect instead of undefined when anchorEl is null', () => {
      wrapper.vm.anchorEl = null;

      const rect = wrapper.vm.getReferenceClientRect(false);

      expect(rect).toEqual({ width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0 });
    });
  });

  describe('When isOpen becomes true before an anchor element has been resolved (DLT-3607)', () => {
    it('does not initialize a tippy instance with a null anchor', async () => {
      wrapper.vm.isOpen = false;
      await wrapper.vm.$nextTick();
      wrapper.vm.anchorEl = null;
      const initSpy = vi.spyOn(wrapper.vm, 'initTippyInstance');

      wrapper.vm.isOpen = true;
      await wrapper.vm.$nextTick();

      expect(initSpy).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Tests', () => {
    describe('When popover is open', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: true });
      });

      it('aria-expanded should be set correctly on the anchor', () => {
        expect(button.attributes('aria-expanded')).toBe('true');
      });

      it('aria-controls should be set correctly on the anchor', () => {
        expect(button.attributes('aria-controls')).toBe('popover-id');
      });

      it('aria-haspopup should be set correctly on the anchor', () => {
        expect(button.attributes('aria-haspopup')).toBe('dialog');
      });

      it('aria-hidden should be set correctly on the content window', () => {
        expect(popoverWindow.attributes('aria-hidden')).toBe('false');
      });

      it('aria-labelledby should be set correctly on the content window', () => {
        expect(popoverWindow.attributes('aria-labelledby')).toBe(wrapper.vm.labelledBy);
      });

      it('uses an explicit accessible label without an automatic label reference', async () => {
        await wrapper.setProps({ ariaLabel: 'Filter by' });

        expect(popoverWindow.attributes('aria-label')).toBe('Filter by');
        expect(popoverWindow.attributes('aria-labelledby')).toBeUndefined();
      });
    });

    describe('When popover is closed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: false });
      });

      it('should have correct aria attributes on the anchor', async () => {
        expect(button.attributes('aria-expanded')).toBe('false');
      });

      it('should have correct aria attributes on the content window', async () => {
        expect(popoverWindow.attributes('aria-hidden')).toBe('true');
      });
    });
  });

  describe('Built-in menu close semantics', () => {
    it.each([
      { showCloseButton: false, modal: false },
      { showCloseButton: false, modal: true },
      { showCloseButton: true, modal: false },
      { showCloseButton: true, modal: true },
    ])('updates popup and native Close semantics with showCloseButton=$showCloseButton, modal=$modal',
      async ({ showCloseButton, modal }) => {
        wrapper.unmount();
        manualTransitions = true;
        mockProps = { role: 'dialog', showCloseButton, modal };
        updateWrapper();
        await button.trigger('click');
        await completeTransition('enter');
        const close = popoverWindow.get(showCloseButton
          ? '[data-qa="dt-popover-close"]'
          : '[data-qa="dt-sr-only-close-button"]');
        const nativeClose = close.element;
        expect(close.attributes('role')).toBeUndefined();
        expect(nativeClose.tagName).toBe('BUTTON');
        expect(nativeClose.tabIndex).toBe(0);

        await wrapper.setProps({ role: 'menu' });
        expect.soft(popoverWindow.attributes('aria-modal')).toBeUndefined();
        expect.soft(close.attributes('role')).toBe('menuitem');
        expect(close.element).toBe(nativeClose);
        await wrapper.setProps({ role: 'dialog' });
        expect(close.attributes('role')).toBeUndefined();
        await wrapper.setProps({ role: 'menu' });

        nativeClose.focus();
        await close.trigger('click');
        expect(button.attributes('aria-expanded')).toBe('false');
        expect(wrapper.emitted('opened').map(([open]) => open)).toEqual([true]);
        await completeTransition('leave');
        expect(wrapper.emitted('opened').map(([open]) => open)).toEqual([true, false]);
        if (modal) expect(document.activeElement).toBe(button.element);
      });
  });

  describe('Focus trapping', () => {
    const MOCK_TRAP_CONTENT =
      '<button data-qa="trap-first">One</button><button data-qa="trap-last">Two</button>';

    describe('When modal and open', () => {
      beforeEach(async () => {
        mockProps = { modal: true };
        mockSlots = { content: MOCK_TRAP_CONTENT };

        updateWrapper();
        await wrapper.setProps({ open: true });
        await flushPromises();
      });

      it('wraps focus from the last element to the first on Tab', async () => {
        const first = popoverWindow.find('[data-qa="dt-popover-close"]').element;
        const last = popoverWindow.find('[data-qa="trap-last"]').element;

        last.focus();
        await popoverWindow.trigger('keydown', { key: 'Tab' });

        expect(document.activeElement).toBe(first);
      });

      it('wraps focus from the first element to the last on Shift+Tab', async () => {
        const first = popoverWindow.find('[data-qa="dt-popover-close"]').element;
        const last = popoverWindow.find('[data-qa="trap-last"]').element;

        first.focus();
        await popoverWindow.trigger('keydown', { key: 'Tab', shiftKey: true });

        expect(document.activeElement).toBe(last);
      });

      it('keeps the dialog exposed until dismissal restores focus', async () => {
        popoverWindow.get('[data-qa="trap-last"]').element.focus();
        let restore;
        let requested;
        const focusRequested = new Promise(resolve => { requested = resolve; });
        vi.spyOn(wrapper.vm, 'getFirstFocusableElement').mockImplementationOnce(() => {
          requested();
          return new Promise(resolve => { restore = resolve; });
        });
        await popoverWindow.trigger('keydown', { key: 'Escape' });
        await focusRequested;
        expect(button.attributes('aria-expanded')).toBe('false');
        expect(popoverWindow.attributes('aria-hidden')).toBe('false');
        restore(button.element);
        await flushPromises();
        expect(document.activeElement).toBe(button.element);
        expect(popoverWindow.attributes('aria-hidden')).toBe('true');
      });
    });

    describe('When not modal', () => {
      beforeEach(async () => {
        mockProps = { modal: false };
        mockSlots = { content: MOCK_TRAP_CONTENT };

        updateWrapper();
        await wrapper.setProps({ open: true });
        await flushPromises();
      });

      it('does not trap focus (Tab is not wrapped)', async () => {
        const last = popoverWindow.find('[data-qa="trap-last"]').element;

        last.focus();
        await popoverWindow.trigger('keydown', { key: 'Tab' });

        expect(document.activeElement).toBe(last);
      });
    });

    describe('When focustrap is true and not modal', () => {
      beforeEach(async () => {
        mockProps = { modal: false, focustrap: true };
        mockSlots = { content: MOCK_TRAP_CONTENT };

        updateWrapper();
        await wrapper.setProps({ open: true });
        await flushPromises();
      });

      it('wraps focus from the last element to the first on Tab', async () => {
        const first = popoverWindow.find('[data-qa="dt-popover-close"]').element;
        const last = popoverWindow.find('[data-qa="trap-last"]').element;

        last.focus();
        await popoverWindow.trigger('keydown', { key: 'Tab' });

        expect(document.activeElement).toBe(first);
      });

      it('wraps focus from the first element to the last on Shift+Tab', async () => {
        const first = popoverWindow.find('[data-qa="dt-popover-close"]').element;
        const last = popoverWindow.find('[data-qa="trap-last"]').element;

        first.focus();
        await popoverWindow.trigger('keydown', { key: 'Tab', shiftKey: true });

        expect(document.activeElement).toBe(last);
      });

      it('closes the popover on Escape', async () => {
        await popoverWindow.trigger('keydown', { key: 'Escape' });
        await flushPromises();

        expect(popoverWindow.attributes('aria-hidden')).toBe('true');
      });

      it('restores focus to the previously focused element on Escape', async () => {
        // Close so the directive deactivates, then set a known previous focus
        await wrapper.setProps({ open: false });
        await flushPromises();
        button.element.focus();

        // Reopen — directive activates and captures button as previousFocus
        await wrapper.setProps({ open: true });
        await flushPromises();

        await popoverWindow.trigger('keydown', { key: 'Escape' });
        await flushPromises();

        expect(document.activeElement).toBe(button.element);
      });
    });

    describe('When there are no focusable elements and the content ref is unset (DLT-3550)', () => {
      beforeEach(async () => {
        mockProps = { showCloseButton: false, initialFocusElement: 'first' };
        mockSlots = { content: 'No focusable elements here' };

        updateWrapper();
        await wrapper.setProps({ open: true });
        await flushPromises();
      });

      it('does not throw when a delayed after-enter callback fires against a stale content ref', () => {
        const domEl = wrapper.vm.$refs.popover__content;
        wrapper.vm.$refs.content = null;

        expect(() => wrapper.vm.focusFirstElementIfNeeded(domEl)).not.toThrow();
      });
    });
  });

  describe('Pass-through class props', () => {
    it('Should apply anchorClass to the anchor wrapper', () => {
      mockProps = { anchorClass: 'my-anchor-class' };
      updateWrapper();

      anchor = wrapper.find('[data-qa="dt-popover-anchor"]');

      expect(anchor.classes()).toContain('my-anchor-class');
    });
  });

  describe('contentMode Tests', () => {
    it('should set data-dt-mode on dialog when contentMode is set', () => {
      mockProps = { contentMode: 'dark' };
      updateWrapper();
      popoverWindow = wrapper.findComponent({ ref: 'content' });

      expect(popoverWindow.attributes('data-dt-mode')).toBe('dark');
    });

    it('should invert root mode when contentMode is invert', async () => {
      document.documentElement.setAttribute('data-dt-mode', 'light');
      mockProps = { contentMode: 'invert' };
      updateWrapper();
      await wrapper.vm.$nextTick();
      popoverWindow = wrapper.findComponent({ ref: 'content' });

      expect(popoverWindow.attributes('data-dt-mode')).toBe('dark');

      document.documentElement.removeAttribute('data-dt-mode');
    });
  });

  describe('When component is unmounting', () => {
    it('sets transition: none on content element to cancel in-flight transitions', () => {
      const contentEl = popoverWindow.element;
      wrapper.unmount();
      expect(contentEl.style.transition).toBe('none');
    });
  });

  it.each([DtPopover, DtDropdown])('preserves bubbling open-change DOM events through $name', async Component => {
    wrapper.unmount();
    const listener = vi.fn();
    const content = () => h(Component === DtDropdown ? DtListItem : 'button', {
      role: Component === DtDropdown ? 'menuitem' : undefined,
      'data-qa': 'custom-event',
      onClick: event => event.currentTarget.dispatchEvent(new CustomEvent('open-change', {
        bubbles: true, detail: 'consumer-state',
      })),
    }, Component === DtDropdown ? () => 'Dispatch' : 'Dispatch');
    wrapper = mount(Component, {
      props: { open: true, appendTo: 'parent', modal: false },
      attrs: { onOpenChange: listener },
      slots: { anchor: () => h('button', 'Open'), [Component === DtDropdown ? 'list' : 'content']: content },
      global: { plugins: [DtFocustrapDirective], stubs: { transition: true } },
      attachTo: document.body,
    });
    expect(listener).not.toHaveBeenCalled();
    await wrapper.get('[data-qa="custom-event"]').trigger('click');
    expect(listener.mock.calls).toEqual([[expect.objectContaining({ detail: 'consumer-state' })]]);
  });

  it.each([DtPopover, DtDropdown])('preserves an existing wrapper open-change around $name', async Component => {
    wrapper.unmount();
    const listener = vi.fn();
    const Wrapper = defineComponent({
      name: 'ExistingOverlayWrapper',
      props: { open: Boolean },
      watch: { open (value) { this.$emit('open-change', value); } },
      render () {
        return h(Component, { open: this.open }, {
          anchor: () => h('button', 'Open'),
          [Component === DtDropdown ? 'list' : 'content']: () => h(Component === DtDropdown ? 'li' : 'p',
            Component === DtDropdown ? { role: 'menuitem' } : {}, 'Action'),
        });
      },
    });
    wrapper = mount(Wrapper, {
      props: { open: false }, attrs: { onOpenChange: listener },
      global: { plugins: [DtFocustrapDirective], stubs: { transition: true } }, attachTo: document.body,
    });
    await wrapper.setProps({ open: true });
    await wrapper.setProps({ open: false });
    expect(listener.mock.calls).toEqual([[true], [false]]);
  });

  describe('logical visibility and transition generations', () => {
    let scrollWasLocked;
    let visibilityChanges;
    beforeEach(() => {
      scrollWasLocked = document.documentElement.classList.contains('d-of-hidden');
      document.documentElement.classList.remove('d-of-hidden');
      wrapper.unmount();
      manualTransitions = true;
      visibilityChanges = vi.fn();
      mockProps.visibilityChangeCallback = visibilityChanges;
      mockSlots.content = ({ close }) => h('button', { 'data-qa': 'inside', onClick: close }, 'Action');
      updateWrapper();
    });
    afterEach(() => {
      document.documentElement.classList.toggle('d-of-hidden', scrollWasLocked);
    });

    const suspendNextFocus = () => {
      let release;
      let started;
      const requested = new Promise(resolve => { started = resolve; });
      vi.spyOn(wrapper.vm, 'getFirstFocusableElement').mockImplementationOnce(() => {
        started();
        return new Promise(resolve => { release = resolve; });
      });
      return { requested, release: element => release(element) };
    };

    it('reports an initially open state during creation before terminal notifications', async () => {
      wrapper.unmount();
      let anchorRendered = false;
      const logicalChanges = [];
      mockProps = {
        open: true,
        visibilityChangeCallback: value => logicalChanges.push({ value, anchorRendered }),
      };
      mockSlots.anchor = ({ attrs }) => {
        anchorRendered = true;
        return h('button', { ...attrs, 'data-qa': 'dt-button' }, 'Open');
      };
      updateWrapper();
      await nextTick();
      expect(logicalChanges).toEqual([{ value: true, anchorRendered: false }]);
      expect(popoverWindow.attributes('aria-hidden')).toBe('false');
      expect(button.attributes('aria-expanded')).toBe('true');
      expect(wrapper.emitted('opened')).toBeUndefined();
      expect(wrapper.emitted('update:open')).toBeUndefined();
      await completeTransition('enter');
      expect(wrapper.emitted('opened')[0][0]).toBe(true);
      expect(wrapper.emitted('update:open')).toEqual([[true]]);
      expect(logicalChanges).toHaveLength(1);
    });

    it('notifies actual logical changes synchronously once per change', async () => {
      const opening = button.trigger('click');
      expect(visibilityChanges.mock.calls).toEqual([[true]]);
      await opening;
      const closing = popoverWindow.trigger('keydown', { key: 'Escape' });
      expect(visibilityChanges.mock.calls).toEqual([[true], [false]]);
      await closing;
      await popoverWindow.trigger('keydown', { key: 'Escape' });
      expect(visibilityChanges.mock.calls).toEqual([[true], [false]]);
      expect(wrapper.emitted('opened')).toBeUndefined();
    });

    it.each([null, false])('retains completed transition updates with open=%s', async open => {
      await wrapper.setProps({ open });
      if (open === null) await button.trigger('click');
      else await wrapper.setProps({ open: true });
      expect(wrapper.emitted('opened')).toBeUndefined();
      await completeTransition('enter');
      expect(wrapper.emitted('opened')[0][0]).toBe(true);
      await popoverWindow.find('[data-qa="inside"]').trigger('click');
      expect(wrapper.emitted('opened')).toHaveLength(1);
      await completeTransition('leave');
      expect(wrapper.emitted('opened')[1]).toEqual([false]);
      expect(wrapper.emitted('update:open')).toEqual(open === null ? undefined : [[true], [false]]);
    });

    it('does not treat a same-flush prop rewrite as a reopen request', async () => {
      await wrapper.setProps({ open: true });
      await popoverWindow.trigger('keydown', { key: 'Escape' });
      wrapper.setProps({ open: false });
      await wrapper.setProps({ open: true });
      expect(button.attributes('aria-expanded')).toBe('false');
      await wrapper.setProps({ open: false });
      await wrapper.setProps({ open: true });
      expect(button.attributes('aria-expanded')).toBe('true');
    });

    it('ignores a canceled leave without requiring an after-leave callback', async () => {
      await wrapper.setProps({ open: true });
      await completeTransition('enter');
      await wrapper.setProps({ open: false });
      await wrapper.setProps({ open: true });
      expect(visibilityChanges.mock.calls).toEqual([[true], [false], [true]]);
      expect(wrapper.emitted('opened')).toHaveLength(1);
      expect(popoverWindow.attributes('aria-hidden')).toBe('false');
    });

    it('finishes initial focus before notifying a consumer that chooses another target', async () => {
      wrapper.unmount();
      mockSlots.content = () => [
        h('button', { 'data-qa': 'first-target' }, 'First'),
        h('input', { 'data-qa': 'consumer-target' }),
      ];
      mockProps.onOpened = open => {
        if (open) popoverWindow.get('[data-qa="consumer-target"]').element.focus();
      };
      updateWrapper();
      await wrapper.setProps({ open: true });
      await completeTransition('enter');
      expect(document.activeElement).toBe(popoverWindow.get('[data-qa="consumer-target"]').element);
    });

    it('focuses a documented HTMLElement target inside the popover', async () => {
      await wrapper.setProps({ open: true });
      const target = popoverWindow.get('[data-qa="inside"]').element;
      await wrapper.setProps({ initialFocusElement: target });
      await completeTransition('enter');
      expect(document.activeElement).toBe(target);
      expect(wrapper.emitted('opened')[0][0]).toBe(true);
    });

    it('stops a running leave before stale focus and terminal effects after reopen', async () => {
      await wrapper.setProps({ open: true });
      await completeTransition('enter');
      await wrapper.setProps({ open: false });
      const focus = suspendNextFocus();
      const contentButton = popoverWindow.find('[data-qa="inside"]').element;
      popoverWindow.vm.$emit('after-leave');
      await focus.requested;
      await wrapper.setProps({ open: true });
      contentButton.focus();
      focus.release(button.element);
      await flushPromises();
      expect(document.activeElement).toBe(contentButton);
      expect(document.documentElement.classList.contains('d-of-hidden')).toBe(true);
      expect(popoverWindow.element.isConnected).toBe(true);
      expect(wrapper.emitted('opened')).toHaveLength(1);
      expect(wrapper.emitted('update:open')).toEqual([[true]]);
      expect(popoverWindow.attributes('aria-hidden')).toBe('false');
    });

    it('stops a running enter before stale focus and terminal effects after close', async () => {
      await wrapper.setProps({ open: true });
      const focus = suspendNextFocus();
      button.element.focus();
      popoverWindow.vm.$emit('after-enter');
      await focus.requested;
      await wrapper.setProps({ open: false });
      focus.release(popoverWindow.find('[data-qa="inside"]').element);
      await flushPromises();
      expect(document.activeElement).toBe(button.element);
      expect(document.documentElement.classList.contains('d-of-hidden')).toBe(false);
      expect(wrapper.emitted('opened')).toBeUndefined();
      expect(wrapper.emitted('update:open')).toBeUndefined();
    });

    it('keeps consumer focus when closing and replacing the initial target during enter', async () => {
      wrapper.unmount();
      mockProps = { modal: false };
      mockSlots.content = () => [
        h('button', {
          'data-qa': 'inside',
          onFocus: () => {
            wrapper.setProps({
              open: false,
              initialFocusElement: popoverWindow.find('[data-qa="replacement-target"]').element,
            });
            button.element.focus();
          },
        }, 'First action'),
        h('button', { 'data-qa': 'replacement-target' }, 'Next opening target'),
      ];
      updateWrapper();
      await wrapper.setProps({ open: true });
      await completeTransition('enter');
      expect(document.activeElement).toBe(button.element);
      expect(button.attributes('aria-expanded')).toBe('false');
      expect(wrapper.emitted('opened')).toBeUndefined();
    });

    it('stops stale enter effects when a focus listener closes the popover', async () => {
      await wrapper.setProps({ initialFocusElement: 'dialog' });
      await wrapper.setProps({ open: true });
      popoverWindow.element.addEventListener('focus', async () => {
        await nextTick();
        await wrapper.setProps({ open: false });
      }, { once: true });
      await completeTransition('enter');
      expect(wrapper.emitted('opened')).toBeUndefined();
      expect(document.documentElement.classList.contains('d-of-hidden')).toBe(false);
      expect(button.attributes('aria-expanded')).toBe('false');
    });

    it('stops stale leave effects when a focus listener reopens the popover', async () => {
      await wrapper.setProps({ open: true });
      await completeTransition('enter');
      await wrapper.setProps({ open: false });
      button.element.addEventListener('focus', async () => {
        await wrapper.setProps({ open: true });
      }, { once: true });
      await completeTransition('leave');
      expect(wrapper.emitted('opened')).toHaveLength(1);
      expect(document.documentElement.classList.contains('d-of-hidden')).toBe(true);
      expect(button.attributes('aria-expanded')).toBe('true');
    });

    it.each(['enter', 'leave'])('stops a suspended %s completion after disposal', async phase => {
      await wrapper.setProps({ open: true });
      if (phase === 'leave') await wrapper.setProps({ open: false });
      const focus = suspendNextFocus();
      const nativeFocus = vi.spyOn(button.element, 'focus');
      popoverWindow.vm.$emit(`after-${phase}`);
      await focus.requested;
      wrapper.unmount();
      focus.release(button.element);
      await flushPromises();
      expect(nativeFocus).not.toHaveBeenCalled();
      expect(wrapper.emitted('opened')).toBeUndefined();
      expect(wrapper.emitted('update:open')).toBeUndefined();
    });

    it('does not forward or toggle boolean anchor arrows without opt-in', async () => {
      await wrapper.setProps({ open: false });
      let arrowEvent;
      button.element.addEventListener('keydown', event => { arrowEvent = event; }, { once: true });
      await button.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
      expect(arrowEvent.defaultPrevented).toBe(true);
      expect(wrapper.emitted('keydown')).toBeUndefined();
      await wrapper.setProps({ forwardAnchorArrowKeys: true });
      await button.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
      expect(wrapper.emitted('keydown')).toHaveLength(1);
      expect(button.attributes('aria-expanded')).toBe('false');
    });
  });

  describe('appendTo behavior', () => {
    describe('when anchor is inside a <dialog> element and appendTo is "body"', () => {
      it('should append the popover to the dialog element, not body', async () => {
        const dialogEl = document.createElement('dialog');
        document.body.appendChild(dialogEl);

        const localWrapper = mount(DtPopover, {
          props: { ...baseProps, open: null },
          slots: { ...baseSlots },
          global: { plugins: [DtFocustrapDirective], stubs: { transition: false } },
          attachTo: dialogEl,
        });

        const btn = localWrapper.find('[data-qa="dt-button"]');
        await btn.trigger('click');

        expect(localWrapper.vm.tip.popper.parentElement).toBe(dialogEl);

        localWrapper.unmount();
        document.body.removeChild(dialogEl);
      });
    });

    describe('when anchor is NOT inside a <dialog> element and appendTo is "body"', () => {
      it('should append the popover to document.body', async () => {
        const localWrapper = mount(DtPopover, {
          props: { ...baseProps, open: null },
          slots: { ...baseSlots },
          global: { plugins: [DtFocustrapDirective], stubs: { transition: false } },
          attachTo: document.body,
        });

        const btn = localWrapper.find('[data-qa="dt-button"]');
        await btn.trigger('click');

        expect(localWrapper.vm.tip.popper.parentElement).toBe(document.body);

        localWrapper.unmount();
      });
    });

    describe('when anchor is inside a <dialog> but appendTo is explicitly set', () => {
      it('should use the explicit appendTo target, bypassing dialog detection', async () => {
        const dialogEl = document.createElement('dialog');
        document.body.appendChild(dialogEl);

        const localWrapper = mount(DtPopover, {
          props: { ...baseProps, open: null, appendTo: 'parent' },
          slots: { ...baseSlots },
          global: { plugins: [DtFocustrapDirective], stubs: { transition: false } },
          attachTo: dialogEl,
        });

        const btn = localWrapper.find('[data-qa="dt-button"]');
        await btn.trigger('click');

        // 'parent' means the popover container element, not the dialog
        expect(localWrapper.vm.tip.popper.parentElement).not.toBe(dialogEl);

        localWrapper.unmount();
        document.body.removeChild(dialogEl);
      });
    });

    describe('scrim target (modal=true)', () => {
      const mountModalPopover = async (extraProps, attachTo) => {
        const localWrapper = mount(DtPopover, {
          props: { ...baseProps, open: true, modal: true, ...extraProps },
          slots: { ...baseSlots },
          global: { plugins: [DtFocustrapDirective], stubs: { transition: false } },
          attachTo,
        });
        await flushPromises();
        return localWrapper;
      };

      describe('when appendTo is "body" (default) and anchor is inside a <dialog>', () => {
        it('places the scrim in the dialog, matching the content target', async () => {
          const dialogEl = document.createElement('dialog');
          document.body.appendChild(dialogEl);

          const localWrapper = await mountModalPopover({}, dialogEl);
          const scrim = dialogEl.querySelector('[data-qa="dt-popover-scrim"]');

          expect(scrim.parentElement).toBe(dialogEl);
          expect(localWrapper.vm.tip.popper.parentElement).toBe(dialogEl);

          localWrapper.unmount();
          document.body.removeChild(dialogEl);
        });
      });

      describe('when appendTo is "body" (default) and anchor is NOT inside a <dialog>', () => {
        it('places the scrim in document.body, matching the content target', async () => {
          const localWrapper = await mountModalPopover({}, document.body);
          const scrim = document.body.querySelector('[data-qa="dt-popover-scrim"]');

          expect(scrim.parentElement).toBe(document.body);
          expect(localWrapper.vm.tip.popper.parentElement).toBe(document.body);

          localWrapper.unmount();
        });
      });

      describe('when appendTo is "parent"', () => {
        it('places the scrim under the anchor\'s parent element', async () => {
          const container = document.createElement('div');
          document.body.appendChild(container);

          const localWrapper = await mountModalPopover({ appendTo: 'parent' }, container);
          const scrim = container.querySelector('[data-qa="dt-popover-scrim"]');

          expect(scrim.parentElement).toBe(localWrapper.vm.anchorEl.parentElement);

          localWrapper.unmount();
          document.body.removeChild(container);
        });
      });

      describe('when appendTo is "root"', () => {
        it('places the scrim in window.parent.document.body when same-origin', async () => {
          const localWrapper = await mountModalPopover({ appendTo: 'root' }, document.body);
          const scrim = document.body.querySelector('[data-qa="dt-popover-scrim"]');

          expect(scrim.parentElement).toBe(window.parent.document.body);

          localWrapper.unmount();
        });

        it('falls back to the anchor\'s parent element when the parent window is cross-origin', async () => {
          // Matches the content's own fallback: initTippyInstance falls back to Tippy's
          // 'parent' sentinel (the anchor's parentElement) when window.parent throws.
          const originalParentDescriptor = Object.getOwnPropertyDescriptor(window, 'parent');
          Object.defineProperty(window, 'parent', {
            configurable: true,
            get () {
              throw new Error('cross-origin');
            },
          });

          // window.parent is shared global state — restore it in finally so a failed
          // mount/assertion here can't leave every later test unable to access window.parent.
          let localWrapper;
          try {
            localWrapper = await mountModalPopover({ appendTo: 'root' }, document.body);
            const scrim = document.body.querySelector('[data-qa="dt-popover-scrim"]');

            expect(scrim.parentElement).toBe(localWrapper.vm.anchorEl.parentElement);
          } finally {
            localWrapper?.unmount();
            Object.defineProperty(window, 'parent', originalParentDescriptor);
          }
        });
      });

      describe('when appendTo is an explicit HTMLElement', () => {
        it('places the scrim in that element, matching the content target', async () => {
          const customTarget = document.createElement('div');
          document.body.appendChild(customTarget);

          const localWrapper = await mountModalPopover({ appendTo: customTarget }, document.body);
          const scrim = customTarget.querySelector('[data-qa="dt-popover-scrim"]');

          expect(scrim.parentElement).toBe(customTarget);
          expect(localWrapper.vm.tip.popper.parentElement).toBe(customTarget);

          localWrapper.unmount();
          document.body.removeChild(customTarget);
        });
      });

      describe('when appendTo changes while the popover is already open', () => {
        it('does not move the scrim independently of the content (both stay put until reopened)', async () => {
          // The scrim target is resolved in initTippyInstance() at the same moment as the
          // content's target, not as a live computed off appendTo -- otherwise the scrim would
          // reactively follow a mid-open appendTo change while the already-rendered Tippy
          // content (which only re-resolves on open) stayed behind, drifting apart.
          const container = document.createElement('div');
          document.body.appendChild(container);

          const localWrapper = await mountModalPopover({}, document.body);
          const scrimParentBefore = document.body.querySelector('[data-qa="dt-popover-scrim"]').parentElement;
          const contentParentBefore = localWrapper.vm.tip.popper.parentElement;

          await localWrapper.setProps({ appendTo: 'parent' });

          const scrim = document.body.querySelector('[data-qa="dt-popover-scrim"]');

          expect(scrim.parentElement).toBe(scrimParentBefore);
          expect(localWrapper.vm.tip.popper.parentElement).toBe(contentParentBefore);

          localWrapper.unmount();
          document.body.removeChild(container);
        });

        it('resolves both scrim and content to the new target on the next open', async () => {
          const container = document.createElement('div');
          document.body.appendChild(container);

          const localWrapper = await mountModalPopover({}, container);

          await localWrapper.setProps({ open: false });
          await flushPromises();
          await localWrapper.setProps({ appendTo: 'parent', open: true });
          await flushPromises();

          const scrim = container.querySelector('[data-qa="dt-popover-scrim"]');

          expect(scrim.parentElement).toBe(localWrapper.vm.anchorEl.parentElement);
          expect(localWrapper.vm.tip.popper.parentElement).toBe(localWrapper.vm.anchorEl.parentElement);

          localWrapper.unmount();
          document.body.removeChild(container);
        });
      });
    });
  });

  describe('When anchor slot content changes', () => {
    it('should attach the tippy instance to the new DOM node', async () => {
      const component = {
        template: `
          <dt-popover ref="popover" :open="open">
            <template #anchor>
              <div v-if="showAlternateAnchor" class="testanchor">Anchor 1</div>
              <div v-else class="testanchor">Anchor 2</div>
              <div v-if="showExtraneous">will not be the anchor</div>
            </template>
            <template #content>
              <div class="content">Hello</div>
            </template>
          </dt-popover>
        `,
        components: {
          DtPopover,
        },
        props: ['showAlternateAnchor', 'showExtraneous', 'open'],
      };
      const wrapper = mount(component, {
        props: { showAlternateAnchor: false },
        global: {
          plugins: [DtFocustrapDirective],
          stubs: {
            transition: false,
          },
        },
        attachTo: document.body,
      })

      let popoverWindow = wrapper.findComponent({ ref: 'popover' }).findComponent({ ref: 'content' });
      expect(popoverWindow.isVisible()).toBe(false);
      await wrapper.setProps({ open: true});
      expect(popoverWindow.isVisible()).toBe(true);
      await wrapper.setProps({ open: false});
      expect(popoverWindow.isVisible()).toBe(false);

      await wrapper.setProps({ showAlternateAnchor: true});
      popoverWindow = wrapper.findComponent({ ref: 'popover' }).findComponent({ ref: 'content' });

      expect(popoverWindow.isVisible()).toBe(false);
      await wrapper.setProps({ open: true});
      expect(popoverWindow.isVisible()).toBe(true);
      await wrapper.setProps({ open: false});
      expect(popoverWindow.isVisible()).toBe(false);

      await wrapper.setProps({ open: true});
      const popover = wrapper.findComponent({ ref: 'popover' });
      vi.spyOn(popover.vm, 'initTippyInstance');
      await wrapper.setProps({ showExtraneous: true });
      expect(popover.vm.initTippyInstance).not.toHaveBeenCalled();

      wrapper.unmount();
    });
  });
});
