<!-- eslint-disable vue/no-static-inline-styles -->
<!-- eslint-disable vue/no-bare-strings-in-template -->
<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div>
    <!-- why the hell is this visibility: hidden by default??? -->
    <bubble-menu
      v-if="editor && link"
      :editor="editor"
      :should-show="bubbleMenuShouldShow"
      :options="floatingOptions"
      :append-to="appendTo"
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
import { Editor, EditorContent } from '@tiptap/vue-3';
import { BubbleMenu } from '@tiptap/vue-3/menus';
import { Extension } from '@tiptap/core';
import { DtButton } from '../button';
import { DtStack } from '../stack';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import { Placeholder, UndoRedo, Gapcursor } from '@tiptap/extensions';
import HardBreak from '@tiptap/extension-hard-break';
import Paragraph from '@tiptap/extension-paragraph';
import Bold from '@tiptap/extension-bold';
import { BulletList, OrderedList, ListItem } from '@tiptap/extension-list';
import Italic from '@tiptap/extension-italic';
import TipTapLink from '@tiptap/extension-link';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { CustomTable, CustomTableRow, CustomTableCell, CustomTableHeader } from './extensions/table/table';
import { CustomTextStyle } from './extensions/text_style/text_style';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Emoji from './extensions/emoji';
import CustomLink from './extensions/custom_link';
import ConfigurableImage from './extensions/image';
import DivParagraph from './extensions/div';
import { MentionPlugin } from './extensions/mentions/mention';
import { ChannelPlugin } from './extensions/channels/channel';
import { SlashCommandPlugin } from './extensions/slash_command/slash_command';
import Variable from './extensions/variable';
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
import { renderEditorToMarkdown } from './markdownRenderer';
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
     * One of `text`, `json`, `html`, `markdown`. See https://tiptap.dev/guide/output for
     * examples.
     * @values text, json, html, markdown
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
     * { name: string, id: string, locked: boolean, channelKey?: string }
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
     * Whether the input allows background color to be introduced in the text.
     */
    allowBackgroundColor: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the input allows font size to be introduced in the text.
     */
    allowFontSize: {
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
     * Whether the input allows line height to be introduced in the text.
     */
    allowLineHeight: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the input allows variables to be introduced in the text.
     */
    allowVariable: {
      type: Boolean,
      default: false,
    },

    /**
     * Array of available variable items that can be inserted.
     */
    variableItems: {
      type: Array,
      default: () => [],
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
     * Controls how whitespace is handled when parsing HTML content.
     * - 'full': All whitespace is preserved
     * - true: Whitespace in inline content is preserved, whitespace-only nodes between blocks are removed
     * - false: Standard HTML whitespace collapsing
     * @values full, true, false
     */
    preserveWhitespace: {
      type: [Boolean, String],
      default: 'full',
    },

    /**
     * Show text in HTML div tags instead of paragraph tags
     */
    useDivTags: {
      type: Boolean,
      default: false,
    },

    /**
     * Allow Tables to be used in to the editor
     */
    allowTables: {
      type: Boolean,
      default: false,
    },

    /**
     * Allow text alignment controls (left, center, right, justify) in the editor.
     */
    allowTextAlign: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether the input allows image resize to be introduced in the text.
     */
    allowImageResize: {
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
     * Input event always in markdown format.
     * @event input
     * @type {String}
     */
    'markdown-input',

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

    /**
     * Event fired when a mention is clicked
     * @event mention-click
     * @type {Object}
     */
    'mention-click',

    /**
     * Event fired when the cursor enters a mention. The payload includes the
     * mention data (name, id, avatarSrc, contactKey) plus the native MouseEvent
     * as `event`, which can be used for positioning a hovercard.
     * @event mention-hover
     * @type {Object}
     */
    'mention-hover',

    /**
     * Event fired when the cursor leaves a mention. The payload includes the
     * mention data (name, id, avatarSrc, contactKey) plus the native MouseEvent
     * as `event`.
     * @event mention-leave
     * @type {Object}
     */
    'mention-leave',

    /**
     * Event fired when a channel is clicked
     * @event channel-click
     * @type {Object}
     */
    'channel-click',
  ],

  data () {
    return {
      editor: null,
      appendTo: () => returnFirstEl(this.$refs.editor.$el).getRootNode()?.querySelector('body'),
      floatingOptions: {
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
      const extensions = [Document, Text, UndoRedo, HardBreak];
      extensions.push(this.useDivTags ? DivParagraph : Paragraph);

      // bold must come before blockquote due to keyboard shortcuts
      if (this.allowBold) {
        extensions.push(Bold);
      }
      if (this.allowBlockquote) {
        extensions.push(Blockquote);
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
        extensions.push(TipTapLink.extend({
          inclusive: false,
          addKeyboardShortcuts () {
            return {
              'Mod-k': () => {
                self.$emit('edit-link');
                return true;
              },
            };
          },
        }).configure({
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

      if (this.allowVariable) {
        extensions.push(Variable.configure({
          variableItems: this.variableItems,
        }));
      }

      // Emoji has some interactions with Enter key
      // hence this should be done last otherwise the enter wont add a emoji.
      extensions.push(Emoji);

      if (this.allowTextAlign) {
        extensions.push(TextAlign.configure({
          types: ['paragraph'],
        }));
      }

      if (this.allowCode) {
        extensions.push(Code);
      }

      if (this.allowCodeblock) {
        extensions.push(CodeBlock.extend({
          renderText ({ node, pos, range }) {
            // Tiptap 3.x passes range = { from, to } (the overall selection range).
            // Full node in range: wrap in fences (getText(), full doc selection).
            // Partial selection: return only the overlapping text.
            const from = range?.from ?? 0;
            const to = range?.to ?? (pos + node.nodeSize);
            if (from <= pos && to >= pos + node.nodeSize) {
              return `\`\`\`\n${node.textContent}\n\`\`\``;
            }
            const textStart = Math.max(0, from - pos - 1);
            const textEnd = Math.min(node.textContent.length, to - pos - 1);
            return node.textContent.slice(textStart, textEnd);
          },
          addCommands () {
            return {
              ...this.parent?.(),
              toggleCodeBlock: (attributes = {}) => ({ state, chain, commands }) => {
                const codeBlockType = state.schema.nodes[this.name];
                const { $from } = state.selection;

                if ($from.parent.type === codeBlockType) {
                  const paragraphType = state.schema.nodes.paragraph;
                  const lines = $from.parent.textContent.split('\n');
                  const codeBlockPos = $from.before();
                  const codeBlockNode = $from.parent;
                  return chain()
                    .command(({ tr }) => {
                      const paragraphs = lines.map(line =>
                        paragraphType.create({}, line ? [state.schema.text(line)] : []),
                      );
                      tr.replaceWith(codeBlockPos, codeBlockPos + codeBlockNode.nodeSize, paragraphs);
                      return true;
                    })
                    .run();
                }

                const { from, to } = state.selection;
                const blocks = [];
                state.doc.nodesBetween(from, to, (node, pos) => {
                  if (node.isTextblock) {
                    blocks.push({ node, pos });
                    return false;
                  }
                });

                if (blocks.length <= 1) {
                  return commands.setNode(this.name, attributes);
                }

                // Multiple paragraphs selected: merge into a single code block
                const combinedText = blocks.map(({ node }) => node.textContent).join('\n');
                const firstPos = blocks[0].pos;
                const lastBlock = blocks[blocks.length - 1];
                const lastPos = lastBlock.pos + lastBlock.node.nodeSize;

                return chain()
                  .command(({ tr }) => {
                    const content = combinedText.length ? [state.schema.text(combinedText)] : [];
                    tr.replaceWith(firstPos, lastPos, codeBlockType.create(attributes, content));
                    return true;
                  })
                  .run();
              },
            };
          },
        }).configure({
          HTMLAttributes: {
            class: 'd-rich-text-editor__code-block',
          },
        }));
      }

      if (this.allowInlineImages) {
        extensions.push(ConfigurableImage.configure({
          resize: {
            enabled: this.allowImageResize,
            alwaysPreserveAspectRatio: true,
          },
        }));
      }

      if (this.allowFontFamily ||
        this.allowFontColor ||
        this.allowFontSize ||
        this.allowBackgroundColor ||
        this.allowLineHeight) {
        extensions.push(TextStyleKit.configure({
          color: this.allowFontColor,
          backgroundColor: this.allowBackgroundColor,
          fontFamily: this.allowFontFamily,
          fontSize: this.allowFontSize,
          lineHeight: this.allowLineHeight,
        }));
        extensions.push(CustomTextStyle);
      }

      if (this.additionalExtensions.length) {
        extensions.push(...this.additionalExtensions);
      }

      if (this.allowTables) {
        extensions.push(CustomTable.configure({ resizable: true }),
          CustomTableRow, CustomTableHeader, CustomTableCell, Gapcursor);
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
        shouldRerenderOnTransaction: false,
        parseOptions: {
          preserveWhitespace: this.preserveWhitespace,
        },

        editorProps: {
          attributes: {
            ...this.inputAttrs,
            class: this.inputClass,
          },

          handleKeyDown: (view, event) => {
            if (!this.preventTyping) return false;

            const allowedKeys = ['Backspace'];
            if (!this.allowLineBreaks && !event.shiftKey) {
              allowedKeys.push('Enter');
            }

            return !allowedKeys.includes(event.key);
          },

          handlePaste: (view, event) => {
            const clipboardData = event.clipboardData || window.clipboardData;
            const textData = clipboardData.getData('text/plain');
            const htmlData = clipboardData.getData('text/html');

            return this.processPasteData(view, textData, htmlData);
          },

          // Moves the <br /> tags inside the previous closing tag to avoid
          // Prosemirror wrapping them within another </p> tag.
          // Converts <hr> to an empty paragraph so it pastes as a line separator.
          transformPastedHTML (html) {
            return html
              .replace(/<hr[^>]*\/?>/gi, '<p><br></p>')
              .replace(/(<\/\w+>)((<br \/>)+)/g, '$2$1')
              // Strip trailing <br> just before the final </p> so pasted content
              // doesn't produce an extra blank line at the end of the message.
              // Anchored to end-of-string to avoid removing intentional hard breaks
              // inside non-final paragraphs.
              .replace(/(<br[^>]*>)\s*<\/p>(\s*)$/i, '</p>$2');
          },
        },
      });
      this.addEditorListeners();
    },

    bubbleMenuShouldShow ({ editor }) {
      return !this.hideLinkBubbleMenu && editor.isActive('link');
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
      const displayText = linkText || linkInput;

      this.editor
        .chain()
        .focus()
        .insertContent(displayText)
        .setTextSelection({ from: selection.from, to: selection.from + displayText.length })
        .setLink({ href: linkInput, class: linkOptions.class })
        .run();
    },


    processValue (newValue, returnIfEqual = true) {
      if (!this.editor) return;
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
      this.editor.commands.setContent(newValue, {
        emitUpdate: false,
        parseOptions: { preserveWhitespace: this.preserveWhitespace },
      });
    },

    destroyEditor () {
      this.editor.destroy();
    },

    insertPlainTextWithHardBreaks (view, textData) {
      // If we convert both newlines into hardBreak, we create a blank line.
      // Collapsing avoids the extra hardBreak while preserving single line breaks.
      const normalizedData = this.pasteRichText
        ? textData
        : textData.replace(/\r\n/g, '\n').replace(/\n\n/g, '\n');

      // Remove trailing newlines to avoid inserting empty lines at the end
      const trimmedData = normalizedData.replace(/[\r\n]+$/, '');

      const lines = trimmedData.split(/\r?\n/);

      const content = [];
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) content.push({ type: 'hardBreak' });
        if (lines[i]) content.push({ type: 'text', text: lines[i] });
      }

      this.editor.chain().focus().insertContent(content).run();
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

      // Always output text in a separate event
      const textValue = this.editor.getText({ blockSeparator: '\n' });
      this.$emit('text-input', textValue);

      // Always output markdown in a separate event
      const markdownValue = renderEditorToMarkdown(jsonValue, this.extensions);
      this.$emit('markdown-input', markdownValue);
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

      // The editor isn't focused anymore.
      this.editor.on('blur', ({ event }) => {
        this.$emit('blur', event);
      });

      // Mention is clicked
      this.editor.on('mention-click', (mentionData) => {
        this.$emit('mention-click', mentionData);
      });

      // Cursor enters a mention
      this.editor.on('mention-hover', (mentionData) => {
        this.$emit('mention-hover', mentionData);
      });

      // Cursor leaves a mention
      this.editor.on('mention-leave', (mentionData) => {
        this.$emit('mention-leave', mentionData);
      });

      // Channel is clicked
      this.editor.on('channel-click', (channelData) => {
        this.$emit('channel-click', channelData);
      });

      // Fix cursor jump when toggleCodeBlock converts a multi-line code block back to
      // paragraphs. ProseMirror's default right-biased step mapping moves the cursor to
      // the start of the next paragraph; left-bias (assoc=-1) keeps it on the current line.
      let prevAnchor = this.editor.state.selection.anchor;
      let prevInCodeBlock = this.editor.isActive('codeBlock');
      this.editor.on('selectionUpdate', ({ editor: selEd }) => {
        prevAnchor = selEd.state.selection.anchor;
        prevInCodeBlock = selEd.isActive('codeBlock');
      });
      this.editor.on('transaction', ({ editor: txEd, transaction }) => {
        if (!transaction.docChanged || !prevInCodeBlock || txEd.isActive('codeBlock')) return;
        const corrected = transaction.mapping.map(prevAnchor, -1);
        if (corrected === txEd.state.selection.anchor) return;
        setTimeout(() => {
          if (!this.editor.isDestroyed) this.editor.commands.setTextSelection(corrected);
        }, 0);
      });
    },

    getOutput () {
      switch (this.outputFormat) {
        case 'json':
          return this.editor.getJSON();
        case 'html':
          return this.editor.getHTML();
        case 'markdown':
          return renderEditorToMarkdown(this.editor.getJSON(), this.extensions);
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
