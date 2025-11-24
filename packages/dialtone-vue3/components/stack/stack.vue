<template>
  <component
    :is="as"
    data-qa="dt-stack"
    :class="[
      'd-stack',
      defaultDirection,
      defaultGap,
      defaultAlign,
      defaultJustify,
      stackResponsive,
    ]"
  >
    <!-- @slot Slot for main content -->
    <slot />
  </component>
</template>

<script>
import { DT_STACK_DIRECTION, DT_STACK_GAP, DT_STACK_RESPONSIVE_BREAKPOINTS, DT_STACK_ALIGN, DT_STACK_JUSTIFY } from './stack_constants';
import { directionValidator, gapValidator, alignValidator, justifyValidator } from './validators';
import { getDefaultDirectionClass, getResponsiveClasses, getDefaultGapClass, getDefaultAlignClass, getDefaultJustifyClass } from './utils';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtStack',

  props: {
    /**
     * Set this prop to the direction to stack the items.
     * You can override the default direction with 'default' key.
     * All the undefined breakpoints will have 'default' value.
     * By default, for the column direction it will have `justify-content: flex-start`
     * and for the row direction `align-items: center`. This can be overriden
     * by utility classes.
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
     * The gap property controls the spacing between items in the stack.
     * The gap can be set to a string, or object with breakpoints.
     * All the undefined breakpoints will have the 'default' value.
     * You can override the default gap with 'default' key.
     * In case of string, it will be applied to all the breakpoints.
     * Valid values are '0', '50', '100', '200', '300', '350', '400', '450', '500', '525', '550', '600', '625', '650', '700'.
     */
    gap: {
      type: [String, Object],
      default: '0',
      validator: (gap) => gapValidator(gap),
    },

    /**
     * The align property controls the alignment of items along the cross axis.
     * The align can be set to a string, or object with breakpoints.
     * All the undefined breakpoints will have the 'default' value.
     * You can override the default align with 'default' key.
     * In case of string, it will be applied to all the breakpoints.
     * Valid values are 'normal', 'start', 'center', 'end', 'stretch', 'baseline'.
     */
    align: {
      type: [String, Object],
      default: 'normal',
      validator: (align) => alignValidator(align),
    },

    /**
     * The justify property controls the justification of items along the main axis.
     * The justify can be set to a string, or object with breakpoints.
     * All the undefined breakpoints will have the 'default' value.
     * You can override the default justify with 'default' key.
     * In case of string, it will be applied to all the breakpoints.
     * Valid values are 'start', 'center', 'end', 'around', 'between', 'evenly'.
     */
    justify: {
      type: [String, Object],
      default: 'start',
      validator: (justify) => justifyValidator(justify),
    },
  },

  data () {
    return {
      DT_STACK_DIRECTION,
      DT_STACK_GAP,
      DT_STACK_RESPONSIVE_BREAKPOINTS,
      DT_STACK_ALIGN,
      DT_STACK_JUSTIFY,
    };
  },

  computed: {
    defaultGap () {
      return getDefaultGapClass(this.gap);
    },

    defaultDirection () {
      return getDefaultDirectionClass(this.direction);
    },

    defaultAlign () {
      return getDefaultAlignClass(this.align);
    },

    defaultJustify () {
      return getDefaultJustifyClass(this.justify);
    },

    stackResponsive () {
      return getResponsiveClasses(this.direction, this.gap, this.align, this.justify);
    },
  },
};
</script>
