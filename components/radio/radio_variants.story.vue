<template>
  <div id="components-radio--variants-container">
    <!-- Default -->
    <dt-radio
      name="Value"
      value="Value"
      label="Default"
    />
    <!-- Default -->

    <!-- With Description -->
    <dt-radio
      name="ValueWDesc"
      value="Value"
      label="With"
      description="Description"
    />
    <!-- With Description -->

    <!-- With Slotted Label -->
    <dt-radio
      name="ValueWSlot"
      value="Value"
    >
      With Slotted Label
    </dt-radio>
    <!-- With Slotted Label -->

    <!-- With Slotted Description -->
    <dt-radio
      name="ValueWSlottedDescription"
      value="Value"
      label="With"
    >
      <template #description>
        Slotted Description
      </template>
    </dt-radio>
    <!-- With Slotted Description -->

    <!-- With Slotted Label and Description -->
    <dt-radio
      name="ValueWSlottedLabelAndDescription"
      value="Value"
    >
      With Slotted Label
      <template #description>
        And Slotted Description
      </template>
    </dt-radio>
    <!-- With Slotted Label and Description -->

    <!-- Checked -->
    <dt-radio
      name="Checked"
      value="Checked"
      label="Checked"
      checked
    />
    <!-- Checked -->

    <!-- Checked With Description -->
    <dt-radio
      name="CheckedWDesc"
      value="Checked"
      label="Checked"
      description="With Description"
      checked
    />
    <!-- Checked With Description -->

    <!-- Success With Description -->
    <dt-radio
      name="Success"
      value="Validation"
      label="Success"
      description="With Description"
      validation-state="success"
    />
    <!-- Success With Description -->

    <!-- Warning With Description -->
    <dt-radio
      name="Warning"
      value="Validation"
      label="Warning"
      description="With Description"
      validation-state="warning"
    />
    <!-- Warning With Description -->

    <!-- Error With Description -->
    <dt-radio
      name="Error"
      value="Validation"
      label="Error"
      description="With Description"
      validation-state="error"
    />
    <!-- Error With Description -->

    <!-- Checked Warning With Description -->
    <dt-radio
      name="WarningChecked"
      value="Validation"
      label="Warning"
      description="With Description"
      validation-state="warning"
      checked
    />
    <!-- Checked Warning With Description -->

    <!-- Checked Error With Description -->
    <dt-radio
      name="ErrorChecked"
      value="Validation"
      label="Error"
      description="With Description"
      validation-state="error"
      checked
    />
    <!-- Checked Error With Description -->

    <!-- Checked Success With Description -->
    <dt-radio
      name="SuccessChecked"
      value="Validation"
      label="Success"
      description="With Description"
      validation-state="success"
      checked
    />
    <!-- Checked Success With Description -->

    <!-- Disabled -->
    <dt-radio
      name="Disabled"
      value="Disabled"
      label="Disabled"
      disabled
    />
    <!-- Disabled -->

    <!-- Disabled With Description -->
    <dt-radio
      name="DisabledWDesc"
      value="Disabled"
      label="Disabled"
      description="With Description"
      disabled
    />
    <!-- Disabled With Description -->

    <!-- Disabled and Checked -->
    <dt-radio
      name="CheckedDisabled"
      value="Checked"
      label="Disabled & Checked"
      checked
      disabled
    />
    <!-- Disabled and Checked -->

    <!-- Disabled and Checked With Description -->
    <dt-radio
      name="CheckedDisabledWDesc"
      value="Checked"
      label="Disabled & Checked"
      description="With Description"
      checked
      disabled
    />
    <!-- Disabled and Checked With Description -->

    <!-- Checked Success With Messages -->
    <dt-radio
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
import DtRadio from './radio.vue';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';

export default {
  name: 'RadioVariants',
  components: { DtRadio },
  setup () {
    return {
      VALIDATION_MESSAGE_TYPES,
    };
  },
};
</script>
