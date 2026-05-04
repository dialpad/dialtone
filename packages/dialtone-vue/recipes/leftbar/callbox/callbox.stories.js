import { createTemplateFromVueFile } from '@/common/StorybookUtils';
import DtRecipeCallbox from './callbox.vue';
import DtRecipeCallboxDefaultTemplate from './CallboxDefault.story.vue';
import DtRecipeCallboxVariantsTemplate from './CallboxVariants.story.vue';
import { action } from 'storybook/actions';

export const argTypesData = {
  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },

  // Deprecated slots
  right: {
    table: {
      disable: true,
    },
  },
  bottom: {
    table: {
      disable: true,
    },
  },
};

const decorator = () => ({
  template: `<div style="background-color: var(--dt-shell-color-surface-default)" class="d-wmx-500 d-p-200"><story />
  </div>`,
});

export const argsData = {
  onClick: action('click'),
  headerText: 'Title',
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

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeCallboxDefaultTemplate,
);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeCallboxVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: {
    video: 'Video slot',
    badge: 'Badge slot',
    subtitle: 'Subtitle slot',
    end: 'End slot',
    blockEnd: 'Block End slot',
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
