<!-- eslint-disable vue/no-restricted-class -->
<template>
  <component
    :is="listElement"
    data-qa="dt-text-list"
    :class="textListClasses"
    :role="role"
    :start="orderedStart"
    :reversed="orderedReversed"
  >
    <!-- @slot Text list items. Use DtTextListItem as the direct child. -->
    <slot />
  </component>
</template>

<script setup lang="ts">
// @ts-nocheck
import {
  Comment,
  Fragment,
  Text,
  computed,
  onMounted,
  provide,
  toRef,
  useSlots,
} from 'vue';
import {
  DT_TEXT_LIST_CONTEXT,
  DT_TEXT_LIST_DEFAULT_GAP,
  DT_TEXT_LIST_DEFAULT_TYPE,
  DT_TEXT_LIST_ORDERED_MARKERS,
  DT_TEXT_LIST_UNORDERED_MARKERS,
} from './TextListConstants';
import {
  textListGapValidator,
  textListMarkerToneValidator,
  textListMarkerValidator,
  textListTypeValidator,
} from './Validators';

defineOptions({
  name: 'DtTextList',
});

const props = defineProps({
  /**
   * Semantic list type. Sets the rendered element to `ul` or `ol`.
   * @values unordered, ordered
   */
  type: {
    type: String,
    default: DT_TEXT_LIST_DEFAULT_TYPE,
    validator: textListTypeValidator,
  },

  /**
   * Visual marker style. Leave unset for automatic depth-aware markers.
   * @values disc, circle, square, decimal, lower-alpha, upper-alpha, lower-roman, upper-roman, none
   */
  marker: {
    type: String,
    default: undefined,
    validator: textListMarkerValidator,
  },

  /**
   * Marker foreground tone. Uses the same tone vocabulary as DtText.
   * @values primary, secondary, tertiary, muted, disabled, placeholder, critical, critical-strong, positive, positive-strong, warning, info, info-strong, neutral-black, neutral-white
   */
  markerTone: {
    type: String,
    default: undefined,
    validator: textListMarkerToneValidator,
  },

  /**
   * Space between list items and before nested lists.
   * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400
   */
  gap: {
    type: String,
    default: DT_TEXT_LIST_DEFAULT_GAP,
    validator: textListGapValidator,
  },

  /**
   * Starting number for ordered lists.
   */
  start: {
    type: Number,
    default: undefined,
  },

  /**
   * Reverse ordered list numbering.
   */
  reversed: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();

provide(DT_TEXT_LIST_CONTEXT, {
  type: toRef(props, 'type'),
});

const isOrdered = computed(() => props.type === 'ordered');
const listElement = computed(() => isOrdered.value ? 'ol' : 'ul');
// Safari drops list semantics when list-style is none; restore them explicitly.
const role = computed(() => props.marker === 'none' ? 'list' : undefined);
const orderedStart = computed(() => isOrdered.value ? props.start : undefined);
const orderedReversed = computed(() => isOrdered.value && props.reversed ? true : undefined);

const textListClasses = computed(() => [
  'd-text-list',
  props.gap === DT_TEXT_LIST_DEFAULT_GAP ? null : `d-text-list--gap-${props.gap}`,
  {
    'd-text-list--ordered': isOrdered.value,
  },
  props.marker ? `d-text-list--marker-${props.marker}` : null,
  props.markerTone ? `d-text-list--marker-tone-${props.markerTone}` : null,
]);

// eslint-disable-next-line no-console
const warn = message => console.warn(`[DtTextList] ${message}`);

function validateOrderedOnlyProps () {
  if (isOrdered.value) return;

  if (props.start !== undefined) {
    warn('The start prop only applies when type="ordered".');
  }

  if (props.reversed) {
    warn('The reversed prop only applies when type="ordered".');
  }
}

function validateMarkerFamily () {
  if (!props.marker || props.marker === 'none') return;

  if (props.type === 'ordered' && DT_TEXT_LIST_UNORDERED_MARKERS.includes(props.marker)) {
    warn(`The marker="${props.marker}" value is usually used with type="unordered".`);
  }

  if (props.type === 'unordered' && DT_TEXT_LIST_ORDERED_MARKERS.includes(props.marker)) {
    warn(`The marker="${props.marker}" value is usually used with type="ordered".`);
  }
}

function isTextListItem (vnode) {
  const name = typeof vnode.type === 'string' ? vnode.type : (vnode.type.name || vnode.type.__name);
  return name === 'DtTextListItem' || name === 'dt-text-list-item';
}

function isIgnorableText (vnode) {
  return vnode.type === Text && typeof vnode.children === 'string' && vnode.children.trim() === '';
}

function flattenSlotVNodes (vnodes) {
  return vnodes.flatMap((vnode) => {
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      return flattenSlotVNodes(vnode.children);
    }
    return [vnode];
  });
}

function validateChildren () {
  const directChildren = flattenSlotVNodes(slots.default?.() ?? []);
  for (const child of directChildren) {
    if (child.type === Comment || isIgnorableText(child)) continue;
    if (isTextListItem(child)) continue;

    warn('Use DtTextListItem as the direct child of DtTextList.');
    break;
  }
}

onMounted(() => {
  // Guard the whole block (not just the warn calls) so production builds
  // dead-code-eliminate the extra slot render in validateChildren().
  if (process.env.NODE_ENV !== 'production') {
    validateOrderedOnlyProps();
    validateMarkerFamily();
    validateChildren();
  }
});
</script>
