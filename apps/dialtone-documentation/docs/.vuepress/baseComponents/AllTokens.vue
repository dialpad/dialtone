<template>
  <div class="tokens-bar">
    <dt-input
      id="search-input"
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
  <div v-for="category in Object.keys(filteredTokens)" :key="category">
    <slot :name="category">
      <!-- slot for anchor header -->
    </slot>
    <token-table :category="category" :tokens="filteredTokens[category]" />
  </div>
  <div
    v-if="!hasSearchResults"
    class="d-d-flex d-fl-center d-p16 d-gg4 d-fc-tertiary d-fs-300"
  >
    <span>No results found for</span>
    <strong class="d-fw-semibold">
      &OpenCurlyDoubleQuote;{{ searchCriteria }}&CloseCurlyDoubleQuote;
    </strong>
  </div>
</template>

<script setup>
import * as tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';
import { getComposedTypographyTokens, getComposedShadowTokens } from '../common/token-utilities';
import TokenTable, { CATEGORY_MAP, FORMAT_MAP, THEMES } from '@baseComponents/TokenTable.vue';
import { computed, ref, onBeforeMount } from 'vue';
import { debounce } from '../common/utilities';

const format = ref('CSS');
const theme = ref('light');
const searchInput = ref(null);
const searchCriteria = ref(null);
const processedTokens = {}; // is set beforeMount and never changes
const filteredTokens = ref({}); // same as processedTokens but filtered by format, theme and search

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

const setSearchCriteria = () => {
  searchCriteria.value = searchInput.value;

  if (!searchCriteria.value) {
    filteredTokens.value = structuredClone(processedTokens[format.value][theme.value]);
    return;
  }
  const newTokens = {};
  const regex = new RegExp(searchCriteria.value, 'i');
  Object.keys(CATEGORY_MAP).forEach((category) => {
    const results = processedTokens[format.value][theme.value][category].filter((token) => {
      if (regex.test(category)) return true;
      const { name, tokenValue, description } = token;
      return regex.test(name) || regex.test(tokenValue) || regex.test(description);
    });
    if (results.length) newTokens[category] = results;
  });
  filteredTokens.value = structuredClone(newTokens);
};

const searchToken = () => {
  debounce(() => setSearchCriteria());
};

const resetSearch = () => {
  searchInput.value = null;
  setSearchCriteria();
};

const isSearchEmpty = computed(() => !searchInput.value || searchInput.value.trim().length === 0);

const hasSearchResults = computed(() => Object.keys(filteredTokens.value).length > 0);

/*
* Before mount process the file tokensJson and fill processedTokens with the data we want to show.
* This data is static, and contains the tokens names, values, description, exampleValue,
* exampleName for the tokens in every format, theme and category.
*
* processedTokens: {
*    CSS: {
*      light: {
*        color: [
*          {
*            name: ...,
*            tokenValue: ...,
*            description: ...,
*            exampleValue: ...,
*            exampleName: ...,
*          },
*          ...
*        ],
*        typography: [...],
*        shadow: [...],
*        size: [...],
*        space: [...],
*        component: [...]
*       },
*       dark: {...},
*    },
*    Android: {
*      light: {...},
*      dark: {...},
*    },
*    iOS: {
*      light: {...},
*      dark: {...},
*    },
*  },
*/
onBeforeMount(() => {
  addTokens();
  addComposedTokens();
  filteredTokens.value = structuredClone(processedTokens[format.value][theme.value]);
});

const addTokens = () => {
  Object.keys(FORMAT_MAP).forEach(format => {
    for (const theme of THEMES) {
      Object.keys(CATEGORY_MAP).forEach(category => {
        const tokens = [];
        Object.entries(tokensJson[theme.value])
          .filter(([key, value]) => CATEGORY_MAP[category].includes(key.split('/')[0]) && value[FORMAT_MAP.CSS])
          .forEach(([_, value]) => {
            const { name, value: tokenValue, description } = value[FORMAT_MAP[format]] || {};
            // exclude base tokens
            if (name && !isBaseToken(name)) {
              const { value: exampleValue, name: exampleName } = value[FORMAT_MAP.CSS];
              tokens.push({ exampleValue, exampleName, name, tokenValue, description });
            }
          });
        if (!processedTokens[format]) processedTokens[format] = {};
        if (!processedTokens[format][theme.value]) processedTokens[format][theme.value] = {};
        processedTokens[format][theme.value][category] = [...tokens];
      });
    }
  });
};

/*
* Tokens that are a combination of other tokens.
* Only apply for the categories typography and shadow, and only in CSS format.
*/
const addComposedTokens = () => {
  const composedTypographyTokens = getComposedTypographyTokens();
  THEMES.forEach((themeObj) => {
    const theme = themeObj.value;
    const composedShadowTokens = getComposedShadowTokens(theme);
    processedTokens.CSS[theme].typography = [
      ...composedTypographyTokens,
      ...processedTokens.CSS[theme].typography,
    ];
    processedTokens.CSS[theme].shadow = [
      ...composedShadowTokens,
      ...processedTokens.CSS[theme].shadow,
    ];
  });
};

const isBaseToken = (name) => name.endsWith('base)') || name.endsWith('root)');
</script>

<style scoped>
  .tokens-bar {
    display: grid;
    grid-gap: var(--dt-space-400);
    grid-template-columns: auto min-content min-content;
    align-items: end;
  }
</style>
