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
import { DtSkeletonText } from './index';

const validator = number => number !== '' && !Number.isNaN(Number(number));
export default {
  name: 'DtSkeletonParagraph',
  components: {
    DtSkeletonText,
  },

  props: {
    rows: {
      type: [Number, String],
      default: 3,
      validator,
    },

    animate: {
      type: Boolean,
      default: true,
    },

    minWidth: {
      type: [Number, String],
      default: 30,
      validator,
    },

    maxWidth: {
      type: [Number, String],
      default: 100,
      validator,
    },

    width: {
      type: [String, Array],
      default: null,
    },

    randomWidth: {
      type: Boolean,
      default: false,
    },

    offset: {
      type: Number,
      default: 1,
    },

    animationDuration: {
      type: Number,
      default: -1,
    },

    contentClass: {
      type: String,
      default: '',
    },

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
