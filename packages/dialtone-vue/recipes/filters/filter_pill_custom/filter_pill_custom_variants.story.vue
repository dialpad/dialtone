<template>
  <dt-stack gap="500">
    <!-- Radio selection: always active -->
    <dt-stack gap="300">
      <span class="d-label--sm">Radio selection (always active)</span>
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
    <!-- Radio selection: conversation type (conditional active) -->
    <dt-stack gap="300">
      <span class="d-label--sm">Radio selection: conversation type (conditional active)</span>
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
              @input="$event => selectedConversationType = $event"
            />
          </dt-radio-group>
        </template>
      </dt-filter-pill>
    </dt-stack>
    <!-- Badge count -->
    <dt-stack gap="300">
      <span class="d-label--sm">Badge count</span>
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
    <!-- All/selected list -->
    <dt-stack gap="300">
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
  </dt-stack>
</template>

<script>
import DtFilterPill from '@/components/filter_pill/filter_pill.vue';
import { DtStack } from '@/components/stack';
import { DtRadioGroup } from '@/components/radio_group';
import { DtRadio } from '@/components/radio';
import { DtText } from '@/components/text';

export default {
  name: 'DtFilterPillCustomVariants',
  components: {
    DtRadio,
    DtRadioGroup,
    DtFilterPill,
    DtStack,
    DtText,
  },

  data () {
    return {
      internalExternal: [
        { name: 'Internal and external', active: true },
        { name: 'Internal only' },
        { name: 'External only' },
      ],

      conversationTypes: [
        { name: 'All Conversations' },
        { name: 'Only Calls' },
        { name: 'Only Meetings' },
        { name: 'Only Digital' },
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
        }));
      },
    },

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
  },
};
</script>
