<template>
  <div
    data-qa="skeleton-list-item"
    :class="[
      'd-d-flex',
      {
        'd-ai-center': paragraphs.rows === 1,
      },
      contentClass,
    ]"
  >
    <dt-skeleton-shape
      class="d-mr8"
      :size="shapeSize"
      :shape="shape"
      :animation-duration="animationDuration"
      :animate="animate"
      :offset="offset"
      :content-class="shapeClass"
    />
    <div class="d-d-flex d-fd-column d-w100p">
      <dt-skeleton-paragraph
        v-bind="paragraphs"
        :animation-duration="animationDuration"
        :animate="animate"
        :offset="offset"
      />
    </div>
  </div>
</template>

<script>
import { SKELETON_SHAPES } from './skeleton_constants';
import DtSkeletonShape from './skeleton-shape.vue';
import DtSkeletonParagraph from './skeleton-paragraph.vue';

export default {
  name: 'DtSkeletonListItem',

  components: {
    DtSkeletonShape,
    DtSkeletonParagraph,
  },

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
    shapeSize: {
      type: String,
      default: 'md',
    },

    /**
     * Object containing quantity of paragraphs to display
     * and a randomWidth boolean.
     */
    paragraphs: {
      type: Object,
      default: () => ({ rows: 3, randomWidth: true }),
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
     * Additional class name for the shape.
     */
    shapeClass: {
      type: String,
      default: '',
    },

    /**
     * Additional class name for the content.
     */
    contentClass: {
      type: String,
      default: '',
    },
  },
};
</script>
