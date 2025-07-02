import LocalizationDefault from './localization_default.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';

// Default Props for all variations
export const argsData = {};

export const argTypesData = {};

export default {
  title: 'Utilities/Localization',
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, LocalizationDefault);

export const Default = {
  render: DefaultTemplate,
};
