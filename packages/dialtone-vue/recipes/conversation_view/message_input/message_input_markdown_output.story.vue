<template>
  <div>
    <div>
      <dt-recipe-message-input
        ref="input"
        v-model="value"
        :input-aria-label="$attrs.inputAriaLabel"
        :auto-focus="$attrs.autoFocus"
        :rich-text="$attrs.richText"
        :bold-button-options="$attrs.boldButtonOptions"
        :italic-button-options="$attrs.italicButtonOptions"
        :strike-button-options="$attrs.strikeButtonOptions"
        :link-button-options="$attrs.linkButtonOptions"
        :ordered-list-button-options="$attrs.orderedListButtonOptions"
        :block-quote-button-options="$attrs.blockQuoteButtonOptions"
        :code-button-options="$attrs.codeButtonOptions"
        :code-block-button-options="$attrs.codeBlockButtonOptions"
        :editable="$attrs.editable"
        :allow-typing="$attrs.allowTyping"
        :input-class="$attrs.inputClass"
        :output-format="$attrs.outputFormat"
        :placeholder="$attrs.placeholder"
        :disable-send="$attrs.disableSend"
        :max-height="$attrs.maxHeight"
        :mention-suggestion="$attrs.mentionSuggestion"
        :channel-suggestion="$attrs.channelSuggestion"
        :slash-command-suggestion="$attrs.slashCommandSuggestion"
        :show-emoji-picker="$attrs.showEmojiPicker"
        :emoji-picker-props="$attrs.emojiPickerProps"
        :emoji-tooltip-message="$attrs.emojiTooltipMessage"
        :emoji-button-aria-label="$attrs.emojiButtonAriaLabel"
        :show-character-limit="$attrs.showCharacterLimit"
        :show-image-picker="$attrs.showImagePicker"
        :show-send="$attrs.showSend"
        :show-cancel="$attrs.showCancel"
        :confirm-set-link-button="$attrs.confirmSetLinkButton"
        :remove-link-button="$attrs.removeLinkButton"
        :cancel-set-link-button="$attrs.cancelSetLinkButton"
        :set-link-placeholder="$attrs.setLinkPlaceholder"
        @submit="$attrs.onSubmit"
        @focus="$attrs.onFocus"
        @blur="$attrs.onBlur"
        @update:model-value="$attrs['onUpdate:modelValue']"
        @json-input="$attrs.onJsonInput"
        @html-input="$attrs.onHtmlInput"
        @text-input="$attrs.onTextInput"
        @markdown-input="onMarkdownInput"
        @add-emoji="$attrs.onAddEmoji"
        @mention-click="$attrs.onMentionClick"
        @channel-click="$attrs.onChannelClick"
        @select-media="$attrs.onSelectMedia"
        @selected-emoji="$attrs.onSelectedEmoji"
        @selected-command="$attrs.onSelectedCommand"
        @meeting-pill-close="$attrs.onMeetingPillClose"
        @skin-tone="$attrs.onSkinTone"
        @add-media="$attrs.onAddMedia"
        @paste-media="$attrs.onPasteMedia"
        @notice-close="$attrs.onNoticeClose"
        @cancel="$attrs.onCancel"
        @emoji-scroll-bottom-reached="$attrs.onEmojiScrollBottomReached"
      />
    </div>
    <div class="d-mbs-200">
      <p class="d-label--base d-mbe-50">
        Markdown output
      </p>
      <!-- eslint-disable-next-line max-len -->
      <pre class="d-p-100 d-bgc-sunken d-fc-primary d-bar-300 d-of-auto d-ff-mono d-fs-100 d-ws-pre-wrap">{{ markdownOutput }}</pre>
    </div>
  </div>
</template>

<script>
import DtRecipeMessageInput from './message_input.vue';

export default {
  name: 'DtRecipeMessageInputMarkdownOutput',
  components: { DtRecipeMessageInput },
  data () {
    return {
      value: this.$attrs.modelValue,
      markdownOutput: '',
    };
  },

  watch: {
    '$attrs.modelValue' (value) {
      this.value = value;
    },
  },

  methods: {
    onMarkdownInput (value) {
      this.markdownOutput = value;
      this.$attrs.onMarkdownInput?.(value);
    },
  },
};
</script>
