<template>
  <div id="forms-checkbox-group--variants-container">
    <!-- Default -->
    <hs-checkbox-group
      name="checkbox-group-default"
      aria-label="default"
    >
      <hs-checkboxes-decorator />
    </hs-checkbox-group>
    <!-- Default -->

    <!-- With Legend -->
    <hs-checkbox-group
      name="checkbox-group-with-legend"
      legend="With Legend"
    >
      <hs-checkboxes-decorator />
    </hs-checkbox-group>
    <!-- With Legend -->

    <!-- With Slotted Legend -->
    <hs-checkbox-group name="checkbox-group-with-slotted-legend">
      <hs-checkboxes-decorator />
      <template #legend>
        With Slotted Legend
      </template>
    </hs-checkbox-group>
    <!-- With Slotted Legend -->

    <!-- With Selected Values -->
    <hs-checkbox-group
      name="checkbox-group-with-selected-values"
      legend="With Selected Values"
      :selected-values="['apple', 'other']"
    >
      <hs-checkboxes-decorator />
    </hs-checkbox-group>
    <!-- With Selected Values -->

    <!-- Disabled -->
    <hs-checkbox-group
      name="checkbox-group-disabled"
      legend="Disabled"
      disabled
    >
      <hs-checkboxes-decorator />
    </hs-checkbox-group>
    <!-- Disabled -->

    <!-- With Success Message -->
    <hs-checkbox-group
      name="checkbox-group-with-success-message"
      legend="With Success Message"
      :messages="[{ message: 'Success', type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
    >
      <hs-checkboxes-decorator />
    </hs-checkbox-group>
    <!-- With Success Message -->

    <!-- With Warning Message -->
    <hs-checkbox-group
      name="checkbox-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    >
      <hs-checkboxes-decorator />
    </hs-checkbox-group>
    <!-- With Warning Message -->

    <!-- With Error Message -->
    <hs-checkbox-group
      name="checkbox-group-with-error-message"
      legend="With Error Message"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
    >
      <hs-checkboxes-decorator />
    </hs-checkbox-group>
    <!-- With Error Message -->

    <!-- With Error Messages Hidden -->
    <hs-checkbox-group
      name="checkbox-group-with-error-messages-hidden"
      legend="With Error Messages Hidden"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
      :show-messages="false"
    >
      <hs-checkboxes-decorator />
    </hs-checkbox-group>
    <!-- With Error Messages Hidden -->
  </div>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '../constants';
import HsCheckboxesDecorator from './checkboxes_decorator';
import HsCheckboxGroup from './checkbox_group';

export default {
  name: 'CheckboxGroupVariants',
  components: { HsCheckboxesDecorator, HsCheckboxGroup },
  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
