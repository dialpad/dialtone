import { ref } from 'vue';
import { DialtoneLocalization } from '@/localization/index.js';

/**
 * Composable that provides mock reaction data for Storybook stories
 * @returns {Object} Object containing mockReactions ref
 */
export function useMockReactions() {
  const i18n = new DialtoneLocalization();

  const mockReactions = ref([
    {
      emojiUnicodeOrShortname: '😀',
      isSelected: true,
      names: i18n.$t('STORYBOOK_YOU'),
      num: 1,
    },
    {
      emojiUnicodeOrShortname: '😒',
      isSelected: false,
      names: 'John Doe',
      num: 1,
    },
    {
      emojiUnicodeOrShortname: '😌',
      isSelected: false,
      names: i18n.$t('STORYBOOK_REACTION_NAMES_2'),
      num: 5,
    },
    {
      emojiUnicodeOrShortname: ':blinkingguy:',
      names: i18n.$t('STORYBOOK_REACTION_NAMES_3'),
      isSelected: true,
      num: 2,
    },
  ]);

  return {
    mockReactions,
  };
}
