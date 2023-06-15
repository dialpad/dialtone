<template>
  <div class="d-h264">
    <dt-recipe-message-input
      :input-aria-label="$attrs.inputAriaLabel"
      :auto-focus="$attrs.autoFocus"
      :editable="$attrs.editable"
      :input-class="$attrs.inputClass"
      :link="$attrs.link"
      :output-format="$attrs.outputFormat"
      :placeholder="$attrs.placeholder"
      :value="$attrs.value"
      :disable-send="$attrs.disableSend"
      :has-character-limit="$attrs.hasCharacterLimit"
      :character-limit-count="$attrs.characterLimitCount"
      :character-limit-warning="$attrs.characterLimitWarning"
      :emoji-tab-set-labels="$attrs.emojiTabSetLabels"
      :emoji-skin-selector-button-tooltip-label="$attrs.emojiSkinSelectorButtonTooltipLabel"
      :emoji-search-no-results-label="$attrs.emojiSearchNoResultsLabel"
      :emoji-search-results-label="$attrs.emojiSearchResultsLabel"
      :emoji-search-placeholder-label="$attrs.emojiSearchPlaceholderLabel"
      :send-button-aria-label="$attrs.sendButtonAriaLabel"
      :emoji-button-aria-label="$attrs.emojiButtonAriaLabel"
      :image-button-aria-label="$attrs.imageButtonAriaLabel"
      @submit="$attrs.onSubmit"
      @focus="$attrs.onFocus"
      @blur="$attrs.onBlur"
      @input="$attrs.onInput"
    >
      <template
        #footerLeft
      >
        <div class="d-fc-100 d-fc-muted">
          <b>Dwight</b> is typing...
        </div>
      </template>
      <template
        #footerRight
      >
        <div class="d-fc-100 d-fc-tertiary">
          <b>Shift</b> + <b>Return</b> to add a new line
        </div>
      </template>
    </dt-recipe-message-input>
  </div>
</template>

<script>
import DtRecipeMessageInput from './message_input.vue';

export default {
  name: 'DtRecipeMessageInputDefault',
  components: { DtRecipeMessageInput },
};
</script>
