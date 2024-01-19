<template>
  <div>
    <dt-recipe-wysiwyg-editor
      ref="wysiwygEditor"
      v-model="value"
      class="d-mb32"
      :input-aria-label="$attrs.inputAriaLabel"
      :auto-focus="$attrs.autoFocus"
      :editable="$attrs.editable"
      :rounded-edges="$attrs.roundedEdges"
      :input-class="$attrs.inputClass"
      :link="$attrs.link"
      :placeholder="$attrs.placeholder"
      :max-height="$attrs.maxHeight"
<<<<<<< HEAD
      :show-add-link="$attrs.showAddLink"
      :cancel-set-link-button="$attrs.cancelSetLinkButton"
      :confirm-set-link-button="$attrs.confirmSetLinkButton"
      :remove-link-button="$attrs.removeLinkButton"
=======
      :set-link-placeholder="$attrs.setLinkPlaceholder"
      :set-link-modal-title="$attrs.setLinkModalTitle"
      :cancel-set-link-button-label="$attrs.cancelSetLinkButtonLabel"
      :confirm-set-link-button-label="$attrs.confirmSetLinkButtonLabel"
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
      :show-bold-button="$attrs.showBoldButton"
      :show-italics-button="$attrs.showItalicsButton"
      :show-strike-button="$attrs.showStrikeButton"
      :show-underline-button="$attrs.showUnderlineButton"
      :show-list-items-button="$attrs.showListItemsButton"
<<<<<<< HEAD
=======
      :show-add-link-button="$attrs.showAddLinkButton"
>>>>>>> 6396f4c8e (feat(wysiwyg-editor, rich-text-editor): add wysiwyg component)
      @focus="$attrs.onFocus"
      @blur="$attrs.onBlur"
      @input="onInput($event)"
    />
    <p><strong>Editor content is:</strong></p>
    <span>{{ value }}</span>
  </div>
</template>

<script>
import DtRecipeWysiwygEditor from './wysiwyg_editor.vue';

export default {
  name: 'DtRecipeWysiwygEditorDefault',
  components: { DtRecipeWysiwygEditor },
  data () {
    return {
      value: this.$attrs.value,
    };
  },

  methods: {
    onInput (updatedInput) {
      this.value = updatedInput;
    },
  },
};
</script>
