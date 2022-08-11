import { assert } from 'chai';
import DtButton from '../button/button.vue';
import DtModal from './modal.vue';
import { mount } from '@vue/test-utils';

const baseProps = {
  show: true,
  closeButtonProps: {
    ariaLabel: 'test close aria label',
  },
};

describe('Dialtone Vue Modal Tests', function () {
  let wrapper;

  let closeBtn;
  let copy;
  let overlay;
  let title;
  let banner;

  let _setElements;

  // Setup
  beforeEach(function () {
    wrapper = mount(DtModal, {
      props: {
        ...baseProps,
      },
    });

    _setElements = function () {
      closeBtn = wrapper.findComponent(DtButton);
      copy = wrapper.find('[data-qa="dt-modal-copy"]');
      overlay = wrapper.find('[data-qa="dt-modal"]');
      title = wrapper.find('[data-qa="dt-modal-title"]');
      banner = wrapper.find('[data-qa="dt-modal-banner"]');
    };
    _setElements();
  });

  it('Should display title, banner and copy text based on props', async function () {
    assert.isEmpty(copy.text());
    assert.isEmpty(title.text());

    const newCopy = 'test modal copy';
    const newTitle = 'test modal title';
    const newBanner = 'test modal banner';
    await wrapper.setProps({ title: newTitle, bannerTitle: newBanner, copy: newCopy });
    _setElements();
    assert.equal(copy.text(), newCopy);
    assert.equal(title.text(), newTitle);
    assert.equal(banner.text(), newBanner);
  });

  it('Close button is visible by default', async function () {
    assert.isTrue(closeBtn.exists());
  });

  it('Close button is hidden if hideClose prop is true', async function () {
    await wrapper.setProps({ hideClose: true });
    _setElements();
    assert.isFalse(closeBtn.exists());
  });

  it('Should display slotted header, banner and content instead of title, bannerTitle and copy', function () {
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
    _setElements();

    assert.equal(copy.text(), contentText);
    assert.equal(title.text(), headerText);
    assert.equal(banner.text(), bannerText);
  });

  it('Should set the aria-label on the close button', async function () {
    const labelProp = 'aria-label';
    const newAriaLabel = 'NEW test close aria label';

    assert.equal(closeBtn.attributes(labelProp), baseProps.closeButtonProps.ariaLabel);
    await wrapper.setProps({ closeButtonProps: { ariaLabel: newAriaLabel } });
    _setElements();
    assert.equal(closeBtn.attributes(labelProp), newAriaLabel);
  });

  it('Should emit a sync-able update event when overlay / close-icon are clicked' +
     ', or escape key is pressed', async function () {
    wrapper = mount(DtModal, {
      props: {
        ...baseProps,
      },
    });
    _setElements();

    const syncEvent = 'update:show';
    assert.isEmpty(wrapper.emitted());

    await overlay.trigger('click');
    assert.equal(wrapper.emitted()[syncEvent].length, 1);
    assert.isFalse(wrapper.emitted()[syncEvent][0][0]);

    await overlay.trigger('keydown', { key: 'Escape' });
    assert.equal(wrapper.emitted()[syncEvent].length, 2);
    assert.isFalse(wrapper.emitted()[syncEvent][1][0]);

    await closeBtn.trigger('click');
    assert.equal(wrapper.emitted()[syncEvent].length, 3);
    assert.isFalse(wrapper.emitted()[syncEvent][2][0]);
  });

  it('Should pass content class through to root modal element', async function () {
    // TODO: Use a shared test case for this
    const modalClass = 'modal-class';
    assert.isFalse(overlay.classes(modalClass));

    await wrapper.setProps({ modalClass });
    _setElements();
    assert.isTrue(overlay.classes(modalClass));
  });

  it('Should apply banner class', async function () {
    const bannerClass = 'banner-class';
    const bannerTitle = 'title';

    await wrapper.setProps({ bannerTitle, bannerClass });

    _setElements();
    assert.isTrue(banner.classes(bannerClass));
  });
});
