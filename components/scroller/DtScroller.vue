<template>
  <component
    :is="dynamic ? DynamicScroller : CoreScroller"
    ref="scroller"
    data-qa="dt-scroller"
    :items="items"
    :item-size="itemSize"
    :min-item-size="minItemSize"
    :direction="direction"
    key-field="id"
    :list-tag="listTag"
    :item-tag="itemTag"
    :style="computedStyle"
    tabindex="0"
    @scroll-start="$emit('scroll-start')"
    @scroll-end="$emit('scroll-end')"
  >
    <template
      #default="{ item, index, active }"
    >
      <slot
        v-bind="{
          item: item,
          index,
          active,
        }"
      />
    </template>
  </component>
</template>

<script setup>
import CoreScroller from './modules/core-scroller.vue';
import DynamicScroller from './modules/dynamic-scroller.vue';
import { provide, computed, watch, ref } from 'vue';

const props = defineProps({
  /**
      * The direction of the scroller.
      * @values vertical, horizontal
     */
  direction: {
    type: String,
    default: 'vertical',
    validator: (value) => ['vertical', 'horizontal'].includes(value),
  },

  /**
     * Indicates if the items need to react to changes in their size.
     * If disabled the itemSize prop is required and you will get improved performance.
     * If enabled the minItemSize prop is required and you
     * will have reduced performance but the ability to reactively size list items
      * @values true, false
     */
  dynamic: {
    type: Boolean,
    default: false,
  },

  /**
      * Display height (or width in horizontal mode) of the items in pixels
      * used to calculate the scroll size and position.
     *  Required if DYNAMIC is false
     */
  itemSize: {
    type: Number,
    default: null,
  },

  /**
      * The tag to use for the items.
     */
  itemTag: {
    type: String,
    default: 'div',
  },

  /**
      * The items to render.
      * If the items are simple arrays, the index will be used as the key.
      * If the items are objects, the keyField will be used as the key.
     * @example items: [ 'item1', 'item2', 'item3' ]
     * @example items: [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' }, { id: 3, name: 'item3' } ]
     */
  items: {
    type: Array,
    required: true,
  },

  /**
      * The key field to use for the items.
      * If the items are objects, the scroller needs to be able to identify them.
      * By default it will look for an id field on the items.
      * This can be configured with this prop if you are using another field name.
     */
  keyField: {
    type: String,
    default: 'id',
  },

  /**
      * The tag to use for the list.
     */
  listTag: {
    type: String,
    default: 'div',
  },

  /**
      * Minimum size used if the height (or width in horizontal mode) of a item is unknown.
      * Is required for the initial render of items in DYNAMIC size mode.
     */
  minItemSize: {
    type: [Number, String],
    default: null,
  },

  /**
      * The height of the scroller.
      * Can be a number (in pixels) or a string (in CSS units).
     */
  scrollerHeight: {
    type: [String, Number],
    default: '100%',
  },

  /**
    * The width of the scroller.
    * Can be a number (in pixels) or a string (in CSS units).
    */
  scrollerWidth: {
    type: [String, Number],
    default: '100%',
  },
});

const emits = defineEmits(['scroll-start', 'scroll-end']);

provide('emit', emits);

const scroller = ref(null);

const computedStyle = computed(() => {
  return {
    width: typeof props.scrollerWidth === 'number' ? `${props.scrollerWidth}px` : props.scrollerWidth,
    height: typeof props.scrollerHeight === 'number' ? `${props.scrollerHeight}px` : props.scrollerHeight,
  };
});

watch(props, () => {
  validateProps();
}, { deep: true, immediate: true });

function scrollToItem (index) {
  if (scroller.value) scroller.value.scrollToItem(index);
}

function validateProps () {
  if (props.dynamic && !props.minItemSize) {
    console.error('DtScroller error: \'minItemSize\' is required on \'dynamic\' mode.');
  }

  if (!props.dynamic && !props.itemSize) {
    console.error('DtScroller error: \'itemSize\' is required.');
  }
}

defineExpose({
  scrollToItem,
});
</script>

<!-- <script> -->
<!-- import CoreScroller from './modules/core-scroller.vue'; -->
<!-- import DynamicScroller from './modules/dynamic-scroller.vue'; -->

<!-- export default { -->
<!--  name: 'DtScroller', -->

<!--  components: { -->
<!--    CoreScroller, -->
<!--    DynamicScroller, -->
<!--  }, -->

<!--  provide () { -->
<!--    // use function syntax so that we can access `this` -->
<!--    return { -->
<!--      emit: this.$emit, -->
<!--    }; -->
<!--  }, -->

<!--  props: { -->
<!--    /** -->
<!--      * The items to render. -->
<!--      * If the items are simple arrays, the index will be used as the key. -->
<!--      * If the items are objects, the keyField will be used as the key. -->
<!--     * @example items: [ 'item1', 'item2', 'item3' ] -->
<!--     * @example items: [ { id: 1, name: 'item1' }, { id: 2, name: 'item2' }, { id: 3, name: 'item3' } ] -->
<!--     */ -->
<!--    items: { -->
<!--      type: Array, -->
<!--      required: true, -->
<!--    }, -->

<!--    /** -->
<!--      * The width of the scroller. -->
<!--      * Can be a number (in pixels) or a string (in CSS units). -->
<!--     */ -->
<!--    scrollerWidth: { -->
<!--      type: [String, Number], -->
<!--      default: '100%', -->
<!--    }, -->

<!--    /** -->
<!--      * The height of the scroller. -->
<!--      * Can be a number (in pixels) or a string (in CSS units). -->
<!--     */ -->
<!--    scrollerHeight: { -->
<!--      type: [String, Number], -->
<!--      default: '100%', -->
<!--    }, -->

<!--    /** -->
<!--     * Indicates if the items need to react to changes in their size. -->
<!--     * If disabled the itemSize prop is required and you will get improved performance. -->
<!--     * If enabled the minItemSize prop is required and you -->
<!--     * will have reduced performance but the ability to reactively size list items -->
<!--      * @values true, false -->
<!--     */ -->
<!--    dynamic: { -->
<!--      type: Boolean, -->
<!--      default: false, -->
<!--    }, -->

<!--    /** -->
<!--      * The key field to use for the items. -->
<!--      * If the items are objects, the scroller needs to be able to identify them. -->
<!--      * By default it will look for an id field on the items. -->
<!--      * This can be configured with this prop if you are using another field name. -->
<!--     */ -->
<!--    keyField: { -->
<!--      type: String, -->
<!--      default: 'id', -->
<!--    }, -->

<!--    /** -->
<!--      * The direction of the scroller. -->
<!--      * @values vertical, horizontal -->
<!--     */ -->
<!--    direction: { -->
<!--      type: String, -->
<!--      default: 'vertical', -->
<!--      validator: (value) => ['vertical', 'horizontal'].includes(value), -->
<!--    }, -->

<!--    /** -->
<!--      * The tag to use for the list. -->
<!--     */ -->
<!--    listTag: { -->
<!--      type: String, -->
<!--      default: 'div', -->
<!--    }, -->

<!--    /** -->
<!--      * The tag to use for the items. -->
<!--     */ -->
<!--    itemTag: { -->
<!--      type: String, -->
<!--      default: 'div', -->
<!--    }, -->

<!--    /** -->
<!--      * Display height (or width in horizontal mode) of the items in pixels -->
<!--      * used to calculate the scroll size and position. -->
<!--     *  Required if DYNAMIC is false -->
<!--     */ -->
<!--    itemSize: { -->
<!--      type: Number, -->
<!--      default: null, -->
<!--    }, -->

<!--    /** -->
<!--      * Minimum size used if the height (or width in horizontal mode) of a item is unknown. -->
<!--      * Is required for the initial render of items in DYNAMIC size mode. -->
<!--     */ -->
<!--    minItemSize: { -->
<!--      type: [Number, String], -->
<!--      default: null, -->
<!--    }, -->
<!--  }, -->

<!--  emits: ['scroll-start', 'scroll-end'], -->

<!--  computed: { -->
<!--    computedStyle () { -->
<!--      return { -->
<!--        width: typeof this.scrollerWidth === 'number' ? `${this.scrollerWidth}px` : this.scrollerWidth, -->
<!--        height: typeof this.scrollerHeight === 'number' ? `${this.scrollerHeight}px` : this.scrollerHeight, -->
<!--      }; -->
<!--    }, -->
<!--  }, -->

<!--  watch: { -->
<!--    $props: { -->
<!--      immediate: true, -->
<!--      deep: true, -->
<!--      handler () { -->
<!--        this.validateProps(); -->
<!--      }, -->
<!--    }, -->
<!--  }, -->

<!--  methods: { -->
<!--    scrollToItem (index) { -->
<!--      const scroller = this.$refs.scroller; -->
<!--      if (scroller) scroller.scrollToItem(index); -->
<!--    }, -->

<!--    validateProps () { -->
<!--      if (this.dynamic && !this.minItemSize) { -->
<!--        console.error('DtScroller error: \'minItemSize\' is required on \'dynamic\' mode.'); -->
<!--      } -->

<!--      if (!this.dynamic && !this.itemSize) { -->
<!--        console.error('DtScroller error: \'itemSize\' is required.'); -->
<!--      } -->
<!--    }, -->
<!--  }, -->
<!-- }; -->
<!-- </script> -->
