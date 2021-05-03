<template>
  <div>
    <hs-button @click="isShown = !isShown">
      Toggle
    </hs-button>
    <hs-lazy-show
      :show="isShown"
      :transition="transition"
    >
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </hs-lazy-show>
  </div>
</template>
<script>
import { HsLazyShow } from './';
import { HsButton } from '../button';

export default {
  name: 'LazyShowDefault',
  components: { HsLazyShow, HsButton },

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      isShown: this.show || false,
    };
  },

  watch: {
    show (isShown) {
      this.isShown = isShown;
    },
  },
};
</script>
