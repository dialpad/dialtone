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
        :illustration="illustration"
        :desc="icon.desc"
        :code="icon.code"
        :file="icon.file"
        :kind="kind"
        :hidden="icon.hidden"
        :name="icon.name"
        :vue="icon.vue"
        :figma-link="icon.figmaLink"
        :raw-svg="icon.rawSvg"
        :display-name="kind === 'brand-logos'"
      />
    </div>
  </div>
</template>

<script>
import BaseIcon from '../baseComponents/BaseIcon.vue';
import { ICON_KINDS } from '../baseComponents/constants.js';

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

    illustration: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    icons: [],
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
};
</script>
