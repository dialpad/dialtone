<template>
  <div>
    <!-- TODO: A purpose-built place to display validation errors using DtBanner -->
    <div
      class="d-d-flex d-fd-column d-bar8 d-baw1 d-ba d-c-text"
      :class="{ 'd-bc-black-500 d-bs-sm': hasFocus, 'd-bc-default': !hasFocus }"
    >
      <!-- Some wrapper to restrict the height and show the scrollbar -->
      <div class="d-of-auto d-mx16 d-mt8 d-mb4 d-hmx40p">
        <dt-rich-text-editor
          v-model="inputValue"
          :editable="editable"
          :input-aria-label="inputAriaLabel"
          :input-class="inputClass"
          :output-format="outputFormat"
          :auto-focus="autoFocus"
          :link="link"
          :placeholder="placeholder"
          v-bind="$attrs"
          @focus="hasFocus = true"
          @blur="hasFocus = false"
        />
      </div>
      <!-- @slot Slot for attachment carousel -->
      <slot name="middle" />
      <!-- Section for the bottom UI -->
      <section class="d-d-flex d-jc-space-between d-mx8 d-my4">
        <!-- Left content -->
        <div class="d-d-flex">
          <dt-button
            size="sm"
            circle
            importance="clear"
            :aria-label="imageButtonAriaLabel"
          >
            <template #icon>
              <dt-icon
                name="image"
                size="300"
              />
            </template>
          </dt-button>
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
                :aria-label="emojiButtonAriaLabel"
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
                :tab-set-labels="emojiTabSetLabels"
                :skin-selector-button-tooltip-label="emojiSkinSelectorButtonTooltipLabel"
                :search-no-results-label="emojiSearchNoResultsLabel"
                :search-results-label="emojiSearchResultsLabel"
                :search-placeholder-label="emojiSearchPlaceholderLabel"
                :skin-tone="skinTone"
                @skin-tone="skinTone = $event"
                @selected-emoji="onSelectEmoji"
              />
            </template>
          </dt-popover>
        </div>
        <!-- Right content -->
        <div class="d-d-flex">
          <!-- Optionally displayed remaining character counter -->
          <p
            v-if="displayCharacterLimitWarning"
            class="d-fc-error d-mr16 d-as-center dt-message-input--remaining-char"
          >
            {{ characterLimitCount - inputLength }}
          </p>
          <!-- Right positioned UI - send button -->
          <dt-button
            size="sm"
            circle
            importance="clear"
            :class="{
              'message-input-button__disabled': isSendDisabled,
              'd-bgc-purple-400 d-fc-primary-inverted': !isSendDisabled,
            }"
            :aria-label="sendButtonAriaLabel"
            :aria-disabled="isSendDisabled"
            @click="onSend"
          >
            <template #icon>
              <dt-icon
                name="send"
                size="300"
              />
            </template>
          </dt-button>
        </div>
      </section>
    </div>
    <section class="d-d-flex d-jc-space-between d-h24 d-ai-center">
      <div>
        <!-- @slot Slot for helper text. Who is typing can go here -->
        <slot name="footerLeft" />
      </div>
      <div>
        <!-- @slot helper text for the input. Shift + enter for new line -->
        <slot name="footerRight" />
      </div>
    </section>
  </div>
</template>

<script>
import {
  DtRichTextEditor,
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
} from '@/components/rich_text_editor';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import { DtEmojiPicker } from '@/components/emoji_picker';
import { DtPopover } from '@/components/popover/index';

export default {
  name: 'DtRecipeMessageInput',

  components: {
    DtButton,
    DtEmojiPicker,
    DtIcon,
    DtPopover,
    DtRichTextEditor,
  },

  mixins: [],

  inheritAttrs: false,

  props: {
    /**
     * Value of the input. The object format should match TipTap's JSON
     * document structure: https://tiptap.dev/guide/output#option-1-json
     */
    value: {
      type: [Object, String],
      default: '',
    },

    /**
     * Whether the input is editable
     */
    editable: {
      type: Boolean,
      default: true,
    },

    /**
     * Descriptive label for the input element
     */
    inputAriaLabel: {
      type: String,
      required: true,
      default: '',
    },

    /**
     * Additional class name for the input element. Only accepts a String value
     * because this is passed to the editor via options. For multiple classes,
     * join them into one string, e.g. "d-p8 d-hmx96"
     */
    inputClass: {
      type: String,
      default: '',
    },

    /**
     * Whether the input should receive focus after the component has been
     * mounted. Either one of `start`, `end`, `all` or a Boolean or a Number.
     * - `start`  Sets the focus to the beginning of the input
     * - `end`    Sets the focus to the end of the input
     * - `all`    Selects the whole contents of the input
     * - `Number` Sets the focus to a specific position in the input
     * - `true`   Defaults to `start`
     * - `false`  Disables autofocus
     * @values true, false, start, end, all, number
     */
    autoFocus: {
      type: [Boolean, String, Number],
      default: false,
      validator (autoFocus) {
        if (typeof autoFocus === 'string') {
          return RICH_TEXT_EDITOR_AUTOFOCUS_TYPES.includes(autoFocus);
        }
        return true;
      },
    },

    /**
     * The output format that the editor uses when emitting the "@input" event.
     * One of `text`, `json`, `html`. See https://tiptap.dev/guide/output for
     * examples.
     * @values text, json, html
     */
    outputFormat: {
      type: String,
      default: 'text',
      validator (outputFormat) {
        return RICH_TEXT_EDITOR_OUTPUT_FORMATS.includes(outputFormat);
      },
    },

    /**
     * Enables the Link extension and optionally passes configurations to it
     */
    link: {
      type: [Boolean, Object],
      default: false,
    },

    /**
     * Placeholder text
     */
    placeholder: {
      type: String,
      default: '',
    },

    /**
     * Disable Send Button
     */
    disableSend: {
      type: Boolean,
      default: false,
    },

    // Character limit props

    /**
     * Enable character Limit warning
     */
    hasCharacterLimit: {
      type: Boolean,
      default: true,
    },

    /**
     * Max number of characters allowed
     */
    characterLimitCount: {
      type: Number,
      default: 1500,
    },

    /**
     * Number after which warning for max limit appears
     */
    characterLimitWarning: {
      type: Number,
      default: 500,
    },

    // Emoji picker props

    /**
     * tab labels for emoji
     */
    emojiTabSetLabels: {
      type: Array,
      default: () => [
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
    },

    emojiSkinSelectorButtonTooltipLabel: {
      type: String,
      default: 'Change default skin tone',
    },

    emojiSearchNoResultsLabel: {
      type: String,
      default: 'No results',
    },

    emojiSearchResultsLabel: {
      type: String,
      default: 'Search results',
    },

    emojiSearchPlaceholderLabel: {
      type: String,
      default: 'Search...',
    },

    // Aria label for buttons

    /**
     * Emoji button aria label
     */
    emojiButtonAriaLabel: {
      type: String,
      default: 'emoji button',
    },

    imageButtonAriaLabel: {
      type: String,
      default: 'image button',
    },

    sendButtonAriaLabel: {
      type: String,
      default: 'send button',
    },

  },

  emits: [
    /**
     * Fires when send button is clicked
     *
     * @event submit
     * @type {String}
     */
    'submit',
  ],

  data () {
    return {
      skinTone: 'Default',
      inputValue: this.value,
      hasFocus: false,
      emojiPickerOpened: false,
    };
  },

  computed: {
    inputLength () {
      return this.inputValue.length;
    },

    displayCharacterLimitWarning () {
      return this.hasCharacterLimit &&
        (this.characterLimitCount - this.inputLength) <= this.characterLimitWarning;
    },

    isSendDisabled () {
      return this.inputLength === 0 ||
      this.disableSend ||
      (this.hasCharacterLimit && this.inputLength > this.characterLimitCount);
    },
  },

  methods: {
    onSelectEmoji (emoji) {
      if (!emoji) {
        this.emojiPickerOpened = false;
        return;
      }

      this.inputValue = this.inputValue + emoji.shortname;
      this.emojiPickerOpened = false;
    },

    toggleEmojiPicker () {
      this.emojiPickerOpened = !this.emojiPickerOpened;
    },

    onSend () {
      if (this.isSendDisabled) {
        return;
      }
      this.$emit('submit', this.inputValue);
      this.inputValue = '';
    },
  },
};
</script>

<style lang="less">
.dt-message-input--remaining-char {
  font-size: 1.2rem;
}

.message-input-button__disabled {
  background-color: unset;
  color: var(--theme-sidebar-icon-color);
  cursor: default;
}
</style>
