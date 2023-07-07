<template>
  <dt-rich-text-editor
    v-model="inputValue"
    :editable="editable"
    :input-aria-label="inputAriaLabel"
    :input-class="inputClass"
    :output-format="outputFormat"
    :auto-focus="autoFocus"
    :placeholder="placeholder"
    :link="link"
    @blur="onBlur"
    @input="onInput"
    @focus="onFocus"
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
