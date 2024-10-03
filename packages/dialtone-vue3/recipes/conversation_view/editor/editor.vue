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
      gap="450"
      class="d-p8 dt-editor--top-bar-background"
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
              :data-qa="button.dataQA"
              importance="clear"
              kind="muted"
              :active="$refs.richTextEditor?.editor?.isActive(button.selector)"
              size="xs"
              :aria-label="button.tooltipMessage"
              :class="{ 'd-btn--icon-only': !button.label }"
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
        <div class="dt-editor--button-group-divider" />
      </dt-stack>
      <dt-stack
        v-if="linkButton.showBtn"
        direction="row"
        gap="300"
      >
        <dt-popover
          :open="showLinkInput"
          placement="bottom-start"
          :visually-hidden-close="true"
          :visually-hidden-close-label="'Close link input popover'"
          data-qa="dt-editor-link-input-popover"
          :show-close-button="false"
          @click="onInputFocus"
          @click.stop="onInputFocus"
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
                  :active="
                    $refs.richTextEditor?.editor?.isActive(linkButton.selector)
                  "
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
            <span v-if="showAddLink.setLinkTitle.length > 0">
              {{ showAddLink.setLinkTitle }}
            </span>
            <dt-input
              v-model="linkInput"
              :input-aria-label="showAddLink.setLinkInputAriaLabel"
              data-qa="dt-editor-link-input"
              :placeholder="setLinkPlaceholder"
              input-wrapper-class="d-bgc-secondary d-mt6 d-bar5 d-ba d-baw1 d-bc-default d-py2 d-ol-none"
              @click="onInputFocus"
              @click.stop="onInputFocus"
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
      </dt-stack>
    </dt-stack>

    <!-- Some wrapper to restrict the height and show the scrollbar -->
    <div
      class="d-of-auto d-mx12 d-mt12 d-mb16 d-c-text"
      :style="{ 'max-height': maxHeight }"
    >
      <dt-rich-text-editor
        ref="richTextEditor"
        v-model="internalInputValue"
        data-qa="dt-rich-text-editor"
        :editable="editable"
        :input-aria-label="inputAriaLabel"
        :input-class="`d-ml16 d-ol-none d-my6 ${inputClass}`"
        :output-format="htmlOutputFormat"
        :auto-focus="autoFocus"
        :placeholder="placeholder"
        :allow-line-breaks="true"
        :link="true"
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
      return (
        this.showBoldButton ||
        this.showItalicsButton ||
        this.showStrikeButton ||
        this.showUnderlineButton
      );
    },

    showingAlignmentButtons () {
      return (
        this.showAlignLeftButton ||
        this.showAlignCenterButton ||
        this.showAlignRightButton ||
        this.showAlignJustifyButton
      );
    },

    showingListButtons () {
      return this.showListItemsButton || this.showOrderedListButton;
    },

    buttonGroups () {
      const individualButtonStacks = this.individualButtons.map(
        (buttonData) => ({
          key: buttonData.selector,
          buttonGroup: [buttonData],
        }),
      );
      return [
        { key: 'new', buttonGroup: this.newButtons },
        { key: 'format', buttonGroup: this.textFormatButtons },
        { key: 'alignment', buttonGroup: this.alignmentButtons },
        { key: 'list', buttonGroup: this.listButtons },
        ...individualButtonStacks,
      ].filter((buttonGroupData) => buttonGroupData.buttonGroup.length > 0);
    },

    newButtons () {
      return [
        {
          showBtn: this.showQuickRepliesButton,
          label: 'Quick reply',
          selector: 'quickReplies',
          icon: DtIconLightningBolt,
          dataQA: 'dt-editor-quick-replies-btn',
          tooltipMessage: 'Quick Reply',
          onClick: this.onQuickRepliesClick,
        },
      ].filter((button) => button.showBtn);
    },

    textFormatButtons () {
      return [
        {
          showBtn: this.showBoldButton,
          selector: 'bold',
          icon: DtIconBold,
          dataQA: 'dt-editor-bold-btn',
          tooltipMessage: 'Bold',
          onClick: this.onBoldTextToggle,
        },
        {
          showBtn: this.showItalicsButton,
          selector: 'italic',
          icon: DtIconItalic,
          dataQA: 'dt-editor-italics-btn',
          tooltipMessage: 'Italics',
          onClick: this.onItalicTextToggle,
        },
        {
          showBtn: this.showUnderlineButton,
          selector: 'underline',
          icon: DtIconUnderline,
          dataQA: 'dt-editor-underline-btn',
          tooltipMessage: 'Underline',
          onClick: this.onUnderlineTextToggle,
        },
        {
          showBtn: this.showStrikeButton,
          selector: 'strike',
          icon: DtIconStrikethrough,
          dataQA: 'dt-editor-strike-btn',
          tooltipMessage: 'Strike',
          onClick: this.onStrikethroughTextToggle,
        },
      ].filter((button) => button.showBtn);
    },

    alignmentButtons () {
      return [
        {
          showBtn: this.showAlignLeftButton,
          selector: { textAlign: 'left' },
          icon: DtIconAlignLeft,
          dataQA: 'dt-editor-align-left-btn',
          tooltipMessage: 'Align Left',
          onClick: () => this.onTextAlign('left'),
        },
        {
          showBtn: this.showAlignCenterButton,
          selector: { textAlign: 'center' },
          icon: DtIconAlignCenter,
          dataQA: 'dt-editor-align-center-btn',
          tooltipMessage: 'Align Center',
          onClick: () => this.onTextAlign('center'),
        },
        {
          showBtn: this.showAlignRightButton,
          selector: { textAlign: 'right' },
          icon: DtIconAlignRight,
          dataQA: 'dt-editor-align-right-btn',
          tooltipMessage: 'Align Right',
          onClick: () => this.onTextAlign('right'),
        },
        {
          showBtn: this.showAlignJustifyButton,
          selector: { textAlign: 'justify' },
          icon: DtIconAlignJustify,
          dataQA: 'dt-editor-align-justify-btn',
          tooltipMessage: 'Align Justify',
          onClick: () => this.onTextAlign('justify'),
        },
      ].filter((button) => button.showBtn);
    },

    listButtons () {
      return [
        {
          showBtn: this.showListItemsButton,
          selector: 'bulletList',
          icon: DtIconListBullet,
          dataQA: 'dt-editor-list-items-btn',
          tooltipMessage: 'Bullet List',
          onClick: this.onBulletListToggle,
        },
        {
          showBtn: this.showOrderedListButton,
          selector: 'orderedList',
          icon: DtIconListOrdered,
          dataQA: 'dt-editor-ordered-list-items-btn',
          tooltipMessage: 'Ordered List',
          onClick: this.onOrderedListToggle,
        },
      ].filter((button) => button.showBtn);
    },

    individualButtons () {
      return [
        {
          showBtn: this.showQuoteButton,
          selector: 'blockquote',
          icon: DtIconQuote,
          dataQA: 'dt-editor-blockquote-btn',
          tooltipMessage: 'Quote',
          onClick: this.onBlockquoteToggle,
        },
        {
          showBtn: this.showCodeBlockButton,
          selector: 'codeBlock',
          icon: DtIconCodeBlock,
          dataQA: 'dt-editor-code-block-btn',
          tooltipMessage: 'Code',
          onClick: this.onCodeBlockToggle,
        },
      ].filter((button) => button.showBtn);
    },

    linkButton () {
      return {
        showBtn: this.showAddLink.showAddLinkButton,
        selector: 'link',
        icon: DtIconLink2,
        dataQA: 'dt-editor-add-link-btn',
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
      const prefix = EDITOR_SUPPORTED_LINK_PROTOCOLS.find((prefixRegex) =>
        prefixRegex.test(this.linkInput),
      );

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
      this.linkInput =
        this.$refs.richTextEditor?.editor?.getAttributes('link')?.href;
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
      if (
        this.$refs.richTextEditor?.editor?.isActive({ textAlign: alignment })
      ) {
        // If this alignment type is already set here, unset it
        return this.$refs.richTextEditor?.editor
          .chain()
          .focus()
          .unsetTextAlign()
          .run();
      }
      this.$refs.richTextEditor?.editor
        .chain()
        .focus()
        .setTextAlign(alignment)
        .run();
    },

    onBulletListToggle () {
      this.$refs.richTextEditor?.editor
        .chain()
        .focus()
        .toggleBulletList()
        .run();
    },

    onOrderedListToggle () {
      this.$refs.richTextEditor?.editor
        .chain()
        .focus()
        .toggleOrderedList()
        .run();
    },

    onCodeBlockToggle () {
      this.$refs.richTextEditor?.editor.chain().focus().toggleCodeBlock().run();
    },

    onQuickRepliesClick () {
      this.$emit('quick-replies-click');
    },

    onBlockquoteToggle () {
      this.$refs.richTextEditor?.editor
        .chain()
        .focus()
        .toggleBlockquote()
        .run();
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
.dt-editor--top-bar-background {
  background-color: var(--dt-color-surface-secondary);
}

.dt-editor--button-group-divider {
  margin-left: var(--dt-space-400);
  height: calc(var(--dt-size-550) + var(--dt-size-300));
  width: var(--dt-size-100);
  background: var(--dt-color-border-subtle);
}
</style>
