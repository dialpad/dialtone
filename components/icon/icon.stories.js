import DtIcon from './icon.vue';
import { ICON_SIZE_MODIFIERS } from './icon_constants';

import DtIconDefaultTemplate from './icon_default.story.vue';
import DtIconVariantsTemplate from './icon_variants.story.vue';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
const iconsList = getIconNames();
export const argTypesData = {
  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  name: {
    options: iconsList,
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
  title: 'Components/Icon',
  component: DtIcon,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtIconDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtIconVariantsTemplate);

export const Default = {
  render: DefaultTemplate,

  args: {
    name: 'accessibility',
  },
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
