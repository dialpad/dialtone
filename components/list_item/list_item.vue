<template>
  <component
    :is="elementType"
    :id="id"
    :class="['dt-list-item d-ls-none', {
      'dt-list-item--focusable': isFocusable,
      'dt-list-item--highlighted': isHighlighted,
    }]"
    :tabindex="isFocusable ? 0 : -1"
    :role="role"
    :aria-selected="isHighlighted"
    @keydown.enter="onClick"
    @keydown.space="onClick"
    @click="onClick"
    @[maybeMouseMove]="onMouseMove"
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

    /**
     * For keyboard navigation, the method to set the highlight to this item.
     */
    setHighlight: {
      type: [Function, Promise],
      default: null,
    },

    /**
     * For keyboard navigation, whether or not this item is currently highlighted.
     */
    isHighlighted: {
      type: Boolean,
      default: false,
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

    isFocusable () {
      // Navigation type has to be set to "tab".
      return this.navigationType === LIST_ITEM_NAVIGATION_TYPES.TAB;
    },

    /**
     * When using "arrow-keys" navigation the item shouldn't receive actual focus, so
     * we use custom highlighting to indicate which item has the "focus".
     */
    isHighlightable () {
      // Navigation type has to be set to "arrow-keys".
      if (this.navigationType !== LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS) {
        return false;
      }
      // setHighlight method has to be provided.
      return !!this.setHighlight;
    },

    /**
     * Since this event listener can be resource heavy, only attach it when needed.
     * https://github.com/vuejs/vue/issues/7349#issuecomment-458405684
     */
    maybeMouseMove () {
      return this.isHighlightable && !this.isHighlighted ? 'mousemove' : null;
    },
  },

  created () {
    this.validateProps();
  },

  methods: {
    onClick () {
      this.$emit('click');
    },

    /**
     * While you hover over an item, always highlight it.
     */
    onMouseMove () {
      if (this.isHighlightable && !this.isHighlighted) {
        // Update the highlight.
        this.setHighlight();
      }
    },

    /**
     * Helper to make sure some dependent props are provided.
     */
    validateProps () {
      // Keyboard navigation.
      if (this.navigationType === LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS) {
        // The method setHighlight should be provided.
        if (typeof this.setHighlight !== 'function') {
          console.error('DtListItem: prop "setHighlight" is required when navigationType is:',
            LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS, 'but received setHighlight:', this.setHighlight);
        }
      }
    },
  },
};
</script>

<style lang="less">
.dt-list-item--focusable:hover,
.dt-list-item--focusable:focus,
.dt-list-item--focusable:focus-within,
.dt-list-item--highlighted {
  background-color: hsla(var(--black-400-h), var(--black-400-s), var(--black-400-l), 0.15);
  cursor: pointer;
}

.dt-list-item--focusable:focus-visible {
  outline-color: var(--primary-color);
}
</style>
