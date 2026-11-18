import type { Meta, StoryObj } from '@storybook/react-vite';
import { ICON_SIZE_MODIFIERS } from '../Icon/IconConstants';
import { DtButton } from '../Button';
import { DtStack } from '../Stack';
import { DtEmojiTextWrapper, type DtEmojiTextWrapperProps } from './EmojiTextWrapper';

// The default slot is an arg named `default`, as in Vue, so both Storybooks share the arg.
type EmojiTextWrapperStoryArgs = Omit<DtEmojiTextWrapperProps, 'children'> & { default?: string };

// Default Prop Values
export const argsData = {
  size: '500',
} satisfies Partial<EmojiTextWrapperStoryArgs>;

/**
 * example prop description decorator
 */
export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'string | VNode',
      },
    },
  },

  // Props
  // `type` (not in Vue's argTypes) is set on the prop react-docgen reports as a union: Storybook drops a URL value
  // for a union arg, so without it the comparison couldn't drive it in the React frame.
  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
    type: 'string',
  },
  elementType: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'div' },
    },
    control: {
      type: 'text',
    },
  },
} satisfies Meta<EmojiTextWrapperStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Emoji Text Wrapper',
  component: DtEmojiTextWrapper,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<EmojiTextWrapperStoryArgs>;

export default meta;
type Story = StoryObj<EmojiTextWrapperStoryArgs>;

// EmojiTextWrapperDefault.story.vue
function EmojiTextWrapperDefault ({ default: defaultSlot, size, elementType }: EmojiTextWrapperStoryArgs) {
  return (
    <DtEmojiTextWrapper size={size} elementType={elementType}>
      {defaultSlot ? <div dangerouslySetInnerHTML={{ __html: defaultSlot }} /> : undefined}
    </DtEmojiTextWrapper>
  );
}

// EmojiTextWrapperVariants.story.vue
function EmojiTextWrapperVariants () {
  return (
    <DtStack gap="200">
      <div>
        <DtButton kind="critical" importance="primary">
          <DtEmojiTextWrapper>Button with shortcode :cry: emoji</DtEmojiTextWrapper>
        </DtButton>
      </div>
      <DtEmojiTextWrapper>
        Text only with unicode 😃 emoji
      </DtEmojiTextWrapper>
      <div>
        <DtButton importance="primary">
          <DtEmojiTextWrapper>Button wrapper :smile:</DtEmojiTextWrapper>
        </DtButton>
      </div>
      <DtEmojiTextWrapper size="800">
        Bigger emoji size :smile:
      </DtEmojiTextWrapper>
      <DtEmojiTextWrapper size="300">
        Smaller emoji size :smile:
      </DtEmojiTextWrapper>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <EmojiTextWrapperDefault {...args} />,

  args: {
    default:
      'Some text with :invalid-emoji: :smile: :cry: *️⃣ and 😄, and custom emojis :octocat: :shipit:',
  },
};

export const Variants: Story = {
  render: () => <EmojiTextWrapperVariants />,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
