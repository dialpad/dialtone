<template>
  <dt-stack
    as="section"
    :aria-label="useDropdown ? 'Dropdown filter close before removal' : 'Popover filter close before removal'"
    gap="500"
  >
    <dt-filter-pill
      v-if="visible"
      v-model:open="open"
      v-model:selected="selected"
      popover-append-to="parent"
      :use-dropdown="useDropdown"
      :options="options"
      label="Removable teams"
      data-qa="close-before-removal-pill"
      @opened="onOpened"
    >
      <template #content>
        <dt-button
          :role="useDropdown ? 'menuitem' : undefined"
          data-qa="close-before-removal-close"
          @click="closeThenRemove"
        >
          Close then remove
        </dt-button>
      </template>
    </dt-filter-pill>
    <dt-button
      ref="resetButton"
      data-qa="close-before-removal-reset"
      @click="reset"
    >
      Reset removable filter
    </dt-button>
    <p>Keep the filter mounted until opened(false) completes focus and scroll cleanup.</p>
    <pre data-qa="close-before-removal-trace">{{ JSON.stringify(events) }}</pre>
  </dt-stack>
</template>

<script>
import { DtButton } from '@/components/Button';
import { DtStack } from '@/components/Stack';
import DtFilterPill from './FilterPill.vue';

export default {
  name: 'DtFilterPillCloseBeforeRemoval',
  components: { DtButton, DtFilterPill, DtStack },
  props: { useDropdown: { type: Boolean, default: false } },
  data () {
    return {
      visible: true,
      open: false,
      selected: this.useDropdown ? 'sales' : ['sales'],
      removing: false,
      events: [],
      options: [{ value: 'sales', label: 'Sales' }],
    };
  },

  methods: {
    closeThenRemove () {
      this.removing = true;
      this.open = false;
    },

    onOpened (value) {
      this.events.push(value);
      if (value || !this.removing) return;
      this.visible = false;
      this.removing = false;
      this.$nextTick(() => this.$refs.resetButton?.$el?.focus());
    },

    reset () {
      this.open = false;
      this.visible = true;
      this.removing = false;
      this.events = [];
    },
  },
};
</script>
