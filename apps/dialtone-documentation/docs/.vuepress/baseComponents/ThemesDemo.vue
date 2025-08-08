<template>
  <div class="themes-demo">
    <themes-bar
      v-model:mode="selectedMode"
      v-model:theme="selectedTheme"
    />
    <div class="d-mt16">
      <themes-visual
        :mode="selectedMode"
        :theme="selectedTheme"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ThemesBar from './ThemesBar.vue';
import ThemesVisual from './ThemesVisual.vue';

// Reactive state for the selected options
const selectedMode = ref('light');
const selectedTheme = ref('dp');
</script>

<style scoped>
.themes-demo {
  margin: 2rem 0;
}
</style>
