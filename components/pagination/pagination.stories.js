import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtPagination from './pagination.vue';

import DtPaginationDefaultTemplate from './pagination_default.story.vue';
import DtPaginationVariantsTemplate from './pagination_variants.story.vue';

// Default Prop Values
export const argsData = {
  totalPages: 5,
  activePage: 1,
  maxVisible: 5,
  ariaLabel: 'pagination',
  prevAriaLabel: 'previous',
  nextAriaLabel: 'next',
  onChange: action('change'),
};

export const argTypesData = {
  // Props
  totalPages: {
    control: {
      type: 'number',
    },
  },
  activePage: {
    control: {
      type: 'number',
    },
  },
  maxVisible: {
    control: {
      type: 'number',
    },
  },
  ariaLabel: {
    control: {
      type: 'text',
    },
  },
  nextAriaLabel: {
    control: {
      type: 'text',
    },
  },
  prevAriaLabel: {
    control: {
      type: 'text',
    },
  },

  // Action Event Handlers
  onChange: {
    table: {
      disable: true,
    },
  },

  change: {
    description: 'Page Change event',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Pagination',
  component: DtPagination,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtPaginationDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtPaginationVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: {},
  parameters: {
    docs: {
      source: {
        code: `
  <dt-pagination
      :total-pages="totalPages"
      :active-page="activePage"
      :max-visible="maxVisible"
      :aria-label="ariaLabel"
      :prev-aria-label="prevAriaLabel"
      :next-aria-label="nextAriaLabel"
      :page-number-aria-label="getPageNumberAriaLabel"
      @change="onChange"
    />   `,
      },
    },
  },
};

export const Variants = {
  render: VariantsTemplate,
  args: {},

  parameters: {
    docs: {
      source: {
        code: `
   <div class="d-divide-y d-divide-purple-400">
      <div class="d-m32">
        <p class="d-my16 d-fs-200 d-fw-bold">
          Separator in the end
        </p>
        <dt-pagination
          :total-pages="10"
          :aria-label="'pagination with separator in the end'"
          :prev-aria-label="'previous'"
          :next-aria-label="'next'"
          :page-number-aria-label="getPageNumberAriaLabel"
        />
      </div>
      <div class="d-m32">
        <p class="d-my16 d-fs-200 d-fw-bold">
          Separator in the beginning
        </p>
        <dt-pagination
          :total-pages="15"
          :active-page="13"
          :aria-label="'pagination with separator in the beginning'"
          :prev-aria-label="'previous'"
          :next-aria-label="'next'"
          :page-number-aria-label="getPageNumberAriaLabel"
        />
      </div>
      <div class="d-m32">
        <p class="d-my16 d-fs-200 d-fw-bold">
          Separator on both sides
        </p>
        <dt-pagination
          :total-pages="10"
          :active-page="5"
          :aria-label="'pagination with separator on both sides'"
          :prev-aria-label="'previous'"
          :next-aria-label="'next'"
          :page-number-aria-label="getPageNumberAriaLabel"
        />
      </div>
    </div>
  `,
      },
    },
  },
};
