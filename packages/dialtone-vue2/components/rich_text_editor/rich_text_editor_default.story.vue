<template>
  <dt-rich-text-editor
    v-model="inputValue"
    :editable="$attrs.editable"
    :input-aria-label="$attrs.inputAriaLabel"
    :input-class="$attrs.inputClass"
    :output-format="$attrs.outputFormat"
    :auto-focus="$attrs.autoFocus"
    :link="$attrs.link"
    :placeholder="$attrs.placeholder"
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

  data () {
    return {
      inputValue: this.$attrs.value,
    };
  },

  watch: {
    value (val) {
      this.inputValue = val;
    },
  },
};
</script>
