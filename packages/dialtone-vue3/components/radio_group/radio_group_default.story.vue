<template>
  <dt-radio-group
    :id="$attrs.id"
    :name="$attrs.name"
    :legend="$attrs.legend"
    :value="$attrs.value"
    :disabled="$attrs.disabled"
    :messages="$attrs.messages"
    :show-messages="$attrs.showMessages"
    :legend-class="$attrs.legendClass"
    :messages-class="$attrs.messagesClass"
    :legend-child-props="$attrs.legendChildProps"
    :messages-child-props="$attrs.messagesChildProps"
    @input="$attrs.onInput"
  >
    <slot>
      <dt-radio
        v-for="option in $attrs.options"
        :key="option.value"
        :value="option.value"
      >
        <span>{{ option.label }}</span>
      </dt-radio>
    </slot>
    <template
      v-if="$attrs.legendSlot"
      #legend
    >
      <span v-html="$attrs.legendSlot" />
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
