import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeTimePill from './time_pill.vue';

import DtRecipeTimePillDefaultTemplate from './time_pill_default.story.vue';

// Default Prop Values
export const argsData = {};

/**
 * example prop description decorator
 */

/*
  Controls
  ========

  Here we define any custom controls or control overrides for our components.

  By default storybook will attempt to provide an appropriate control of the same name for each property in the
  component as well as include any description provided using a prop decorator within your component (see above).

  Storybook will also attempt to provide an appropriate control for each slot in the component as well as include any
  description provided using a slot decorator within your component (see below).

  <!-- @slot example slot decorator -->
*/
export const argTypesData = {};

// Story Collection
export default {
  title: 'Recipes/Conversation View/Time Pill',
  component: DtRecipeTimePill,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const today = new Date('1999-03-28');

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRecipeTimePillDefaultTemplate);

export const Default = {
  render: DefaultTemplate,

  args: {
    dateTime: today.toISOString().split('T')[0],
    dateTimeDisplay: 'Today',
  },
};
