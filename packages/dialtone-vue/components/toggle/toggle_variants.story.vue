<template>
  <div id="components-toggle--variants-container">
    <!-- Unchecked Initially -->
    <dt-toggle
      class="d-mt-75"
      label-class="d-mr-75"
      label="Unchecked Initial"
    >
      Unchecked Initial
    </dt-toggle>

    <!-- Checked Initially -->
    <dt-toggle
      class="d-mt-75"
      label-class="d-mr-75"
      label="Checked Initial"
      :model-value="true"
    >
      Checked Initial
    </dt-toggle>

    <!-- Indeterminate -->
    <dt-toggle
      class="d-mt-75"
      label-class="d-mr-75"
      model-value="mixed"
    >
      Indeterminate
    </dt-toggle>

    <!-- Checked Disabled -->
    <dt-toggle
      class="d-mt-75"
      label-class="d-mr-75"
      :model-value="true"
      :disabled="true"
    >
      Disabled Checked
    </dt-toggle>

    <!-- Unchecked Disabled -->
    <dt-toggle
      class="d-mt-75"
      label-class="d-mr-75"
      :disabled="true"
    >
      Disabled Unchecked
    </dt-toggle>

    <!-- Indeterminate Disabled -->
    <dt-toggle
      class="d-mt-75"
      label-class="d-mr-75"
      model-value="mixed"
      :disabled="true"
    >
      Indeterminate Disabled
    </dt-toggle>

    <!-- With Flex grow -->
    <dt-toggle
      class="d-mt-75"
      label-class="d-d-flex d-fl-grow1"
    >
      With Flex Grow
    </dt-toggle>

    <!-- With Slots -->
    <dt-toggle
      class="d-mt-75"
    >
      <div class="d-mr-75">
        With Slot Label
      </div>
    </dt-toggle>

    <!-- With v-model -->
    <dt-toggle
      v-model="vModelValue"
      class="d-mt-75"
    >
      <div class="d-mr-75">
        With V-Model
      </div>
    </dt-toggle>

    <!-- Without icon -->
    <dt-toggle
      class="d-mt-75"
      label-class="d-mr-75"
      :show-icon="false"
    >
      Without icon
    </dt-toggle>

    <dt-toggle
      class="d-mt-75"
      label-class="d-mr-75"
      label="Small size"
      size="sm"
    >
      Small size
    </dt-toggle>
  </div>
</template>

<script>
import DtToggle from './toggle.vue';

export default {
  name: 'ToggleVariants',
  components: { DtToggle },

  data () {
    return {
      vModelValue: false,
    };
  },
};
</script>
