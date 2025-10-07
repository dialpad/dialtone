import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtBreadcrumbItem from './breadcrumb_item.vue';

import DtBreadcrumbItemDefaultTemplate from './breadcrumb_item_default.story.vue';

// Default Prop Values
export const argsData = {
  href: '#',
  label: 'Breadcrumb Item',
  selected: false,
};

export const argTypesData = {
  // HTML attributes
  href: {
    description: 'HTML a href attribute',
    type: {
      summary: 'string',
    },
    table: {
      category: 'html attributes',
    },
    control: 'text',
  },
};

// Story Collection
export default {
  title: 'Components/Breadcrumbs',
  component: DtBreadcrumbItem,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtBreadcrumbItemDefaultTemplate);

export const BreadcrumbItem = {
  render: DefaultTemplate,
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
