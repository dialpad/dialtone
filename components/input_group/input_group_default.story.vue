<template>
  <hs-input-group
    :id="id"
    :name="name"
    :legend="legend"
    :disabled="disabled"
    :messages="messages"
    :show-messages="showMessages"
    :legend-class="legendClass"
    :messages-class="messagesClass"
    :legend-child-props="legendChildProps"
    :messages-child-props="messagesChildProps"
    v-model="internalValue"
    @input="onInput"
  >
    <slot>
      <input-decorator
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        <span>{{ option.label }}</span>
      </input-decorator>
    </slot>
    <template
      v-if="legendSlot"
      #legend
    >
      <span v-html="legendSlot" />
    </template>
  </hs-input-group>
</template>

<script>
import InputDecorator from './decorators/input';
import HsInputGroup from './input_group';

export default {
  name: 'InputGroupDefault',

  components: { InputDecorator, HsInputGroup },

  data () {
    return {
      internalValue: this.value,
    };
  },

  watch: {
    value (newValue) {
      this.internalValue = newValue;
    },
  },
};
</script>
