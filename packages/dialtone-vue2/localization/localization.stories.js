import LocalizationDefault from './localization_default.story.vue';
import { createRenderConfig } from '@/common/storybook_utils';

// Default Props for all variations
export const argsData = {};

export const argTypesData = {};

export default {
  title: 'Utilities/Localization',
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.Data$/,
};

export const Default = {
  render: (argsData) =>
    createRenderConfig(
      { name: 'DtLocalization' },
      LocalizationDefault,
      argsData,
    ),
};
