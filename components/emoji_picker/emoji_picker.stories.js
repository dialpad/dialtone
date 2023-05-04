import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtEmojiPicker from './emoji_picker.vue';
import DtEmojiPickerDefaultTemplate from './emoji_picker_default.story.vue';

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

// Default Prop Values
export const argsData = {
  onSkinTone: action('skin-tone'),
  onSelectedEmoji: action('selected-emoji'),
  tabSetLabels: [
    'Most recently used',
    'Smileys and people',
    'Nature',
    'Food',
    'Activity',
    'Travel',
    'Objects',
    'Symbols',
    'Flags',
  ],
  skinTone: 'Light',
  recentlyUsedEmojis,
  skinSelectorButtonTooltipLabel: 'Change default skin tone',
  searchNoResultsLabel: 'No results',
  searchResultsLabel: 'Search results',
  searchPlaceholderLabel: 'Search...',
};

export const argTypesData = {
  skinTone: {
    options: ['Default', 'Light', 'MediumLight', 'Medium', 'MediumDark', 'Dark'],
    control: 'select',
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
};

// Story Collection
export default {
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
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtEmojiPickerDefaultTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,
  args: {},
};
