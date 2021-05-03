<template>
  <div>
    <hs-radio
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      <span>{{ option.label }}</span>
    </hs-radio>
  </div>
</template>

<script>
import { HsRadio } from '../radio';

export default {
  name: 'RadiosDecorator',
  components: { HsRadio },
  created () {
    this.options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Other', value: 'other' },
    ];
  },
};
</script>
