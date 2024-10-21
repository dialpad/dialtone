<template>
  <div
    class="ivr_node"
    v-on="nodeListeners"
  >
    <div
      v-if="dtmfKey"
      data-qa="dt-top-connector-dtmf"
      class="ivr-connector ivr-connector--dtmf"
      :class="{ 'ivr-connector--dtmf--selected': isSelected }"
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
      class="ivr-connector"
      :class="{ 'ivr-connector--selected': isSelected }"
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
        <div class="ivr_node__header-left">
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
                :class="['', { 'ivr_node__goto_icon': isGotoNode }]"
              />
            </template>
          </dt-button>
          <p
            class="ivr_node__label"
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
            <div class="ivr_node__dropdown-list">
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
} from '@dialpad/dialtone-icons/vue3';
import {
  IVR_NODE_COLOR_MAPPING,
  IVR_NODE_PROMPT_MENU,
  IVR_NODE_PROMPT_COLLECT,
  IVR_NODE_PROMPT_PLAY,
  IVR_NODE_EXPERT,
  IVR_NODE_BRANCH,
  IVR_NODE_GO_TO,
  IVR_NODE_ASSIGN,
  IVR_NODE_TRANSFER,
  IVR_NODE_HANGUP,
} from './ivr_node_constants';

const typeToIcon = new Map([
  [IVR_NODE_PROMPT_MENU, DtIconKeypad],
  [IVR_NODE_PROMPT_COLLECT, DtIconDialer],
  [IVR_NODE_PROMPT_PLAY, DtIconVolume2],
  [IVR_NODE_EXPERT, DtIconExpertNode],
  [IVR_NODE_BRANCH, DtIconBranch],
  [IVR_NODE_GO_TO, DtIconCallMerge],
  [IVR_NODE_ASSIGN, DtIconChevronsRight],
  [IVR_NODE_TRANSFER, DtIconTransfer],
  [IVR_NODE_HANGUP, DtIconPhoneHangUp],
]);

export default {
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

    headerColor () {
      const { normal, selected } = IVR_NODE_COLOR_MAPPING[this.nodeType];
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

<style lang="less">
.ivr_node {
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  &__header-left {
    display: flex;
    align-items: center;
  }

  &__label {
    font-size: var(--dt-font-size-200);
    font-weight: var(--dt-font-weight-bold);
  }

  &__dropdown-list {
    width: var(--dt-size-825);
  }
}

.ivr_node__goto_icon {
  transform: rotate(90deg);
}

.ivr-connector {
  z-index: var(--zi-base);
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: var(--dt-color-purple-600);
  background-color: var(--dt-color-purple-600);
  width: var(--dt-size-400);
  height: var(--dt-size-400);
  border-radius: var(--dt-size-radius-circle);
  margin-bottom: var(--dt-space-300-negative);

  &--selected {
    margin-bottom: var(--dt-space-400-negative);
  }

  &.ivr-connector--dtmf {
    width: var(--dt-size-550);
    height: var(--dt-size-550);
    margin-bottom: var(--dt-space-450-negative);
    color: var(--dt-color-neutral-white);
    font-size: var(--dt-font-size-200);

    &--selected {
      margin-bottom: var(--dt-space-500-negative);
    }
  }
}
</style>
