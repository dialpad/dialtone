<template>
  <dt-stack
    :class="emptyStateClasses"
  >
    <span
      v-if="showIllustration"
      :class="['d-empty-state__illustration', illustrationClass]"
    >
      <!-- @slot Slot for the illustration. Displays when size is 'lg' or 'md'. Overrides icon. -->
      <slot name="illustration" />
    </span>

    <span
      v-if="showIcon"
      :class="['d-empty-state__icon', iconClass]"
    >
      <!-- @slot Slot for the icon. Displayed if illustration is not provided. -->
      <slot
        name="icon"
        :icon-size="'800'"
      />
    </span>

    <dt-stack
      gap="150"
      :class="['d-empty-state__content', contentClass]"
    >
      <dt-text
        kind="headline"
        :size="headlineSize"
        :density="headlineDensity"
        wrap="balance"
        as="div"
        class="d-empty-state__header-text"
      >
        {{ headerText }}
      </dt-text>

      <dt-text
        v-if="bodyText"
        kind="body"
        :size="bodySize"
        :density="bodyDensity"
        tone="secondary"
        wrap="balance"
        as="p"
        class="d-empty-state__body-text"
      >
        {{ bodyText }}
      </dt-text>
    </dt-stack>

    <div
      v-if="hasSlotContent(slots.body)"
      :class="bodyClass"
    >
      <slot name="body" />
    </div>
  </dt-stack>
</template>

<script setup>
import { useSlots, computed, onMounted } from 'vue';
import { DtStack } from '@/components/stack';
import { DtText } from '@/components/text';
import { hasSlotContent } from '@/common/utils';
import {
  EMPTY_STATE_BODY_DENSITIES,
  EMPTY_STATE_BODY_SIZES,
  EMPTY_STATE_CONTENT_SIZE_MODIFIERS,
  EMPTY_STATE_HEADLINE_DENSITIES,
  EMPTY_STATE_HEADLINE_SIZES,
  EMPTY_STATE_SIZE_MODIFIERS,
} from './EmptyStateConstants.js';

defineOptions({
  name: 'DtEmptyState',
});

const slots = useSlots();

const props = defineProps({
  /**
    * The empty state size.
    * @values 200, 300, 400
    */
  size: {
    type: [String, Number],
    default: 400,
    validator: (s) => Object.keys(EMPTY_STATE_SIZE_MODIFIERS).includes(String(s)),
  },

  /**
    * Header text
    * @type {String}
    */
  headerText: {
    type: String,
    required: true,
  },

  /**
    * Body text
    * @type {String}
    */
  bodyText: {
    type: String,
    default: null,
  },

  /**
    * Additional class name for the illustration wrapper element.
    */
  illustrationClass: {
    type: [String, Array, Object],
    default: '',
  },

  /**
    * Additional class name for the icon wrapper element.
    */
  iconClass: {
    type: [String, Array, Object],
    default: '',
  },

  /**
    * Additional class name for the body slot wrapper element.
    */
  bodyClass: {
    type: [String, Array, Object],
    default: '',
  },
});

const hasIcon = computed(() => {
  return hasSlotContent(slots.icon);
});
const hasIllustration = computed(() => hasSlotContent(slots.illustration));

/**
 * Icon will be shown in lg and md size only if illustration is not provided
 * Icon will always be shown in sm size
 */
const showIcon = computed(() => hasIcon.value && (!hasIllustration.value || isSmallSize.value));

/**
 * Illustration will always be shown in lg and md size
 * Illustration will not be shown in sm size
 */
const showIllustration = computed(() => hasIllustration.value && !isSmallSize.value);

const sizeKey = computed(() => String(props.size));
const isSmallSize = computed(() => sizeKey.value === 'sm' || sizeKey.value === '200');

const sizeClass = computed(() => EMPTY_STATE_SIZE_MODIFIERS[sizeKey.value]);

const emptyStateClasses = computed(() => ['d-empty-state', sizeClass.value]);

const contentClass = computed(() => EMPTY_STATE_CONTENT_SIZE_MODIFIERS[sizeKey.value]);

const headlineSize = computed(() => EMPTY_STATE_HEADLINE_SIZES[sizeKey.value]);
const headlineDensity = computed(() => EMPTY_STATE_HEADLINE_DENSITIES[sizeKey.value]);

const bodySize = computed(() => EMPTY_STATE_BODY_SIZES[sizeKey.value]);
const bodyDensity = computed(() => EMPTY_STATE_BODY_DENSITIES[sizeKey.value]);

onMounted(() => {
  if (!props.bodyText && !hasSlotContent(slots.body)) {
    console.error('DtEmptyState: You should provide either bodyText or content on body slot.');
  }
});
</script>
