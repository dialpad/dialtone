import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtProgress from './progress.vue';
import DtProgressDefaultTemplate from './progress_default.story.vue';
import DtProgressVariantsTemplate from './progress_variants.story.vue';

export const argsData = { ariaLabel: 'Upload progress', progress: 50 };
export const argTypesData = {
  progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
};

export default {
  title: 'Components/Progress',
  component: DtProgress,
  excludeStories: /.*Data$/,
  args: argsData,
  argTypes: argTypesData,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtProgressDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtProgressVariantsTemplate);

export const Default = { render: DefaultTemplate, args: {} };
export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
