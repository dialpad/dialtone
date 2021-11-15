<template>
  <dt-input
    :value="value"
    :type="type"
    :messages="messages"
    :size="size"
    :label="label"
    :messages-child-props="messagesChildProps"
    :name="name"
    :disabled="disabled"
    :show-messages="showMessages"
    :messages-class="messagesClass"
    :placeholder="placeholder"
    :input-class="inputClass"
    @blur="onBlur"
    @input="onInput"
    @clear="onClear"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template
      v-if="labelSlot"
      #labelSlot
    >
      <span v-html="labelSlot" />
    </template>
    <template
      v-if="description"
      #description
    >
      <span v-html="description" />
    </template>
    <template
      v-if="leftIcon"
      #leftIcon
    >
      <component :is="leftIcon" />
    </template>
    <template
      v-if="rightIcon"
      #rightIcon
    >
      <component :is="rightIcon" />
    </template>
  </dt-input>
</template>

<script>
import DtInput from './input';
import icon from '../mixins/icon';

export default {
  name: 'InputDefault',
  components: { DtInput },
  mixins: [icon],
};
</script>
