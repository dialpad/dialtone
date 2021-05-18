<template>
  <div>
    <dt-radio
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      <span>{{ option.label }}</span>
    </dt-radio>
  </div>
</template>

<script>
import { DtRadio } from '../radio';

export default {
  name: 'RadiosDecorator',
  components: { DtRadio },
  created () {
    this.options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Other', value: 'other' },
    ];
  },
};
</script>
