import { mount } from '@vue/test-utils';
import DtPagination from './pagination.vue';
import { DtButton } from '@/components/button';

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

let mockProps = {};

describe('DtPagination Tests', () => {
  let wrapper;
  let prev;
  let next;
  let separators;
  let pages;

  const updateWrapper = () => {
    wrapper = mount(DtPagination, {
      propsData: { ...baseProps, ...mockProps },
    });

    prev = wrapper.find('[data-qa="dt-pagination-prev"]');
    next = wrapper.find('[data-qa="dt-pagination-next"]');
    separators = wrapper.findAll('[data-qa="dt-pagination-separator"]');
    pages = wrapper.findAllComponents(DtButton);
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('should not render separator', () => {
        expect(separators.length).toBe(0);
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render prev button', () => {
        expect(prev.exists()).toBeTruthy();
      });

      it('should disable prev button', () => {
        expect(prev.element.disabled).toBe(true);
      });

      it('should render next button', () => {
        expect(next.exists()).toBeTruthy();
      });

      it('should enable next button', () => {
        expect(next.element.disabled).toBe(false);
      });

      it('prev button should have aria-label', () => {
        expect(prev.attributes('aria-label')).toBe('previous');
      });

      it('next button should have aria-label', () => {
        expect(next.attributes('aria-label')).toBe('next');
      });

      it('first page should have aria-label', () => {
        expect(pages.at(1).attributes('aria-label')).toBe('Page number 1');
      });
    });

    describe('When rendered with active page', () => {
      it('should render one separators', () => {
        mockProps = {
          totalPages: 10,
          activePage: 9,
        };

        updateWrapper();

        expect(separators.length).toBe(1);
      });
    });

    describe('When rendered with more pages', () => {
      it('should render two separators', () => {
        mockProps = {
          totalPages: 15,
          activePage: 7,
          maxVisible: 7,
        };

        updateWrapper();

        expect(separators.length).toBe(2);
        // case when maxVisible is even - we round to the nearest odd when active page is in the mid-range
        expect(pages.length).toBe(9);
      });
    });

    describe('When maxVisible is even', () => {
      it('should render less than maxVisible when active page is in mid range', () => {
        mockProps = {
          totalPages: 15,
          activePage: 7,
          maxVisible: 6,
        };

        updateWrapper();

        expect(pages.length).toBe(7);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When next button is clicked', () => {
      beforeEach(async () => {
        await next.trigger('click');
      });

      it('should emit change event', () => {
        expect('change' in wrapper.emitted()).toBeTruthy();
      });

      it('should enable prev button', () => {
        expect(prev.element.disabled).toBe(false);
      });

      it('should update page value', () => {
        expect(wrapper.vm.currentPage).toBe(2);
      });

      it('should disable prev button and update page', async () => {
        await prev.trigger('click');

        expect('change' in wrapper.emitted()).toBeTruthy();
        expect(prev.element.disabled).toBe(true);
        expect(wrapper.vm.currentPage).toBe(1);
      });
    });
  });
});
