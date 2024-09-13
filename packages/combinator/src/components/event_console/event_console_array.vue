<template>
  <dtc-event-console-lazy-load>
    <template #prefix>
      [
    </template>
    <template #default>
      <span>[</span>
      <template
        v-for="(field, key) in value"
        :key="key"
      >
        <dtc-event-console-pair
          :name="key.toString()"
          :value="field"
        />
      </template>
      <span>]</span>
    </template>
    <template #suffix>
      ]
    </template>
  </dtc-event-console-lazy-load>
</template>

<script setup>
import DtcEventConsolePair from '@/src/components/event_console/event_console_pair';
import DtcEventConsoleLazyLoad from '@/src/components/event_console/event_console_lazy_load';

defineProps({
  value: {
    type: Array,
    required: true,
  },
});
</script>

<script>
export default {
  name: 'DtcEventConsoleArray',
};
</script>
