import { assert } from 'chai';
import HsButton from '../button/button.vue';
import HsModal from './modal.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';

const basePropsData = {
  closeButtonProps: {
    ariaLabel: 'test close aria label',
  },
};

describe('Handset Modal Tests', function () {
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
    wrapper = shallowMount(HsModal, {
      localVue: this.localVue,
      propsData: basePropsData,
      stubs: { HsButton },
    });

    _setElements = function () {
      closeBtn = wrapper.findComponent(HsButton);
      copy = wrapper.find('[data-qa="hs-modal-copy"]');
      overlay = wrapper.find('[data-qa="hs-modal"]');
      title = wrapper.find('[data-qa="hs-modal-title"]');
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

  it('Should display slotted header and content instead of title and copy', function () {
    const contentText = 'test content';
    const headerText = 'test header';

    wrapper = shallowMount(HsModal, {
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
      stubs: { HsButton },
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
    const contentClass = 'content-class';
    assert.isFalse(overlay.classes(contentClass));

    await wrapper.setProps({ contentClass });
    assert.isTrue(overlay.classes(contentClass));
  });
});
