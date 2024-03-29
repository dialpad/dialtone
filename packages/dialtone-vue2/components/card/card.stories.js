import { createRenderConfig } from '@/common/storybook_utils';
import DtCard from './card.vue';

import DtCardDefaultTemplate from './card_default.story.vue';

// Default Prop Values
export const argsData = {};

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
};

export const Default = {
  render: (argsData) => createRenderConfig(DtCard, DtCardDefaultTemplate, argsData),
  args: {},

  parameters: {
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
  },
};

export const WithHeader = {
  render: (argsData) => createRenderConfig(DtCard, DtCardDefaultTemplate, argsData),

  args: {
    showHeader: true,
    variants: true,
  },
};

export const WithFooter = {
  render: (argsData) => createRenderConfig(DtCard, DtCardDefaultTemplate, argsData),

  args: {
    showFooter: true,
    variants: true,
  },
};

export const WithHeaderAndFooter = {
  render: (argsData) => createRenderConfig(DtCard, DtCardDefaultTemplate, argsData),

  args: {
    showHeader: true,
    showFooter: true,
    variants: true,
  },
};

export const WithScrollableContent = {
  render: (argsData) => createRenderConfig(DtCard, DtCardDefaultTemplate, argsData),

  args: {
    maxHeight: '50px',
  },
};
