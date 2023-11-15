import { DtButton } from '@/components/button';
import { DtModal, MODAL_BANNER_KINDS } from '@/components/modal';
import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';

let MOCK_CONSOLE_ERROR_SPY;

const baseProps = {
  closeButtonProps: {
    ariaLabel: 'test close aria label',
  },
  visuallyHiddenCloseLabel: 'Close modal',
};

const baseStubs = {
  DtButton,
  transition: false,
};

const baseSlots = {};

let mockSlots = {};
let mockStubs = {};
let mockProps = {};
const testContext = {};

describe('DtModal Tests', () => {
  let wrapper;
  let closeBtn;
  let copy;
  let overlay;
  let title;
  let banner;

  const updateWrapper = () => {
    wrapper = shallowMount(DtModal, {
      propsData: { ...baseProps, ...mockProps },
      stubs: { ...baseStubs, ...mockStubs },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    closeBtn = wrapper.findComponent(DtButton);
    copy = wrapper.find('[data-qa="dt-modal-copy"]');
    overlay = wrapper.find('[data-qa="dt-modal"]');
    title = wrapper.find('[data-qa="dt-modal-title"]');
    banner = wrapper.find('[data-qa="dt-modal-banner"]');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockStubs = {};
    mockSlots = {};
    mockProps = {};
  });

  it('Should display title, banner and copy text based on props', async () => {
    expect(copy.exists()).toBeTruthy();
    expect(title.exists()).toBeTruthy();

    const newCopy = 'test modal copy';
    const newTitle = 'test modal title';
    const newBanner = 'test modal banner';

    await wrapper.setProps({
      show: true,
      title: newTitle,
      bannerTitle: newBanner,
      copy: newCopy,
    });

    overlay = wrapper.find('[data-qa="dt-modal"]');
    title = wrapper.find('[data-qa="dt-modal-title"]');
    banner = wrapper.find('[data-qa="dt-modal-banner"]');

    expect(copy.text()).toEqual(newCopy);
    expect(title.text()).toEqual(newTitle);
    expect(banner.text()).toEqual(newBanner);
  });

  it('Close button is visible by default', () => {
    expect(closeBtn.exists()).toBe(true);
  });

  describe('When hideClose prop is true', () => {
    beforeEach(async () => {
      MOCK_CONSOLE_ERROR_SPY = vi.spyOn(console, 'error').mockClear();

      await wrapper.setProps({ hideClose: true });
    });

    afterEach(() => {
      MOCK_CONSOLE_ERROR_SPY = null;

      console.error.mockRestore();
    });

    it('Should hide close button', () => {
      expect(closeBtn.exists()).toBe(false);
    });

    it('should raise a validation error', () => {
      const message = `If hideClose prop is true, visuallyHiddenClose and visuallyHiddenCloseLabel props
        need to be set so the component always includes a close button`;

      expect(MOCK_CONSOLE_ERROR_SPY).toHaveBeenCalledWith(message);
    });
  });

  it('Should display slotted header, banner and content instead of title, bannerTitle and copy', () => {
    const contentText = 'test content';
    const headerText = 'test header';
    const bannerText = 'title';

    mockProps = {
      show: true,
      copy: 'non-slot copy',
      title: 'non-slot title',
      bannerTitle: 'non-slot banner',
    };

    mockSlots = {
      default: `<p>${contentText}</p>`,
      header: `<h1>${headerText}</h1>`,
      banner: `<p>${bannerText}</p>`,
    };

    updateWrapper();

    copy = wrapper.find('[data-qa="dt-modal-copy"]');
    title = wrapper.find('[data-qa="dt-modal-title"]');
    banner = wrapper.find('[data-qa="dt-modal-banner"]');

    expect(copy.text()).toEqual(contentText);
    expect(title.text()).toEqual(headerText);
    expect(banner.text()).toEqual(bannerText);
  });

  it('Should set the aria-label on the close button', async () => {
    const labelProp = 'aria-label';
    const newAriaLabel = 'NEW test close aria label';

    expect(closeBtn.attributes(labelProp)).toEqual(baseProps.closeButtonProps.ariaLabel);

    await wrapper.setProps({ closeButtonProps: { ariaLabel: newAriaLabel } });

    closeBtn = wrapper.findComponent(DtButton);

    expect(closeBtn.attributes(labelProp)).toEqual(newAriaLabel);
  });

  // eslint-disable-next-line max-len
  it('Should emit a sync-able update event when overlay / close-icon are clicked, or escape key is pressed', async () => {
    const mountWrapper = mount(DtModal, {
      propsData: { ...baseProps, ...{ show: true } },
      stubs: { ...baseStubs, ...mockStubs },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    const mountOverlay = mountWrapper.find('[data-qa="dt-modal"]');
    const mountCloseBtn = mountWrapper.findComponent(DtButton);

    const syncEvent = 'update:show';
    expect(mountWrapper.emitted()).toEqual({});

    await mountOverlay.trigger('click');

    expect(mountWrapper.emitted()[syncEvent].length).toBe(1);
    expect(mountWrapper.emitted()[syncEvent][0][0]).toBe(false);

    await mountOverlay.trigger('keydown', { code: 'Escape' });

    expect(mountWrapper.emitted()[syncEvent].length).toBe(2);
    expect(mountWrapper.emitted()[syncEvent][1][0]).toBe(false);

    await mountCloseBtn.trigger('click');

    expect(mountWrapper.emitted()[syncEvent].length).toBe(3);
    expect(mountWrapper.emitted()[syncEvent][2][0]).toBe(false);
  });

  it('Should pass content class through to root modal element', async () => {
    const modalClass = 'modal-class';

    expect(overlay.classes(modalClass)).toBe(false);

    await wrapper.setProps({ modalClass });

    expect(overlay.classes(modalClass)).toBe(true);
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

  it('Should set default banner kind when no kind is set', async () => {
    await wrapper.setProps({
      show: true,
      bannerTitle: 'title',
    });

    banner = wrapper.find('[data-qa="dt-modal-banner"]');

    expect(banner.classes(MODAL_BANNER_KINDS[DtModal.props.bannerKind.default])).toBe(true);
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

  it('Should pass content class through to content modal element', async () => {
    const contentClass = 'content-class';

    expect(copy.classes(contentClass)).toBe(false);

    await wrapper.setProps({ contentClass });

    expect(copy.classes(contentClass)).toBe(true);
  });

  it('Should NOT contain a visually hidden close button', () => {
    const buttonExists = wrapper.findComponent(SrOnlyCloseButton).exists();

    expect(!buttonExists).toBe(true);
  });

  describe('When visuallyHiddenClose is true', () => {
    it('should contain a visually hidden close button', async () => {
      await wrapper.setProps({ visuallyHiddenClose: true });

      const buttonExists = wrapper.findComponent(SrOnlyCloseButton).exists();

      expect(buttonExists).toBe(true);
    });

    describe('When visuallyHiddenCloseLabel is null and hideClose is true', () => {
      it('should raise a validation error', async () => {
        const message = `If hideClose prop is true, visuallyHiddenClose and visuallyHiddenCloseLabel props
        need to be set so the component always includes a close button`;

        MOCK_CONSOLE_ERROR_SPY = vi.spyOn(console, 'error').mockClear();

        await wrapper.setProps({ hideClose: true });
        await wrapper.setProps({ visuallyHiddenCloseLabel: null });

        expect(MOCK_CONSOLE_ERROR_SPY).toHaveBeenCalledWith(message);

        MOCK_CONSOLE_ERROR_SPY = null;

        console.error.mockRestore();
      });
    });
  });
});
