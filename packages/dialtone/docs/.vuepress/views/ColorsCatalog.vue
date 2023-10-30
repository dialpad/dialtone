<template>
  <section class="d-stack16">
    <div
      class="d-d-grid d-gg24 d-g-cols2 md:d-g-cols1"
      :class="themeModeClass"
    >
      <base-color
        v-for="color in colors"
        :key="color.color"
        :color="color.color"
        :stops="color.stops || []"
      />
    </div>
  </section>
</template>

<script>
import BaseColor from '../baseComponents/BaseColor.vue';
import { base as colorsData } from '../../_data/colors.json';

export default {
  name: 'Colors',
  components: {
    BaseColor,
  },

  props: {
    /**
     * Defines the themeMode colors catalog to show
     * @values: lightMode, darkMode
     */
    themeMode: {
      type: String,
      required: true,
    },
  },

  created () {
    this.colors = colorsData[this.themeMode];
    this.themeModeClass = this.themeMode === 'lightMode' ? 'dialtone-theme-light' : 'dialtone-theme-dark';
  },
};
</script>
