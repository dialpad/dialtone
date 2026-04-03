<template>
  <dt-input
    ref="input"
    v-model="inputValue"
    autocomplete="on"
    :type="$attrs.type"
    :messages="$attrs.messages"
    :size="$attrs.size"
    :label="$attrs.label"
    :messages-child-props="$attrs.messagesChildProps"
    :name="$attrs.name"
    :disabled="$attrs.disabled"
    :show-messages="$attrs.showMessages"
    :messages-class="$attrs.messagesClass"
    :placeholder="$attrs.placeholder"
    :input-class="$attrs.inputClass"
    :retain-warning="$attrs.retainWarning"
    :input-wrapper-class="$attrs.inputWrapperClass"
    :root-class="$attrs.rootClass"
    :current-length="$attrs.currentLength"
    :label-visible="$attrs.labelVisible"
    :hidden="$attrs.hidden"
    :validate="validationConfig"
    @blur="$attrs.onBlur"
    @input="$attrs.onInput"
    @clear="$attrs.onClear"
    @focus="$attrs.onFocus"
    @focusin="$attrs.onFocusIn"
    @focusout="$attrs.onFocusOut"
    @update:length="updateLength"
    @update:invalid="$attrs.onUpdateIsInvalid"
  >
    <template
      v-if="$attrs.labelSlot"
      #labelSlot
    >
      <span v-html="$attrs.labelSlot" />
    </template>
    <template
      v-if="$attrs.description"
      #description
    >
      <span v-html="$attrs.description" />
    </template>
    <template
      v-if="$attrs.startIcon"
      #startIcon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.startIcon"
        :size="iconSize"
      />
    </template>
    <template
      v-if="$attrs.endIcon"
      #endIcon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.endIcon"
        :size="iconSize"
      />
    </template>
  </dt-input>
</template>

<script>
import DtInput from './input.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'InputDefault',

  components: { DtInput, DtIcon },

  inheritAttrs: false,

  data () {
    return {
      inputValue: '',
      inputLength: 0,
    };
  },

  computed: {
    validationMessage () {
      const remainingCharacters = this.$attrs.validate?.length?.max - this.inputLength;

      if (remainingCharacters < 0) {
        return `${Math.abs(remainingCharacters)} characters over limit`;
      } else {
        return `${remainingCharacters} characters left`;
      }
    },

    validationConfig () {
      if (!this?.$attrs?.validate?.length) {
        return null;
      }

      // Deep clone validate object
      const validateConfigData = JSON.parse(JSON.stringify(this.$attrs.validate));

      // Adds validation message
      validateConfigData.length.message = this?.$attrs?.validate?.length?.message
        ? this.$attrs.validate.length.message
        : this.validationMessage;

      return validateConfigData;
    },
  },

  watch: {
    modelValue (val) {
      this.inputValue = val;
    },
  },

  methods: {
    updateLength ($event) {
      this.inputLength = $event;
      this.$attrs.onUpdateLength($event);
    },
  },
};
</script>
