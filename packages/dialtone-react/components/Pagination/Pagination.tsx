import { useState, type HTMLAttributes, type Ref } from 'react';
import { cx } from '../../common/cx';
import { useI18n } from '../../common/localization';
import { DtIconChevronLeft, DtIconChevronRight, DtIconMoreHorizontal } from '../../icons';
import { DtButton } from '../Button/Button';

export interface DtPaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'aria-label'> {
  /** Descriptive label for the pagination content. */
  ariaLabel: string;

  /** The total number of the pages */
  totalPages: number;

  /**
   * The active current page in the list of pages, defaults to the first page. As in Vue, it isn't a controlled value:
   * the component keeps its own current page, which this prop resets whenever it changes.
   */
  activePage?: number;

  /**
   * Determines the max pages to be shown in the list. Using an odd number is recommended.
   * If an even number is given, then it will be rounded down to the nearest odd number to always
   * keep current page in the middle when current page is in the mid-range.
   */
  maxVisible?: number;

  /**
   * Shows the first and last page buttons when not near the edges.
   * Set to false when your backend does not support offset and you can only use cursor based pagination.
   * @values true, false
   */
  showEdges?: boolean;

  /** Page change event (Vue's `change`, renamed because its payload isn't a native change event's). */
  onPageChange?: (page: number) => void;

  ref?: Ref<HTMLElement>;
}

type PageItem = number | '...';

const range = (from: number, to: number): number[] => {
  const pages: number[] = [];
  const start = from > 0 ? from : 1;
  for (let i = start; i <= to; i++) {
    pages.push(i);
  }
  return pages;
};

const getPages = (currentPage: number, totalPages: number, maxVisible: number, showEdges: boolean): PageItem[] => {
  if (maxVisible === 0) {
    return [];
  }
  if (totalPages <= maxVisible) {
    return range(1, totalPages);
  }

  let start = maxVisible - 1;
  let end = totalPages - start + 1;

  // if showEdges is false, modify the start and end to account for the hidden edge pages
  if (!showEdges) {
    start = start + 1;
    end = end - 1;
  }

  if (currentPage < start) {
    const pages: PageItem[] = [...range(1, start), '...'];
    if (showEdges) {
      // add last page to the end
      pages.push(totalPages);
    }
    return pages;
  }

  if (currentPage > end) {
    const pages: PageItem[] = ['...', ...range(end, totalPages)];
    if (showEdges) {
      // add first page to the beginning
      pages.unshift(1);
    }
    return pages;
  }

  // rounding to the nearest odd according to the maxVisible to always show the page number in the middle.
  const total = maxVisible - (3 - maxVisible % 2);
  const centerIndex = Math.floor(total / 2);
  let left = currentPage - centerIndex;
  let right = currentPage + centerIndex;

  // if showEdges is false, modify the left and right to account for the hidden edge pages
  if (!showEdges) {
    left = left - 1;
    right = right + 1;
  }

  const pages: PageItem[] = ['...', ...range(left, right), '...'];
  if (showEdges) {
    return [1, ...pages, totalPages];
  }
  return pages;
};

/**
 * Pagination allows you to divide large amounts of content into smaller chunks across multiple pages.
 * @see https://dialtone.dialpad.com/components/pagination.html
 */
export function DtPagination ({
  ariaLabel,
  totalPages,
  activePage = 1,
  maxVisible = 5,
  showEdges = true,
  onPageChange,
  className,
  style,
  ref,
  ...rest
}: DtPaginationProps) {
  const i18n = useI18n();

  // Vue's `currentPage` data, with its two watchers: `activePage` resets it, then `totalPages` clamps it. Both are
  // derived during render from the props the last render saw, so no effect chain is needed.
  const [state, setState] = useState({ currentPage: activePage, activePage, totalPages });
  let currentPage = state.currentPage;
  if (state.activePage !== activePage || state.totalPages !== totalPages) {
    if (state.activePage !== activePage) {
      currentPage = activePage;
    }
    if (state.totalPages !== totalPages && (currentPage > totalPages || currentPage <= 0)) {
      currentPage = totalPages;
    }
    setState({ currentPage, activePage, totalPages });
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const pages = getPages(currentPage, totalPages, maxVisible, showEdges);

  const changePage = (page: number) => {
    setState(previous => ({ ...previous, currentPage: page }));
    onPageChange?.(page);
  };

  const prevAriaLabel = isFirstPage
    ? i18n.$t('DIALTONE_PAGINATION_FIRST_PAGE')
    : i18n.$t('DIALTONE_PAGINATION_PREVIOUS_PAGE');
  const nextAriaLabel = isLastPage
    ? i18n.$t('DIALTONE_PAGINATION_LAST_PAGE')
    : i18n.$t('DIALTONE_PAGINATION_NEXT_PAGE');
  const pageNumberAriaLabel = (page: number) => (page === totalPages
    ? `${i18n.$t('DIALTONE_PAGINATION_LAST_PAGE')} ${page}`
    : `${i18n.$t('DIALTONE_PAGINATION_PAGE_NUMBER', { page })}`);

  return (
    <nav
      aria-label={ariaLabel}
      {...rest}
      className={cx('d-pagination', className)}
      // Vue's `v-show`, which sets display after the consumer's style.
      style={totalPages > 0 ? style : { ...style, display: 'none' }}
      ref={ref}
    >
      <DtButton
        className="d-pagination__button"
        data-qa="dt-pagination-prev"
        aria-label={prevAriaLabel}
        kind="muted"
        importance="clear"
        disabled={isFirstPage}
        onClick={() => changePage(currentPage - 1)}
        startIcon={<DtIconChevronLeft size="300" />}
      />
      {pages.map((page, index) => (
        <div
          // Page numbers are unique, so their key survives the window moving and keeps focus.
          key={page === '...' ? `separator-${index}` : `page-${page}`}
          className={cx({ 'd-pagination__separator': page === '...' })}
        >
          {page === '...'
            ? (
              <div className="d-pagination__separator-icon" data-qa="dt-pagination-separator">
                <DtIconMoreHorizontal size="300" />
              </div>
            )
            : (
              <DtButton
                className="d-pagination__item"
                aria-label={pageNumberAriaLabel(page)}
                kind={currentPage === page ? 'default' : 'muted'}
                importance={currentPage === page ? 'primary' : 'clear'}
                labelClass="d-pagination__item-label"
                onClick={() => changePage(page)}
              >
                {page}
              </DtButton>
            )}
        </div>
      ))}
      <DtButton
        className="d-pagination__button"
        data-qa="dt-pagination-next"
        aria-label={nextAriaLabel}
        disabled={isLastPage}
        kind="muted"
        importance="clear"
        onClick={() => changePage(currentPage + 1)}
        startIcon={<DtIconChevronRight size="300" />}
      />
    </nav>
  );
}
