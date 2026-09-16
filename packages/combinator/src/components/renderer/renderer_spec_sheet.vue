<template>
  <div class="dtc-spec-sheet">
    <div class="dtc-spec-sheet__grid">
      <dtc-renderer-spec-sheet-cell
        v-for="cell in cells"
        :key="cell.name"
        :component="component"
        :library="library"
        :name="cell.name"
        :info="cell.info"
        :options="cell.options"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import DtcRendererSpecSheetCell from '@/src/components/renderer/renderer_spec_sheet_cell.vue';
import { buildVariantState, listVariantNames } from '@/src/lib/variant_state';

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

const variantNames = computed(() => listVariantNames(props.variants));

// Each cell gets its own reactive options (and its own child component), so a
// component interaction in one cell stays local and never re-renders the others.
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
}
</style>
