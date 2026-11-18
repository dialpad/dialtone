import { render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { DtPagination, type DtPaginationProps } from './Pagination';

const MOCK_LOCALIZED_FIRST_PAGE = 'First page';
const MOCK_LOCALIZED_NEXT_PAGE = 'Next page';
const MOCK_LOCALIZED_FIRST_PAGE_NUMBER = 'Page number ⁨1⁩';

const baseProps: DtPaginationProps = {
  totalPages: 5,
  ariaLabel: 'pagination',
};

let mockProps: Partial<DtPaginationProps> = {};

describe('DtPagination Tests', () => {
  let wrapper: RenderResult | undefined;

  // Vue's `updateWrapper` mounts again with the props the test set, so a test replaces the earlier render.
  const updateWrapper = () => {
    wrapper?.unmount();
    wrapper = render(<DtPagination {...baseProps} {...mockProps} />);
  };

  const getPrev = () => screen.getByTestId('dt-pagination-prev') as HTMLButtonElement;
  const getNext = () => screen.getByTestId('dt-pagination-next') as HTMLButtonElement;
  const getSeparators = () => screen.queryAllByTestId('dt-pagination-separator');
  // Vue's `findAllComponents(DtButton)`: the prev button, one per page, the next button.
  const getPages = () => screen.getAllByRole('button');

  beforeEach(() => {
    mockProps = {};
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    wrapper = undefined;
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('should not render separator', () => {
        expect(getSeparators()).toHaveLength(0);
      });

      it('should render the component', () => {
        expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
      });

      it('should render prev button', () => {
        expect(getPrev()).toBeInTheDocument();
      });

      it('should disable prev button', () => {
        expect(getPrev().disabled).toBe(true);
      });

      it('should render next button', () => {
        expect(getNext()).toBeInTheDocument();
      });

      it('should enable next button', () => {
        expect(getNext().disabled).toBe(false);
      });

      it('prev button should have aria-label', () => {
        expect(getPrev()).toHaveAttribute('aria-label', MOCK_LOCALIZED_FIRST_PAGE);
      });

      it('next button should have aria-label', () => {
        expect(getNext()).toHaveAttribute('aria-label', MOCK_LOCALIZED_NEXT_PAGE);
      });

      it('first page should have aria-label', () => {
        expect(getPages()[1]).toHaveAttribute('aria-label', MOCK_LOCALIZED_FIRST_PAGE_NUMBER);
      });
    });

    describe('When rendered with active page', () => {
      it('should render one separators', () => {
        mockProps = {
          totalPages: 10,
          activePage: 9,
        };

        updateWrapper();

        expect(getSeparators()).toHaveLength(1);
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

        expect(getSeparators()).toHaveLength(2);
        // case when maxVisible is even - we round to the nearest odd when active page is in the mid-range
        expect(getPages()).toHaveLength(9);
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

        expect(getPages()).toHaveLength(7);
      });
    });

    describe('When showEdges is false', () => {
      it('shouldn\'t render hidden pages which are the first and last when in middle', () => {
        mockProps = {
          totalPages: 15,
          activePage: 7,
          maxVisible: 5,
          showEdges: false,
        };

        updateWrapper();

        expect(getPages()).toHaveLength(7);
        expect(getPages()[1]).toHaveTextContent('5');
        expect(getPages()[5]).toHaveTextContent('9');
      });

      it('shouldn\'t render hidden pages which is the last page when at start', () => {
        mockProps = {
          totalPages: 15,
          activePage: 1,
          maxVisible: 5,
          showEdges: false,
        };

        updateWrapper();

        expect(getPages()).toHaveLength(7);
        // Numbered pages only: the first and last buttons are prev/next.
        const numbered = getPages().slice(1, -1).map(button => button.textContent);
        expect(numbered).toHaveLength(5);
        expect(numbered).not.toContain('15');
      });

      it('shouldn\'t render hidden pages which is the first page when at end', () => {
        mockProps = {
          totalPages: 15,
          activePage: 14,
          maxVisible: 5,
          showEdges: false,
        };

        updateWrapper();

        expect(getPages()).toHaveLength(7);
        const numbered = getPages().slice(1, -1).map(button => button.textContent);
        expect(numbered).toHaveLength(5);
        expect(numbered).not.toContain('1');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When next button is clicked', () => {
      const onPageChange = vi.fn();

      beforeEach(async () => {
        onPageChange.mockClear();
        mockProps = { onPageChange };
        updateWrapper();
        await userEvent.click(getNext());
      });

      it('should emit change event', () => {
        expect(onPageChange).toHaveBeenCalledWith(2);
      });

      it('should enable prev button', () => {
        expect(getPrev().disabled).toBe(false);
      });

      // Vue reads `wrapper.vm.currentPage`; the current page shows as the one primary button.
      it('should update page value', () => {
        expect(screen.getByRole('button', { name: 'Page number ⁨2⁩' })).toHaveClass('d-btn--primary');
        expect(screen.getByRole('button', { name: MOCK_LOCALIZED_FIRST_PAGE_NUMBER }))
          .not.toHaveClass('d-btn--primary');
      });

      it('should disable prev button and update page', async () => {
        await userEvent.click(getPrev());

        expect(onPageChange).toHaveBeenCalledTimes(2);
        expect(onPageChange).toHaveBeenLastCalledWith(1);
        expect(getPrev().disabled).toBe(true);
        expect(screen.getByRole('button', { name: MOCK_LOCALIZED_FIRST_PAGE_NUMBER })).toHaveClass('d-btn--primary');
      });
    });
  });

  describe('React-only Tests', () => {
    it('should follow activePage when it changes', () => {
      const { rerender } = wrapper!;
      rerender(<DtPagination {...baseProps} activePage={3} />);

      expect(screen.getByRole('button', { name: 'Page number ⁨3⁩' })).toHaveClass('d-btn--primary');
    });

    it('should clamp the current page when totalPages drops below it', () => {
      mockProps = { totalPages: 10, activePage: 9 };
      updateWrapper();
      wrapper!.rerender(<DtPagination {...baseProps} totalPages={4} activePage={9} />);

      expect(getNext().disabled).toBe(true);
      expect(getNext()).toHaveAttribute('aria-label', 'Last page');
    });

    it('should hide the nav when there are no pages, and keep the consumer style otherwise', () => {
      mockProps = { totalPages: 0, style: { color: 'red' } };
      updateWrapper();
      expect(wrapper!.container.querySelector('nav')).toHaveStyle({
        display: 'none',
        color: 'rgb(255, 0, 0)',
      });
    });

    it('should pass className and attributes through to the nav', () => {
      mockProps = { className: 'custom', id: 'pg', 'data-qa': 'my-pagination' } as Partial<DtPaginationProps>;
      updateWrapper();

      const nav = screen.getByTestId('my-pagination');
      expect(nav).toHaveClass('d-pagination', 'custom');
      expect(nav).toHaveAttribute('id', 'pg');
    });
  });
});
