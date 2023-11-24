<template>
  <div class="d-h264">
    <dt-recipe-message-input
      ref="input"
      v-model:show-notice="$attrs.showNotice"
      v-model="$attrs.modelValue"
      :input-aria-label="$attrs.inputAriaLabel"
      :auto-focus="$attrs.autoFocus"
      :editable="$attrs.editable"
      :input-class="$attrs.inputClass"
      :link="$attrs.link"
      :output-format="$attrs.outputFormat"
      :placeholder="$attrs.placeholder"
      :disable-send="$attrs.disableSend"
      :has-character-limit="$attrs.hasCharacterLimit"
      :character-limit-count="$attrs.characterLimitCount"
      :character-limit-warning="$attrs.characterLimitWarning"
      :character-limit-warning-message="$attrs.characterLimitWarningMessage"
      :notice-kind="$attrs.noticeKind"
      :notice-message="$attrs.noticeMessage"
      :send-button-aria-label="$attrs.sendButtonAriaLabel"
      :send-tooltip-label="$attrs.sendTooltipLabel"
      :emoji-picker-props="$attrs.emojiPickerProps"
      :emoji-button-aria-label="$attrs.emojiButtonAriaLabel"
      :image-button-aria-label="$attrs.imageButtonAriaLabel"
      :max-height="$attrs.maxHeight"
      :is-edit="$attrs.isEdit"
      :save-changes-button-text="$attrs.saveChangesButtonText"
      :cancel-button-aria-label="$attrs.cancelButtonAriaLabel"
      :cancel-button-text="$attrs.cancelButtonText"
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
    >
      <template
        #footerLeft
      >
        <div class="d-body-small d-fc-muted">
          <b>Dwight</b> is typing...
        </div>
      </template>
      <template
        #footerRight
      >
        <div class="d-body-small d-fc-tertiary">
          <b>Shift</b> + <b>Return</b> to add a new line
        </div>
      </template>
    </dt-recipe-message-input>
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
};
</script>
