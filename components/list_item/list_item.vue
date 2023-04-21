<template>
  <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
  <component
    :is="elementType"
    :id="id"
    :class="['dt-list-item d-ls-none', {
      'dt-list-item--focusable': isFocusable,
      'dt-list-item--highlighted': isHighlighted,
      'dt-list-item--static': !isHoverable,
    }]"
    :tabindex="isFocusable ? 0 : -1"
    :role="role"
    :aria-selected="isHighlighted"
    v-on="listItemListeners"
  >
    <component
      :is="listItemType"
      v-if="listItemType"
    >
      <template
        v-for="(_, slotName) in $slots"
        #[slotName]
      >
        <!-- @slot named slots for custom list items -->
        <slot :name="slotName" />
      </template>
      <template
        v-if="selected"
        #selected
      >
        <dt-icon
          name="check"
          size="400"
          class="d-ml8"
        />
      </template>
    </component>
    <!-- @slot slot for the main content -->
    <slot v-else />
  </component>
</template>

<script>
import {
  LIST_ITEM_TYPES,
  LIST_ITEM_NAVIGATION_TYPES,
} from './list_item_constants';
import DtDefaultListItem from './default_list_item.vue';
import utils from '@/common/utils';
import { DtIcon } from '@/components/icon';

/**
 * A list item is an element that can be used to represent individual items in a list.
 * @see https://dialpad.design/components/list_item.html
 */
export default {
  name: 'DtListItem',

  components: {
    DtDefaultListItem,
    DtIcon,
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
     * HTML element type (tag name) of the content wrapper element.
     */
    elementType: {
      type: String,
      default: 'li',
    },

    /**
     * The type of child list item to use.
     * @values default, custom
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
     * @values arrow-keys, tab, none
     */
    navigationType: {
      type: String,
      default: LIST_ITEM_NAVIGATION_TYPES.NONE,
      validator: (t) => Object.values(LIST_ITEM_NAVIGATION_TYPES).includes(t),
    },

    /**
     * Applies selected styles to the list item
     */
    selected: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Key down event
     *
     * @event keydown
     * @type {KeyboardEvent}
     */
    'keydown',

    /**
     * Native mouse move event
     *
     * @event mousemove
     * @type {MouseEvent}
     */
    'mousemove',

    /**
     * Native mouse leave event
     *
     * @event mouseleave
     * @type {MouseEvent}
     */
    'mouseleave',
  ],

  data () {
    return {
      injected: false,
      mouseHighlighted: false,
    };
  },

  computed: {
    listItemType () {
      switch (this.type) {
        case LIST_ITEM_TYPES.DEFAULT:
          return DtDefaultListItem;
        default:
          return null;
      }
    },

    listItemListeners () {
      return {
        ...this.$listeners,
        keydown: event => {
          if (['enter', 'space'].includes(event.code.toLowerCase())) {
            this.onClick(event);
          }
          this.$emit('keydown', event);
        },

        mousemove: event => {
          this.onMouseHover(event);
          this.$emit('mousemove', event);
        },

        mouseleave: event => {
          this.onMouseLeave(event);
          this.$emit('mouseleave', event);
        },
      };
    },

    /**
     * For keyboard navigation, whether or not this item is currently highlighted.
     * An injected highlightId will override the default mouseover highlight.
     */
    isHighlighted () {
      if (this.isHoverable) {
        return this.highlightId && this.highlightId() ? this.id === this.highlightId() : this.mouseHighlighted;
      }
      return false;
    },

    isFocusable () {
      // Navigation type has to be set to "tab".
      return this.navigationType === LIST_ITEM_NAVIGATION_TYPES.TAB;
    },

    /**
     * Whether or not to apply hover styles.
     */
    isHoverable () {
      return this.navigationType !== LIST_ITEM_NAVIGATION_TYPES.NONE;
    },
  },

  methods: {
    onClick (e) {
      this.$emit('click', e);
    },

    onMouseHover () {
      this.mouseHighlighted = true;
    },

    onMouseLeave () {
      this.mouseHighlighted = false;
    },
  },
};
</script>

<style lang="less">
.dt-list-item:not(.dt-list-item--static) {
  cursor: pointer;
  border-radius: var(--size-300);
}

.dt-list-item--focusable:focus,
.dt-list-item--focusable:focus-within,
.dt-list-item--highlighted {
  background-color: var(--bgc-moderate-opaque);
}

.dt-list-item--highlighted:active {
  background-color: var(--bgc-bold-opaque);
}

.dt-list-item:focus-visible {
  outline: none;
  box-shadow: var(--bs-focus-ring);
}
</style>
