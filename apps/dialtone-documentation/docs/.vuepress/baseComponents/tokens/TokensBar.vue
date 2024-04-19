<!-- eslint-disable vuejs-accessibility/no-autofocus -->
<template>
  <div class="tokens-bar">
    <dt-input
      id="search-input"
      v-model="searchInput"
      autofocus
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
          v-if="hasSearchTerm"
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
</template>

<script setup>
import { computed, ref } from 'vue';
import { FORMAT_MAP, THEMES } from './constants';
import { debounce } from '../../common/utilities';

const emit = defineEmits(['changeSearchCriteria', 'changeFormat', 'changeTheme']);

const searchInput = ref(null);
const searchCriteria = ref(null);

const formatSelectMenuOptions = computed(() => {
  return Object.keys(FORMAT_MAP).map((item) => {
    return { value: item, label: item };
  });
});

const setSearchCriteria = () => {
  searchCriteria.value = searchInput.value?.trim();
  emit('changeSearchCriteria', searchCriteria.value);
};

const searchToken = () => {
  debounce(() => setSearchCriteria());
};

const resetSearch = () => {
  searchInput.value = null;
  setSearchCriteria();
};

const hasSearchTerm = computed(() => searchInput.value && searchInput.value.trim().length > 0);

const setFormat = (newFormat) => {
  emit('changeFormat', newFormat);
};

const setTheme = (newTheme) => {
  emit('changeTheme', newTheme);
};
</script>

<style scoped>
  .tokens-bar {
    display: grid;
    grid-gap: var(--dt-space-400);
    grid-template-columns: auto min-content min-content;
    align-items: end;
  }
</style>
