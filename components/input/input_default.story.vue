<template>
  <dt-input
    ref="input"
    v-model="inputValue"
    :type="type"
    :messages="messages"
    :size="size"
    :icon-size="iconSize"
    :label="label"
    :messages-child-props="messagesChildProps"
    :name="name"
    :disabled="disabled"
    :show-messages="showMessages"
    :messages-class="messagesClass"
    :placeholder="placeholder"
    :input-class="inputClass"
    :input-wrapper-class="inputWrapperClass"
    :current-length="currentLength"
    :validate="validationConfig"
    @blur="onBlur"
    @input="onInput"
    @clear="onClear"
    @focus="onFocus"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @update:length="updateLength"
    @update:invalid="onUpdateIsInvalid"
  >
    <template
      v-if="labelSlot"
      slot="labelSlot"
    >
      <span v-html="labelSlot" />
    </template>
    <template
      v-if="description"
      slot="description"
    >
      <span v-html="description" />
    </template>
    <template
      v-if="leftIcon"
      slot="leftIcon"
    >
      <component :is="leftIcon" />
    </template>
    <template
      v-if="rightIcon"
      slot="rightIcon"
    >
      <component :is="rightIcon" />
    </template>
  </dt-input>
</template>

<script>
import DtInput from './input';
import icon from '@/common/mixins/icon';

export default {
  name: 'InputDefault',

  components: { DtInput },

  mixins: [icon],

  data () {
    return {
      inputValue: '',
      inputLength: 0,
    };
  },

  computed: {
    validationMessage () {
      const remainingCharacters = this.validate?.length?.max - this.inputLength;

      if (remainingCharacters < 0) {
        return `${Math.abs(remainingCharacters)} characters over limit`;
      } else {
        return `${remainingCharacters} characters left`;
      }
    },

    validationConfig () {
      if (!this?.validate?.length) {
        return null;
      }

      // Deep clone validate object
      const validateConfigData = JSON.parse(JSON.stringify(this.validate));

      // Adds validation message
      validateConfigData.length.message = this?.validate?.length?.message
        ? this.validate.length.message
        : this.validationMessage;

      return validateConfigData;
    },
  },

  watch: {
    value (val) {
      this.inputValue = val;
    },
  },

  methods: {
    updateLength ($event) {
      this.inputLength = $event;
      this.onUpdateLength($event);
    },
  },
};
</script>
