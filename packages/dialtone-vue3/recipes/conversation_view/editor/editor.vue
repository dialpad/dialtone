<template>
  <div
    class="d-recipe-editor"
    v-bind="addClassStyleAttrs($attrs)"
    data-qa="dt-recipe-editor"
    role="presentation"
    @click="$refs.richTextEditor.focusEditor()"
  >
    <!-- Section for the top UI -->
    <dt-stack
      class="d-recipe-editor__top-bar"
      direction="row"
      gap="450"
    >
      <dt-stack
        v-for="buttonGroup in buttonGroups"
        :key="buttonGroup.key"
        direction="row"
        gap="300"
      >
        <dt-tooltip
          v-for="button in buttonGroup.buttonGroup"
          :key="`${buttonGroup.key}-${JSON.stringify(button.selector)}`"
          :message="button.tooltipMessage"
          placement="top"
        >
          <template #anchor>
            <dt-button
              :active="$refs.richTextEditor?.editor?.isActive(button.selector)"
              :aria-label="button.tooltipMessage"
              :data-qa="button.dataQA"
              importance="clear"
              kind="muted"
              size="xs"
              @click="button.onClick()"
            >
              <template #icon>
                <component
                  :is="button.icon"
                  size="200"
                />
              </template>
              {{ button?.label }}
            </dt-button>
          </template>
        </dt-tooltip>
        <div class="d-recipe-editor__button-group-divider" />
      </dt-stack>
      <dt-stack
        v-if="linkButton.showBtn"
        direction="row"
        gap="300"
      >
        <dt-popover
          :open="showLinkInput"
          :show-close-button="false"
          :visually-hidden-close="true"
          :visually-hidden-close-label="'Close link input popover'"
          data-qa="dt-recipe-editor-link-input-popover"
          padding="none"
          placement="bottom-start"
          @click="onInputFocus"
          @opened="updateInput"
          @click.stop="onInputFocus"
        >
          <template #anchor>
            <dt-tooltip
              :key="linkButton.key"
              :message="linkButton.tooltipMessage"
              placement="top"
            >
              <template #anchor>
                <dt-button
                  :active="$refs.richTextEditor?.editor?.isActive(linkButton.selector)"
                  :aria-label="linkButton.tooltipMessage"
                  :data-qa="linkButton.dataQA"
                  importance="clear"
                  kind="muted"
                  size="xs"
                  @click="linkButton.onClick()"
                >
                  <template #icon>
                    <component
                      :is="linkButton.icon"
                      size="200"
                    />
                  </template>
                </dt-button>
              </template>
            </dt-tooltip>
          </template>

          <template #content>
            <div class="d-recipe-editor__popover-content">
              <span
                v-if="showAddLink.setLinkTitle.length > 0"
              >
                {{ showAddLink.setLinkTitle }}
              </span>
              <dt-input
                v-model="linkInput"
                :input-aria-label="showAddLink.setLinkInputAriaLabel"
                :placeholder="setLinkPlaceholder"
                data-qa="dt-recipe-editor-link-input"
                input-wrapper-class="d-recipe-editor-link__input-wrapper"
                @click="onInputFocus"
                @focus="onInputFocus"
                @click.stop="onInputFocus"
                @keydown.enter="setLink"
              />
            </div>
          </template>
          <template #footerContent>
            <dt-stack
              direction="row"
              gap="300"
              class="d-recipe-editor__popover-footer"
            >
              <dt-button
                :aria-label="removeLinkButton.ariaLabel"
                data-qa="dt-recipe-editor-remove-link-btn"
                importance="clear"
                kind="muted"
                size="sm"
                @click="removeLink"
              >
                {{ removeLinkButton.label }}
              </dt-button>
              <dt-button
                :aria-label="cancelSetLinkButton.ariaLabel"
                data-qa="dt-recipe-editor-set-link-cancel-btn"
                importance="clear"
                kind="muted"
                size="sm"
                @click="closeLinkInput"
              >
                {{ cancelSetLinkButton.label }}
              </dt-button>
              <dt-button
                :aria-label="confirmSetLinkButton.ariaLabel"
                data-qa="dt-recipe-editor-set-link-confirm-btn"
                size="sm"
                @click="setLink"
              >
                {{ confirmSetLinkButton.label }}
              </dt-button>
            </dt-stack>
          </template>
        </dt-popover>
      </dt-stack>
    </dt-stack>

    <!-- Some wrapper to restrict the height and show the scrollbar -->
    <div
      :style="{ 'max-height': maxHeight }"
      class="d-recipe-editor__content"
    >
      <dt-rich-text-editor
        ref="richTextEditor"
        v-model="internalInputValue"
        :allow-inline-images="true"
        :allow-line-breaks="true"
        :hide-link-bubble-menu="true"
        :auto-focus="autoFocus"
        :editable="editable"
        :input-aria-label="inputAriaLabel"
        :input-class="`d-recipe-editor__content-input ${inputClass}`"
        :link="true"
        :output-format="htmlOutputFormat"
        :placeholder="placeholder"
        :use-div-tags="useDivTags"
        data-qa="dt-rich-text-editor"
        v-bind="removeClassStyleAttrs($attrs)"
        @blur="onBlur"
        @focus="onFocus"
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
import { removeClassStyleAttrs, addClassStyleAttrs } from '@/common/utils';
import { DtButton } from '@/components/button';
import { DtPopover } from '@/components/popover';
import { DtStack } from '@/components/stack';
import { DtInput } from '@/components/input';
import { DtTooltip } from '@/components/tooltip';
import {
  DtIconAlignCenter,
  DtIconAlignJustify,
  DtIconAlignLeft,
  DtIconAlignRight,
  DtIconBold,
  DtIconCodeBlock,
  DtIconImage,
  DtIconItalic,
  DtIconLightningBolt,
  DtIconLink2,
  DtIconListBullet,
  DtIconListOrdered,
  DtIconQuote,
  DtIconStrikethrough,
  DtIconUnderline,
} from '@dialpad/dialtone-icons/vue3';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeEditor',

  components: {
    DtRichTextEditor,
    DtButton,
    DtPopover,
    DtStack,
    DtInput,
    DtTooltip,
    DtIconLightningBolt,
    DtIconBold,
    DtIconItalic,
    DtIconUnderline,
    DtIconStrikethrough,
    DtIconListBullet,
    DtIconListOrdered,
    DtIconAlignLeft,
    DtIconAlignCenter,
    DtIconAlignRight,
    DtIconAlignJustify,
    DtIconQuote,
    DtIconCodeBlock,
    DtIconLink2,
    DtIconImage,
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
     * Show button to handle quick replies
     */
    showQuickRepliesButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Show button to add an inline image
     */
    showInlineImageButton: {
      type: Boolean,
      default: false,
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

    /**
     * Use div tags instead of paragraph tags to show text
     */
    useDivTags: {
      type: Boolean,
      default: false,
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

    /**
     * Quick replies button
     * pressed event
     * @event quick-replies-click
     */
    'quick-replies-click',

    /**
     * Emit when inline image button is clicked
     * @event inline-image-click
     */
    'inline-image-click',
  ],

  data () {
    return {
      internalInputValue: this.value, // internal input content
      hasFocus: false,

      linkOptions: {
        class: 'd-recipe-editor__link',
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
      return this.showAlignLeftButton || this.showAlignCenterButton ||
        this.showAlignRightButton || this.showAlignJustifyButton;
    },

    showingListButtons () {
      return this.showListItemsButton || this.showOrderedListButton;
    },

    buttonGroups () {
      const individualButtonStacks = this.individualButtons.map(buttonData => ({
        key: buttonData.selector,
        buttonGroup: [buttonData],
      }));
      return [
        { key: 'new', buttonGroup: this.newButtons },
        { key: 'format', buttonGroup: this.textFormatButtons },
        { key: 'alignment', buttonGroup: this.alignmentButtons },
        { key: 'list', buttonGroup: this.listButtons },
        ...individualButtonStacks,
      ].filter(buttonGroupData => buttonGroupData.buttonGroup.length > 0);
    },

    newButtons () {
      return [
        {
          showBtn: this.showQuickRepliesButton,
          label: 'Quick reply',
          selector: 'quickReplies',
          icon: DtIconLightningBolt,
          dataQA: 'dt-recipe-editor-quick-replies-btn',
          tooltipMessage: 'Quick Reply',
          onClick: this.onQuickRepliesClick,
        },
      ].filter(button => button.showBtn);
    },

    textFormatButtons () {
      return [
        {
          showBtn: this.showBoldButton,
          selector: 'bold',
          icon: DtIconBold,
          dataQA: 'dt-recipe-editor-bold-btn',
          tooltipMessage: 'Bold',
          onClick: this.onBoldTextToggle,
        },
        {
          showBtn: this.showItalicsButton,
          selector: 'italic',
          icon: DtIconItalic,
          dataQA: 'dt-recipe-editor-italics-btn',
          tooltipMessage: 'Italics',
          onClick: this.onItalicTextToggle,
        },
        {
          showBtn: this.showUnderlineButton,
          selector: 'underline',
          icon: DtIconUnderline,
          dataQA: 'dt-recipe-editor-underline-btn',
          tooltipMessage: 'Underline',
          onClick: this.onUnderlineTextToggle,
        },
        {
          showBtn: this.showStrikeButton,
          selector: 'strike',
          icon: DtIconStrikethrough,
          dataQA: 'dt-recipe-editor-strike-btn',
          tooltipMessage: 'Strike',
          onClick: this.onStrikethroughTextToggle,
        },
      ].filter(button => button.showBtn);
    },

    alignmentButtons () {
      return [
        {
          showBtn: this.showAlignLeftButton,
          selector: { textAlign: 'left' },
          icon: DtIconAlignLeft,
          dataQA: 'dt-recipe-editor-align-left-btn',
          tooltipMessage: 'Align Left',
          onClick: () => this.onTextAlign('left'),
        },
        {
          showBtn: this.showAlignCenterButton,
          selector: { textAlign: 'center' },
          icon: DtIconAlignCenter,
          dataQA: 'dt-recipe-editor-align-center-btn',
          tooltipMessage: 'Align Center',
          onClick: () => this.onTextAlign('center'),
        },
        {
          showBtn: this.showAlignRightButton,
          selector: { textAlign: 'right' },
          icon: DtIconAlignRight,
          dataQA: 'dt-recipe-editor-align-right-btn',
          tooltipMessage: 'Align Right',
          onClick: () => this.onTextAlign('right'),
        },
        {
          showBtn: this.showAlignJustifyButton,
          selector: { textAlign: 'justify' },
          icon: DtIconAlignJustify,
          dataQA: 'dt-recipe-editor-align-justify-btn',
          tooltipMessage: 'Align Justify',
          onClick: () => this.onTextAlign('justify'),
        },
      ].filter(button => button.showBtn);
    },

    listButtons () {
      return [
        {
          showBtn: this.showListItemsButton,
          selector: 'bulletList',
          icon: DtIconListBullet,
          dataQA: 'dt-recipe-editor-list-items-btn',
          tooltipMessage: 'Bullet List',
          onClick: this.onBulletListToggle,
        },
        {
          showBtn: this.showOrderedListButton,
          selector: 'orderedList',
          icon: DtIconListOrdered,
          dataQA: 'dt-recipe-editor-ordered-list-items-btn',
          tooltipMessage: 'Ordered List',
          onClick: this.onOrderedListToggle,
        },
      ].filter(button => button.showBtn);
    },

    individualButtons () {
      return [
        {
          showBtn: this.showQuoteButton,
          selector: 'blockquote',
          icon: DtIconQuote,
          dataQA: 'dt-recipe-editor-blockquote-btn',
          tooltipMessage: 'Quote',
          onClick: this.onBlockquoteToggle,
        },
        {
          showBtn: this.showCodeBlockButton,
          selector: 'codeBlock',
          icon: DtIconCodeBlock,
          dataQA: 'dt-recipe-editor-code-block-btn',
          tooltipMessage: 'Code',
          onClick: this.onCodeBlockToggle,
        },
        {
          showBtn: this.showInlineImageButton,
          selector: 'image',
          icon: DtIconImage,
          dataQA: 'dt-recipe-editor-inline-image-btn',
          tooltipMessage: 'Image',
          // Handle getting image
          onClick: this.onInsertInlineImageClick,
        },
      ].filter(button => button.showBtn);
    },

    linkButton () {
      return {
        showBtn: this.showAddLink.showAddLinkButton,
        selector: 'link',
        icon: DtIconLink2,
        dataQA: 'dt-recipe-editor-add-link-btn',
        tooltipMessage: 'Link',
        onClick: this.openLinkInput,
      };
    },
  },

  watch: {
    value (newValue) {
      this.internalInputValue = newValue;
    },
  },

  methods: {
    removeClassStyleAttrs,
    addClassStyleAttrs,

    onInputFocus (event) {
      event?.stopPropagation();
    },

    removeLink () {
      this.$refs.richTextEditor?.editor?.chain()?.focus()?.unsetLink()?.run();
      this.closeLinkInput();
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

    openLinkInput () {
      this.showLinkInput = true;
    },

    updateInput (openedInput) {
      if (!openedInput) {
        return this.closeLinkInput();
      }
      this.linkInput = this.$refs.richTextEditor?.editor?.getAttributes('link')?.href;
    },

    closeLinkInput () {
      this.showLinkInput = false;
      this.linkInput = '';
      this.$refs.richTextEditor.editor?.chain().focus();
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

    onQuickRepliesClick () {
      this.$emit('quick-replies-click');
    },

    onInsertInlineImageClick () {
      this.$emit('inline-image-click');
    },

    insertInlineImage (imageUrl) {
      this.$refs.richTextEditor?.editor.chain().focus().setImage({ src: imageUrl }).run();
    },

    insertInMessageBody (messageContent) {
      this.$refs.richTextEditor?.editor.chain().focus().insertContent(messageContent).run();
    },

    setCursorPosition (position = null) {
      this.$refs.richTextEditor?.editor.chain().focus(position).run();
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
