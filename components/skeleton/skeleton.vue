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
import DtSkeletonShape from './skeleton-shape.vue';
import DtSkeletonListItem from './skeleton-list-item.vue';
import DtSkeletonParagraph from './skeleton-paragraph.vue';
import DtSkeletonText from './skeleton-text.vue';

/**
 * Skeleton loader is a non-interactive placeholder that displays a preview of the UI to visually communicate
 * that content is in the process of loading. Skeleton is used to provide a low fidelity
 * representation of the user interface (UI) before content appears on the page.
 * @see https://dialpad.design/components/skeleton.html
 */
export default {
  name: 'DtSkeleton',
  components: {
    DtSkeletonText,
    DtSkeletonShape,
    DtSkeletonListItem,
    DtSkeletonParagraph,
  },

  props: {
    /**
     * Set this prop to have the skeleton render as multiple lines of text.
     * Set only one option prop at a time.
     */
    paragraphOption: {
      type: [Object, Boolean],
      default: null,
    },

    /**
     * Set this prop to have the skeleton render as a list item with an avatar and wrapping text.
     * Set only one option prop at a time.
     */
    listItemOption: {
      type: [Object, Boolean],
      default: null,
    },

    /**
     * Set this prop to have the skeleton render as a single line of text.
     * Set only one option prop at a time.
     */
    textOption: {
      type: Object,
      default: null,
    },

    /**
     * Set this prop to have the skeleton render as a specific shape.
     * Set only one option prop at a time.
     */
    shapeOption: {
      type: [Object, Boolean],
      default: null,
    },

    /**
     * Duration time of the animation (ms), set -1 for an infinite animation.
     */
    animationDuration: {
      type: Number,
      default: -1,
    },

    /**
     * Descriptive label for the content.
     */
    ariaLabel: {
      type: String,
      default: '',
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
  fill: var(--placeholder-from-color, var(--dt-color-black-300));
  background: var(--placeholder-from-color, var(--dt-color-black-300));

  &--animate {
    animation-name: placeholder-throb;
    animation-iteration-count: infinite;
  }
}

// the animation is used by the skeleton component
@keyframes placeholder-throb {
  10% {
    fill: var(--placeholder-from-color, var(--dt-color-black-300));
    background: var(--placeholder-from-color, var(--dt-color-black-300));
  }
  50% {
    fill: var(--placeholder-to-color, var(--dt-color-black-100));
    background: var(--placeholder-to-color, var(--dt-color-black-100));
  }
  90% {
    fill: var(--placeholder-from-color, var(--dt-color-black-300));
    background: var(--placeholder-from-color, var(--dt-color-black-300));
  }
}
</style>
