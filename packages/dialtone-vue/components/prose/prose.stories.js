import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtProse from './prose.vue';
import DtProseDefaultTemplate from './prose_default.story.vue';

export const argTypesData = {};

export const argsData = {};

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
