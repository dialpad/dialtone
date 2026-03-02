<template>
  <div>
    <dt-recipe-editor
      ref="editor"
      v-model="modelValue"
      class="d-mb32"
      :input-aria-label="$attrs.inputAriaLabel"
      :auto-focus="$attrs.autoFocus"
      :editable="$attrs.editable"
      :input-class="$attrs.inputClass"
      :placeholder="$attrs.placeholder"
      :max-height="$attrs.maxHeight"
      :show-add-link="$attrs.showAddLink"
      :use-div-tags="$attrs.useDivTags"
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
      :show-font-color-button="$attrs.showFontColorButton"
      :show-font-style-button="$attrs.showFontStyleButton"
      :show-font-size-button="$attrs.showFontSizeButton"
      :show-variable-button="$attrs.showVariableButton"
      :variable-categories="$attrs.variableCategories"
      :font-styles="$attrs.fontStyles"
      :font-sizes="$attrs.fontSizes"
      :allow-tables="$attrs.allowTables"
      :allow-image-resize="$attrs.allowImageResize"
      @focus="$attrs.onFocus"
      @blur="$attrs.onBlur"
      @input="$attrs.onInput"
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
  name: 'DtRecipeEditorDefault',
  components: { DtRecipeEditor },

  data () {
    return {
      modelValue: this.$attrs.modelValue,
    };
  },
};
</script>
