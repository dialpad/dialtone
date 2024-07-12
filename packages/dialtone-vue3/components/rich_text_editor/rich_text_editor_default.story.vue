<template>
  <dt-rich-text-editor
    v-model="value"
    :editable="$attrs.editable"
    :input-aria-label="$attrs.inputAriaLabel"
    :input-class="$attrs.inputClass"
    :output-format="$attrs.outputFormat"
    :auto-focus="$attrs.autoFocus"
    :placeholder="$attrs.placeholder"
    :prevent-typing="$attrs.preventTyping"
    :link="$attrs.link"
    :mention-suggestion="$attrs.mentionSuggestion"
    :channel-suggestion="$attrs.channelSuggestion"
    :slash-command-suggestion="$attrs.slashCommandSuggestion"
    :allow-blockquote="$attrs.allowBlockquote"
    :allow-bold="$attrs.allowBold"
    :allow-bullet-list="$attrs.allowBulletList"
    :allow-codeblock="$attrs.allowCodeblock"
    :allow-italic="$attrs.allowItalic"
    :allow-strike="$attrs.allowStrike"
    :allow-line-breaks="$attrs.allowLineBreaks"
    :allow-underline="$attrs.allowUnderline"
    :additional-extensions="$attrs.additionalExtensions"
    @blur="$attrs.onBlur"
    @input="$attrs.onInput"
    @focus="$attrs.onFocus"
    @enter="$attrs.onEnter"
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
      value: this.$attrs.modelValue,
    };
  },

  watch: {
    '$attrs.modelValue' (value) {
      this.value = value;
    },
  },
};
</script>
