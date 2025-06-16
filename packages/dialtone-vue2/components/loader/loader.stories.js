import { createRenderConfig } from '@/common/storybook_utils';
import DtLoader from './loader.vue';
import DtLoaderDefaultTemplate from './loader_default.story.vue';
import DtLoaderVariantsTemplate from './loader_variants.story.vue';
import { ICON_SIZE_MODIFIERS } from '@/components/icon';

const argTypesData = {
  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
};

const argsData = {};

// Story Collection
export default {
  title: 'Components/Loader',
  component: DtLoader,
  args: argsData,
  argTypes: argTypesData,
};

// Stories
export const Default = {
  render: (argsData) => createRenderConfig(DtLoader, DtLoaderDefaultTemplate, argsData),
  args: {},
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtLoader, DtLoaderVariantsTemplate, argsData),
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
