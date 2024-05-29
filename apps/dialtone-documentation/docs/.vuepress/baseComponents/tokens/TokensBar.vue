<!-- eslint-disable vuejs-accessibility/no-autofocus -->
<template>
  <dt-stack gap="400">
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
        :value="selectedFormat"
        :options="formatSelectMenuOptions"
        @change="setFormat"
      />
      <dt-select-menu
        name="theme-select"
        label="Select Theme"
        select-class="d-w128"
        :value="selectedTheme"
        :options="THEMES"
        @change="setTheme"
      />
    </div>
    <div class="d-ta-right">
      <dt-button
        v-dt-tooltip="shareLinkTooltip"
        size="xs"
        importance="clear"
        kind="muted"
        icon-position="right"
        @click="copyURLToClipboard"
      >
        share filter
        <template #icon="{ iconSize }">
          <dt-icon
            name="link-2"
            :size="iconSize"
          />
        </template>
      </dt-button>
    </div>
  </dt-stack>
</template>

<script setup>
import { computed, ref } from 'vue';
import { FORMAT_MAP, THEMES } from './constants';
import { debounce } from '../../common/utilities';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['changeSearchCriteria', 'changeFormat', 'changeTheme']);

const searchInput = ref(route.query.search || null);
const selectedFormat = ref(route.query.format || 'CSS');
const selectedTheme = ref(route.query.theme || 'light');
const searchCriteria = ref(null);
const shareLinkTooltip = ref('Copy URL to clipboard');

const formatSelectMenuOptions = computed(() => {
  return Object.keys(FORMAT_MAP).map((item) => {
    return { value: item, label: item };
  });
});

const setSearchCriteria = () => {
  searchCriteria.value = searchInput.value?.trim();
  router.replace({ path: '/tokens/', query: { ...route.query, search: searchCriteria.value } });
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
  router.replace({ path: '/tokens/', query: { ...route.query, format: newFormat } });
  emit('changeFormat', newFormat);
};

const setTheme = (newTheme) => {
  router.replace({ path: '/tokens/', query: { ...route.query, theme: newTheme } });
  emit('changeTheme', newTheme);
};

const copyURLToClipboard = async () => {
  try {
    const defaultValue = shareLinkTooltip.value;
    await navigator.clipboard.writeText(window.location);
    shareLinkTooltip.value = 'Copied';
    await new Promise(resolve => setTimeout(resolve, 750));
    shareLinkTooltip.value = defaultValue;
  } catch (err) {
    console.error('Error copying to clipboard');
  }
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
