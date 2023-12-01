<template>
  <div id="components-input-group--variants-container">
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
      <template slot="legend">
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

    <!-- With Success Message -->
    <dt-input-group
      name="input-group-with-success-message"
      legend="With Success Message"
      :messages="[{ message: 'Success', type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Success Message -->

    <!-- With Warning Message -->
    <dt-input-group
      name="input-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Warning Message -->

    <!-- With Error Message -->
    <dt-input-group
      name="input-group-with-error-message"
      legend="With Error Message"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Error Message -->

    <!-- With Error Messages Hidden -->
    <dt-input-group
      name="input-group-with-error-messages-hidden"
      legend="With Error Messages Hidden"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
      :show-messages="false"
    >
      <inputs-decorator />
    </dt-input-group>
    <!-- With Error Messages Hidden -->
  </div>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import InputsDecorator from './decorators/inputs.vue';
import DtInputGroup from './input_group.vue';

export default {
  name: 'InputGroupVariants',

  components: { InputsDecorator, DtInputGroup },

  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
