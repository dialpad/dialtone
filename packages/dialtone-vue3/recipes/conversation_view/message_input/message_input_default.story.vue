<template>
  <div class="d-h264">
    <dt-recipe-message-input
      ref="input"
      v-model="modelValue"
      :input-aria-label="$attrs.inputAriaLabel"
      :auto-focus="$attrs.autoFocus"
      :editable="$attrs.editable"
      :input-class="$attrs.inputClass"
      :link="$attrs.link"
      :output-format="$attrs.outputFormat"
      :placeholder="$attrs.placeholder"
      :disable-send="$attrs.disableSend"
      :max-height="$attrs.maxHeight"
      :mention-suggestion="$attrs.mentionSuggestion"
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
    />
  </div>
</template>

<script>
import DtRecipeMessageInput from './message_input.vue';

export default {
  name: 'DtRecipeMessageInputDefault',
  components: { DtRecipeMessageInput },
  data () {
    return {
      modelValue: this.$attrs.modelValue,
    };
  },
};
</script>
