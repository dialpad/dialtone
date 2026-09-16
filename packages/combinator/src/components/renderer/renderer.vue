<template>
  <dtc-renderer-target
    :component="component"
    :bindings="options.bindings.get()"
    :events="info.events"
    :disabled-members="disabledMembers"
    @event="(event, value) => emit('event', event, value)"
  >
    <template
      v-for="(slot, name) in renderedSlots"
      :key="name"
      #[name]="slotBindings"
    >
      <dtc-node
        :template="slot"
        :library="library"
        :scope="slotBindings"
      />
    </template>
  </dtc-renderer-target>
</template>

<script setup>
import { computed } from 'vue';
import { SETTINGS_UPDATE_EVENT } from '@/src/lib/constants';
import DtcRendererTarget from '@/src/components/renderer/renderer_target.vue';
import DtcNode from '@/src/components/tools/node.vue';
import { nonEmptySlots } from '@/src/lib/utils';

const props = defineProps({
  /**
   * Component to render.
   */
  component: {
    type: Object,
    required: true,
  },
  /**
   * Info data object.
   */
  info: {
    type: Object,
    required: true,
  },
  /**
   * Options data object.
   */
  options: {
    type: Object,
    required: true,
  },
  /**
   * Settings data object.
   */
  settings: {
    type: Object,
    required: true,
  },
  library: {
    type: Object,
    required: true,
  },
  /**
   * Set of member names that are currently disabled.
   */
  disabledMembers: {
    type: Set,
    default: () => new Set(),
  },
});

const emit = defineEmits([
  SETTINGS_UPDATE_EVENT,
  'event',
]);

/**
 * Filtered slots that contain content.
 *
 * @type {ComputedRef<object>}
 */
const renderedSlots = computed(() => nonEmptySlots(props.options.slots));

</script>

<script>
/**
 * The renderer is responsible for displaying the target component in its current state.
 */
export default {
  name: 'DtcRenderer',
};
</script>
