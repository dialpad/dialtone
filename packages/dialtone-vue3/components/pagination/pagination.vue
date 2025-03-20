<template>
  <nav
    :aria-label="ariaLabel"
    class="d-pagination"
  >
    <dt-button
      class="d-pagination__button"
      data-qa="dt-pagination-prev"
      :aria-label="prevAriaLabel"
      :kind="isFirstPage ? 'default' : 'muted'"
      :importance="isFirstPage ? 'primary' : 'clear'"
      :disabled="isFirstPage"
      :class="isFirstPage ? 'd-fc-black-300 d-bgc-transparent' : 'd-fc-tertiary'"
      @click="changePage(currentPage - 1)"
    >
      <template #icon>
        <dt-icon-chevron-left
          size="300"
        />
      </template>
    </dt-button>
    <div
      v-for="(page, index) in pages"
      :key="`page-${page}-${index}`"
      :class="{ 'd-pagination__separator': isNaN(Number(page)) }"
    >
      <!-- eslint-disable vue/no-bare-strings-in-template -->
      <div
        v-if="isNaN(Number(page))"
        class="d-pagination__separator-icon"
        data-qa="dt-pagination-separator"
      >
        <dt-icon-more-horizontal
          size="300"
        />
        <!-- … -->
      </div>
      <!-- eslint-enable vue/no-bare-strings-in-template -->
      <dt-button
        v-else
        :aria-label="pageNumberAriaLabel(page)"
        :kind="currentPage === page ? 'default' : 'muted'"
        :importance="currentPage === page ? 'primary' : 'clear'"
        label-class=""
        @click="changePage(page)"
      >
        {{ page }}
      </dt-button>
    </div>
    <dt-button
      class="d-pagination__button"
      data-qa="dt-pagination-next"
      :aria-label="nextAriaLabel"
      :disabled="isLastPage"
      kind="muted"
      :importance="isLastPage ? 'primary' : 'clear'"
      :class="isLastPage ? 'd-fc-black-300 d-bgc-transparent' : 'd-fc-tertiary'"
      @click="changePage(currentPage + 1)"
    >
      <template #icon>
        <dt-icon-chevron-right
          size="300"
        />
      </template>
    </dt-button>
  </nav>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtIconChevronLeft, DtIconChevronRight, DtIconMoreHorizontal } from '@dialpad/dialtone-icons/vue3';

/**
 * Pagination allows you to divide large amounts of content into smaller chunks across multiple pages.
 * @see https://dialtone.dialpad.com/components/pagination.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtPagination',

  components: {
    DtButton,
    DtIconChevronLeft,
    DtIconChevronRight,
    DtIconMoreHorizontal,
  },

  props: {
    /**
     * Descriptive label for the pagination content.
     */
    ariaLabel: {
      type: String,
      required: true,
    },

    /**
     * The total number of the pages
     */
    totalPages: {
      type: Number,
      required: true,
    },

    /**
     * Descriptive label for the previous button.
     */
    prevAriaLabel: {
      type: String,
      required: true,
    },

    /**
     * Descriptive label for the next button.
     */
    nextAriaLabel: {
      type: String,
      required: true,
    },

    /**
     * A method that will be called to get the aria label of each page.
     */
    pageNumberAriaLabel: {
      type: Function,
      required: true,
    },

    /**
     * The active current page in the list of pages, defaults to the first page
     */
    activePage: {
      type: Number,
      default: 1,
    },

    /**
     * Determines the max pages to be shown in the list. Using an odd number is recommended.
     * If an even number is given, then it will be rounded down to the nearest odd number to always
     * keep current page in the middle when current page is in the mid-range.
     */
    maxVisible: {
      type: Number,
      default: 5,
    },

    /**
     * Sometimes you may need to hide start and end page number buttons when moving in between.
     * This prop will be used to hide the first and last page buttons when not near the edges.
     * This is useful when your backend does not support offset and you can only use cursor based pagination.
     */
    hideEdges: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Page change event
     *
     * @event change
     * @type {Number}
     */
    'change',
  ],

  data () {
    return {
      currentPage: this.activePage,
    };
  },

  computed: {
    isFirstPage () {
      return this.currentPage === 1;
    },

    isLastPage () {
      return this.currentPage === this.totalPages;
    },

    pages () {
      if (this.maxVisible === 0) {
        return [];
      }
      if (this.totalPages <= this.maxVisible) {
        return this.range(1, this.totalPages);
      }

      let start = this.maxVisible - 1;
      let end = this.totalPages - start + 1;

      // if hideEdges is true, modify the start and
      // end to account for the hidden pages
      if (this.hideEdges) {
        start = start + 1;
        end = end - 1;
      }

      if (this.currentPage < start) {
        const pages = [...this.range(1, start), '...'];
        if (!this.hideEdges) {
          // add last page to the end
          pages.push(this.totalPages);
        }
        return pages;
      }

      if (this.currentPage > end) {
        console.log('END=', end);
        const pages = ['...', ...this.range(end, this.totalPages)];
        if (!this.hideEdges) {
          // add first page to the beginning
          pages.unshift(1);
        }
        return pages;
      }

      // rounding to the nearest odd according to the maxlength to always show the page number in the middle.
      const total = this.maxVisible - (3 - this.maxVisible % 2);
      const centerIndex = Math.floor(total / 2);
      let left = this.currentPage - centerIndex;
      let right = this.currentPage + centerIndex;

      // if hideEdge is true, modify the left and right to account for the hidden pages
      if (this.hideEdges) {
        left = left - 1;
        right = right + 1;
      }

      const pages = ['...', ...this.range(left, right), '...'];
      if (!this.hideEdges) {
        return [1, ...pages, this.totalPages];
      }
      return pages;
    },
  },

  watch: {
    activePage () {
      this.currentPage = this.activePage;
    },
  },

  methods: {
    range (from, to) {
      const range = [];
      from = from > 0 ? from : 1;
      for (let i = from; i <= to; i++) {
        range.push(i);
      }
      return range;
    },

    changePage (page) {
      this.currentPage = page;
      this.$emit('change', this.currentPage);
    },
  },
};
</script>
