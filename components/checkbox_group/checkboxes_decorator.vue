<template>
  <div>
    <dt-checkbox
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      <span>{{ option.label }}</span>
    </dt-checkbox>
  </div>
</template>

<script>
import { DtCheckbox } from '../checkbox';

export default {
  name: 'CheckboxesDecorator',
  components: { DtCheckbox },
  created () {
    this.options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Other', value: 'other' },
    ];
  },
};
</script>
