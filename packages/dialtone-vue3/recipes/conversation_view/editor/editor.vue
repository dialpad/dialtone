<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div
    data-qa="dt-editor"
    role="presentation"
    :class="['d-d-flex', 'd-fd-column', 'd-baw1', 'd-ba', {
      'd-bc-black-500': hasFocus,
      'd-bc-default': !hasFocus,
      'd-bar8': roundedEdges,
      'd-bar0': !roundedEdges,
    }]"
    @click="$refs.richTextEditor.focusEditor()"
  >
    <!-- Section for the top UI -->
    <dt-stack
      direction="row"
      gap="100"
      :class="['d-px8', 'd-py2', 'd-bgc-black-200', {
        'd-btr8': roundedEdges,
        'd-btr0': !roundedEdges,
      }]"
    >
      <dt-button
        v-if="showBoldButton"
        data-qa="dt-editor-bold-btn"
        :class="['h:d-bgc-black-300', 'd-fc-black-700', 'd-mx4', {
          'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor?.isActive('bold'),
        }]"
        importance="clear"
        kind="inverted"
        size="sm"
        @click="onBoldTextToggle"
      >
        <template #icon>
          <dt-icon
            name="bold"
            size="200"
            class="d-fw-bold"
          />
        </template>
      </dt-button>

      <dt-button
        v-if="showItalicsButton"
        data-qa="dt-editor-italics-btn"
        :class="['h:d-bgc-black-300', 'd-fc-black-700', 'd-mx4', {
          'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor?.isActive('italic'),
        }]"
        size="sm"
        importance="clear"
        kind="inverted"
        @click="onItalicTextToggle"
      >
        <template #icon>
          <dt-icon
            name="italic"
            size="200"
            class="d-fw-bold"
          />
        </template>
      </dt-button>

      <dt-button
        v-if="showUnderlineButton"
        data-qa="dt-editor-underline-btn"
        :class="['h:d-bgc-black-300', 'd-fc-black-700', 'd-mx4', {
          'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor?.isActive('underline'),
        }]"
        size="sm"
        importance="clear"
        kind="inverted"
        @click="onUnderlineTextToggle"
      >
        <template #icon>
          <dt-icon
            name="underline"
            size="200"
            class="d-fw-bold"
          />
        </template>
      </dt-button>

      <dt-button
        v-if="showStrikeButton"
        data-qa="dt-editor-strike-btn"
        :class="['h:d-bgc-black-300', 'd-fc-black-700', 'd-mx4', {
          'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor?.isActive('strike'),
        }]"
        size="sm"
        importance="clear"
        kind="inverted"
        @click="onStrikethroughTextToggle"
      >
        <template #icon>
          <dt-icon
            name="strikethrough"
            size="200"
            class="d-fw-bold"
          />
        </template>
      </dt-button>

      <dt-button
        v-if="showListItemsButton"
        data-qa="dt-editor-list-items-btn"
        :class="['h:d-bgc-black-300', 'd-fc-black-700', 'd-mx4', {
          'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor.isActive('bulletList'),
        }]"
        size="sm"
        importance="clear"
        kind="inverted"
        @click="onBulletListToggle"
      >
        <template #icon>
          <dt-icon
            name="list-bullet"
            size="200"
            class="d-fw-bold"
          />
        </template>
      </dt-button>

      <dt-button
        v-if="showAddLink.showAddLinkButton"
        data-qa="dt-editor-add-link-btn"
        :class="['h:d-bgc-black-300', 'd-fc-black-700', 'd-mx4', {
          'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor.isActive('link'),
        }]"
        size="sm"
        importance="clear"
        kind="inverted"
        @click="openLinkInputModal"
      >
        <template #icon>
          <dt-icon
            name="link-2"
            size="200"
            class="d-fw-bold"
          />
        </template>
      </dt-button>
    </dt-stack>

    <!-- Add/Remove link modal -->
    <dt-modal
      :show="showLinkInput"
      :title="showAddLink.setLinkModalTitle"
      :visually-hidden-close="true"
      :visually-hidden-close-label="'Close link input modal'"
      data-qa="dt-editor-link-input-modal"
      show-footer
      kind="default"
      size="default"
      :close-button-props="{ ariaLabel: 'Close the dialog' }"
      @click="onInputFocus"
      @click.stop="onInputFocus"
    >
      <div class="d-m4">
        <dt-input
          v-model="linkInput"
          :input-aria-label="showAddLink.setLinkInputAriaLabel"
          data-qa="dt-editor-link-input"
          :placeholder="setLinkPlaceholder"
          input-wrapper-class="d-bgc-black-100 d-bar5 d-ba d-baw1 d-bc-black-300 d-py2 d-ol-none"
          @click="onInputFocus"
          @click.stop="onInputFocus"
          @focus="onInputFocus"
          @keydown.enter="setLink"
        />
      </div>
      <template #footer>
        <dt-button
          :aria-label="confirmSetLinkButton.ariaLabel"
          data-qa="dt-editor-set-link-confirm-btn"
          @click="setLink"
        >
          {{ confirmSetLinkButton.label }}
        </dt-button>
        <dt-button
          :aria-label="cancelSetLinkButton.ariaLabel"
          importance="clear"
          kind="muted"
          data-qa="dt-editor-set-link-cancel-btn"
          @click="closeLinkInputModal"
        >
          {{ cancelSetLinkButton.label }}
        </dt-button>
        <dt-button
          :aria-label="removeLinkButton.ariaLabel"
          importance="clear"
          kind="muted"
          data-qa="dt-editor-remove-link-btn"
          @click="removeLink"
        >
          {{ removeLinkButton.label }}
        </dt-button>
      </template>
    </dt-modal>

    <!-- Some wrapper to restrict the height and show the scrollbar -->
    <div
      class="d-of-auto d-mx16 d-mt8 d-mb16 d-c-text"
      :style="{ 'max-height': maxHeight }"
    >
      <dt-rich-text-editor
        ref="richTextEditor"
        v-model="internalInputValue"
        data-qa="dt-rich-text-editor"
        :editable="editable"
        :input-aria-label="inputAriaLabel"
        :input-class="inputClass"
        :output-format="htmlOutputFormat"
        :auto-focus="autoFocus"
        :placeholder="placeholder"
        :allow-line-breaks="true"
        :link="false"
        v-bind="$attrs"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput($event)"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable max-lines */
import {
  DtRichTextEditor,
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
} from '@/components/rich_text_editor';
import {
  EDITOR_SUPPORTED_LINK_PROTOCOLS,
  EDITOR_DEFAULT_LINK_PREFIX,
} from './editor_constants.js';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
import { DtModal } from '@/components/modal';
import { DtStack } from '@/components/stack';
import { DtInput } from '@/components/input';

export default {
  name: 'DtRecipeEditor',

  components: {
    DtRichTextEditor,
    DtButton,
    DtIcon,
    DtModal,
    DtStack,
    DtInput,
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
     * Indicates if the borders should be rounded.
     */
    roundedEdges: {
      type: Boolean,
      default: true,
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
     * Placeholder text
     */
    placeholder: {
      type: String,
      default: '',
    },

    /**
     * Content area needs to dynamically adjust height based on the conversation area height.
     * can be vh|px|rem|em|%
     */
    maxHeight: {
      type: String,
      default: 'unset',
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
     * Show button to render text as bold
     */
    showBoldButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to render text in italics
     */
    showItalicsButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to underline text
     */
    showUnderlineButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to strike text
     */
    showStrikeButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to render list items
     */
    showListItemsButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show add link default config.
     */
    showAddLink: {
      type: Object,
      default: () => ({
        showAddLinkButton: true,
        setLinkModalTitle: 'Add a link',
        setLinkInputAriaLabel: 'Input field to add link',
      }),
    },
  },

  emits: [
    /**
     * Native focus event
     * @event input
     * @type {String|JSON}
     */
    'focus',

    /**
     * Native blur event
     * @event input
     * @type {String|JSON}
     */
    'blur',

    /**
     * Native input event
     * @event input
     * @type {String|JSON}
     */
    'input',
  ],

  data () {
    return {
      internalInputValue: this.value, // internal input content
      hasFocus: false,

      linkOptions: {
        class: 'd-link d-c-text d-d-inline-block',
      },

      showLinkInput: false,
      linkInput: '',
    };
  },

  computed: {
    inputLength () {
      return this.internalInputValue.length;
    },

    htmlOutputFormat () {
      return RICH_TEXT_EDITOR_OUTPUT_FORMATS[2];
    },
  },

  watch: {
    value (newValue) {
      this.internalInputValue = newValue;
    },

    showLinkInput (showingModal) {
      if (!showingModal) {
        return this.closeLinkInputModal();
      }
      // If there was a link previously associated to the selected text,
      // set it as a value in the input.
      this.linkInput = this.$refs.richTextEditor?.editor?.getAttributes('link')?.href;
    },
  },

  methods: {
    onInputFocus (event) {
      event?.stopPropagation();
    },

    removeLink () {
      this.$refs.richTextEditor?.editor?.chain()?.focus()?.unsetLink()?.run();
      this.closeLinkInputModal();
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

      this.closeLinkInputModal();
    },

    openLinkInputModal () {
      this.showLinkInput = true;
    },

    closeLinkInputModal () {
      this.showLinkInput = false;
      this.linkInput = '';
    },

    onBoldTextToggle () {
      this.$refs.richTextEditor?.editor?.chain().focus().toggleBold().run();
    },

    onItalicTextToggle () {
      this.$refs.richTextEditor?.editor.chain().focus().toggleItalic().run();
    },

    onUnderlineTextToggle () {
      this.$refs.richTextEditor?.editor.chain().focus().toggleUnderline().run();
    },

    onStrikethroughTextToggle () {
      this.$refs.richTextEditor?.editor.chain().focus().toggleStrike().run();
    },

    onBulletListToggle () {
      this.$refs.richTextEditor?.editor.chain().focus().toggleBulletList().run();
    },

    onFocus (event) {
      this.hasFocus = true;
      this.$emit('focus', event);
    },

    onBlur (event) {
      this.hasFocus = false;
      this.$emit('blur', event);
    },

    onInput (event) {
      this.$emit('input', event);
    },

  },
};
</script>

<style lang="less">
.dt-editor--remaining-char-tooltip {
  margin-top: auto;
  margin-bottom: auto;
}
.dt-editor--remaining-char {
  font-size: 1.2rem;
}
</style>
