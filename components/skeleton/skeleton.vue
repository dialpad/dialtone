<template>
  <div
    aria-busy="true"
    role="status"
    :aria-label="ariaLabel"
  >
    <dt-skeleton-list-item
      v-if="listItemOption"
      v-bind="listItemOption === true ? {} : listItemOption"
      :animation-duration="animationDuration"
      :animate="animate"
      :offset="offset"
    />
    <dt-skeleton-shape
      v-else-if="shapeOption"
      v-bind="shapeOption === true ? {} : shapeOption"
      :animation-duration="animationDuration"
      :animate="animate"
      :offset="offset"
    />
    <dt-skeleton-paragraph
      v-else-if="paragraphOption"
      v-bind="paragraphOption === true ? {} : paragraphOption"
      :animation-duration="animationDuration"
      :animate="animate"
      :offset="offset"
    />
    <dt-skeleton-text
      v-else
      v-bind="textOption || {}"
      :animation-duration="animationDuration"
      :animate="animate"
      :offset="offset"
    />
  </div>
</template>

<script>
import DtSkeletonShape from './skeleton-shape';
import DtSkeletonListItem from './skeleton-list-item';
import DtSkeletonParagraph from './skeleton-paragraph';
import DtSkeletonText from './skeleton-text';

export default {
  name: 'DtSkeleton',
  components: {
    DtSkeletonText,
    DtSkeletonShape,
    DtSkeletonListItem,
    DtSkeletonParagraph,
  },

  props: {
    paragraphOption: {
      type: [Object, Boolean],
      default: null,
    },

    listItemOption: {
      type: [Object, Boolean],
      default: null,
    },

    textOption: {
      type: Object,
      default: null,
    },

    shapeOption: {
      type: [Object, Boolean],
      default: null,
    },

    animationDuration: {
      type: Number,
      default: -1,
    },

    ariaLabel: {
      type: String,
      default: '',
    },

    animate: {
      type: Boolean,
      default: true,
    },

    offset: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    validationOptions () {
      return {
        paragraphOption: this.paragraphOption,
        listItemOption: this.listItemOption,
        textOption: this.textOption,
        shapeOption: this.shapeOption,
      };
    },
  },

  watch: {
    $props: {
      immediate: true,
      handler: 'validator',
    },
  },

  methods: {
    validator () {
      const filtered = Object.entries(this.validationOptions)
        .filter(([_, option]) => option);
      if (filtered.length >= 2) {
        const errorMessage = `Use only one of ${filtered.map(([key]) => key).join(' | ')} options at the same time`;
        console.error(errorMessage);
      }
    },
  },
};
</script>

<style lang="less">
// The --placeholder-from-color and --placeholder-to-color
// custom properties can be set on the parent class of the
// placeholder to control the animation colors.
.skeleton-placeholder {
  display: flex;
  stroke: none;
  fill: var(--placeholder-from-color, var(--black-300));
  background: var(--placeholder-from-color, var(--black-300));

  &--animate {
    animation-name: placeholder-throb;
    animation-iteration-count: infinite;
  }
}

// the animation is used by the skeleton component
@keyframes placeholder-throb {
  10% {
    fill: var(--placeholder-from-color, var(--black-300));
    background: var(--placeholder-from-color, var(--black-300));
  }
  50% {
    fill: var(--placeholder-to-color, var(--black-100));
    background: var(--placeholder-to-color, var(--black-100));
  }
  90% {
    fill: var(--placeholder-from-color, var(--black-300));
    background: var(--placeholder-from-color, var(--black-300));
  }
}
</style>
