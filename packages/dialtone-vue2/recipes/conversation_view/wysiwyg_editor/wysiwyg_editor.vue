<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div
    data-qa="dt-wysiwyg-editor"
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
    <div
      class="d-d-flex d-fd-row d-px8 d-py2 d-bgc-black-200"
      :class="{ 'd-btr8': roundedEdges, 'd-btr0': !roundedEdges }"
    >
      <dt-button
        v-if="showBoldButton"
        data-qa="dt-wysiwyg-editor-bold-btn"
        class="h:d-bgc-black-300 d-fc-black-700 d-mx4"
        :class="{ 'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor?.isActive('bold') }"
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
        data-qa="dt-wysiwyg-editor-italics-btn"
        class="h:d-bgc-black-300 d-fc-black-700 d-mx4"
        :class="{ 'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor?.isActive('italic') }"
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
        data-qa="dt-wysiwyg-editor-underline-btn"
        class="h:d-bgc-black-300 d-fc-black-700 d-mx4"
        :class="{ 'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor?.isActive('underline') }"
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
        data-qa="dt-wysiwyg-editor-strike-btn"
        class="h:d-bgc-black-300 d-fc-black-700 d-mx4"
        :class="{ 'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor?.isActive('strike') }"
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
        data-qa="dt-wysiwyg-editor-list-items-btn"
        class="h:d-bgc-black-300 d-fc-black-700 d-mx4"
        :class="{ 'd-bgc-black-300 d-fc-black-900': $refs.richTextEditor?.editor.isActive('bulletList') }"
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
<<<<<<< HEAD
        v-if="showAddLink.showAddLinkButton"
=======
        v-if="showAddLinkButton"
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
        data-qa="dt-wysiwyg-editor-add-link-btn"
        class="h:d-bgc-black-300 d-fc-black-700 d-mx4"
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
    </div>
<<<<<<< HEAD

    <!-- Add/Remove link modal -->
    <dt-modal
      :show="showLinkInput"
      :title="showAddLink.setLinkModalTitle"
=======
    <dt-modal
      :show="showLinkInput"
      :title="addLinkTitle"
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
      :visually-hidden-close="true"
      :visually-hidden-close-label="'Close link input modal'"
      data-qa="dt-wysiwyg-editor-link-input-modal"
      show-footer
      kind="default"
      size="default"
      :close-button-props="{ ariaLabel: 'Close the dialog' }"
      @update:show="(s) => updateInputModal(s)"
    >
      <div class="d-m4">
        <dt-rich-text-editor
          v-model="linkInput"
<<<<<<< HEAD
          :input-aria-label="showAddLink.setLinkInputAriaLabel"
=======
          input-aria-label="Add link input field"
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
          data-qa="dt-wysiwyg-editor-link-input"
          :link="true"
          :output-format="textOutputFormat"
          :placeholder="setLinkPlaceholder"
          input-class="d-bgc-black-100 d-bar4 d-ba d-baw1 d-bc-black-300 d-pl6 d-py4 d-ol-none"
          @click="onInputFocus($event)"
          @click.native.stop="onInputFocus($event)"
          @focus="onInputFocus($event)"
          @enter.native="setLink"
        />
      </div>
      <template #footer>
        <dt-button
<<<<<<< HEAD
          :aria-label="confirmSetLinkButton.ariaLabel"
          data-qa="dt-wysiwyg-editor-set-link-confirm-btn"
          @click="setLink"
        >
          {{ confirmSetLinkButton.label }}
        </dt-button>
        <dt-button
          :aria-label="cancelSetLinkButton.ariaLabel"
=======
          data-qa="dt-wysiwyg-editor-set-link-confirm-btn"
          @click="setLink"
        >
          {{ confirmSetLinkButtonLabel }}
        </dt-button>
        <dt-button
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
          importance="clear"
          kind="muted"
          data-qa="dt-wysiwyg-editor-set-link-cancel-btn"
          @click="closeLinkInputModal"
        >
<<<<<<< HEAD
          {{ cancelSetLinkButton.label }}
        </dt-button>
        <dt-button
          :aria-label="removeLinkButton.ariaLabel"
=======
          {{ cancelSetLinkButtonLabel }}
        </dt-button>
        <dt-button
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
          importance="clear"
          kind="muted"
          data-qa="dt-wysiwyg-editor-remove-link-btn"
          @click="removeLink"
        >
<<<<<<< HEAD
          {{ removeLinkButton.label }}
=======
          {{ removeLinkButtonLabel }}
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
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
        :link="linkOptions"
        :placeholder="placeholder"
        :allow-line-breaks="true"
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
  WYSIWYG_EDITOR_SUPPORTED_LINK_PROTOCOLS,
  WYSIWYG_EDITOR_DEFAULT_LINK_PREFIX,
} from './wysiwyg_editor_constants.js';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
import { DtModal } from '@/components/modal';

export default {
  name: 'DtRecipeWysiwygEditor',

  components: {
    DtRichTextEditor,
    DtButton,
    DtIcon,
    DtModal,
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
<<<<<<< HEAD
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
=======
     * The title shown in the link input modal.
     */
    setLinkModalTitle: {
      type: String,
      default: 'Add a link',
    },

    /**
     * The text shown in confirmation button to set a link.
     */
    confirmSetLinkButtonLabel: {
      type: String,
      default: 'Confirm',
    },

    /**
     * The text shown in remove link button.
     */
    removeLinkButtonLabel: {
      type: String,
      default: 'Remove',
    },

    /**
     * The text shown in cancel button to set a link.
     */
    cancelSetLinkButtonLabel: {
      type: String,
      default: 'Cancel',
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
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
<<<<<<< HEAD
     * Show add link default config.
     */
    showAddLink: {
      type: Object,
      default: () => ({
        showAddLinkButton: true,
        setLinkModalTitle: 'Add a link',
        setLinkInputAriaLabel: 'Input field to add link',
      }),
=======
     * Show buttons to add and remove links
     */
    showAddLinkButton: {
      type: Boolean,
      default: true,
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
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
        openOnClick: false,
        class: 'd-link d-c-text d-d-inline-block',
      },

      showLinkInput: false,
      linkInput: '',
    };
  },

  computed: {
<<<<<<< HEAD
=======
    addLinkTitle () {
      return this.setLinkModalTitle;
    },

>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
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

    htmlOutputFormat () {
      return RICH_TEXT_EDITOR_OUTPUT_FORMATS[2];
    },

    textOutputFormat () {
      return RICH_TEXT_EDITOR_OUTPUT_FORMATS[0];
    },
  },

  watch: {
    value (newValue) {
      this.internalInputValue = newValue;
    },
  },

  methods: {
    onInputFocus (event) {
      event?.stopPropagation();
    },

    removeLink () {
      this.$refs.richTextEditor?.editor?.chain().focus().unsetLink().run();
      this.closeLinkInputModal();
    },

    setLink () {
      // Check if input matches any of the supported link formats
      const prefix = WYSIWYG_EDITOR_SUPPORTED_LINK_PROTOCOLS.find(prefixRegex => prefixRegex.test(this.linkInput));

      if (!prefix) {
        // If no matching pattern is found, prepend default prefix
        this.linkInput = `${WYSIWYG_EDITOR_DEFAULT_LINK_PREFIX}${this.linkInput}`;
      }

      if (this.linkInput) {
        // update link
        this.$refs.richTextEditor?.editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: this.linkInput })
          .run();
      }
      this.closeLinkInputModal();
    },

    openLinkInputModal () {
      this.showLinkInput = true;
    },

    updateInputModal (openModal) {
      if (!openModal) {
        return this.closeLinkInputModal();
      }
      this.linkInput = this.$refs.richTextEditor?.editor?.getAttributes('link')?.href;
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
.dt-wysiwyg-editor--remaining-char-tooltip {
  margin-top: auto;
  margin-bottom: auto;
}
.dt-wysiwyg-editor--remaining-char {
  font-size: 1.2rem;
}
</style>
