import DtIcon from './icon';
import {
  ICON_SIZE_MODIFIERS,
} from './icon_constants';
import BaseIconMdx from './icon.mdx';
import IconDefault from './icon_default.story.vue';
import { createTemplateFromVueFile, getV7IconNames } from '@/common/storybook_utils';

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
      options: getV7IconNames(),
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

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, IconDefault);

export const Default = Template.bind({});
Default.args = {
  name: 'accessibility',
};
