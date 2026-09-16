<template>
  <dt-stack gap="200">
    <!-- No selection -->
    <dt-stack gap="50">
      <span class="d-label--sm">No selection</span>
      <dt-filter-pill
        v-model="channels"
        label="Channel"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon-filter :size="iconSize" />
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- With start icon -->
    <dt-stack gap="50">
      <span class="d-label--sm">With start icon</span>
      <dt-filter-pill
        v-model="contactCenters"
        label="Contact centers"
        end-tooltip-text="Remove"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon-box-select :size="iconSize" />
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- Selected, show label/count, has clear -->
    <dt-stack gap="50">
      <span class="d-label--sm">Selected, show label/count, has clear</span>
      <dt-filter-pill
        v-model="contactCenters2"
        label="Contact centers"
        end-tooltip-text="Remove"
      />
    </dt-stack>
    <!-- Selected, overflow, label tooltip, has clear -->
    <dt-stack gap="50">
      <span class="d-label--sm">Selected, overflow, label tooltip, has clear</span>
      <dt-filter-pill
        v-model="merchandise"
        start-tooltip-text="Merchandise"
        label="Merchandise"
        end-tooltip-text="Remove"
      />
    </dt-stack>
    <!-- Custom label slot: conversation type -->
    <dt-stack gap="50">
      <span class="d-label--sm">Custom label slot: conversation type</span>
      <dt-filter-pill
        v-model="conversationTypes"
        :start-tooltip-text="selectedConversationType !== 'All Conversations'
          ? 'Conversation type'
          : ''"
        end-tooltip-text="Remove"
        @clear="selectedConversationType = 'All Conversations'"
      >
        <template #default>
          {{ selectedConversationType === 'All Conversations'
            ? 'Conversation type'
            : selectedConversationType }}
        </template>
        <template #content>
          <dt-radio-group
            v-model="selectedConversationType"
            name="conversation-type-filter"
          >
            <dt-radio
              v-for="filter in conversationTypes"
              :key="filter.name"
              :label="filter.name"
              :value="filter.name"
            />
          </dt-radio-group>
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- Custom label -->
    <dt-stack gap="50">
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
    <!-- Radio selection: always active -->
    <dt-stack gap="50">
      <span class="d-label--sm">Radio selection (always active)</span>
      <dt-filter-pill
        v-model="internalExternal"
        :show-clear="false"
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
            />
          </dt-radio-group>
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- All/selected list -->
    <dt-stack gap="50">
      <span class="d-label--sm">All/selected list</span>
      <dt-filter-pill
        v-model="channelsCustom"
        label="Channel"
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
    <!-- Dropdown: single-select with list items -->
    <dt-stack gap="50">
      <span class="d-label--sm">Dropdown: conversation type</span>
      <dt-filter-pill
        v-model="dropdownConversationTypes"
        :start-tooltip-text="selectedDropdownType !== 'All Conversations'
          ? 'Conversation type'
          : ''"
        end-tooltip-text="Remove"
        use-dropdown
        @clear="resetDropdownType"
      >
        <template #default>
          {{ selectedDropdownType === 'All Conversations'
            ? 'Conversation type'
            : selectedDropdownType }}
        </template>
        <template #content="{ close }">
          <dt-list-item
            v-for="filter in dropdownConversationTypes"
            :key="filter.name"
            role="menuitem"
            navigation-type="arrow-keys"
            :selected="filter.name === selectedDropdownType"
            @click="selectDropdownType(filter.name, close)"
          >
            {{ filter.name }}
          </dt-list-item>
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- Deferred selection -->
    <dt-stack gap="50">
      <span class="d-label--sm">Deferred selection (Apply/Cancel)</span>
      <dt-filter-pill
        v-model="deferredFilters"
        label="Deferred"
        end-tooltip-text="Remove"
        defer-selection
      />
    </dt-stack>
    <!-- Read only -->
    <dt-stack gap="50">
      <span class="d-label--sm">Read only</span>
      <dt-filter-pill
        read-only
        label="Conversation type"
      />
    </dt-stack>
    <dt-stack gap="50">
      <span class="d-label--sm">Read only with selections</span>
      <dt-filter-pill
        v-model="readOnlySelections"
        read-only
        label="Contact centers"
      />
    </dt-stack>
    <!-- Disabled -->
    <dt-stack gap="50">
      <span class="d-label--sm">Disabled</span>
      <dt-filter-pill
        disabled
        label="Conversation type"
      />
    </dt-stack>
    <dt-stack gap="50">
      <span class="d-label--sm">Disabled with selections</span>
      <dt-filter-pill
        v-model="contactCenters"
        disabled
        label="Contact centers"
        end-tooltip-text="Remove"
      />
    </dt-stack>
    <!-- Sizes -->
    <dt-stack gap="200">
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
import DtFilterPill from './FilterPill.vue';
import { BUTTON_SIZE_MODIFIERS } from '@/components/Button';
import { DtStack } from '@/components/Stack';
import { DtRadioGroup } from '@/components/RadioGroup';
import { DtRadio } from '@/components/Radio';
import { DtIconFilter } from '@dialpad/dialtone-icons/vue';
import { DtIconBoxSelect } from '@dialpad/dialtone-icons/vue';

import { DtText } from '../Text/index';
import { DtListItem } from '@/components/ListItem';

export default {
  name: 'DtFilterPillVariants',
  components: {
    DtRadio,
    DtRadioGroup,
    DtFilterPill,
    DtStack,
    DtIconFilter,
    DtIconBoxSelect,
    DtText,
    DtListItem,
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

      merchandise: [
        { name: 'Trousers' },
        { name: 'Shirt', active: true },
        { name: 'Jacket' },
        { name: 'Shoes' },
        { name: 'Accessories' },
      ],

      conversationTypes: [
        { name: 'All Conversations' },
        { name: 'Only Calls' },
        { name: 'Only Meetings' },
        { name: 'Only Digital' },
      ],

      internalExternal: [
        { name: 'Internal and external', active: true },
        { name: 'Internal only' },
        { name: 'External only' },
      ],

      channelsCustom: [
        { name: 'Email', active: true },
        { name: 'Phone', active: true },
        { name: 'Chat', active: true },
        { name: 'Social' },
        { name: 'SMS' },
      ],

      readOnlySelections: [
        { name: 'Headquarters', active: true },
        { name: 'Westside', active: true },
        { name: 'Downtown' },
      ],

      deferredFilters: [
        { name: 'Email' },
        { name: 'Phone' },
        { name: 'Chat' },
        { name: 'Social' },
        { name: 'SMS' },
      ],

      dropdownConversationTypes: [
        { name: 'All Conversations' },
        { name: 'Only Calls' },
        { name: 'Only Meetings' },
        { name: 'Only Digital' },
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
    selectedConversationType: {
      get () {
        return this.conversationTypes.find(f => f.active)?.name || 'All Conversations';
      },

      set (newValue) {
        this.conversationTypes.forEach(f => {
          f.active = f.name === newValue && newValue !== 'All Conversations';
        });
      },
    },

    selectedIEFilter: {
      get () {
        return this.internalExternal.find(f => f.active)?.name;
      },

      set (newValue) {
        this.internalExternal = this.internalExternal.map(f => ({
          ...f,
          active: f.name === newValue,
        }));
      },
    },

    selectedDropdownType () {
      return this.dropdownConversationTypes.find(f => f.active)?.name || 'All Conversations';
    },
  },

  methods: {
    selectDropdownType (name, close) {
      this.dropdownConversationTypes.forEach(f => {
        f.active = name !== 'All Conversations' && f.name === name;
      });
      close();
    },

    resetDropdownType () {
      this.dropdownConversationTypes.forEach(f => { f.active = false; });
    },
  },
};
</script>
