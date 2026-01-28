<template>
  <dt-checkbox-group
    :id="$attrs.id"
    :name="$attrs.name"
    :legend="$attrs.legend"
    :selected-values="$attrs.selectedValues"
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
      <dt-checkbox
        v-for="option in $attrs.options"
        :key="option.value"
        :value="option.value"
      >
        <span>{{ option.label }}</span>
      </dt-checkbox>
    </slot>
    <template
      v-if="$attrs.legendSlot"
      #legend
    >
      <span v-html="$attrs.legendSlot" />
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
