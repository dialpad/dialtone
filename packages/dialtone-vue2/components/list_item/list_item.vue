<template>
  <component
    :is="elementType"
    :id="id"
    :class="[
      'd-list-item',
      {
        'd-list-item--focusable': isFocusable,
        'd-list-item--highlighted': isHighlighted,
        'd-list-item--static': !isHoverable,
      }]"
    :tabindex="isFocusable ? 0 : -1"
    :role="role"
    :aria-selected="role === 'listitem' ? undefined : isHighlighted"
    v-on="listItemListeners"
  >
    <dt-item-layout
      v-if="isDefaultType"
      unstyled
      class="d-list-item__wrapper"
      subtitle-class="d-list-item__subtitle"
      left-class="d-list-item__left"
      right-class="d-list-item__right"
      selected-class="d-list-item__selected"
      bottom-class="d-list-item__bottom"
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
        <dt-icon-check size="400" />
      </template>
    </dt-item-layout>
    <!-- @slot slot for the main content -->
    <slot v-else />
  </component>
</template>

<script>
import {
  LIST_ITEM_TYPES,
  LIST_ITEM_NAVIGATION_TYPES,
} from './list_item_constants';
import utils from '@/common/utils';
import { DtIconCheck } from '@dialpad/dialtone-icons/vue2';
import { DtItemLayout } from '@/components/item_layout';

const ROLES = ['listitem', 'menuitem', 'option'];

/**
 * A list item is an element that can be used to represent individual items in a list.
 * @see https://dialtone.dialpad.com/components/list_item.html
 */
export default {
  name: 'DtListItem',

  components: {
    DtItemLayout,
    DtIconCheck,
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
      validator: (role) => (ROLES).includes(role),
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
    isDefaultType () {
      if (this.type === LIST_ITEM_TYPES.DEFAULT) return true;
      return false;
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
     * For keyboard navigation, whether this item is currently highlighted.
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
     * Whether to apply hover styles.
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
