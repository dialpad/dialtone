<template>
  <dt-rich-text-editor
    v-model="$attrs.value"
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
    :hide-link-bubble-menu="$attrs.hideLinkBubbleMenu"
    :use-div-tags="$attrs.useDivTags"
    @blur="$attrs.onBlur"
    @input="$attrs.onInput"
    @edit-link="$attrs.onEditLink"
    @json-input="$attrs.onJsonInput"
    @html-input="$attrs.onHtmlInput"
    @text-input="$attrs.onTextInput"
    @selected-command="$attrs.onSelectedCommand"
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
};
</script>
