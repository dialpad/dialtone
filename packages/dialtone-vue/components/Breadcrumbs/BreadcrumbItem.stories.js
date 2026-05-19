import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtBreadcrumbItem from './BreadcrumbItem.vue';

import DtBreadcrumbItemDefaultTemplate from './BreadcrumbItemDefault.story.vue';

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
  label: {
    control: { type: 'text' },
  },
  selected: {
    control: { type: 'boolean' },
  },
  inverted: {
    table: { category: 'Deprecated' },
    description: 'Deprecated.',
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
