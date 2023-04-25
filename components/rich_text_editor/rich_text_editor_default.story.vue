<template>
  <dt-rich-text-editor
    v-model:value="inputValue"
    :editable="editable"
    :input-aria-label="inputAriaLabel"
    :input-class="inputClass"
    :output-format="outputFormat"
    :auto-focus="autoFocus"
    @blur="onBlur"
    @input="onInput"
    @focus="onFocus"
  />
</template>

<script>
import DtRichTextEditor from './rich_text_editor';

export default {
  name: 'DtRichTextEditorDefault',

  components: {
    DtRichTextEditor,
  },

  data () {
    return {
      inputValue: this.modelValue,
    };
  },

  watch: {
    value (val) {
      this.inputValue = val;
    },
  },
};
</script>
