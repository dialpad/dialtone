import { createTemplateFromVueFile } from '../storybook_utils';
import DtBadge from './badge';
import DtBadgeDefaultTemplate from './badge_default.story.vue';
import DtBadgeVariantsTemplate from './badge_variants.story.vue';
import { BADGE_COLOR_MODIFIERS } from './badge_constants';
import DtBadgeMdx from './badge.mdx';

export const argTypesData = {
  // Props
  color: {
    defaultValue: 'base',
    control: {
      type: 'select',
      options: Object.keys(BADGE_COLOR_MODIFIERS),
    },
  },

  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'text/html',
      },
    },
  },
};

// Story Collection
export default {
  title: 'Elements/Badge',
  component: DtBadge,
  excludeStories: /.*Data$/,
  argTypes: argTypesData,
  parameters: {
    docs: {
      page: DtBadgeMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtBadgeDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtBadgeVariantsTemplate);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  default: 'badge',
};

export const Variants = VariantsTemplate.bind({});
Variants.parameters = { controls: { disable: true }, actions: { disable: true } };
Variants.args = {};
