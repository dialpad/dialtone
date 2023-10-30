<template>
  <div
    v-if="!hidden"
    :id="file"
    class="dialtone-icon-grid__item"
  >
    <aside
      :data-selected="selectedStatus"
      class="dialtone-icon-card js-dialtone-icon-card"
    >
      <header class="dialtone-icon-card__header js-dialtone-icon-card-copy-area">
        <div :class="cardIconClass">
          <component
            :is="dynamicIconComponent"
          />
        </div>
        <p class="dialtone-icon-card__subtitle d-tt-capitalize">
          {{ name }}
          {{ (!isWeatherKind && variation) ? `(${variation})` : '' }}
        </p>
      </header>
      <footer :class="cardFooterClass">
        <div class="dialtone-icon-card__content">
          <h2 class="dialtone-icon-card__title d-tt-capitalize">
            {{ name }}
            {{ (!isWeatherKind && variation) ? `(${variation})` : '' }}
          </h2>
          <div class="dialtone-icon-card__list">
            <span class="dialtone-icon-card__list__item">
              <strong>SVG:</strong> <span class="code-example">{{ `${file}.svg` }}</span>
            </span>
            <span class="dialtone-icon-card__list__item">
              <strong>Vue:</strong> <span class="code-example js-vue-file">{{ `<${vue} />` }}</span>
            </span>
            <span
              v-if="code"
              class="dialtone-icon-card__list__item"
            >
              <strong>Codes:</strong> <span class="code-example">{{ code }}</span>
            </span>
          </div>
          <p class="dialtone-icon-card__description">
            {{ desc }}
          </p>
        </div>
      </footer>
    </aside>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export const ICON_KINDS = ['brand', 'patterns', 'spot', 'system', 'weather'];
export const ICON_VARIATIONS = ['dark', 'light', 'night', 'day'];

export default {
  name: 'BaseIcon',
  props: {
    name: {
      type: String,
      required: true,
    },

    file: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      default: '',
    },

    code: {
      type: String,
      default: '',
    },

    hidden: {
      type: Boolean,
      default: false,
    },

    vue: {
      type: String,
      required: true,
    },

    kind: {
      type: String,
      required: true,
      validator: (kind) => {
        return ICON_KINDS.includes(kind);
      },
    },

    selected: {
      type: Boolean,
      default: false,
    },

    variation: {
      type: String,
      default: null,
      validator: (_variation) => {
        if (_variation === null) return true;
        return ICON_VARIATIONS.includes(_variation);
      },
    },
  },

  computed: {
    isWeatherKind () {
      return this.kind === 'weather';
    },

    isSpotKind () {
      return this.kind === 'spot';
    },

    selectedStatus () {
      return this.selected ? 'yes' : 'no';
    },

    cardFooterClass () {
      return this.isSpotKind ? 'dialtone-icon-card__footer-spot-illustration' : 'dialtone-icon-card__footer';
    },

    cardIconClass () {
      return this.isSpotKind ? 'dialtone-icon-card__icon--autosize' : 'dialtone-icon-card__icon';
    },

    dynamicIconComponent () {
      switch (this.kind) {
        case 'patterns':
          return defineAsyncComponent(() => import(`../../../lib/dist/vue/patterns/${this.vue}.vue`));
        case 'spot':
          return defineAsyncComponent(() => import(`../../../lib/dist/vue/spot/${this.vue}.vue`));
        default:
          return defineAsyncComponent(() => import(`../../../lib/dist/vue/icons/${this.vue}.vue`));
      }
    },
  },
};
</script>

<style scoped>

</style>
