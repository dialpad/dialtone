<template>
  <div>
    <h3>Scroller</h3>

    <button @click="scrollToItem(25)">
      Go to index 25
    </button>
    <button @click="scrollToItem(0)">
      Go to start
    </button>
    <button @click="scrollToItem(items.length - 1)">
      Go to end
    </button>

    <button @click="addItemTop">
      Add 10 items top
    </button>

    <br>
    <br>
    <button
      class="autoscrolling"
      @click="switchAutoScrolling"
    >
      Auto scrolling <div :class="{ 'enabled': autoScrolling }" />
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
      :buffer="$attrs.buffer"
      @user-position="$attrs.onUserPosition($event); userPosition = $event"
      @scroll-start="$attrs.onScrollStart()"
      @scroll-end="$attrs.onScrollEnd()"
    >
      <template #default="{ item }">
        <div class="user">
          <dt-avatar
            :seed="String(item.id)"
            size="200"
            :full-name="item.name"
          />
          {{ item.name }}
        </div>
      </template>
      <template #after>
        <div
          v-if="isFetching"
          class="d-p8 d-fc-muted d-helper--md"
        >
          Loading more…
        </div>
      </template>
    </dt-scroller>
  </div>
</template>

<script setup>
import DtScroller from './Scroller.vue';
import { DtAvatar } from '@/components/Avatar';
import { nextTick, ref } from 'vue';

const items = ref(Array.from({ length: 50 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
})));

const scroller = ref('scroller');

const autoScrolling = ref(false);

const userPosition = ref(null);

// Demonstrates the documented pattern for the `after` slot: guard it with your
// own flag rather than relying on the scroller to show or hide it for you.
const isFetching = ref(true);

let intervalId;

function scrollToItem (index) {
  scroller.value.scrollToItem(index);
}

function addItem () {
  items.value.push({
    id: items.value.length,
    name: `User ${items.value.length}`,
  });
}

function addItemTop () {
  const aux = items.value.length;
  for (let i = 1; i <= 10; i++) {
    items.value.unshift({
      id: aux + i,
      name: `User ${aux + i}`,
    });
  }
  scroller.value.scrollToItem(10);
  scroller.value.updateItems();
}

function switchAutoScrolling () {
  autoScrolling.value = !autoScrolling.value;
  scroller.value.scrollToItem(items.value.length - 1);

  clearInterval(intervalId);
  intervalId = setInterval(function () {
    if (!autoScrolling.value) return;
    addItem();
    nextTick(() => {
      if (userPosition.value === 'blockEnd') {
        scroller.value.scrollToItem(items.value.length - 1);
      }
    });
    scroller.value.updateItemsFromBottom();
  }, 1000);
}
</script>

<style lang="less" scoped>
.scroller {
  margin: 20px 0;
  border: 1px solid red;
}

.user {
  block-size: 25px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-block-end: 1px solid #eee;
}

.autoscrolling{
  display: flex;
  align-items: center;
  :where(div) {
    inline-size: 5px;
    block-size: 5px;
    border-radius: 25px;
    margin-inline-start: 5px;

    &.enabled{
      background-color: #00ff00;
    }
  }
}
</style>
