<template>
  <dt-stack gap="500">
    <!-- No selection -->
    <dt-stack gap="300">
      <span class="d-label--sm">No selection</span>
      <dt-filter-pill
        v-model="channels"
        label="Channels"
      />
    </dt-stack>
    <!-- Selected, show label/count, has clear -->
    <dt-stack gap="300">
      <span class="d-label--sm">Selected, show label/count, has clear</span>
      <dt-filter-pill
        v-model="contactCenters"
        label="Contact centers"
        omega-tooltip-text="Remove"
      />
    </dt-stack>
    <!-- Selected, overflow, label tooltip, has clear -->
    <dt-stack gap="300">
      <span class="d-label--sm">Selected, overflow, label tooltip, has clear</span>
      <dt-filter-pill
        v-model="merchandise"
        alpha-tooltip-text="Disposition"
        label="Merchandise Question (e.g. Size, Fit, etc)"
        omega-tooltip-text="Remove"
      />
    </dt-stack>
    <!-- Selected, label, no clear -->
    <dt-stack gap="300">
      <span class="d-label--sm">Selected, label, no clear</span>
      <dt-filter-pill
        v-model="internalExternal"
        hide-clear
      >
        <template #default>
          {{ selectedIEFilter }}
        </template>
        <template #content>
          <dt-radio-group
            v-model="selectedIEFilter"
            name="internal-external-filter"
          >
            <dt-radio
              v-for="filter in internalExternal"
              :key="filter.name"
              :label="filter.name"
              :value="filter.name"
              @input="$event => selectedIEFilter = $event"
            />
          </dt-radio-group>
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
          Popover content
        </template>
      </dt-filter-pill>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtFilterPill from './filter_pill.vue';
import { BUTTON_SIZE_MODIFIERS } from '@/components/button';
import { DtStack } from '@/components/stack';
import { DtRadioGroup } from '@/components/radio_group';
import { DtRadio } from '@/components/radio';

export default {
  name: 'DtFilterPillVariants',
  components: {
    DtRadio,
    DtRadioGroup,
    DtFilterPill,
    DtStack,
  },

  data () {
    return {
      channels: [
        { name: 'Channel 1' },
        { name: 'Channel 2' },
        { name: 'Channel 3' },
        { name: 'Channel 4' },
        { name: 'Channel 5' },
      ],

      contactCenters: [
        { name: 'Contact Center 1', active: true },
        { name: 'Contact Center 2' },
        { name: 'Contact Center 3' },
        { name: 'Contact Center 4' },
        { name: 'Contact Center 5' },
      ],

      merchandise: [
        { name: 'Merchandise 1', active: true },
        { name: 'Merchandise 2' },
        { name: 'Merchandise 3' },
        { name: 'Merchandise 4' },
        { name: 'Merchandise 5' },
      ],

      internalExternal: [
        { name: 'Internal and external', active: true },
        { name: 'Internal only' },
        { name: 'External only' },
      ],

      dropdownOptions: [
        { name: 'Option 1' },
        { name: 'Option 2', active: true },
      ],

      sizes: Object.keys(BUTTON_SIZE_MODIFIERS),

      sizeNames: {
        xs: 'Extra small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
      },
    };
  },

  computed: {
    selectedIEFilter: {
      get () {
        return this.internalExternal.find(f => f.active)?.name;
      },

      set (newValue) {
        this.internalExternal = this.internalExternal.map(f => ({
          ...f,
          active: f.name === newValue,
        }))
      },
    },

    selectedDropdownFilter: {
      get () {
        return this.dropdownOptions.find(f => f.active)?.name;
      },

      set (newValue) {
        this.dropdownOptions = this.dropdownOptions.map(f => ({
          ...f,
          active: f.name === newValue,
        }))
      },
    },
  },

  methods: {
    handleDropdownClick (filterName, close) {
      this.selectedDropdownFilter = filterName;
      close();
    },
  },
};
</script>
