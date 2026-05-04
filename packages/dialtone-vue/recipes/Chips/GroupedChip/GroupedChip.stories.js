import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtRecipeGroupedChip from './GroupedChip.vue';

import DtRecipeGroupedChipDefaultTemplate from './GroupedChipDefault.story.vue';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {};

export const argTypesData = {
  // Props

  // Slots
  startContent: {
    control: 'text',
    description: 'Slot start hand side content. Ex. ongoing call time value',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  startIcon: {
    name: 'startIcon',
    options: iconsList,
    description: 'Slot for start hand chip icon',
    table: {
      category: 'slots',
      type: {
        summary: 'Component',
      },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },

  endContent: {
    control: 'text',
    description: 'Slot end hand side content. Ex. ongoing call hold time value',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  endIcon: {
    name: 'endIcon',
    options: iconsList,
    description: 'Slot for end hand chip icon',
    table: {
      category: 'slots',
      type: {
        summary: 'Component',
      },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },

  // Deprecated slots
  leftContent: {
    table: { category: 'Deprecated' },
    description: 'Use `startContent` instead.',
  },

  leftIcon: {
    table: { category: 'Deprecated' },
    description: 'Use `startIcon` instead.',
  },

  rightContent: {
    table: { category: 'Deprecated' },
    description: 'Use `endContent` instead.',
  },

  rightIcon: {
    table: { category: 'Deprecated' },
    description: 'Use `endIcon` instead.',
  },
};

// Story Collection
export default {
  title: 'Recipes/Chips/Grouped Chip',
  component: DtRecipeGroupedChip,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRecipeGroupedChipDefaultTemplate);

export const Default = {
  render: DefaultTemplate,

  args: {
    startIcon: 'clock',
    startContent: `<div>
      2:50:13
  </div>`,
    endIcon: 'pause',
    endContent: `<div>
      0.25
  </div>`,
  },
};
