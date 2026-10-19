import { mount } from '@vue/test-utils';
import DtEmojiPicker from './EmojiPicker.vue';

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

const baseProps = {
  skinTone: 'Light',
  recentlyUsedEmojis: MOCK_RECENTLY_USED_EMOJIS,
  customEmojis: MOCK_CUSTOM_EMOJIS,
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

    skinToneSelectorButton = wrapper.find('[data-qa="dt-emoji-picker-skin-toggle"]');
    skinToneSelectorImg = wrapper.find('[data-qa="dt-emoji-picker-skin-toggle"] [data-qa="dt-emoji-picker-skin-image"]');
    skinToneMediumLightButton = wrapper.find('[data-qa="dt-emoji-picker-skin-list"]').findAll('[data-qa="dt-emoji-picker-skin-option"]').at(1);
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the emoji picker', () => {
      expect(wrapper.find('[data-qa="dt-emoji-picker"]').exists()).toBe(true);
    });

    it('Should render the tabset selector', () => {
      expect(wrapper.find('[data-qa="dt-emoji-picker-tabset"]').exists()).toBe(true);
    });

    it('Should render the input search', () => {
      expect(wrapper.find('[data-qa="dt-emoji-picker-search"]').exists()).toBe(true);
    });

    it('Should render the emoji selector', () => {
      expect(wrapper.find('[data-qa="dt-emoji-picker-selector"]').exists()).toBe(true);
    });

    it('Should render the skin selector', () => {
      expect(wrapper.find('[data-qa="skin-selector"]').exists()).toBe(true);
    });

    it('Should render the emoji description', () => {
      expect(wrapper.find('[data-qa="dt-emoji-picker-description"]').exists()).toBe(true);
    });

    it('Should render recently emojis tabset', () => {
      const firstButton = wrapper.find('[data-qa="dt-emoji-picker-tabset"]').findAll('[data-qa="dt-tab"]').at(0);

      expect(firstButton.exists()).toBe(true);
      expect(firstButton.attributes('aria-label')).toBe(MOCK_TAB_SET_LABELS[0]);
    });

    it('Should render customs emojis tabset', () => {
      const lastButton = wrapper.find('[data-qa="dt-emoji-picker-tabset"]').findAll('[data-qa="dt-tab"]').at(MOCK_TAB_SET_LABELS.length - 1);

      expect(lastButton.exists()).toBe(true);
      expect(lastButton.attributes('aria-label')).toBe(MOCK_TAB_SET_LABELS[MOCK_TAB_SET_LABELS.length - 1]);
    });

    it('Should render provided search placeholder label', () => {
      const searchInput = wrapper.find('[data-qa="dt-emoji-picker-search"] [data-qa="dt-input-input"]');

      expect(searchInput.exists()).toBe(true);
      expect(searchInput.attributes('placeholder')).toBe(MOCK_SEARCH_PLACEHOLDER_LABEL);
    });

    it('Should render correct labels in emojis tabset', () => {
      const firstButton = wrapper.find('[data-qa="dt-emoji-picker-tabset"]').findAll('[data-qa="dt-tab"]').at(3);

      expect(firstButton.exists()).toBe(true);
      expect(firstButton.attributes('aria-label')).toBe(MOCK_TAB_SET_LABELS[3]);
    });

    it('Should render correct amount of tabs in emoji tabset', () => {
      const TabsCount = wrapper.find('[data-qa="dt-emoji-picker-tabset"]').findAll('[data-qa="dt-tab"]').length;

      expect(TabsCount).toBe(MOCK_TAB_SET_LABELS.length);
    });

    it('Fixed label should be the first tabset label', () => {
      const fixedLabel = wrapper.find('[data-qa="dt-emoji-picker-sticky-label"]');

      expect(fixedLabel.exists()).toBe(true);
      expect(fixedLabel.text()).toEqual(MOCK_TAB_SET_LABELS[0]);
    });

    it('Should render add emoji button', () => {
      mockProps = { showAddEmojiButton: true };

      updateWrapper();

      const addEmojiButton = wrapper.find('[data-qa="dt-emoji-picker-add-emoji"]');

      expect(addEmojiButton.exists()).toBe(true);
      expect(addEmojiButton.attributes('aria-label')).toBe('Add emoji');
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
      let firstButton;

      beforeEach(async () => {
        await wrapper.setProps({
          recentlyUsedEmojis: [],
        });

        firstButton = wrapper.find('[data-qa="dt-emoji-picker-tabset"]').findAll('[data-qa="dt-tab"]').at(0);
      });

      it('Should not render recently emojis tabset', async () => {
        expect(firstButton.exists()).toBe(true);
        expect(firstButton.attributes('aria-label')).not.toBe(MOCK_TAB_SET_LABELS[0]);
        expect(firstButton.attributes('aria-label')).toBe(MOCK_TAB_SET_LABELS[1]);
      });
    });

    describe('When customs emojis is not provided', () => {
      it('Should not render customs emojis tabset', () => {
        mockProps = {
          ...baseProps,
          customEmojis: [],
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
        };

        updateWrapper();

        const lastButton = wrapper.find('[data-qa="dt-emoji-picker-tabset"]').findAll('[data-qa="dt-tab"]').at(MOCK_TAB_SET_LABELS.length - 2);

        expect(lastButton.exists()).toBe(true);
        expect(lastButton.attributes('aria-label')).not.toBe(MOCK_TAB_SET_LABELS[MOCK_TAB_SET_LABELS.length - 1]);
        expect(lastButton.attributes('aria-label')).toBe(MOCK_TAB_SET_LABELS[MOCK_TAB_SET_LABELS.length - 2]);
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('Should emit add-emoji event when add emoji button is clicked', async () => {
      mockProps = { showAddEmojiButton: true };

      updateWrapper();

      const addEmojiButton = wrapper.find('[data-qa="dt-emoji-picker-add-emoji"]');

      expect(addEmojiButton.exists()).toBe(true);

      await addEmojiButton.trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('add-emoji')).toBeTruthy();
    });

    it('Should emit selected-emoji event when emoji is clicked', async () => {
      const emoji = wrapper.find('[data-qa="dt-emoji-picker-selector"] [data-qa="dt-emoji-picker-emoji"]');

      expect(emoji.exists()).toBe(true);

      await emoji.trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('selected-emoji')).toBeTruthy();
    });

    describe('On search', () => {
      it('Fixed label should change on search input', async () => {
        const searchInput = wrapper.find('[data-qa="dt-emoji-picker-search"] [data-qa="dt-input-input"]');

        searchInput.setValue('tube');

        await searchInput.trigger('input');
        await wrapper.vm.$nextTick();

        const fixedLabel = wrapper.find('[data-qa="dt-emoji-picker-search-results-label"]');

        expect(fixedLabel.text()).toBe(MOCK_SEARCH_RESULTS_LABEL);
      });

      it('Input search should filter emojis', async () => {
        const searchInput = wrapper.find('[data-qa="dt-emoji-picker-search"] [data-qa="dt-input-input"]');

        expect(wrapper.find('[data-qa="filtered-emojis"]').exists()).toBe(false);

        searchInput.setValue('tube');

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="filtered-emojis"]').exists()).toBe(true);
      });
    });

    it('Should describe the emoji when is hovered', async () => {
      const emoji = wrapper.find('[data-qa="dt-emoji-picker-selector"] [data-qa="dt-emoji-picker-emoji"]');
      const emojiData = wrapper.find('[data-qa="dt-emoji-picker-description"]');

      expect(emoji.exists()).toBe(true);

      await emoji.trigger('mouseover');
      await wrapper.vm.$nextTick();

      expect(emojiData.text()).toBe('thumbs up');
    });

    describe('On skin tone selector click', () => {
      it('Should open the skin selector', async () => {
        const skinToneSelectorButton = wrapper.find('[data-qa="dt-emoji-picker-skin-toggle"]');
        const skinToneSelector = wrapper.find('[data-qa="dt-emoji-picker-skin-list"]');

        expect(skinToneSelector.attributes('style')).toMatch('display: none');

        await skinToneSelectorButton.trigger('click');
        await wrapper.vm.$nextTick();

        expect(skinToneSelector.attributes('style')).not.toMatch('display: none');
      });

      it('Should emit skin-tone event with selected skin tone', async () => {
        const skinToneSelectorButton = wrapper.find('[data-qa="dt-emoji-picker-skin-toggle"]');
        const skinToneSelector = wrapper.find('[data-qa="dt-emoji-picker-skin-list"]');
        const skinTone = skinToneSelector.findAll('[data-qa="dt-emoji-picker-skin-option"]').at(1);

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
      const searchInput = wrapper.find('[data-qa="dt-emoji-picker-search"] [data-qa="dt-input-input"]');

      expect(searchInput.element).toBe(document.activeElement);
    });

    it('Should focus the first available emoji when down keyarrow is pressed', async () => {
      const searchInput = wrapper.find('[data-qa="dt-emoji-picker-search"] [data-qa="dt-input-input"]');
      const emoji = wrapper.find('[data-qa="dt-emoji-picker-selector"] [data-qa="dt-emoji-picker-emoji"]');

      await searchInput.trigger('keydown.down');

      expect(document.activeElement).toBe(emoji.element);
    });

    it('Should jump through all the first emojis of each tab', async () => {
      // Thumbs up emoji - Recently used
      const firstRecentlyUsed = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(0).find('[data-qa="dt-emoji-picker-emoji"]');
      // Skull and crossbones - People
      const firstPeople = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(1).find('[data-qa="dt-emoji-picker-emoji"]');
      // Sun - Nature
      const firstNature = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(2).find('[data-qa="dt-emoji-picker-emoji"]');
      // Coffe - Food
      const firstFood = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(3).find('[data-qa="dt-emoji-picker-emoji"]');
      // Soccer ball - Activity
      const firstActivity = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(4).find('[data-qa="dt-emoji-picker-emoji"]');
      // Anchor - Travel
      const firstTravel = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(5).find('[data-qa="dt-emoji-picker-emoji"]');
      // Keyboard - Objects
      const firstObjects = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(6).find('[data-qa="dt-emoji-picker-emoji"]');
      // Exclamation question mark - Symbols
      const firstSymbols = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(7).find('[data-qa="dt-emoji-picker-emoji"]');
      // White flag - Flags
      const firstFlags = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(8).find('[data-qa="dt-emoji-picker-emoji"]');
      // shipit - Customs
      const firstCustoms = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(-1).find('[data-qa="dt-emoji-picker-emoji"]');

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

      await firstFlags.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstCustoms.element);
    });

    it('Should jump to skin selector from emoji-selector', async () => {
      const firstCustoms = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(-1).find('[data-qa="dt-emoji-picker-emoji"]');
      const skinSelector = wrapper.find('[data-qa="dt-emoji-picker-skin-toggle"]');

      await firstCustoms.trigger('keydown.Tab');

      expect(document.activeElement).toBe(skinSelector.element);
    });

    it('Should jump to first tab in tabset from  skin selector', async () => {
      const skinSelector = wrapper.find('[data-qa="dt-emoji-picker-skin-toggle"]');
      const firstTab = wrapper.find('[data-qa="dt-emoji-picker-tabset"] [data-qa="dt-tab"]');

      await skinSelector.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstTab.element);
    });

    it('Should jump to search input from tabset', async () => {
      const firstTab = wrapper.find('[data-qa="dt-emoji-picker-tabset"] [data-qa="dt-tab"]');
      const searchInput = wrapper.find('[data-qa="dt-emoji-picker-search"] [data-qa="dt-input-input"]');

      await firstTab.trigger('keydown.Tab');

      expect(document.activeElement).toBe(searchInput.element);
    });

    it('Should jump to the first emoji from tabset if showSearch is false', async () => {
      mockProps = { showSearch: false };

      updateWrapper();

      const firstTab = wrapper.find('[data-qa="dt-emoji-picker-tabset"] [data-qa="dt-tab"]');
      const firstEmoji = wrapper.findAll('[data-qa="dt-emoji-picker-group"]').at(0).find('[data-qa="dt-emoji-picker-emoji"]');

      await firstTab.element.focus();
      await firstTab.trigger('keydown.Tab');

      expect(document.activeElement).toBe(firstEmoji.element);
    });
  });
});
