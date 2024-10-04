<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div
    data-qa="dt-message-input"
    role="presentation"
    :class="['dt-message-input']"
    @dragover.prevent
    @drop.prevent="onDrop"
    @paste="onPaste"
    @mousedown="onMousedown"
  >
    <!-- @slot Renders above the input, but still within the borders. -->
    <slot name="top" />
    <!-- Some wrapper to restrict the height and show the scrollbar -->
    <div
      v-dt-scrollbar
      class="dt-message-input__editor-wrapper"
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
        :prevent-typing="preventTyping"
        :mention-suggestion="mentionSuggestion"
        :channel-suggestion="channelSuggestion"
        :slash-command-suggestion="slashCommandSuggestion"
        :allow-blockquote="allowBlockquote"
        :allow-bold="allowBold"
        :allow-bullet-list="allowBulletList"
        :allow-codeblock="allowCodeblock"
        :allow-italic="allowItalic"
        :allow-strike="allowStrike"
        :allow-underline="allowUnderline"
        :additional-extensions="additionalExtensions"
        v-bind="$attrs"
        @input="onInput"
        @enter="onSend"
        v-on="$listeners"
      />
    </div>
    <!-- @slot Slot for attachment carousel -->
    <slot name="middle" />
    <!-- Section for the bottom UI -->
    <section class="dt-message-input__bottom-section">
      <!-- Left content -->
      <div class="dt-message-input__bottom-section-left">
        <dt-button
          v-if="showImagePicker"
          v-dt-tooltip:top-start="showImagePicker?.tooltipLabel"
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
            <dt-icon-image
              size="300"
            />
          </template>
        </dt-button>
        <dt-input
          ref="messageInputImageUpload"
          data-qa="dt-message-input-image-input"
          accept="image/*, video/*"
          type="file"
          class="dt-message-input__image-input"
          multiple
          hidden
          @input="onImageUpload"
        />
        <dt-popover
          v-if="showEmojiPicker"
          data-qa="dt-message-input-emoji-picker-popover"
          :open.sync="emojiPickerOpened"
          initial-focus-element="#searchInput"
          padding="none"
        >
          <template #anchor="{ attrs }">
            <dt-button
              v-dt-tooltip="emojiTooltipMessage"
              v-bind="attrs"
              data-qa="dt-message-input-emoji-picker-btn"
              size="sm"
              circle
              :kind="emojiPickerHovered ? 'default' : 'muted'"
              importance="clear"
              :aria-label="emojiButtonAriaLabel"
              @click="toggleEmojiPicker"
              @mouseenter="emojiPickerFocus = true"
              @mouseleave="emojiPickerFocus = false"
              @focus="emojiPickerFocus = true"
              @blur="emojiPickerFocus = false"
            >
              <template #icon>
                <dt-icon-very-satisfied
                  v-if="emojiPickerHovered"
                  size="300"
                />
                <dt-icon-satisfied
                  v-else
                  size="300"
                />
              </template>
            </dt-button>
          </template>
          <template
            #content="{ close }"
          >
            <dt-emoji-picker
              v-bind="emojiPickerProps"
              @skin-tone="onSkinTone"
              @selected-emoji="(emoji) => { close(); onSelectEmoji(emoji); }"
            />
          </template>
        </dt-popover>
        <!-- @slot Slot for emojiGiphy picker -->
        <slot name="emojiGiphyPicker" />
      </div>
      <!-- Right content -->
      <div class="dt-message-input__bottom-section-right">
        <!-- @slot Slot for sms count -->
        <div class="d-d-flex d-ai-center">
          <slot name="smsCount" />
        </div>

        <!-- Optionally displayed remaining character counter -->
        <dt-tooltip
          v-if="Boolean(showCharacterLimit)"
          class="dt-message-input__remaining-char-tooltip"
          placement="top-end"
          :enabled="characterLimitTooltipEnabled"
          :message="showCharacterLimit.message"
          :offset="[10, 8]"
        >
          <template #anchor>
            <p
              v-show="displayCharacterLimitWarning"
              class="dt-message-input__remaining-char"
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
          class="dt-message-input__cancel-button"
          size="sm"
          kind="muted"
          importance="clear"
          :aria-label="showCancel.ariaLabel"
          @click="onCancel"
        >
          <p>{{ showCancel.text }}</p>
        </dt-button>

        <!-- @slot Slot for sendButton picker -->
        <slot name="sendButton">
          <!-- Send button -->
          <!-- Right positioned UI - send button -->
          <dt-button
            v-if="showSend"
            v-dt-tooltip:top-end="showSend?.tooltipLabel"
            data-qa="dt-message-input-send-btn"
            size="sm"
            kind="default"
            importance="primary"
            :class="[
              {
                'dt-message-input__send-button--disabled': isSendDisabled,
                'd-btn--circle': showSendIcon,
              },
            ]"
            :aria-label="showSend.ariaLabel"
            :aria-disabled="isSendDisabled"
            @click="onSend"
          >
            <template
              v-if="showSendIcon"
              #icon
            >
              <!-- @slot Slot for send button icon -->
              <slot
                name="sendIcon"
                :icon-size="sendIconSize"
              >
                <dt-icon-send
                  :size="sendIconSize"
                />
              </slot>
            </template>
            <template
              v-if="showSend.text"
            >
              <p>{{ showSend.text }}</p>
            </template>
          </dt-button>
        </slot>
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
import meetingPill from './meeting_pill/meeting_pill';
import { DtButton } from '@/components/button';
import { DtEmojiPicker } from '@/components/emoji_picker';
import { DtPopover } from '@/components/popover';
import { DtInput } from '@/components/input';
import { DtTooltip } from '@/components/tooltip';
import { DtIconImage, DtIconVerySatisfied, DtIconSatisfied, DtIconSend } from '@dialpad/dialtone-icons/vue2';

export default {
  name: 'DtRecipeMessageInput',

  components: {
    DtButton,
    DtEmojiPicker,
    DtInput,
    DtPopover,
    DtRichTextEditor,
    DtTooltip,
    DtIconImage,
    DtIconVerySatisfied,
    DtIconSatisfied,
    DtIconSend,
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
     * Prevents the user from typing any further. Deleting text will still work.
     */
    preventTyping: {
      type: Boolean,
      default: false,
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
      default: true,
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
      default: () => ({}),
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
     * suggestion object containing the items query function.
     * The valid keys passed into this object can be found here: https://tiptap.dev/api/utilities/suggestion
     *
     * The only required key is the items function which is used to query the channels for suggestion.
     * items({ query }) => { return [ChannelObject]; }
     * ChannelObject format:
     * { name: string, id: string, locked: boolean }
     *
     * When null, it does not add the plugin. Setting locked to true will display a lock rather than hash.
     */
    channelSuggestion: {
      type: Object,
      default: null,
    },

    /**
     * suggestion object containing the items query function.
     * The valid keys passed into this object can be found here: https://tiptap.dev/api/utilities/suggestion
     *
     * The only required key is the items function which is used to query the slash commands for suggestion.
     * items({ query }) => { return [SlashCommandObject]; }
     * SlashCommandObject format:
     * { command: string, description: string, parametersExample?: string }
     * The "parametersExample" parameter is optional, and describes an example
     * of the parameters that command can take.
     *
     * When null, it does not add the plugin.
     */
    slashCommandSuggestion: {
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

    /**
     * Whether the input allows codeblock to be introduced in the text.
     */
    allowCodeblock: {
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
     * Fires when a slash command is selected
     *
     * @event selected-command
     * @type {String}
     */
    'selected-command',

    /**
     * Fires when meeting pill is closed
     *
     * @event meeting-pill-close
     * @type {String}
     */
    'meeting-pill-close',

    /**
     * Event to sync the value with the parent
     * @event update:value
     * @type {String|JSON}
     */
    'update:value',
  ],

  data () {
    return {
      additionalExtensions: [meetingPill],
      internalInputValue: this.value, // internal input content
      imagePickerFocus: false,
      emojiPickerFocus: false,
      emojiPickerOpened: false,
    };
  },

  computed: {
    showSendIcon () {
      return !this.showSend.text;
    },

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

    sendIconSize () {
      return '300';
    },
  },

  watch: {
    value (newValue) {
      this.internalInputValue = newValue;
    },

    emojiPickerOpened (newValue) {
      if (!newValue) {
        this.$refs.richTextEditor?.focusEditor();
      }
    },
  },

  created () {
    if (this.value && this.outputFormat === 'text') {
      this.internalInputValue = this.value.replace(/\n/g, '<br>');
    }
  },

  methods: {
    // Mousedown instead of click because it fires before the blur event.
    onMousedown (e) {
      const isWithinInput = this.$refs.richTextEditor.$el.querySelector('.tiptap').contains(e.target);

      // If the click is not within the tiptap rich text editor input itself, but still within the wrapping div,
      // focus the editor.
      if (!isWithinInput) {
        // Prevent default prevents blurring the rich text editor input when it is already focused.
        e.preventDefault();
        this.$refs.richTextEditor.focusEditor();
      }
    },

    onDrop (e) {
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
        return;
      }

      // Insert emoji into the editor
      this.$refs.richTextEditor.editor.commands.insertContent({
        type: 'emoji',
        attrs: {
          code: emoji.shortname,
        },
      });
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

    onInput (event) {
      this.$emit('update:value', event);
    },
  },
};
</script>

<style lang="less">
.dt-message-input {
  display: flex;
  flex-direction: column;
  border-radius: var(--dt-size-radius-400);
  border: var(--dt-size-border-100) solid;
  border-color: var(--dt-color-border-default);
<<<<<<< ours
=======
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0%);
  line-height: var(--dt-font-line-height-400);
>>>>>>> theirs
  cursor: text;

  &:focus-within {
    border-color: var(--dt-color-border-bold);
    box-shadow: var(--dt-shadow-small);
  }

  &__editor-wrapper {
    padding: var(--dt-space-450) var(--dt-space-500) var(--dt-space-300);
  }

  &__remaining-char-tooltip {
    margin-top: auto;
    margin-bottom: auto;
  }

  &__remaining-char {
    color: var(--dt-color-foreground-critical);
    font-size: var(--dt-font-size-100);
    margin-right: var(--dt-space-500);
  }

  &__send-button--disabled {
    background-color: unset;
    color: var(--dt-color-foreground-muted);
    cursor: default;
  }

  &__cancel-button {
    margin-right: var(--dt-space-300);
  }

  &__bottom-section {
    display: flex;
    justify-content: space-between;
    padding: var(--dt-space-300) var(--dt-space-400);
  }

  &__bottom-section-left {
    display: flex;
  }

  &__bottom-section-right {
    display: flex;
  }

  &__image-input {
    position: absolute;
  }
}
</style>
