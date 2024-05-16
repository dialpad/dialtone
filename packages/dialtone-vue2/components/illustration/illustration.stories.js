import DtIllustration from './illustration.vue';
import { ILLUSTRATION_SIZE_MODIFIERS } from './illustration_constants.js';

import DtIllustrationDefaultTemplate from './illustration_default.story.vue';
// import DtIconVariantsTemplate from './icon_variants.story.vue';
import { createRenderConfig, getIllustrationNames } from '@/common/storybook_utils';
const illustrationsList = getIllustrationNames();
export const argTypesData = {
  size: {
    options: Object.keys(ILLUSTRATION_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  name: {
    options: illustrationsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
};

export const argsData = {};

export default {
  title: 'Components/Illustration',
  component: DtIllustration,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtIllustration, DtIllustrationDefaultTemplate, argsData),

  args: {
    name: 'mind',
  },
};

// export const Variants = {
//   render: (argsData) => createRenderConfig(DtIcon, DtIconVariantsTemplate, argsData),
//   args: { limit: undefined },
//   parameters: {
//     percy: {
//       args: {
//         limit: 10,
//         showSkeleton: false,
//       },
//     },
//     options: { showPanel: false },
//     controls: { disable: true },
//   },
// };
