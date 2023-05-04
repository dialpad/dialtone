<template>
  <div id="components-radio-group--variants-container">
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

    <!-- With Success Message -->
    <dt-radio-group
      name="radio-group-with-success-message"
      legend="With Success Message"
      :messages="[{ message: 'Success', type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Success Message -->

    <!-- With Warning Message -->
    <dt-radio-group
      name="radio-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Warning Message -->

    <!-- With Error Message -->
    <dt-radio-group
      name="radio-group-with-error-message"
      legend="With Error Message"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Error Message -->

    <!-- With Error Messages Hidden -->
    <dt-radio-group
      name="radio-group-with-error-messages-hidden"
      legend="With Error Messages Hidden"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
      :show-messages="false"
    >
      <radios-decorator />
    </dt-radio-group>
    <!-- With Error Messages Hidden -->
  </div>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import RadiosDecorator from './radios_decorator.vue';
import DtRadioGroup from './radio_group.vue';

export default {
  name: 'RadioGroupVariants',
  components: { RadiosDecorator, DtRadioGroup },
  setup () {
    return {
      VALIDATION_MESSAGE_TYPES,
    };
  },
};
</script>
