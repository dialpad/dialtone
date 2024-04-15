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
  <div
    v-if="noSearchResults"
    class="d-d-flex d-fl-center d-p16 d-gg4 d-fc-tertiary d-fs-300"
  >
    <span>No results found for</span>
    <strong class="d-fw-semibold">
      &OpenCurlyDoubleQuote;{{ searchCriteria }}&CloseCurlyDoubleQuote;
    </strong>
  </div>
  <token-tree v-else :node="filteredTokens" :category="null" :level="2" />
</template>

<script setup>
import tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';
import { getComposedTypographyTokens, getComposedShadowTokens, addTokenToStructure } from '../common/token-utilities';
import { FORMAT_MAP, THEMES, getTokensStructure } from '../common/constants';
import TokenTree from '@baseComponents/TokenTree.vue';
import { capitalize, computed, ref, onBeforeMount } from 'vue';
import { debounce } from '../common/utilities';

const tocOptions = {
  listClass: 'toc-list d-ls-reset',
  itemClass: 'toc-item lg:d-d-flex d-fw-wrap',
  linkTag: 'a',
  linkClass: 'd-btn d-btn--sm d-btn--muted d-w100p d-jc-flex-start',
  linkActiveClass: 'd-btn--active d-fc-primary',
  linkChildrenActiveClass: '',
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
  if (filteredTokens.value === null) return [];
  filteredHeaders.value = updateHeadersRecursively(filteredTokens.value, null);
};

const updateHeadersRecursively = (node, category) => {
  return Object.keys(node)
    .filter(subNodeKey => subNodeKey !== '_children')
    .map(subNodeKey => {
      return {
        title: capitalize(subNodeKey),
        level: 2,
        slug: category === null ? subNodeKey : `${category}-${subNodeKey}`,
        children: updateHeadersRecursively(node[subNodeKey], category === null ? subNodeKey : category),
      };
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

  // Replace '/' and '-' characters for ' ' to allow to search by the name shown in Figma:
  // typography/label/md-plain should match var(--dt-typography-label-plain)
  // or dtTypographyLabelMdPlain
  const searchValues = searchCriteria.value.replace(/\/|-/g, ' ').split(' ');
  const searchRegexArray = searchValues.map(value => value.replace(/\(/, '\\(').replace(/\)/, '\\)')); // escape parenthesis
  const regexArray = searchRegexArray.map(searchRegex => new RegExp(searchRegex, 'i'));

  filteredTokens.value = filterTokenNode(processedTokens[format.value][theme.value], null, regexArray);
  console.log(filteredTokens.value);
  updateHeaders();
};

const filterTokenNode = (node, name, regexArray) => {
  const subNodesRet = {};
  let childrenRet = [];
  const matchingRegex = [];
  const nonMatchingRegex = [];
  regexArray.forEach(regex => {
    if (regex.test(name)) matchingRegex.push(regex);
    else nonMatchingRegex.push(regex);
  });
  // If the name matches all the terms, return the entire node
  if (nonMatchingRegex.length === 0) {
    return node;
    // else return the children that match
  } else if (node._children) {
    childrenRet = node._children.filter(token => !token.hidden).filter(token => {
      const { name: tokenName, tokenValue, keywords } = token;
      return nonMatchingRegex.every(regex => regex.test(tokenName) || regex.test(tokenValue) || regex.test(keywords));
    });
  }
  // look for other categories in the same level and filter recursively
  Object.keys(node).forEach(key => {
    if (key !== '_children') {
      const subNode = filterTokenNode(node[key], key, nonMatchingRegex);
      if (subNode !== null) subNodesRet[key] = subNode;
    }
  });
  if (Object.keys(subNodesRet).length > 0 || childrenRet.length > 0) {
    return {
      _children: childrenRet,
      ...subNodesRet,
    };
  }
  return null;
};

const searchToken = () => {
  debounce(() => setSearchCriteria());
};

const resetSearch = () => {
  searchInput.value = null;
  setSearchCriteria();
};

const hasSearchTerm = computed(() => searchInput.value && searchInput.value.trim().length > 0);

const noSearchResults = computed(() => filteredTokens.value === null);

/*
Before mount process the file tokensJson and fill processedTokens with the data we want to show.
This data is static, and contains the tokens names, values, description, exampleValue,
exampleName for the tokens in every format, theme and category.

  processedTokens: {
    CSS: {
      light: {
        color:
          foreground:
            _children:
              [
                {
                  name: ...,
                  tokenValue: ...,
                  description: ...,
                  exampleValue: ...,
                  exampleName: ...,
                  keywords: ...,
                },
                ...
              ],
          surface: {...},
          ...
        typography: {...},
        shadow: {...},
        size: {...},
        space: {...},
        component: {...}
      },
      dark: {...},
    },
    Android: {
      light: {...},
      dark: {...},
    },
    iOS: {
      light: {...},
      dark: {...},
    },
  }
*/
onBeforeMount(() => {
  addTokens();
  addComposedTokens();
  filterTokens();
});

const addTokens = () => {
  Object.keys(FORMAT_MAP).forEach(format => {
    processedTokens[format] = {};
    for (const theme of THEMES) {
      // initialize processedTokens with desired structure
      const structure = getTokensStructure();
      Object.entries(tokensJson[theme.value]).forEach((token) => {
        addTokenToStructure(token, format, structure);
      });
      processedTokens[format][theme.value] = structuredClone(structure);
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

    processedTokens.CSS[theme].typography['font style']._children = [
      ...composedTypographyTokens,
      ...processedTokens.CSS[theme].typography['font style']._children,
    ];
    processedTokens.CSS[theme].shadow._children = [
      ...composedShadowTokens,
      ...processedTokens.CSS[theme].shadow._children,
    ];
  });
};
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
    right: 3%;
    z-index: var(--zi-base1);  /* to be on top of the page default toc */
    @media (max-width: 1260px) {
      display: none;
    }
  }
</style>
