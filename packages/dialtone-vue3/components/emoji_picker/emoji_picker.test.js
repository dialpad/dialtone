import { mount } from '@vue/test-utils';
import DtEmojiPicker from './DtEmojiPicker.vue';

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
];
const MOCK_SKIN_SELECTOR_BUTTON_TOOLTIP_LABEL = 'Change default skin tone';
const MOCK_SEARCH_RESULTS_LABEL = 'Search results';
const MOCK_SEARCH_NO_RESULTS_LABEL = 'No results';
const MOCK_SEARCH_PLACEHOLDER_LABEL = 'Search...';

const baseProps = {
  skinTone: 'Light',
  skinSelectorButtonTooltipLabel: MOCK_SKIN_SELECTOR_BUTTON_TOOLTIP_LABEL,
  tabSetLabels: MOCK_TAB_SET_LABELS,
  recentlyUsedEmojis: MOCK_RECENTLY_USED_EMOJIS,
  searchResultsLabel: MOCK_SEARCH_RESULTS_LABEL,
  searchNoResultsLabel: MOCK_SEARCH_NO_RESULTS_LABEL,
  searchPlaceholderLabel: MOCK_SEARCH_PLACEHOLDER_LABEL,
};

let mockProps = {};

describe('DtEmojiPicker Tests', () => {
  let wrapper;
  let skinToneSelectorButton, skinToneSelectorImg, skinToneMediumLightButton;

  const updateWrapper = () => {
    wrapper = mount(DtEmojiPicker, {
      props: { ...baseProps, ...mockProps },
      attachTo: document.body,
    });

    skinToneSelectorButton = wrapper.find('.d-emoji-picker__skin-selected button');
    skinToneSelectorImg = wrapper.find('.d-emoji-picker__skin-selected button img');
    skinToneMediumLightButton = wrapper.find('.d-emoji-picker__skin-list').findAll('button').at(1);
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the emoji picker', () => {
      expect(wrapper.find('.d-emoji-picker').exists()).toBe(true);
    });

    it('Should render the tabset selector', () => {
      expect(wrapper.find('.d-tablist').exists()).toBe(true);
    });

    it('Should render the input search', () => {
      expect(wrapper.find('.d-emoji-picker__search').exists()).toBe(true);
    });

    it('Should render the emoji selector', () => {
      expect(wrapper.find('.d-emoji-picker__selector').exists()).toBe(true);
    });

    it('Should render the skin selector', () => {
      expect(wrapper.find('[data-qa="skin-selector"]').exists()).toBe(true);
    });

    it('Should render the emoji description', () => {
      expect(wrapper.find('.d-emoji-picker__data').exists()).toBe(true);
    });

    it('Should render recently emojis tabset', () => {
      const firstButton = wrapper.find('.d-tablist').findAll('button').at(0);

      expect(firstButton.exists()).toBe(true);
      expect(firstButton.attributes('aria-label')).toBe(MOCK_TAB_SET_LABELS[0]);
    });

    it('Should render provided search placeholder label', () => {
      const searchInput = wrapper.find('.d-emoji-picker__search input');

      expect(searchInput.exists()).toBe(true);
      expect(searchInput.attributes('placeholder')).toBe(MOCK_SEARCH_PLACEHOLDER_LABEL);
    });

    it('Should render correct labels in emojis tabset', () => {
      const firstButton = wrapper.find('.d-tablist').findAll('button').at(3);

      expect(firstButton.exists()).toBe(true);
      expect(firstButton.attributes('aria-label')).toBe(MOCK_TAB_SET_LABELS[3]);
    });

    it('Should render correct amount of tabs in emoji tabset', () => {
      const TabsCount = wrapper.find('.d-tablist').findAll('button').length;

      expect(TabsCount).toBe(MOCK_TAB_SET_LABELS.length);
    });

    it('Fixed label should be the first tabset label', () => {
      const fixedLabel = wrapper.find('.d-emoji-picker__alignment p');

      expect(fixedLabel.exists()).toBe(true);
      expect(fixedLabel.text()).toEqual(MOCK_TAB_SET_LABELS[0]);
    });

    describe('Skin tone selector tests', () => {
      it('Should render provided skin selector button tooltip label', () => {
        expect(skinToneSelectorButton.exists()).toBe(true);
        expect(skinToneSelectorButton.attributes('aria-label')).toBe(MOCK_SKIN_SELECTOR_BUTTON_TOOLTIP_LABEL);
      });

      it('Should render provided skin tone in skin tone selector', () => {
        expect(skinToneSelectorImg.exists()).toBe(true);
        expect(skinToneSelectorImg.attributes('aria-label')).toBe(':wave_tone1:');
      });

      it('Should display skin tone selected from selector', async () => {
        expect(skinToneSelectorImg.exists()).toBe(true);
        expect(skinToneSelectorImg.attributes('aria-label')).toBe(':wave_tone1:');

        await skinToneSelectorButton.trigger('click');
        await wrapper.vm.$nextTick();
        await skinToneMediumLightButton.trigger('click');
        await wrapper.vm.$nextTick();

        expect(skinToneSelectorImg.exists()).toBe(true);
        expect(skinToneSelectorImg.attributes('aria-label')).toBe(':wave_tone2:');
      });

      it('Should display skin tone prop if it changes', async () => {
        expect(skinToneSelectorImg.exists()).toBe(true);
        expect(skinToneSelectorImg.attributes('aria-label')).toBe(':wave_tone1:');

        await skinToneSelectorButton.trigger('click');
        await wrapper.vm.$nextTick();
        await skinToneMediumLightButton.trigger('click');
        await wrapper.vm.$nextTick();

        expect(skinToneSelectorImg.exists()).toBe(true);
        expect(skinToneSelectorImg.attributes('aria-label')).toBe(':wave_tone2:');

        await wrapper.setProps({ skinTone: 'Dark' });

        expect(skinToneSelectorImg.exists()).toBe(true);
        expect(skinToneSelectorImg.attributes('aria-label')).toBe(':wave_tone5:');
      });
    });

    describe('When recently emojis is not provided', () => {
      it('Should not render recently emojis tabset', () => {
        mockProps = {
          ...baseProps,
          recentlyUsedEmojis: [],
          tabSetLabels: [
            'Smileys and people',
            'Nature',
            'Food',
            'Activity',
            'Travel',
            'Objects',
            'Symbols',
            'Flags',
          ],
        };

        updateWrapper();

        const firstButton = wrapper.find('.d-tablist').findAll('button').at(0);

        expect(firstButton.exists()).toBe(true);
        expect(firstButton.attributes('aria-label')).not.toBe(MOCK_TAB_SET_LABELS[0]);
        expect(firstButton.attributes('aria-label')).toBe(MOCK_TAB_SET_LABELS[1]);
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('Should emit selected-emoji event when emoji is clicked', async () => {
      const emoji = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__tab button');

      expect(emoji.exists()).toBe(true);

      await emoji.trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('selected-emoji')).toBeTruthy();
    });

    describe('On search', () => {
      it('Fixed label should change on search input', async () => {
        const searchInput = wrapper.find('.d-emoji-picker__search input');

        searchInput.setValue('tube');

        await searchInput.trigger('input');
        await wrapper.vm.$nextTick();

        const fixedLabel = wrapper.find('.d-emoji-picker__search-label');

        expect(fixedLabel.text()).toBe(MOCK_SEARCH_RESULTS_LABEL);
      });

      it('Input search should filter emojis', async () => {
        const searchInput = wrapper.find('.d-emoji-picker__search input');

        expect(wrapper.find('[data-qa="filtered-emojis"]').exists()).toBe(false);

        searchInput.setValue('tube');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="filtered-emojis"]').exists()).toBe(true);
      });
    });

    it('Should describe the emoji when is hovered', async () => {
      const emoji = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__tab button');
      const emojiData = wrapper.find('.d-emoji-picker__data');

      expect(emoji.exists()).toBe(true);

      await emoji.trigger('mouseover');
      await wrapper.vm.$nextTick();

      expect(emojiData.text()).toBe('thumbs up');
    });

    describe('On skin tone selector click', () => {
      it('Should open the skin selector', async () => {
        const skinToneSelectorButton = wrapper.find('.d-emoji-picker__skin-selected button');
        const skinToneSelector = wrapper.find('.d-emoji-picker__skin-list');

        expect(skinToneSelector.attributes('style')).toMatch('display: none');

        await skinToneSelectorButton.trigger('click');
        await wrapper.vm.$nextTick();

        expect(skinToneSelector.attributes('style')).not.toMatch('display: none');
      });

      it('Should emit skin-tone event with selected skin tone', async () => {
        const skinToneSelectorButton = wrapper.find('.d-emoji-picker__skin-selected button');
        const skinToneSelector = wrapper.find('.d-emoji-picker__skin-list');
        const skinTone = skinToneSelector.findAll('button').at(1);

        await skinToneSelectorButton.trigger('click');
        await wrapper.vm.$nextTick();
        await skinTone.trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('skin-tone')).toBeTruthy();
        expect(wrapper.emitted('skin-tone')[0]).toEqual(['MediumLight']);
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('Input search should be focus on mount', () => {
      const searchInput = wrapper.find('.d-emoji-picker__search input');

      expect(searchInput.element).toBe(document.activeElement);
    });

    it('Should focus the first available emoji when down keyarrow is pressed', async () => {
      const searchInput = wrapper.find('.d-emoji-picker__search input');
      const emoji = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__tab button');

      await searchInput.trigger('keydown.down');

      expect(document.activeElement).toBe(emoji.element);
    });

    it('Should jump through all the first emojis of each tab', async () => {
      // Thumbs up emoji - Recently used
      const firstRecentlyUsed = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(2) button');
      // Skull and crossbones - People
      const firstPeople = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(3) button');
      // Sun - Nature
      const firstNature = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(4) button');
      // Coffe - Food
      const firstFood = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(5) button');
      // Soccer ball - Activity
      const firstActivity = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(6) button');
      // Anchor - Travel
      const firstTravel = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(7) button');
      // Keyboard - Objects
      const firstObjects = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(8) button');
      // Exclamation question mark - Symbols
      const firstSymbols = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(9) button');
      // White flag - Flags
      const firstFlags = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(10) button');

      await firstRecentlyUsed.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstPeople.element);

      await firstPeople.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstNature.element);

      await firstNature.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstFood.element);

      await firstFood.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstActivity.element);

      await firstActivity.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstTravel.element);

      await firstTravel.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstObjects.element);

      await firstObjects.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstSymbols.element);

      await firstSymbols.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstFlags.element);
    });

    it('Should jump to skin selector from emoji-selector', async () => {
      const firstFlags = wrapper.find('.d-emoji-picker__selector .d-emoji-picker__alignment:nth-child(10) button');
      const skinSelector = wrapper.find('.d-emoji-picker__skin-selected button');

      await firstFlags.trigger('keydown.Tab');

      expect(document.activeElement).toBe(skinSelector.element);
    });

    it('Should jump to first tab in tabset from  skin selector', async () => {
      const skinSelector = wrapper.find('.d-emoji-picker__skin-selected button');
      const firstTab = wrapper.find('.d-tablist button');

      await skinSelector.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstTab.element);
    });

    it('Should jump to search input from tabset', async () => {
      const firstTab = wrapper.find('.d-tablist button');
      const searchInput = wrapper.find('.d-emoji-picker__search input');

      await firstTab.trigger('keydown.Tab');

      expect(document.activeElement).toBe(searchInput.element);
    });
  });
});
