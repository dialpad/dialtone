<template>
  <div id="forms-checkbox--variants-container">
    <!-- Default -->
    <hs-checkbox
      name="default"
      value="Value"
      label="Default"
    />
    <!-- Default -->

    <!-- With Description -->
    <hs-checkbox
      name="with-description"
      value="Value"
      label="With"
      description="Description"
    />
    <!-- With Description -->

    <!-- With Slotted Label -->
    <hs-checkbox
      name="with-slotted-label"
      value="Value"
    >
      With Slotted Label
    </hs-checkbox>
    <!-- With Slotted Label -->

    <!-- With Slotted Description -->
    <hs-checkbox
      name="with-slotted-description"
      label="With"
      value="Value"
    >
      <template #description>
        Slotted Description
      </template>
    </hs-checkbox>
    <!-- With Slotted Description -->

    <!-- With Slotted Label and Description -->
    <hs-checkbox
      name="with-slotted-label-and-description"
      value="Value"
    >
      With Slotted Label
      <template #description>
        And Slotted Description
      </template>
    </hs-checkbox>
    <!-- With Slotted Label and Description -->

    <!-- Checked -->
    <hs-checkbox
      name="checked"
      value="Value"
      label="Checked"
      checked
    />
    <!-- Checked -->

    <!-- Checked With Description -->
    <hs-checkbox
      name="checked-with-description"
      value="Value"
      label="Checked"
      description="With Description"
      checked
    />
    <!-- Checked With Description -->

    <!-- Success With Description -->
    <hs-checkbox
      name="success-with-description"
      value="Value"
      label="Success"
      description="With Description"
      validation-state="success"
    />
    <!-- Success With Description -->

    <!-- Warning With Description -->
    <hs-checkbox
      name="warning-with-description"
      value="Value"
      label="Warning"
      description="With Description"
      validation-state="warning"
    />
    <!-- Warning With Description -->

    <!-- Error With Description -->
    <hs-checkbox
      name="error-with-description"
      value="Value"
      label="Error"
      description="With Description"
      validation-state="error"
    />
    <!-- Error With Description -->

    <!-- Checked Success With Description -->
    <hs-checkbox
      name="checked-success-with-description"
      value="Value"
      label="Checked Success"
      description="With Description"
      validation-state="success"
      checked
    />
    <!-- Checked Success With Description -->

    <!-- Checked Warning With Description -->
    <hs-checkbox
      name="checked-warning-with-description"
      value="Value"
      label="Checked Warning"
      description="With Description"
      validation-state="warning"
      checked
    />
    <!-- Checked Warning With Description -->

    <!-- Checked Error With Description -->
    <hs-checkbox
      name="checked-error-with-description"
      value="Value"
      label="Checked Error"
      description="With Description"
      validation-state="error"
      checked
    />
    <!-- Checked Error With Description -->

    <!-- Disabled -->
    <hs-checkbox
      name="disabled"
      value="Value"
      label="Disabled"
      disabled
    />
    <!-- Disabled -->

    <!-- Disabled With Description -->
    <hs-checkbox
      name="disabled-with-description"
      value="Value"
      label="Disabled"
      description="With Description"
      disabled
    />
    <!-- Disabled With Description -->

    <!-- Checked and Disabled -->
    <hs-checkbox
      name="checked-disabled"
      value="Value"
      label="Disabled"
      disabled
      checked
    />
    <!-- Checked and Disabled -->

    <!-- Checked and Disabled With Description -->
    <hs-checkbox
      name="checked-disabled-with-description"
      value="Value"
      label="Checked Disabled"
      description="With Description"
      disabled
      checked
    />
    <!-- Checked and Disabled With Description -->

    <!-- Checked and With Description and Success validation message -->
    <hs-checkbox
      name="checked-disabled-with-description"
      value="Value"
      label="Checked Disabled"
      description="With Description"
      :messages="[{ message: 'Success', type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
      checked
    />
    <!-- Checked and Disabled With Description -->
  </div>
</template>

<script>
import HsCheckbox from './checkbox';
import { VALIDATION_MESSAGE_TYPES } from '../constants';

export default {
  name: 'CheckboxVariants',
  components: { HsCheckbox },
  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
