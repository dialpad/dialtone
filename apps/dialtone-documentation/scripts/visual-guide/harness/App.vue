<template>
  <component :is="scene" v-if="scene" />
  <div v-else style="padding: 16px; font-family: sans-serif; color: var(--dt-color-foreground-primary);">
    Unknown scene: <strong>{{ sceneId || '(none)' }}</strong>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Eagerly load every scene SFC; pick the one named by ?scene=<id>.
const scenes = import.meta.glob('../scenes/*.vue', { eager: true, import: 'default' });

const sceneId = new URLSearchParams(window.location.search).get('scene');
const scene = computed(() => scenes[`../scenes/${sceneId}.vue`] ?? null);
</script>
