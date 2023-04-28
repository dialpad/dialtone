import DtButton from '../button/button.vue';
import DtModal from './modal.vue';
import { mount } from '@vue/test-utils';
import {
  itBehavesLikeVisuallyHiddenCloseButtonExists,
  itBehavesLikeVisuallyHiddenCloseLabelIsNull,
} from '@/tests/shared_examples/sr_only_close_button';
import { cleanSpy, initializeSpy, itBehavesLikeRaisesValidationError } from '@/tests/shared_examples/validation';
import { MODAL_BANNER_KINDS } from './modal_constants';

const baseProps = {
  show: true,
  closeButtonProps: {
    ariaLabel: 'test close aria label',
  },
  visuallyHiddenCloseLabel: 'Close modal',
};

describe('DtModal Tests', () => {
  let wrapper;

  let closeBtn;
  let copy;
  let overlay;
  let title;
  let banner;

  const _setChildWrappers = function () {
    closeBtn = wrapper.findComponent(DtButton);
    copy = wrapper.find('[data-qa="dt-modal-copy"]');
    overlay = wrapper.find('[data-qa="dt-modal"]');
    title = wrapper.find('[data-qa="dt-modal-title"]');
    banner = wrapper.find('[data-qa="dt-modal-banner"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtModal, {
      props: {
        ...baseProps,
      },
    });
    _setChildWrappers();
  };

  beforeEach(function () {
    _setWrappers();
  });

  it(
    'Should display title, banner and copy text based on props',
    async () => {
      expect(copy.exists()).toBeTruthy();
      expect(title.exists()).toBeTruthy();

      const newCopy = 'test modal copy';
      const newTitle = 'test modal title';
      const newBanner = 'test modal banner';
      await wrapper.setProps({
        title: newTitle,
        bannerTitle: newBanner,
        copy: newCopy,
      });
      _setChildWrappers();
      expect(copy.text()).toEqual(newCopy);
      expect(title.text()).toEqual(newTitle);
      expect(banner.text()).toEqual(newBanner);
    },
  );

  it('Close button is visible by default', async () => {
    expect(closeBtn.exists()).toBe(true);
  });

  describe('When hideClose prop is true', () => {
    const message = `If hideClose prop is true, visuallyHiddenClose and visuallyHiddenCloseLabel props
        need to be set so the component always includes a close button`;

    beforeEach(async () => {
      initializeSpy();
      await wrapper.setProps({ hideClose: true });
    });

    afterEach(() => {
      cleanSpy();
    });

    it('Should hide close button', () => {
      expect(closeBtn.exists()).toBe(false);
    });

    itBehavesLikeRaisesValidationError(message);
  });

  it(
    'Should display slotted header, banner and content instead of title, bannerTitle and copy',
    () => {
      const contentText = 'test content';
      const headerText = 'test header';
      const bannerText = 'title';

      wrapper = mount(DtModal, {
        props: {
          ...baseProps,
          copy: 'non-slot copy',
          title: 'non-slot title',
          bannerTitle: 'non-slot banner',
        },
        slots: {
          default: `<p>${contentText}</p>`,
          header: `<h1>${headerText}</h1>`,
          banner: `<p>${bannerText}</p>`,
        },
      });
      _setChildWrappers();

      expect(copy.text()).toEqual(contentText);
      expect(title.text()).toEqual(headerText);
      expect(banner.text()).toEqual(bannerText);
    },
  );

  it('Should set the aria-label on the close button', async () => {
    const labelProp = 'aria-label';
    const newAriaLabel = 'NEW test close aria label';

    expect(closeBtn.attributes(labelProp)).toEqual(baseProps.closeButtonProps.ariaLabel);
    await wrapper.setProps({ closeButtonProps: { ariaLabel: newAriaLabel } });
    _setChildWrappers();
    expect(closeBtn.attributes(labelProp)).toEqual(newAriaLabel);
  });

  it('Should emit a sync-able update event when overlay / close-icon are clicked' +
    ', or escape key is pressed', async function () {
    wrapper = mount(DtModal, {
      props: {
        ...baseProps,
      },
    });
    _setChildWrappers();

    const syncEvent = 'update:show';
    expect(wrapper.emitted()).toEqual({});

    await overlay.trigger('click');
    expect(wrapper.emitted()[syncEvent].length).toEqual(1);
    expect(wrapper.emitted()[syncEvent][0][0]).toBe(false);

    await overlay.trigger('keydown', { code: 'Escape' });
    expect(wrapper.emitted()[syncEvent].length).toEqual(2);
    expect(wrapper.emitted()[syncEvent][1][0]).toBe(false);

    await closeBtn.trigger('click');
    expect(wrapper.emitted()[syncEvent].length).toEqual(3);
    expect(wrapper.emitted()[syncEvent][2][0]).toBe(false);
  },
  );

  it(
    'Should pass content class through to root modal element',
    async () => {
      // TODO: Use a shared test case for this
      const modalClass = 'modal-class';
      expect(overlay.classes(modalClass)).toBe(false);

      await wrapper.setProps({ modalClass });
      expect(overlay.classes(modalClass)).toBe(true);
    },
  );

  it('Should apply banner class', async () => {
    const bannerClass = 'banner-class';
    const bannerTitle = 'title';

    await wrapper.setProps({
      bannerTitle,
      bannerClass,
    });

    _setChildWrappers();
    expect(banner.classes(bannerClass)).toBe(true);
  });

  it('Should set default banner kind when no kind is set', async () => {
    const bannerTitle = 'title';

    await wrapper.setProps({
      show: true,
      bannerTitle,
    });

    _setChildWrappers();
    expect(banner.classes(MODAL_BANNER_KINDS[DtModal.props.bannerKind.default])).toBe(true);
  });

  it('Should apply banner kind', async () => {
    const bannerKind = 'info';
    const bannerTitle = 'title';

    await wrapper.setProps({
      show: true,
      bannerTitle,
      bannerKind,
    });

    _setChildWrappers();
    expect(banner.classes(MODAL_BANNER_KINDS[bannerKind])).toBe(true);
  });

  it(
    'Should pass content class through to content modal element',
    async () => {
      const contentClass = 'content-class';
      expect(copy.classes(contentClass)).toBe(false);

      await wrapper.setProps({ contentClass });
      _setChildWrappers();
      expect(copy.classes(contentClass)).toBe(true);
    },
  );

  it('Should NOT contain a visually hidden close button', () => {
    itBehavesLikeVisuallyHiddenCloseButtonExists(wrapper, false);
  });

  describe('When visuallyHiddenClose is true', () => {
    beforeEach(async () => {
      await wrapper.setProps({ visuallyHiddenClose: true });
    });

    it('should contain a visually hidden close button', () => {
      itBehavesLikeVisuallyHiddenCloseButtonExists(wrapper);
    });

    describe('When visuallyHiddenCloseLabel is null', () => {
      beforeEach(async () => {
        initializeSpy();
        await wrapper.setProps({ visuallyHiddenCloseLabel: null });
      });

      afterEach(() => {
        cleanSpy();
      });

      itBehavesLikeVisuallyHiddenCloseLabelIsNull();
    });
  });
});
