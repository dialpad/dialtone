import { assert } from 'chai';
import { config, mount } from '@vue/test-utils';
import DtCollpasible from './collapsible.vue';
import sinon from 'sinon';
import axe from 'axe-core';
import configA11y from '../../storybook/scripts/storybook-a11y-test.config';

const content = '<div data-qa="content-element"> Test Text </div>';
const anchor = '<template #anchor="{ attrs }">' +
                 '<button data-qa="anchor-element" v-bind="attrs">click me</button>' +
               '</template>';

describe('Dialtone vue Collapsible Component Tests', function () {
  // Wrappers
  let wrapper;
  let contentElement;
  let contentWrapperElement;
  let anchorElement;

  // Environment
  const props = {};
  const attrs = {
    css: false, // Important attr to let test-utils fire the (after-enter and after-leave) events correctly
  };
  const slots = { anchor, content };
  // const scopedSlots = { anchor };

  const _clearChildWrappers = () => {
    contentElement = undefined;
    contentWrapperElement = undefined;
    anchorElement = undefined;
  };

  const _setChildWrappers = () => {
    anchorElement = wrapper.find('[data-qa="anchor-element"]');
    contentElement = wrapper.find('[data-qa="content-element"]');
    contentWrapperElement = wrapper.getComponent('.d-dt-collapsible__content');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtCollpasible, {
      props,
      slots,
      attrs,
      global: {
        stubs: {
          transition: false,
        },
      },
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  before(function () {
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
    config.renderStubDefaultSlot = true;
  });

  beforeEach(function () {
    _mountWrapper();
  });

  after(function () {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
    config.renderStubDefaultSlot = false;
  });

  afterEach(async function () {
    _clearChildWrappers();
    wrapper.unmount();
  });

  describe('Test default rendering', function () {
    it('should render the component', function () {
      assert.exists(wrapper, 'wrapper exists');
    });

    it('should render the anchor', function () {
      assert.exists(anchorElement, 'anchor exists');
    });

    it('should render the content', function () {
      assert.exists(contentElement, 'content exists');
    });
  });

  describe('Test open prop undefined', function () {
    it('content should be expanded by default', function () {
      assert.isTrue(contentElement.isVisible());
    });

    it('should toggle the content when clicked', async function () {
      await anchorElement.trigger('click');
      assert.isFalse(contentElement.isVisible());

      await anchorElement.trigger('click');
      assert.isTrue(contentElement.isVisible());
    });
  });

  describe('Test open prop defined', function () {
    describe('Test open prop set to true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: true });
      });

      it('content is expanded', function () {
        assert.isTrue(contentElement.isVisible());
      });

      it('clicking does not collapse content', async function () {
        await anchorElement.trigger('click');
        assert.isTrue(contentElement.isVisible());
      });

      it('updating open prop does collapse content', async function () {
        await wrapper.setProps({ open: false });
        assert.isFalse(contentElement.isVisible());
      });
    });

    describe('Test open prop set to false', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: false });
      });

      it('content starts collapsed', function () {
        assert.isFalse(contentElement.isVisible());
      });

      it('clicking does not expand content', async function () {
        await anchorElement.trigger('click');
        assert.isFalse(contentElement.isVisible());
      });

      it('updating open prop does collapse content', async function () {
        await wrapper.setProps({ open: true });
        assert.isTrue(contentElement.isVisible());
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('Content is expanded', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: true, id: 'contentId' });
      });

      it('should pass axe-core accessibility rules', async function () {
        const a11yResults = await axe.run(wrapper.element, configA11y);
        const violations = a11yResults.violations;
        if (violations.length) {
          console.log('axe-core accessibility violations:', violations);
        }
        assert.equal(violations.length, 0);
      });

      it('aria-controls on anchor should be set to the id of the contentWrapper', function () {
        assert.equal(anchorElement.attributes('aria-controls'), 'contentId');
        assert.equal(contentWrapperElement.attributes('id'), 'contentId');
      });

      it('aria-expanded should be true', function () {
        assert.equal(anchorElement.attributes('aria-expanded'), 'true');
      });
    });

    describe('Content is collapsed', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: false });
      });

      it('aria-expanded should be "false"', function () {
        assert.equal(anchorElement.attributes('aria-expanded'), 'false');
      });
    });
  });
});
