<!-- eslint-disable max-lines -->
<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div
    data-qa="dt-recipe-message-input"
    role="presentation"
    :class="['d-recipe-message-input', 'd-of-hidden']"
    @dragover.prevent
    @drop.prevent="onDrop"
    @paste="onPaste"
    @mousedown="onMousedown"
  >
    <!-- @slot Renders above the input, but still within the borders. -->
    <slot name="top" />
    <!-- Some wrapper to restrict the height and show the scrollbar -->
    <!-- Section for the top UI -->
    <dt-stack
      direction="row"
      gap="200"
      class="d-p8 d-bgc-secondary"
    >
      <dt-button
        data-qa="bold"
        importance="clear"
        kind="muted"
        class="d-ol-none"
        size="xs"
        @click="$refs.richTextEditor?.editor?.chain().focus().toggleBold().run()"
      >
        <template #icon>
          <dt-icon-bold
            class="d-fw-bold"
            size="200"
          />
        </template>
      </dt-button>
      <dt-button
        data-qa="italic"
        importance="clear"
        kind="muted"
        class="d-ol-none"
        size="xs"
        @click="$refs.richTextEditor?.editor?.chain().focus().toggleItalic().run()"
      >
        <template #icon>
          <dt-icon-italic
            class="d-fw-bold"
            size="200"
          />
        </template>
      </dt-button>
      <dt-button
        data-qa="strikethrough"
        importance="clear"
        kind="muted"
        class="d-ol-none"
        size="xs"
        @click="$refs.richTextEditor?.editor?.chain().focus().toggleStrike().run()"
      >
        <template #icon>
          <dt-icon-strikethrough
            class="d-fw-bold"
            size="200"
          />
        </template>
      </dt-button>
      <div class="d-recipe-message-input--button-group-divider" />
      <dt-popover
        :open.sync="showLinkInput"
        placement="bottom-start"
        :visually-hidden-close="true"
        :visually-hidden-close-label="'Close link input popover'"
        data-qa="dt-editor-link-input-popover"
        :show-close-button="false"
        @click="onInputFocus"
        @click.native.stop="onInputFocus"
        @opened="updateInput"
      >
        <template #anchor>
          <dt-tooltip
            :key="linkButton.key"
            :message="linkButton.tooltipMessage"
            placement="top"
          >
            <template #anchor>
              <dt-button
                :data-qa="linkButton.dataQA"
                importance="clear"
                kind="muted"
                class="d-ol-none"
                :active="$refs.richTextEditor?.editor?.isActive(linkButton.selector)"
                size="xs"
                :aria-label="linkButton.tooltipMessage"
                @click="linkButton.onClick()"
              >
                <template #icon>
                  <component
                    :is="linkButton.icon"
                    size="200"
                    class="d-fw-bold"
                  />
                </template>
              </dt-button>
            </template>
          </dt-tooltip>
        </template>

        <template #content>
          <span
            v-if="showAddLink.setLinkTitle.length > 0"
          >
            {{ showAddLink.setLinkTitle }}
          </span>
          <dt-input
            v-model="linkInput"
            :input-aria-label="showAddLink.setLinkInputAriaLabel"
            data-qa="dt-editor-link-input"
            :placeholder="setLinkPlaceholder"
            input-wrapper-class="d-bgc-secondary d-mt6 d-bar5 d-ba d-baw1 d-bc-default d-py2 d-ol-none"
            @click="onInputFocus"
            @click.native.stop="onInputFocus"
            @focus="onInputFocus"
            @keydown.enter="setLink"
          />
        </template>
        <template #footerContent>
          <div class="d-ml8 d-mr12">
            <dt-button
              class="d-mx2"
              :aria-label="removeLinkButton.ariaLabel"
              importance="clear"
              kind="muted"
              size="sm"
              data-qa="dt-editor-remove-link-btn"
              @click="removeLink"
            >
              {{ removeLinkButton.label }}
            </dt-button>
            <dt-button
              class="d-mx2"
              :aria-label="cancelSetLinkButton.ariaLabel"
              importance="clear"
              kind="muted"
              size="sm"
              data-qa="dt-editor-set-link-cancel-btn"
              @click="closeLinkInput"
            >
              {{ cancelSetLinkButton.label }}
            </dt-button>
            <dt-button
              class="d-mx2"
              size="sm"
              :aria-label="confirmSetLinkButton.ariaLabel"
              data-qa="dt-editor-set-link-confirm-btn"
              @click="setLink"
            >
              {{ confirmSetLinkButton.label }}
            </dt-button>
          </div>
        </template>
      </dt-popover>

      <div class="d-recipe-message-input--button-group-divider" />

      <dt-button
        data-qa="bullet-list"
        importance="clear"
        kind="muted"
        class="d-ol-none"
        :active="$refs.richTextEditor?.editor?.isActive('bulletList')"
        size="xs"
        @click="$refs.richTextEditor?.editor?.chain().focus().toggleBulletList().run()"
      >
        <template #icon>
          <dt-icon-list-bullet
            class="d-fw-bold"
            size="200"
          />
        </template>
      </dt-button>
      <dt-button
        data-qa="ordered-list"
        importance="clear"
        kind="muted"
        class="d-ol-none"
        :active="$refs.richTextEditor?.editor?.isActive('orderedList')"
        size="xs"
        @click="$refs.richTextEditor?.editor?.chain().focus().toggleOrderedList().run()"
      >
        <template #icon>
          <dt-icon-list-ordered
            class="d-fw-bold"
            size="200"
          />
        </template>
      </dt-button>
      <div class="d-recipe-message-input--button-group-divider" />
      <dt-button
        data-qa="quote"
        importance="clear"
        kind="muted"
        class="d-ol-none"
        size="xs"
        @click="$refs.richTextEditor?.editor?.chain().focus().toggleBlockquote().run()"
      >
        <template #icon>
          <dt-icon-quote
            class="d-fw-bold"
            size="200"
          />
        </template>
      </dt-button>
      <div class="d-recipe-message-input--button-group-divider" />
      <dt-button
        data-qa="code"
        importance="clear"
        kind="muted"
        class="d-ol-none"
        size="xs"
        @click="$refs.richTextEditor?.editor?.chain().focus().toggleCode().run()"
      >
        <template #icon>
          <dt-icon-code
            class="d-fw-bold"
            size="200"
          />
        </template>
      </dt-button>
      <dt-button
        data-qa="code-block"
        importance="clear"
        kind="muted"
        class="d-ol-none"
        size="xs"
        @click="$refs.richTextEditor?.editor?.chain().focus().toggleCodeBlock().run()"
      >
        <template #icon>
          <dt-icon-code-block
            class="d-fw-bold"
            size="200"
          />
        </template>
      </dt-button>
    </dt-stack>
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
        :allow-blockquote="allowBlockquote"
        :allow-bold="allowBold"
        :allow-bullet-list="allowBulletList"
        :allow-code="allowCode"
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
            v-model:open="emojiPickerOpened"
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
        </dt-stack>
      </div>
      <!-- Right content -->
      <div class="d-recipe-message-input__bottom-section-right">
        <dt-stack
          direction="row"
          gap="300"
        >
          <!-- @slot Slot for sms count -->
          <div class="d-d-flex d-ai-center">
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
import MeetingPill from './extensions/meeting_pill/meeting_pill';
import { DtButton } from '@/components/button';
import { DtEmojiPicker } from '@/components/emoji_picker';
import { DtPopover } from '@/components/popover';
import { DtInput } from '@/components/input';
import { DtTooltip } from '@/components/tooltip';
import { DtStack } from '@/components/stack';
import {
  DtIconImage, DtIconVerySatisfied, DtIconSatisfied, DtIconSend,
  DtIconLink2, DtIconListBullet, DtIconBold, DtIconItalic, DtIconStrikethrough,
  DtIconListOrdered, DtIconQuote, DtIconCode, DtIconCodeBlock,
} from '@dialpad/dialtone-icons/vue2';

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
    DtIconListBullet,
    DtRichTextEditor,
    DtTooltip,
    DtStack,
    DtIconImage,
    DtIconVerySatisfied,
    DtIconSatisfied,
    DtIconSend,
    DtIconBold,
    DtIconItalic,
    DtIconStrikethrough,
    DtIconListOrdered,
    DtIconQuote,
    DtIconCode,
    DtIconCodeBlock,
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
     * Whether the input allows inline code (wrapped in backticks).
     */
    allowCode: {
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

    /**
     * Confirm set link button defaults.
     */
    confirmSetLinkButton: {
      type: Object,
      default: () => ({ label: 'Confirm', ariaLabel: 'Confirm set link' }),
    },

    /**
     * Remove link button defaults.
     */
    removeLinkButton: {
      type: Object,
      default: () => ({ label: 'Remove', ariaLabel: 'Remove link' }),
    },

    /**
     * Cancel set link button defaults.
     */
    cancelSetLinkButton: {
      type: Object,
      default: () => ({ label: 'Cancel', ariaLabel: 'Cancel set link' }),
    },

    /**
     * Placeholder text for the set link input field
     */
    setLinkPlaceholder: {
      type: String,
      default: '',
    },

    /**
     * Show add link default config.
     */
    showAddLink: {
      type: Object,
      default: () => ({
        showAddLinkButton: true,
        setLinkTitle: 'Add a link',
        setLinkInputAriaLabel: 'Input field to add link',
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
  ],

  data () {
    return {
      additionalExtensions: [MeetingPill],
      internalInputValue: this.value, // internal input content
      imagePickerFocus: false,
      emojiPickerFocus: false,
      emojiPickerOpened: false,
      linkOptions: {
        class: 'd-link d-c-text d-d-inline-block',
      },

      showLinkInput: false,
      linkInput: '',
    };
  },

  computed: {
    linkButton () {
      return { showBtn: this.showAddLink.showAddLinkButton, selector: 'link', icon: DtIconLink2, dataQA: 'dt-editor-add-link-btn', tooltipMessage: 'Link', onClick: this.openLinkInput };
    },

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
    onInputFocus (event) {
      event?.stopPropagation();
    },

    openLinkInput () {
      this.showLinkInput = true;
    },

    removeLink () {
      this.$refs.richTextEditor?.editor?.chain()?.focus()?.unsetLink()?.run();
      this.closeLinkInput();
    },

    closeLinkInput () {
      this.showLinkInput = false;
      this.linkInput = '';
      this.$refs.richTextEditor.editor?.chain().focus();
    },

    setLink (event) {
      const editor = this.$refs.richTextEditor?.editor;
      event?.preventDefault();
      event?.stopPropagation();

      if (!this.linkInput) {
        // If link text is set to empty string,
        // remove any existing links.
        this.removeLink();
        return;
      }

      // Check if input matches any of the supported link formats
      const prefix = EDITOR_SUPPORTED_LINK_PROTOCOLS.find(prefixRegex => prefixRegex.test(this.linkInput));

      if (!prefix) {
        // If no matching pattern is found, prepend default prefix
        this.linkInput = `${EDITOR_DEFAULT_LINK_PREFIX}${this.linkInput}`;
      }

      const selection = editor?.view?.state?.selection;

      if (selection.anchor === selection.head) {
        // If no text has been selected, manually insert the link text.
        // Do not rely on link options set through DtRichTextEditor
        // component, because they clash with these and cause issues.
        editor
          .chain()
          .focus()
          .insertContentAt(
            selection.anchor,
            `<a class="${this.linkOptions.class}" href=${this.linkInput}>${this.linkInput}</a>`,
          )
          .run();
      } else {
        // Set or edit the link
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: this.linkInput, class: this.linkOptions.class })
          .run();
      }

      this.closeLinkInput();
    },

    updateInput (openedInput) {
      if (!openedInput) {
        return this.closeLinkInput();
      }
      this.linkInput = this.$refs.richTextEditor?.editor?.getAttributes('link')?.href;
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
  },
};
</script>
