<template>
  <div id="components-checkbox-group--variants-container">
    <!-- Default -->
    <dt-checkbox-group
      name="checkbox-group-default"
      aria-label="default"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- Default -->

    <!-- With Legend -->
    <dt-checkbox-group
      name="checkbox-group-with-legend"
      legend="With Legend"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Legend -->

    <!-- With Slotted Legend -->
    <dt-checkbox-group name="checkbox-group-with-slotted-legend">
      <dt-checkboxes-decorator />
      <template #legend>
        With Slotted Legend
      </template>
    </dt-checkbox-group>
    <!-- With Slotted Legend -->

    <!-- With Selected Values -->
    <dt-checkbox-group
      name="checkbox-group-with-selected-values"
      legend="With Selected Values"
      :selected-values="['apple', 'other']"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Selected Values -->

    <!-- Disabled -->
    <dt-checkbox-group
      name="checkbox-group-disabled"
      legend="Disabled"
      disabled
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- Disabled -->

    <!-- With Success Message -->
    <dt-checkbox-group
      name="checkbox-group-with-success-message"
      legend="With Success Message"
      :messages="[{ message: 'Success', type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Success Message -->

    <!-- With Warning Message -->
    <dt-checkbox-group
      name="checkbox-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Warning Message -->

    <!-- With Error Message -->
    <dt-checkbox-group
      name="checkbox-group-with-error-message"
      legend="With Error Message"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Error Message -->

    <!-- With Error Messages Hidden -->
    <dt-checkbox-group
      name="checkbox-group-with-error-messages-hidden"
      legend="With Error Messages Hidden"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
      :show-messages="false"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Error Messages Hidden -->
  </div>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtCheckboxesDecorator from './checkboxes_decorator.vue';
import DtCheckboxGroup from './checkbox_group.vue';

export default {
  name: 'CheckboxGroupVariants',
  components: { DtCheckboxesDecorator, DtCheckboxGroup },
  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
