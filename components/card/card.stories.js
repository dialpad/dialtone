import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtCard from './card';
import DtCardMdx from './card.mdx';
import DtCardDefaultTemplate from './card_default.story.vue';

// Default Prop Values
export const argsData = {
};

export const argTypesData = {
  // Props
  showFooter: {
    table: {
      disable: true,
    },
  },

  showHeader: {
    table: {
      disable: true,
    },
  },

  variants: {
    table: {
      disable: true,
    },
  },

  // Slots
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  footer: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  header: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Card',
  component: DtCard,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DtCardMdx,
    },
    controls: {
      sort: 'requiredFirst',
    },
    options: { showPanel: true },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtCardDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

Default.parameters = {
  docs: {
    source: {
      code: `
<dt-card class="d-w264">
  <template #content>
    <p class="d-fs-200 d-fw-bold">Lorem ipsum</p>
    <p class="d-fs-100">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</p>
  </template>
</dt-card>`,
    },
  },
};

export const WithHeader = DefaultTemplate.bind({});
WithHeader.args = {
  showHeader: true,
  variants: true,
};

export const WithFooter = DefaultTemplate.bind({});
WithFooter.args = {
  showFooter: true,
  variants: true,
};

export const WithHeaderAndFooter = DefaultTemplate.bind({});
WithHeaderAndFooter.args = {
  showHeader: true,
  showFooter: true,
  variants: true,
};

export const WithScrollableContent = DefaultTemplate.bind({});
WithScrollableContent.args = {
  maxHeight: '50px',
};
