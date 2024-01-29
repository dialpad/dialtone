<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div
    data-qa="dt-editor"
    role="presentation"
    class="d-d-flex d-fd-column"
    @click="$refs.richTextEditor.focusEditor()"
  >
    <!-- Section for the top UI -->
    <dt-stack
      direction="row"
      gap="0"
      class="d-py4 d-bgc-black-100 d-divide-x d-divide-black-200"
    >
      <dt-stack
        direction="row"
        gap="100"
        :class="{ 'd-px4 d-py4': this.showingTextFormatButtons }"
      >
        <dt-tooltip
          message="Bold"
          placement="top"
        >
          <template #anchor>
            <dt-button
              v-if="showBoldButton"
              data-qa="dt-editor-bold-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor?.isActive('bold')"
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
          </template>
        </dt-tooltip>

        <dt-tooltip
          message="Italics"
          placement="top"
        >
          <template #anchor>
            <dt-button
              v-if="showItalicsButton"
              data-qa="dt-editor-italics-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor?.isActive('italic')"
              size="sm"
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
          </template>
        </dt-tooltip>

        <dt-tooltip
          message="Underline"
          placement="top"
        >
          <template #anchor>
            <dt-button
              v-if="showUnderlineButton"
              data-qa="dt-editor-underline-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor?.isActive('underline')"
              size="sm"
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
          </template>
        </dt-tooltip>

        <dt-tooltip
          message="Strike"
          placement="top"
        >
          <template #anchor>
            <dt-button
              v-if="showStrikeButton"
              data-qa="dt-editor-strike-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor?.isActive('strike')"
              size="sm"
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
          </template>
        </dt-tooltip>
      </dt-stack>

      <dt-stack
        direction="row"
        gap="100"
        :class="{ 'd-px4 d-py4': this.showingAlignmentButtons }"
      >
        <dt-tooltip message="Align Left">
          <template #anchor>
            <dt-button
              v-if="showAlignLeftButton"
              data-qa="dt-editor-align-left-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor?.isActive({ textAlign: 'left' })"
              size="sm"
              @click="onTextAlign('left')"
            >
              <template #icon>
                <dt-icon
                  name="align-left"
                  size="200"
                  class="d-fw-bold"
                />
              </template>
            </dt-button>
          </template>
        </dt-tooltip>

        <dt-tooltip message="Align Center">
          <template #anchor>
            <dt-button
              v-if="showAlignCenterButton"
              data-qa="dt-editor-align-center-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor?.isActive({ textAlign: 'center' })"
              size="sm"
              @click="onTextAlign('center')"
            >
              <template #icon>
                <dt-icon
                  name="align-center"
                  size="200"
                  class="d-fw-bold"
                />
              </template>
            </dt-button>
          </template>
        </dt-tooltip>

        <dt-tooltip message="Align Right">
          <template #anchor>
            <dt-button
              v-if="showAlignRightButton"
              data-qa="dt-editor-align-right-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor?.isActive({ textAlign: 'right' })"
              size="sm"
              @click="onTextAlign('right')"
            >
              <template #icon>
                <dt-icon
                  name="align-right"
                  size="200"
                  class="d-fw-bold"
                />
              </template>
            </dt-button>
          </template>
        </dt-tooltip>

        <dt-tooltip message="Justify">
          <template #anchor>
            <dt-button
              v-if="showAlignJustifyButton"
              data-qa="dt-editor-align-justify-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor?.isActive({ textAlign: 'justify' })"
              size="sm"
              @click="onTextAlign('justify')"
            >
              <template #icon>
                <dt-icon
                  name="align-justify"
                  size="200"
                  class="d-fw-bold"
                />
              </template>
            </dt-button>
          </template>
        </dt-tooltip>
      </dt-stack>

      <dt-stack
        direction="row"
        gap="100"
        v-if="showingListButtons"
        :class="{ 'd-px4 d-py4': showingListButtons }"
      >
        <dt-tooltip
          message="Bullet List"
          placement="top"
        >
          <template #anchor>
            <dt-button
              v-if="showListItemsButton"
              data-qa="dt-editor-list-items-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor.isActive('bulletList')"
              size="sm"
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
          </template>
        </dt-tooltip>

        <dt-tooltip
          message="Ordered List"
          placement="top"
        >
          <template #anchor>
            <dt-button
              v-if="showOrderedListButton"
              data-qa="dt-editor-ordered-list-items-btn"
              importance="clear"
              kind="muted"
              size="sm"
              :active="$refs.richTextEditor?.editor.isActive('orderedList')"
              @click="onOrderedListToggle"
            >
              <template #icon>
                <dt-icon
                  name="list-ordered"
                  size="200"
                  class="d-fw-bold"
                />
              </template>
            </dt-button>
          </template>
        </dt-tooltip>
      </dt-stack>

      <dt-stack
        direction="row"
        gap="100"
        v-if="showQuoteButton"
        class="d-px4 d-py4"
      >
        <dt-tooltip
          message="Quote"
          placement="top"
        >
          <template #anchor>
            <dt-button
              data-qa="dt-editor-blockquote-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor.isActive('blockquote')"
              size="sm"
              @click="onBlockquoteToggle"
            >
              <template #icon>
                <dt-icon
                  name="quote"
                  size="200"
                  class="d-fw-bold"
                />
              </template>
            </dt-button>
          </template>
        </dt-tooltip>
      </dt-stack>

      <dt-stack
        direction="row"
        gap="100"
        v-if="showAddLink.showAddLinkButton"
        class="d-px4 d-py4"
      >
        <dt-tooltip
          :message="$refs.richTextEditor?.editor.isActive('link') ? 'Edit Link' : 'Add Link'"
          placement="top"
        >
          <template #anchor>
            <dt-button
              data-qa="dt-editor-add-link-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor.isActive('link')"
              size="sm"
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
          </template>
        </dt-tooltip>
      </dt-stack>

      <dt-stack
        direction="row"
        gap="100"
        v-if="showCodeBlockButton"
        class="d-px4 d-py4"
      >
        <dt-tooltip
          message="Code"
          placement="top"
        >
          <template #anchor>
            <dt-button
              data-qa="dt-editor-code-block-btn"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor.isActive('codeBlock')"
              size="sm"
              @click="onCodeBlockToggle"
            >
              <template #icon>
                <dt-icon
                  name="code"
                  size="200"
                  class="d-fw-bold"
                />
              </template>
            </dt-button>
          </template>
        </dt-tooltip>
      </dt-stack>
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
      @click.native.stop="onInputFocus"
      @update:show="(s) => updateInputModal(s)"
    >
      <div class="d-m4">
        <dt-input
          v-model="linkInput"
          :input-aria-label="showAddLink.setLinkInputAriaLabel"
          data-qa="dt-editor-link-input"
          :placeholder="setLinkPlaceholder"
          input-wrapper-class="d-bgc-black-100 d-bar5 d-ba d-baw1 d-bc-black-300 d-py2 d-ol-none"
          @click="onInputFocus"
          @click.native.stop="onInputFocus"
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
        :input-class="`${this.inputClass} d-ol-none d-my6`"
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
import { DtTooltip } from '@/components/tooltip';

export default {
  name: 'DtRecipeEditor',

  components: {
    DtRichTextEditor,
    DtButton,
    DtIcon,
    DtModal,
    DtStack,
    DtInput,
    DtTooltip,
  },

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
     * Show button to render ordered list items
     */
    showOrderedListButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to align text to the left
     */
    showAlignLeftButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to align text to the center
     */
    showAlignCenterButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to align text to the right
     */
    showAlignRightButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to justify text
     */
    showAlignJustifyButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to add quote format to text
     */
    showQuoteButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to add code block
     */
    showCodeBlockButton: {
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

    showingTextFormatButtons () {
      return this.showBoldButton || this.showItalicsButton || this.showStrikeButton || this.showUnderlineButton;
    },

    showingAlignmentButtons () {
      return this.showAlignLeftButton || this.showAlignCenterButton || this.showAlignRightButton || this.showAlignJustifyButton;
    },

    showingListButtons () {
      return this.showListItemsButton || this.showOrderedListButton;
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

    onTextAlign (alignment) {
      if (this.$refs.richTextEditor?.editor?.isActive({ textAlign: alignment })) {
        // If this alignment type is already set here, unset it
        return this.$refs.richTextEditor?.editor.chain().focus().unsetTextAlign().run();
      }
      this.$refs.richTextEditor?.editor.chain().focus().setTextAlign(alignment).run();
    },

    onBulletListToggle () {
      this.$refs.richTextEditor?.editor.chain().focus().toggleBulletList().run();
    },

    onOrderedListToggle () {
      this.$refs.richTextEditor?.editor.chain().focus().toggleOrderedList().run();
    },

    onCodeBlockToggle () {
      this.$refs.richTextEditor?.editor.chain().focus().toggleCodeBlock().run();
    },

    onBlockquoteToggle () {
      this.$refs.richTextEditor?.editor.chain().focus().toggleBlockquote().run();
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
