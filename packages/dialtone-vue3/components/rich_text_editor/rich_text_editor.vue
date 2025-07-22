<!-- eslint-disable vue/no-static-inline-styles -->
<!-- eslint-disable vue/no-bare-strings-in-template -->
<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div>
    <!-- why the hell is this visibility: hidden by default??? -->
    <bubble-menu
      v-if="editor && link && !hideLinkBubbleMenu"
      :editor="editor"
      :should-show="bubbleMenuShouldShow"
      :tippy-options="tippyOptions"
      style="visibility: visible;"
    >
      <div class="d-popover__dialog">
        <dt-stack
          direction="row"
          class="d-rich-text-editor-bubble-menu__button-stack"
          gap="0"
        >
          <dt-button
            kind="muted"
            importance="clear"
            @click="editLink"
          >
            {{ i18n.$t('DIALTONE_RICH_TEXT_EDITOR_EDIT_BUTTON_LABEL') }}
          </dt-button>
          <dt-button
            kind="muted"
            importance="clear"
            @click="openLink"
          >
            {{ i18n.$t('DIALTONE_RICH_TEXT_EDITOR_OPEN_LINK_BUTTON_LABEL') }}
          </dt-button>
          <dt-button
            kind="danger"
            importance="clear"
            @click="removeLink"
          >
            {{ i18n.$t('DIALTONE_RICH_TEXT_EDITOR_REMOVE_BUTTON_LABEL') }}
          </dt-button>
        </dt-stack>
      </div>
    </bubble-menu>
    <editor-content
      ref="editor"
      :editor="editor"
      class="d-rich-text-editor"
      data-qa="dt-rich-text-editor"
      v-bind="attrs"
    />
  </div>
</template>

<script>
/* eslint-disable max-lines */
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3';
import { Extension } from '@tiptap/core';
import { DtButton } from '../button';
import { DtStack } from '../stack';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Italic from '@tiptap/extension-italic';
import TipTapLink from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import History from '@tiptap/extension-history';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Emoji from './extensions/emoji';
import CustomLink from './extensions/custom_link';
import ConfigurableImage from './extensions/image';
import DivParagraph from './extensions/div';
import { MentionPlugin } from './extensions/mentions/mention';
import { ChannelPlugin } from './extensions/channels/channel';
import { SlashCommandPlugin } from './extensions/slash_command/slash_command';
import {
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
  RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
} from './rich_text_editor_constants';
import { emojiPattern } from 'regex-combined-emojis';

import mentionSuggestion from './extensions/mentions/suggestion';
import channelSuggestion from './extensions/channels/suggestion';
import slashCommandSuggestion from './extensions/slash_command/suggestion';
import { warnIfUnmounted, returnFirstEl } from '@/common/utils';
import deepEqual from 'deep-equal';
import { DialtoneLocalization } from '@/localization';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRichTextEditor',

  components: {
    EditorContent,
    BubbleMenu,
    DtButton,
    DtStack,
  },

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
     * Prevents the user from typing any further. Deleting text will still work.
     */
    preventTyping: {
      type: Boolean,
      default: false,
    },

    /**
     * When this option is false the editor will only ever paste plain text, no rich text formatting will be applied,
     * and any HTML will be rendered as text.
     */
    pasteRichText: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether the input allows for line breaks to be introduced in the text by pressing enter. If this is disabled,
     * line breaks can still be entered by pressing shift+enter.
     */
    allowLineBreaks: {
      type: Boolean,
      default: false,
    },

    /**
     * Descriptive label for the input element
     */
    inputAriaLabel: {
      type: String,
      required: true,
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
      default: 'html',
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
     * Enables the TipTap Link extension and optionally passes configurations to it
     *
     * It is not recommended to use this and the custom link extension at the same time.
     */
    link: {
      type: [Boolean, Object],
      default: false,
    },

    /**
     * Enables the Custom Link extension and optionally passes configurations to it
     *
     * It is not recommended to use this and the built in TipTap link extension at the same time.
     *
     * The custom link does some additional things on top of the built in TipTap link
     * extension such as styling phone numbers and IP adresses as links, and allows you
     * to linkify text without having to type a space after the link. Currently it is missing some
     * functionality such as editing links and will likely require more work to be fully usable,
     * so it is recommended to use the built in TipTap link for now.
     */
    customLink: {
      type: [Boolean, Object],
      default: false,
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
     * Note that slash commands only work when they are the first word in the input.
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
     * Whether the input allows inline images to be rendered.
     */
    allowInlineImages: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the input allows color to be introduced in the text.
     */
    allowFontColor: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the input allows different font-families to be introduced in the text.
     */
    allowFontFamily: {
      type: Boolean,
      default: false,
    },

    /**
     * Additional TipTap extensions to be added to the editor.
     */
    additionalExtensions: {
      type: Array,
      default: () => [],
    },

    /**
     * Manually hide the link bubble menu. The link bubble menu is shown when a link is selected via the cursor.
     * There are some cases when you may want the link to remain selected but hide the bubble menu such as when You
     * are showing a custom link editor popup.
     */
    hideLinkBubbleMenu: {
      type: Boolean,
      default: false,
    },

    /**
     * Show text in HTML div tags instead of paragraph tags
     */
    useDivTags: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Editor input event
     * @event input
     * @type {String|JSON}
     */
    'input',

    /**
     * Input event always in JSON format.
     * @event input
     * @type {JSON}
     */
    'json-input',

    /**
     * Input event always in HTML format.
     * @event input
     * @type {HTML}
     */
    'html-input',

    /**
     * Input event always in text format.
     * @event input
     * @type {String}
     */
    'text-input',

    /**
     * Event to sync the value with the parent
     * @event update:value
     * @type {String|JSON}
     */
    'update:modelValue',

    /**
     * Editor blur event
     * @event blur
     * @type {FocusEvent}
     */
    'blur',

    /**
     * Editor focus event
     * @event focus
     * @type {FocusEvent}
     */
    'focus',

    /**
     * Enter was pressed. Note that shift enter must be pressed to line break the input.
     * @event enter
     * @type {String}
     */
    'enter',

    /**
     * "Edit link" button was clicked. Fires an event for the consuming component to handle the editing of the link.
     * event contains the link object with two properties href and text.
     * @event edit-link
     * @type {Object}
     */
    'edit-link',

    /**
     * "Selected" event is fired when the user selects text in the editor. returns the currently selected text.
     * If the selected text is partially a link, the full link text is returned.
     * @event selected
     * @type {String}
     */
    'selected',

    /**
     * Event fired when a slash command is selected
     * @event selected-command
     * @type {String}
     */
    'selected-command',
  ],

  data () {
    return {
      editor: null,
      tippyOptions: {
        appendTo: () => returnFirstEl(this.$refs.editor.$el).getRootNode()?.querySelector('body'),
        placement: 'top-start',
      },

      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    attrs () {
      return {
        ...this.$attrs,
        onInput: () => {},
        onFocus: () => {},
        onBlur: () => {},
      };
    },

    // eslint-disable-next-line complexity
    extensions () {
      // These are the default extensions needed just for plain text.
      const extensions = [Document, Text, History, HardBreak];
      extensions.push(this.useDivTags ? DivParagraph : Paragraph);

      if (this.allowBlockquote) {
        extensions.push(Blockquote);
      }
      if (this.allowBold) {
        extensions.push(Bold);
      }
      if (this.allowBulletList) {
        extensions.push(BulletList);
        extensions.push(ListItem.extend({
          renderText ({ node }) {
            return node.textContent;
          },
        }));
        extensions.push(OrderedList);
      }
      if (this.allowItalic) {
        extensions.push(Italic);
      }
      if (this.allowStrike) {
        extensions.push(Strike);
      }
      if (this.allowUnderline) {
        extensions.push(Underline);
      }

      // Enable placeholderText
      if (this.placeholder) {
        extensions.push(
          Placeholder.configure({ placeholder: this.placeholder }),
        );
      }

      const self = this;
      const ShiftEnter = Extension.create({
        addKeyboardShortcuts () {
          return {
            'Shift-Enter': ({ editor }) => {
              if (self.allowLineBreaks) {
                return false;
              }
              editor.commands.first(({ commands }) => [
                () => commands.newlineInCode(),
                () => self.allowBulletList && commands.splitListItem('listItem'),
                () => commands.createParagraphNear(),
                () => commands.liftEmptyBlock(),
                () => commands.splitBlock(),
              ]);
              return true;
            },
            Enter: () => {
              if (self.allowLineBreaks) {
                return false;
              }
              self.$emit('enter');
              return true;
            },
          };
        },
      });
      extensions.push(ShiftEnter);

      if (this.link) {
        extensions.push(TipTapLink.extend({ inclusive: false }).configure({
          HTMLAttributes: {
            class: 'd-link d-wb-break-all',
          },
          openOnClick: false,
          autolink: true,
          protocols: RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
        }));
      }
      if (this.customLink) {
        extensions.push(this.getExtension(CustomLink, this.customLink));
      }

      if (this.mentionSuggestion) {
        // Add both the suggestion plugin as well as means for user to add suggestion items to the plugin
        const suggestionObject = { ...this.mentionSuggestion, ...mentionSuggestion };
        extensions.push(MentionPlugin.configure({ suggestion: suggestionObject }));
      }

      if (this.channelSuggestion) {
        // Add both the suggestion plugin as well as means for user to add suggestion items to the plugin
        const suggestionObject = { ...this.channelSuggestion, ...channelSuggestion };
        extensions.push(ChannelPlugin.configure({ suggestion: suggestionObject }));
      }

      if (this.slashCommandSuggestion) {
        // Add both the suggestion plugin as well as means for user to add suggestion items to the plugin
        const suggestionObject = { ...this.slashCommandSuggestion, ...slashCommandSuggestion };
        extensions.push(SlashCommandPlugin.configure({
          suggestion: suggestionObject,
          onSelectedCommand: (command) => {
            this.$emit('selected-command', command);
          },
        }));
      }

      // Emoji has some interactions with Enter key
      // hence this should be done last otherwise the enter wont add a emoji.
      extensions.push(Emoji);

      extensions.push(TextAlign.configure({
        types: ['paragraph'],
      }));

      if (this.allowCode) {
        extensions.push(Code);
      }

      if (this.allowCodeblock) {
        extensions.push(CodeBlock.extend({
          renderText ({ node }) {
            return `\`\`\`\n${node.textContent}\n\`\`\``;
          },
        }).configure({
          HTMLAttributes: {
            class: 'd-rich-text-editor__code-block',
          },
        }));
      }

      if (this.allowInlineImages) {
        extensions.push(ConfigurableImage);
      }

      if (this.allowFontFamily || this.allowFontColor) {
        extensions.push(TextStyle);

        if (this.allowFontColor) {
          extensions.push(Color);
        }

        if (this.allowFontFamily) {
          extensions.push(FontFamily);
        }
      }

      if (this.additionalExtensions.length) {
        extensions.push(...this.additionalExtensions);
      }

      return extensions;
    },

    inputAttrs () {
      const attrs = {
        'aria-label': this.inputAriaLabel,
        'aria-multiline': true,
        role: 'textbox',
      };
      if (!this.editable) {
        attrs['aria-readonly'] = true;
      }
      return attrs;
    },
  },

  /**
   * Because the Editor instance is initialized when mounted it does not get
   * updated props automatically, so the ones that can change after mount have
   * to be hooked up to the Editor's own API.
   */
  watch: {
    editable (isEditable) {
      this.editor.setEditable(isEditable);
      this.updateEditorAttributes({ 'aria-readonly': !isEditable });
    },

    inputClass (newClass) {
      this.updateEditorAttributes({ class: newClass });
    },

    inputAriaLabel (newLabel) {
      this.updateEditorAttributes({ 'aria-label': newLabel });
    },

    extensions () {
      // Extensions can't be registered on the fly, so just recreate the editor.
      // https://github.com/ueberdosis/tiptap/issues/1044
      this.destroyEditor();
      this.createEditor();
    },

    modelValue (newValue) {
      this.processValue(newValue);
    },
  },

  created () {
    this.createEditor();
  },

  beforeUnmount () {
    this.destroyEditor();
  },

  mounted () {
    warnIfUnmounted(returnFirstEl(this.$el), this.$options.name);
    this.processValue(this.modelValue, false);
  },

  methods: {

    createEditor () {
      // For all available options, see https://tiptap.dev/api/editor#settings
      this.editor = new Editor({
        autofocus: this.autoFocus,
        content: this.modelValue,
        editable: this.editable,
        extensions: this.extensions,
        parseOptions: {
          preserveWhitespace: 'full',
        },

        editorProps: {
          attributes: {
            ...this.inputAttrs,
            class: this.inputClass,
          },

          handleKeyDown: (view, event) => {
            // When preventTyping is true, only allow backspace to take effect
            if (this.preventTyping && event.key !== 'Backspace') {
              return true; // Prevent the event from being processed
            }
            return false; // Allow the event to be processed normally
          },

          handlePaste: (view, event, slice) => {
            const clipboardData = event.clipboardData || window.clipboardData;
            const textData = clipboardData.getData('text/plain');
            const htmlData = clipboardData.getData('text/html');

            return this.processPasteData(view, textData, htmlData);
          },

          // Moves the <br /> tags inside the previous closing tag to avoid
          // Prosemirror wrapping them within another </p> tag.
          transformPastedHTML (html) {
            return html.replace(/(<\/\w+>)((<br \/>)+)/g, '$2$3$1');
          },
        },
      });
      this.addEditorListeners();
    },

    bubbleMenuShouldShow ({ editor, view, state, oldState, from, to }) {
      return editor.isActive('link');
    },

    /**
     * If the selection contains a link, return the existing link text.
     * Otherwise, use just the selected text.
     * @param editor the editor instance.
     */
    getSelectedLinkText (editor) {
      const { view, state } = editor;
      const { from, to } = view.state.selection;
      const text = state.doc.textBetween(from, to, '');
      const linkNode = this.editor.state.doc.nodeAt(from);
      if (linkNode && linkNode.marks?.at(0)?.type?.name === 'link') {
        return linkNode.textContent;
      } else {
        return text;
      }
    },

    editLink () {
      const linkText = this.getSelectedLinkText(this.editor);

      const link = {
        href: this.editor.getAttributes('link').href,
        text: linkText,
      };
      this.$emit('edit-link', link);
    },

    removeLink () {
      this.editor?.chain()?.focus()?.unsetLink()?.run();
    },

    openLink () {
      this.editor?.chain()?.focus();
      const link = this.editor.getAttributes('link').href;
      window.open(link, '_blank');
    },

    // eslint-disable-next-line complexity
    setLink (linkInput, linkText, linkOptions, linkProtocols = RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
      defaultPrefix) {
      if (!linkInput) {
        // If link text is set to empty string,
        // remove any existing links.
        this.removeLink();
        return;
      }

      // Check if input matches any of the supported link formats
      const prefix = linkProtocols.find(prefixRegex => prefixRegex.test(linkInput));

      if (!prefix) {
        // If no matching pattern is found, prepend default prefix
        linkInput = `${defaultPrefix}${linkInput}`;
      }

      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .run();

      const selection = this.editor?.view?.state?.selection;

      this.editor
        .chain()
        .focus()
        .insertContent(linkText)
        .setTextSelection({ from: selection.from, to: selection.from + linkText.length })
        .setLink({ href: linkInput, class: linkOptions.class })
        .run();
    },

    // eslint-disable-next-line complexity
    processValue (newValue, returnIfEqual = true) {
      const currentValue = this.getOutput();

      if (returnIfEqual && deepEqual(newValue, currentValue)) {
        // The new value came from this component and was passed back down
        // through the parent, so don't do anything here.
        return;
      }

      // If the text contains emoji characters convert them to emoji component tags
      if (typeof newValue === 'string' && this.outputFormat === 'text') {
        const inputUnicodeRegex = new RegExp(`(${emojiPattern})`, 'g');
        newValue = newValue?.replace(inputUnicodeRegex, '<emoji-component code="$1"></emoji-component>');
      }

      // Otherwise replace the content (resets the cursor position).
      this.editor.commands.setContent(newValue, false, { preserveWhitespace: 'full' });
    },

    destroyEditor () {
      this.editor.destroy();
    },

    insertPlainTextWithHardBreaks (view, textData) {
      const { tr } = view.state;
      const { from, to } = view.state.selection;

      // Delete selected content
      tr.deleteRange(from, to);

      // Split text by line breaks and insert with hard breaks
      const lines = textData.split(/\r?\n/);
      let pos = from;

      for (let i = 0; i < lines.length; i++) {
        if (i > 0) {
          // Insert hard break for line breaks (except before first line)
          tr.insert(pos, view.state.schema.nodes.hardBreak.create());
          pos++;
        }
        // Insert text content (including empty strings for blank lines)
        tr.insertText(lines[i], pos);
        pos += lines[i].length;
      }

      view.dispatch(tr);
    },

    shouldPreserveLineBreaks (textData, htmlData) {
      // When pasteRichText is false, always use plain text handling to ensure HTML tags are literal
      if (!this.pasteRichText) {
        return !!textData;
      }
      // When pasteRichText is true, preserve line breaks for plain text that contains blank lines
      // or multiple consecutive line breaks to avoid losing formatting
      return !htmlData && textData && this.hasBlankLines(textData);
    },

    processPasteData (view, textData, htmlData) {
      if (this.shouldPreserveLineBreaks(textData, htmlData)) {
        this.insertPlainTextWithHardBreaks(view, textData);
        return true;
      }

      if (this.shouldHandlePreformattedHTML(htmlData)) {
        const extractedText = this.extractPreformattedText(htmlData);
        if (extractedText && extractedText.includes('\n')) {
          this.insertPlainTextWithHardBreaks(view, extractedText);
          return true;
        }
      }

      return false;
    },

    shouldHandlePreformattedHTML (htmlData) {
      return this.pasteRichText && htmlData && this.containsPreformattedContent(htmlData);
    },

    containsPreformattedContent (htmlData) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlData;
      const elements = tempDiv.querySelectorAll('*');

      for (const element of elements) {
        if (this.hasPreWhitespace(element) && this.hasLineBreaks(element)) {
          return true;
        }
      }
      return false;
    },

    hasPreWhitespace (element) {
      const styleAttr = element.getAttribute('style') || '';
      const elementStyle = element.style.whiteSpace || '';

      const hasPreElementStyle = elementStyle === 'pre' || elementStyle === 'pre-wrap';
      const hasPreInlineStyle = styleAttr.includes('white-space: pre');

      return hasPreElementStyle || hasPreInlineStyle;
    },

    hasLineBreaks (element) {
      return element.textContent && element.textContent.includes('\n');
    },

    hasBlankLines (textData) {
      // Check for blank lines (empty lines between content) or multiple consecutive line breaks
      return textData.includes('\n\n') || /\n\s*\n/.test(textData);
    },

    extractPreformattedText (htmlData) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlData;
      return this.walkAndExtractText(tempDiv);
    },

    walkAndExtractText (node) {
      let result = '';

      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (this.hasPreWhitespace(node)) {
          result += node.textContent;
        } else {
          for (const child of node.childNodes) {
            result += this.walkAndExtractText(child);
          }
        }
      }

      return result;
    },

    triggerInputChangeEvents () {
      const value = this.getOutput();
      this.$emit('input', value);
      this.$emit('update:modelValue', value);

      // Always output JSON in a separate event
      const jsonValue = this.editor.getJSON();
      this.$emit('json-input', jsonValue);

      // Always output HTML in a separate event
      const htmlValue = this.editor.getHTML();
      this.$emit('html-input', htmlValue);

      // Always output HTML in a separate event
      const textValue = this.editor.getText({ blockSeparator: '\n' });
      this.$emit('text-input', textValue);
    },

    /**
     * The Editor exposes event hooks that we have to map our emits into. See
     * https://tiptap.dev/api/events for all events.
     */
    addEditorListeners () {
      this.editor.on('create', () => {
        this.triggerInputChangeEvents();
      });
      // The content has changed.
      this.editor.on('update', () => {
        this.triggerInputChangeEvents();
      });

      this.editor.on('selectionUpdate', ({ editor }) => {
        this.$emit('selected', this.getSelectedLinkText(editor));
      });

      // The editor is focused.
      this.editor.on('focus', ({ event }) => {
        this.$emit('focus', event);
      });

      // The editor isn’t focused anymore.
      this.editor.on('blur', ({ event }) => {
        this.$emit('blur', event);
      });
    },

    getOutput () {
      switch (this.outputFormat) {
        case 'json':
          return this.editor.getJSON();
        case 'html':
          return this.editor.getHTML();
        case 'text':
        default:
          return this.editor.getText({ blockSeparator: '\n' });
      }
    },

    getExtension (extension, options) {
      if (typeof options === 'boolean') {
        return extension;
      }
      return extension.configure?.(options);
    },

    updateEditorAttributes (attributes) {
      this.editor.setOptions({
        editorProps: {
          attributes: {
            ...this.inputAttrs,
            class: this.inputClass,
            ...attributes,
          },
        },
      });
    },

    focusEditor () {
      this.editor.commands.focus();
    },
  },
};
</script>
