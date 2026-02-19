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
      :link="$attrs.link"
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
      :show-variable-button="showVariableButton"
      :variable-categories="variableCategories"
      :allow-tables="$attrs.allowTables"
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
  name: 'DtRecipeEditorWithVariables',
  components: { DtRecipeEditor },

  data () {
    return {
      modelValue: this.$attrs.modelValue || '<p>Try inserting a variable using the button!</p>',
      showVariableButton: true,
      variableCategories: [
        {
          name: 'Agent',
          items: [
            {
              id: 'agent-first-name',
              name: 'First name',
              placeholder: 'agent first name',
            },
            {
              id: 'agent-last-name',
              name: 'Last name',
              placeholder: 'agent last name',
            },
            {
              id: 'agent-full-name',
              name: 'Full name',
              placeholder: 'agent full name',
            },
            {
              id: 'agent-phone-number',
              name: 'Phone number',
              placeholder: 'agent phone number',
            },
            {
              id: 'agent-email-address',
              name: 'Email address',
              placeholder: 'agent email address',
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
            },
            {
              id: 'company-email-address',
              name: 'Email address',
              placeholder: 'company email address',
            },
            {
              id: 'company-website',
              name: 'Website',
              placeholder: 'company website',
            },
          ],
        },
      ],
    };
  },
};
</script>
