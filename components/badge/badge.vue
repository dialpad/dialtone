<template>
  <span
    :class="[
      'd-badge',
      BADGE_TYPE_MODIFIERS[type],
      BADGE_KIND_MODIFIERS[kind],
    ]"
    data-qa="dt-badge"
  >
    <span
      v-if="iconLeft || type === 'ai'"
      class="d-badge__icon-left"
    >
      <dt-icon
        :name="iconLeft || 'dialpad-ai'"
        size="200"
      />
    </span>
    <span class="d-badge__label">
      <!-- @slot Slot for badge content, defaults to text prop -->
      <slot>
        {{ text }}
      </slot>
    </span>
    <span
      v-if="iconRight"
      class="d-badge__icon-right"
    >
      <dt-icon
        :name="iconRight"
        size="200"
      />
    </span>
  </span>
</template>

<script>
import { BADGE_TYPE_MODIFIERS, BADGE_KIND_MODIFIERS } from './badge_constants.js';
import { DtIcon } from '@/components/icon';

/**
 * A badge is a compact UI element that provides brief, descriptive information about an element.
 * It is terse, ideally one word.
 * @see https://dialpad.design/components/badge.html
 */
export default {
  name: 'DtBadge',

  components: {
    DtIcon,
  },

  props: {
    /**
     * Icon on the left side of the badge. Supports any valid icon name from the icon catalog at
     * https://dialpad.design/components/icon.html#icon-catalog. If type:'ai' is set, the ai icon
     * will automatically be shown here, but this can be overridden by setting this prop.
     */
    iconLeft: {
      type: String,
      default: '',
    },

    /**
     * Icon on the right side of the badge. Supports any valid icon name from the icon catalog at
     * https://dialpad.design/components/icon.html#icon-catalog
     */
    iconRight: {
      type: String,
      default: '',
    },

    /**
     * Text for the badge content
     */
    text: {
      type: String,
      default: '',
    },

    /**
     * The kind of badge which determines the styling
     * @values label, count
     */
    kind: {
      type: String,
      default: 'label',
      validator: (kind) => Object.keys(BADGE_KIND_MODIFIERS).includes(kind),
    },

    /**
     * Color for the badge background
     * @values default, info, success, warning, critical, bulletin, ai
     */
    type: {
      type: String,
      default: 'default',
      validator: (type) => Object.keys(BADGE_TYPE_MODIFIERS).includes(type),
    },
  },

  data () {
    return {
      BADGE_TYPE_MODIFIERS,
      BADGE_KIND_MODIFIERS,
    };
  },

  watch: {
    $props: {
      immediate: true,
      deep: true,
      handler () {
        this.validateProps();
      },
    },
  },

  methods: {
    validateProps () {
      if (this.type === 'ai' && this.kind === 'count') {
        console.error('DtBadge error: type: \'ai\' with kind: \'count\' is an invalid combination.');
      }
    },
  },
};
</script>
