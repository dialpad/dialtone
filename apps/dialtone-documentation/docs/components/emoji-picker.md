---
title: Emoji picker
thumb: true
image: assets/images/components/emoji-picker.png
description: A emoji picker component that allows you to view and select an emoji from a list.
status: beta
storybook: https://dialtone.dialpad.com/vue/vue3/?path=/story/components-emoji-picker--default
---

<code-well-header>
  <dt-emoji-picker
      skin-tone="Default"
      skin-selector-button-tooltip-label="Change default skin tone"
      :tab-set-labels="[
        'Most recently used',
        'Smileys and people',
        'Nature',
        'Food',
        'Activity',
        'Travel',
        'Objects',
        'Symbols',
        'Flags',
      ]"
      :recently-used-emojis="recentlyUsedEmojis"
      search-results-label="Search results"
      search-no-results-label="No results"
      search-placeholder-label="Search..."
    />
</code-well-header>

## Variants and examples

### Default

<code-well-header>
  <dt-emoji-picker
      skin-tone="Default"
      skin-selector-button-tooltip-label="Change default skin tone"
      :tab-set-labels="[
        'Most recently used',
        'Smileys and people',
        'Nature',
        'Food',
        'Activity',
        'Travel',
        'Objects',
        'Symbols',
        'Flags',
      ]"
      :recently-used-emojis="recentlyUsedEmojis"
      search-results-label="Search results"
      search-no-results-label="No results"
      search-placeholder-label="Search..."
    />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-emoji-picker">
  <div class="d-emoji-picker--header">
    <div class="d-emoji-picker__tabset">
      <div data-qa="dt-tab-group">
        <div class="d-tablist d-emoji-picker__tabset-list" role="tablist" aria-label="">
          <button
            class="base-button__button d-btn d-btn--primary d-tab d-tab--selected"
            data-qa="dt-tab"
            type="button"
            aria-label="Most recently used"
            id="dt-tab-1"
            role="tab"
            aria-selected="true"
            aria-controls="d-emoji-picker-list"
            tabindex="1"
          >
            <span data-qa="dt-button-label" class="d-btn__label base-button__label">
              <svg>...</svg>
            </span>
          </button>
          <button class="base-button__button d-btn d-btn--primary d-tab" data-qa="dt-tab" type="button" aria-label="Smileys and people" id="dt-tab-2" role="tab" aria-selected="false" aria-controls="d-emoji-picker-list" tabindex="2">
            ...
          </button>
          ...
        </div>
      </div>
    </div>
  </div>
  <div class="d-emoji-picker--body">
    <div class="d-emoji-picker__search d-emoji-picker__alignment">
      <div class="base-input" data-qa="dt-input">
        <label class="base-input__label" data-qa="dt-input-label-wrapper">
          <div class="d-input__wrapper">
            <span class="base-input__icon--left d-input-icon--left d-input-icon undefined" data-qa="dt-input-left-icon-wrapper">
              <svg>...</svg>
            </span>
            <input name="" type="text" class="base-input__input d-input d-input-icon--left" data-qa="dt-input-input" id="searchInput" placeholder="Search..." />
          </div>
        </label>
      </div>
    </div>
    <div class="d-emoji-picker__selector">
      <div id="d-emoji-picker-list" class="d-emoji-picker__list">
        <div class="d-emoji-picker__category d-emoji-picker__alignment" data-index="0"><p>Most recently used</p></div>
        <div class="d-emoji-picker__alignment" data-index="1">
          <div class="d-emoji-picker__tab">
            <button type="button" aria-label="thumbs up"><img class="d-icon d-icon--size-500" alt="thumbs up" aria-label="thumbs up" title="thumbs up" src="https://static.dialpadcdn.com/joypixels/png/unicode/32/1f44d.png" /></button>
            <button type="button" aria-label="thumbs up: medium-light skin tone">
              <img
                class="d-icon d-icon--size-500"
                alt="thumbs up: medium-light skin tone"
                aria-label="thumbs up: medium-light skin tone"
                title="thumbs up: medium-light skin tone"
                src="https://static.dialpadcdn.com/joypixels/png/unicode/32/1f44d-1f3fc.png"
              />
            </button>
            ...
          </div>
        </div>
        <div class="d-emoji-picker__alignment" data-index="2">
          <p>Smileys and people</p>
          ...
        </div>
        <div class="d-emoji-picker__alignment" data-index="3">
          <p>Nature</p>
          ...
        </div>
        ...
      </div>
    </div>
  </div>
  <div class="d-emoji-picker--footer">
    <div class="d-emoji-picker__data"></div>
    <div data-qa="skin-selector">
      <div class="d-emoji-picker__skin-list" style="display: none;">
        <button class="">
          <img class="d-icon d-icon--size-500" alt=":wave_tone1:" aria-label=":wave_tone1:" title=":wave_tone1:" src="https://static.dialpadcdn.com/joypixels/png/unicode/32/1f44b-1f3fb.png" />
        </button>
        ...
      </div>
      <div class="d-emoji-picker__skin-selected">
        <div data-qa="dt-tooltip-container">
          <span data-qa="dt-tooltip-anchor">
            <button aria-label="Change default skin tone" tabindex="-1">
              <img class="d-icon d-icon--size-500" alt=":wave:" aria-label=":wave:" title=":wave:" src="https://static.dialpadcdn.com/joypixels/png/unicode/32/1f44b.png" />
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
'
vueCode='
<dt-emoji-picker
  :skin-tone="Default"
  skin-selector-button-tooltip-label="Change default skin tone"
  :tab-set-labels="[`Most recently used`, `Smileys and people`, ...]"
  :recently-used-emojis="[
    {
      name: `thumbs up`,
      category: `people`,
      shortname: `:thumbsup:`,
      shortname_alternates: [`:+1:`, `:thumsbup:`],
      keywords: [`+1`, `hand`, `thumb`, `up`, `uc6`],
      unicode_output: `1f44d`,
      unicode_character: `1f44d`,
    },
    {
      name: `thumbs up: medium-light skin tone`,
      ...
    }
    ...
  ]"
  search-results-label="Search results"
  search-no-results-label="Search results"
  search-placeholder-label="Search..."
  @skin-tone="skinTone = $event"
  @selected-emoji="selectedEmoji"
/>
'
showHtmlWarning />

### With popover

<code-well-header>
  <dt-popover
    :open="emojiPickerOpened"
    initial-focus-element="#searchInput"
    padding="none"
    @opened="(open) => { emojiPickerOpened = open }"
  >
    <template #anchor>
      <dt-button
        size="sm"
        circle
        importance="clear"
        @click="toggleEmojiPicker"
      >
        <template #icon>
          <dt-icon
            name="satisfied"
            size="300"
          />
        </template>
      </dt-button>
    </template>
    <template #content>
      <dt-emoji-picker
        skin-tone="Default"
        skin-selector-button-tooltip-label="Change default skin tone"
        :tab-set-labels="[
          'Most recently used',
          'Smileys and people',
          'Nature',
          'Food',
          'Activity',
          'Travel',
          'Objects',
          'Symbols',
          'Flags',
        ]"
        :recently-used-emojis="recentlyUsedEmojis"
        search-results-label="Search results"
        search-no-results-label="No results"
        search-placeholder-label="Search..."
      />
    </template>
  </dt-popover>
</code-well-header>

<code-example-tabs
vueCode='
<dt-popover
  :open="emojiPickerOpened"
  initial-focus-element="#searchInput"
  padding="none"
  @opened="(open) => { emojiPickerOpened = open }"
>
  <template #anchor>
    <dt-button
      size="sm"
      circle
      importance="clear"
      @click="toggleEmojiPicker"
    >
      <template #icon>
        <dt-icon
          name="satisfied"
          size="300"
        />
      </template>
    </dt-button>
  </template>
  <template #content>
    <dt-emoji-picker
      skin-tone="Default"
      skin-selector-button-tooltip-label="Change default skin tone"
      :tab-set-labels="[
        `Most recently used`,
        `Smileys and people`,
        `Nature`,
        `Food`,
        `Activity`,
        `Travel`,
        `Objects`,
        `Symbols`,
        `Flags`,
      ]"
      :recently-used-emojis="recentlyUsedEmojis"
      search-results-label="Search results"
      search-no-results-label="No results"
      search-placeholder-label="Search..."
    />
  </template>
</dt-popover>
'
/>

## Vue API

<component-vue-api component-name="emoji_picker" />

## Usage

We recommend to wrap the emoji picker in a `dt-popover` component.

It is important to know the sequence of tab and emoji tabset will **not change**. You should always provide a proper `tabSetLabels` array to match the order of the emoji tabset.

The 'Most recently used' tab will always be the first tab in the `tabSetLabels` array. It should be updated dynamically by the consumer by using the `recentlyUsedEmojis` prop.

The `skin-tone` prop provided to the component should listen to the `skin-tone` event emitted by the skin selector button to be updated instantly.

You must listen to the `close` event to close the emoji picker. This event is emitted by the keyboard navigation on `ESC`.

For the `withPopover` variant it is necessary to provide the `initial-focus-element="#searchInput"` prop to the `dt-popover` component. With this we accomplish the requirement to have the search input focused when the emoji picker is opened.

## Accessibility

The emoji picker starts with the focus on the input search to give the user a quick way to search for an emoji.

When the user searches for an emoji, the first emoji in the list will be highlighted, this allow the user to press `ENTER` to select this emoji.

From the input search the user can navigate by pressing `UP` arrow to the tabset or `DOWN` arrow to the emoji list.

From the tabset it is possible to navigate through the tabs with `LEFT` and `RIGHT` arrows, it will jump again to the input search with `DOWN` arrow.

From the emoji list you can navigate through the first emoji of each emoji tabset with `TAB`. If you are on the last emoji tabset (flags), it will jump to the skin tone selector. You can navigate through individual emojis and tabsets with the arrow keys.

You can jump to the previous first emoji of the previous emoji tabset with `SHIFT + TAB`. If you are on the first emoji tabset, it will jump to the input search.

In the skin tone selector the user can press `ENTER` to open the skin tone selector and select the desired skin tone, you can navigate through with `LEFT` and `RIGHT` arrows and select with `ENTER`. This selection will close the skin tone selector and emit the `skin-tone` event with the selected skin tone.

From the skin tone selector the user can jump to the tabset selector with `TAB` button.

This is the following sequence of the keyboard navigation with `TAB`:

* Input search -> First emoji of the first emoji tabset
* First emoji tabset -> Next first emoji of the next emoji tabset
* First emoji of the last emoji tabset -> Skin tone selector
* Skin tone selector -> Tabset selector
* Tabset selector -> Input search

On `ESC` the emoji picker will emit the `close` event to close the emoji picker.

<script setup>
import { ref } from 'vue';

const emojiPickerOpened = ref(false);
const toggleEmojiPicker = () => {
  emojiPickerOpened.value = !emojiPickerOpened.value;
};

const recentlyUsedEmojis = [
  {
    name: 'thumbs up',
    category: 'people',
    shortname: ':thumbsup:',
    shortname_alternates: [':+1:', ':thumsbup:'],
    keywords: ['+1', 'hand', 'thumb', 'up', 'uc6'],
    unicode_output: '1f44d',
    unicode_character: '1f44d',
  },
  {
    name: 'thumbs up: medium-light skin tone',
    category: 'people',
    shortname: ':thumbsup_tone2:',
    shortname_alternates: [':+1_tone2:', ':thumsbup_tone2:'],
    keywords: ['+1', 'hand', 'medium-light skin tone', 'thumb', 'up', 'uc8'],
    unicode_output: '1f44d-1f3fc',
    unicode_character: '1f44d-1f3fc',
  },
  {
    name: 'thumbs up: dark skin tone',
    category: 'people',
    shortname: ':thumbsup_tone5:',
    shortname_alternates: [':+1_tone5:', ':thumsbup_tone5:'],
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

</script>
