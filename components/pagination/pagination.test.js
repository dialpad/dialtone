import { mount } from '@vue/test-utils';
import DtPagination from './pagination.vue';
import { DtButton } from '@/components/button';

// Constants
const getPageNumberAriaLabel = (page) => {
  return `Page number ${page}`;
};

const baseProps = {
  totalPages: 5,
  prevAriaLabel: 'previous',
  nextAriaLabel: 'next',
  ariaLabel: 'pagination',
  pageNumberAriaLabel: getPageNumberAriaLabel,
};

describe('DtPagination Tests', () => {
  // Wrappers
  let wrapper;
  let prev;
  let next;
  let separators;
  let pages;

  // Environment
  let props = baseProps;
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
      props,
      slots,
      listeners,
    });
    _setChildWrappers();
  };

  // Teardown
  afterEach(() => {
    props = baseProps;
    slots = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      beforeEach(() => {
        _setWrappers();
      });
      it(
        'should not render separator',
        () => { expect(separators.length).toBe(0); },
      );
      it(
        'should render the component',
        () => { expect(wrapper.exists()).toBe(true); },
      );
      it(
        'should render prev button',
        () => { expect(prev.exists()).toBeTruthy(); },
      );
      it(
        'should disable prev button',
        () => { expect(prev.element.disabled).toBe(true); },
      );
      it(
        'should render next button',
        () => { expect(next.exists()).toBeTruthy(); },
      );
      it(
        'should enable next button',
        () => { expect(next.element.disabled).toBe(false); },
      );
      it('prev button should have aria-label', () => {
        expect(prev.attributes('aria-label')).toEqual('previous');
      });
      it('next button should have aria-label', () => {
        expect(next.attributes('aria-label')).toEqual('next');
      });
      it('first page should have aria-label', () => {
        expect(pages.at(1).attributes('aria-label')).toEqual('Page number 1');
      });
    });

    describe('When rendered with active page', () => {
      beforeEach(async () => {
        props = {
          ...baseProps,
          totalPages: 10,
          activePage: 9,
        };
        await _setWrappers();
      });
      it('should render one separators', () => {
        expect(separators.length).toBe(1);
      });
    });

    describe('When rendered with more pages', () => {
      beforeEach(async () => {
        props = {
          ...baseProps,
          totalPages: 15,
          activePage: 7,
          maxVisible: 7,

        };
        await _setWrappers();
      });
      it('should render two separators', () => {
        expect(separators.length).toBe(2);
        // case when maxVisible is even - we round to the nearest odd when active page is in the mid-range
        expect(pages.length).toBe(9);
      });
    });

    describe('When maxVisible is even', () => {
      beforeEach(async () => {
        props = {
          ...baseProps,
          totalPages: 15,
          activePage: 7,
          maxVisible: 6,
        };
        await _setWrappers();
      });
      it(
        'should render less than maxVisible when active page is in mid range',
        () => {
          expect(pages.length).toBe(7);
        },
      );
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      _setWrappers();
    });

    describe('When next button is clicked', () => {
      beforeEach(async () => {
        await next.trigger('click');
      });
      it('should emit change event', () => {
        expect('change' in wrapper.emitted()).toBeTruthy();
      });
      it(
        'should enable prev button',
        () => { expect(prev.element.disabled).toBe(false); },
      );
      it(
        'should update page value',
        () => { expect(wrapper.vm.currentPage).toEqual(2); },
      );
      it('should disable prev button and update page', async () => {
        await prev.trigger('click');
        expect('change' in wrapper.emitted()).toBeTruthy();
        expect(prev.element.disabled).toBe(true);
        expect(wrapper.vm.currentPage).toEqual(1);
      });
    });
  });
});
