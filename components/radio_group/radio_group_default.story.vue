<template>
  <hs-radio-group
    :id="id"
    :name="name"
    :legend="legend"
    :value="value"
    :disabled="disabled"
    :messages="messages"
    :show-messages="showMessages"
    :legend-class="legendClass"
    :messages-class="messagesClass"
    :legend-child-props="legendChildProps"
    :messages-child-props="messagesChildProps"
    @input="onInput"
  >
    <slot>
      <hs-radio
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        <span>{{ option.label }}</span>
      </hs-radio>
    </slot>
    <template
      v-if="legendSlot"
      #legend
    >
      <span v-html="legendSlot" />
    </template>
  </hs-radio-group>
</template>

<script>
import { HsRadio } from '../radio';
import HsRadioGroup from './radio_group';

export default {
  name: 'RadioGroupDefault',
  components: { HsRadio, HsRadioGroup },
};
</script>
