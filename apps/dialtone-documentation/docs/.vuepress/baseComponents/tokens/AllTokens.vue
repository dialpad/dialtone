<template>
  <tokens-bar
    @change-search-criteria="onChangeSearchCriteria"
    @change-format="onChangeFormat"
    @change-theme="onChangeTheme"
  />
  <tokens-toc :headers="filteredHeaders" />
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
import { capitalize, computed, ref, onBeforeMount } from 'vue';
import tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';
import { FORMAT_MAP, THEMES, getTokensStructure } from './constants';
import TokenTree from './TokenTree.vue';
import TokensToc from './TokensToc.vue';
import TokensBar from './TokensBar.vue';
import { getComposedTypographyTokens, getComposedShadowTokens, addTokenToStructure } from './utilities';

const format = ref('CSS');
const theme = ref('light');
const searchCriteria = ref(null);
const processedTokens = {}; // is set beforeMount and never changes
const filteredTokens = ref({}); // same as processedTokens but filtered by format, theme and search
const filteredHeaders = ref([]); // to fill the dynamic table of contents

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

const onChangeFormat = (newFormat) => {
  format.value = newFormat;
  filterTokens();
};

const onChangeTheme = (newTheme) => {
  theme.value = newTheme;
  filterTokens();
};

const onChangeSearchCriteria = (criteria) => {
  searchCriteria.value = criteria;
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
      processedTokens[format][theme.value] = getTokensStructure();
      Object.entries(tokensJson[theme.value]).forEach((token) => {
        addTokenToStructure(token, format, processedTokens[format][theme.value]);
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
