import DtIcon from './icon';
import {
  ICON_SIZE_MODIFIERS,
} from './icon_constants';
import BaseIconMdx from './icon.mdx';
import IconDefault from './icon_default.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import * as dialtoneIcons from '@dialpad/dialtone-icons';
import { pascalCaseToKebabCase } from '@/common/utils';

const iconsList = Object.keys(dialtoneIcons).map(name => pascalCaseToKebabCase(name));

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
      options: iconsList,
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

const Template = (args) => createTemplateFromVueFile(
  args,
  IconDefault,
);

export const Default = Template.bind({});
Default.args = {
  name: 'accessibility',
};
