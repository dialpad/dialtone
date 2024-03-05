<template>
  <div class="tokens-bar">
    <dt-input
      id="search-input"
      ref="searchRef"
      v-model="searchInput"
      aria-label="Search tokens"
      placeholder="Search Tokens / Value / Keyword"
      type="text"
      autocomplete="off"
      @keyup="searchToken"
    >
      <template #leftIcon>
        <dt-icon name="search" size="300" />
      </template>
      <template #rightIcon>
        <dt-button
          v-if="!isSearchEmpty"
          id="search-input-button-close"
          kind="muted"
          importance="clear"
          size="xs"
          circle
          aria-label="Clear search"
          @click="resetSearch"
        >
          <template #icon>
            <dt-icon name="close" size="200" />
          </template>
        </dt-button>
      </template>
    </dt-input>
    <dt-select-menu
      name="format-select"
      label="Select Format"
      select-class="d-w128"
      :options="formatSelectMenuOptions"
      @change="setFormat"
    />
    <dt-select-menu
      name="theme-select"
      label="Select Theme"
      select-class="d-w128"
      :options="THEMES"
      @change="setTheme"
    />
  </div>
  <div v-for="category in categories" :key="category">
    <slot :name="category">
      <!-- slot for anchor header -->
    </slot>
    <token-table :category="category" :format="format" :theme="theme" :search-criteria="searchCriteria" />
  </div>
</template>

<script setup>
import TokenTable, { CATEGORY_MAP, FORMAT_MAP, THEMES } from '@baseComponents/TokenTable.vue';
import { computed, ref } from 'vue';
import { debounce } from '../common/utilities';

const format = ref('CSS');
const theme = ref('light');
const categories = Object.keys(CATEGORY_MAP);
const searchInput = ref(null);
const searchCriteria = ref(null);

const formatSelectMenuOptions = computed(() => {
  return Object.keys(FORMAT_MAP).map((item) => {
    return { value: item, label: item };
  });
});

const setFormat = (newFormat) => {
  format.value = newFormat;
};

const setTheme = (newTheme) => {
  theme.value = newTheme;
};

const setSearchCriteria = () => (searchCriteria.value = searchInput.value);

const searchToken = () => {
  debounce(() => setSearchCriteria());
};

const resetSearch = () => {
  searchInput.value = null;
  setSearchCriteria();
};

const isSearchEmpty = computed(() => !searchInput.value || searchInput.value.trim().length === 0);
</script>

<style scoped>
  .tokens-bar {
    display: grid;
    grid-gap: var(--dt-space-400);
    grid-template-columns: auto min-content min-content;
    align-items: end;
  }
</style>
