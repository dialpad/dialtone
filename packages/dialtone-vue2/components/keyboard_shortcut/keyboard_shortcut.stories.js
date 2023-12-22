import { SHORTCUTS_ALIASES_LIST } from './keyboard_shortcut_constants';
import { createRenderConfig } from '@/common/storybook_utils';
import DtKeyboardShortcut from './keyboard_shortcut.vue';

import DtKeyboardShortcutDefaultTemplate from './keyboard_shortcut_default.story.vue';
import DtKeyboardShortcutVariantsTemplate from './keyboard_shortcut_variants.story.vue';

// Default Prop Values
export const argsData = {
  shortcut: '{cmd}+Ctrl+X',
};

export const argTypesData = {
  shortcut: {
    description: `Include any of these tokens in your string to render the corresponding symbol:<br>
      ${SHORTCUTS_ALIASES_LIST.join(', ')}`,
    control: 'text',
  },
  inverted: {
    control: {
      type: 'boolean',
    },
  },
};

// Story Collection
export default {
  title: 'Components/Keyboard Shortcut',
  component: DtKeyboardShortcut,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtKeyboardShortcut, DtKeyboardShortcutDefaultTemplate, argsData),
  args: {},
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtKeyboardShortcut, DtKeyboardShortcutVariantsTemplate, argsData),
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
