<template>
  <!-- Background-click to select is a mouse convenience; the label button is
       the keyboard-accessible control, so these click/key a11y rules don't apply. -->
  <!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
  <!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
  <div
    class="dtc-spec-sheet__cell"
    @click="onCellClick"
  >
    <!-- eslint-enable vuejs-accessibility/no-static-element-interactions -->
    <!-- eslint-enable vuejs-accessibility/click-events-have-key-events -->
    <button
      type="button"
      class="dtc-spec-sheet__label"
      :aria-label="`Open preset: ${name}`"
      @click.stop="emit('select', name)"
    >
      <dt-text
        as="span"
        kind="label"
        :size="100"
        tone="secondary"
      >
        {{ name }}
      </dt-text>
    </button>
    <div class="dtc-spec-sheet__preview">
      <div class="dtc-spec-sheet__component">
        <dtc-renderer-target
          :component="component"
          :bindings="bindings"
          :events="info.events"
          :disabled-members="disabledMembers"
          @event="onCellEvent"
        >
          <template
            v-for="(slot, slotName) in renderedSlots"
            :key="slotName"
            #[slotName]="slotBindings"
          >
            <dtc-node
              :template="slot"
              :library="library"
              :scope="slotBindings"
            />
          </template>
        </dtc-renderer-target>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { DtText } from '@dialpad/dialtone-vue';
import DtcRendererTarget from '@/src/components/renderer/renderer_target.vue';
import DtcNode from '@/src/components/tools/node.vue';
import { computeDisabledMembers, writeUpdateEvent } from '@/src/lib/variant_state';
import { nonEmptySlots } from '@/src/lib/utils';

const props = defineProps({
  /**
   * Target component.
   */
  component: {
    type: Object,
    required: true,
  },
  /**
   * Library of components rendered in slots.
   */
  library: {
    type: Object,
    default: () => ({}),
  },
  /**
   * The variant name shown as the cell's label.
   */
  name: {
    type: String,
    required: true,
  },
  /**
   * The merged info object for this variant.
   */
  info: {
    type: Object,
    required: true,
  },
  /**
   * The cell's own reactive options ({ props, attributes, slots, bindings }).
   * Owning it per cell keeps each cell's reactivity (and re-renders) isolated.
   */
  options: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['select']);

// All three derive from this cell's own reactive options, so only this cell
// re-renders when its options mutate — interactions don't fan out to siblings.
const bindings = computed(() => props.options.bindings.get());
const disabledMembers = computed(() => {
  return computeDisabledMembers(props.info, props.options.props, props.options.slots);
});
const renderedSlots = computed(() => nonEmptySlots(props.options.slots));

/**
 * Selects this variant for the single view — but only when the click landed on
 * the cell's background, not inside the rendered component (whose own clicks
 * should drive its interactions). The label button selects via its own handler.
 *
 * @param {MouseEvent} e - The click event.
 */
function onCellClick (e) {
  if (!(e.target instanceof Element) || e.target.closest('.dtc-spec-sheet__component')) return;
  emit('select', props.name);
}

/**
 * Writes v-model-style events back into this cell's own reactive options so the
 * interaction is reflected locally (mirrors the single view's behavior).
 *
 * @param {string} name - The emitted event name (e.g. 'update:modelValue').
 * @param {*} value - The emitted value.
 */
function onCellEvent (name, value) {
  writeUpdateEvent(props.options, name, value);
}
</script>

<script>
/**
 * A single labeled cell of the spec sheet: renders one variant of the target
 * component and lets the user load it into the editable single view.
 */
export default {
  name: 'DtcRendererSpecSheetCell',
};
</script>

<style lang="less">
.dtc-spec-sheet__cell {
  display: flex;
  flex-direction: column;
  gap: var(--dt-spacing-200);
  padding: var(--dt-spacing-300);
  border: var(--dt-size-border-100) solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-300);
  cursor: pointer;
  transition: border-color 0.15s ease-in-out;

  &:hover {
    border-color: var(--dt-color-border-default);
  }
}

// Button reset — the preset name is the keyboard-accessible "open variant" control.
.dtc-spec-sheet__label {
  align-self: flex-start;
  max-inline-size: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:focus-visible {
    outline: var(--dt-size-border-200) solid var(--dt-color-border-focus);
    outline-offset: var(--dt-spacing-25);
    border-radius: var(--dt-size-radius-200);
  }
}

.dtc-spec-sheet__preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: var(--dt-size-700);
}
</style>
