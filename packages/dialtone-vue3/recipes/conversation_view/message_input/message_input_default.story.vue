<template>
  <div class="d-h264">
    <dt-recipe-message-input
      ref="input"
      v-model="$attrs.modelValue"
      :input-aria-label="$attrs.inputAriaLabel"
      :auto-focus="$attrs.autoFocus"
      :allow-blockquote="$attrs.allowBlockquote"
      :allow-bold="$attrs.allowBold"
      :allow-bullet-list="$attrs.allowBulletList"
      :allow-italic="$attrs.allowItalic"
      :allow-strike="$attrs.allowStrike"
      :allow-underline="$attrs.allowUnderline"
      :editable="$attrs.editable"
      :input-class="$attrs.inputClass"
      :link="$attrs.link"
      :output-format="$attrs.outputFormat"
      :placeholder="$attrs.placeholder"
      :disable-send="$attrs.disableSend"
      :max-height="$attrs.maxHeight"
      :mention-suggestion="$attrs.mentionSuggestion"
      :channel-suggestion="$attrs.channelSuggestion"
      :show-emoji-picker="$attrs.showEmojiPicker"
      :emoji-picker-props="$attrs.emojiPickerProps"
      :emoji-tooltip-message="$attrs.emojiTooltipMessage"
      :emoji-button-aria-label="$attrs.emojiButtonAriaLabel"
      :show-character-limit="$attrs.showCharacterLimit"
      :show-image-picker="$attrs.showImagePicker"
      :show-send="$attrs.showSend"
      :show-cancel="$attrs.showCancel"
      @submit="$attrs.onSubmit"
      @focus="$attrs.onFocus"
      @blur="$attrs.onBlur"
      @input="$attrs.onInput"
      @select-media="$attrs.onSelectMedia"
      @selected-emoji="$attrs.onSelectedEmoji"
      @skin-tone="$attrs.onSkinTone"
      @add-media="$attrs.onAddMedia"
      @paste-media="$attrs.onPasteMedia"
      @notice-close="$attrs.onNoticeClose"
      @cancel="$attrs.onCancel"
      @keydown="$attrs.onHandleKeydown"
    />
  </div>
</template>

<script>
import DtRecipeMessageInput from './message_input.vue';

export default {
  name: 'DtRecipeMessageInputDefault',
  components: { DtRecipeMessageInput },
};
</script>
