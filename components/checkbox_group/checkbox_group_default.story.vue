<template>
  <hs-checkbox-group
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
      <hs-checkbox
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        <span>{{ option.label }}</span>
      </hs-checkbox>
    </slot>
    <template
      v-if="legendSlot"
      #legend
    >
      <span v-html="legendSlot" />
    </template>
  </hs-checkbox-group>
</template>

<script>
import { HsCheckbox } from '../checkbox';
import HsCheckboxGroup from './checkbox_group';

export default {
  name: 'CheckboxGroupDefault',
  components: { HsCheckbox, HsCheckboxGroup },
};
</script>
