<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div
    data-qa="dt-message-input"
    role="presentation"
    :class="['d-d-flex', 'd-fd-column', 'd-bar8', 'd-baw1', 'd-ba', 'd-c-text',
             { 'd-bc-bold d-bs-sm': hasFocus, 'd-bc-default': !hasFocus }]"
    @click="$refs.richTextEditor?.focusEditor()"
    @drag-enter="onDrag"
    @drag-over="onDrag"
    @drop="onDrop"
    @keydown.enter.exact="onSend"
    @paste="onPaste"
  >
    <!-- Some wrapper to restrict the height and show the scrollbar -->
    <div
      class="d-of-auto d-mx16 d-mt8 d-mb4"
      :style="{ 'max-height': maxHeight }"
    >
      <dt-rich-text-editor
        ref="richTextEditor"
        v-model="internalInputValue"
        :editable="editable"
        :input-aria-label="inputAriaLabel"
        :input-class="inputClass"
        :output-format="outputFormat"
        :auto-focus="autoFocus"
        :link="link"
        :placeholder="placeholder"
        :mention-suggestion="mentionSuggestion"
        :allow-blockquote="allowBlockquote"
        :allow-bold="allowBold"
        :allow-bullet-list="allowBulletList"
        :allow-italic="allowItalic"
        :allow-strike="allowStrike"
        :allow-underline="allowUnderline"
        v-bind="$attrs"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput($event)"
      />
    </div>
    <!-- @slot Slot for attachment carousel -->
    <slot name="middle" />
    <!-- Section for the bottom UI -->
    <section class="d-d-flex d-jc-space-between d-mx8 d-my4">
      <!-- Left content -->
      <div class="d-d-flex">
        <dt-tooltip
          v-if="showImagePicker"
          placement="top-start"
          :message="showImagePicker.tooltipLabel"
          :offset="[-4, -4]"
        >
          <template #anchor>
            <dt-button
              data-qa="dt-message-input-image-btn"
              size="sm"
              circle
              :kind="imagePickerFocus ? 'default' : 'muted'"
              importance="clear"
              :aria-label="showImagePicker.ariaLabel"
              @click="onSelectImage"
              @mouseenter="imagePickerFocus = true"
              @mouseleave="imagePickerFocus = false"
              @focus="imagePickerFocus = true"
              @blur="imagePickerFocus = false"
            >
              <template #icon>
                <dt-icon
                  name="image"
                  size="300"
                />
              </template>
            </dt-button>
            <dt-input
              ref="messageInputImageUpload"
              data-qa="dt-message-input-image-input"
              accept="image/*, video/*"
              type="file"
              class="d-ps-absolute"
              multiple
              hidden
              @input="onImageUpload"
            />
          </template>
        </dt-tooltip>
        <dt-popover
          v-if="showEmojiPicker"
          data-qa="dt-message-input-emoji-picker-popover"
          :open="emojiPickerOpened"
          initial-focus-element="#searchInput"
          padding="none"
          @opened="(open) => { emojiPickerOpened = open }"
        >
          <template #anchor>
            <dt-tooltip
              :message="emojiTooltipMessage"
              :offset="[0, -4]"
            >
              <template #anchor>
                <dt-button
                  data-qa="dt-message-input-emoji-picker-btn"
                  size="sm"
                  circle
                  :kind="emojiPickerHovered ? 'default' : 'muted'"
                  importance="clear"
                  :aria-label="emojiButtonAriaLabel"
                  :offset="[0, 0]"
                  @click="toggleEmojiPicker"
                  @mouseenter="emojiPickerFocus = true"
                  @mouseleave="emojiPickerFocus = false"
                  @focus="emojiPickerFocus = true"
                  @blur="emojiPickerFocus = false"
                >
                  <template #icon>
                    <dt-icon
                      :name="!emojiPickerHovered ? 'satisfied' : 'very-satisfied'"
                      size="300"
                    />
                  </template>
                </dt-button>
              </template>
            </dt-tooltip>
          </template>
          <template #content>
            <dt-emoji-picker
              v-bind="emojiPickerProps"
              @skin-tone="onSkinTone"
              @selected-emoji="onSelectEmoji"
            />
          </template>
        </dt-popover>
        <!-- @slot Slot for emojiGiphy picker -->
        <slot name="emojiGiphyPicker" />
      </div>
      <!-- Right content -->
      <div class="d-d-flex">
        <!-- Optionally displayed remaining character counter -->
        <dt-tooltip
          v-if="Boolean(showCharacterLimit)"
          class="dt-message-input--remaining-char-tooltip"
          placement="top-end"
          :enabled="characterLimitTooltipEnabled"
          :message="showCharacterLimit.message"
          :offset="[10, -8]"
        >
          <template #anchor>
            <p
              v-show="displayCharacterLimitWarning"
              class="d-fc-error d-mr16 dt-message-input--remaining-char"
              data-qa="dt-message-input-character-limit"
            >
              {{ showCharacterLimit.count - inputLength }}
            </p>
          </template>
        </dt-tooltip>

        <!-- Cancel button for edit mode -->
        <dt-button
          v-if="showCancel"
          data-qa="dt-message-input-cancel-button"
          class="dt-message-input--cancel-button"
          size="sm"
          kind="muted"
          importance="clear"
          :aria-label="showCancel.ariaLabel"
          @click="onCancel"
        >
          <p>{{ showCancel.text }}</p>
        </dt-button>

        <!-- Send button -->
        <dt-tooltip
          v-if="showSend"
          placement="top-end"
          :enabled="!showSend"
          :message="showSend.tooltipLabel"
          :show="!isSendDisabled && sendButtonFocus"
          :offset="[6, -8]"
        >
          <template #anchor>
            <!-- Right positioned UI - send button -->
            <dt-button
              data-qa="dt-message-input-send-btn"
              size="sm"
              kind="default"
              importance="primary"
              :class="[
                {
                  'message-input-button__disabled d-fc-muted': isSendDisabled,
                  'd-btn--circle': showSend.icon,
                },
              ]"
              :aria-label="showSend.ariaLabel"
              :aria-disabled="isSendDisabled"
              @click="onSend"
              @mouseenter="sendButtonFocus = true"
              @mouseleave="sendButtonFocus = false"
              @focus="sendButtonFocus = true"
              @blur="sendButtonFocus = false"
            >
              <template
                v-if="showSend.icon"
                #icon
              >
                <dt-icon
                  :name="showSend.icon"
                  size="300"
                />
              </template>
              <template
                v-if="showSend.text"
              >
                <p>{{ showSend.text }}</p>
              </template>
            </dt-button>
          </template>
        </dt-tooltip>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable max-lines */
import {
  DtRichTextEditor,
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
} from '@/components/rich_text_editor';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import { DtEmojiPicker } from '@/components/emoji_picker';
import { DtPopover } from '@/components/popover';
import { DtInput } from '@/components/input';
import { DtTooltip } from '@/components/tooltip';

export default {
  name: 'DtRecipeMessageInput',

  components: {
    DtButton,
    DtEmojiPicker,
    DtIcon,
    DtInput,
    DtPopover,
    DtRichTextEditor,
    DtTooltip,
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

    /**
     * Content area needs to dynamically adjust height based on the conversation area height.
     * can be vh|px|rem|em|%
     */
    maxHeight: {
      type: String,
      default: 'unset',
    },

    // Emoji picker props
    showEmojiPicker: {
      type: Boolean,
      default: true,
    },

    /**
     * Props to pass into the emoji picker.
     */
    emojiPickerProps: {
      type: Object,
      default: () => ({}),
      validate (emojiPickerProps) {
        return [
          'searchNoResultsLabel',
          'searchResultsLabel',
          'searchPlaceholderLabel',
          'skinSelectorButtonTooltipLabel',
          'tabSetLabels',
        ].every(prop => emojiPickerProps[prop] != null);
      },
    },

    /**
     * Emoji button tooltip label
     */
    emojiTooltipMessage: {
      type: String,
      default: 'Emoji',
    },

    // Aria label for buttons
    /**
     * Emoji button aria label
     */
    emojiButtonAriaLabel: {
      type: String,
      default: 'emoji button',
    },

    /**
     * Enable character Limit warning
     */
    showCharacterLimit: {
      type: [Boolean, Object],
      default: () => ({ count: 1500, warning: 500, message: '' }),
    },

    showImagePicker: {
      type: [Boolean, Object],
      default: () => ({ tooltipLabel: 'Attach Image', ariaLabel: 'image button' }),
    },

    /**
     * Send button defaults.
     */
    showSend: {
      type: [Boolean, Object],
      default: () => ({ icon: 'send' }),
    },

    /**
     * Cancel button defaults.
     */
    showCancel: {
      type: [Boolean, Object],
      default: () => ({ text: 'Cancel' }),
    },

    /**
     * suggestion object containing the items query function.
     * The valid keys passed into this object can be found here: https://tiptap.dev/api/utilities/suggestion
     *
     * The only required key is the items function which is used to query the contacts for suggestion.
     * items({ query }) => { return [ContactObject]; }
     * ContactObject format:
     * { name: string, avatarSrc: string, id: string }
     *
     * When null, it does not add the plugin.
     */
    mentionSuggestion: {
      type: Object,
      default: null,
    },

    /**
     * Whether the input allows for block quote.
     */
    allowBlockquote: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether the input allows for bold to be introduced in the text.
     */
    allowBold: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether the input allows for bullet list to be introduced in the text.
    */
    allowBulletList: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether the input allows for italic to be introduced in the text.
     */
    allowItalic: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether the input allows for strike to be introduced in the text.
     */
    allowStrike: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether the input allows for underline to be introduced in the text.
     */
    allowUnderline: {
      type: Boolean,
      default: true,
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

    /**
     * Fires when media is selected from image button
     *
     * @event select-media
     * @type {Array}
     */
    'select-media',

    /**
     * Fires when media is dropped into the message input
     *
     * @event add-media
     * @type {Array}
     */
    'add-media',

    /**
     * Fires when media is pasted into the message input
     *
     * @event paste-media
     * @type {Array}
     */
    'paste-media',

    /**
     * Fires when cancel button is pressed (only on edit mode)
     *
     * @event cancel
     * @type {Boolean}
     */
    'cancel',

    /**
     * Fires when skin tone is selected from the emoji picker
     *
     * @event skin-tone
     * @type {String}
     */
    'skin-tone',

    /**
     * Fires when emoji is selected from the emoji picker
     *
     * @event selected-emoji
     * @type {String}
     */
    'selected-emoji',

    /**
     * Native focus event
     * @event input
     * @type {String|JSON}
     */
    'focus',

    /**
     * Native blur event
     * @event input
     * @type {String|JSON}
     */
    'blur',

    /**
     * Native input event
     * @event input
     * @type {String|JSON}
     */
    'input',
  ],

  data () {
    return {
      internalInputValue: this.value, // internal input content
      hasFocus: false,
      imagePickerFocus: false,
      emojiPickerFocus: false,
      sendButtonFocus: false,
      emojiPickerOpened: false,
    };
  },

  computed: {
    inputLength () {
      return this.internalInputValue.length;
    },

    displayCharacterLimitWarning () {
      return Boolean(this.showCharacterLimit) &&
        ((this.showCharacterLimit.count - this.inputLength) <= this.showCharacterLimit.warning);
    },

    characterLimitTooltipEnabled () {
      return this.showCharacterLimit.message && (this.showCharacterLimit.count - this.inputLength < 0);
    },

    isSendDisabled () {
      return this.disableSend ||
      (this.showCharacterLimit && this.inputLength > this.showCharacterLimit.count);
    },

    computedCloseButtonProps () {
      return {
        ariaLabel: 'Close',
      };
    },

    emojiPickerHovered () {
      return this.emojiPickerFocus || this.emojiPickerOpened;
    },
  },

  watch: {
    value (newValue) {
      this.internalInputValue = newValue;
    },
  },

  methods: {
    onDrag (e) {
      e.stopPropagation();
      e.preventDefault();
    },

    onDrop (e) {
      e.stopPropagation();
      e.preventDefault();

      const dt = e.dataTransfer;
      const files = Array.from(dt.files);
      this.$emit('add-media', files);
    },

    onPaste (e) {
      if (e.clipboardData.files.length) {
        e.stopPropagation();
        e.preventDefault();
        const files = [...e.clipboardData.files];
        this.$emit('paste-media', files);
      }
    },

    onSkinTone (skinTone) {
      this.$emit('skin-tone', skinTone);
    },

    onSelectEmoji (emoji) {
      if (!emoji) {
        this.emojiPickerOpened = false;
        return;
      }

      // Insert emoji into the editor
      this.$refs.richTextEditor.editor.commands.insertContent({
        type: 'emoji',
        attrs: {
          code: emoji.shortname,
        },
      });
      this.emojiPickerOpened = false;
      this.$emit('selected-emoji', emoji);
    },

    onSelectImage () {
      this.$refs.messageInputImageUpload.$refs.input.click();
    },

    onImageUpload () {
      this.$emit('select-media', this.$refs.messageInputImageUpload.$refs.input.files);
    },

    toggleEmojiPicker () {
      this.emojiPickerOpened = !this.emojiPickerOpened;
    },

    onSend () {
      if (this.isSendDisabled) {
        return;
      }
      this.$emit('submit', this.internalInputValue);
    },

    onCancel () {
      this.$emit('cancel');
    },

    onFocus (event) {
      this.hasFocus = true;
      this.$refs.richTextEditor?.focusEditor();
      this.$emit('focus', event);
    },

    onBlur (event) {
      this.hasFocus = false;
      this.$emit('blur', event);
    },

    onInput (event) {
      this.$emit('input', event);
    },
  },
};
</script>

<style lang="less">
.dt-message-input--remaining-char-tooltip {
  margin-top: auto;
  margin-bottom: auto;
}
.dt-message-input--remaining-char {
  font-size: 1.2rem;
}

.message-input-button__disabled {
  background-color: unset;
  color: var(--theme-sidebar-icon-color);
  cursor: default;
}

.dt-message-input--cancel-button {
  margin-right: var(--dt-space-300);
}
</style>
