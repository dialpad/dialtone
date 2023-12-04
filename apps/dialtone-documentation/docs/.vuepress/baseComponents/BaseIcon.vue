<template>
  <div
    v-if="!hidden"
    :id="file"
  >
    <aside
      :data-selected="selectedStatus"
      class="dialtone-icon-card js-dialtone-icon-card"
    >
      <header class="dialtone-icon-card__header js-dialtone-icon-card-copy-area">
        <div :class="cardIconClass">
          <component
            :is="vue"
          />
        </div>
      </header>
      <footer :class="cardFooterClass">
        <div class="dialtone-icon-card__content">
          <h2 class="dialtone-icon-card__title d-tt-capitalize">
            {{ name }}
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
import SpotPublish from '@dialpad/dialtone/lib/dist/vue/spot/SpotPublish.vue';
import SpotWirelessScreenshare from '@dialpad/dialtone/lib/dist/vue/spot/SpotWirelessScreenshare.vue';
import SpotFemaleLaptopTyping from '@dialpad/dialtone/lib/dist/vue/spot/SpotFemaleLaptopTyping.vue';
import SpotMaleLaptopTyping from '@dialpad/dialtone/lib/dist/vue/spot/SpotMaleLaptopTyping.vue';
import SpotFileUpload from '@dialpad/dialtone/lib/dist/vue/spot/SpotFileUpload.vue';
import SpotBrowserTableGraph from '@dialpad/dialtone/lib/dist/vue/spot/SpotBrowserTableGraph.vue';
import SpotBrowserListCallout from '@dialpad/dialtone/lib/dist/vue/spot/SpotBrowserListCallout.vue';
import SpotMind from '@dialpad/dialtone/lib/dist/vue/spot/SpotMind.vue';
import SpotBlankSpace from '@dialpad/dialtone/lib/dist/vue/spot/SpotBlankSpace.vue';
import SpotVectorVortex from '@dialpad/dialtone/lib/dist/vue/spot/SpotVectorVortex.vue';

export const ICON_KINDS = ['spot'];

export default {
  name: 'BaseIcon',
  components: {
    SpotPublish,
    SpotWirelessScreenshare,
    SpotFemaleLaptopTyping,
    SpotMaleLaptopTyping,
    SpotFileUpload,
    SpotBrowserTableGraph,
    SpotBrowserListCallout,
    SpotMind,
    SpotBlankSpace,
    SpotVectorVortex,
  },

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
  },

  computed: {
    isSpotKind () {
      return this.kind === 'spot';
    },

    selectedStatus () {
      return this.selected ? 'yes' : 'no';
    },

    cardFooterClass () {
      return 'dialtone-icon-card__footer-spot-illustration';
    },

    cardIconClass () {
      return 'dialtone-icon-card__icon--autosize';
    },
  },
};
</script>

<style scoped>

</style>
