<template>
  <div id="forms-radio--variants-container">
    <!-- Default -->
    <hs-radio
      name="Value"
      value="Value"
      label="Default"
    />
    <!-- Default -->

    <!-- With Description -->
    <hs-radio
      name="ValueWDesc"
      value="Value"
      label="With"
      description="Description"
    />
    <!-- With Description -->

    <!-- With Slotted Label -->
    <hs-radio
      name="ValueWSlot"
      value="Value"
    >
      With Slotted Label
    </hs-radio>
    <!-- With Slotted Label -->

    <!-- With Slotted Description -->
    <hs-radio
      name="ValueWSlottedDescription"
      value="Value"
      label="With"
    >
      <template #description>
        Slotted Description
      </template>
    </hs-radio>
    <!-- With Slotted Description -->

    <!-- With Slotted Label and Description -->
    <hs-radio
      name="ValueWSlottedLabelAndDescription"
      value="Value"
    >
      With Slotted Label
      <template #description>
        And Slotted Description
      </template>
    </hs-radio>
    <!-- With Slotted Label and Description -->

    <!-- Checked -->
    <hs-radio
      name="Checked"
      value="Checked"
      label="Checked"
      checked
    />
    <!-- Checked -->

    <!-- Checked With Description -->
    <hs-radio
      name="CheckedWDesc"
      value="Checked"
      label="Checked"
      description="With Description"
      checked
    />
    <!-- Checked With Description -->

    <!-- Success With Description -->
    <hs-radio
      name="Success"
      value="Validation"
      label="Success"
      description="With Description"
      validation-state="success"
    />
    <!-- Success With Description -->

    <!-- Warning With Description -->
    <hs-radio
      name="Warning"
      value="Validation"
      label="Warning"
      description="With Description"
      validation-state="warning"
    />
    <!-- Warning With Description -->

    <!-- Error With Description -->
    <hs-radio
      name="Error"
      value="Validation"
      label="Error"
      description="With Description"
      validation-state="error"
    />
    <!-- Error With Description -->

    <!-- Checked Warning With Description -->
    <hs-radio
      name="WarningChecked"
      value="Validation"
      label="Warning"
      description="With Description"
      validation-state="warning"
      checked
    />
    <!-- Checked Warning With Description -->

    <!-- Checked Error With Description -->
    <hs-radio
      name="ErrorChecked"
      value="Validation"
      label="Error"
      description="With Description"
      validation-state="error"
      checked
    />
    <!-- Checked Error With Description -->

    <!-- Checked Success With Description -->
    <hs-radio
      name="SuccessChecked"
      value="Validation"
      label="Success"
      description="With Description"
      validation-state="success"
      checked
    />
    <!-- Checked Success With Description -->

    <!-- Disabled -->
    <hs-radio
      name="Disabled"
      value="Disabled"
      label="Disabled"
      disabled
    />
    <!-- Disabled -->

    <!-- Disabled With Description -->
    <hs-radio
      name="DisabledWDesc"
      value="Disabled"
      label="Disabled"
      description="With Description"
      disabled
    />
    <!-- Disabled With Description -->

    <!-- Disabled and Checked -->
    <hs-radio
      name="CheckedDisabled"
      value="Checked"
      label="Disabled & Checked"
      checked
      disabled
    />
    <!-- Disabled and Checked -->

    <!-- Disabled and Checked With Description -->
    <hs-radio
      name="CheckedDisabledWDesc"
      value="Checked"
      label="Disabled & Checked"
      description="With Description"
      checked
      disabled
    />
    <!-- Disabled and Checked With Description -->

    <!-- Checked Success With Messages -->
    <hs-radio
      name="ValidationMessageSuccess"
      value="Validation Message Success"
      label="Validation Message Success"
      validation-state="success"
      :messages="[{ message: 'Success', type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
      checked
    />
    <!-- Checked With Messages -->
  </div>
</template>

<script>
import HsRadio from './radio';
import fixDefaultSlot from '../plugins/fixDefaultSlot';
import { VALIDATION_MESSAGE_TYPES } from '../constants';

export default {
  name: 'RadioVariants',
  components: { HsRadio },
  mixins: [fixDefaultSlot],
  created () {
    this.VALIDATION_MESSAGE_TYPES = VALIDATION_MESSAGE_TYPES;
  },
};
</script>
