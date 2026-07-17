<template>
  <dt-stack
    id="components-checkbox-group--variants-container"
    gap="100"
  >
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
      :model-value="['apple', 'other']"
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

    <!-- With Positive Message -->
    <dt-checkbox-group
      name="checkbox-group-with-positive-message"
      legend="With Positive Message"
      :messages="[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Positive Message -->

    <!-- With Warning Message -->
    <dt-checkbox-group
      name="checkbox-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Warning Message -->

    <!-- With Critical Message -->
    <dt-checkbox-group
      name="checkbox-group-with-critical-message"
      legend="With Critical Message"
      :messages="[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Critical Message -->

    <!-- With Critical Messages Hidden -->
    <dt-checkbox-group
      name="checkbox-group-with-critical-messages-hidden"
      legend="With Critical Messages Hidden"
      :messages="[{ message: 'Critical', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
      :show-messages="false"
    >
      <dt-checkboxes-decorator />
    </dt-checkbox-group>
    <!-- With Critical Messages Hidden -->
  </dt-stack>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtCheckboxesDecorator from './CheckboxesDecorator.vue';
import DtCheckboxGroup from './CheckboxGroup.vue';
import DtStack from '../Stack/Stack.vue';

export default {
  name: 'CheckboxGroupVariants',
  components: { DtCheckboxesDecorator, DtCheckboxGroup, DtStack },
  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
