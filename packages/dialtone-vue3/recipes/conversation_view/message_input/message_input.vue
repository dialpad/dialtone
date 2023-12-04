<!-- eslint-disable vue/no-restricted-class -->
<template>
  <dt-notice
    v-if="showNotice"
    data-qa="dt-message-input-error-notice"
    :class="noticeClasses"
    :kind="noticeKind"
    :close-button-props="computedCloseButtonProps"
    @close="noticeClose"
  >
    {{ noticeMessage }}
    <template #icon>
      <dt-icon
        size="300"
        name="alert-circle"
      />
    </template>
  </dt-notice>
  <div
    class="d-ps-relative d-bar8 d-bgc-white"
  >
    <div
      data-qa="dt-message-input"
      role="presentation"
      class="d-d-flex d-fd-column d-bar8 d-baw1 d-ba d-c-text"
      :class="{ 'd-bc-black-500 d-bs-sm': hasFocus, 'd-bc-default': !hasFocus }"
      @click="$refs.richTextEditor.focusEditor()"
      @drag-enter="onDrag"
      @drag-over="onDrag"
      @drop="onDrop"
      @keydown.enter.exact="onSend"
      @focusin="hasFocus = true"
      @focusout="hasFocus = false"
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
          <dt-tooltip
            v-if="!isEdit"
            placement="top-start"
            :message="imageTooltipLabel"
            :offset="[-4, -4]"
          >
            <template #anchor>
              <dt-button
                data-qa="dt-message-input-image-btn"
                size="sm"
                circle
                :kind="imagePickerFocus ? 'default' : 'muted'"
                importance="clear"
                :aria-label="imageButtonAriaLabel"
                @click="onSelectImage"
                @mouseenter="imagePickerFocus = true"
                @mouseleave="imagePickerFocus = false"
                @focusin="imagePickerFocus = true"
                @focusout="imagePickerFocus = false"
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
                type="file"
                class="d-ps-absolute"
                multiple
                hidden
                @input="onImageUpload"
              />
            </template>
          </dt-tooltip>
          <dt-popover
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
                    @focusin="emojiPickerFocus = true"
                    @focusout="emojiPickerFocus = false"
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
        </div>
        <!-- Right content -->
        <div class="d-d-flex">
          <!-- Optionally displayed remaining character counter -->
          <dt-tooltip
            v-if="displayCharacterLimitWarning"
            :enabled="characterLimitWarningMessage && (characterLimitCount - inputLength < 0)"
            placement="top-end"
            :message="characterLimitWarningMessage"
            :offset="[10, -8]"
          >
            <template #anchor>
              <p
                v-if="displayCharacterLimitWarning"
                class="d-fc-error d-mr16 d-as-center dt-message-input--remaining-char"
                data-qa="dt-message-input-character-limit"
              >
                {{ characterLimitCount - inputLength }}
              </p>
            </template>
          </dt-tooltip>

          <!-- Cancel button for edit mode -->
          <dt-button
            v-if="isEdit"
            data-qa="dt-message-input-cancel-button"
            class="dt-message-input--cancel-button"
            size="sm"
            kind="muted"
            importance="clear"
            :aria-label="cancelButtonAriaLabel"
            @click="onCancel"
          >
            <p>{{ cancelButtonText }}</p>
          </dt-button>

          <!-- Send button -->
          <dt-tooltip
            placement="top-end"
            :enabled="!isEdit"
            :message="sendTooltipLabel"
            :show="!isSendDisabled && sendButtonFocus"
            :offset="[6, -8]"
          >
            <template #anchor>
              <!-- Right positioned UI - send button -->
              <dt-button
                data-qa="dt-message-input-send-btn"
                size="sm"
                :kind="sendButtonKind"
                :circle="!isEdit"
                importance="primary"
                :class="{
                  'message-input-button__disabled d-fc-muted': isSendDisabled,
                }"
                :aria-label="sendButtonAriaLabel"
                :aria-disabled="isSendDisabled"
                @click="onSend"
                @mouseenter="sendButtonFocus = true"
                @mouseleave="sendButtonFocus = false"
                @focusin="sendButtonFocus = true"
                @focusout="sendButtonFocus = false"
              >
                <template
                  v-if="!isEdit"
                  #icon
                >
                  <dt-icon
                    name="send"
                    size="300"
                  />
                </template>
                <template
                  v-if="isEdit"
                >
                  <p>{{ saveChangesButtonText }}</p>
                </template>
              </dt-button>
            </template>
          </dt-tooltip>
        </div>
      </section>
    </div>
    <section
      v-if="!isEdit"
      class="d-d-flex d-jc-space-between d-h24 d-ai-center"
    >
      <div
        data-qa="dt-message-input-footer-left"
      >
        <!-- @slot Slot for helper text. Who is typing can go here -->
        <slot name="footerLeft" />
      </div>
      <div
        data-qa="dt-message-input-footer-right"
      >
        <!-- @slot helper text for the input. Shift + enter for new line -->
        <slot name="footerRight" />
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
import { DtNotice, NOTICE_KINDS } from '@/components/notice';
import { DtTooltip } from '@/components/tooltip';

export default {
  name: 'DtRecipeMessageInput',

  components: {
    DtButton,
    DtEmojiPicker,
    DtIcon,
    DtInput,
    DtNotice,
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
    modelValue: {
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

    /**
     * Character limit warning message
     */
    characterLimitWarningMessage: {
      type: String,
      default: '',
    },

    // Error related props

    /**
     * Show error notice
     * This should be turned to false after notice-close event is fired.
     */
    showNotice: {
      type: Boolean,
      default: false,
    },

    /**
     * message in the notice
     */
    noticeMessage: {
      type: String,
      default: '',
    },

    /**
     * kind of notice to manage color
     * @values base, error, info, success, warning
     */
    noticeKind: {
      type: String,
      default: 'error',
      validate (kind) {
        return NOTICE_KINDS.includes(kind);
      },
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

    imageButtonAriaLabel: {
      type: String,
      default: 'image button',
    },

    /**
     * Image button tooltip label
     */
    imageTooltipLabel: {
      type: String,
      default: 'Attach Image',
    },

    sendButtonAriaLabel: {
      type: String,
      default: 'send button',
    },

    /**
     * Send button tooltip label
     */
    sendTooltipLabel: {
      type: String,
      default: 'Send',
    },

    /**
     * isEdit
     */
    isEdit: {
      type: Boolean,
      default: false,
    },

    /**
     * i18n Save changes button text
    */
    saveChangesButtonText: {
      type: String,
      default: 'Save changes',
    },

    /**
     * Cancel aria label
     */
    cancelButtonAriaLabel: {
      type: String,
      default: 'Cancel button',
    },

    /**
     * Cancel button i18n text
    */
    cancelButtonText: {
      type: String,
      default: 'Cancel',
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
     * Fires when notice is closed by user.
     * Listen to this event to toggle showNotice on usage.
     *
     * @event notice-close
     * @type {Boolean}
     */
    'notice-close',

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
  ],

  data () {
    return {
      internalInputValue: this.modelValue, // internal input content
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
      return this.hasCharacterLimit &&
        (this.characterLimitCount - this.inputLength) <= this.characterLimitWarning;
    },

    isSendDisabled () {
      return this.inputLength === 0 ||
      this.disableSend ||
      (this.hasCharacterLimit && this.inputLength > this.characterLimitCount);
    },

    computedCloseButtonProps () {
      return {
        ariaLabel: 'Close',
      };
    },

    noticeClasses () {
      return [
        'dt-message-input-notice',
        'd-ps-relative',
        'd-t8',
        'd-bbr0',
        'd-pt4',
        'd-pb8',
        'd-pr12',
        'd-pl16',
        'd-bs-none',
        'd-fs-100',
        'd-wmx-unset',
      ];
    },

    emojiPickerHovered () {
      return this.emojiPickerFocus || this.emojiPickerOpened;
    },

    sendButtonKind () {
      return !this.isSendDisabled ? 'default' : 'muted';
    },
  },

  watch: {
    modelValue (newValue) {
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
      const fileNames = files.map(file => file.name);
      this.$emit('add-media', fileNames);
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

    onImageUpload (val) {
      this.$emit('select-media', val);
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

    noticeClose () {
      this.$emit('notice-close', true);
    },

    focus () {
      this.$refs.richTextEditor.focusEditor();
      this.hasFocus = true;
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

.dt-message-input-notice .d-notice__icon {
  margin-right: 8px;
}
.dt-message-input--cancel-button {
  color: var(--dt-color-black-500);
  margin-right: var(--dt-space-300);
}
</style>
