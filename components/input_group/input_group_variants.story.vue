<template>
  <div id="forms-input-group--variants-container">
    <!-- Default -->
    <hs-input-group
      name="input-group-default"
      aria-label="default"
    >
      <inputs-decorator />
    </hs-input-group>
    <!-- Default -->

    <!-- With Legend -->
    <hs-input-group
      name="input-group-with-legend"
      legend="With Legend"
    >
      <inputs-decorator />
    </hs-input-group>
    <!-- With Legend -->

    <!-- With Slotted Legend -->
    <hs-input-group name="input-group-with-slotted-legend">
      <inputs-decorator />
      <template #legend>
        With Slotted Legend
      </template>
    </hs-input-group>
    <!-- With Slotted Legend -->

    <!-- With Value -->
    <hs-input-group
      name="input-group-with-value"
      legend="With Value"
      value="banana"
    >
      <inputs-decorator />
    </hs-input-group>
    <!-- With Value -->

    <!-- Disabled -->
    <hs-input-group
      name="input-group-disabled"
      legend="Disabled"
      disabled
    >
      <inputs-decorator />
    </hs-input-group>
    <!-- Disabled -->

    <!-- With Success Message -->
    <hs-input-group
      name="input-group-with-success-message"
      legend="With Success Message"
      :messages="[{ message: 'Success', type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
    >
      <inputs-decorator />
    </hs-input-group>
    <!-- With Success Message -->

    <!-- With Warning Message -->
    <hs-input-group
      name="input-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    >
      <inputs-decorator />
    </hs-input-group>
    <!-- With Warning Message -->

    <!-- With Error Message -->
    <hs-input-group
      name="input-group-with-error-message"
      legend="With Error Message"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
    >
      <inputs-decorator />
    </hs-input-group>
    <!-- With Error Message -->

    <!-- With Error Messages Hidden -->
    <hs-input-group
      name="input-group-with-error-messages-hidden"
      legend="With Error Messages Hidden"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
      :show-messages="false"
    >
      <inputs-decorator />
    </hs-input-group>
    <!-- With Error Messages Hidden -->
  </div>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '../constants';
import InputsDecorator from './decorators/inputs';
import HsInputGroup from './input_group';

export default {
  name: 'InputGroupVariants',

  components: { InputsDecorator, HsInputGroup },

  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
