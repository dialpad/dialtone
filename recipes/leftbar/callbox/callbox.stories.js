import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeCallbox from './callbox.vue';
import DtRecipeCallboxDefaultTemplate from './callbox_default.story.vue';
import DtRecipeCallboxVariantsTemplate from './callbox_variants.story.vue';
import { action } from '@storybook/addon-actions';

export const argTypesData = {
  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
};

const decorator = () => ({
  template: `<div style="background-color: var(--dt-theme-sidebar-color-background)" class="d-wmx264 d-p8"><story />
  </div>`,
});

export const argsData = {
  onClick: action('click'),
  title: 'Title',
  avatarFullName: 'Title',
  borderColor: 'ai',
  clickable: true,
};

export default {
  title: 'Recipes/Leftbar/Callbox',
  component: DtRecipeCallbox,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeCallboxDefaultTemplate,
);

const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeCallboxVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: {
    video: 'Video slot',
    badge: 'Badge slot',
    subtitle: 'Subtitle slot',
    right: 'Right slot',
    bottom: 'Bottom slot',
  },

  parameters: {
    percy: {
      args: {
        avatarSeed: 'seed',
      },
    },
  },
};

export const Variants = {
  render: VariantsTemplate,

  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
