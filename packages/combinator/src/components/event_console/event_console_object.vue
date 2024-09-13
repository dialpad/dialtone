<template>
  <dtc-event-console-lazy-load>
    <template #prefix>
      {
    </template>
    <template #default>
      <span>{</span>
      <template
        v-for="(field, key) in clone"
        :key="key"
      >
        <dtc-event-console-pair
          :name="key"
          :value="field"
        />
      </template>
      <span>}</span>
    </template>
    <template #suffix>
      }
    </template>
  </dtc-event-console-lazy-load>
</template>

<script setup>
import { flatten } from '@/src/lib/utils';
import { computed } from 'vue';
import DtcEventConsolePair from '@/src/components/event_console/event_console_pair';
import DtcEventConsoleLazyLoad from '@/src/components/event_console/event_console_lazy_load';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
});

/**
 * Needs to be flattened to iterate through all prototype properties of the object.
 * Not sure if there is a better way of doing this.
 *
 * @type {ComputedRef<object>}
 */
const clone = computed(() => {
  return flatten(props.value);
});
</script>

<script>
export default {
  name: 'DtcEventConsoleObject',
};
</script>
