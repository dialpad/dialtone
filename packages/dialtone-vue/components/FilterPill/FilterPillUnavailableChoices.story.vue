<template>
  <dt-stack
    as="section"
    aria-label="FilterPill with unavailable choices"
    direction="row"
    gap="400"
    class="d-fl-wrap"
  >
    <dt-filter-pill
      v-model:selected="status"
      popover-append-to="parent"
      label="Status"
      use-dropdown
      neutral-value="all"
      end-tooltip-text="Clear"
      :options="statusOptions"
    >
      <template #headerContent>
        Status
      </template>
    </dt-filter-pill>
    <dt-filter-pill
      v-model:selected="type"
      popover-append-to="parent"
      label="Type"
      use-dropdown
      neutral-value="all"
      end-tooltip-text="Clear"
      :options="typeOptions"
    >
      <template #headerContent>
        Type
      </template>
    </dt-filter-pill>
  </dt-stack>
</template>

<script>
import { DtStack } from '@/components/Stack';
import DtFilterPill from './FilterPill.vue';

export default {
  name: 'DtFilterPillUnavailableChoices',
  components: { DtStack, DtFilterPill },
  data () {
    return {
      status: 'unread',
      type: 'all',
      statusOptions: [
        { value: 'all', label: 'All' },
        { value: 'unread', label: 'Unread' },
      ],
    };
  },

  computed: {
    // The application decides availability: archived items need Status set to All.
    typeOptions () {
      const archivedUnavailable = this.status !== 'all';
      return [
        { value: 'all', label: 'All types' },
        { value: 'calls', label: 'Calls' },
        { value: 'messages', label: 'Messages', description: 'Includes texts and chats' },
        {
          value: 'archived',
          label: 'Archived',
          group: 'Other views',
          disabled: archivedUnavailable,
          description: archivedUnavailable ? 'Choose All under Status to view archived items' : null,
        },
        { value: 'spam', label: 'Spam', group: 'Other views' },
      ];
    },
  },
};
</script>
