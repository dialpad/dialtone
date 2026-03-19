<template>
  <dt-stack gap="600">
    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Horizontal (default)
      </p>
      <dt-segmented-control
        v-model="selectedHorizontal"
        :options="textOptions"
        aria-label="Horizontal example"
      />
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Vertical
      </p>
      <dt-segmented-control
        v-model="selectedVertical"
        :options="textOptions"
        orientation="vertical"
        aria-label="Vertical example"
      />
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        With icons
      </p>
      <dt-segmented-control
        v-model="selectedIcons"
        :options="iconOptions"
        aria-label="With icons example"
      />
      <dt-segmented-control
        v-model="selectedIcons"
        size="xs"
        :options="iconOptions"
        aria-label="With icons example"
      />
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Icon only
      </p>
      <dt-segmented-control
        v-model="selectedIconOnly"
        :options="iconOnlyOptions"
        aria-label="Appearance mode"
      />
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Sizes
      </p>
      <dt-stack gap="400">
        <dt-segmented-control
          v-model="selectedSize"
          :options="sizeOptions"
          size="xs"
          aria-label="Extra small size"
        />
        <dt-segmented-control
          v-model="selectedSize"
          :options="sizeOptions"
          size="sm"
          aria-label="Small size"
        />
        <dt-segmented-control
          v-model="selectedSize"
          :options="sizeOptions"
          aria-label="Default size"
        />
        <dt-segmented-control
          v-model="selectedSize"
          :options="sizeOptions"
          size="lg"
          aria-label="Large size"
        />
        <dt-segmented-control
          v-model="selectedSize"
          :options="sizeOptions"
          size="xl"
          aria-label="Extra large size"
        />
      </dt-stack>
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Disabled (entire group)
      </p>
      <dt-segmented-control
        v-model="selectedDisabled"
        :options="textOptions"
        disabled
        aria-label="Disabled group example"
      />
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Individual disabled option
      </p>
      <dt-segmented-control
        v-model="selectedIndividualDisabled"
        :options="disabledOptions"
        aria-label="Individual disabled example"
      />
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Activation mode: auto (selects on focus)
      </p>
      <dt-segmented-control
        v-model="selectedAuto"
        :options="textOptions"
        activation-mode="auto"
        aria-label="Auto activation example"
      />
    </dt-stack>

    <dt-stack>
      <p class="d-fw-bold d-mb8">
        Activation mode: manual (Space/Enter to select)
      </p>
      <dt-segmented-control
        v-model="selectedManual"
        :options="textOptions"
        activation-mode="manual"
        aria-label="Manual activation example"
      />
    </dt-stack>
  </dt-stack>
</template>

<script>
import { markRaw } from 'vue';
import DtSegmentedControl from './segmented_control.vue';
import { DtStack } from '../stack';
import {
  DtIconListSpacingCompact,
  DtIconListSpacingRegular,
  DtIconListSpacingExpanded,
  DtIconLaptop2,
  DtIconSun,
  DtIconMoon,
} from '@dialpad/dialtone-icons/vue';

export default {
  name: 'DtSegmentedControlVariants',
  components: { DtSegmentedControl, DtStack },

  data () {
    return {
      selectedHorizontal: 'all',
      selectedVertical: 'all',
      selectedIcons: 'compact',
      selectedIconOnly: 'system',
      selectedSize: 'option1',
      selectedDisabled: 'all',
      selectedIndividualDisabled: 'all',
      selectedAuto: 'all',
      selectedManual: 'all',
      textOptions: [
        { value: 'all', label: 'All' },
        { value: 'favorites', label: 'Favorites' },
        { value: 'recent', label: 'Recent' },
        { value: 'groups', label: 'Groups' },
      ],

      iconOptions: [
        { value: 'compact', label: 'Compact', icon: markRaw(DtIconListSpacingCompact) },
        { value: 'regular', label: 'Regular', icon: markRaw(DtIconListSpacingRegular) },
        { value: 'expanded', label: 'Expanded', icon: markRaw(DtIconListSpacingExpanded) },
      ],

      iconOnlyOptions: [
        { value: 'system', label: 'System', icon: markRaw(DtIconLaptop2), iconOnly: true },
        { value: 'light', label: 'Light', icon: markRaw(DtIconSun), iconOnly: true },
        { value: 'dark', label: 'Dark', icon: markRaw(DtIconMoon), iconOnly: true },
      ],

      sizeOptions: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],

      disabledOptions: [
        { value: 'all', label: 'All' },
        { value: 'favorites', label: 'Favorites', disabled: true },
        { value: 'recent', label: 'Recent' },
        { value: 'groups', label: 'Groups' },
      ],
    };
  },
};
</script>
