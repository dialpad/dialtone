<template>
  <dt-rich-text-editor
    v-model="value"
    :editable="$attrs.editable"
    :input-aria-label="$attrs.inputAriaLabel"
    :input-class="$attrs.inputClass"
    :output-format="$attrs.outputFormat"
    :auto-focus="$attrs.autoFocus"
    :placeholder="$attrs.placeholder"
    :allow-typing="$attrs.allowTyping"
    :link="$attrs.link"
    :mention-suggestion="$attrs.mentionSuggestion"
    :channel-suggestion="$attrs.channelSuggestion"
    :slash-command-suggestion="$attrs.slashCommandSuggestion"
    :paste-rich-text="$attrs.pasteRichText"
    :allow-blockquote="$attrs.allowBlockquote"
    :allow-bold="$attrs.allowBold"
    :allow-bullet-list="$attrs.allowBulletList"
    :allow-code="$attrs.allowCode"
    :allow-codeblock="$attrs.allowCodeblock"
    :allow-italic="$attrs.allowItalic"
    :allow-strike="$attrs.allowStrike"
    :allow-line-breaks="$attrs.allowLineBreaks"
    :allow-underline="$attrs.allowUnderline"
    :additional-extensions="$attrs.additionalExtensions"
    :show-link-bubble-menu="$attrs.showLinkBubbleMenu"
    :preserve-whitespace="$attrs.preserveWhitespace"
    :use-div-tags="$attrs.useDivTags"
    :allow-tables="$attrs.allowTables"
    :custom-link="$attrs.customLink"
    :allow-inline-images="$attrs.allowInlineImages"
    :allow-font-color="$attrs.allowFontColor"
    :allow-background-color="$attrs.allowBackgroundColor"
    :allow-font-size="$attrs.allowFontSize"
    :allow-font-family="$attrs.allowFontFamily"
    :allow-line-height="$attrs.allowLineHeight"
    :allow-variable="$attrs.allowVariable"
    :variable-items="$attrs.variableItems"
    :allow-image-resize="$attrs.allowImageResize"
    @blur="$attrs.onBlur"
    @input="$attrs.onInput"
    @edit-link="$attrs.onEditLink"
    @json-input="$attrs.onJsonInput"
    @html-input="$attrs.onHtmlInput"
    @text-input="$attrs.onTextInput"
    @markdown-input="$attrs.onMarkdownInput"
    @selected-command="$attrs.onSelectedCommand"
    @mention-click="$attrs.onMentionClick"
    @mention-hover="$attrs.onMentionHover"
    @mention-leave="$attrs.onMentionLeave"
    @channel-click="$attrs.onChannelClick"
    @selected="$attrs.onSelected"
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
