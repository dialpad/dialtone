import { DtModal, MODAL_BANNER_KINDS } from '@/components/modal';
import { mount } from '@vue/test-utils';

const SYNC_EVENT_NAME = 'update:show';

const MOCK_MODAL_COPY = 'test modal copy';
const MOCK_MODAL_TITLE = 'test modal title';
const MOCK_MODAL_BANNER = 'test modal banner';
const MOCK_MODAL_DEFAULT_SLOT = 'test content';
const MOCK_MODAL_HEADER_SLOT = 'test header';
const MOCK_MODAL_BANNER_SLOT = 'title';

const baseProps = {
  title: MOCK_MODAL_TITLE,
  copy: MOCK_MODAL_COPY,
  bannerTitle: MOCK_MODAL_BANNER,
  show: true,
};

const baseSlots = {};
const baseStubs = {
  // this gets around transition async problems. See https://v1.test-utils.vuejs.org/guides/common-tips.html
  transition: MOCK_TRANSITION_STUB(),
};

let mockProps = {};
let mockSlots = {};

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
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    wrapper.destroy();
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the title content', () => {
      expect(title.exists()).toBe(true);
      expect(title.text()).toEqual(MOCK_MODAL_TITLE);
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

    describe('When hideClose prop is true', () => {
      beforeEach(async () => {
        mockProps = { ...mockProps, hideClose: true };

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
      it('Should display slotted header instead of title', () => {
        mockSlots = {
          header: MOCK_MODAL_HEADER_SLOT,
        };

        updateWrapper();

        expect(title.text()).toEqual(MOCK_MODAL_HEADER_SLOT);
      });

      it('Should display slotted banner instead of bannerTitle', () => {
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

    it('Should emit a sync-able update event when escape key is pressed', async () => {
      expect(wrapper.emitted(SYNC_EVENT_NAME)).toBeFalsy();

      await overlay.trigger('keydown', { code: 'Escape' });

      expect(wrapper.emitted()[SYNC_EVENT_NAME].length).toBe(1);
      expect(wrapper.emitted()[SYNC_EVENT_NAME][0][0]).toBe(false);
    });
  });

  describe('Extendability Tests', () => {
    it('Should pass content class through to root modal element', async () => {
      const modalClass = 'modal-class';

      expect(overlay.classes(modalClass)).toBe(false);

      await wrapper.setProps({ modalClass });

      expect(overlay.classes(modalClass)).toBe(true);
    });

    it('Should pass content class through to content modal element', async () => {
      const contentClass = 'content-class';

      expect(copy.classes(contentClass)).toBe(false);

      await wrapper.setProps({ contentClass });

      expect(copy.classes(contentClass)).toBe(true);
    });

    it('Should apply banner class', async () => {
      const bannerClass = 'banner-class';
      const bannerTitle = 'title';

      await wrapper.setProps({
        show: true,
        bannerTitle,
        bannerClass,
      });

      banner = wrapper.find('[data-qa="dt-modal-banner"]');

      expect(banner.classes(bannerClass)).toBe(true);
    });

    it('Should apply banner kind', async () => {
      await wrapper.setProps({
        show: true,
        bannerKind: 'info',
        bannerTitle: 'title',
      });

      banner = wrapper.find('[data-qa="dt-modal-banner"]');

      expect(banner.classes(MODAL_BANNER_KINDS.info)).toBe(true);
    });
  });
});
