<template>
  <div>
    <dt-button @click="isShown = !isShown">
      Toggle
    </dt-button>
    <dt-lazy-show
      :show="isShown"
      :appear="$attrs.appear"
      :transition="$attrs.transition"
    >
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </dt-lazy-show>
  </div>
</template>

<script>
import { DtLazyShow } from './';
import { DtButton } from '../button';

export default {
  name: 'LazyShowDefault',
  components: { DtLazyShow, DtButton },

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
