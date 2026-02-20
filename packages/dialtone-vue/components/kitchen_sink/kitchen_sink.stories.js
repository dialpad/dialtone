import KitchenSinkComponentsTemplate from './kitchen_sink.story.vue';
import KitchenSinkRecipesTemplate from './kitchen_sink_recipes.story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';

export default {
  title: 'Kitchen Sink',
  tags: ['!autodocs'],
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    percy: { skip: true },
  },
};

const ComponentsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  KitchenSinkComponentsTemplate,
);

const RecipesTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  KitchenSinkRecipesTemplate,
);

export const Components = {
  render: ComponentsTemplate,
  args: {},
};

export const Recipes = {
  render: RecipesTemplate,
  args: {},
};
