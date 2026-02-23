import KitchenSinkView from './kitchen_sink_view.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';

const componentLoaders = import.meta.glob(['../**/*.stories.js', '!../kitchen_sink/**']);
const recipeLoaders = import.meta.glob('../../recipes/**/*.stories.js');

export default {
  title: 'Kitchen Sink',
  tags: ['!autodocs'],
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    percy: { skip: true },
  },
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, KitchenSinkView);

export const Components = {
  render: Template,
  args: {
    title: 'Kitchen Sink: Components',
    itemLabel: 'components',
    iframeUrl: '/iframe.html?id=kitchen-sink--components&viewMode=story',
    loaders: componentLoaders,
  },
};

export const Recipes = {
  render: Template,
  args: {
    title: 'Kitchen Sink: Recipes',
    itemLabel: 'recipes',
    iframeUrl: '/iframe.html?id=kitchen-sink--recipes&viewMode=story',
    loaders: recipeLoaders,
  },
};
