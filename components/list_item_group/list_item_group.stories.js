import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtListItemGroup from './list_item_group';
import DtListItemGroupMdx from './list_item_group.mdx';
import DtListItemGroupDefaultTemplate from './list_item_group_default.story.vue';

// Default Prop Values
export const argsData = {
  heading: 'Example Heading',
};
export const argTypesData = {
  // Slots
  default: {
    control: 'none',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  // Slots
  headingSlot: {
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
  title: 'Components/List Item Group',
  component: DtListItemGroup,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DtListItemGroupMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtListItemGroupDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};
