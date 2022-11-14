<template>
  <div
    class="d-d-flex d-fd-column d-ai-center d-c-pointer ivr_node__width"
    v-on="$listeners"
  >
    <div
      v-if="dtmfKey"
      data-qa="dt-top-connector-dtmf"
      class="d-zi-base1 d-ai-center d-jc-center d-d-flex
          d-w24 d-h24 d-bar-circle d-bc-purple-600 d-bgc-purple-600
          d-mbn12 d-fc-white d-fs-200"
      :class="{ 'd-mbn16': isSelected }"
    >
      {{ dtmfKey }}
    </div>
    <div
      v-else
      data-qa="dt-top-connector"
      class="d-zi-base1 d-d-flex d-w8 d-h8 d-bar-circle d-bc-purple-600 d-bgc-purple-600 d-mbn4"
      :class="{ 'd-mbn8': isSelected }"
    />
    <dt-card
      content-class="d-bt d-bc-black-300 d-px12 d-pt8 d-pb12"
      :container-class="[
        'd-w100p',
        { 'd-ba d-bar8 d-baw4': isSelected },
        headerColor,
      ]"
      :header-class="[
        'd-mtn1',
        'd-bt',
        'd-btw4',
        'd-p0',
        headerColor,
        { 'd-btr4': !isSelected },
      ]"
    >
      <template #header>
        <!-- node label and icon section on left of the header -->
        <div class="d-d-flex d-ai-center">
          <dt-button
            :aria-label="nodeType"
            importance="clear"
            data-qa="dt-ivr-node-icon"
          >
            <template #icon>
              <component
                :is="nodeIcon"
                class="d-fc-black-900"
              />
            </template>
          </dt-button>
          <p
            class="d-fs-200 d-fw-bold"
            data-qa="ivr-node-label"
          >
            {{ nodeLabel }}
          </p>
        </div>
        <!-- node menu for actions like edit, copy, delete -->
        <dt-dropdown
          placement="bottom"
          :open.sync="isOpen"
        >
          <template #anchor>
            <dt-button
              importance="clear"
              :aria-label="menuButtonAriaLabel"
              @click.stop.prevent="openMenu"
            >
              <template #icon>
                <icon-menu-vertical class="d-fc-black-900" />
              </template>
            </dt-button>
          </template>
          <template #list="{ close }">
            <div class="d-w164">
              <slot
                name="menuItems"
                :close="close"
              />
            </div>
          </template>
        </dt-dropdown>
      </template>
      <template #content>
        <slot name="content" />
      </template>
    </dt-card>
  </div>
</template>

<script>
import DtCard from '@/components/card/card';
import DtButton from '@/components/button/button';
import DtDropdown from '@/components/dropdown/dropdown';
import IconMenuVertical from '@dialpad/dialtone/lib/dist/vue/icons/IconMenuVertical';
import {
  IVR_NODE_ICON_TYPES, IVR_NODE_COLOR_MAPPING,
} from './ivr_node_constants.js';

export default {
  name: 'DtRecipeIvrNode',

  components: {
    DtCard,
    DtButton,
    DtDropdown,
    IconMenuVertical,
  },

  props: {

    /**
     * type of IVR Node.
     */
    nodeType: {
      type: String,
      required: true,
    },

    /**
     * Descriptive label for the node name.
     */

    nodeLabel: {
      type: String,
      required: true,
    },

    /**
     * Selected state of the node
     */
    isSelected: {
      type: Boolean,
      default: false,
    },

    /**
     * Translated aria-label for header menu button
     */
    menuButtonAriaLabel: {
      type: String,
      required: true,
    },

    /**
     * DTMF input
     */
    dtmfKey: {
      type: String,
      default: null,
    },
  },

  emits: [
    /**
     * Add node click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  data () {
    return {
      isOpen: false,
    };
  },

  computed: {
    nodeIcon () {
      return IVR_NODE_ICON_TYPES[this.nodeType];
    },

    headerColor () {
      const { normal, selected } = IVR_NODE_COLOR_MAPPING[this.nodeType];
      return this.isSelected ? selected : normal;
    },
  },

  methods: {
    openMenu () {
      this.isOpen = true;
    },
  },
};
</script>

<style lang="less">
.ivr_node__width {
  width: 280px;
}
</style>
