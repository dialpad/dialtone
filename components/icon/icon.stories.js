import DtIcon from './icon';
import { ICON_SIZE_MODIFIERS } from './icon_constants';
import BaseIconMdx from './icon.mdx';
import DtIconDefaultTemplate from './icon_default.story.vue';
import DtIconVariantsTemplate from './icon_variants.story.vue';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
const iconsList = getIconNames();
export const argTypesData = {
  size: {
    control: {
      type: 'select',
      options: Object.keys(ICON_SIZE_MODIFIERS),
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
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: BaseIconMdx,
    },
    options: {
      showPanel: true,
    },
  },
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtIconDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtIconVariantsTemplate,
);

export const Default = DefaultTemplate.bind({});
Default.args = {
  name: 'accessibility',
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
