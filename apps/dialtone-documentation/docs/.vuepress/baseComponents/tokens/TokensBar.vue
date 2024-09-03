<!-- eslint-disable vuejs-accessibility/no-autofocus -->
<template>
  <dt-stack gap="500" class="d-p16 d-bgc-secondary d-bar8">
    <dt-input
      id="search-input"
      v-model="searchCriteria"
      label="Search Tokens / Value / Keyword"
      autofocus
      aria-label="Search tokens"
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
    <dt-stack direction="row" gap="500" class="d-ai-flex-end">
      <dt-select-menu
        name="format-select"
        label="Format"
        select-class="d-w128"
        :value="format"
        :options="formatSelectMenuOptions"
        @change="updateFormat"
      />
      <dt-select-menu
        name="theme-select"
        label="Theme"
        select-class="d-w128"
        :value="theme"
        :options="THEMES"
        @change="updateTheme"
      />
      <dt-select-menu
        name="brand-select"
        label="Brand"
        select-class="d-w128"
        :value="brand"
        :options="BRANDS"
        @change="updateBrand"
      />
      <dt-button
        v-dt-tooltip:top-end="shareLinkTooltip"
        importance="clear"
        kind="muted"
        icon-position="left"
        class="d-ml-auto"
        @click="copyURLToClipboard"
      >
        Share Search Filter
        <template #icon="{ iconSize }">
          <dt-icon
            name="link-2"
            :size="iconSize"
          />
        </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
</template>

<script setup>
import { computed, ref } from 'vue';
import { FORMAT_MAP, THEMES, BRANDS } from './constants';
import { debounce } from '../../common/utilities';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  search: {
    type: String,
    default: null,
  },
  format: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['filter', 'update:search', 'update:format', 'update:theme', 'update:brand']);
const searchCriteria = ref(props.search?.trim());
const shareLinkTooltip = ref('Copy URL to clipboard');

const formatSelectMenuOptions = computed(() => {
  return Object.keys(FORMAT_MAP).map((item) => {
    return { value: item, label: item };
  });
});

const setSearchCriteria = () => {
  if (searchCriteria.value === props.search?.trim()) return;
  router.replace({ path: route.path, hash: route.hash, query: { ...route.query, search: searchCriteria.value } });
  emit('update:search', searchCriteria.value);
  emit('filter');
};

const searchToken = () => {
  debounce(() => setSearchCriteria());
};

const resetSearch = () => {
  searchCriteria.value = null;
  setSearchCriteria();
};

const hasSearchTerm = computed(() => props.search && props.search.trim().length > 0);

const updateFormat = async (newFormat) => {
  if (props.format === newFormat) return;
  await router.replace({ path: route.path, hash: route.hash, query: { ...route.query, format: newFormat } });
  emit('update:format', newFormat);
  emit('filter');
};

const updateTheme = async (newTheme) => {
  if (props.theme === newTheme) return;
  await router.replace({ path: route.path, hash: route.hash, query: { ...route.query, theme: newTheme } });
  emit('update:theme', newTheme);
  emit('filter');
};

const updateBrand = async (newBrand) => {
  if (props.brand === newBrand) return;
  await router.replace({ path: route.path, hash: route.hash, query: { ...route.query, brand: newBrand } });
  emit('update:brand', newBrand);
  emit('filter');
};

const copyURLToClipboard = async () => {
  const defaultValue = shareLinkTooltip.value;

  try {
    await navigator.clipboard.writeText(window.location.href);
    shareLinkTooltip.value = 'Copied';
  } catch (err) {
    shareLinkTooltip.value = 'Error copying to clipboard';
  }

  await new Promise(resolve => setTimeout(resolve, 750));
  shareLinkTooltip.value = defaultValue;
};
</script>
