import { DtModal, MODAL_BANNER_KINDS } from '@/components/Modal';
import { mount } from '@vue/test-utils';
import { DtFocustrapDirective } from '@/directives/focustrap_directive';
import { flushPromises } from '@/common/utils';

const SYNC_EVENT_NAME = 'update:open';

const MOCK_MODAL_COPY = 'test modal copy';
const MOCK_MODAL_HEADER_TEXT = 'test modal header text';
const MOCK_MODAL_BANNER = 'test modal banner';
const MOCK_MODAL_DEFAULT_SLOT = 'test content';
const MOCK_MODAL_HEADER_SLOT = 'test header';
const MOCK_MODAL_BANNER_SLOT = 'title';

const baseProps = {
  headerText: MOCK_MODAL_HEADER_TEXT,
  copy: MOCK_MODAL_COPY,
  bannerHeaderText: MOCK_MODAL_BANNER,
  open: true,
};

const baseSlots = {};

let mockProps = {};
let mockSlots = {};

// Mock native <dialog> methods not supported in JSDOM
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function () {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function () {
    this.removeAttribute('open');
  });
});

afterAll(() => {
  delete HTMLDialogElement.prototype.showModal;
  delete HTMLDialogElement.prototype.close;
});

describe('DtModal Tests', () => {
  let wrapper;
  let closeBtn;
  let srOnlyCloseBtn;
  let copy;
  let overlay;
  let title;
  let banner;

  const updateWrapper = () => {
    wrapper = mount(DtModal, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        plugins: [DtFocustrapDirective],
      },
      attachTo: document.body,
    });

    closeBtn = wrapper.find('[data-qa="dt-modal-close-button"]');
    srOnlyCloseBtn = wrapper.find('[data-qa="dt-sr-only-close-button"]');
    copy = wrapper.find('[data-qa="dt-modal-copy"]');
    overlay = wrapper.find('[data-qa="dt-modal"]');
    title = wrapper.find('[data-qa="dt-modal-title"]');
    banner = wrapper.find('[data-qa="dt-modal-banner"]');
  };

  beforeEach(() => {
    vi.clearAllMocks();
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    wrapper.unmount();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render using a native dialog element', () => {
      expect(overlay.element.tagName).toBe('DIALOG');
    });

    it('should render the header text content', () => {
      expect(title.exists()).toBe(true);
      expect(title.text()).toEqual(MOCK_MODAL_HEADER_TEXT);
    });

    it('should render the banner content', () => {
      expect(banner.exists()).toBe(true);
      expect(banner.text()).toEqual(MOCK_MODAL_BANNER);
    });

    it('should render the copy content', () => {
      expect(copy.exists()).toBe(true);
      expect(copy.text()).toEqual(MOCK_MODAL_COPY);
    });

    it('Close button is visible by default', () => {
      expect(closeBtn.exists()).toBe(true);
    });

    it('Should NOT contain a visually hidden close button', () => {
      expect(srOnlyCloseBtn.exists()).toBe(false);
    });

    it('Should set default banner kind when no kind is set', async () => {
      expect(banner.classes(MODAL_BANNER_KINDS[DtModal.props.bannerKind.default])).toBe(true);
    });

    it('Should call showModal when show is true', () => {
      expect(overlay.element.showModal).toHaveBeenCalled();
    });

    describe('When showClose prop is false', () => {
      beforeEach(async () => {
        mockProps = { ...mockProps, showClose: false };

        updateWrapper();
      });

      it('Should hide close button', () => {
        expect(closeBtn.exists()).toBe(false);
      });

      it('Should contain a visually hidden close button', () => {
        expect(srOnlyCloseBtn.exists()).toBe(true);
      });
    });

    describe('When slots are provided', () => {
      it('Should display slotted header instead of headerText', () => {
        mockSlots = {
          header: MOCK_MODAL_HEADER_SLOT,
        };

        updateWrapper();

        expect(title.text()).toEqual(MOCK_MODAL_HEADER_SLOT);
      });

      it('Should display slotted banner instead of bannerHeaderText', () => {
        mockSlots = {
          banner: MOCK_MODAL_BANNER_SLOT,
        };

        updateWrapper();

        expect(banner.text()).toEqual(MOCK_MODAL_BANNER_SLOT);
      });

      it('Should display slotted content instead of copy', () => {
        mockSlots = {
          default: MOCK_MODAL_DEFAULT_SLOT,
        };

        updateWrapper();

        expect(copy.text()).toEqual(MOCK_MODAL_DEFAULT_SLOT);
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('Should emit a sync-able update event when overlay is clicked', async () => {
      expect(wrapper.emitted(SYNC_EVENT_NAME)).toBeFalsy();

      await overlay.trigger('click');

      expect(wrapper.emitted()[SYNC_EVENT_NAME].length).toBe(1);
      expect(wrapper.emitted()[SYNC_EVENT_NAME][0][0]).toBe(false);
    });

    it('Should emit a sync-able update event when close-icon is clicked', async () => {
      expect(wrapper.emitted(SYNC_EVENT_NAME)).toBeFalsy();

      await closeBtn.trigger('click');

      expect(wrapper.emitted()[SYNC_EVENT_NAME].length).toBe(1);
      expect(wrapper.emitted()[SYNC_EVENT_NAME][0][0]).toBe(false);
    });

    it('Should emit a sync-able update event when cancel event fires (escape key)', async () => {
      expect(wrapper.emitted(SYNC_EVENT_NAME)).toBeFalsy();

      await overlay.trigger('cancel');

      expect(wrapper.emitted()[SYNC_EVENT_NAME].length).toBe(1);
      expect(wrapper.emitted()[SYNC_EVENT_NAME][0][0]).toBe(false);
    });

    it('Should emit keydown event to parent', async () => {
      await overlay.trigger('keydown', { code: 'Escape' });

      expect(wrapper.emitted().keydown).toBeTruthy();
    });
  });

  describe('Focus trapping', () => {
    beforeEach(() => {
      mockSlots = {
        default: '<button data-qa="modal-trap-a">a</button><button data-qa="modal-trap-b">b</button>',
      };

      updateWrapper();
    });

    it('keeps focus trapped inside the open dialog (Tab wraps from last to first)', async () => {
      await flushPromises();

      const focusables = [
        ...overlay.element.querySelectorAll('button,[href],input,select,textarea,details,[tabindex]'),
      ];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      last.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      overlay.element.dispatchEvent(tabEvent);

      // v-dt-focustrap wraps focus at the boundary and prevents Tab from escaping the dialog.
      expect(tabEvent.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(first);
    });
  });

  describe('Extendability Tests', () => {
    it('Should pass content class through to root modal element', async () => {
      const modalClass = 'modal-class';

      expect(overlay.classes(modalClass)).toBe(false);

      await wrapper.setProps({ modalClass });

      expect(overlay.classes(modalClass)).toBe(true);
    });

    it('Should not apply transparent-backdrop modifier by default', () => {
      expect(overlay.classes('d-modal--transparent-backdrop')).toBe(false);
    });

    it('Should apply transparent-backdrop modifier when transparentBackdrop is true', async () => {
      await wrapper.setProps({ transparentBackdrop: true });

      expect(overlay.classes('d-modal--transparent-backdrop')).toBe(true);
    });

    it('Should pass content class through to content modal element', async () => {
      const contentClass = 'content-class';

      expect(copy.classes(contentClass)).toBe(false);

      await wrapper.setProps({ contentClass });

      expect(copy.classes(contentClass)).toBe(true);
    });

    it('Should apply banner class', async () => {
      const bannerClass = 'banner-class';
      const bannerHeaderText = 'title';

      await wrapper.setProps({
        open: true,
        bannerHeaderText,
        bannerClass,
      });

      banner = wrapper.find('[data-qa="dt-modal-banner"]');

      expect(banner.classes(bannerClass)).toBe(true);
    });

    it('Should apply header class to the header text element', async () => {
      const headerClass = 'header-class';

      expect(title.classes(headerClass)).toBe(false);

      await wrapper.setProps({ headerClass });

      expect(title.classes(headerClass)).toBe(true);
    });

    it('Should apply banner kind', async () => {
      await wrapper.setProps({
        open: true,
        bannerKind: 'info',
        bannerHeaderText: 'title',
      });

      banner = wrapper.find('[data-qa="dt-modal-banner"]');

      expect(banner.classes(MODAL_BANNER_KINDS.info)).toBe(true);
    });

    it('Should apply critical banner kind', async () => {
      await wrapper.setProps({
        show: true,
        bannerKind: 'critical',
        bannerHeaderText: 'title',
      });

      banner = wrapper.find('[data-qa="dt-modal-banner"]');

      expect(banner.classes(MODAL_BANNER_KINDS.critical)).toBe(true);
    });

    it('should set data-dt-mode on dialog when contentMode is set', () => {
      document.documentElement.setAttribute('data-dt-mode', 'light');
      mockProps = { contentMode: 'dark' };
      updateWrapper();

      const modal = wrapper.find('[data-qa="dt-modal"]');
      expect(modal.attributes('data-dt-mode')).toBe('dark');

      document.documentElement.removeAttribute('data-dt-mode');
    });

    describe('When rendered inside a shadow root', () => {
      let shadowHost;
      let shadowRoot;
      let mountPoint;

      beforeEach(async () => {
        shadowHost = document.createElement('div');
        document.body.appendChild(shadowHost);
        shadowRoot = shadowHost.attachShadow({ mode: 'open' });

        mountPoint = document.createElement('div');
        shadowRoot.appendChild(mountPoint);

        wrapper = mount(DtModal, {
          props: { ...baseProps, ...mockProps },
          global: {
            plugins: [DtFocustrapDirective],
          },
          attachTo: mountPoint,
        });

        await wrapper.vm.$nextTick();
      });

      afterEach(() => {
        wrapper.unmount();
        shadowHost.remove();
      });

      it('should teleport the dialog into the shadow root', () => {
        const dialog = shadowRoot.querySelector('[data-qa="dt-modal"]');
        expect(dialog).not.toBeNull();
      });

      it('should not teleport into shadow root when appendTo prop is provided', async () => {
        const target = document.createElement('div');
        document.body.appendChild(target);
        target.id = 'custom-target';

        wrapper.unmount();
        wrapper = mount(DtModal, {
          props: { ...baseProps, appendTo: '#custom-target' },
          global: {
            plugins: [DtFocustrapDirective],
          },
          attachTo: mountPoint,
        });

        await wrapper.vm.$nextTick();

        expect(shadowRoot.querySelector('[data-qa="dt-modal"]')).toBeNull();
        expect(target.querySelector('[data-qa="dt-modal"]')).not.toBeNull();

        target.remove();
      });
    });
  });
});
