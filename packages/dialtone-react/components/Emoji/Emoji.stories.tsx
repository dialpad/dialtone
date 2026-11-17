import type { Meta, StoryObj } from '@storybook/react-vite';
import { ICON_SIZE_MODIFIERS } from '../Icon/IconConstants';
import { DtStack } from '../Stack';
import { DtEmoji, type DtEmojiProps } from './Emoji';

type EmojiStoryArgs = DtEmojiProps;

// Default Prop Values
export const argsData = {
  code: ':smile:',
};

export const argTypesData = {
  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
} satisfies Meta<EmojiStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Emoji',
  component: DtEmoji,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<EmojiStoryArgs>;

export default meta;
type Story = StoryObj<EmojiStoryArgs>;

// Object.keys gives the numeric keys as strings, which IconSize accepts.
const sizes = Object.keys(ICON_SIZE_MODIFIERS) as `${keyof typeof ICON_SIZE_MODIFIERS}`[];

// EmojiDefault.story.vue
function EmojiDefault ({ code, size, imgClass, ariaLabel, showSkeleton }: EmojiStoryArgs) {
  return (
    <DtEmoji
      code={code}
      size={size}
      imgClass={imgClass}
      ariaLabel={ariaLabel}
      showSkeleton={showSkeleton}
    />
  );
}

// EmojiVariants.story.vue
function EmojiVariants () {
  return (
    <DtStack gap="50">
      {sizes.map(size => (
        <DtStack key={`emoji-size${size}`} gap="25" direction="row">
          <DtEmoji code=":smile:" size={size} />
          <label htmlFor={`emoji-size${size}`}>size {size}</label>
        </DtStack>
      ))}
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <EmojiDefault {...args} />,
  args: {},
};

export const CustomEmoji: Story = {
  render: args => <EmojiDefault {...args} />,

  args: {
    code: ':shipit:',
  },
};

export const Variants: Story = {
  render: () => <EmojiVariants />,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
