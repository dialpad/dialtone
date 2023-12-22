import { createRenderConfig } from '@/common/storybook_utils';
import DtBreadcrumbItem from './breadcrumb_item.vue';

import DtBreadcrumbItemDefaultTemplate from './breadcrumb_item_default.story.vue';

// Default Prop Values
export const argsData = {
  href: '#',
  label: 'Breadcrumb Item',
  selected: false,
};

export const argTypesData = {
};

// Story Collection
export default {
  title: 'Components/Breadcrumbs',
  component: DtBreadcrumbItem,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const BreadcrumbItem = {
  render: (argsData) => createRenderConfig(DtBreadcrumbItem, DtBreadcrumbItemDefaultTemplate, argsData),
  args: {},
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'listitem',
            enabled: false,
          },
        ],
      },
    },
  },
};
