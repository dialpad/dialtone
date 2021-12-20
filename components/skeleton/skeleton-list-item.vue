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
import { SKELETON_SHAPES } from './skeleton_constants.js';
import DtSkeletonShape from './skeleton-shape';
import DtSkeletonParagraph from './skeleton-paragraph';

export default {
  name: 'DtSkeletonListItem',

  components: {
    DtSkeletonShape,
    DtSkeletonParagraph,
  },

  props: {
    shape: {
      type: String,
      default: 'circle',
      validator: shape => Object.keys(SKELETON_SHAPES).includes(shape),
    },

    shapeSize: {
      type: String,
      default: 'md',
    },

    paragraphs: {
      type: Object,
      default: () => ({ rows: 3, randomWidth: true }),
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

    shapeClass: {
      type: String,
      default: '',
    },

    contentClass: {
      type: String,
      default: '',
    },
  },
};
</script>
