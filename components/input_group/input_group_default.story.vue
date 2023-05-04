<template>
  <dt-input-group
    :id="id"
    v-model="internalValue"
    :name="name"
    :legend="legend"
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
      slot="legend"
    >
      <span v-html="legendSlot" />
    </template>
  </dt-input-group>
</template>

<script>
import InputDecorator from './decorators/input.vue';
import DtInputGroup from './input_group.vue';

export default {
  name: 'InputGroupDefault',

  components: { InputDecorator, DtInputGroup },

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
