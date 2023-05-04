<template>
  <dt-checkbox-group
    :id="id"
    :name="name"
    :legend="legend"
    :selected-values="selectedValues"
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
      <dt-checkbox
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        <span>{{ option.label }}</span>
      </dt-checkbox>
    </slot>
    <template
      v-if="legendSlot"
      slot="legend"
    >
      <span v-html="legendSlot" />
    </template>
  </dt-checkbox-group>
</template>

<script>
import { DtCheckbox } from '../checkbox';
import DtCheckboxGroup from './checkbox_group.vue';

export default {
  name: 'CheckboxGroupDefault',
  components: { DtCheckbox, DtCheckboxGroup },
};
</script>
