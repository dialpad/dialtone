import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeAttachmentCarousel from './attachment_carousel.vue';
import DtRecipeAttachmentCarouselDefaultTemplate from './attachment_carousel_default.story.vue';

/*
  Controls
  ========

  Here we define any custom configuration for props / slots / events in storybook

  By default storybook will display any props / slots / events from the associated component. It will also use jsdoc
  comments on the component to populate details such as description and default value. You should only enter config
  here if it was not possible to add into the jsdoc of the component itself.

  See https://storybook.js.org/docs/vue/api/argtypes#manual-specification

  To set the description of a slot, add the below comment to the line above where the slot is defined:
  <!-- @slot example slot decorator -->
*/

const mediaList = [
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    isUploading: true,
    progress: 97,
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/fry-21e0f1a9.gif',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
  {
    type: 'image',
    path: 'https://vue.dialpad.design/assets/test-078acfea.jpg',
    altText: 'Image Alt Text',
  },
];

export const argTypesData = {
  // Props
  // Events
  onRemoveMedia: {
    table: {
      disable: true,
    },
  },
};

// Set default values at the story level here.
export const argsData = {
  mediaList,
  closeAriaLabel: 'Close',
  clickToOpenAriaLabel: 'Click to open',
  progressbarAriaLabel: 'Uploading',
  rightArrowAriaLabel: 'Next',
  leftArrowAriaLabel: 'Previous',
  onRemoveMedia: action('remove-media'),
};

// Story Collection
export default {
  title: 'Recipes/Conversation View/Attachment Carousel',
  component: DtRecipeAttachmentCarousel,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeAttachmentCarouselDefaultTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,
  args: {},
};
