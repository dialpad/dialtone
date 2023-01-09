<template>
  <nav
    :aria-label="ariaLabel"
    class="d-d-flex d-fd-row d-gg4 d-ai-center"
  >
    <!-- TODO: remove `h:d-fc-black-300` once DT-871 is completed -->
    <dt-button
      class="d-px8"
      data-qa="dt-pagination-prev"
      :aria-label="prevAriaLabel"
      kind="muted"
      :importance="isFirstPage ? 'primary' : 'clear'"
      :disabled="isFirstPage"
      :class="isFirstPage ? 'd-fc-black-300 h:d-fc-black-300 d-bgc-transparent' : 'd-fc-tertiary'"
      @click="changePage(currentPage - 1)"
    >
      <template #icon>
        <dt-icon
          name="chevron-left"
          size="300"
        />
      </template>
    </dt-button>
    <div
      v-for="(page, index) in pages"
      :key="`page-${page}-${index}`"
      :class="{ 'd-as-flex-end': isNaN(Number(page)) }"
    >
      <!-- eslint-disable vue/no-bare-strings-in-template -->
      <div
        v-if="isNaN(Number(page))"
        class="d-fc-tertiary d-w24 d-ta-center"
        data-qa="dt-pagination-separator"
      >
        <dt-icon
          name="more-horizontal"
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
    <!-- TODO: remove `h:d-fc-black-300` once DT-871 is completed -->
    <dt-button
      class="d-px8"
      data-qa="dt-pagination-next"
      :aria-label="nextAriaLabel"
      :disabled="isLastPage"
      kind="muted"
      :importance="isLastPage ? 'primary' : 'clear'"
      :class="isLastPage ? 'd-fc-black-300 h:d-fc-black-300 d-bgc-transparent' : 'd-fc-tertiary'"
      @click="changePage(currentPage + 1)"
    >
      <template #icon>
        <dt-icon
          name="chevron-right"
          size="300"
        />
      </template>
    </dt-button>
  </nav>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';

/**
 * Pagination allows you to divide large amounts of content into smaller chunks across multiple pages.
 * @see https://dialpad.design/components/pagination.html
 */
export default {
  name: 'DtPagination',

  components: {
    DtButton,
    DtIcon,
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
