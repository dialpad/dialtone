<template>
  <div
    ref="scroller"
    class="vue-recycle-scroller"
    :class="{
      ready,
      [`direction-${direction}`]: true,
    }"
    @scroll.passive="handleScroll"
  >
    <component
      :is="listTag"
      ref="wrapper"
      :style="{ [direction === 'vertical' ? 'minHeight' : 'minWidth']: `${totalSize}px` }"
      class="vue-recycle-scroller__item-wrapper"
      :class="listClass"
    >
      <component
        :is="itemTag"
        v-for="view in pool"
        :key="view.nr.id"
        :style="ready ? {
          transform: `translate${direction === 'vertical' ? 'Y' : 'X'}(${view.position}px) translate${direction === 'vertical' ? 'X' : 'Y'}(${view.offset}px)`,
          width: undefined,
          height: undefined,
        } : null"
        class="vue-recycle-scroller__item-view"
        :class="[
          itemClass,
          {
            hover: !skipHover && hoverKey === view.nr.key,
          },
        ]"
        v-on="skipHover ? {} : {
          mouseenter: () => { hoverKey = view.nr.key },
          mouseleave: () => { hoverKey = null },
        }"
      >
        <slot
          :item="view.item"
          :index="view.nr.index"
          :active="view.nr.used"
        />
      </component>
    </component>
  </div>
</template>

<!--
This is a code from external library (https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/src/components/RecycleScroller.vue)
We have modified it for our own specific use.
-->
<script setup>
import { computed, watch, markRaw, shallowReactive, onMounted, nextTick, reactive, ref } from 'vue';

const props = defineProps({
  /**
     * List of items you want to display in the scroller.
     */
  items: {
    type: Array,
    required: true,
  },

  /**
     *
     * Field used to identify items and optimize managing rendered views
     */
  keyField: {
    type: String,
    default: 'id',
  },

  /**
     * Direction of the scroller. Can be either `vertical` or `horizontal`.
     */
  direction: {
    type: String,
    default: 'vertical',
    validator: (value) => ['vertical', 'horizontal'].includes(value),
  },

  /**
     * Size of the items in the list.
     * If it is set to null (the default value), it will use variable size mode.
     */
  itemSize: {
    type: Number,
    default: null,
  },

  /**
     * Minimum size used if the height (or width in horizontal mode) of an item is unknown.
     */
  minItemSize: {
    type: [Number, String],
    default: null,
  },

  /**
     * Field used to get the item's size in variable size mode.
     */
  sizeField: {
    type: String,
    default: 'size',
  },

  /**
     * Amount of pixel to add to edges of the scrolling visible area to start rendering items further away.
     */
  buffer: {
    type: Number,
    default: 200,
  },

  /**
     * If true, the hover state will be skipped.
     * This can be useful if you want to use the hover state for other purposes.
     */
  skipHover: {
    type: Boolean,
    default: false,
  },

  /**
     * The element to render as the list's wrapper.
     */
  listTag: {
    type: String,
    default: 'div',
  },

  /**
     * The element to render as the list item.
     */
  itemTag: {
    type: String,
    default: 'div',
  },

  /**
     * The custom classes added to the item list wrapper.
     */
  listClass: {
    type: [String, Object, Array],
    default: '',
  },

  /**
     * The custom classes added to each item.
     */
  itemClass: {
    type: [String, Object, Array],
    default: '',
  },
});

const emit = defineEmits(['user-position']);

const views = reactive(new Map());
// const reactiveItems = reactive(props.items);
const unusedViews = reactive(new Map());
const updateTimeout = null;
const pool = ref([]);
const hoverKey = ref(null);
const ready = ref(false);
const scroller = ref(null);
const userPosition = ref('top');

let startIndex = 0;
let endIndex = 0;
let scrollDirty = false;
let lastUpdateScrollPosition = 0;
let sortTimer = null;
let computedMinItemSize = null;
let totalSize = 0;
let uid = 0;

const sizes = computed(() => {
  if (props.itemSize === null) {
    const sizes = {
      '-1': { accumulator: 0 },
    };
    const items = props.items;
    const field = props.sizeField;
    const minItemSize = props.minItemSize;
    let computedMinSize = 10000;
    let accumulator = 0;
    let current;
    for (let i = 0, l = items.length; i < l; i++) {
      current = items[i][field] || minItemSize;
      if (current < computedMinSize) {
        computedMinSize = current;
      }
      accumulator += current;
      sizes[i] = { accumulator, size: current };
    }

    computedMinItemSize = computedMinSize;
    return sizes;
  }
  return [];
});

const simpleArray = computed(() => {
  return props.items.length && typeof props.items[0] !== 'object';
});

const itemIndexByKey = computed(() => {
  const result = {};
  for (let i = 0, l = props.items.length; i < l; i++) {
    result[props.items[i][props.keyField]] = i;
  }
  return result;
});

// watch(reactiveItems, () => {
//   // if add to the top
//   // _updateVisibleItems(true);
//   // if autoscrolling  if add to the bottom
//   // _updateVisibleItems(false, true);
// });

watch(sizes, () => {
  _updateVisibleItems(false);
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    // In SSR mode, render the real number of visible items
    _updateVisibleItems(true);
    ready.value = true;
  });
});

const _addView = (pool, index, item, key, type) => {
  const nr = markRaw({
    id: uid++,
    index,
    used: true,
    key,
    type,
  });
  const view = shallowReactive({
    item,
    position: 0,
    nr,
  });
  pool.value.push(view);
  return view;
};

const _unuseView = (view, fake = false) => {
  const _unusedViews = unusedViews;
  const type = view.nr.type;
  let unusedPool = _unusedViews.get(type);
  if (!unusedPool) {
    unusedPool = [];
    _unusedViews.set(type, unusedPool);
  }
  unusedPool.push(view);
  if (!fake) {
    view.nr.used = false;
    view.position = -9999;
  }
};

const _getScroll = () => {
  const isVertical = props.direction === 'vertical';
  let scrollState;

  if (isVertical) {
    scrollState = {
      start: scroller.value.scrollTop,
      end: scroller.value.scrollTop + scroller.value.clientHeight,
    };
  } else {
    scrollState = {
      start: scroller.value.scrollLeft,
      end: scroller.value.scrollLeft + scroller.value.clientWidth,
    };
  }

  return scrollState;
};

const _itemsLimitError = () => {
  setTimeout(() => {
    // eslint-disable-next-line max-len
    console.error('It seems the scroller element isn\'t scrolling, so it tries to render all the items at once.', 'Scroller:', scroller);
    // eslint-disable-next-line max-len
    console.error('Make sure the scroller has a fixed height (or width) and \'overflow-y\' (or \'overflow-x\') set to \'auto\' so it can scroll correctly and only render the items visible in the scroll viewport.');
  });
  throw new Error('Rendered items limit reached');
};

const _sortViews = () => {
  pool.value.sort((viewA, viewB) => viewA.nr.index - viewB.nr.index);
};

const _updateVisibleItems = (checkItem, checkPositionDiff = false) => {
  const itemSize = props.itemSize;
  const minItemSize = computedMinItemSize;
  const keyField = simpleArray.value ? null : props.keyField;
  const items = props.items;
  const count = items.length;
  const _sizes = sizes.value;
  const _views = views;
  const _unusedViews = unusedViews;
  const _pool = pool;
  const _itemIndexByKey = itemIndexByKey;
  let _startIndex, _endIndex;
  let _totalSize;
  let visibleStartIndex, visibleEndIndex;

  if (!count) {
    _startIndex = _endIndex = visibleStartIndex = visibleEndIndex = _totalSize = 0;
  } else {
    const scroll = _getScroll();

    // Skip update if use hasn't scrolled enough
    if (checkPositionDiff) {
      let positionDiff = scroll.start - lastUpdateScrollPosition.value;
      if (positionDiff < 0) positionDiff = -positionDiff;
      if ((itemSize === null && positionDiff < minItemSize.value) || positionDiff < itemSize) {
        return {
          continuous: true,
        };
      }
    }
    lastUpdateScrollPosition = scroll.start;

    const _buffer = props.buffer;
    scroll.start -= _buffer;
    scroll.end += _buffer;

    // Variable size mode
    if (itemSize === null) {
      let h;
      let a = 0;
      let b = count - 1;
      let i = ~~(count / 2);
      let oldI;

      // Searching for _startIndex
      do {
        oldI = i;
        h = _sizes[i]?.accumulator;
        if (h < scroll.start) {
          a = i;
        } else if (i < count - 1 && _sizes[i + 1]?.accumulator > scroll.start) {
          b = i;
        }
        i = ~~((a + b) / 2);
      } while (i !== oldI);
      i < 0 && (i = 0);
      _startIndex = i;

      // For container style
      _totalSize = _sizes[count - 1]?.accumulator;

      // Searching for _endIndex
      for (
        _endIndex = i;
        _endIndex < count && _sizes[_endIndex]?.accumulator < scroll.end;
        _endIndex++
      );

      if (_endIndex === -1) {
        _endIndex = items.length - 1;
      } else {
        _endIndex++;
        // Bounds
        _endIndex > count && (_endIndex = count);
      }

      // search visible _startIndex
      for (
        visibleStartIndex = startIndex;
        visibleStartIndex < count && (_sizes[visibleStartIndex]?.accumulator) < scroll.start;
        visibleStartIndex++
      );

      // search visible endIndex
      for (
        visibleEndIndex = visibleStartIndex;
        visibleEndIndex < count && (_sizes[visibleEndIndex]?.accumulator) < scroll.end;
        visibleEndIndex++
      );
    } else {
      // Fixed size mode
      _startIndex = ~~(scroll.start / itemSize);
      const remainer = _startIndex % 1;
      _startIndex -= remainer;
      _endIndex = Math.ceil(scroll.end / itemSize);
      visibleStartIndex = Math.max(0, Math.floor((scroll.start) / itemSize));
      visibleEndIndex = Math.floor((scroll.end) / itemSize);

      // Bounds
      _startIndex < 0 && (_startIndex = 0);
      _endIndex > count && (_endIndex = count);
      visibleStartIndex < 0 && (visibleStartIndex = 0);
      visibleEndIndex > count && (visibleEndIndex = count);

      _totalSize = Math.ceil(count / 1) * itemSize;
    }
  }

  // items limit 1000
  if (_endIndex - _startIndex > 1000) {
    _itemsLimitError();
  }

  totalSize = _totalSize;

  let view;

  const continuous = _startIndex <= endIndex && _endIndex >= _startIndex;

  // Unuse views that are no longer visible
  if (continuous) {
    for (let i = 0, l = _pool.value.length; i < l; i++) {
      view = _pool.value[i];
      if (view?.nr.used) {
        // Update view item index
        if (checkItem) {
          view.nr.index = _itemIndexByKey[view.item[keyField]];
        }

        // Check if index is still in visible range
        if (
          view.nr.index == null ||
          view.nr.index < _startIndex ||
          view.nr.index >= _endIndex
        ) {
          _unuseView(view);
        }
      }
    }
  }

  const unusedIndex = continuous ? null : new Map();

  let item, type;
  let v;
  for (let i = _startIndex; i < _endIndex; i++) {
    item = items[i];
    const key = keyField ? item?.[keyField] : item;

    if (key == null) {
      throw new Error(`Key is ${key} on item (keyField is '${keyField}')`);
    }
    view = _views.get(key);

    if (!itemSize && !_sizes[i]?.size) {
      if (view) _unuseView(view);
      continue;
    }

    type = item.type;

    let unusedPool = _unusedViews.get(type);
    // let newlyUsedView = false;

    // No view assigned to item
    if (!view) {
      if (continuous) {
        // Reuse existing view
        if (unusedPool && unusedPool.length) {
          view = unusedPool.pop();
        } else {
          view = _addView(_pool, i, item, key, type);
        }
      } else {
        // Use existing view
        // We don't care if they are already used
        // because we are not in continous scrolling
        v = unusedIndex.get(type) || 0;

        if (!unusedPool || v >= unusedPool.length) {
          view = _addView(_pool, i, item, key, type);
          _unuseView(view, true);
          unusedPool = _unusedViews.get(type);
        }

        view = unusedPool[v];
        unusedIndex.set(type, v + 1);
      }

      // Assign view to item
      _views.delete(view.nr.key);
      view.nr.used = true;
      view.nr.index = i;
      view.nr.key = key;
      view.nr.type = type;
      _views.set(key, view);

      // newlyUsedView = true;
    } else {
      // View already assigned to item
      if (!view.nr.used) {
        view.nr.used = true;
        // newlyUsedView = true;
        if (unusedPool) {
          const index = unusedPool.indexOf(view);
          if (index !== -1) unusedPool.splice(index, 1);
        }
      }
    }

    // Always set item in case it's a new object with the same key
    view.item = item;

    // if (newlyUsedView) {
    //   if (items.length === 0) return;
    //   if (i === items.length - 1) emit('scroll-end');
    //   if (i === 0) emit('scroll-start');
    // }

    // Update position
    if (itemSize === null) {
      view.position = _sizes[i - 1]?.accumulator;
      view.offset = 0;
    } else {
      view.position = Math.floor(i) * itemSize;
      view.offset = (i % 1) * itemSize;
    }
  }

  startIndex = _startIndex;
  endIndex = _endIndex;

  // After the user has finished scrolling
  // Sort views so text selection is correct
  clearTimeout(sortTimer);
  sortTimer = setTimeout(_sortViews, 300);

  return {
    continuous,
  };
};

const _scrollToPosition = (position) => {
  const direction = props.direction === 'vertical'
    ? { scroll: 'scrollTop', start: 'top' }
    : { scroll: 'scrollLeft', start: 'left' };

  const viewport = scroller.value;
  const scrollDirection = direction.scroll;

  viewport[scrollDirection] = position;
};

const scrollToItem = (index) => {
  let scroll;
  if (props.itemSize === null) {
    scroll = index > 0 ? sizes.value[index - 1]?.accumulator : 0;
  } else {
    scroll = Math.floor(index) * props.itemSize;
  }
  _scrollToPosition(scroll);
};

const handleScroll = () => {
  const container = scroller.value;

  if (userPosition.value !== 'middle') {
    userPosition.value = 'middle';
    emit('user-position', 'middle');
  }

  // Check if the scroll is at the top of the container
  if (container.scrollTop === 0) {
    userPosition.value = 'top';
    emit('user-position', 'top');
  }

  // Check if the scroll is at the bottom of the container
  if (container.scrollTop + container.clientHeight === container.scrollHeight) {
    userPosition.value = 'bottom';
    emit('user-position', 'bottom');
  }

  if (!scrollDirty) {
    scrollDirty = true;
    if (updateTimeout) return;

    const requestUpdate = () => requestAnimationFrame(() => {
      scrollDirty = false;
      _updateVisibleItems(false, true);
    });

    requestUpdate();
  }
};

defineExpose({
  scrollToItem,
  _updateVisibleItems,
});
</script>

<style>
.vue-recycle-scroller{
    position:relative
}
.vue-recycle-scroller.direction-vertical:not(.page-mode){
    overflow-y:auto
}
.vue-recycle-scroller.direction-horizontal:not(.page-mode){
    overflow-x:auto
}
.vue-recycle-scroller.direction-horizontal{
    display:flex
}
.vue-recycle-scroller__slot{
    flex:auto 0 0
}
.vue-recycle-scroller__item-wrapper{
    flex:1;
    box-sizing:border-box;
    overflow:hidden;
    position:relative
}
.vue-recycle-scroller.ready .vue-recycle-scroller__item-view{
    position:absolute;
    top:0;
    left:0;
    will-change:transform
}
.vue-recycle-scroller.direction-vertical .vue-recycle-scroller__item-wrapper{
    width:100%
}
.vue-recycle-scroller.direction-horizontal .vue-recycle-scroller__item-wrapper{
    height:100%
}
.vue-recycle-scroller.ready.direction-vertical .vue-recycle-scroller__item-view{
    width:100%
}
.vue-recycle-scroller.ready.direction-horizontal .vue-recycle-scroller__item-view{
    height:100%
}
 </style>
