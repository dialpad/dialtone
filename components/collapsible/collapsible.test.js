import { assert } from 'chai';
import { config, mount } from '@vue/test-utils';
import DtCollapsible from './collapsible.vue';
import sinon from 'sinon';
import axe from 'axe-core';
import configA11y from '../../storybook/scripts/storybook-a11y-test.config';

const contentOnExpanded = '<div data-qa="content-on-expanded-element"> Expanded Test Text </div>';
const contentOnCollapsed = '<div data-qa="content-on-collapsed-element"> Collapsed Test Text </div>';
const anchor = '<button data-qa="anchor-element">click me</button>';

const baseProps = {
  anchorText: 'anchor text',
};

describe('Dialtone vue Collapsible Component Tests', function () {
  // Wrappers
  let wrapper;
  let contentOnExpandedElement;
  let contentOnCollapsedElement;
  let contentWrapperElement;
  let anchorElement;
  let anchorSlotElement;

  // Environment
  const defaultSlots = { contentOnExpanded, contentOnCollapsed };
  const defaultPropsData = baseProps;

  const findAllElements = () => {
    anchorElement = wrapper.find('[data-qa="dt-button"]');
    anchorSlotElement = wrapper.find('[data-qa="anchor-element"]');
    contentOnExpandedElement = wrapper.find('[data-qa="content-on-expanded-element"]');
    contentOnCollapsedElement = wrapper.find('[data-qa="content-on-collapsed-element"]');
    contentWrapperElement = wrapper.findComponent({ ref: 'contentWrapper' });
  };

  const mountWrapper = ({ propsData = defaultPropsData, slots = defaultSlots } = {}) => {
    wrapper = mount(DtCollapsible, {
      propsData,
      slots,
      attachTo: document.body,
    });
    findAllElements();
  };

  before(function () {
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
    config.renderStubDefaultSlot = true;
  });

  beforeEach(function () {
    mountWrapper();
  });

  after(function () {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
    config.renderStubDefaultSlot = false;
  });

  describe('Test default rendering', function () {
    it('should render the component', function () {
      assert.isTrue(wrapper.exists(), 'wrapper exists');
    });

    it('should render the anchor', function () {
      assert.isTrue(anchorElement.exists(), 'anchor exists');
    });

    it('should render the content on expanded element', function () {
      assert.isTrue(contentOnExpandedElement.exists(), 'content exists');
    });

    it('should NOT render the content on collapsed element', function () {
      assert.isFalse(contentOnCollapsedElement.exists(), 'collapsed content does not exist');
    });
  });

  describe('When scoped slot is provided for anchor', function () {
    beforeEach(function () {
      mountWrapper({
        slots: { anchor },
      });
    });

    it('should render the anchor slot', function () {
      assert.isTrue(anchorSlotElement.exists(), 'anchor slot exists');
    });
  });

  describe('When scoped slot is not provided for any content', function () {
    beforeEach(function () {
      mountWrapper({
        slots: {},
      });
    });

    it('should NOT render any content if no slot is passed', function () {
      assert.isFalse(contentOnExpandedElement.exists());
      assert.isFalse(contentOnCollapsedElement.exists());
    });
  });

  describe('Test open prop undefined', function () {
    it('content should be expanded by default', function () {
      assert.isTrue(contentOnExpandedElement.isVisible());
      assert.isFalse(contentOnCollapsedElement.exists());
    });

    describe('when user clicks anchor when it is expanded', function () {
      beforeEach(async function () {
        await anchorElement.trigger('click');
      });
      it('should be collapsed', function () {
        findAllElements();
        assert.isFalse(contentOnExpandedElement.exists());
        assert.isTrue(contentOnCollapsedElement.isVisible());
      });
      describe('when user clicks anchor when it is collapsed', function () {
        beforeEach(async function () {
          await anchorElement.trigger('click');
        });
        it('should be expanded', function () {
          findAllElements();
          assert.isTrue(contentOnExpandedElement.isVisible());
          assert.isFalse(contentOnCollapsedElement.exists());
        });
      });
    });
  });

  describe('Test open prop defined', function () {
    describe('Test open prop set to true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: true });
      });

      it('content is expanded', function () {
        assert.isTrue(contentOnExpandedElement.isVisible());
      });

      describe('clicking on anchor', function () {
        beforeEach(async function () {
          await anchorElement.trigger('click');
        });
        it('clicking does NOT collapse content', async function () {
          findAllElements();
          assert.isTrue(contentOnExpandedElement.isVisible());
          assert.isFalse(contentOnCollapsedElement.exists());
        });
      });

      describe('updating open prop', function () {
        beforeEach(async function () {
          await wrapper.setProps({ open: false });
        });
        it('updating open prop does collapse content', async function () {
          findAllElements();
          assert.isFalse(contentOnExpandedElement.exists());
          assert.isTrue(contentOnCollapsedElement.isVisible());
        });
      });
    });

    describe('Test open prop set to false', function () {
      beforeEach(async function () {
        mountWrapper({
          propsData: {
            ...baseProps,
            open: false,
          },
        });
      });

      it('content starts collapsed', function () {
        findAllElements();
        assert.isFalse(contentOnExpandedElement.exists());
        assert.isTrue(contentOnCollapsedElement.isVisible());
      });

      describe('when user clicks anchor and collapsible is closed', function () {
        beforeEach(async function () {
          await anchorElement.trigger('click');
        });
        it('clicking does NOT expand content', async function () {
          findAllElements();
          assert.isFalse(contentOnExpandedElement.exists());
          assert.isTrue(contentOnCollapsedElement.isVisible());
        });
      });

      describe('when open prop is updated', function () {
        beforeEach(async function () {
          await wrapper.setProps({ open: true });
        });
        it('updating open prop does expand content', async function () {
          findAllElements();
          assert.isTrue(contentOnExpandedElement.isVisible());
          assert.isFalse(contentOnCollapsedElement.exists());
        });
      });
    });
  });

  describe('If anchor text and anchor slot content are falsy', function () {
    let consoleErrorSpy;

    beforeEach(async function () {
      consoleErrorSpy = sinon.spy(console, 'error');
      mountWrapper({
        propsData: { ...baseProps, anchorText: undefined },
      });
    });

    afterEach(function () {
      consoleErrorSpy = null;
      console.error.restore();
    });

    it('should output error message', async function () {
      assert.isTrue(consoleErrorSpy.calledWith('anchor text and anchor slot content cannot both be falsy'));
    });
  });

  describe('Accessibility Tests', function () {
    describe('Anchor aria-label', function () {
      beforeEach(async function () {
        mountWrapper({
          propsData: {
            ...baseProps,
            ariaLabel: 'Anchor Aria Label',
          },
        });
      });
      it('should correctly set the aria-label attribute on anchor button', async function () {
        assert.equal(anchorElement.attributes('aria-label'), 'Anchor Aria Label');
      });
    });

    describe('Content wrapper `aria-hidden` property when contentOnCollapsed does not exist', function () {
      beforeEach(function () {
        mountWrapper({
          slots: { contentOnExpanded },
        });
      });
      it('should set aria-hidden to false when content expanded exists', function () {
        assert.equal(contentWrapperElement.attributes('aria-hidden'), 'false');
      });
      describe('when user clicks anchor', function () {
        beforeEach(async function () {
          await anchorElement.trigger('click');
        });
        it(`should set aria-hidden to true if
        content is collapsed and contentOnCollapsed slot is not provided `, async function () {
          findAllElements();
          assert.equal(contentWrapperElement.attributes('aria-hidden'), 'true');
        });
      });
    });

    describe('Content wrapper `aria-hidden` property when contentOnCollapsed exists', function () {
      beforeEach(function () {
        mountWrapper({
          slots: { contentOnExpanded, contentOnCollapsed },
        });
      });
      it('should set aria-hidden to false when content expanded exists', function () {
        assert.equal(contentWrapperElement.attributes('aria-hidden'), 'false');
      });
      describe('when user clicks anchor', function () {
        beforeEach(async function () {
          await anchorElement.trigger('click');
        });
        it(`should set aria-hidden to false if
        content is collapsed and and contentOnCollapsed slot is provided `, async function () {
          findAllElements();
          assert.equal(contentWrapperElement.attributes('aria-hidden'), 'false');
        });
      });
    });

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
