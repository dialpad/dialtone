import { act, cleanup, fireEvent, render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DtEmojiPicker, type DtEmojiPickerProps } from './EmojiPicker';

const MOCK_RECENTLY_USED_EMOJIS = [
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
const MOCK_CUSTOM_EMOJIS = [
  {
    name: 'shipit',
    date_added: 1730918816847,
    added_by: 'Ignacio Ropolo',
    image: 'https://github.githubassets.com/images/icons/emoji/shipit.png',
    unicode_character: '1f44d',
  },
  {
    name: 'thumbs up',
    category: 'people',
    shortname: ':thumbsup:',
    shortname_alternates: [':+1:', ':thumbup:'],
    keywords: ['+1', 'hand', 'thumb', 'up', 'uc6'],
    unicode_output: '1f44d',
    unicode_character: '1f44d',
  },
];
const MOCK_TAB_SET_LABELS = [
  'Most recently used',
  'Smileys and people',
  'Nature',
  'Food',
  'Activity',
  'Travel',
  'Objects',
  'Symbols',
  'Flags',
  'Custom',
];
const MOCK_SKIN_SELECTOR_BUTTON_TOOLTIP_LABEL = 'Change default skin tone';
const MOCK_SEARCH_RESULTS_LABEL = 'Search results';
const MOCK_SEARCH_PLACEHOLDER_LABEL = 'Search...';

const baseProps: DtEmojiPickerProps = {
  skinTone: 'Light',
  recentlyUsedEmojis: MOCK_RECENTLY_USED_EMOJIS,
  customEmojis: MOCK_CUSTOM_EMOJIS,
};

let mockProps: DtEmojiPickerProps = {};

describe('DtEmojiPicker Tests', () => {
  let result: RenderResult;
  let skinToneSelectorButton: HTMLElement;
  let skinToneSelectorImg: HTMLElement;
  let skinToneMediumLightButton: HTMLElement;

  const onAddEmoji = vi.fn();
  const onSelectedEmoji = vi.fn();
  const onSkinTone = vi.fn();

  const find = (selector: string) => document.body.querySelector<HTMLElement>(selector);
  const findAll = (selector: string) => Array.from(document.body.querySelectorAll<HTMLElement>(selector));

  const element = () => (
    <DtEmojiPicker
      onAddEmoji={onAddEmoji}
      onSelectedEmoji={onSelectedEmoji}
      onSkinTone={onSkinTone}
      {...baseProps}
      {...mockProps}
    />
  );

  const setChildren = () => {
    skinToneSelectorButton = find('[data-qa="dt-emoji-picker-skin-toggle"]')!;
    skinToneSelectorImg = skinToneSelectorButton.querySelector<HTMLElement>('[data-qa="dt-emoji-picker-skin-image"]')!;
    skinToneMediumLightButton = find('[data-qa="dt-emoji-picker-skin-list"]')!
      .querySelectorAll<HTMLElement>('[data-qa="dt-emoji-picker-skin-option"]')[1];
  };

  const updateWrapper = () => {
    cleanup();
    result = render(element());
    setChildren();
  };

  const setProps = (props: DtEmojiPickerProps) => {
    mockProps = { ...mockProps, ...props };
    result.rerender(element());
  };

  const tabs = () => findAll('[data-qa="dt-emoji-picker-tabset"] [data-qa="dt-tab"]');
  const searchInput = () => find('[data-qa="dt-emoji-picker-search"] [data-qa="dt-input-input"]')!;
  const firstEmoji = () => find('[data-qa="dt-emoji-picker-selector"] [data-qa="dt-emoji-picker-emoji"]')!;

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the emoji picker', () => {
      expect(find('[data-qa="dt-emoji-picker"]')).not.toBeNull();
    });

    it('Should render the tabset selector', () => {
      expect(find('[data-qa="dt-emoji-picker-tabset"]')).not.toBeNull();
    });

    it('Should render the input search', () => {
      expect(find('[data-qa="dt-emoji-picker-search"]')).not.toBeNull();
    });

    it('Should render the emoji selector', () => {
      expect(find('[data-qa="dt-emoji-picker-selector"]')).not.toBeNull();
    });

    it('Should render the skin selector', () => {
      expect(find('[data-qa="skin-selector"]')).not.toBeNull();
    });

    it('Should render the emoji description', () => {
      expect(find('[data-qa="dt-emoji-picker-description"]')).not.toBeNull();
    });

    it('Should render recently emojis tabset', () => {
      const firstButton = tabs()[0];

      expect(firstButton).toBeDefined();
      expect(firstButton).toHaveAttribute('aria-label', MOCK_TAB_SET_LABELS[0]);
    });

    it('Should render customs emojis tabset', () => {
      const lastButton = tabs()[MOCK_TAB_SET_LABELS.length - 1];

      expect(lastButton).toBeDefined();
      expect(lastButton).toHaveAttribute('aria-label', MOCK_TAB_SET_LABELS[MOCK_TAB_SET_LABELS.length - 1]);
    });

    it('Should render provided search placeholder label', () => {
      expect(searchInput()).not.toBeNull();
      expect(searchInput()).toHaveAttribute('placeholder', MOCK_SEARCH_PLACEHOLDER_LABEL);
    });

    it('Should render correct labels in emojis tabset', () => {
      const firstButton = tabs()[3];

      expect(firstButton).toBeDefined();
      expect(firstButton).toHaveAttribute('aria-label', MOCK_TAB_SET_LABELS[3]);
    });

    it('Should render correct amount of tabs in emoji tabset', () => {
      expect(tabs()).toHaveLength(MOCK_TAB_SET_LABELS.length);
    });

    it('Fixed label should be the first tabset label', () => {
      const fixedLabel = find('[data-qa="dt-emoji-picker-sticky-label"]');

      expect(fixedLabel).not.toBeNull();
      expect(fixedLabel!.textContent?.trim()).toEqual(MOCK_TAB_SET_LABELS[0]);
    });

    it('Should render add emoji button', () => {
      mockProps = { showAddEmojiButton: true };

      updateWrapper();

      const addEmojiButton = find('[data-qa="dt-emoji-picker-footer"] [data-qa="dt-button"]');

      expect(addEmojiButton).not.toBeNull();
      expect(addEmojiButton).toHaveAttribute('aria-label', 'Add emoji');
    });

    describe('Skin tone selector tests', () => {
      it('Should render provided skin selector button tooltip label', () => {
        expect(skinToneSelectorButton).not.toBeNull();
        expect(skinToneSelectorButton).toHaveAttribute('aria-label', MOCK_SKIN_SELECTOR_BUTTON_TOOLTIP_LABEL);
      });

      it('Should render provided skin tone in skin tone selector', () => {
        expect(skinToneSelectorImg).not.toBeNull();
        expect(skinToneSelectorImg).toHaveAttribute('aria-label', ':wave_tone1:');
      });

      it('Should display skin tone selected from selector', async () => {
        const user = userEvent.setup();

        expect(skinToneSelectorImg).toHaveAttribute('aria-label', ':wave_tone1:');

        await user.click(skinToneSelectorButton);
        await user.click(skinToneMediumLightButton);

        expect(skinToneSelectorImg).not.toBeNull();
        expect(skinToneSelectorImg).toHaveAttribute('aria-label', ':wave_tone2:');
      });

      it('Should display skin tone prop if it changes', async () => {
        const user = userEvent.setup();

        expect(skinToneSelectorImg).toHaveAttribute('aria-label', ':wave_tone1:');

        await user.click(skinToneSelectorButton);
        await user.click(skinToneMediumLightButton);

        expect(skinToneSelectorImg).toHaveAttribute('aria-label', ':wave_tone2:');

        setProps({ skinTone: 'Dark' });

        expect(skinToneSelectorImg).not.toBeNull();
        expect(skinToneSelectorImg).toHaveAttribute('aria-label', ':wave_tone5:');
      });
    });

    describe('When recently emojis is not provided', () => {
      let firstButton: HTMLElement;

      beforeEach(() => {
        setProps({ recentlyUsedEmojis: [] });

        firstButton = tabs()[0];
      });

      it('Should not render recently emojis tabset', () => {
        expect(firstButton).toBeDefined();
        expect(firstButton).not.toHaveAttribute('aria-label', MOCK_TAB_SET_LABELS[0]);
        expect(firstButton).toHaveAttribute('aria-label', MOCK_TAB_SET_LABELS[1]);
      });
    });

    describe('When customs emojis is not provided', () => {
      it('Should not render customs emojis tabset', () => {
        // Vue's test also passes tabSetLabels, which isn't a prop: the labels come from the picker's messages.
        mockProps = {
          ...baseProps,
          customEmojis: [],
        };

        updateWrapper();

        const lastButton = tabs()[MOCK_TAB_SET_LABELS.length - 2];

        expect(lastButton).toBeDefined();
        expect(lastButton).not.toHaveAttribute('aria-label', MOCK_TAB_SET_LABELS[MOCK_TAB_SET_LABELS.length - 1]);
        expect(lastButton).toHaveAttribute('aria-label', MOCK_TAB_SET_LABELS[MOCK_TAB_SET_LABELS.length - 2]);
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('Should emit add-emoji event when add emoji button is clicked', async () => {
      mockProps = { showAddEmojiButton: true };

      updateWrapper();

      const addEmojiButton = find('[data-qa="dt-emoji-picker-footer"] [data-qa="dt-button"]');

      expect(addEmojiButton).not.toBeNull();

      // A pointer click would hover an emoji on its way; Vue's test triggers the click alone.
      fireEvent.click(addEmojiButton!);

      expect(onAddEmoji).toHaveBeenCalled();
    });

    it('Should emit selected-emoji event when emoji is clicked', async () => {
      const user = userEvent.setup();

      expect(firstEmoji()).not.toBeNull();

      await user.click(firstEmoji());

      expect(onSelectedEmoji).toHaveBeenCalled();
    });

    describe('On search', () => {
      it('Fixed label should change on search input', async () => {
        const user = userEvent.setup();

        await user.type(searchInput(), 'tube');

        const fixedLabel = find('[data-qa="dt-emoji-picker-search-results-label"]');

        expect(fixedLabel!.textContent?.trim()).toBe(MOCK_SEARCH_RESULTS_LABEL);
      });

      it('Input search should filter emojis', async () => {
        const user = userEvent.setup();

        expect(find('[data-qa="filtered-emojis"]')).toBeNull();

        await user.type(searchInput(), 'tube');

        expect(find('[data-qa="filtered-emojis"]')).not.toBeNull();
      });
    });

    it('Should describe the emoji when is hovered', async () => {
      const user = userEvent.setup();
      const emojiData = find('[data-qa="dt-emoji-picker-description"]')!;

      expect(firstEmoji()).not.toBeNull();

      await user.hover(firstEmoji());

      expect(emojiData.textContent?.trim()).toBe('thumbs up');
    });

    describe('On skin tone selector click', () => {
      it('Should open the skin selector', async () => {
        const user = userEvent.setup();
        const skinToneSelector = find('[data-qa="dt-emoji-picker-skin-list"]')!;

        expect(skinToneSelector.getAttribute('style')).toMatch('display: none');

        await user.click(skinToneSelectorButton);

        expect(skinToneSelector.getAttribute('style') ?? '').not.toMatch('display: none');
      });

      it('Should emit skin-tone event with selected skin tone', async () => {
        const user = userEvent.setup();
        const skinToneSelector = find('[data-qa="dt-emoji-picker-skin-list"]')!;
        const skinTone = skinToneSelector.querySelectorAll<HTMLElement>('[data-qa="dt-emoji-picker-skin-option"]')[1];

        await user.click(skinToneSelectorButton);
        await user.click(skinTone);

        expect(onSkinTone).toHaveBeenCalled();
        expect(onSkinTone.mock.calls[0]).toEqual(['MediumLight']);
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('Input search should be focus on mount', () => {
      expect(searchInput()).toBe(document.activeElement);
    });

    it('Should focus the first available emoji when down keyarrow is pressed', () => {
      fireEvent.keyDown(searchInput(), { key: 'ArrowDown' });

      expect(document.activeElement).toBe(firstEmoji());
    });

    it('Should jump through all the first emojis of each tab', () => {
      const [
        firstRecentlyUsed, // Thumbs up emoji - Recently used
        firstPeople, // Skull and crossbones - People
        firstNature, // Sun - Nature
        firstFood, // Coffe - Food
        firstActivity, // Soccer ball - Activity
        firstTravel, // Anchor - Travel
        firstObjects, // Keyboard - Objects
        firstSymbols, // Exclamation question mark - Symbols
        firstFlags, // White flag - Flags
        firstCustoms, // shipit - Customs
      ] = findAll('[data-qa="dt-emoji-picker-group"]')
        .map(group => group.querySelector<HTMLElement>('[data-qa="dt-emoji-picker-emoji"]')!);

      fireEvent.keyDown(firstRecentlyUsed, { key: 'Tab' });

      expect(document.activeElement).toBe(firstPeople);

      fireEvent.keyDown(firstPeople, { key: 'Tab' });

      expect(document.activeElement).toBe(firstNature);

      fireEvent.keyDown(firstNature, { key: 'Tab' });

      expect(document.activeElement).toBe(firstFood);

      fireEvent.keyDown(firstFood, { key: 'Tab' });

      expect(document.activeElement).toBe(firstActivity);

      fireEvent.keyDown(firstActivity, { key: 'Tab' });

      expect(document.activeElement).toBe(firstTravel);

      fireEvent.keyDown(firstTravel, { key: 'Tab' });

      expect(document.activeElement).toBe(firstObjects);

      fireEvent.keyDown(firstObjects, { key: 'Tab' });

      expect(document.activeElement).toBe(firstSymbols);

      fireEvent.keyDown(firstSymbols, { key: 'Tab' });

      expect(document.activeElement).toBe(firstFlags);

      fireEvent.keyDown(firstFlags, { key: 'Tab' });

      expect(document.activeElement).toBe(firstCustoms);
    });

    it('Should jump to skin selector from emoji-selector', () => {
      const firstCustoms = findAll('[data-qa="dt-emoji-picker-group"]').at(-1)!
        .querySelector<HTMLElement>('[data-qa="dt-emoji-picker-emoji"]')!;

      fireEvent.keyDown(firstCustoms, { key: 'Tab' });

      expect(document.activeElement).toBe(skinToneSelectorButton);
    });

    it('Should jump to first tab in tabset from  skin selector', () => {
      fireEvent.keyDown(skinToneSelectorButton, { key: 'Tab' });

      expect(document.activeElement).toBe(tabs()[0]);
    });

    it('Should jump to search input from tabset', () => {
      fireEvent.keyDown(tabs()[0], { key: 'Tab' });

      expect(document.activeElement).toBe(searchInput());
    });

    it('Should jump to the first emoji from tabset if showSearch is false', () => {
      mockProps = { showSearch: false };

      updateWrapper();

      const firstTab = tabs()[0];
      const firstGroupEmoji = findAll('[data-qa="dt-emoji-picker-group"]')[0]
        .querySelector<HTMLElement>('[data-qa="dt-emoji-picker-emoji"]');

      act(() => firstTab.focus());
      fireEvent.keyDown(firstTab, { key: 'Tab' });

      expect(document.activeElement).toBe(firstGroupEmoji);
    });
  });

  describe('React-only Tests', () => {
    it('Should emit close when Escape is pressed in the picker', () => {
      const onClose = vi.fn();
      mockProps = { onClose };

      updateWrapper();

      fireEvent.keyDown(firstEmoji(), { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('Should show the search results after the debounce', () => {
      vi.useFakeTimers();
      mockProps = { searchQuery: '' };
      updateWrapper();

      setProps({ searchQuery: 'tube' });

      // Before the debounce, the results are still the previous search's (every emoji), as in Vue.
      expect(findAll('[data-qa="filtered-emojis"] [data-qa="dt-emoji-picker-emoji"]').length).toBeGreaterThan(100);

      act(() => { vi.advanceTimersByTime(300); });

      const results = findAll('[data-qa="filtered-emojis"] [data-qa="dt-emoji-picker-emoji"]');
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThan(10);
      expect(results[0]).toHaveClass('hover-emoji');
    });

    it('Should highlight the first result again when the previous search returns before the debounce', () => {
      vi.useFakeTimers();
      mockProps = { searchQuery: '' };
      updateWrapper();

      setProps({ searchQuery: 'tube' });
      act(() => { vi.advanceTimersByTime(300); });
      setProps({ searchQuery: '' });
      setProps({ searchQuery: 'tube' });
      act(() => { vi.advanceTimersByTime(300); });

      fireEvent.keyDown(searchInput(), { key: 'Enter' });

      expect(onSelectedEmoji).toHaveBeenCalledTimes(1);
      expect(onSelectedEmoji.mock.calls[0][0]).not.toBeNull();
    });

    it('Should select the tab clicked and clear the search', async () => {
      const user = userEvent.setup();

      await user.type(searchInput(), 'tube');
      await user.click(tabs()[2]);

      expect(searchInput()).toHaveValue('');
      expect(find('[data-qa="filtered-emojis"]')).toBeNull();
      expect(tabs()[2]).toHaveAttribute('aria-selected', 'true');
    });
  });
});
