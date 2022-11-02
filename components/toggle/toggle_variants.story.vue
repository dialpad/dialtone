<template>
  <div id="components-toggle--variants-container">
    <!-- Unchecked Initially -->
    <dt-toggle
      class="d-mt6"
      label-class="d-mr6"
      label="Unchecked Initial"
    >
      Checked Initial
    </dt-toggle>

    <!-- Checked Initially -->
    <dt-toggle
      class="d-mt6"
      label-class="d-mr6"
      label="Checked Initial"
      :checked="true"
    >
      Checked Initial
    </dt-toggle>

    <!-- Checked Disabled -->
    <dt-toggle
      class="d-mt6"
      label-class="d-mr6"
      :checked="true"
      :disabled="true"
    >
      Disabled Checked
    </dt-toggle>

    <!-- Unchecked Disabled -->
    <dt-toggle
      class="d-mt6"
      label-class="d-mr6"
      :disabled="true"
    >
      Disabled Unchecked
    </dt-toggle>

    <!-- With Flex grow -->
    <dt-toggle
      class="d-mt6"
      label-class="d-d-flex d-fl-grow1"
    >
      With Flex Grow
    </dt-toggle>

    <!-- With Slots -->
    <dt-toggle
      class="d-mt6"
    >
      <div class="d-mr6">
        With Slot Label
      </div>
    </dt-toggle>

    <!-- With v-model -->
    <dt-toggle
      v-model="vModelValue"
      class="d-mt6"
    >
      <div class="d-mr6">
        With V-Model
      </div>
    </dt-toggle>

    <dt-toggle
      class="d-mt6"
      label-class="d-mr6"
      label="Small size"
      size="sm"
    >
      Small size
    </dt-toggle>
  </div>
</template>

<script>
import DtToggle from './toggle';

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
