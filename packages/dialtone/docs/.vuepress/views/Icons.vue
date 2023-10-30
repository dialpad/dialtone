<template>
  <div
    :class="{ ['d-bgc-contrast d-fc-primary-inverted']: ['light', 'night'].includes(variation) }"
    class="d-stack16 d-p16 d-bar8"
  >
    <h3
      :id="`${variation}-${kind}`"
      class="d-docsite--header-3 d-mt0"
    >
      <a
        :href="`#${variation}-${kind}`"
        class="header-anchor"
      >#</a>
      {{ title }}
    </h3>
    <div :class="iconsContainerClass">
      <base-icon
        v-for="(icon, index) in icons"
        :key="index"
        :desc="icon.desc"
        :code="icon.code"
        :file="icon.file"
        :kind="kind"
        :hidden="icon.hidden"
        :name="icon.name"
        :selected="selectedCardIndex === index"
        :variation="variation"
        :vue="icon.vue"
        @click="toggleCard(index)"
      />
    </div>
  </div>
</template>

<script>
import BaseIcon, { ICON_KINDS, ICON_VARIATIONS } from '../baseComponents/BaseIcon.vue';

export default {
  name: 'Icons',
  components: {
    BaseIcon,
  },

  props: {
    kind: {
      type: String,
      required: true,
      validator: (_kind) => {
        return ICON_KINDS.includes(_kind);
      },
    },

    variation: {
      type: String,
      default: null,
      validator: (_variation) => {
        if (_variation === null) return true;
        return ICON_VARIATIONS.includes(_variation);
      },
    },

    size: {
      type: String,
      default: null,
      validator: (_size) => {
        return _size === 'large';
      },
    },

    title: {
      type: String,
      default: null,
    },
  },

  data: () => ({
    icons: [],
    selectedCardIndex: undefined,
  }),

  computed: {
    iconsContainerClass () {
      return this.size ? `d-gl-docsite-icons--${this.size}` : 'd-gl-docsite-icons';
    },

    isWeatherKind () {
      return this.kind === 'weather';
    },

    isPatternsKind () {
      return this.kind === 'patterns';
    },
  },

  async beforeCreate () {
    const importedModule = await import(`../../_data/svg-${this.kind}.json`);
    this.icons = (this.isWeatherKind || this.isPatternsKind)
      ? importedModule.default[this.variation]
      : this.icons = importedModule.default;
  },

  methods: {
    toggleCard (index) {
      if (this.selectedCardIndex === index) index = undefined;
      this.selectedCardIndex = index;
    },
  },
};
</script>
