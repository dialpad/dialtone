<!-- eslint-disable max-lines -->
<template>
  <div
    data-qa="dt-recipe-message-input"
    role="presentation"
    class="d-recipe-message-input"
    v-bind="addClassStyleAttrs($attrs)"
    @dragover.prevent
    @drop.prevent="onDrop"
    @paste="onPaste"
    @mousedown="onMousedown"
  >
    <!-- @slot Renders above the input, but still within the borders. -->
    <slot name="top" />

    <!-- set key to selectedText to force update. otherwise this component may not reflect the active selection -->
    <dt-recipe-message-input-topbar
      v-if="richText"
      :key="selectedText"
      :bold-button-options="boldButtonOptions"
      :italic-button-options="italicButtonOptions"
      :strike-button-options="strikeButtonOptions"
      :bullet-list-button-options="bulletListButtonOptions"
      :ordered-list-button-options="orderedListButtonOptions"
      :block-quote-button-options="blockQuoteButtonOptions"
      :code-button-options="codeButtonOptions"
      :code-block-button-options="codeBlockButtonOptions"
      :is-selection-active="isSelectionActive"
      @click="handleTopbarClick"
    >
      <template #link>
        <dt-recipe-message-input-link
          ref="link"
          :open="linkDialogOpen"
          :link-button-options="linkButtonOptions"
          :is-selection-active="isSelectionActive"
          @opened="linkDialogOpened"
          @set-link="setLink"
          @remove-link="removeLink"
        />
      </template>
    </dt-recipe-message-input-topbar>
    <!-- Some wrapper to restrict the height and show the scrollbar -->
    <div
      v-dt-scrollbar
      class="d-recipe-message-input__editor-wrapper"
      :style="{ 'max-height': maxHeight }"
    >
      <dt-rich-text-editor
        ref="richTextEditor"
        v-model="internalInputValue"
        :allow-blockquote="richText"
        :allow-bold="richText"
        :allow-bullet-list="richText"
        :allow-code="richText"
        :allow-codeblock="richText"
        :allow-italic="richText"
        :allow-strike="richText"
        :allow-underline="richText"
        :paste-rich-text="richText"
        :editable="editable"
        :input-aria-label="inputAriaLabel"
        :input-class="inputClass"
        :output-format="outputFormat"
        :auto-focus="autoFocus"
        :link="richText"
        :placeholder="placeholder"
        :prevent-typing="preventTyping"
        :mention-suggestion="mentionSuggestion"
        :channel-suggestion="channelSuggestion"
        :slash-command-suggestion="slashCommandSuggestion"
        :additional-extensions="additionalExtensions"
        :hide-link-bubble-menu="hideLinkBubbleMenu"
        v-bind="removeClassStyleAttrs($attrs)"
        @input="onInput"
        @text-input="onTextInput"
        @enter="onSend"
        @selected="selectedText = $event"
        @selected-command="$emit('selected-command', $event)"
        @edit-link="initLinkDialog"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </div>
    <!-- @slot Slot for attachment carousel -->
    <slot name="middle" />
    <!-- Section for the bottom UI -->
    <section class="d-recipe-message-input__bottom-section">
      <!-- Left content -->
      <div class="d-recipe-message-input__bottom-section-left">
        <dt-stack
          gap="200"
          direction="row"
        >
          <dt-button
            v-if="showImagePicker"
            v-dt-tooltip:top-start="imagePickerButtonLabel"
            data-qa="dt-recipe-message-input-image-btn"
            size="sm"
            class="d-recipe-message-input__button"
            kind="muted"
            importance="clear"
            :aria-label="imagePickerButtonLabel"
            @click="onSelectImage"
            @mouseenter="imagePickerFocus = true"
            @mouseleave="imagePickerFocus = false"
            @focus="imagePickerFocus = true"
            @blur="imagePickerFocus = false"
          >
            <template #icon>
              <dt-icon-image size="300" />
            </template>
          </dt-button>
          <dt-input
            ref="messageInputImageUpload"
            data-qa="dt-recipe-message-input-image-input"
            accept="image/*, video/*"
            type="file"
            class="d-recipe-message-input__image-input"
            multiple
            hidden
            @input="onImageUpload"
          />
          <dt-popover
            v-if="showEmojiPicker"
            open.sync="emojiPickerOpened"
            data-qa="dt-recipe-message-input-emoji-picker-popover"
            initial-focus-element="#searchInput"
            padding="none"
          >
            <template #anchor="{ attrs }">
              <dt-button
                v-dt-tooltip="emojiPickerButtonLabel"
                v-bind="attrs"
                data-qa="dt-recipe-message-input-emoji-picker-btn"
                size="sm"
                class="d-recipe-message-input__button"
                kind="muted"
                importance="clear"
                :aria-label="emojiPickerButtonLabel"
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
            <template #content="{ close }">
              <dt-emoji-picker
                v-bind="emojiPickerProps"
                @add-emoji="$emit('add-emoji')"
                @skin-tone="onSkinTone"
                @selected-emoji="(emoji) => onSelectEmoji(emoji, close)"
              />
            </template>
          </dt-popover>
          <!-- @slot Slot for emojiGiphy picker -->
          <slot name="emojiGiphyPicker" />
          <!-- @slot Slot to add extra action icons next to default ones -->
          <slot name="customActionIcons" />
        </dt-stack>
      </div>
      <!-- Right content -->
      <div class="d-recipe-message-input__bottom-section-right">
        <dt-stack
          direction="row"
          gap="300"
        >
          <!-- @slot Slot for sms count -->
          <div class="d-recipe-message-input__sms-count">
            <slot name="smsCount" />
          </div>

          <!-- Optionally displayed remaining character counter -->
          <dt-tooltip
            v-if="Boolean(showCharacterLimit)"
            class="d-recipe-message-input__remaining-char-tooltip"
            placement="top-end"
            :enabled="characterLimitTooltipEnabled"
            :message="showCharacterLimit.message"
            :offset="[10, 8]"
          >
            <template #anchor>
              <p
                v-show="displayCharacterLimitWarning"
                class="d-recipe-message-input__remaining-char"
                data-qa="dt-recipe-message-input-character-limit"
              >
                {{ showCharacterLimit.count - inputLength }}
              </p>
            </template>
          </dt-tooltip>

          <!-- Cancel button for edit mode -->
          <dt-button
            v-if="showCancel"
            v-dt-tooltip="cancelButtonLabel"
            data-qa="dt-recipe-message-input-cancel-button"
            class="d-recipe-message-input__button d-recipe-message-input__cancel-button"
            size="sm"
            kind="muted"
            importance="clear"
            :aria-label="cancelButtonLabel"
            @click="onCancel"
          >
            <p>{{ cancelButtonLabel }}</p>
          </dt-button>

          <!-- @slot Slot for sendButton picker -->
          <slot name="sendButton">
            <!-- Send button -->
            <!-- Right positioned UI - send button -->
            <dt-button
              v-if="showSend"
              v-dt-tooltip:top-end="sendButtonLabel"
              data-qa="dt-recipe-message-input-send-btn"
              size="sm"
              kind="default"
              importance="primary"
              :class="[
                'd-recipe-message-input__button d-recipe-message-input__send-button',
                {
                  'd-recipe-message-input__send-button--disabled': isSendDisabled,
                  'd-btn--icon-only': showSendIcon,
                },
              ]"
              :aria-label="sendButtonLabel"
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
                  <dt-icon-send :size="sendIconSize" />
                </slot>
              </template>
              <template v-if="showSend.text">
                <p>{{ showSend.text }}</p>
              </template>
            </dt-button>
          </slot>
        </dt-stack>
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
import lastActiveNodes from './last_active_nodes';
import { removeClassStyleAttrs, returnFirstEl, addClassStyleAttrs } from '@/common/utils';
import MeetingPill from './extensions/meeting_pill/meeting_pill';
import { DtButton } from '@/components/button';
import { DtEmojiPicker } from '@/components/emoji_picker';
import { DtPopover } from '@/components/popover';
import { DtInput } from '@/components/input';
import { DtTooltip } from '@/components/tooltip';
import { DtStack } from '@/components/stack';
import {
  DtIconImage, DtIconVerySatisfied, DtIconSatisfied, DtIconSend,
} from '@dialpad/dialtone-icons/vue3';
import DtRecipeMessageInputTopbar from './message_input_topbar.vue';
import DtRecipeMessageInputLink from './message_input_link.vue';
import { DialtoneLocalization } from '@/localization';

import {
  EDITOR_SUPPORTED_LINK_PROTOCOLS,
  EDITOR_DEFAULT_LINK_PREFIX,
} from '../editor/editor_constants.js';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeMessageInput',

  components: {
    DtButton,
    DtEmojiPicker,
    DtInput,
    DtPopover,
    DtRecipeMessageInputTopbar,
    DtRecipeMessageInputLink,
    DtRichTextEditor,
    DtTooltip,
    DtStack,
    DtIconImage,
    DtIconVerySatisfied,
    DtIconSatisfied,
    DtIconSend,
  },

  inheritAttrs: false,

  props: {
    /**
     * Displays all the buttons for rich text formatting above the message input, and enables it within the editor.
     * Rich text formatting for the purposes of this component is defined as:
     *
     * bold, italic, strikethrough, lists, blockquotes, inline code tags, and code blocks.
     *
     * If you are sending a message to a phone rather than a Dialpad to Dialpad message, you should have this as false.
     */
    richText: {
      type: Boolean,
      default: true,
    },

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
      default: 'json',
      validator (outputFormat) {
        return RICH_TEXT_EDITOR_OUTPUT_FORMATS.includes(outputFormat);
      },
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
      default: () => ({}),
    },

    /**
     * Send button defaults.
     * TODO (Dialtone 10):
     * - Change to `showSendButton`, boolean only.
     */
    showSend: {
      type: [Boolean, Object],
      default: () => ({}),
    },

    /**
     * TODO (Dialtone 10):
     * - Add a prop `iconOnly` default: true to control if localized send button text should be shown
     */

    /**
     * Cancel button defaults.
     * TODO (Dialtone 10): Change to `showCancelButton`, boolean only.
     */
    showCancel: {
      type: [Boolean, Object],
      default: () => ({}),
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
     * descriptive text fields for the bold button
     *
     * object format:
     * { keyboardShortcutText: string }
     */
    boldButtonOptions: {
      type: Object,
      default: () => ({
        keyboardShortcutText: 'Mod + B',
      }),
    },

    /**
     * descriptive text fields for the italic button
     *
     * object format:
     * { keyboardShortcutText: string }
     */
    italicButtonOptions: {
      type: Object,
      default: () => ({
        keyboardShortcutText: 'Mod + I',
      }),
    },

    /**
     * descriptive text fields for the strikethrough button
     *
     * object format:
     * { keyboardShortcutText: string }
     */
    strikeButtonOptions: {
      type: Object,
      default: () => ({
        keyboardShortcutText: 'Mod + Shift + S',
      }),
    },

    /**
     * descriptive text fields for the link button
     *
     * object format:
     * { keyboardShortcutText: string }
     */
    linkButtonOptions: {
      type: Object,
      default: () => ({
        // TODO: implement mod k
        keyboardShortcutText: 'Mod + K',
        linkPlaceholder: 'e.g. https://www.dialpad.com',
      }),
    },

    /**
     * descriptive text fields for the bullet list button
     *
     * object format:
     * { keyboardShortcutText: string }
     */
    bulletListButtonOptions: {
      type: Object,
      default: () => ({
        keyboardShortcutText: 'Mod + Shift + 8',
      }),
    },

    /**
     * descriptive text fields for the ordered list button
     *
     * object format:
     * { keyboardShortcutText: string }
     */
    orderedListButtonOptions: {
      type: Object,
      default: () => ({
        keyboardShortcutText: 'Mod + Shift + 7',
      }),
    },

    /**
     * descriptive text fields for the italic button
     *
     * object format:
     * { keyboardShortcutText: string }
     */
    blockQuoteButtonOptions: {
      type: Object,
      default: () => ({
        keyboardShortcutText: 'Mod + Shift + B',
      }),
    },

    /**
     * descriptive text fields for the code button
     *
     * object format:
     * { keyboardShortcutText: string }
     */
    codeButtonOptions: {
      type: Object,
      default: () => ({
        keyboardShortcutText: 'Mod + E',
      }),
    },

    /**
     * descriptive text fields for the code block button
     *
     * object format:
     * { keyboardShortcutText: string }
     */
    codeBlockButtonOptions: {
      type: Object,
      default: () => ({
        keyboardShortcutText: 'Mod + Alt + C',
      }),
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
     * @event update:modelValue
     * @type {String|JSON}
     */
    'update:modelValue',

    /**
     * Emitted when input changes, returns text content only
     * @event text-input
     * @type {String}
     */
    'text-input',

    /**
     * Emitted when the 'Add emoji' button is clicked
     * @event add-emoji
     * @type {Boolean}
     */
    'add-emoji',
  ],

  data () {
    return {
      // If an ordered list is nested within an unordered list, we only want to show the currently selected list as
      // active. This function performs the logic to determine the farthest active node from the root.
      lastActiveNodes,
      additionalExtensions: [
        MeetingPill.configure({
          onClose: (event) => {
            this.$emit('meeting-pill-close', event);
          },
        }),
      ],

      internalInputValue: this.modelValue, // internal input content
      imagePickerFocus: false,
      emojiPickerFocus: false,
      emojiPickerOpened: false,
      isFocused: false,
      linkOptions: {
        class: 'd-link d-c-text d-d-inline-block',
      },

      linkDialogOpen: false,
      selectedText: '',
      text: '',
      hideLinkBubbleMenu: false,
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    showSendIcon () {
      return !this.showSend.text;
    },

    inputLength () {
      return this.text.length;
    },

    displayCharacterLimitWarning () {
      return (
        Boolean(this.showCharacterLimit) &&
        this.showCharacterLimit.count - this.inputLength <=
          this.showCharacterLimit.warning
      );
    },

    characterLimitTooltipEnabled () {
      return (
        this.showCharacterLimit.message &&
        this.showCharacterLimit.count - this.inputLength < 0
      );
    },

    isSendDisabled () {
      return (
        this.disableSend ||
        (this.showCharacterLimit &&
          this.inputLength > this.showCharacterLimit.count)
      );
    },

    emojiPickerHovered () {
      return this.emojiPickerFocus || this.emojiPickerOpened;
    },

    sendIconSize () {
      return '300';
    },

    sendButtonLabel () {
      return this.i18n.$t('DIALTONE_MESSAGE_INPUT_SEND_BUTTON_ARIA_LABEL');
    },

    imagePickerButtonLabel () {
      return this.i18n.$t('DIALTONE_MESSAGE_INPUT_IMAGE_PICKER_BUTTON_ARIA_LABEL');
    },

    emojiPickerButtonLabel () {
      return this.i18n.$t('DIALTONE_MESSAGE_INPUT_EMOJI_PICKER_BUTTON_ARIA_LABEL');
    },

    cancelButtonLabel () {
      return this.i18n.$t('DIALTONE_MESSAGE_INPUT_CANCEL_BUTTON_ARIA_LABEL');
    },
  },

  watch: {
    modelValue (newValue) {
      this.internalInputValue = newValue;
    },

    emojiPickerOpened (newValue) {
      if (!newValue) {
        this.$refs.richTextEditor?.focusEditor();
      }
    },
  },

  created () {
    if (this.modelValue && this.outputFormat === 'text') {
      this.internalInputValue = this.modelValue.replace(/\n/g, '<br>');
    } else {
      this.internalInputValue = this.modelValue;
    }
  },

  methods: {
    removeClassStyleAttrs,
    addClassStyleAttrs,

    linkDialogOpened (value) {
      this.linkDialogOpen = value;
      if (value === true) {
        this.initLinkDialog();
      } else {
        this.hideLinkBubbleMenu = false;
        this.$refs.richTextEditor?.focusEditor();
      }
    },

    handleTopbarClick (type) {
      const editor = this.$refs.richTextEditor?.editor;
      // Key is the name returned in the event, value is the name of the TipTap command function to run.
      const typeToCommandMap = {
        bold: () => editor?.chain().focus().toggleBold().run(),
        italic: () => editor?.chain().focus().toggleItalic().run(),
        strike: () => editor?.chain().focus().toggleStrike().run(),
        bulletList: () => editor?.chain().focus().toggleBulletList().run(),
        orderedList: () => editor?.chain().focus().toggleOrderedList().run(),
        blockquote: () => editor?.chain().focus().toggleBlockquote().run(),
        code: () => editor?.chain().focus().toggleCode().run(),
        codeBlock: () => editor?.chain().focus().toggleCodeBlock().run(),
      };

      if (editor && typeToCommandMap[type]) {
        typeToCommandMap[type]();
      }
    },

    // Checks if the node currently selected is active ex/ the bold button is active if the selected text is bold
    // eslint-disable-next-line complexity
    isSelectionActive (type) {
      if (['bulletList', 'orderedList'].includes(type)) {
        return this.lastActiveNodes(this.$refs.richTextEditor?.editor?.state, [{ type: 'bulletList' }, { type: 'orderedList' }]).includes(type) && this.isFocused;
      }
      return this.$refs.richTextEditor?.editor?.isActive(type) && this.isFocused;
    },

    initLinkDialog () {
      this.$refs.link.setInitialValues(this.selectedText, this.$refs.richTextEditor?.editor?.getAttributes('link')?.href);
      this.hideLinkBubbleMenu = true;
      this.linkDialogOpen = true;
    },

    removeLink () {
      this.$refs.richTextEditor?.removeLink();
      this.linkDialogOpen = false;
    },

    setLink (linkText, linkInput) {
      this.$refs.richTextEditor.setLink(
        linkInput, linkText, this.linkOptions, EDITOR_SUPPORTED_LINK_PROTOCOLS, EDITOR_DEFAULT_LINK_PREFIX,
      );
      this.linkDialogOpen = false;
    },

    // Mousedown instead of click because it fires before the blur event.
    onMousedown (e) {
      const isWithinInput = returnFirstEl(this.$refs.richTextEditor.$el)
        .querySelector('.tiptap')
        .contains(e.target);

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

    onSelectEmoji (emoji, close) {
      if (!emoji) {
        return;
      }

      if (!emoji.shift_key) {
        close();
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
      this.$emit(
        'select-media',
        this.$refs.messageInputImageUpload.$refs.input.files,
      );
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
      this.$emit('update:modelValue', event);
    },

    onTextInput (event) {
      this.text = event;
      this.$emit('text-input', event);
    },
  },
};
</script>
