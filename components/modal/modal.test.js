import { assert } from 'chai';
import DtButton from '../button/button.vue';
import DtModal from './modal.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';

const basePropsData = {
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

  let _setElements;

  before(function () {
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    wrapper = shallowMount(DtModal, {
      localVue: this.localVue,
      propsData: basePropsData,
      stubs: { DtButton },
    });

    _setElements = function () {
      closeBtn = wrapper.findComponent(DtButton);
      copy = wrapper.find('[data-qa="dt-modal-copy"]');
      overlay = wrapper.find('[data-qa="dt-modal"]');
      title = wrapper.find('[data-qa="dt-modal-title"]');
    };
    _setElements();
  });

  it('Should display title and copy text based on props', async function () {
    assert.isEmpty(copy.text());
    assert.isEmpty(title.text());

    const newCopy = 'test modal copy';
    const newTitle = 'test modal title';
    await wrapper.setProps({ title: newTitle, copy: newCopy });
    _setElements();
    assert.equal(copy.text(), newCopy);
    assert.equal(title.text(), newTitle);
  });

  it('Close button is visible by default', async function () {
    assert.isTrue(closeBtn.exists());
  });

  it('Close button is hidden if hideClose prop is true', async function () {
    await wrapper.setProps({ hideClose: true });
    assert.isFalse(closeBtn.exists());
  });

  it('Should display slotted header and content instead of title and copy', function () {
    const contentText = 'test content';
    const headerText = 'test header';

    wrapper = shallowMount(DtModal, {
      localVue: this.localVue,
      propsData: {
        ...basePropsData,
        copy: 'non-slot copy',
        title: 'non-slot title',
      },
      slots: {
        default: `<p>${contentText}</p>`,
        header: `<h1>${headerText}</h1>`,
      },
      stubs: { DtButton },
    });
    _setElements();

    assert.equal(copy.text(), contentText);
    assert.equal(title.text(), headerText);
  });

  it('Should set the aria-label on the close button', async function () {
    const labelProp = 'aria-label';
    const newAriaLabel = 'NEW test close aria label';

    assert.equal(closeBtn.attributes(labelProp), basePropsData.closeButtonProps.ariaLabel);
    await wrapper.setProps({ closeButtonProps: { ariaLabel: newAriaLabel } });
    _setElements();
    assert.equal(closeBtn.attributes(labelProp), newAriaLabel);
  });

  it('Should emit a sync-able update event when overlay / close-icon are clicked' +
     ', or escape key is pressed', async function () {
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
    assert.isTrue(overlay.classes(modalClass));
  });
});
