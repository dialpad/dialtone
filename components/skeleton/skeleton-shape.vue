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
import SkeletonAnimation from '../mixins/skeleton.js';
import {
  SKELETON_SHAPES,
  SKELETON_SHAPE_SIZES,
} from './skeleton_constants';

export default {
  name: 'DtSkeletonShape',

  mixins: [SkeletonAnimation],

  props: {
    shape: {
      type: String,
      default: 'circle',
      validator: shape => Object.keys(SKELETON_SHAPES).includes(shape),
    },

    size: {
      type: String,
      default: 'md',
    },

    animationDuration: {
      type: Number,
      default: -1,
    },

    animate: {
      type: Boolean,
      default: true,
    },

    offset: {
      type: Number,
      default: 1,
    },

    contentClass: {
      type: String,
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
