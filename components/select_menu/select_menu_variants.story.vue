<template>
  <div
    id="components-select-menu--variants-container"
    class="d-d-flex d-fd-column d-stack32 d-p32"
  >
    <!-- Default -->
    <dt-select-menu
      id="default"
      name="default"
      label="Default"
      :options="$attrs.options"
    />
    <!-- Default -->

    <!-- With Description -->
    <dt-select-menu
      id="with-description"
      name="with-description"
      label="With"
      description="Description"
      :options="$attrs.options"
    />
    <!-- With Description -->

    <!-- With Slotted Label -->
    <dt-select-menu
      id="with-slotted-label"
      name="with-slotted-label"
      :options="$attrs.options"
    >
      <template #label>
        With Slotted Label
      </template>
    </dt-select-menu>
    <!-- With Slotted Label -->

    <!-- With Slotted Description -->
    <dt-select-menu
      id="with-slotted-description"
      name="with-slotted-description"
      label="With"
      :options="$attrs.options"
    >
      <template #description>
        Slotted Description
      </template>
    </dt-select-menu>
    <!-- With Slotted Description -->

    <!-- With Slotted Options -->
    <dt-select-menu
      id="with-slotted-options"
      name="with-slotted-options"
      label="With Slotted Options"
    >
      <option
        v-for="option in $attrs.options"
        :key="`with-slotted-options-${option.value}`"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </dt-select-menu>
    <!-- With Slotted Options -->

    <!-- With Error Message -->
    <dt-select-menu
      id="with-error-message"
      name="with-error-message"
      label="With Error Message"
      :options="$attrs.options"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
    />
    <!-- With Error Message -->

    <!-- With Error Messages Hidden -->
    <dt-select-menu
      id="with-error-messages-hidden"
      name="with-error-messages-hidden"
      label="With Error Messages Hidden"
      :options="$attrs.options"
      :messages="[{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.ERROR }]"
      :show-messages="false"
    />
    <!-- With Error Messages Hidden -->

    <!-- With Success Message -->
    <dt-select-menu
      id="with-success-message"
      name="with-success-message"
      label="With Success Message"
      :options="$attrs.options"
      :messages="[{ message: 'Success', type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
    />
    <!-- With Success Message -->

    <!-- With Warning Message -->
    <dt-select-menu
      id="with-warning-message"
      name="with-warning-message"
      label="With Warning Message"
      :options="$attrs.options"
      :messages="[{ message: 'Warning', type: VALIDATION_MESSAGE_TYPES.WARNING }]"
    />
    <!-- With Warning Message -->

    <!-- Disabled -->
    <dt-select-menu
      id="disabled"
      name="disabled"
      label="Disabled"
      :options="$attrs.options"
      disabled
    />
    <!-- Disabled -->

    <!-- Extra Small -->
    <dt-select-menu
      id="extra-small"
      name="extra-small"
      label="Extra Small"
      :options="$attrs.options"
      size="xs"
    />
    <!-- Extra Small -->

    <!-- Small -->
    <dt-select-menu
      id="small"
      name="small"
      label="Small"
      :options="$attrs.options"
      size="sm"
    />
    <!-- Small -->

    <!-- Large -->
    <dt-select-menu
      id="large"
      name="large"
      label="Large"
      :options="$attrs.options"
      size="lg"
    />
    <!-- Large -->

    <!-- Extra Large -->
    <dt-select-menu
      id="extra-large"
      name="extra-large"
      label="Extra Large"
      :options="$attrs.options"
      size="xl"
    />
    <!-- Extra Large -->
  </div>
</template>

<script>
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtSelectMenu from './select_menu.vue';

export default {
  name: 'DtSelectMenuVariants',

  components: { DtSelectMenu },

  setup () {
    return {
      VALIDATION_MESSAGE_TYPES,
    };
  },
};
</script>
