<template>
  <div
    :class="[
      'd-w100p',
      contentClass,
    ]"
    contentClass
    data-qa="skeleton-paragraph"
  >
    <dt-skeleton-text
      v-for="row in integerRows"
      :key="row"
      data-qa="skeleton-paragraph-row"
      :class="[
        {
          'd-mb12': row !== integerRows,
        },
      ]"
      :content-class="rowClass"
      :animate="animate"
      :offset="offset"
      :animation-duration="animationDuration"
      :width="getSizeParagraphRow(row)"
    />
  </div>
</template>

<script>
import DtSkeletonText from './skeleton-text.vue';

const validator = number => number !== '' && !Number.isNaN(Number(number));
export default {
  name: 'DtSkeletonParagraph',
  components: {
    DtSkeletonText,
  },

  props: {
    /**
     * Quantity of rows to display
     */
    rows: {
      type: [Number, String],
      default: 3,
      validator,
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
     * Controls the min width of paragraphs
     */
    minWidth: {
      type: [Number, String],
      default: 30,
      validator,
    },

    /**
     * Controls the max width of paragraphs
     */
    maxWidth: {
      type: [Number, String],
      default: 100,
      validator,
    },

    /**
     * Controls the width of paragraphs
     */
    width: {
      type: [String, Array],
      default: null,
    },

    /**
     * If true, row widths will be random
     * @values true, false
     */
    randomWidth: {
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
     * Duration time of the animation (ms), set -1 for an infinite animation.
     */
    animationDuration: {
      type: Number,
      default: -1,
    },

    /**
     * Additional class name for the content.
     */
    contentClass: {
      type: String,
      default: '',
    },

    /**
     * Additional class name for the row.
     */
    rowClass: {
      type: String,
      default: '',
    },
  },

  computed: {
    integerRows () {
      return Number(this.rows);
    },
  },

  methods: {
    randomWidthPercentage () {
      const min = Math.min(this.minWidth, this.maxWidth);
      const max = Math.max(this.minWidth, this.maxWidth);
      return `${Math.round(Math.random() * (max - min)) + min}%`;
    },

    getSizeParagraphRow (row) {
      const paragraphWidth = this.width;
      const isArrayWidth = Array.isArray(paragraphWidth);
      const currentWidth = paragraphWidth?.[row - 1];
      const isLastRow = row === this.rows;

      if (this.randomWidth) {
        return this.randomWidthPercentage();
      }

      if (paragraphWidth && !isArrayWidth) {
        return paragraphWidth;
      }

      if (paragraphWidth && isArrayWidth && currentWidth) {
        return currentWidth;
      }

      return isLastRow ? '38%' : '100%';
    },
  },
};
</script>
