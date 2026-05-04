<template>
  <dt-stack
    id="components-radio-group--variants-container"
    gap="100"
  >
    <!-- Default -->
    <dt-radio-group
      name="radio-group-default"
      aria-label="default"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- Default -->

    <!-- With Legend -->
    <dt-radio-group
      name="radio-group-with-legend"
      legend="With Legend"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Legend -->

    <!-- With Slotted Legend -->
    <dt-radio-group name="radio-group-with-slotted-legend">
      <radios-decorator />
      <template #legend>
        With Slotted Legend
      </template>
    </dt-radio-group>
    <!-- With Slotted Legend -->

    <!-- With Value -->
    <dt-radio-group
      name="radio-group-with-value"
      legend="With Value"
      value="banana"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Value -->

    <!-- Disabled -->
    <dt-radio-group
      name="radio-group-disabled"
      legend="Disabled"
      disabled
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- Disabled -->

    <!-- With Positive Message -->
    <dt-radio-group
      name="radio-group-with-positive-message"
      legend="With Positive Message"
      :messages="[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Positive Message -->

    <!-- With Warning Message -->
    <dt-radio-group
      name="radio-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Warning Message -->

    <!-- With Critical Message -->
    <dt-radio-group
      name="radio-group-with-critical-message"
      legend="With Critical Message"
      :messages="[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Critical Message -->

    <!-- With Critical Messages Hidden -->
    <dt-radio-group
      name="radio-group-with-critical-messages-hidden"
      legend="With Critical Messages Hidden"
      :messages="[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
      :show-messages="false"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Critical Messages Hidden -->
  </dt-stack>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import RadiosDecorator from './RadiosDecorator.vue';
import DtRadioGroup from './RadioGroup.vue';
import DtStack from '../stack/stack.vue';

export default {
  name: 'RadioGroupVariants',
  components: { RadiosDecorator, DtRadioGroup, DtStack },
  setup () {
    return {
      VALIDATION_MESSAGE_TYPES,
    };
  },
};
</script>
