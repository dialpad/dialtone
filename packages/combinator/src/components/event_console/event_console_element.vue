<template>
  <dtc-event-console-lazy-load>
    <template #prefix>
      &lt;
    </template>
    <template #default>
      {{ html }}
    </template>
    <template #suffix>
      &gt;
    </template>
  </dtc-event-console-lazy-load>
</template>

<script setup>
import DtcEventConsoleLazyLoad from '@/src/components/event_console/event_console_lazy_load';
import beautify from 'js-beautify';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Element,
    required: true,
  },
});

const html = computed(() => {
  return beautify.html(props.value.outerHTML, {
    wrap_attributes: 'force-expand-multiline',
    inline: '',
  });
});
</script>

<script>
export default {
  name: 'DtcEventConsoleElement',
};
</script>
