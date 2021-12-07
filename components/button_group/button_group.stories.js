import { createTemplateFromVueFile } from '../storybook_utils';
import DtButtonGroup from './button_group';
import DtButtonGroupMdx from './button_group.mdx';
import DtButtonGroupDefaultTemplate from './button_group_default.story.vue';
import { BUTTON_GROUP_ALIGNMENT } from './button_group_constants';

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  alignment: {
    defaultValue: 'start',
    control: {
      type: 'select',
      options: Object.keys(BUTTON_GROUP_ALIGNMENT),
    },
  },
};

// Story Collection
export default {
  title: 'Components/Button Group',
  component: DtButtonGroup,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DtButtonGroupMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtButtonGroupDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};
