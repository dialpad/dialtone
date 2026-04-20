<template>
  <dt-stack
    id="components-input-group--variants-container"
    gap="400"
  >
    <!-- Default -->
    <dt-input-group
      name="input-group-default"
      aria-label="default"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- Default -->

    <!-- With Legend -->
    <dt-input-group
      name="input-group-with-legend"
      legend="With Legend"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Legend -->

    <!-- With Slotted Legend -->
    <dt-input-group name="input-group-with-slotted-legend">
      <inputs-decorator />
      <template #legend>
        With Slotted Legend
      </template>
    </dt-input-group>
    <!-- With Slotted Legend -->

    <!-- With Value -->
    <dt-input-group
      name="input-group-with-value"
      legend="With Value"
      value="banana"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Value -->

    <!-- Disabled -->
    <dt-input-group
      name="input-group-disabled"
      legend="Disabled"
      disabled
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- Disabled -->

    <!-- With Positive Message -->
    <dt-input-group
      name="input-group-with-positive-message"
      legend="With Positive Message"
      :messages="[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Positive Message -->

    <!-- With Warning Message -->
    <dt-input-group
      name="input-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Warning Message -->

    <!-- With Critical Message -->
    <dt-input-group
      name="input-group-with-critical-message"
      legend="With Critical Message"
      :messages="[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Critical Message -->

    <!-- With Critical Messages Hidden -->
    <dt-input-group
      name="input-group-with-critical-messages-hidden"
      legend="With Critical Messages Hidden"
      :messages="[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
      :show-messages="false"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Critical Messages Hidden -->
  </dt-stack>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import InputsDecorator from './decorators/inputs.vue';
import DtInputGroup from './input_group.vue';
import DtStack from '../stack/stack.vue';

export default {
  name: 'InputGroupVariants',

  components: { InputsDecorator, DtInputGroup, DtStack },

  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
