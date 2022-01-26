<template>
  <component
    :is="elementType"
    :id="id"
    :class="['dt-list-item d-ls-none focus-visible', {
      'dt-list-item--focusable': isFocusable,
      'dt-list-item--highlighted': isHighlighted,
    }]"
    :tabindex="isFocusable ? 0 : -1"
    :role="role"
    :aria-selected="isHighlighted"
    @keydown.enter="onClick"
    @keydown.space="onClick"
    @click="onClick"
  >
    <component
      :is="listItemType"
      v-if="listItemType"
    >
      <template
        v-for="(_, slotName) in $slots"
        #[slotName]
      >
        <slot :name="slotName" />
      </template>
    </component>
    <slot v-else />
  </component>
</template>

<script>
import {
  LIST_ITEM_TYPES,
  LIST_ITEM_NAVIGATION_TYPES,
} from './list_item_constants.js';
import DtDefaultListItem from './default_list_item';
import utils from '../utils';

export default {
  name: 'ListItem',

  components: {
    DtDefaultListItem,
  },

  /**
   * Value provided from keyboard_list_navigation.js using id prop.
   */
  inject: {
    highlightId: { default: null },
  },

  props: {
    /**
     * Id for the item.
     */
    id: {
      type: String,
      default () { return utils.getUniqueString(); },
    },

    /**
     * String to use for the item's role.
     */
    role: {
      type: String,
      default: 'listitem',
    },

    /**
     * The type of element to use for the wrapper.
     */
    elementType: {
      type: String,
      default: 'li',
    },

    /**
     * The type of child list item to use.
     */
    type: {
      type: String,
      default: LIST_ITEM_TYPES.DEFAULT,
      validator: (t) => Object.values(LIST_ITEM_TYPES).includes(t),
    },

    /**
     * The type of navigation that this component should support.
     * - "arrow-keys" for items that are navigated with UP/DOWN keys.
     * - "tab" for items that are navigated using the TAB key.
     * - "none" for static items that are not interactive.
     */
    navigationType: {
      type: String,
      default: LIST_ITEM_NAVIGATION_TYPES.NONE,
      validator: (t) => Object.values(LIST_ITEM_NAVIGATION_TYPES).includes(t),
    },
  },

  emits: ['click'],

  computed: {
    listItemType () {
      switch (this.type) {
        case LIST_ITEM_TYPES.DEFAULT:
          return DtDefaultListItem;
        default:
          return null;
      }
    },

    /**
     * For keyboard navigation, whether or not this item is currently highlighted.
     */
    isHighlighted () {
      return this.highlightId ? this.id === this.highlightId() : false;
    },

    isFocusable () {
      // Navigation type has to be set to "tab".
      return this.navigationType === LIST_ITEM_NAVIGATION_TYPES.TAB;
    },
  },
  methods: {
    onClick () {
      this.$emit('click');
    },
  },
};
</script>

<style lang="less">
.dt-list-item:hover,
.dt-list-item--focusable:focus,
.dt-list-item--focusable:focus-within,
.dt-list-item--highlighted {
  background-color: hsla(var(--black-400-h), var(--black-400-s), var(--black-400-l), 0.15);
  cursor: pointer;
}

.dt-list-item:focus-visible {
  outline-color: var(--primary-color);
}
</style>
