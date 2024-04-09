<template>
  <editor-content
    :editor="editor"
    data-qa="dt-rich-text-editor"
    class="dt-rich-text-editor"
  />
</template>

<script>
/* eslint-disable max-lines */
import { Editor, EditorContent } from '@tiptap/vue-3';
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
import Emoji from './extensions/emoji';
import Link from './extensions/link';
import { MentionPlugin } from './extensions/mentions/mention';
import {
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
  RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
} from './rich_text_editor_constants';

import suggestion from './extensions/mentions/suggestion';

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
     * Whether the input allows for line breaks to be introduced in the text.
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
      default: 'text',
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
     * Enables the Link extension and optionally passes configurations to it
     */
    link: {
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
     * Editor input event
     * @event input
     * @type {String|JSON}
     */
    'input',

    /**
     * Event to sync the value with the parent
     * @event input
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
  ],

  data () {
    return {
      editor: null,
      popoverOpened: false,
    };
  },

  computed: {
    // eslint-disable-next-line complexity
    extensions () {
      // These are the default extensions needed just for plain text.
      const extensions = [Document, Paragraph, Text];
      if (this.link) {
        extensions.push(this.getExtension(Link, this.link));
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
        extensions.push(OrderedList.configure({
          itemTypeName: 'listItem',
        }));
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
      extensions.push(
        Placeholder.configure({ placeholder: this.placeholder }),
      );

      // make sure that this is defined before any other extensions
      // where Enter and Shift+Enter should have its own interaction. otherwise it will be ignored
      if (!this.allowLineBreaks) {
        extensions.push(
          HardBreak.extend({
            addKeyboardShortcuts () {
              return {
                Enter: () => true,
                'Shift-Enter': () => this.editor.commands.first(({ commands }) => [
                  () => commands.newlineInCode(),
                  () => commands.createParagraphNear(),
                  () => commands.liftEmptyBlock(),
                  () => commands.splitBlock(),
                ]),
              };
            },
          }),
        );
      }

      extensions.push(TipTapLink.extend({ inclusive: false }).configure({
        autolink: true,
        protocols: RICH_TEXT_EDITOR_SUPPORTED_LINK_PROTOCOLS,
      }));

      if (this.mentionSuggestion) {
        // Add both the suggestion plugin as well as means for user to add suggestion items to the plugin
        const suggestionObject = { ...this.mentionSuggestion, ...suggestion };
        extensions.push(MentionPlugin.configure({ suggestion: suggestionObject }));
      }

      // Emoji has some interactions with Enter key
      // hence this should be done last otherwise the enter wont add a emoji.
      extensions.push(Emoji);

      extensions.push(TextAlign.configure({
        types: ['paragraph'],
        defaultAlignment: 'left',
      }));

      extensions.push(CodeBlock.configure({
        HTMLAttributes: {
          class: 'dt-rich-text-editor--code-block',
        },
      }));

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
      let currentValue = this.getOutput();
      if (this.outputFormat === 'json') {
        newValue = JSON.stringify(newValue);
        currentValue = JSON.stringify(currentValue);
      }
      if (newValue === currentValue) {
        // The new value came from this component and was passed back down
        // through the parent, so don't do anything here.
        return;
      }
      // Otherwise replace the content (resets the cursor position).
      this.editor.commands.setContent(newValue, false);
    },
  },

  created () {
    this.createEditor();
  },

  beforeUnmount () {
    this.destroyEditor();
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
        },
      });
      this.addEditorListeners();
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
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: var(--dt-color-foreground-placeholder);
    pointer-events: none;
    height: 0;
  }

  .ProseMirror ul > li {
    list-style-type: disc;
  }

  .ProseMirror ol > li {
    list-style-type: decimal;
  }

  .ProseMirror blockquote {
    padding-left: var(--dt-space-400);
    border-left: var(--dt-size-border-300) solid var(--dt-color-foreground-muted-inverted);
    margin-left: 0;
  }

  .dt-rich-text-editor--code-block {
    background: var(--dt-color-surface-secondary);
    padding: var(--dt-space-400);
  }

  .dt-rich-text-editor {
    overflow: hidden;
  }
</style>
