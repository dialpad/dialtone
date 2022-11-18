import DtIcon from './icon';
import { ICON_SIZE_MODIFIERS } from './icon_constants';
import BaseIconMdx from './icon.mdx';
import DtIconDefaultTemplate from './icon_default.story.vue';
import DtIconVariantsTemplate from './icon_variants.story.vue';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';

export const argTypesData = {
  size: {
    control: {
      type: 'select',
      options: Object.keys(ICON_SIZE_MODIFIERS),
    },
  },
  name: {
    control: {
      type: 'select',
      options: getIconNames(),
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

const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtIconDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtIconVariantsTemplate,
);

export const Default = DefaultTemplate.bind({});
Default.args = {
  name: 'accessibility',
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
