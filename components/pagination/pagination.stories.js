import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtPagination from './pagination';
import DtPaginationMdx from './pagination.mdx';
import DtPaginationDefaultTemplate from './pagination_default.story.vue';
import DtPaginationVariantsTemplate from './pagination_variants.story.vue';

// Default Prop Values
export const argsData = {
  onChange: action('change'),
};

export const argTypesData = {
// Props
  totalPages: {
    defaultValue: 5,
    control: {
      type: 'number',
    },
  },
  activePage: {
    defaultValue: 1,
    control: {
      type: 'number',
    },
  },
  maxVisible: {
    defaultValue: 5,
    control: {
      type: 'number',
    },
  },
  ariaLabel: {
    defaultValue: 'pagination',
    control: {
      type: 'text',
    },
  },
  prevAriaLabel: {
    defaultValue: 'previous',
    control: {
      type: 'text',
    },
  },
  nextAriaLabel: {
    defaultValue: 'next',
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
  parameters: {
    docs: {
      page: DtPaginationMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtPaginationDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtPaginationVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

Default.parameters = {
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
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};

Variants.parameters = {
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
};
