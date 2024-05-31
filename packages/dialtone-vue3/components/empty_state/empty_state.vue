<template>
  <dt-stack
    :class="emptyStateClasses"
  >
    <template v-if="showIllustration">
      <dt-icon
        v-if="showIcon"
        :name="iconName"
        size="800"
      />

      <dt-illustration
        v-if="showIllustrationComponent"
        :name="illustrationName"
      />
    </template>

    <dt-stack
      gap="450"
      class="d-empty-state--content"
    >
      <div :class="['d-empty-state--header-text', headlineClass]">
        {{ headerText }}
      </div>

      <p
        v-if="bodyText"
        :class="['d-empty-state--body-text', bodyClass]"
      >
        {{ bodyText }}
      </p>
    </dt-stack>

    <slot name="body" />
  </dt-stack>
</template>

<script setup>
import { useSlots, computed, onMounted } from 'vue';
import { EMPTY_STATE_SIZE_MODIFIERS } from './empty_state_constants.js';
import { DtIllustration, ILLUSTRATION_NAMES } from '@/components/illustration';
import { DtIcon, ICON_NAMES } from '@/components/icon';
import { DtStack } from '@/components/stack';
import { hasSlotContent } from '@/common/utils';

const slots = useSlots();

const props = defineProps({
  /**
    * The empty state size.
    * @values 'sm', 'md', 'lg'
    */
  size: {
    type: String,
    default: 'lg',
    validator: (s) => Object.keys(EMPTY_STATE_SIZE_MODIFIERS).includes(s),
  },

  /**
    * The illustration name in kebab-case
   * This only displays when size is 'lg' or 'md'
   * This has priority over icon.
    * @type {String}
    */
  illustrationName: {
    type: String,
    default: null,
    validator: (name) => ILLUSTRATION_NAMES.includes(name),
  },

  /**
    * The icon name in kebab-case
   * This will be shown in 'lg' and 'md' size only if illustrationName prop is not provided and
   * Will always be shown in 'sm' size.
    * @type {String}
    */
  iconName: {
    type: String,
    default: null,
    validator: (name) => ICON_NAMES.includes(name),
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
    * Whether to show the illustration
    * @type {Boolean}
    */
  showIllustration: {
    type: Boolean,
    default: true,
  },
});

const notSmSize = computed(() => props.size !== 'sm');

const showIllustrationComponent = computed(() => props.illustrationName && notSmSize.value);

const showIcon = computed(() => {
  if (!props.iconName) {
    return false;
  }
  return !(props.illustrationName && notSmSize.value);
});

const sizeClass = computed(() => EMPTY_STATE_SIZE_MODIFIERS[props.size]);

const emptyStateClasses = computed(() => ['d-empty-state', sizeClass.value]);

const headlineClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'd-headline--md';
    case 'md':
      return 'd-headline--xl';
    case 'lg':
      return 'd-headline--xxl';
    default:
      return 'd-headline--xxl';
  }
});

const bodyClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'd-body--sm';
    case 'md':
      return 'd-body--sm';
    case 'lg':
      return 'd-body--md';
    default:
      return 'd-body--md';
  }
});

onMounted(() => {
  if (!props.bodyText && !hasSlotContent(slots.body)) {
    console.warn('Dialtone Empty State component: You should provide either bodyText or content on body slot.');
  }
});
</script>
