<template>
  <div
    :class="[
      'd-recipe-ivr-node',
      nodeClass,
    ]"
    v-on="nodeListeners"
  >
    <div
      v-if="dtmfKey"
      data-qa="dt-top-connector-dtmf"
      class="d-recipe-ivr-node__connector d-recipe-ivr-node__connector-dtmf"
      :class="{ 'd-recipe-ivr-node__connector-dtmf--selected': isSelected }"
    >
      {{ dtmfKey }}
    </div>
    <slot
      v-if="$slots.connector"
      name="connector"
    />
    <div
      v-if="!dtmfKey && !$slots.connector"
      data-qa="dt-top-connector"
      class="d-recipe-ivr-node__connector"
      :class="{ 'd-recipe-ivr-node__connector--selected': isSelected }"
    />
    <dt-card>
      <template #header>
        <!-- node label and icon section on left of the header -->
        <div class="d-recipe-ivr-node__header-left">
          <dt-button
            :aria-label="nodeType"
            importance="clear"
            kind="muted"
            data-qa="dt-ivr-node-icon"
          >
            <template #icon>
              <component
                :is="nodeIcon"
                size="200"
                :class="['', { 'd-recipe-ivr-node__goto-icon': isGotoNode }]"
              />
            </template>
          </dt-button>
          <p
            class="d-recipe-ivr-node__label"
            data-qa="ivr-node-label"
          >
            {{ nodeLabel }}
          </p>
        </div>
        <!-- node menu for actions like edit, copy, delete -->
        <dt-dropdown
          v-model:open="isOpen"
          placement="bottom"
        >
          <template #anchor>
            <dt-button
              importance="clear"
              kind="muted"
              :aria-label="menuButtonAriaLabel"
              @click.stop.prevent="openMenu"
            >
              <template #icon>
                <dt-icon-more-vertical size="200" />
              </template>
            </dt-button>
          </template>
          <template #list="{ close }">
            <div class="d-recipe-ivr-node__dropdown-list">
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
import { DtCard } from '@/components/card';
import { DtButton } from '@/components/button';
import { DtDropdown } from '@/components/dropdown';
import {
  DtIconKeypad,
  DtIconDialer,
  DtIconVolume2,
  DtIconExpertNode,
  DtIconBranch,
  DtIconCallMerge,
  DtIconChevronsRight,
  DtIconTransfer,
  DtIconPhoneHangUp,
  DtIconMoreVertical,
  DtIconListBullet,
} from '@dialpad/dialtone-icons/vue3';
import {
  IVR_NODE_CLASS_MAPPING,
  IVR_NODE_PROMPT_MENU,
  IVR_NODE_PROMPT_COLLECT,
  IVR_NODE_PROMPT_PLAY,
  IVR_NODE_EXPERT,
  IVR_NODE_BRANCH,
  IVR_NODE_GO_TO,
  IVR_NODE_ASSIGN,
  IVR_NODE_TRANSFER,
  IVR_NODE_HANGUP,
  IVR_NODE_CUSTOMER_DATA,
} from './ivr_node_constants';

const typeToIcon = new Map([
  [IVR_NODE_PROMPT_MENU, DtIconKeypad],
  [IVR_NODE_PROMPT_COLLECT, DtIconDialer],
  [IVR_NODE_PROMPT_PLAY, DtIconVolume2],
  [IVR_NODE_EXPERT, DtIconExpertNode],
  [IVR_NODE_BRANCH, DtIconBranch],
  [IVR_NODE_GO_TO, DtIconCallMerge],
  [IVR_NODE_ASSIGN, DtIconChevronsRight],
  [IVR_NODE_CUSTOMER_DATA, DtIconListBullet],
  [IVR_NODE_TRANSFER, DtIconTransfer],
  [IVR_NODE_HANGUP, DtIconPhoneHangUp],
]);

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeIvrNode',

  components: {
    DtCard,
    DtButton,
    DtDropdown,
    DtIconKeypad,
    DtIconDialer,
    DtIconVolume2,
    DtIconExpertNode,
    DtIconBranch,
    DtIconCallMerge,
    DtIconChevronsRight,
    DtIconTransfer,
    DtIconPhoneHangUp,
    DtIconMoreVertical,
    DtIconListBullet,
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
    nodeListeners () {
      return {
        click: (e) => this.$emit('click', e),
      };
    },

    nodeIcon () {
      return typeToIcon.get(this.nodeType);
    },

    nodeClass () {
      const { normal, selected } = IVR_NODE_CLASS_MAPPING[this.nodeType];
      return this.isSelected ? selected : normal;
    },

    isGotoNode () {
      return this.nodeType === IVR_NODE_GO_TO;
    },
  },

  methods: {
    openMenu () {
      this.isOpen = true;
    },
  },
};
</script>
