<template>
  <dt-rich-text-editor
    v-model="$attrs.inputValue"
    :editable="$attrs.editable"
    :input-aria-label="$attrs.inputAriaLabel"
    :input-class="$attrs.inputClass"
    :output-format="$attrs.outputFormat"
    :auto-focus="$attrs.autoFocus"
    :placeholder="$attrs.placeholder"
    :link="$attrs.link"
    :mention-suggestion="$attrs.mentionSuggestion"
    @blur="$attrs.onBlur"
    @input="$attrs.onInput"
    @focus="$attrs.onFocus"
  />
</template>

<script>
// Temporary solution while we move this to a shared library
import { DtRichTextEditor } from '../../../../packages/dialtone-vue3/components/rich_text_editor';

export default {
  name: 'DtRichTextEditorDefault',

  components: {
    DtRichTextEditor,
  },
};
</script>
