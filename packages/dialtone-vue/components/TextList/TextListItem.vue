<!-- eslint-disable vue/no-restricted-class -->
<template>
  <li
    data-qa="dt-text-list-item"
    :class="textListItemClasses"
    :value="orderedValue"
  >
    <span
      v-if="hasCustomMarker"
      data-qa="dt-text-list-item-marker"
      class="d-text-list__item-marker"
      :class="markerClass"
      aria-hidden="true"
    >
      <!-- @slot Custom marker content. Decorative by default. -->
      <slot name="marker" />
    </span>
    <div
      data-qa="dt-text-list-item-content"
      :class="['d-text-list__item-content', contentClass]"
    >
      <!-- @slot Text list item content. -->
      <slot />
    </div>
  </li>
</template>

<script setup lang="ts">
// @ts-nocheck
import {
  computed,
  inject,
  onMounted,
  unref,
  useSlots,
} from 'vue';
import { hasSlotContent } from '@/common/utils';
import { DT_TEXT_LIST_CONTEXT } from './TextListConstants';
import { textListMarkerToneValidator } from './Validators';

defineOptions({
  name: 'DtTextListItem',
});

const props = defineProps({
  /**
   * Native `li` value for ordered lists.
   */
  value: {
    type: Number,
    default: undefined,
  },

  /**
   * Marker foreground tone for this item. Overrides the parent DtTextList markerTone.
   * @values primary, secondary, tertiary, muted, disabled, placeholder, critical, critical-strong, positive, positive-strong, warning, info, info-strong, neutral-black, neutral-white
   */
  markerTone: {
    type: String,
    default: undefined,
    validator: textListMarkerToneValidator,
  },

  /**
   * Additional class name for the marker wrapper.
   */
  markerClass: {
    type: [String, Array, Object],
    default: '',
  },

  /**
   * Additional class name for the content wrapper.
   */
  contentClass: {
    type: [String, Array, Object],
    default: '',
  },
});

const slots = useSlots();
const parentContext = inject(DT_TEXT_LIST_CONTEXT, null);
const parentType = computed(() => parentContext ? unref(parentContext.type) : undefined);
const hasCustomMarker = computed(() => hasSlotContent(slots.marker));
const orderedValue = computed(() => parentType.value === 'ordered' ? props.value : undefined);
const textListItemClasses = computed(() => [
  'd-text-list__item',
  { 'd-text-list__item--custom-marker': hasCustomMarker.value },
  props.markerTone ? `d-text-list__item--marker-tone-${props.markerTone}` : null,
]);

// eslint-disable-next-line no-console
const warn = message => console.warn(`[DtTextListItem] ${message}`);

onMounted(() => {
  if (process.env.NODE_ENV !== 'production') {
    if (!parentContext) {
      warn('DtTextListItem must be used inside DtTextList.');
    }

    if (props.value !== undefined && parentType.value !== 'ordered') {
      warn('The value prop only applies inside a DtTextList with type="ordered".');
    }
  }
});
</script>
