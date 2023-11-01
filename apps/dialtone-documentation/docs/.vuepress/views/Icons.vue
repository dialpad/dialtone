<template>
  <div
    class="d-stack16 d-p16 d-bar8"
  >
    <h3
      :id="kind"
      class="d-docsite--header-3 d-mt0"
    >
      <a
        :href="`#${kind}`"
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
        :vue="icon.vue"
        @click="toggleCard(index)"
      />
    </div>
  </div>
</template>

<script>
import BaseIcon, { ICON_KINDS } from '../baseComponents/BaseIcon.vue';

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
  },

  async beforeCreate () {
    const importedModule = await import(`../../_data/svg-${this.kind}.json`);
    this.icons = importedModule.default;
  },

  methods: {
    toggleCard (index) {
      if (this.selectedCardIndex === index) index = undefined;
      this.selectedCardIndex = index;
    },
  },
};
</script>
