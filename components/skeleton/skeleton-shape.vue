<template>
  <div
    ref="skeleton"
    data-qa="skeleton-shape"
    :class="[
      'skeleton-placeholder',
      SKELETON_SHAPES[shape],
      {
        'skeleton-placeholder--animate': animate,
      },
      contentClass,
    ]"
    :style="shapeStyles"
  />
</template>

<script>
import SkeletonAnimation from '../../common/mixins/skeleton.js';
import {
  SKELETON_SHAPES,
  SKELETON_SHAPE_SIZES,
} from './skeleton_constants';

export default {
  name: 'DtSkeletonShape',

  mixins: [SkeletonAnimation],

  props: {
    /**
     * Defines the shape of the skeleton, accepts circle or square.
     * @values circle, square
     */
    shape: {
      type: String,
      default: 'circle',
      validator: shape => Object.keys(SKELETON_SHAPES).includes(shape),
    },

    /**
     * Size of the shape
     * @values xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: 'md',
    },

    /**
     * Duration time of the animation (ms), set -1 for an infinite animation.
     */
    animationDuration: {
      type: Number,
      default: -1,
    },

    /**
     * This property has higher priority than "option.animate"
     * @values true, false
     */
    animate: {
      type: Boolean,
      default: true,
    },

    /**
     * RippleDuration controls how long the delay is for the animation of a
     * placeholder 1000 pixels from the top of the page. Each placeholder
     * from the top down will have a delay duration from 0 to this offset.
     * The delay of each placeholder animation is based on how far down the page
     * the placeholder is rendered. This is a linear relationship. The unit
     * is milliseconds.
     */
    offset: {
      type: Number,
      default: 1,
    },

    /**
     * Additional class name for the content.
     */
    contentClass: {
      type: [String, Object, Array],
      default: '',
    },
  },

  data () {
    return {
      SKELETON_SHAPES,
    };
  },

  computed: {
    shapeStyles () {
      const size = SKELETON_SHAPE_SIZES[this.size] || this.size;
      return {
        ...this.skeletonStyle,
        'min-width': size,
        'max-width': size,
        'min-height': size,
        'max-height': size,
      };
    },
  },
};
</script>
