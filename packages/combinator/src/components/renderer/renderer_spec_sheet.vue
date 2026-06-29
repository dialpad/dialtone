<template>
  <div class="dtc-spec-sheet">
    <div class="dtc-spec-sheet__grid">
      <!-- Background-click to select is a mouse convenience; the label button is
           the keyboard-accessible control, so these click/key a11y rules don't apply. -->
      <!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
      <!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
      <div
        v-for="cell in cells"
        :key="cell.name"
        class="dtc-spec-sheet__cell"
        @click="onCellClick($event, cell.name)"
      >
        <button
          type="button"
          class="dtc-spec-sheet__label"
          :aria-label="`Open preset: ${cell.name}`"
          @click.stop="emit('select', cell.name)"
        >
          <dt-text
            as="span"
            kind="label"
            :size="100"
            tone="secondary"
          >
            {{ cell.name }}
          </dt-text>
        </button>
        <div class="dtc-spec-sheet__preview">
          <div class="dtc-spec-sheet__component">
            <dtc-renderer-target
              :component="component"
              :bindings="cell.options.bindings.get()"
              :events="cell.info.events"
              @event="(name, value) => onCellEvent(cell, name, value)"
            >
              <template
                v-for="(slot, slotName) in nonEmptySlots(cell.options.slots)"
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
      <!-- eslint-enable vuejs-accessibility/no-static-element-interactions -->
      <!-- eslint-enable vuejs-accessibility/click-events-have-key-events -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { DtText } from '@dialpad/dialtone-vue';
import DtcRendererTarget from '@/src/components/renderer/renderer_target.vue';
import DtcNode from '@/src/components/tools/node.vue';
import { buildVariantState } from '@/src/lib/variant_state';
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
   * The dialtone-vue component documentation.
   */
  documentation: {
    type: Object,
    required: true,
  },
  /**
   * The variant bank for the component. Every key (except `defaults`/`exclusions`)
   * becomes a cell in the sheet.
   */
  variants: {
    type: Object,
    default: () => ({}),
  },
  /**
   * Library of components rendered in slots.
   */
  library: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['select']);

const variantNames = computed(() => {
  return Object.keys(props.variants ?? {})
    .filter(key => key !== 'exclusions' && key !== 'defaults');
});

// Each cell keeps its own reactive options so component interactions (e.g.
// toggling a DtToggle) take effect locally, independent of the other cells and
// of the single view.
const cells = computed(() => {
  return variantNames.value.map((name) => {
    const { info, options } = buildVariantState(
      props.component,
      props.documentation,
      props.variants,
      name,
    );
    return { name, info, options };
  });
});

/**
 * Selects a variant for the single view — but only when the click landed on the
 * cell's background, not inside the rendered component (whose own clicks should
 * drive its interactions). The label button selects via its own handler.
 *
 * @param {MouseEvent} e - The click event.
 * @param {string} name - The variant name.
 */
function onCellClick (e, name) {
  if (e.target.closest('.dtc-spec-sheet__component')) return;
  emit('select', name);
}

/**
 * Writes v-model-style events back into the cell's own reactive options so the
 * interaction is reflected in that cell (mirrors the single view's behavior).
 *
 * @param {object} cell - The cell whose options to update.
 * @param {string} name - The emitted event name (e.g. 'update:modelValue').
 * @param {*} value - The emitted value.
 */
function onCellEvent (cell, name, value) {
  if (!name?.startsWith('update:')) return;
  const prop = name.slice('update:'.length);
  const opts = cell.options;
  if (opts.props && prop in opts.props) opts.props[prop] = value;
  else if (opts.attributes && prop in opts.attributes) opts.attributes[prop] = value;
}
</script>

<script>
/**
 * Renders every variant of a component at once as a labeled "spec sheet" grid.
 * Components are interactive; clicking a cell's background (or its label button)
 * loads that variant into the editable single view.
 */
export default {
  name: 'DtcRendererSpecSheet',
};
</script>

<style lang="less">
.dtc-spec-sheet {
  flex: 1;
  overflow-y: auto;
  padding: var(--dt-spacing-400);
  background-color: var(--dt-color-surface-secondary);

  @media screen and (min-width: 640px) {
    min-block-size: var(--dt-size-925);
    max-block-size: var(--dt-size-950);
  }

  // In fullscreen the playground fills the viewport, so lift the embedded-height
  // cap and let the sheet grow to fill (scrolling internally) instead of cropping.
  :where(.dialtone-playground--fullscreen) & {
    max-block-size: none;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--dt-spacing-300);
  }

  &__cell {
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
  &__label {
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

  &__preview {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-block-size: var(--dt-size-700);
  }
}
</style>
