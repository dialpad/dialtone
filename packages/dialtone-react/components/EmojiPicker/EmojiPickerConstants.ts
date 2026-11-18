export const ARROW_KEYS = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
} as const;

export const CDN_URL = 'https://static.dialpadcdn.com/joypixels/png/unicode/32/';
export const EMOJIS_PER_ROW = 9;
export const EMOJI_PICKER_SKIN_TONE_MODIFIERS = {
  DEFAULT: 'Default',
  LIGHT: 'Light',
  MEDIUM_LIGHT: 'MediumLight',
  MEDIUM: 'Medium',
  MEDIUM_DARK: 'MediumDark',
  DARK: 'Dark',
} as const;

export type EmojiPickerSkinTone =
  (typeof EMOJI_PICKER_SKIN_TONE_MODIFIERS)[keyof typeof EMOJI_PICKER_SKIN_TONE_MODIFIERS];

/**
 * An emoji as the picker lists and reports it: an entry of `@dialpad/dialtone-emojis`, or a custom emoji, which has
 * `date_added` and `image`.
 */
export interface EmojiPickerEmoji {
  name: string;
  shortname?: string;
  keywords?: string[];
  unicode_character?: string;
  unicode_output?: string;
  date_added?: number;
  image?: string;
}

/** What `onSelectedEmoji` reports: the emoji, and whether Shift was held. */
export type EmojiPickerSelectedEmoji = EmojiPickerEmoji & { shift_key: boolean };

export default {
  EMOJI_PICKER_SKIN_TONE_MODIFIERS,
};
