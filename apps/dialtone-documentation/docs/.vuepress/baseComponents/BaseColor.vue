<template>
  <aside class="d-d-flex d-fd-column">
    <header class="d-d-flex d-jc-space-between d-ai-end">
      <h2
        :id="color"
        class="d-docsite--header-3 d-tt-capitalize"
        tabindex="-1"
      >
        <a
          :href="`#${color}`"
          class="header-anchor"
        >#</a>
        {{ color }}
      </h2>
    </header>
    <div
      v-for="({ stop, copy, hex, contrast, invertedContrast }, index) in stops"
      :key="index"
      :class="dynamicClasses(stop, copy, index)"
      class="d-d-flex d-jc-space-between d-ai-center d-px12 d-py8 d-fs-100 d-lh6 d-ff-mono"
    >
      <div>
        <strong>var(--dt-color-{{ color }}{{ stop ? `-${stop}` : '' }})</strong>
        <br>
        <span>#{{ hex }}</span>
      </div>
      <div class="d-d-flex d-fd-column d-fs-100 d-lh2 d-fw-bold d-bar-sm d-px4 py2">
        <span> {{ contrast }}</span>
        <span
          v-if="invertedContrast"
          :class="copy === 'primary-inverted' ? 'd-fc-primary' : 'd-fc-primary-inverted'"
        >
          {{ invertedContrast }}
        </span>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'BaseColor',
  props: {
    stops: {
      type: Array,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },
  },

  methods: {
    dynamicClasses (stop, copy, index) {
      const stopColor = [this.color, stop].join('-');
      return [
        `d-bgc-${stopColor}`,
        `d-fc-${copy}`,
        {
          'd-btr4': index === 0,
          'd-bbr4': index === (this.stops.length - 1),
        },
      ];
    },
  },
};
</script>
