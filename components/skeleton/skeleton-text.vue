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
    type: {
      type: String,
      default: 'body',
      validator: type => SKELETON_TEXT_TYPES.includes(type),
    },

    headingHeight: {
      type: String,
      default: 'md',
      validator: headingHeight => Object.keys(SKELETON_HEADING_HEIGHTS).includes(headingHeight),
    },

    width: {
      type: String,
      default: '100%',
    },

    animationDuration: {
      type: Number,
      default: -1,
    },

    animate: {
      type: Boolean,
      default: false,
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
      SKELETON_HEADING_HEIGHTS,
    };
  },
};
</script>
