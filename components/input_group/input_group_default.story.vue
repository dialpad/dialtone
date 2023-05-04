<template>
  <dt-input-group
    :id="$attrs.id"
    :value="internalValue"
    :name="$attrs.name"
    :legend="$attrs.legend"
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
      <input-decorator
        v-for="option in $attrs.options"
        :key="option.value"
        :value="option.value"
      >
        <span>{{ option.label }}</span>
      </input-decorator>
    </slot>
    <template
      v-if="$attrs.legendSlot"
      #legend
    >
      <span v-html="$attrs.legendSlot" />
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
      internalValue: this.$attrs.value,
    };
  },

  watch: {
    value (newValue) {
      this.internalValue = newValue;
    },
  },
};
</script>
