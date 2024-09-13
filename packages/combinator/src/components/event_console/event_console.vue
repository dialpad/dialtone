<template>
  <div class="d-ws-pre-wrap">
    <template
      v-for="(entry, index) in entries"
      :key="entry.key"
    >
      <div
        data-qa="dtc-event-console-entry"
      >
        <dtc-event-console-pair
          :name="entry.event"
          :value="index < cacheSize
            ? entry.value
            : undefined"
        >
          <template #separator>
            <span>
              <IconArrowForward
                v-if="entry.value !== undefined"
                class="d-fs10 d-px6 d-ps-relative d-t2"
              />
            </span>
          </template>
        </dtc-event-console-pair>
      </div>
    </template>
  </div>
</template>

<script setup>
import IconArrowForward from 'dialtone-icons/IconArrowForward';
import DtcEventConsolePair from '@/src/components/event_console/event_console_pair';

import { computed, ref } from 'vue';

defineProps({
  /**
   * Amount of objects that are stored for expansion.
   */
  cacheSize: {
    type: Number,
    default: 10,
  },
});

const entries = ref([]);

let currentId = 0;
defineExpose({
  /**
   * Add a new event to the console.
   *
   * @param event - The event name.
   * @param value - The event value.
   */
  trigger (event, value) {
    entries.value.unshift({
      event,
      value,
      key: currentId++,
    });
  },

  /**
   * Number of events currently in console.
   */
  entryCount: computed(() => entries.value.length),
});
</script>

<script>
/**
 * The event console displays data about events captured from the target component.
 */
export default {
  name: 'DtcEventConsole',
};
</script>
