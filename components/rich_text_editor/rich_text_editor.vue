<template>
  <editor-content
    :editor="editor"
    data-qa="dt-rich-text-editor"
  />
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Link from './extensions/link';
import {
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
} from './rich_text_editor_constants';

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
    'update:value',

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
    };
  },

  computed: {
    extensions () {
      // These are the default extensions needed just for plain text.
      const extensions = [Document, Paragraph, Text];
      if (this.link) {
        extensions.push(this.getExtension(Link, this.link));
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

    value (newValue) {
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
        content: this.value,
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
        this.$emit('update:value', value);
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
  },
};
</script>
