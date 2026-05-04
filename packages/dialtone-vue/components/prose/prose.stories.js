import { createTemplateFromVueFile } from '@/common/StorybookUtils';
import DtProse from './prose.vue';
import DtProseDefaultTemplate from './ProseDefault.story.vue';
import {
  PROSE_SIZE_MODIFIERS,
  PROSE_DENSITY_MODIFIERS,
} from './ProseConstants';

export const argTypesData = {
  size: {
    control: 'select',
    options: Object.keys(PROSE_SIZE_MODIFIERS),
  },
  density: {
    control: 'select',
    options: Object.keys(PROSE_DENSITY_MODIFIERS),
  },
  default: {
    table: { type: { summary: 'VNode' } },
    control: { type: 'text' },
  },
};

export const argsData = {
  size: 300,
  density: 200,
};

export default {
  title: 'Components/Prose',
  component: DtProse,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtProseDefaultTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: {},
};
