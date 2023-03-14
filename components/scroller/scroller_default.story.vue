<template>
  <div>
    <h3>Scroller</h3>

    <button @click="scrollToItem(100)">
      Go to index 100
    </button>
    <button @click="scrollToItem(0)">
      Go to start
    </button>
    <button @click="scrollToItem(items.length - 1)">
      Go to end
    </button>

    <dt-scroller
      ref="scroller"
      class="scroller"
      :items="items"
      :item-size="$attrs.itemSize"
      :scroller-height="$attrs.scrollerHeight"
      :scroller-width="$attrs.scrollerWidth"
      :min-item-size="$attrs.minItemSize"
      :list-tag="$attrs.listTag"
      :item-tag="$attrs.itemTag"
      :direction="$attrs.direction"
      @scroll-start="$attrs.onScrollStart"
      @scroll-end="$attrs.onScrollEnd"
    >
      <template #default="{ item }">
        <div class="user">
          {{ item.name }}
        </div>
      </template>
    </dt-scroller>
  </div>
</template>

<script setup>
import DtScroller from './DtScroller';
import { ref } from 'vue';

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
}));

const scroller = ref('scroller');

function scrollToItem (index) {
  scroller.value.scrollToItem(index);
}
</script>

<style scoped>
.scroller {
  margin: 20px 0;
  border: 1px solid red;
}

.user {
  height: 25px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}
</style>
