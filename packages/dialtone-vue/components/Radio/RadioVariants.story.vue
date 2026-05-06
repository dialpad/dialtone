<template>
  <dt-stack
    id="components-radio--variants-container"
    gap="100"
  >
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

    <!-- Positive With Description -->
    <dt-radio
      name="Positive"
      value="Validation"
      label="Positive"
      description="With Description"
      validation-state="positive"
      :messages="[{ message: 'Positive message', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
    />
    <!-- Positive With Description -->

    <!-- Warning With Description -->
    <dt-radio
      name="Warning"
      value="Validation"
      label="Warning"
      description="With Description"
      validation-state="warning"
      :messages="[{ message: 'Warning message', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    />
    <!-- Warning With Description -->

    <!-- Critical With Description -->
    <dt-radio
      name="Critical"
      value="Validation"
      label="Critical"
      description="With Description"
      validation-state="critical"
      :messages="[{ message: 'Critical message', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
    />
    <!-- Critical With Description -->

    <!-- Checked Warning With Description -->
    <dt-radio
      name="WarningChecked"
      value="Validation"
      label="Warning"
      description="With Description"
      validation-state="warning"
      :messages="[{ message: 'Warning message', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
      checked
    />
    <!-- Checked Warning With Description -->

    <!-- Checked Critical With Description -->
    <dt-radio
      name="CriticalChecked"
      value="Validation"
      label="Critical"
      description="With Description"
      validation-state="critical"
      :messages="[{ message: 'Critical message', type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
      checked
    />
    <!-- Checked Critical With Description -->

    <!-- Checked Positive With Description -->
    <dt-radio
      name="PositiveChecked"
      value="Validation"
      label="Positive"
      description="With Description"
      validation-state="positive"
      :messages="[{ message: 'Positive message', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
      checked
    />
    <!-- Checked Positive With Description -->

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

    <!-- Checked Positive With Messages -->
    <dt-radio
      name="ValidationMessagePositive"
      value="Validation Message Positive"
      label="Validation Message Positive"
      validation-state="positive"
      :messages="[{ message: 'Positive', type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
      checked
    />
    <!-- Checked With Messages -->
  </dt-stack>
</template>

<script>
import DtRadio from './Radio.vue';
import DtStack from '../Stack/Stack.vue';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';

export default {
  name: 'RadioVariants',
  components: { DtRadio, DtStack },
  setup () {
    return {
      VALIDATION_MESSAGE_TYPES,
    };
  },
};
</script>
