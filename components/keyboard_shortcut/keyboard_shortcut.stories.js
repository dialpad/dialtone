import { SHORTCUTS_ALIASES_LIST } from './keyboard_shortcut_constants';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtKeyboardShortcut from './keyboard_shortcut.vue';
import DtKeyboardShortcutMdx from './keyboard_shortcut.mdx';
import DtKeyboardShortcutDefaultTemplate from './keyboard_shortcut_default.story.vue';
import DtKeyboardShortcutVariantsTemplate from './keyboard_shortcut_variants.story.vue';

export const argTypesData = {
  shortcut: {
    description: `Include any of these tokens in your string to render the corresponding symbol:<br>
      ${SHORTCUTS_ALIASES_LIST.join(', ')}`,
    defaultValue: `{cmd}+Ctrl+X`,
    control: 'text',
  },
};

// Story Collection
export default {
  title: 'Components/Keyboard Shortcut',
  component: DtKeyboardShortcut,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DtKeyboardShortcutMdx,
    },
    options: {
      showPanel: true,
    },
  },
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

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
