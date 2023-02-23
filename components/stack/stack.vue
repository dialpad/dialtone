<template>
  <component
    :is="as"
    :class="[
      'd-stack',
      defaultDirection,
      stackResponsive,
      stackGap,
    ]"
  >
    <!-- @slot Slot for main content -->
    <slot />
  </component>
</template>

<script>
import { DT_STACK_DIRECTION, DT_STACK_GAP, DT_STACK_RESPONSIVE_BREAKPOINTS } from './stack_constants';
import { directionValidator, gapValidator } from './validators';
import { getDefaultDirectionClass, getResponsiveClasses, getGapClass } from './utils';

export default {
  name: 'DtStack',

  props: {
    /**
     * Set this prop to the direction to stack the items.
     * You can override the default direction with 'default' key.
     * All the undefined breakpoints will have 'default' value
     */
    direction: {
      type: [String, Object],
      default: 'column',
      validator: (direction) => directionValidator(direction),
    },

    /**
     * Set this prop to render stack as a specific HTML element.
     */
    as: {
      type: String,
      default: 'div',
    },

    /**
     * Set this prop to have the space between each stack item
     * @values 0, 100, 200, 300, 400, 500, 600
     */
    gap: {
      type: String,
      default: '0',
      validator: (gap) => gapValidator(gap),
    },
  },

  data () {
    return {
      DT_STACK_DIRECTION,
      DT_STACK_GAP,
      DT_STACK_RESPONSIVE_BREAKPOINTS,
    };
  },

  computed: {
    stackGap () {
      return getGapClass(this.gap);
    },

    defaultDirection () {
      return getDefaultDirectionClass(this.direction);
    },

    stackResponsive () {
      return getResponsiveClasses(this.direction);
    },
  },
};
</script>
