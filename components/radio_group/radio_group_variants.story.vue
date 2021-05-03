<template>
  <div id="forms-radio-group--variants-container">
    <!-- Default -->
    <hs-radio-group
      name="radio-group-default"
      aria-label="default"
    >
      <radios-decorator />
    </hs-radio-group>
    <!-- Default -->

    <!-- With Legend -->
    <hs-radio-group
      name="radio-group-with-legend"
      legend="With Legend"
    >
      <radios-decorator />
    </hs-radio-group>
    <!-- With Legend -->

    <!-- With Slotted Legend -->
    <hs-radio-group name="radio-group-with-slotted-legend">
      <radios-decorator />
      <template #legend>
        With Slotted Legend
      </template>
    </hs-radio-group>
    <!-- With Slotted Legend -->

    <!-- With Value -->
    <hs-radio-group
      name="radio-group-with-value"
      legend="With Value"
      value="banana"
    >
      <radios-decorator />
    </hs-radio-group>
    <!-- With Value -->

    <!-- Disabled -->
    <hs-radio-group
      name="radio-group-disabled"
      legend="Disabled"
      disabled
    >
      <radios-decorator />
    </hs-radio-group>
    <!-- Disabled -->

    <!-- With Success Message -->
    <hs-radio-group
      name="radio-group-with-success-message"
      legend="With Success Message"
      :messages="[{ message: 'Success', type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
    >
      <radios-decorator />
    </hs-radio-group>
    <!-- With Success Message -->

    <!-- With Warning Message -->
    <hs-radio-group
      name="radio-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    >
      <radios-decorator />
    </hs-radio-group>
    <!-- With Warning Message -->

    <!-- With Error Message -->
    <hs-radio-group
      name="radio-group-with-error-message"
      legend="With Error Message"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
    >
      <radios-decorator />
    </hs-radio-group>
    <!-- With Error Message -->

    <!-- With Error Messages Hidden -->
    <hs-radio-group
      name="radio-group-with-error-messages-hidden"
      legend="With Error Messages Hidden"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
      :show-messages="false"
    >
      <radios-decorator />
    </hs-radio-group>
    <!-- With Error Messages Hidden -->
  </div>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '../constants';
import RadiosDecorator from './radios_decorator';
import HsRadioGroup from './radio_group';

export default {
  name: 'RadioGroupVariants',
  components: { RadiosDecorator, HsRadioGroup },
  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
