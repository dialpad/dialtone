<template>
  <aside class="d-of-auto d-py32 lg:d-ps-relative lg:d-w100p d-ps-fixed dialtone-toc">
    <h2 class="d-headline-eyebrow d-fw-semibold d-fc-secondary d-px12 d-pb4">
      On this page
    </h2>
    <toc
      :headers="filteredHeaders"
      :options="tocOptions"
    />
  </aside>
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
  <div v-for="category in filteredTokensKeys" :key="category">
    <h2
      :id="category"
      class="d-docsite--header-2 d-tt-capitalize"
      tabindex="-1"
    >
      <a
        :href="`#${category}`"
        class="header-anchor d-link d-docsite--link d-link"
      >#</a>
      {{ category }}
    </h2>
    <p v-if="getCategoryIntro(category)" class="dialtone-intro">
      {{ getCategoryIntro(category) }}
    </p>
    <div v-if="getCategoryDescription(category)" v-html="getCategoryDescription(category)" />
    <token-table :category="category" :tokens="filteredTokens[category]" />
  </div>
  <div
    v-if="noSearchResults"
    class="d-d-flex d-fl-center d-p16 d-gg4 d-fc-tertiary d-fs-300"
  >
    <span>No results found for</span>
    <strong class="d-fw-semibold">
      &OpenCurlyDoubleQuote;{{ searchCriteria }}&CloseCurlyDoubleQuote;
    </strong>
  </div>
</template>

<script setup>
import tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';
import { getComposedTypographyTokens, getComposedShadowTokens } from '../common/token-utilities';
import { CATEGORY_MAP, FORMAT_MAP, THEMES } from '../common/constants';
import TokenTable from '@baseComponents/TokenTable.vue';
import { capitalize, computed, ref, onBeforeMount } from 'vue';
import { debounce } from '../common/utilities';

const tocOptions = {
  listClass: 'toc-list d-ls-reset',
  itemClass: 'toc-item lg:d-d-flex d-fw-wrap',
  linkTag: 'a',
  linkClass: 'd-btn d-btn--sm d-btn--muted d-fw-normal d-w100p d-jc-flex-start',
  linkActiveClass: 'd-btn--active d-fc-primary',
  linkChildrenActiveClass: '',
};

const categoryIntroAndDesc = {
  size: {
    intro: 'Consistent size and scale.',
    description: `Need help using these design tokens? Learn how in the
      <a href="/design/size/" class="d-docsite--link d-link">Sizing documentation</a>.`,
  },
  space: {
    intro: 'Defines the paddings, gaps, and margins.',
    description: `Need help using these design tokens? Learn how in the
      <a href="/design/space/" class="d-docsite--link d-link">Spacing documentation</a>.`,
  },
};

const getCategoryIntro = (category) => {
  return categoryIntroAndDesc[category]?.intro;
};

const getCategoryDescription = (category) => {
  return categoryIntroAndDesc[category]?.description;
};

const format = ref('CSS');
const theme = ref('light');
const searchInput = ref(null);
const searchCriteria = ref(null);
const processedTokens = {}; // is set beforeMount and never changes
const filteredTokens = ref({}); // same as processedTokens but filtered by format, theme and search
const filteredHeaders = ref([]); // to fill the dynamic table of contents

const formatSelectMenuOptions = computed(() => {
  return Object.keys(FORMAT_MAP).map((item) => {
    return { value: item, label: item };
  });
});

const updateHeaders = () => {
  filteredHeaders.value = filteredTokensKeys.value.map((category) => {
    return { title: capitalize(category), level: 2, slug: category, children: [] };
  });
};

const setFormat = (newFormat) => {
  format.value = newFormat;
  filterTokens();
};

const setTheme = (newTheme) => {
  theme.value = newTheme;
  filterTokens();
};

const setSearchCriteria = () => {
  searchCriteria.value = searchInput.value?.trim();
  filterTokens();
};

const filterTokens = () => {
  if (!searchCriteria.value) {
    filteredTokens.value = structuredClone(processedTokens[format.value][theme.value]);
    updateHeaders();
    return;
  }
  const newTokens = {};

  // Replace '/' characters for '-' to allow to search by the name shown in Figma:
  // typography/body/compact/small should match typography-body-compact-small
  const searchValues = searchCriteria.value.replaceAll('/', '-').split(' ');

  Object.keys(CATEGORY_MAP).forEach((category) => {
    const results = processedTokens[format.value][theme.value][category].filter((token) => {
      return searchValues.every(searchValue => {
        const searchRegex = searchValue.replace(/\(/, '\\(').replace(/\)/, '\\)'); // escape parenthesis
        const regex = new RegExp(searchRegex, 'i');
        if (regex.test(category)) return true;
        const { name, tokenValue, description } = token;
        return regex.test(name) || regex.test(tokenValue) || regex.test(description);
      });
    });
    if (results.length) newTokens[category] = results;
  });
  filteredTokens.value = structuredClone(newTokens);
  updateHeaders();
};

const searchToken = () => {
  debounce(() => setSearchCriteria());
};

const resetSearch = () => {
  searchInput.value = null;
  setSearchCriteria();
};

const filteredTokensKeys = computed(() => Object.keys(filteredTokens.value));

const hasSearchTerm = computed(() => searchInput.value && searchInput.value.trim().length > 0);

const noSearchResults = computed(() => filteredTokensKeys.value.length === 0);

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
  filterTokens();
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
  .dialtone-toc {
    width: var(--dt-size-850);
    height: calc(100vh - var(--dt-size-700));
    top: var(--dt-space-700);
    right: var(--dt-space-730);
    @media (max-width: 1260px) {
      display: none;
    }
  }
</style>
