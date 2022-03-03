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
};
</script>
