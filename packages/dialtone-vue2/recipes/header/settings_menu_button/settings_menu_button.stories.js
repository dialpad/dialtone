import { action } from '@storybook/addon-actions';
import { createRenderConfig } from '@/common/storybook_utils';
import DtRecipeSettingsMenuButton from './settings_menu_button.vue';
import DtRecipeSettingsMenuButtonDefaultTemplate from './settings_menu_button_default.story.vue';

// Default Prop Values
export const argsData = {
  onClick: action('click'),
};

export const argTypesData = {
  // Props
  updateAvailable: {
    control: 'boolean',
  },

  // Slots
  default: {
    name: 'default',
    description: 'Slot default content. This should be the word "update"',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'text/html',
      },
    },
  },

  // Action Event Handlers
  click: {
    description: 'Triggered when the button is clicked',
    table: {
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  onClick: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Recipes/Header/Settings Menu Button',
  component: DtRecipeSettingsMenuButton,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};
export const Default = {
  render: (argsData) => createRenderConfig(DtRecipeSettingsMenuButton, DtRecipeSettingsMenuButtonDefaultTemplate, argsData),

  args: {
    default: 'Update',
    ariaLabel: 'Update app',
  },
};
