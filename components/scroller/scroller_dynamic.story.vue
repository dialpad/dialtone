<template>
  <div>
    <h3>Scroller with dynamic size</h3>

    <button @click="updateItem(0)">
      Update Element Message
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
      :items="dynamicItems"
      :min-item-size="54"
      :scroller-height="300"
      :scroller-width="500"
      class="scroller"
      :dynamic="true"
      @user-position="userPosition = $event"
    >
      <template #default="{ item }">
        <div class="avatar">
          {{ item.id }}
          <img
            :key="item.avatar"
            :src="item.avatar"
            alt="avatar"
            class="image"
          >
        </div>
        <div class="text">
          {{ item.message }}
        </div>
      </template>
    </dt-scroller>
  </div>
</template>

<script setup>
import DtScroller from './scroller.vue';
import { nextTick, ref } from 'vue';

import defaultAvatar from './person.png';

/* eslint-disable max-len */
const messages = [
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor,nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam,nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni loremlorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc',
  'lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam',
  'lorem ipsum dolor sit amet',
];

const dynamicItems = ref(Array.from({ length: 37 }, (_, index) => ({
  id: index,
  avatar: defaultAvatar,
  message: messages[Math.floor(Math.random() * 8)],
})));

function updateItem (index) {
  dynamicItems.value[index].message = messages[Math.floor(Math.random() * 8)];
}

const scroller = ref('scroller');
const autoScrolling = ref(false);
const userPosition = ref(null);
let intervalId;

function addItem () {
  dynamicItems.value.push({
    id: dynamicItems.value.length,
    avatar: defaultAvatar,
    message: messages[Math.floor(Math.random() * 8)],
  });
}

function switchAutoScrolling () {
  autoScrolling.value = !autoScrolling.value;
  scroller.value.scrollToBottom();

  clearInterval(intervalId);
  intervalId = setInterval(function () {
    if (!autoScrolling.value) return;
    addItem();
    nextTick(() => {
      if (userPosition.value === 'bottom') {
        scroller.value.scrollToBottom();
      }
    });
  }, 1000);
}
</script>

<style lang="less" scoped>
.scroller {
  margin: 20px 0;
  border: 1px solid red;
}

.image{
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.autoscrolling{
  display: flex;
  align-items: center;
  div {
    background-color: red;
    width: 5px;
    height: 5px;
    border-radius: 25px;
    margin-left: 5px;

    &.enabled{
      background-color: #00ff00;
    }
  }
}
</style>
