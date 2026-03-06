import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtFilterPill from '@/components/filter_pill/filter_pill.vue';
import DtFilterPillCustomVariantsTemplate from './filter_pill_custom_variants.story.vue';

export default {
  title: 'Recipes/Filters/Filter Pill Custom Label',
  component: DtFilterPill,
  excludeStories: /.*Data$/,
};

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtFilterPillCustomVariantsTemplate,
);

export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
