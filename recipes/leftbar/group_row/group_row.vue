<template>
  <dt-recipe-general-row
    :description="names"
    :aria-label="ariaLabel"
    :unread-count="unreadCount"
    :has-unreads="hasUnreads"
    :unread-count-tooltip="unreadCountTooltip"
    :selected="selected"
    :is-typing="isTyping"
    v-bind="$attrs"
  >
    <template #left>
      <dt-icon
        name="users"
        size="300"
      />
    </template>
  </dt-recipe-general-row>
</template>

<script>
import { DtRecipeGeneralRow } from '@/recipes/leftbar/general_row';
import DtIcon from '@/components/icon/icon.vue';
import { safeConcatStrings } from '@/common/utils.js';

export default {
  name: 'DtRecipeGroupRow',

  components: {
    DtIcon,
    DtRecipeGeneralRow,
  },

  inheritAttrs: false,

  props: {

    /**
     * Screen reader will read out the number of users in the group using this text. Ex: "2 users"
     */
    groupCountText: {
      type: String,
      default: '',
    },

    /**
     * Names of the group members
     */
    names: {
      type: String,
      required: true,
    },

    /**
     * Number of unread messages
     */
    unreadCount: {
      type: String,
      default: null,
    },

    /**
     * Text shown when the unread count is hovered.
     */
    unreadCountTooltip: {
      type: String,
      default: null,
    },

    /**
     * Styles the row with an increased font weight to convey it has unreads. This must be true to see
     * the unread count badge.
     */
    hasUnreads: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines if the row is selected
     */
    selected: {
      type: Boolean,
      default: false,
    },

    /**
     * Shows an "is typing" animation over the avatar when true.
     */
    isTyping: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Native click event on the row itself
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  computed: {
    ariaLabel () {
      return safeConcatStrings([this.groupCountText, this.names]);
    },
  },
};
</script>
