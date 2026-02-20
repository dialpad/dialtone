<template>
  <kitchen-sink-view
    title="Kitchen Sink: Recipes"
    item-label="recipes"
    iframe-url="/iframe.html?id=kitchen-sink--recipes&viewMode=story"
    :loaders="loaders"
  />
</template>

<script setup>
import KitchenSinkView from './kitchen_sink_view.vue';

const loaders = import.meta.glob(
  '../../recipes/**/*.stories.js',
);
</script>
