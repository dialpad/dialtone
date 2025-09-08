<template>
  <dt-tab-group
    class="d-d-flex d-fd-column d-of-y-auto d-h100p"
    tab-list-class="dtc-theme__tabs d-zi-base1 d-ps-sticky d-t0"
    :selected="getId(selected)"
    borderless
  >
    <template #tabs>
      <div>
        <template
          v-for="(_, slot) in slots"
          :key="slot"
        >
          <dt-tab
            :id="getId(slot)"
            :panel-id="getId(slot)"
          >
            {{ generateLabel(slot, capitalCase) }}
          </dt-tab>
        </template>
      </div>
    </template>
    <template
      v-for="(_, slot) in slots"
      :key="slot"
    >
      <dt-tab-panel
        :id="getId(slot)"
        :tab-id="getId(slot)"
        class="d-d-flex d-fl-grow1 d-py8 d-px16"
      >
        <slot :name="slot" />
      </dt-tab-panel>
    </template>
  </dt-tab-group>
</template>

<script setup>
import { DtTabGroup, DtTabPanel, DtTab } from '@dialpad/dialtone-vue';
import { useSlots } from 'vue';
import { getUniqueString } from '@/src/lib/utils';
import { capitalCase } from 'change-case';

const props = defineProps({
  /**
   * Unique id for tabs and panels to reference each other.
   */
  id: {
    type: String,
    default: () => getUniqueString(),
  },
  /**
   * The selected slot name.
   */
  selected: {
    type: String,
    default: undefined,
  },
  /**
   * Function that generates a label based on a given slot.
   * Also provides a 'capitalCase' function to prettify a string.
   */
  generateLabel: {
    type: Function,
    default: (slot, capitalCase) => capitalCase(slot),
  },
});

const slots = useSlots();

function getId (slot) {
  return `${props.id}-${slot}`;
}
</script>

<script>
/**
 * Reusable component for displaying slot content based on a selected tab.
 */
export default {
  name: 'DtcTabPanel',
};
</script>
