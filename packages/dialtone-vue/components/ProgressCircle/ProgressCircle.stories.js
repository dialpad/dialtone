import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtProgressCircle from './ProgressCircle.vue';
import { PROGRESS_CIRCLE_SIZES, PROGRESS_CIRCLE_SIZE_DEFAULT, PROGRESS_CIRCLE_KINDS, PROGRESS_CIRCLE_KIND_DEFAULT } from './ProgressCircleConstants';
import DtProgressCircleDefaultTemplate from './ProgressCircleDefault.story.vue';
import DtProgressCircleVariantsTemplate from './ProgressCircleVariants.story.vue';

export const argsData = { ariaLabel: 'Upload progress', progress: 50, size: PROGRESS_CIRCLE_SIZE_DEFAULT, kind: PROGRESS_CIRCLE_KIND_DEFAULT };
export const argTypesData = {
  progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  size: {
    options: Object.keys(PROGRESS_CIRCLE_SIZES),
    control: { type: 'select' },
  },
  kind: {
    options: Object.keys(PROGRESS_CIRCLE_KINDS),
    control: { type: 'select' },
  },
};

export default {
  title: 'Components/Progress Circle',
  component: DtProgressCircle,
  excludeStories: /.*Data$/,
  args: argsData,
  argTypes: argTypesData,
};

const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtProgressCircleDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtProgressCircleVariantsTemplate);

export const Default = { render: DefaultTemplate, args: {} };
export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
