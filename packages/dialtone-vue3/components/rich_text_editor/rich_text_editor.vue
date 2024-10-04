<template>
  <editor-content
    :editor="editor"
    data-qa="dt-rich-text-editor"
    class="dt-rich-text-editor"
    v-bind="attrs"
  />
</template>

<script>
/* eslint-disable max-lines */
import { Editor, EditorContent } from '@tiptap/vue-3';
import { Slice, Fragment } from '@tiptap/pm/model';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
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
import Emoji from './extensions/emoji';
import CustomLink from './extensions/custom_link';
import { MentionPlugin } from './extensions/mentions/mention';
import { ChannelPlugin } from './extensions/channels/channel';
import { SlashCommandPlugin } from './extensions/slash_command/slash_command';
import {
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
  RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
} from './rich_text_editor_constants';

import mentionSuggestion from './extensions/mentions/suggestion';
import channelSuggestion from './extensions/channels/suggestion';
import slashCommandSuggestion from './extensions/slash_command/suggestion';
import { warnIfUnmounted } from '@/common/utils';

export default {
  name: 'DtRichTextEditor',

  components: {
    EditorContent,
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
     * Whether the input allows codeblock to be introduced in the text.
     */
    allowCodeblock: {
      type: Boolean,
      default: true,
    },

    /**
     * Additional TipTap extensions to be added to the editor.
     */
    additionalExtensions: {
      type: Array,
      default: () => [],
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
  ],

  data () {
    return {
      editor: null,
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
      const extensions = [Document, Paragraph, Text, History];
      if (this.link) {
        extensions.push(TipTapLink.extend({ inclusive: false }).configure({
          HTMLAttributes: {
            class: 'd-link d-wb-break-all',
          },
          autolink: true,
          protocols: RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
        }));
      }
      if (this.customLink) {
        extensions.push(this.getExtension(CustomLink, this.customLink));
      }
      if (this.allowBlockquote) {
        extensions.push(Blockquote);
      }
      if (this.allowBold) {
        extensions.push(Bold);
      }
      if (this.allowBulletList) {
        extensions.push(BulletList);
        extensions.push(ListItem);
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

      // make sure that this is defined before any other extensions
      // where Enter and Shift+Enter should have its own interaction. otherwise it will be ignored
      if (!this.allowLineBreaks) {
        const self = this;
        extensions.push(
          HardBreak.extend({
            addKeyboardShortcuts () {
              return {
                Enter: () => {
                  self.$emit('enter');
                  return true;
                },
                'Shift-Enter': () => {
                  this.editor.commands.setHardBreak();
                  return true;
                },
              };
            },
          }),
        );
      } else {
        extensions.push(HardBreak);
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
        extensions.push(SlashCommandPlugin.configure({ suggestion: suggestionObject }));
      }

      // Emoji has some interactions with Enter key
      // hence this should be done last otherwise the enter wont add a emoji.
      extensions.push(Emoji);

      extensions.push(TextAlign.configure({
        types: ['paragraph'],
        defaultAlignment: 'left',
      }));

      if (this.allowCodeblock) {
        extensions.push(CodeBlock.configure({
          HTMLAttributes: {
            class: 'dt-rich-text-editor--code-block',
          },
        }));
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
    warnIfUnmounted(this.$el, this.$options.name);
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
        editorProps: {
          attributes: {
            ...this.inputAttrs,
            class: this.inputClass,
          },

          /* Absolutely crazy that this is what's needed to paste line breaks properly in prosemirror, but it does seem
            to fix our issue of line breaks outputting as paragraphs. Code taken from this thread:
            https://discuss.prosemirror.net/t/how-to-preserve-hard-breaks-when-pasting-html-into-a-plain-text-schema/4202/4
          */
          handlePaste: function (view, event, slice) {
            const { state } = view;
            const { tr } = state;

            if (!state.schema.nodes.hardBreak) {
              return false;
            }

            const clipboardText = event.clipboardData?.getData('text/plain').trim();

            if (!clipboardText) {
              return false;
            }

            const textLines = clipboardText.split(/(?:\r\n|\r|\n)/g);

            const nodes = textLines.reduce((nodes, line, index) => {
              if (line.length > 0) {
                nodes.push(state.schema.text(line));
              }

              if (index < textLines.length - 1) {
                nodes.push(state.schema.nodes.hardBreak.create());
              }

              return nodes;
            }, []);

            view.dispatch(
              tr.replaceSelection(Slice.maxOpen(Fragment.fromArray(nodes))).scrollIntoView(),
            );

            return true;
          },
        },
      });
      this.addEditorListeners();
    },

    processValue (newValue, returnIfEqual = true) {
      let currentValue = this.getOutput();
      if (this.outputFormat === 'json') {
        newValue = JSON.stringify(newValue);
        currentValue = JSON.stringify(currentValue);
      }
      if (returnIfEqual && newValue === currentValue) {
        // The new value came from this component and was passed back down
        // through the parent, so don't do anything here.
        return;
      }

      // If the text contains emoji characters convert them to emoji component tags
      newValue = newValue.replace(/(\p{Emoji}\p{Emoji_Modifier}?)/gu, '<emoji-component code="$1"></emoji-component>');

      // Otherwise replace the content (resets the cursor position).
      this.editor.commands.setContent(newValue, false);
    },

    destroyEditor () {
      this.editor.destroy();
    },

    /**
     * The Editor exposes event hooks that we have to map our emits into. See
     * https://tiptap.dev/api/events for all events.
     */
    addEditorListeners () {
      // The content has changed.
      this.editor.on('update', () => {
        const value = this.getOutput();
        // When preventTyping is true and user wants to type, we revert to last value
        // If Backspace (keyCode = 8) is pressed, we allow updating the text
        if (this.preventTyping && this.editor.view?.input?.lastKeyCode !== 8) {
          this.editor.commands.setContent(this.value, false);
          return;
        }
        this.$emit('input', value);
        this.$emit('update:modelValue', value);
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
          return this.editor.getText();
      }
    },

    getExtension (extension, options) {
      if (typeof options === 'boolean') {
        return extension;
      }
      return extension.configure?.(options);
    },

    updateEditorAttributes (attributes) {
      this.editor.setOptions({ editorProps: { attributes } });
    },

    focusEditor () {
      this.editor.commands.focus();
    },
  },
};
</script>

<style lang="less">
  .dt-rich-text-editor {
    &--code-block {
      background: var(--dt-color-surface-secondary);
      padding: var(--dt-space-400);
    }

    > .ProseMirror {
      box-shadow: none;

      p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: var(--dt-color-foreground-placeholder);
        pointer-events: none;
        height: 0;
      }

      ul, ol {
        padding-left: var(--dt-space-525);
      }

      ul > li {
        list-style-type: disc;
      }

      ol > li {
        list-style-type: decimal;
      }

      blockquote {
        padding-left: var(--dt-space-400);
        border-left: var(--dt-size-border-300) solid var(--dt-color-foreground-muted-inverted);
        margin-left: 0;
      }
    }
  }
</style>
