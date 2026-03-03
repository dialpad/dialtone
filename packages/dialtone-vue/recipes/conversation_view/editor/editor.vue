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
        <template v-for="button in buttonGroup.buttonGroup">
          <!-- Font Style Popover -->
          <editor-toolbar-popover-button
            v-if="button.buttonType === 'popover' && button.selector === 'fontStyle'"
            :key="getButtonKey(buttonGroup.key, button.selector)"
            :ref="getButtonRef(buttonGroup.key, button.selector)"
            :is-active="$refs.richTextEditor?.editor?.isActive(button.selector)"
            :tooltip-message="button.tooltipMessage"
            :data-qa="button.dataQA"
            :popover-data-qa="'dt-recipe-editor-font-style-input-popover'"
            :tabindex="canFocus(getButtonRef(buttonGroup.key, button.selector)) ? 0 : -1"
            :icon="button.icon"
            @shift-focus-right="shiftActionBarFocusRight"
            @shift-focus-left="shiftActionBarFocusLeft"
          >
            <template #content="{ close }">
              <dt-combobox
                label=""
                :label-visible="false"
                :show-list="true"
                :click-on-select="true"
                @escape="close()"
              >
                <template #input="{ inputProps }">
                  <dt-input
                    v-bind="inputProps"
                    v-model="fontStyleSearch"
                    root-class="d-p8 d-pb4 d-w216"
                    type="search"
                    :placeholder="i18n.$t('DIALTONE_EDITOR_FONT_STYLE_SEARCH_PLACEHOLDER')"
                    size="sm"
                    role="menuitem"
                  >
                    <template #leftIcon="{ iconSize }">
                      <dt-icon-search :size="iconSize" />
                    </template>
                  </dt-input>
                </template>
                <template #list="{ listProps }">
                  <ul
                    v-bind="listProps"
                  >
                    <dt-list-item
                      v-for="fontStyle in filteredFontStyles"
                      :key="fontStyle.name"
                      :selected="isCurrentFontFamily(fontStyle.value)"
                      :style="{ fontFamily: fontStyle.value || 'inherit' }"
                      role="option"
                      navigation-type="arrow-keys"
                      @click="
                        close();
                        onFontStyleSelect(fontStyle.value)
                      "
                    >
                      {{ fontStyle.name }}
                    </dt-list-item>
                  </ul>
                </template>
              </dt-combobox>
            </template>
          </editor-toolbar-popover-button>

          <!-- Font Size Dropdown -->
          <editor-toolbar-dropdown-button
            v-else-if="button.buttonType === 'popover' && button.selector === 'fontSize'"
            :key="getButtonKey(buttonGroup.key, button.selector)"
            :ref="getButtonRef(buttonGroup.key, button.selector)"
            :is-active="$refs.richTextEditor?.editor?.isActive(button.selector)"
            :tooltip-message="button.tooltipMessage"
            :data-qa="button.dataQA"
            :dropdown-data-qa="'dt-recipe-editor-font-size-input-popover'"
            :tabindex="canFocus(getButtonRef(buttonGroup.key, button.selector)) ? 0 : -1"
            :icon="button.icon"
            @shift-focus-right="shiftActionBarFocusRight"
            @shift-focus-left="shiftActionBarFocusLeft"
          >
            <template #list="{ close }">
              <dt-list-item
                v-for="fontSize in fontSizes"
                :key="fontSize.name"
                :selected="isCurrentFontSize(fontSize.value)"
                role="menuitem"
                navigation-type="arrow-keys"
                @click="
                  close();
                  onFontSizeSelect(fontSize.value, $event)
                "
              >
                <span :style="{ fontSize: fontSize.value }">{{ fontSize.name }}</span>
              </dt-list-item>
            </template>
          </editor-toolbar-dropdown-button>

          <!-- Font Color Button -->
          <dt-button
            v-else-if="button.buttonType === 'custom' && button.selector === 'fontColor'"
            :key="getButtonKey(buttonGroup.key, button.selector)"
            :ref="getButtonRef(buttonGroup.key, button.selector)"
            v-dt-tooltip="{ message: button.tooltipMessage, placement: 'top' }"
            kind="muted"
            importance="clear"
            size="xs"
            :active="$refs.richTextEditor?.editor?.isActive(button.selector)"
            :tabindex="canFocus(getButtonRef(buttonGroup.key, button.selector)) ? 0 : -1"
            :aria-label="button.tooltipMessage"
            :data-qa="button.dataQA"
            @keydown.right.stop="shiftActionBarFocusRight"
            @keydown.left.stop="shiftActionBarFocusLeft"
            @click="button.onClick()"
          >
            <template #icon>
              <component
                :is="button.icon"
                size="200"
                :style="!isDefaultFontColor ? { color: currentFontColor } : {}"
              />
              <dt-input
                :value="currentFontColor"
                root-class="d-w0 d-h0 d-of-hidden"
                input-class="colorPickerInput d-w0 d-h0 d-p0 d-bar0"
                input-wrapper-class="d-w0 d-h0 d-ba-none"
                size="sm"
                type="color"
                @input="onColorPickerInput"
                @click.stop
              />
            </template>
          </dt-button>

          <!-- Variable Popover -->
          <editor-toolbar-popover-button
            v-else-if="button.buttonType === 'popover' && button.selector === 'variable'"
            :key="getButtonKey(buttonGroup.key, button.selector)"
            :ref="getButtonRef(buttonGroup.key, button.selector)"
            :is-active="false"
            :tooltip-message="button.tooltipMessage"
            :data-qa="button.dataQA"
            :popover-data-qa="'dt-recipe-editor-variable-popover'"
            :tabindex="canFocus(getButtonRef(buttonGroup.key, button.selector)) ? 0 : -1"
            :icon="button.icon"
            @shift-focus-right="shiftActionBarFocusRight"
            @shift-focus-left="shiftActionBarFocusLeft"
          >
            <template #content="{ close }">
              <dt-combobox
                label=""
                :label-visible="false"
                :show-list="true"
                :click-on-select="true"
                @escape="close()"
              >
                <template #input="{ inputProps }">
                  <dt-input
                    v-bind="inputProps"
                    v-model="variableSearchValue"
                    root-class="d-p8 d-pb4 d-w264"
                    type="search"
                    :placeholder="i18n.$t('DIALTONE_EDITOR_VARIABLE_POPOVER_SEARCH_PLACEHOLDER')"
                    size="md"
                    role="menuitem"
                  >
                    <template #leftIcon="{ iconSize }">
                      <dt-icon-search :size="iconSize" />
                    </template>
                  </dt-input>
                </template>
                <template #list="{ listProps }">
                  <div v-bind="listProps">
                    <dt-list-item-group
                      v-for="(category, index) in filteredCategories"
                      :key="category.name"
                      :heading="category.name"
                      heading-class="d-headline--sm-compact d-p8"
                    >
                      <dt-list-item
                        v-for="item in getFilteredItemsForCategory(category)"
                        :key="category.name + item.name"
                        role="option"
                        navigation-type="arrow-keys"
                        @click="
                          insertVariable(category.name, item);
                          close();
                        "
                      >
                        {{ item.name }}
                      </dt-list-item>
                      <dt-dropdown-separator
                        v-if="index < filteredCategories.length - 1"
                      />
                    </dt-list-item-group>
                  </div>
                </template>
              </dt-combobox>
            </template>
          </editor-toolbar-popover-button>

          <!-- Regular Toolbar Button -->
          <editor-toolbar-button
            v-else-if="button.buttonType === 'button'"
            :key="getButtonKey(buttonGroup.key, button.selector)"
            :ref="getButtonRef(buttonGroup.key, button.selector)"
            :is-active="$refs.richTextEditor?.editor?.isActive(button.selector)"
            :tooltip-message="button.tooltipMessage"
            :data-qa="button.dataQA"
            :tabindex="canFocus(getButtonRef(buttonGroup.key, button.selector)) ? 0 : -1"
            :icon="button.icon"
            :label="button.label"
            :on-click="button.onClick"
            @shift-focus-right="shiftActionBarFocusRight"
            @shift-focus-left="shiftActionBarFocusLeft"
          />
        </template>
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
                  :ref="getButtonRef('custom', 'link')"
                  :active="$refs.richTextEditor?.editor?.isActive(linkButton.selector)"
                  :aria-label="linkButton.tooltipMessage"
                  :data-qa="linkButton.dataQA"
                  :tabindex="canFocus(getButtonRef('custom', 'link')) ? 0 : -1"
                  importance="clear"
                  kind="muted"
                  size="xs"
                  @click="linkButton.onClick()"
                  @keydown.right.stop="shiftActionBarFocusRight"
                  @keydown.left.stop="shiftActionBarFocusLeft"
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
              <span>
                {{ showAddLinkButtonLabels.title }}
              </span>
              <dt-input
                v-model="linkInput"
                :input-aria-label="showAddLinkButtonLabels['aria-label']"
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
                data-qa="dt-recipe-editor-remove-link-btn"
                importance="clear"
                kind="muted"
                size="sm"
                v-bind="removeLinkButtonLabels"
                @click="removeLink"
              >
                {{ removeLinkButtonLabels.title }}
              </dt-button>
              <dt-button
                data-qa="dt-recipe-editor-set-link-cancel-btn"
                importance="clear"
                kind="muted"
                size="sm"
                v-bind="cancelSetLinkButtonLabels"
                @click="closeLinkInput"
              >
                {{ cancelSetLinkButtonLabels.title }}
              </dt-button>
              <dt-button
                data-qa="dt-recipe-editor-set-link-confirm-btn"
                size="sm"
                v-bind="confirmSetLinkButtonLabels"
                @click="setLink"
              >
                {{ confirmSetLinkButtonLabels.title }}
              </dt-button>
            </dt-stack>
          </template>
        </dt-popover>
      </dt-stack>
    </dt-stack>

    <!-- Some wrapper to restrict the height and show the scrollbar -->
    <div
      :style="{ 'max-height': maxHeight }"
      :class="['d-recipe-editor__content', { 'd-recipe-editor__content-image-resize': allowImageResize }]"
    >
      <dt-rich-text-editor
        ref="richTextEditor"
        v-model="internalInputValue"
        :allow-font-color="true"
        :allow-font-family="true"
        :allow-inline-images="true"
        :allow-line-breaks="true"
        :allow-variable="true"
        :allow-font-size="showFontSizeButton"
        :variable-items="flattenedVariableItems"
        :hide-link-bubble-menu="true"
        :auto-focus="autoFocus"
        :editable="editable"
        :input-aria-label="inputAriaLabel"
        :input-class="`d-recipe-editor__content-input ${inputClass}`"
        :link="true"
        :output-format="htmlOutputFormat"
        :placeholder="placeholder"
        :use-div-tags="useDivTags"
        :allow-tables="allowTables"
        :allow-image-resize="allowImageResize"
        data-qa="dt-rich-text-editor"
        v-bind="removeClassStyleAttrs($attrs)"
        @text-input="onTextInput"
        @blur="onBlur"
        @focus="onFocus"
        @input="onInput($event)"
        @selected="onSelected"
      />
    </div>
  </div>
</template>

<script>
import {
  DtRichTextEditor,
  RICH_TEXT_EDITOR_OUTPUT_FORMATS,
  RICH_TEXT_EDITOR_AUTOFOCUS_TYPES,
} from '@/components/rich_text_editor';
import {
  EDITOR_SUPPORTED_LINK_PROTOCOLS,
  EDITOR_DEFAULT_LINK_PREFIX,
  EDITOR_DEFAULT_FONT_COLOR,
} from './editor_constants.js';
import { removeClassStyleAttrs, addClassStyleAttrs } from '@/common/utils';
import { DtButton } from '@/components/button';
import { DtPopover } from '@/components/popover';
import { DtStack } from '@/components/stack';
import { DtInput } from '@/components/input';
import { DtTooltip } from '@/components/tooltip';
import { DtListItem } from '@/components/list_item';
import { DtCombobox } from '@/components/combobox';

import { DtDropdownSeparator } from '@/components/dropdown/index.js';
import { DtListItemGroup } from '@/components/list_item_group/index.js';
import EditorToolbarButton from './EditorToolbarButton.vue';
import EditorToolbarDropdownButton from './EditorToolbarDropdownButton.vue';
import EditorToolbarPopoverButton from './EditorToolbarPopoverButton.vue';
import {
  DtIconAlignCenter,
  DtIconAlignJustify,
  DtIconAlignLeft,
  DtIconAlignRight,
  DtIconBold,
  DtIconCodeBlock,
  DtIconImage,
  DtIconItalic,
  DtIconQuickReply,
  DtIconLink2,
  DtIconListBullet,
  DtIconListOrdered,
  DtIconQuote,
  DtIconStrikethrough,
  DtIconUnderline,
  DtIconType,
  DtIconBraces,
  DtIconSearch,
  DtIconChevronDown,
  DtIconFontSize,
  DtIconStopFilled,
} from '@dialpad/dialtone-icons/vue3';
import { DialtoneLocalization } from '@/localization';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeEditor',

  components: {
    DtListItemGroup,
    DtDropdownSeparator,
    DtListItem,
    DtRichTextEditor,
    DtButton,
    DtPopover,
    DtStack,
    DtInput,
    DtTooltip,
    DtCombobox,
    EditorToolbarButton,
    EditorToolbarDropdownButton,
    EditorToolbarPopoverButton,
    DtIconQuickReply,
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
    DtIconSearch,
    DtIconType,
    DtIconBraces,
    DtIconChevronDown,
    DtIconFontSize,
    DtIconStopFilled,
  },

  mixins: [],

  inheritAttrs: false,

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
     * Show button to add a variable
     */
    showVariableButton: {
      type: Boolean,
      default: false,
    },

    /**
     * Variable categories to display when variable button is clicked
     */
    variableCategories: {
      type: Array,
      default: () => [],
    },

    /**
     * Show add link default config.
     */
    showAddLink: {
      type: Object,
      default: () => ({
        showAddLinkButton: true,
      }),
    },

    /**
     * Show font style button.
     */
    showFontStyleButton: {
      type: Boolean,
      default: false,
    },

    /**
     * Show font size button.
     */
    showFontSizeButton: {
      type: Boolean,
      default: false,
    },

    /**
     * Show font color button.
     */
    showFontColorButton: {
      type: Boolean,
      default: false,
    },

    /**
     * Available font styles for the font style dropdown.
     */
    fontStyles: {
      type: Array,
      default: () => [
        { name: 'Arial', value: null }, // arial is the default font
        { name: 'Georgia', value: 'Georgia' },
        { name: 'Helvetica', value: 'Helvetica' },
        { name: 'Verdana', value: 'Verdana'},
        { name: 'Times New Roman', value: 'Times New Roman' },
      ],
    },

    fontSizes : {
      type: Array,
      default: () => [
        { name: 'Small', value: '12px'},
        { name: 'Normal', value: '15px'},
        { name: 'Large', value: '24px'},
        { name: 'Huge', value: '36px'},
      ],
    },

    /**
     * Use div tags instead of paragraph tags to show text
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
     * Allow image resizing
     */
    allowImageResize: {
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
     * Event fired to sync the modelValue prop with the parent component
     * @event input
     * @type {String|JSON}
     */
    'update:modelValue',

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

    /**
     * Emit when text input is changed
     * @event text-input
     * @type {String}
     */
    'text-input',
  ],

  data () {
    return {
      internalInputValue: this.modelValue, // internal input content
      hasFocus: false,

      linkOptions: {
        class: 'd-recipe-editor__link',
      },

      currentFontColor: undefined,
      showLinkInput: false,
      fontStyleSearch: '',
      linkInput: '',
      currentButtonRefIndex: 0,
      variableSearchValue: '',
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    inputLength () {
      return this.internalInputValue.length;
    },

    htmlOutputFormat () {
      return RICH_TEXT_EDITOR_OUTPUT_FORMATS[2];
    },

    flattenedVariableItems () {
      if (!this.variableCategories) return [];
      return this.variableCategories.reduce((acc, category) => {
        return acc.concat(category.items || []);
      }, []);
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

    orderedRefs () {
      const refs = this.buttonGroups.reduce(function (acc, buttonData) {
        buttonData.buttonGroup.forEach(button => {
          acc.push(this.getButtonRef(buttonData.key, button.selector));
        }, this);
        return acc;
      }.bind(this), []);
      refs.push(this.getButtonRef('custom', 'link'));
      return refs;
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
          buttonType: 'button',
          label: this.i18n.$t('DIALTONE_EDITOR_QUICK_REPLY_BUTTON_LABEL'),
          selector: 'quickReplies',
          icon: DtIconQuickReply,
          dataQA: 'dt-recipe-editor-quick-replies-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_QUICK_REPLY_BUTTON_LABEL'),
          onClick: this.onQuickRepliesClick,
        },
      ].filter(button => button.showBtn);
    },

    textFormatButtons () {
      return [
        {
          showBtn: this.showFontStyleButton,
          buttonType: 'popover',
          selector: 'fontStyle',
          icon: DtIconType,
          dataQA: 'dt-recipe-editor-font-style-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_FONT_STYLE_BUTTON_LABEL'),
        },
        {
          showBtn: this.showFontSizeButton,
          buttonType: 'popover',
          selector: 'fontSize',
          icon: DtIconFontSize,
          dataQA: 'dt-recipe-editor-font-size-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_FONT_SIZE_BUTTON_LABEL'),
        },
        {
          showBtn: this.showFontColorButton,
          buttonType: 'custom',
          selector: 'fontColor',
          icon: DtIconStopFilled,
          dataQA: 'dt-recipe-editor-font-color-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_FONT_COLOR_BUTTON_LABEL'),
          onClick: this.onColorPickerButtonClick,
        },
        {
          showBtn: this.showBoldButton,
          buttonType: 'button',
          selector: 'bold',
          icon: DtIconBold,
          dataQA: 'dt-recipe-editor-bold-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_BOLD_BUTTON_LABEL'),
          onClick: this.onBoldTextToggle,
        },
        {
          showBtn: this.showItalicsButton,
          buttonType: 'button',
          selector: 'italic',
          icon: DtIconItalic,
          dataQA: 'dt-recipe-editor-italics-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_ITALICS_BUTTON_LABEL'),
          onClick: this.onItalicTextToggle,
        },
        {
          showBtn: this.showUnderlineButton,
          buttonType: 'button',
          selector: 'underline',
          icon: DtIconUnderline,
          dataQA: 'dt-recipe-editor-underline-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_UNDERLINE_BUTTON_LABEL'),
          onClick: this.onUnderlineTextToggle,
        },
        {
          showBtn: this.showStrikeButton,
          buttonType: 'button',
          selector: 'strike',
          icon: DtIconStrikethrough,
          dataQA: 'dt-recipe-editor-strike-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_STRIKE_BUTTON_LABEL'),
          onClick: this.onStrikethroughTextToggle,
        },
      ].filter(button => button.showBtn);
    },

    alignmentButtons () {
      return [
        {
          showBtn: this.showAlignLeftButton,
          buttonType: 'button',
          selector: { textAlign: 'left' },
          icon: DtIconAlignLeft,
          dataQA: 'dt-recipe-editor-align-left-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_ALIGN_LEFT_BUTTON_LABEL'),
          onClick: () => this.onTextAlign('left'),
        },
        {
          showBtn: this.showAlignCenterButton,
          buttonType: 'button',
          selector: { textAlign: 'center' },
          icon: DtIconAlignCenter,
          dataQA: 'dt-recipe-editor-align-center-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_ALIGN_CENTER_BUTTON_LABEL'),
          onClick: () => this.onTextAlign('center'),
        },
        {
          showBtn: this.showAlignRightButton,
          buttonType: 'button',
          selector: { textAlign: 'right' },
          icon: DtIconAlignRight,
          dataQA: 'dt-recipe-editor-align-right-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_ALIGN_RIGHT_BUTTON_LABEL'),
          onClick: () => this.onTextAlign('right'),
        },
        {
          showBtn: this.showAlignJustifyButton,
          buttonType: 'button',
          selector: { textAlign: 'justify' },
          icon: DtIconAlignJustify,
          dataQA: 'dt-recipe-editor-align-justify-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_ALIGN_JUSTIFY_BUTTON_LABEL'),
          onClick: () => this.onTextAlign('justify'),
        },
      ].filter(button => button.showBtn);
    },

    listButtons () {
      return [
        {
          showBtn: this.showListItemsButton,
          buttonType: 'button',
          selector: 'bulletList',
          icon: DtIconListBullet,
          dataQA: 'dt-recipe-editor-list-items-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_BULLET_LIST_BUTTON_LABEL'),
          onClick: this.onBulletListToggle,
        },
        {
          showBtn: this.showOrderedListButton,
          buttonType: 'button',
          selector: 'orderedList',
          icon: DtIconListOrdered,
          dataQA: 'dt-recipe-editor-ordered-list-items-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_ORDERED_LIST_BUTTON_LABEL'),
          onClick: this.onOrderedListToggle,
        },
      ].filter(button => button.showBtn);
    },

    individualButtons () {
      return [
        {
          showBtn: this.showQuoteButton,
          buttonType: 'button',
          selector: 'blockquote',
          icon: DtIconQuote,
          dataQA: 'dt-recipe-editor-blockquote-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_QUOTE_BUTTON_LABEL'),
          onClick: this.onBlockquoteToggle,
        },
        {
          showBtn: this.showCodeBlockButton,
          buttonType: 'button',
          selector: 'codeBlock',
          icon: DtIconCodeBlock,
          dataQA: 'dt-recipe-editor-code-block-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_CODE_BUTTON_LABEL'),
          onClick: this.onCodeBlockToggle,
        },
        {
          showBtn: this.showInlineImageButton,
          buttonType: 'button',
          selector: 'image',
          icon: DtIconImage,
          dataQA: 'dt-recipe-editor-inline-image-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_IMAGE_BUTTON_LABEL'),
          // Handle getting image
          onClick: this.onInsertInlineImageClick,
        },
        {
          showBtn: this.showVariableButton,
          buttonType: 'popover',
          selector: 'variable',
          icon: DtIconBraces,
          dataQA: 'dt-recipe-editor-variable-btn',
          tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_VARIABLE_BUTTON_LABEL'),
        },
      ].filter(button => button.showBtn);
    },

    linkButton () {
      return {
        showBtn: this.showAddLink.showAddLinkButton,
        buttonType: 'custom',
        selector: 'link',
        icon: DtIconLink2,
        dataQA: 'dt-recipe-editor-add-link-btn',
        tooltipMessage: this.i18n.$t('DIALTONE_EDITOR_LINK_BUTTON_LABEL'),
        onClick: this.openLinkInput,
      };
    },

    confirmSetLinkButtonLabels () {
      return this.i18n.$ta('DIALTONE_EDITOR_CONFIRM_SET_LINK_BUTTON');
    },

    cancelSetLinkButtonLabels () {
      return this.i18n.$ta('DIALTONE_EDITOR_CANCEL_SET_LINK_BUTTON');
    },

    removeLinkButtonLabels () {
      return this.i18n.$ta('DIALTONE_EDITOR_REMOVE_LINK_BUTTON');
    },

    showAddLinkButtonLabels () {
      return this.i18n.$ta('DIALTONE_EDITOR_ADD_LINK_BUTTON');
    },

    filteredFontStyles () {
      const searchValue = this.fontStyleSearch.toLowerCase();
      return this.fontStyles.filter((item) =>
        item.name.toLowerCase().includes(searchValue),
      );
    },

    filteredCategories() {
      return this.variableCategories.filter(
        (category) => this.getFilteredItemsForCategory(category).length,
      );
    },

    colorPickerInput() {
      return document.querySelector('.colorPickerInput');
    },

    isDefaultFontColor() {
      return this.currentFontColor === EDITOR_DEFAULT_FONT_COLOR;
    },

    actionBarBtn () {
      const ref = this.$refs[this.orderedRefs[this.currentButtonRefIndex]][0]?.$refs?.buttonRef // get nested ref
        || this.$refs[this.orderedRefs[this.currentButtonRefIndex]];
      return Array.isArray(ref) ? ref[0] : ref;
    },

  },

  watch: {
    modelValue (newValue) {
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

    insertVariable (categoryName, variableData) {
      // Insert a variable using the custom command from the Variable extension
      this.$refs.richTextEditor?.editor.chain().focus().insertVariable({
        id: variableData.id,
        placeholder: variableData.placeholder || '',
        altText: '',
        enableAltText: variableData.enableAltText,
      }).run();
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

    onTextInput (input) {
      this.$emit('text-input', input);
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
      this.$emit('update:modelValue', event);
    },

    onSelected() {
      this.updateFontColorInput();
    },

    getButtonKey (key, selector) {
      return `${key}-${JSON.stringify(selector)}`;
    },

    // Unique Button Ref Key to identify ref
    getButtonRef (key, selector) {
      return `${this.getButtonKey(key, selector)}-ref`;
    },

    /**
     * Determines if an element in the action bar button list is focusable with tab key
     * @param {string} refKey - unique identifier for the ref element in DOM
     */
    canFocus (refKey) {
      return refKey === this.orderedRefs[this.currentButtonRefIndex];
    },

    shiftActionBarFocusRight () {
      this.shiftButtonRefIndex(1);
    },

    shiftActionBarFocusLeft () {
      this.shiftButtonRefIndex(-1);
    },

    shiftButtonRefIndex (shiftAmount) {
      const previousActionBarBtn = this.actionBarBtn;
      const index = (this.currentButtonRefIndex + shiftAmount) % this.orderedRefs.length;
      this.currentButtonRefIndex = index >= 0 ? index : this.orderedRefs.length + index;
      const currentActionBarBtn = this.actionBarBtn;

      previousActionBarBtn.$el.blur();
      currentActionBarBtn.$el.focus();
    },

    onFontStyleSelect (fontFamily) {
      if (fontFamily) {
        this.$refs.richTextEditor?.editor?.chain().focus().setFontFamily(fontFamily).run();
      } else {
        this.$refs.richTextEditor?.editor?.chain().focus().unsetFontFamily().run();
      }
      this.$refs.richTextEditor?.editor?.commands.focus();
    },

    isCurrentFontFamily (fontFamily) {
      if (!fontFamily) {
        return !this.$refs.richTextEditor?.editor?.getAttributes('textStyle')?.fontFamily;
      }
      return this.$refs.richTextEditor?.editor?.isActive('textStyle', { fontFamily });
    },

    onFontSizeSelect (fontSize) {
      this.$refs.richTextEditor?.editor?.chain().focus().setFontSize(fontSize).run();
      this.$refs.richTextEditor?.editor?.commands.focus();
    },

    isCurrentFontSize (fontSize) {
      if (!fontSize) {
        return !this.$refs.richTextEditor?.editor?.getAttributes('textStyle')?.fontSize;
      }
      return this.$refs.richTextEditor?.editor?.isActive('textStyle', { fontSize });
    },

    getFilteredItemsForCategory(category) {
      const searchValue = this.variableSearchValue.toLowerCase();
      if (category.name.toLowerCase().includes(searchValue)) {
        return category.items;
      }
      return category.items.filter((item) =>
        item.name.toLowerCase().includes(searchValue),
      );
    },

    updateFontColorInput() {
      this.currentFontColor = this.$refs.richTextEditor?.editor?.getAttributes('textStyle')?.color || EDITOR_DEFAULT_FONT_COLOR;
    },

    onColorPickerButtonClick () {
      this.colorPickerInput?.click();
    },

    onColorPickerInput (fontColor) {
      this.$refs.richTextEditor?.editor?.chain().focus().setColor(fontColor).run();
      this.$refs.richTextEditor?.editor?.commands.focus();
      this.updateFontColorInput();
    },
  },
};
</script>

<style>
/* Image resizing classes - only active when allowImageResize is true */

/* Image border */
.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-wrapper] {
  outline: 1px solid var(--dt-color-chart-info-selected);
  line-height: 0 !important;
}

/* Corner handles */
.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-handle] {
  position: absolute;
  background: var(--dt-color-chart-info-selected);
  z-index: 10;
}

.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-handle='top-left'],
.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-handle='top-right'],
.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-handle='bottom-left'],
.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-handle='bottom-right'] {
  width: 8px;
  height: 8px;
}
.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-handle='top-left'] {
  cursor: nwse-resize;
  transform: translate(-50%, -50%);
}
.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-handle='top-right'] {
  cursor: nesw-resize;
  transform: translate(50%, -50%);
}
.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-handle='bottom-left'] {
  cursor: nesw-resize;
  transform: translate(-50%, 50%);
}
.d-recipe-editor__content-image-resize .tiptap .ProseMirror-selectednode [data-resize-handle='bottom-right'] {
  cursor: nwse-resize;
  transform: translate(50%, 50%);
}
</style>
