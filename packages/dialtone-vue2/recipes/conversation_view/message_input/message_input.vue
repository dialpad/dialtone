<!-- eslint-disable max-lines -->
<template>
  <div
    data-qa="dt-recipe-message-input"
    role="presentation"
    class="d-recipe-message-input"
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
        :allow-blockquote="richText"
        :allow-bold="richText"
        :allow-bullet-list="richText"
        :allow-code="richText"
        :allow-codeblock="richText"
        :allow-italic="richText"
        :allow-strike="richText"
        :allow-underline="richText"
        :additional-extensions="additionalExtensions"
        :hide-link-bubble-menu="hideLinkBubbleMenu"
        v-bind="$attrs"
        @input="onInput"
        @text-input="onTextInput"
        @enter="onSend"
        @selected="selectedText = $event"
        @edit-link="initLinkDialog"
        @focus="isFocused = true"
        @blur="isFocused = false"
        v-on="$listeners"
      />
    </div>
    <!-- @slot Slot for attachment carousel -->
    <slot name="middle" />
    <!-- Section for the bottom UI -->
    <section class="d-recipe-message-input__bottom-section">
      <!-- Left content -->
      <div class="d-recipe-message-input__bottom-section-left">
        <dt-stack
          direction="row"
          gap="200"
        >
          <dt-button
            v-if="showImagePicker"
            v-dt-tooltip:top-start="showImagePicker?.tooltipLabel"
            data-qa="dt-recipe-message-input-image-btn"
            size="sm"
            class="d-recipe-message-input__button"
            kind="muted"
            importance="clear"
            :aria-label="showImagePicker.ariaLabel"
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
                v-dt-tooltip="emojiTooltipMessage"
                v-bind="attrs"
                data-qa="dt-recipe-message-input-emoji-picker-btn"
                size="sm"
                class="d-recipe-message-input__button"
                kind="muted"
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
            <template #content="{ close }">
              <dt-emoji-picker
                v-bind="emojiPickerProps"
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
            data-qa="dt-recipe-message-input-cancel-button"
            class="d-recipe-message-input__button d-recipe-message-input__cancel-button"
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
import MeetingPill from './extensions/meeting_pill/meeting_pill';
import { DtButton } from '@/components/button';
import { DtEmojiPicker } from '@/components/emoji_picker';
import { DtPopover } from '@/components/popover';
import { DtInput } from '@/components/input';
import { DtTooltip } from '@/components/tooltip';
import { DtStack } from '@/components/stack';
import {
  DtIconImage, DtIconVerySatisfied, DtIconSatisfied, DtIconSend,
} from '@dialpad/dialtone-icons/vue2';
import DtRecipeMessageInputTopbar from './message_input_topbar.vue';
import DtRecipeMessageInputLink from './message_input_link.vue';

import {
  EDITOR_SUPPORTED_LINK_PROTOCOLS,
  EDITOR_DEFAULT_LINK_PREFIX,
} from '../editor/editor_constants.js';

export default {
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

  mixins: [],

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
     * Enables the TipTap Link extension and optionally passes configurations to it
     */
     link: {
      type: [Boolean, Object],
      default: false,
    },

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
     * descriptive text fields for the bold button
     *
     * object format:
     * { ariaLabel: string, tooltipText: string, keyboardShortcutText: string }
     */
    boldButtonOptions: {
      type: Object,
      default: () => ({
        ariaLabel: 'Toggle bold on selected text',
        tooltipText: 'Bold',
        keyboardShortcutText: 'Mod + B',
      }),
    },

    /**
     * descriptive text fields for the italic button
     *
     * object format:
     * { ariaLabel: string, tooltipText: string, keyboardShortcutText: string }
     */
    italicButtonOptions: {
      type: Object,
      default: () => ({
        ariaLabel: 'Toggle italic on selected text',
        tooltipText: 'Italic',
        keyboardShortcutText: 'Mod + I',
      }),
    },

    /**
     * descriptive text fields for the strikethrough button
     *
     * object format:
     * { ariaLabel: string, tooltipText: string, keyboardShortcutText: string }
     */
    strikeButtonOptions: {
      type: Object,
      default: () => ({
        ariaLabel: 'Toggle strikethrough on selected text',
        tooltipText: 'Strikethrough',
        keyboardShortcutText: 'Mod + Shift + S',
      }),
    },

    /**
     * descriptive text fields for the link button
     *
     * object format:
     * { ariaLabel: string, tooltipText: string, keyboardShortcutText: string }
     */
    linkButtonOptions: {
      type: Object,
      default: () => ({
        ariaLabel: 'Create or edit link on selected text',
        tooltipText: 'Link',
        // TODO: implement mod k
        keyboardShortcutText: 'Mod + K',
        dialogTitle: 'Add a link',
        textLabel: 'Text to display (optional)',
        linkLabel: 'Link',
        linkPlaceholder: 'e.g. https://www.dialpad.com',
        removeLabel: 'Remove',
        cancelLabel: 'Cancel',
        confirmLabel: 'Done',
        visuallyHiddenCloseText: 'Close link dialog',
      }),
    },

    /**
     * descriptive text fields for the bullet list button
     *
     * object format:
     * { ariaLabel: string, tooltipText: string, keyboardShortcutText: string }
     */
    bulletListButtonOptions: {
      type: Object,
      default: () => ({
        ariaLabel: 'Toggle bullet list on selected text',
        tooltipText: 'Bullet list',
        keyboardShortcutText: 'Mod + Shift + 8',
      }),
    },

    /**
     * descriptive text fields for the ordered list button
     *
     * object format:
     * { ariaLabel: string, tooltipText: string, keyboardShortcutText: string }
     */
    orderedListButtonOptions: {
      type: Object,
      default: () => ({
        ariaLabel: 'Toggle ordered list on selected text',
        tooltipText: 'Ordered list',
        keyboardShortcutText: 'Mod + Shift + 7',
      }),
    },

    /**
     * descriptive text fields for the italic button
     *
     * object format:
     * { ariaLabel: string, tooltipText: string, keyboardShortcutText: string }
     */
    blockQuoteButtonOptions: {
      type: Object,
      default: () => ({
        ariaLabel: 'Toggle Blockquote on selected text',
        tooltipText: 'Blockquote',
        keyboardShortcutText: 'Mod + Shift + B',
      }),
    },

    /**
     * descriptive text fields for the code button
     *
     * object format:
     * { ariaLabel: string, tooltipText: string, keyboardShortcutText: string }
     */
    codeButtonOptions: {
      type: Object,
      default: () => ({
        ariaLabel: 'Toggle code tag on selected text',
        tooltipText: 'Code',
        keyboardShortcutText: 'Mod + E',
      }),
    },

    /**
     * descriptive text fields for the code block button
     *
     * object format:
     * { ariaLabel: string, tooltipText: string, keyboardShortcutText: string }
     */
    codeBlockButtonOptions: {
      type: Object,
      default: () => ({
        ariaLabel: 'Toggle code block on selected text',
        tooltipText: 'Code block',
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
     * @event update:value
     * @type {String|JSON}
     */
    'update:value',

    /**
     * Emitted when input changes, returns text content only
     * @event text-input
     * @type {String}
     */
    'text-input',
  ],

  data () {
    return {
      // If an ordered list is nested within an unordered list, we only want to show the currently selected list as
      // active. This function performs the logic to determine the farthest active node from the root.
      lastActiveNodes,
      additionalExtensions: [MeetingPill],
      internalInputValue: this.value, // internal input content
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
    } else {
      this.internalInputValue = this.value;
    }
  },

  methods: {
    linkDialogOpened (value) {
      this.linkDialogOpen = value;
      if (value === true) {
        this.initLinkDialog();
      } else {
        this.hideLinkBubbleMenu = false;
        this.$refs.richTextEditor?.focusEditor();
      }
    },

    // eslint-disable-next-line complexity
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

    onTextInput (event) {
      this.text = event;
      this.$emit('text-input', event);
    },
  },
};
</script>
