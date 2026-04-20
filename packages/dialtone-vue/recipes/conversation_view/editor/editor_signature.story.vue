<template>
  <div>
    <dt-recipe-editor
      ref="editor"
      v-model="modelValue"
      class="d-mbe-400"
      :input-aria-label="$attrs.inputAriaLabel"
      :auto-focus="$attrs.autoFocus"
      :editable="$attrs.editable"
      :input-class="$attrs.inputClass"
      :placeholder="$attrs.placeholder"
      :max-height="$attrs.maxHeight"
      :show-add-link="$attrs.showAddLink"
      :preserve-whitespace="preserveWhitespace"
      :use-div-tags="useDivTags"
      :show-bold-button="$attrs.showBoldButton"
      :show-italics-button="$attrs.showItalicsButton"
      :show-strike-button="$attrs.showStrikeButton"
      :show-underline-button="$attrs.showUnderlineButton"
      :show-list-items-button="$attrs.showListItemsButton"
      :show-ordered-list-button="$attrs.showOrderedListButton"
      :show-align-left-button="$attrs.showAlignLeftButton"
      :show-align-center-button="$attrs.showAlignCenterButton"
      :show-align-right-button="$attrs.showAlignRightButton"
      :show-align-justify-button="$attrs.showAlignJustifyButton"
      :show-quote-button="$attrs.showQuoteButton"
      :show-quick-replies-button="$attrs.showQuickRepliesButton"
      :show-code-block-button="$attrs.showCodeBlockButton"
      :show-inline-image-button="$attrs.showInlineImageButton"
      :show-font-color-button="showFontColorButton"
      :show-font-style-button="showFontStyleButton"
      :show-font-size-button="showFontSizeButton"
      :allow-background-color="allowBackgroundColor"
      :allow-line-height="allowLineHeight"
      :show-variable-button="showVariableButton"
      :variable-categories="variableCategories"
      :allow-tables="allowTables"
      :allow-image-resize="allowImageResize"
      @focus="$attrs.onFocus"
      @blur="$attrs.onBlur"
      @update:model-value="$attrs['onUpdate:modelValue']"
      @quick-replies-click="$attrs.onQuickRepliesClick"
      @inline-image-click="$attrs.onInlineImageClick"
      @text-input="$attrs.onTextInput"
    />
    <p><strong>Editor content is:</strong></p>
    <span>{{ modelValue }}</span>
  </div>
</template>

<script>
import DtRecipeEditor from './editor.vue';

export default {
  name: 'DtRecipeEditorSignature',
  components: { DtRecipeEditor },

  data () {
    return {
      modelValue: this.$attrs.modelValue || '<p>Try inserting a variable using the button!</p>',
      showVariableButton: this.$attrs.showVariableButton ?? true,
      allowImageResize: this.$attrs.allowImageResize ?? true,
      showFontColorButton: this.$attrs.showFontColorButton ?? true,
      showFontStyleButton: this.$attrs.showFontStyleButton ?? true,
      showFontSizeButton: this.$attrs.showFontSizeButton ?? true,
      allowBackgroundColor: this.$attrs.allowBackgroundColor ?? true,
      allowLineHeight: this.$attrs.allowLineHeight ?? true,
      useDivTags: this.$attrs.useDivTags ?? true,
      allowTables: this.$attrs.allowTables ?? true,
      preserveWhitespace: this.$attrs.preserveWhitespace ?? false,
      variableCategories: this.$attrs.variableCategories ?? [
        {
          name: 'Agent',
          items: [
            {
              id: 'agent-first-name',
              name: 'First name',
              placeholder: 'agent first name',
              enableAltText: true,
            },
            {
              id: 'agent-last-name',
              name: 'Last name',
              placeholder: 'agent last name',
              enableAltText: true,
            },
            {
              id: 'agent-full-name',
              name: 'Full name',
              placeholder: 'agent full name',
              enableAltText: true,
            },
            {
              id: 'agent-phone-number',
              name: 'Phone number',
              placeholder: 'agent phone number',
              enableAltText: true,
            },
            {
              id: 'agent-email-address',
              name: 'Email address',
              placeholder: 'agent email address',
              enableAltText: true,
            },
          ],
        },
        {
          name: 'Company',
          items: [
            {
              id: 'company-name',
              name: 'Name',
              placeholder: 'company name',
              enableAltText: true,
            },
            {
              id: 'company-email-address',
              name: 'Email address',
              placeholder: 'company email address',
              enableAltText: false,
            },
            {
              id: 'company-website',
              name: 'Website',
              placeholder: 'company website',
              enableAltText: true,
            },
          ],
        },
      ],
    };
  },
};
</script>
