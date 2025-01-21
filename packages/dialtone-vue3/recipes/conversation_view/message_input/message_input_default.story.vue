<template>
  <div class="d-h264">
    <dt-recipe-message-input
      ref="input"
      v-model="$attrs.value"
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
      :prevent-typing="$attrs.preventTyping"
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
      @input="$attrs.onInput"
      @json-input="$attrs.onJsonInput"
      @html-input="$attrs.onHtmlInput"
      @text-input="$attrs.onTextInput"
      @select-media="$attrs.onSelectMedia"
      @selected-emoji="$attrs.onSelectedEmoji"
      @selected-command="$attrs.onSelectedCommand"
      @meeting-pill-close="$attrs.onMeetingPillClose"
      @skin-tone="$attrs.onSkinTone"
      @add-media="$attrs.onAddMedia"
      @paste-media="$attrs.onPasteMedia"
      @notice-close="$attrs.onNoticeClose"
      @cancel="$attrs.onCancel"
    >
      <template
        v-if="$attrs.emojiGiphyPicker"
        #emojiGiphyPicker
      >
        <span v-html="$attrs.emojiGiphyPicker" />
      </template>
      <template
        v-if="$attrs.middle"
        #middle
      >
        <span v-html="$attrs.middle" />
      </template>
      <template
        v-if="$attrs.top"
        #top
      >
        <span v-html="$attrs.top" />
      </template>
      <template
        v-if="$attrs.sendIcon"
        #sendIcon="{ iconSize }"
      >
        <dt-icon
          :name="$attrs.sendIcon"
          :size="iconSize"
        />
      </template>
      <template
        v-if="$attrs.sendButton"
        #sendButton
      >
        <span v-html="$attrs.sendButton" />
      </template>
      <template
        v-if="$attrs.smsCount"
        #smsCount
      >
        <span v-html="$attrs.smsCount" />
      </template>
    </dt-recipe-message-input>
  </div>
</template>

<script>
import DtRecipeMessageInput from './message_input.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeMessageInputDefault',
  components: { DtRecipeMessageInput, DtIcon },
};
</script>
