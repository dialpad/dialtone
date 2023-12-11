<template>
  <div class="d-h264">
    <!-- <dt-notice
      v-if="showNotice"
      data-qa="dt-message-input-error-notice"
      :class="noticeClasses"
      :kind="noticeKind"
      :close-button-props="computedCloseButtonProps"
      @close="noticeClose"
    >
      {{ noticeMessage }}
      <template #icon>
        <dt-icon
          size="300"
          name="alert-circle"
        />
      </template>
    </dt-notice> -->
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
      @notice-close="$attrs.onNoticeClose"
      @cancel="$attrs.onCancel"
    />
  </div>

  <button @click="$refs.input.focus()">
    focus test
  </button>
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
