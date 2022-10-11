<template>
  <nav
    :aria-label="ariaLabel"
    class="d-d-flex d-fd-row d-gg2 d-ai-center"
  >
    <dt-button
      class="d-h32 d-w32"
      data-qa="dt-pagination-prev"
      :aria-label="prevAriaLabel"
      :importance="isFirstPage ? 'primary' : 'clear'"
      :disabled="isFirstPage"
      @click="changePage(currentPage - 1)"
    >
      <template slot="icon">
        <icon-chevron-left />
      </template>
    </dt-button>
    <div
      v-for="(page, index) in pages"
      :key="`page-${page}-${index}`"
    >
      <!-- eslint-disable vue/no-bare-strings-in-template -->
      <div
        v-if="isNaN(Number(page))"
        data-qa="dt-pagination-separator"
        class="d-h32 d-w32 d-d-flex d-ai-center d-jc-center"
      >
        …
      </div>
      <!-- eslint-enable vue/no-bare-strings-in-template -->
      <dt-button
        v-else
        :aria-label="pageNumberAriaLabel(page)"
        :importance="currentPage === page ? 'primary' : 'clear'"
        class="d-h32 d-w32"
        label-class="d-fs-200"
        @click="changePage(page)"
      >
        {{ page }}
      </dt-button>
    </div>
    <dt-button
      class="d-h32 d-w32"
      data-qa="dt-pagination-next"
      :aria-label="nextAriaLabel"
      :disabled="isLastPage"
      :importance="isLastPage ? 'primary' : 'clear'"
      @click="changePage(currentPage + 1)"
    >
      <template slot="icon">
        <icon-chevron-right />
      </template>
    </dt-button>
  </nav>
</template>

<script>
import { DtButton } from '@';
import IconChevronLeft from '@dialpad/dialtone/lib/dist/vue/icons/IconChevronLeft';
import IconChevronRight from '@dialpad/dialtone/lib/dist/vue/icons/IconChevronRight';

/**
 * Pagination allows you to divide large amounts of content into smaller chunks across multiple pages.
 * @see https://dialpad.design/components/pagination.html
 */
export default {
  name: 'DtPagination',

  components: {
    DtButton,
    IconChevronLeft,
    IconChevronRight,
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

      const start = this.maxVisible - 1;
      const end = this.totalPages - start + 1;

      if (this.currentPage < start) {
        return [...this.range(1, start), '...', this.totalPages];
      }

      if (this.currentPage > end) {
        return [1, '...', ...this.range(end, this.totalPages)];
      }

      // rounding to the nearest odd according to the maxlength to always show the page number in the middle.
      const total = this.maxVisible - (3 - this.maxVisible % 2);
      const centerIndex = Math.floor(total / 2);
      const left = this.currentPage - centerIndex;
      const right = this.currentPage + centerIndex;
      return [1, '...', ...this.range(left, right), '...', this.totalPages];
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
