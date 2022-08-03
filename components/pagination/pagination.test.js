import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtPagination from './pagination.vue';
import { DtButton } from '@';

// Constants
const getPageNumberAriaLabel = (page) => {
  return `Page number ${page}`;
};

const basePropsData = {
  totalPages: 5,
  prevAriaLabel: 'previous',
  nextAriaLabel: 'next',
  ariaLabel: 'pagination',
  pageNumberAriaLabel: getPageNumberAriaLabel,
};

describe('DtPagination Tests', function () {
  // Wrappers
  let wrapper;
  let prev;
  let next;
  let separators;
  let pages;

  // Environment
  let propsData = basePropsData;
  let slots = {};
  let listeners;

  // Helpers
  const _setChildWrappers = () => {
    prev = wrapper.find('[data-qa="dt-pagination-prev"]');
    next = wrapper.find('[data-qa="dt-pagination-next"]');
    separators = wrapper.findAll('[data-qa="dt-pagination-separator"]');
    pages = wrapper.findAllComponents(DtButton);
  };

  const _setWrappers = () => {
    wrapper = mount(DtPagination, {
      propsData,
      slots,
      listeners,
    });
    _setChildWrappers();
  };

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    slots = {};
  });

  describe('Presentation Tests', function () {
    describe('When rendered with default props', function () {
      beforeEach(function () {
        _setWrappers();
      });
      it('should not render separator', function () { assert.lengthOf(separators, 0); });
      it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
      it('should render prev button', function () { assert.exists(prev, 'previous button exists'); });
      it('should disable prev button', function () { assert.strictEqual(prev.element.disabled, true); });
      it('should render next button', function () { assert.exists(next, 'next button exists'); });
      it('should enable next button', function () { assert.strictEqual(next.element.disabled, false); });
      it('prev button should have aria-label', function () {
        assert.equal(prev.attributes('aria-label'), 'previous');
      });
      it('next button should have aria-label', function () {
        assert.equal(next.attributes('aria-label'), 'next');
      });
      it('first page should have aria-label', function () {
        assert.equal(pages.at(1).attributes('aria-label'), 'Page number 1');
      });
    });

    describe('When rendered with active page', function () {
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          totalPages: 10,
          activePage: 9,
        };
        await _setWrappers();
      });
      it('should render one separators', function () {
        assert.exists(separators, 'separators exists');
        assert.strictEqual(separators.length, 1);
      });
    });

    describe('When rendered with more pages', function () {
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          totalPages: 15,
          activePage: 7,
          maxVisible: 7,

        };
        await _setWrappers();
      });
      it('should render two separators', function () {
        assert.exists(separators, 'separators exists');
        assert.lengthOf(separators, 2);
        // case when maxVisible is even - we round to the nearest odd when active page is in the mid-range
        assert.lengthOf(pages, 9);
      });
    });

    describe('When maxVisible is even', function () {
      beforeEach(async function () {
        propsData = {
          ...basePropsData,
          totalPages: 15,
          activePage: 7,
          maxVisible: 6,
        };
        await _setWrappers();
      });
      it('should render less than maxVisible when active page is in mid range', function () {
        assert.lengthOf(pages, 7);
      });
    });
  });

  describe('Interactivity Tests', function () {
    beforeEach(function () {
      _setWrappers();
    });

    describe('When next button is clicked', function () {
      beforeEach(async function () {
        await next.trigger('click');
      });
      it('should emit change event', function () {
        assert.property(wrapper.emitted(), 'change');
      });
      it('should enable prev button', function () { assert.strictEqual(prev.element.disabled, false); });
      it('should update page value', function () { assert.equal(wrapper.vm.currentPage, 2); });
      it('should disable prev button and update page', async function () {
        await prev.trigger('click');
        assert.property(wrapper.emitted(), 'change');
        assert.strictEqual(prev.element.disabled, true);
        assert.equal(wrapper.vm.currentPage, 1);
      });
    });
  });
});
