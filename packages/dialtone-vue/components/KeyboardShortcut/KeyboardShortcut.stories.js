import { SHORTCUTS_ALIASES_LIST } from './KeyboardShortcutConstants';
import { createTemplateFromVueFile } from '@/common/StorybookUtils';
import DtKeyboardShortcut from './KeyboardShortcut.vue';

import DtKeyboardShortcutDefaultTemplate from './KeyboardShortcutDefault.story.vue';
import DtKeyboardShortcutVariantsTemplate from './KeyboardShortcutVariants.story.vue';

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
    table: { disable: true },
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

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtKeyboardShortcutDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtKeyboardShortcutVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
