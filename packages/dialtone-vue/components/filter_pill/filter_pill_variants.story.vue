<template>
  <dt-stack gap="500">
    <!-- No selection -->
    <dt-stack gap="300">
      <span class="d-label--sm">No selection</span>
      <dt-filter-pill
        v-model="channels"
        label="Channels"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon-filter :size="iconSize" />
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- With start icon -->
    <dt-stack gap="300">
      <span class="d-label--sm">With start icon</span>
      <dt-filter-pill
        v-model="contactCenters"
        label="Contact centers"
        end-tooltip-text="Remove"
      />
    </dt-stack>
    <!-- Selected, show label/count, has clear -->
    <dt-stack gap="300">
      <span class="d-label--sm">Selected, show label/count, has clear</span>
      <dt-filter-pill
        v-model="contactCenters2"
        label="Contact centers"
        end-tooltip-text="Remove"
      />
    </dt-stack>
    <!-- Selected, overflow, label tooltip, has clear -->
    <dt-stack gap="300">
      <span class="d-label--sm">Selected, overflow, label tooltip, has clear</span>
      <dt-filter-pill
        v-model="merchandise"
        start-tooltip-text="Merchandise"
        label="Merchandising where the real money is made"
        end-tooltip-text="Remove"
      />
    </dt-stack>
    <!-- Custom label: radio selection via scoped slot -->
    <dt-stack gap="300">
      <span class="d-label--sm">Custom label slot: radio selection</span>
      <dt-filter-pill
        v-model="internalExternal"
        hide-clear
      >
        <template #default>
          {{ selectedIEFilter || 'Internal and external' }}
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
    <!-- Custom label -->
    <dt-stack gap="300">
      <span class="d-label--sm">Custom label slot</span>
      <dt-filter-pill
        v-model="contactCentersBadge"
        label="Contact centers"
        end-tooltip-text="Remove"
      >
        <template #default="{ label, filters, activeFilters }">
          {{ label }}:
          <dt-text
            v-if="activeFilters.length"
            as="strong"
            numeric
          >
            {{ activeFilters.length === filters.length ? 'All' : activeFilters.length }}
          </dt-text>
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- Custom label: all/selected -->
    <dt-stack gap="300">
      <span class="d-label--sm">Custom label slot: all/selected</span>
      <dt-filter-pill
        v-model="channelsCustom"
        label="Channels"
        end-tooltip-text="Remove"
      >
        <template #default="{ label, filters, activeFilters, activeFilterList }">
          {{ label }}:
          <dt-text
            v-if="activeFilters.length"
            as="strong"
            numeric
          >
            {{ activeFilters.length === filters.length ? 'All' : activeFilterList }}
          </dt-text>
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
    <dt-stack gap="300">
      <span class="d-label--sm">Disabled with selections</span>
      <dt-filter-pill
        v-model="contactCenters"
        disabled
        label="Contact centers"
        end-tooltip-text="Remove"
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
import { DtIconFilter } from '@dialpad/dialtone-icons/vue3';
import { DtText } from '../text/index';

export default {
  name: 'DtFilterPillVariants',
  components: {
    DtRadio,
    DtRadioGroup,
    DtFilterPill,
    DtStack,
    DtIconFilter,
    DtText,
  },

  data () {
    return {
      channels: [
        { name: 'Email' },
        { name: 'Phone' },
        { name: 'Chat' },
        { name: 'Social' },
        { name: 'SMS' },
      ],

      contactCenters: [
        { name: 'Headquarters', active: true },
        { name: 'Westside' },
        { name: 'Downtown' },
        { name: 'Riverside' },
        { name: 'Northgate' },
      ],

      contactCenters2: [
        { name: 'Headquarters', active: true },
        { name: 'Westside' },
        { name: 'Downtown' },
        { name: 'Riverside' },
        { name: 'Northgate' },
      ],

      contactCentersBadge: [
        { name: 'Headquarters', active: true },
        { name: 'Westside' },
        { name: 'Downtown', active: true },
        { name: 'Riverside' },
        { name: 'Northgate' },
      ],

      channelsCustom: [
        { name: 'Email', active: true },
        { name: 'Phone', active: true },
        { name: 'Chat', active: true },
        { name: 'Social' },
        { name: 'SMS' },
      ],

      merchandise: [
        { name: 'Shirt', active: true },
        { name: 'Trousers' },
        { name: 'Jacket' },
        { name: 'Shoes' },
        { name: 'Accessories' },
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
