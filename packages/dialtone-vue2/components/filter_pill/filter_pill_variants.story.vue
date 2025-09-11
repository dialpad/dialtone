<template>
  <dt-stack gap="500">
    <!-- No selection -->
    <dt-stack gap="300">
      <span class="d-label--sm">No selection</span>
      <dt-filter-pill
        label="Channel"
      >
        <template #content>
          Default content
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- Selected, show label/count, has clear -->
    <dt-stack gap="300">
      <span class="d-label--sm">Selected, show label/count, has clear</span>
      <dt-filter-pill
        label="Contact centers"
        :active-filter-count="activeContactCenters.length"
        show-clear
        active
        omega-tooltip-text="Remove"
        @clear="activeContactCenters = []"
      >
        <template #content>
          <dt-checkbox-group
            :selected-values="activeContactCenters"
            legend="Contact Centers"
            name="contact-centers"
            @update:selected-values="($event) => activeContactCenters = $event"
          >
            <dt-checkbox
              v-for="filter in contactCenters"
              :key="filter"
              :value="filter"
              :label="filter"
            />
          </dt-checkbox-group>
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- Selected, overflow, label tooltip, has clear -->
    <dt-stack gap="300">
      <span class="d-label--sm">Selected, overflow, label tooltip, has clear</span>
      <dt-filter-pill
        active
        alpha-tooltip-text="Disposition"
        show-clear
        label="Merchandise Question (e.g. Size, Fit, etc)"
        omega-tooltip-text="Remove"
      >
        <template #content>
          Default content
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- Selected, label, no clear -->
    <dt-stack gap="300">
      <span class="d-label--sm">Selected, label, no clear</span>
      <dt-filter-pill
        active
        label="Internal and external"
      >
        <template #content>
          Default content
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- Disabled -->
    <dt-stack gap="300">
      <span class="d-label--sm">Disabled</span>
      <dt-filter-pill
        disabled
        label="Conversation type"
      />
    </dt-stack>
    <!-- Sizes -->
    <dt-stack gap="500">
      <h3>Sizes</h3>
      <dt-filter-pill
        v-for="size in sizes"
        :key="size"
        :label="sizeNames[size]"
        :size="size"
      >
        <template #content>
          Default content
        </template>
      </dt-filter-pill>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtFilterPill from './filter_pill.vue';
import { DtCheckbox } from '@/components/checkbox';
import { BUTTON_SIZE_MODIFIERS } from '@/components/button';
import { DtStack } from '@/components/stack';
import { DtCheckboxGroup } from '@/components/checkbox_group';

export default {
  name: 'DtFilterPillVariants',
  components: {
    DtCheckboxGroup,
    DtFilterPill,
    DtCheckbox,
    DtStack,
  },

  data () {
    return {
      contactCenters: [
        'Filter 1',
        'Filter 2',
        'Filter 3',
        'Filter 4',
        'Filter 5',
      ],

      sizes: Object.keys(BUTTON_SIZE_MODIFIERS),

      sizeNames: {
        xs: 'Extra small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
      },

      activeContactCenters: [
        'Filter 1',
      ],
    };
  },
};
</script>
