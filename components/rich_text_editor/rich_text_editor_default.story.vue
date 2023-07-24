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
    @blur="$attrs.onBlur"
    @input="$attrs.onInput"
    @focus="$attrs.onFocus"
  />
</template>

<script>
import DtRichTextEditor from './rich_text_editor.vue';

export default {
  name: 'DtRichTextEditorDefault',

  components: {
    DtRichTextEditor,
  },
};
</script>
