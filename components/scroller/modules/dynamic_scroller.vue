<template>
  <core-scroller
    ref="scroller"
    :items="itemsWithSize"
    :min-item-size="minItemSize"
    :direction="direction"
    :key-field="keyField"
    :list-tag="listTag"
    :item-tag="itemTag"
    v-bind="$attrs"
  >
    <template
      #default="{ item: itemWithSize, index, active }"
    >
      <dt-scroller-item
        :item="itemWithSize"
        :active="active"
        :size-dependencies="[
          itemWithSize.message,
        ]"
        :data-index="index"
      >
        <slot
          v-bind="{
            item: itemWithSize.item,
            index,
            active,
            itemWithSize,
          }"
        />
      </dt-scroller-item>
    </template>
  </core-scroller>
</template>

<!-- eslint-disable-next-line max-len -->
<!-- This is a code from external library (https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/src/components/DynamicScroller.vue)
We have modified it for our own specific use. -->
<script>
import CoreScroller from './core_scroller.vue';
import DtScrollerItem from './scroller_item.vue';

export default {
  name: 'DynamicScroller',

  components: {
    CoreScroller,
    DtScrollerItem,
  },

  provide () {
    if (typeof ResizeObserver !== 'undefined') {
      this.$_resizeObserver = new ResizeObserver(entries => {
        requestAnimationFrame(() => {
          if (!Array.isArray(entries)) {
            return;
          }
          for (const entry of entries) {
            if (entry.target && entry.target.$_vs_onResize) {
              let width, height;
              if (entry.borderBoxSize) {
                const resizeObserverSize = entry.borderBoxSize[0];
                width = resizeObserverSize.inlineSize;
                height = resizeObserverSize.blockSize;
              } else {
                // @TODO remove when contentRect is deprecated
                width = entry.contentRect.width;
                height = entry.contentRect.height;
              }
              entry.target.$_vs_onResize(entry.target.$_vs_id, width, height);
            }
          }
        });
      });
    }

    return {
      vscrollData: this.vscrollData,
      vscrollParent: this,
      vscrollResizeObserver: this.$_resizeObserver,
    };
  },

  inheritAttrs: false,

  props: {
    /*
      * The items to render.
      * If the items are simple arrays, the index will be used as the key.
      * If the items are objects, the keyField will be used as the key.
     */
    items: {
      type: Array,
      required: true,
    },

    /*
      * Indicates if the items are dynamic.
      * If true, the items will be wrapped in a DtScrollerItem component.
      * This is required for dynamic items to be able to react to changes in their size.
     */
    dynamic: {
      type: Boolean,
      default: false,
    },

    /*
      * The key field to use for the items.
      * Only used if the items are objects.
     */
    keyField: {
      type: String,
      default: 'id',
    },

    /*
      * The direction of the scroller.
      * Can be either 'vertical' or 'horizontal'.
     */
    direction: {
      type: String,
      default: 'vertical',
      validator: (value) => ['vertical', 'horizontal'].includes(value),
    },

    /*
      * The tag to use for the list.
     */
    listTag: {
      type: String,
      default: 'div',
    },

    /*
      * The tag to use for the items.
     */
    itemTag: {
      type: String,
      default: 'div',
    },

    /*
      * Display height (or width in horizontal mode) of the items in pixels
      * used to calculate the scroll size and position.
      * Is required for the initial render of items in DYNAMIC size mode.
     */
    minItemSize: {
      type: [Number, String],
    },
  },

  data () {
    return {
      vscrollData: {
        active: true,
        sizes: {},
        keyField: this.keyField,
        simpleArray: false,
      },
    };
  },

  computed: {
    simpleArray () {
      return this.items.length && typeof this.items[0] !== 'object';
    },

    itemsWithSize () {
      const result = [];
      const { items, keyField, simpleArray } = this;
      const sizes = this.vscrollData.sizes;
      const l = items.length;
      for (let i = 0; i < l; i++) {
        const item = items[i];
        const id = simpleArray ? i : item[keyField];
        let size = sizes[id];
        if (typeof size === 'undefined' && !this.$_undefinedMap[id]) {
          size = 0;
        }
        result.push({
          item,
          [keyField]: id,
          size,
        });
      }
      return result;
    },
  },

  watch: {
    simpleArray: {
      handler (value) {
        this.vscrollData.simpleArray = value;
      },

      immediate: true,
    },

    itemsWithSize (next, prev) {
      const scrollTop = this.$el.scrollTop;

      // Calculate total diff between prev and next sizes
      // over current scroll top. Then add it to scrollTop to
      // avoid jumping the contents that the user is seeing.
      let prevActiveTop = 0; let activeTop = 0;
      const length = Math.min(next.length, prev.length);
      for (let i = 0; i < length; i++) {
        if (prevActiveTop >= scrollTop) {
          break;
        }
        prevActiveTop += prev[i].size || this.minItemSize;
        activeTop += next[i].size || this.minItemSize;
      }
      const offset = activeTop - prevActiveTop;

      if (offset === 0) {
        return;
      }

      this.$el.scrollTop += offset;
    },
  },

  beforeCreate () {
    this.$_updates = [];
    this.$_undefinedSizes = 0;
    this.$_undefinedMap = {};
  },

  activated () {
    this.vscrollData.active = true;
  },

  deactivated () {
    this.vscrollData.active = false;
  },

  methods: {
    scrollToItem (index) {
      const scroller = this.$refs.scroller;
      if (scroller) scroller.scrollToItem(index);
    },

    scrollToBottom () {
      if (this.$_scrollingToBottom) return;
      this.$_scrollingToBottom = true;
      const el = this.$el;
      // Item is inserted to the DOM
      this.$nextTick(() => {
        el.scrollTop = el.scrollHeight + 5000;
        // Item sizes are computed
        const cb = () => {
          el.scrollTop = el.scrollHeight + 5000;
          requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight + 5000;
            if (this.$_undefinedSizes === 0) {
              this.$_scrollingToBottom = false;
            } else {
              requestAnimationFrame(cb);
            }
          });
        };
        requestAnimationFrame(cb);
      });
    },
  },
};
</script>
