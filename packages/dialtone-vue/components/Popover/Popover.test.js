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
          transition: false,
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

      it('does not mark the dialog aria-hidden merely because isOpen became false', () => {
        // closePopover() flips isOpen synchronously; per the fix, that alone must not hide
        // the dialog from assistive technology, since a descendant may still hold focus and
        // the leave transition hasn't restored it yet. Only onLeaveTransitionComplete may do
        // that, once focus has actually moved off the dialog.
        expect(wrapper.vm.isDialogAriaHidden).toBe(false);

        wrapper.vm.closePopover();

        expect(wrapper.vm.isDialogAriaHidden).toBe(false);
      });

      it('marks the dialog aria-hidden only after onLeaveTransitionComplete restores focus', async () => {
        const last = popoverWindow.find('[data-qa="trap-last"]').element;
        last.focus();

        wrapper.vm.closePopover();
        await wrapper.vm.onLeaveTransitionComplete();

        expect(document.activeElement).toBe(button.element);
        expect(wrapper.vm.isDialogAriaHidden).toBe(true);
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
    beforeEach(() => {
      wrapper.vm._isUnmounting = true;
    });

    it('sets transition: none on content element to cancel in-flight transitions', () => {
      const contentEl = wrapper.vm.popoverContentEl;
      wrapper.unmount();
      expect(contentEl.style.transition).toBe('none');
    });

    it('does not emit "opened" when leave transition completes', async () => {
      await wrapper.vm.onLeaveTransitionComplete();
      expect(wrapper.emitted('opened')).toBeUndefined();
    });

    it('emits "opened" and respects open prop when leave transition completes and not unmounting', async () => {
      wrapper.vm._isUnmounting = false;
      await wrapper.vm.onLeaveTransitionComplete();
      expect(wrapper.emitted('opened')).toBeDefined();
      expect(wrapper.emitted('opened')[0]).toEqual([false]);
      // uncontrolled (open === null): update:open is not emitted
      expect(wrapper.emitted('update:open')).toBeUndefined();
      // controlled (open !== null): update:open is emitted
      await wrapper.setProps({ open: false });
      await wrapper.vm.onLeaveTransitionComplete();
      expect(wrapper.emitted('update:open')).toBeDefined();
      expect(wrapper.emitted('update:open')[0]).toEqual([false]);
    });

    it('does not emit "opened" when enter transition completes', async () => {
      await wrapper.vm.onEnterTransitionComplete();
      expect(wrapper.emitted('opened')).toBeUndefined();
    });

    it('emits "opened" and respects open prop when enter transition completes and not unmounting', async () => {
      wrapper.vm._isUnmounting = false;
      await wrapper.vm.onEnterTransitionComplete();
      expect(wrapper.emitted('opened')).toBeDefined();
      expect(wrapper.emitted('opened')[0][0]).toBe(true);
      // uncontrolled (open === null): update:open is not emitted
      expect(wrapper.emitted('update:open')).toBeUndefined();
      // controlled (open !== null): update:open is emitted
      await wrapper.setProps({ open: false });
      await wrapper.vm.onEnterTransitionComplete();
      expect(wrapper.emitted('update:open')).toBeDefined();
      expect(wrapper.emitted('update:open')[0]).toEqual([true]);
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
          const scrim = dialogEl.querySelector('.d-modal--transparent');

          expect(scrim.parentElement).toBe(dialogEl);
          expect(localWrapper.vm.tip.popper.parentElement).toBe(dialogEl);

          localWrapper.unmount();
          document.body.removeChild(dialogEl);
        });
      });

      describe('when appendTo is "body" (default) and anchor is NOT inside a <dialog>', () => {
        it('places the scrim in document.body, matching the content target', async () => {
          const localWrapper = await mountModalPopover({}, document.body);
          const scrim = document.body.querySelector('.d-modal--transparent');

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
          const scrim = container.querySelector('.d-modal--transparent');

          expect(scrim.parentElement).toBe(localWrapper.vm.anchorEl.parentElement);

          localWrapper.unmount();
          document.body.removeChild(container);
        });
      });

      describe('when appendTo is "root"', () => {
        it('places the scrim in window.parent.document.body when same-origin', async () => {
          const localWrapper = await mountModalPopover({ appendTo: 'root' }, document.body);
          const scrim = document.body.querySelector('.d-modal--transparent');

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

          const localWrapper = await mountModalPopover({ appendTo: 'root' }, document.body);
          const scrim = document.body.querySelector('.d-modal--transparent');

          expect(scrim.parentElement).toBe(localWrapper.vm.anchorEl.parentElement);

          localWrapper.unmount();
          Object.defineProperty(window, 'parent', originalParentDescriptor);
        });
      });

      describe('when appendTo is an explicit HTMLElement', () => {
        it('places the scrim in that element, matching the content target', async () => {
          const customTarget = document.createElement('div');
          document.body.appendChild(customTarget);

          const localWrapper = await mountModalPopover({ appendTo: customTarget }, document.body);
          const scrim = customTarget.querySelector('.d-modal--transparent');

          expect(scrim.parentElement).toBe(customTarget);
          expect(localWrapper.vm.tip.popper.parentElement).toBe(customTarget);

          localWrapper.unmount();
          document.body.removeChild(customTarget);
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
