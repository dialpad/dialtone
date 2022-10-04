<template>
  <div
    v-if="type === 'body'"
    ref="skeleton"
    data-qa="skeleton-text-body"
    :class="[
      'd-h8',
      'd-bar2',
      'skeleton-placeholder',
      {
        'skeleton-placeholder--animate': animate,
      },
      contentClass,
    ]"
    :style="{
      width,
      ...skeletonStyle,
    }"
  />
  <div
    v-else-if="type === 'heading'"
    ref="skeleton"
    data-qa="skeleton-text-heading"
    :class="[
      SKELETON_HEADING_HEIGHTS[headingHeight],
      'd-bar2',
      'skeleton-placeholder',
      {
        'skeleton-placeholder--animate': animate,
      },
      contentClass,
    ]"
    :style="{
      width,
      ...skeletonStyle,
    }"
  />
</template>

<script>
import { SKELETON_HEADING_HEIGHTS, SKELETON_TEXT_TYPES } from './skeleton_constants';
import SkeletonAnimation from '@/common/mixins/skeleton.js';

export default {
  name: 'DtSkeletonText',

  mixins: [SkeletonAnimation],

  props: {
    /**
     * Skeleton type
     * @values body, heading
     */
    type: {
      type: String,
      default: 'body',
      validator: type => SKELETON_TEXT_TYPES.includes(type),
    },

    /**
     * Heading height
     * @values sm, md, lg
     */
    headingHeight: {
      type: String,
      default: 'md',
      validator: headingHeight => Object.keys(SKELETON_HEADING_HEIGHTS).includes(headingHeight),
    },

    /**
     * Width of the skeleton
     */
    width: {
      type: String,
      default: '100%',
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
      default: false,
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
      type: String,
      default: '',
    },
  },

  data () {
    return {
      SKELETON_HEADING_HEIGHTS,
    };
  },
};
</script>
