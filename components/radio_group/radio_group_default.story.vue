<template>
  <dt-radio-group
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
      <dt-radio
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        <span>{{ option.label }}</span>
      </dt-radio>
    </slot>
    <template
      v-if="legendSlot"
      slot="legend"
    >
      <span v-html="legendSlot" />
    </template>
  </dt-radio-group>
</template>

<script>
import { DtRadio } from '../radio';
import DtRadioGroup from './radio_group.vue';

export default {
  name: 'RadioGroupDefault',
  components: { DtRadio, DtRadioGroup },
};
</script>
