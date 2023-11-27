<!--
  Decorator used for storybook documentation and unit tests.
-->
<template>
  <div>
    <input-decorator
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      <span>{{ option.label }}</span>
    </input-decorator>
  </div>
</template>

<script>
import InputDecorator from './input.vue';

export default {
  name: 'InputsDecorator',

  components: { InputDecorator },

  created () {
    this.options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Other', value: 'other' },
    ];
  },
};
</script>
