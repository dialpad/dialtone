import LocalizationDefault from './LocalizationDefault.story.vue';
import { createTemplateFromVueFile } from '@/common/StorybookUtils';

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
