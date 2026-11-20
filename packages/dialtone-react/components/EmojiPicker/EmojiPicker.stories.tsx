import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import customEmojiJson from '../../common/custom-emoji.json';
import { DtButton } from '../Button';
import { DtIcon } from '../Icon';
import { DtPopover } from '../Popover';
import { DtEmojiPicker, type DtEmojiPickerProps } from './EmojiPicker';
import type { EmojiPickerSkinTone } from './EmojiPickerConstants';

// showPopover is a story-only arg, as in Vue, where Percy sets it.
type EmojiPickerStoryArgs = DtEmojiPickerProps & { showPopover?: boolean };

const recentlyUsedEmojis = [
  {
    name: 'thumbs up',
    category: 'people',
    shortname: ':thumbsup:',
    shortname_alternates: [':+1:', ':thumbup:'],
    keywords: ['+1', 'hand', 'thumb', 'up', 'uc6'],
    unicode_output: '1f44d',
    unicode_character: '1f44d',
  },
  {
    name: 'thumbs up: medium-light skin tone',
    category: 'people',
    shortname: ':thumbsup_tone2:',
    shortname_alternates: [':+1_tone2:', ':thumbup_tone2:'],
    keywords: ['+1', 'hand', 'medium-light skin tone', 'thumb', 'up', 'uc8'],
    unicode_output: '1f44d-1f3fc',
    unicode_character: '1f44d-1f3fc',
  },
  {
    name: 'thumbs up: dark skin tone',
    category: 'people',
    shortname: ':thumbsup_tone5:',
    shortname_alternates: [':+1_tone5:', ':thumbup_tone5:'],
    keywords: ['+1', 'dark skin tone', 'hand', 'thumb', 'up', 'uc8'],
    unicode_output: '1f44d-1f3ff',
    unicode_character: '1f44d-1f3ff',
  },
  {
    name: 'person: light skin tone',
    category: 'people',
    shortname: ':adult_tone1:',
    shortname_alternates: [':adult_light_skin_tone:'],
    keywords: ['gender-neutral', 'light skin tone', 'uc10'],
    unicode_output: '1f9d1-1f3fb',
    unicode_character: '1f9d1-1f3fb',
  },
  {
    name: 'woman with veil: dark skin tone',
    category: 'people',
    shortname: ':woman_with_veil_tone5:',
    shortname_alternates: [':woman_with_veil_dark_skin_tone:'],
    keywords: ['uc13'],
    unicode_output: '1f470-1f3ff-200d-2640-fe0f',
    unicode_character: '1f470-1f3ff-2640',
  },
];

const customEmojis = customEmojiJson;

export const argsData = {
  onSkinTone: action('skin-tone'),
  onAddEmoji: action('add-emoji'),
  onSelectedEmoji: action('selected-emoji'),
  onClose: action('close'),
  onScrollBottomReached: action('scroll-bottom-reached'),
  recentlyUsedEmojis,
  customEmojis,
  skinTone: 'Default',
  showPopover: false,
  showAddEmojiButton: true,
} satisfies EmojiPickerStoryArgs;

export const argTypesData = {
  skinTone: {
    options: ['Default', 'Light', 'MediumLight', 'Medium', 'MediumDark', 'Dark'],
    control: 'select',
  },
  searchQuery: {
    control: 'text',
  },
  showSearch: {
    control: 'boolean',
  },
  showAddEmojiButton: {
    control: 'boolean',
  },
  onSkinTone: {
    table: {
      disable: true,
    },
  },
  onSelectedEmoji: {
    table: {
      disable: true,
    },
  },
  onAddEmoji: {
    table: {
      disable: true,
    },
  },
  onClose: {
    table: {
      disable: true,
    },
  },
  onScrollBottomReached: {
    table: {
      disable: true,
    },
  },
  showPopover: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<EmojiPickerStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Emoji Picker',
  component: DtEmojiPicker,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    a11y: {
      disable: true,
    },
  },
} satisfies Meta<EmojiPickerStoryArgs>;

export default meta;
type Story = StoryObj<EmojiPickerStoryArgs>;

// EmojiPickerDefault.story.vue: the story keeps the skin tone the picker reports, starting from Default.
function EmojiPickerDefault (args: EmojiPickerStoryArgs) {
  const [skinTone, setSkinTone] = useState<EmojiPickerSkinTone>('Default');

  return (
    <DtEmojiPicker
      skinTone={skinTone}
      recentlyUsedEmojis={args.recentlyUsedEmojis}
      customEmojis={args.customEmojis}
      searchQuery={args.searchQuery}
      showSearch={args.showSearch}
      showAddEmojiButton={args.showAddEmojiButton}
      onSkinTone={setSkinTone}
      onSelectedEmoji={args.onSelectedEmoji}
      onScrollBottomReached={args.onScrollBottomReached}
      onAddEmoji={args.onAddEmoji}
    />
  );
}

// EmojiPickerPopover.story.vue
function EmojiPickerWithPopover (args: EmojiPickerStoryArgs) {
  const [skinTone, setSkinTone] = useState<EmojiPickerSkinTone>('Default');
  const [emojiPickerOpened, setEmojiPickerOpened] = useState(args.showPopover ?? false);

  const toggleEmojiPicker = () => {
    setEmojiPickerOpened(opened => !opened);
  };

  return (
    <DtPopover
      open={emojiPickerOpened}
      initialFocusElement="#searchInput"
      padding="none"
      onOpened={(open) => { setEmojiPickerOpened(open); }}
      anchor={({ attrs }) => (
        <DtButton
          {...attrs}
          aria-label="Choose an emoji"
          size={200}
          circle
          importance="clear"
          onClick={toggleEmojiPicker}
          startIcon={<DtIcon name="satisfied" size="300" />}
        />
      )}
      content={(
        <DtEmojiPicker
          skinTone={skinTone}
          recentlyUsedEmojis={args.recentlyUsedEmojis}
          onSkinTone={setSkinTone}
          onSelectedEmoji={args.onSelectedEmoji}
        />
      )}
    />
  );
}

// Stories
export const Default: Story = {
  render: args => <EmojiPickerDefault {...args} />,
  args: {},
};

export const WithPopover: Story = {
  render: args => <EmojiPickerWithPopover {...args} />,
  args: {},
  parameters: {
    options: {
      showPanel: false,
    },
    controls: {
      disable: true,
    },
    percy: {
      args: {
        showPopover: true,
      },
    },
  },
};
