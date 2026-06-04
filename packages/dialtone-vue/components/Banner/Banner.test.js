import { mount } from '@vue/test-utils';
import { flushPromises } from '@/common/utils';
import { DtFocustrapDirective } from '@/directives/focustrap_directive';
import DtBanner from './Banner.vue';

const MOCK_ACTION_SLOT = '<a href="#" data-qa="banner-action">Action</a>';

const baseProps = {};
const baseSlots = {};

let mockProps = {};
let mockSlots = {};

describe('DtBanner Tests', () => {
  let wrapper;
  let banner;
  let dialog;

  const updateWrapper = () => {
    // Unmount any previous instance first: focus tests attach to document.body,
    // so leftover nodes would leak across tests.
    wrapper?.unmount();
    wrapper = mount(DtBanner, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      global: { plugins: [DtFocustrapDirective] },
      attachTo: document.body,
    });

    banner = wrapper.find('[data-qa="dt-banner"]');
    dialog = wrapper.find('[data-qa="dt-banner-dialog"]');
  };

  const actionEl = () => wrapper.find('[data-qa="banner-action"]').element;
  const closeEl = () => wrapper.find('[data-qa="dt-notice-action-close-button"]').element;

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('should render the banner and its dialog', () => {
      expect(banner.exists()).toBe(true);
      expect(dialog.exists()).toBe(true);
    });

    it('should render default slot content', () => {
      mockSlots = { default: '<p data-qa="banner-body">Body</p>' };

      updateWrapper();

      expect(wrapper.find('[data-qa="banner-body"]').text()).toBe('Body');
    });
  });

  describe('Accessibility Tests', () => {
    describe('When not important (default)', () => {
      beforeEach(() => {
        mockSlots = { action: MOCK_ACTION_SLOT };

        updateWrapper();
      });

      it('should use the status role and omit aria-modal', () => {
        expect(dialog.attributes('role')).toBe('status');
        expect(dialog.attributes('aria-modal')).toBeUndefined();
      });

      it('should not move initial focus on mount', async () => {
        await flushPromises();

        expect(banner.element.contains(document.activeElement)).toBe(false);
      });

      it('should not wrap focus on Tab (trap inactive)', async () => {
        await flushPromises();
        closeEl().focus();

        await banner.trigger('keydown', { key: 'Tab' });

        // Trap is inactive, so focus is NOT wrapped back to the first element.
        expect(document.activeElement).toBe(closeEl());
        expect(document.activeElement).not.toBe(actionEl());
      });
    });

    describe('When important', () => {
      beforeEach(async () => {
        mockProps = { important: true };
        mockSlots = { action: MOCK_ACTION_SLOT };

        updateWrapper();
        await flushPromises();
      });

      it('should use the alertdialog role and set aria-modal', () => {
        expect(dialog.attributes('role')).toBe('alertdialog');
        expect(dialog.attributes('aria-modal')).toBe('true');
      });

      it('should move initial focus to the first focusable element', () => {
        expect(document.activeElement).toBe(actionEl());
      });

      it('should wrap focus to the first element on Tab from the last', async () => {
        closeEl().focus();

        await banner.trigger('keydown', { key: 'Tab' });

        expect(document.activeElement).toBe(actionEl());
      });

      it('should wrap focus to the last element on Shift+Tab from the first', async () => {
        actionEl().focus();

        await banner.trigger('keydown', { key: 'Tab', shiftKey: true });

        expect(document.activeElement).toBe(closeEl());
      });
    });

    describe('When important is toggled on at runtime', () => {
      it('should activate the trap and move focus into the banner', async () => {
        mockSlots = { action: MOCK_ACTION_SLOT };

        updateWrapper();
        await flushPromises();
        expect(banner.element.contains(document.activeElement)).toBe(false);

        await wrapper.setProps({ important: true });
        await flushPromises();

        expect(document.activeElement).toBe(actionEl());
      });
    });

    describe('Focus restoration', () => {
      let outsideButton;

      beforeEach(() => {
        outsideButton = document.createElement('button');
        document.body.appendChild(outsideButton);
        outsideButton.focus();
      });

      afterEach(() => {
        outsideButton.remove();
      });

      it('should restore focus via the directive when an important banner unmounts', async () => {
        // showClose: false disables NoticeAction's own focus restoration, so this
        // proves the v-dt-focustrap directive (restoreFocus: true) is the restorer.
        mockProps = { important: true, showClose: false };
        mockSlots = { action: MOCK_ACTION_SLOT };

        updateWrapper();
        await flushPromises();
        // Focus has moved into the banner.
        expect(document.activeElement).toBe(actionEl());

        wrapper.unmount();
        // Null out so teardown / the next mount does not double-unmount.
        wrapper = null;

        expect(document.activeElement).toBe(outsideButton);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When the close button is clicked', () => {
      it('should emit a close event', async () => {
        await wrapper.find('[data-qa="dt-notice-action-close-button"]').trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();
      });
    });
  });
});
