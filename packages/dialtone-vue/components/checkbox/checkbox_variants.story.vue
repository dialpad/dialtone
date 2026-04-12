<template>
  <dt-stack
    id="components-checkbox--variants-container"
    gap="100"
  >
    <!-- Default -->
    <dt-checkbox
      name="default"
      value="Value"
      label="Default"
    />
    <!-- Default -->

    <!-- With Description -->
    <dt-checkbox
      name="with-description"
      value="Value"
      label="With"
      description="Description"
    />
    <!-- With Description -->

    <!-- With Slotted Label -->
    <dt-checkbox
      name="with-slotted-label"
      value="Value"
    >
      With Slotted Label
    </dt-checkbox>
    <!-- With Slotted Label -->

    <!-- Without any label/description. -->
    <!-- Note: must have an aria-label if no label is passed either through props/slots -->

    <dt-checkbox
      name="without-label-nor-description"
      aria-label="My aria label"
      value="Value"
    />

    <!-- Without any label/description -->

    <!-- With Slotted Description -->
    <dt-checkbox
      name="with-slotted-description"
      label="With"
      value="Value"
    >
      <template #description>
        Slotted Description
      </template>
    </dt-checkbox>
    <!-- With Slotted Description -->

    <!-- With Slotted Label and Description -->
    <dt-checkbox
      name="with-slotted-label-and-description"
      value="Value"
    >
      With Slotted Label
      <template #description>
        And Slotted Description
      </template>
    </dt-checkbox>
    <!-- With Slotted Label and Description -->

    <!-- Checked -->
    <dt-checkbox
      name="checked"
      value="Value"
      label="Checked"
      checked
    />
    <!-- Checked -->

    <!-- Checked With Description -->
    <dt-checkbox
      name="checked-with-description"
      value="Value"
      label="Checked"
      description="With Description"
      checked
    />
    <!-- Checked With Description -->

    <!-- Indeterminate -->
    <dt-checkbox
      name="indeterminate"
      value="indeterminateValue"
      label="Indeterminate Checkbox"
      indeterminate
    />

    <!-- Indeterminate Disabled -->
    <dt-checkbox
      name="indeterminate-disabled"
      value="indeterminateValue"
      label="Indeterminate Disabled Checkbox"
      indeterminate
      disabled
    />
    <!-- Indeterminate Disabled -->

    <!-- Positive With Description -->
    <dt-checkbox
      name="positive-with-description"
      value="Value"
      label="Positive"
      description="With Description"
      validation-state="positive"
      :messages="[{ message: 'Positive message', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
    />
    <!-- Positive With Description -->

    <!-- Warning With Description -->
    <dt-checkbox
      name="warning-with-description"
      value="Value"
      label="Warning"
      description="With Description"
      validation-state="warning"
      :messages="[{ message: 'Warning message', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    />
    <!-- Warning With Description -->

    <!-- Critical With Description -->
    <dt-checkbox
      name="critical-with-description"
      value="Value"
      label="Critical"
      description="With Description"
      validation-state="critical"
      :messages="[{ message: 'Critical message', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
    />
    <!-- Critical With Description -->

    <!-- Checked Positive With Description -->
    <dt-checkbox
      name="checked-positive-with-description"
      value="Value"
      label="Checked Positive"
      description="With Description"
      validation-state="positive"
      :messages="[{ message: 'Positive message', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
      checked
    />
    <!-- Checked Positive With Description -->

    <!-- Checked Warning With Description -->
    <dt-checkbox
      name="checked-warning-with-description"
      value="Value"
      label="Checked Warning"
      description="With Description"
      validation-state="warning"
      checked
    />
    <!-- Checked Warning With Description -->

    <!-- Checked Critical With Description -->
    <dt-checkbox
      name="checked-critical-with-description"
      value="Value"
      label="Checked Critical"
      description="With Description"
      validation-state="critical"
      :messages="[{ message: 'Critical message', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
      checked
    />
    <!-- Checked Critical With Description -->

    <!-- Disabled -->
    <dt-checkbox
      name="disabled"
      value="Value"
      label="Disabled"
      disabled
    />
    <!-- Disabled -->

    <!-- Disabled With Description -->
    <dt-checkbox
      name="disabled-with-description"
      value="Value"
      label="Disabled"
      description="With Description"
      disabled
    />
    <!-- Disabled With Description -->

    <!-- Checked and Disabled -->
    <dt-checkbox
      name="checked-disabled"
      value="Value"
      label="Disabled"
      disabled
      checked
    />
    <!-- Checked and Disabled -->

    <!-- Checked and Disabled With Description -->
    <dt-checkbox
      name="checked-disabled-with-description"
      value="Value"
      label="Checked Disabled"
      description="With Description"
      disabled
      checked
    />
    <!-- Checked and Disabled With Description -->

    <!-- Checked and With Description and Positive validation message -->
    <dt-checkbox
      name="checked-with-description-and-validation-message"
      value="Value"
      label="Checked"
      description="With Description"
      validation-state="positive"
      :messages="[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
      checked
    />
    <!-- Checked and With Description and Positive validation message -->
  </dt-stack>
</template>

<script>
import DtCheckbox from './checkbox.vue';
import DtStack from '../stack/stack.vue';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';

export default {
  name: 'CheckboxVariants',
  components: { DtCheckbox, DtStack },
  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
