<template>
  <dt-button-group
    class="d-fw-wrap"
  >
    <template
      v-for="(selection, control) in selections"
      :key="control"
    >
      <template
        v-for="label in selection.labels"
        :key="label"
      >
        <span class="d-pr4">
          <dt-button
            class="dtc-control-selector__button d-px4 d-py1"
            importance="outlined"
            v-bind="getStyling(control)"
            @click="() => updateControl(control)"
          >
            {{ label }}
          </dt-button>
        </span>
      </template>
    </template>
  </dt-button-group>
</template>

<script setup>
import { DtButton, DtButtonGroup } from '@dialpad/dialtone-vue';
import { CONTROL_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';

const props = defineProps({
  /**
   * Selected control.
   */
  selected: {
    type: String,
    required: true,
  },
  /**
   * Array of control selections.
   */
  controls: {
    type: Array,
    required: true,
  },
  /**
   * Prevent the control from changing.
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Array of valid types.
   */
  types: {
    type: Array,
    default: undefined,
  },
});

const emit = defineEmits([CONTROL_UPDATE_EVENT]);

const selections = computed(() => {
  return {
    ...Object.fromEntries(
      props.controls.map(control => {
        return [control, getSelection(control)];
      }),
    ),
  };
});

function getSelection (control) {
  switch (control) {
    case 'event': {
      const eventTypes = props.types;
      const labels = eventTypes ?? ['event'];
      return {
        labels,
      };
    }
    default: return {
      labels: [control],
    };
  }
}

/**
 * Gets the styling of the button based on the status of the control.
 *
 * @param {string} control - The name of the control.
 * @returns {object} Object containing style settings.
 */
function getStyling (control) {
  const isActive = control === props.selected;

  const styling = {
    active: isActive,
    kind: isActive ? 'default' : 'muted',
    disabled: props.disabled,
  };

  if (isActive) {
    styling['control-active'] = 'control-active';
  }

  return styling;
}

function updateControl (e) {
  if (props.selected === e) { return; }
  emit(CONTROL_UPDATE_EVENT, e);
}
</script>

<script>
export default {
  name: 'DtcOptionBarControlSelector',
};
</script>

<style>
.dtc-control-selector__button:not([control-active]) {
  background-color: transparent !important;
  border: currentColor 1px solid !important;
}
</style>
