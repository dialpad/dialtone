<template>
  <div>
    <hs-checkbox
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      <span>{{ option.label }}</span>
    </hs-checkbox>
  </div>
</template>

<script>
import { HsCheckbox } from '../checkbox';

export default {
  name: 'CheckboxesDecorator',
  components: { HsCheckbox },
  created () {
    this.options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Other', value: 'other' },
    ];
  },
};
</script>
