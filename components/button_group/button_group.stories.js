import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtButtonGroup from './button_group.vue';

import DtButtonGroupDefaultTemplate from './button_group_default.story.vue';
import { BUTTON_GROUP_ALIGNMENT } from './button_group_constants';

export const argsData = {
  alignment: 'start',
};

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
    options: Object.keys(BUTTON_GROUP_ALIGNMENT),
    control: {
      type: 'select',
    },
  },
};

// Story Collection
export default {
  title: 'Components/Button Group',
  component: DtButtonGroup,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtButtonGroupDefaultTemplate);

export const Default = {
  render: DefaultTemplate,
  args: {},
};
