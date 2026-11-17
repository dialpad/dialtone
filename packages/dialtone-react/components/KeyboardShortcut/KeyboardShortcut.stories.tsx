import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtKeyboardShortcut, type DtKeyboardShortcutProps } from './KeyboardShortcut';
import { SHORTCUTS_ALIASES_LIST } from './KeyboardShortcutConstants';
import { cx } from '../../common/cx';

// Default Prop Values
export const argsData = {
  shortcut: '{cmd}+Ctrl+X',
} satisfies Partial<DtKeyboardShortcutProps>;

export const argTypesData = {
  shortcut: {
    description: `Include any of these tokens in your string to render the corresponding symbol:<br>
      ${SHORTCUTS_ALIASES_LIST.join(', ')}`,
    control: 'text',
  },
  inverted: {
    table: { disable: true },
  },
} satisfies Meta<DtKeyboardShortcutProps>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Keyboard Shortcut',
  component: DtKeyboardShortcut,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<DtKeyboardShortcutProps>;

export default meta;
type Story = StoryObj<DtKeyboardShortcutProps>;

// KeyboardShortcutDefault.story.vue
function KeyboardShortcutDefault ({ inverted, shortcut, screenReaderText }: DtKeyboardShortcutProps) {
  return (
    <div className={cx('d-p-100', { 'd-bgc-black-900': inverted })}>
      <DtKeyboardShortcut inverted={inverted} shortcut={shortcut} screenReaderText={screenReaderText} />
    </div>
  );
}

// KeyboardShortcutVariants.story.vue
const availableVariants = SHORTCUTS_ALIASES_LIST.join('+').trim();

function KeyboardShortcutVariants () {
  return (
    <div>
      <div className="d-p-100">
        <h1 className="d-fs-200">
          Default shortcut
        </h1>
        <DtKeyboardShortcut shortcut="Option+{cmd}+{win}+Shift+{arrow-up}" />
      </div>

      <div className="d-p-100 d-bgc-contrast">
        <h1 className="d-fc-primary-inverted d-fs-200">
          Inverted style
        </h1>
        <DtKeyboardShortcut shortcut="{win}+{arrow-right}+{arrow-left}+{arrow-up}+{arrow-down}+E+B" inverted />
      </div>

      <div className="d-p-100">
        <h1 className="d-fs-200">
          Shortcut size variation
        </h1>
        <DtKeyboardShortcut className="d-fs-200" shortcut="{cmd}+Y" />
      </div>

      <div className="d-p-100">
        <h1 className="d-fs-200">
          All available shortcut aliases
        </h1>
        <DtKeyboardShortcut shortcut={availableVariants} />
      </div>

      <div className="d-p-100">
        <h1 className="d-fs-200">
          Inline with text and screen reader text
        </h1>
        <p>
          Press{' '}
          <DtKeyboardShortcut screenReaderText="Ctrl and F5" shortcut="Ctrl + F5" />
          {' '}to hard refresh the page.
        </p>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: args => <KeyboardShortcutDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <KeyboardShortcutVariants />,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
