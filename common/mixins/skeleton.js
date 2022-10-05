import { SKELETON_RIPPLE_DURATION } from '@/components/skeleton/skeleton_constants';

/**
 * @displayName Skeleton Animation Mixin
 */
export default {
  computed: {
    skeletonOffset () {
      const skeletonText = this.$refs.skeleton;
      if (!skeletonText) { return this.offset; }
      const { top, height } = skeletonText.getBoundingClientRect();
      return top + (height / 2);
    },

    skeletonStyle () {
      const style = {};

      if (this.skeletonOffset === -1 || (!this.animate && this.animationDuration === -1)) {
        return style;
      }
      const animationDelay = this.skeletonOffset * SKELETON_RIPPLE_DURATION / 1000;
      const animationDuration = this.animationDuration === -1 ? 1000 : this.animationDuration;
      style.animationDelay = `${animationDelay}ms`;
      style.animationDuration = `${animationDuration}ms`;
      return style;
    },
  },
};
