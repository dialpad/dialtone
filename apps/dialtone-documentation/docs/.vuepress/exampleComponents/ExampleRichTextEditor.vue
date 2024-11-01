<template>
  <dt-rich-text-editor
    v-model="value"
    :editable="true"
    input-aria-label="this is a descriptive label"
    :input-class="$attrs.inputClass"
    :output-format="$attrs.outputFormat"
    :auto-focus="false"
    placeholder="Type here..."
    :prevent-typing="$attrs.preventTyping"
    :link="true"
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
export default {
  name: 'ExampleRichTextEditor',

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
