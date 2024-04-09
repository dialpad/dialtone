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
  <token-tree :node="filteredTokens" :category="null" :level="2" />
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
import { CATEGORY_MAP, SUBCATEGORY_MAP, FORMAT_MAP, THEMES, getTokensStructure } from '../common/constants';
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
  filteredHeaders.value = Object.keys(filteredTokens.value).map(category => {
    const subcategories = Array.isArray(filteredTokens.value[category])
      ? []
      : Object.keys(filteredTokens.value[category]).reduce((accum, curr) => {
        if (curr !== '_children') {
          accum.push({
            title: capitalize(curr),
            level: 2,
            slug: `${category}-${curr}`,
            children: [],
          });
        }
        return accum;
      }, []);
    return { title: capitalize(category), level: 2, slug: category, children: subcategories };
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
  updateHeaders();
};

// eslint-disable-next-line complexity
const filterTokenNode = (node, name, regexArray) => {
  const subNodesRet = {};
  let childrenRet = [];
  const matchingRegex = [];
  const nonMatchingRegex = [];
  regexArray.forEach(regex => {
    if (regex.test(name)) matchingRegex.push(regex);
    else nonMatchingRegex.push(regex);
  });
  if (nonMatchingRegex.length === 0) {
    return node;
  } else if (node._children) {
    childrenRet = node._children.filter(token => !token.hidden).filter(token => {
      const { name: tokenName, tokenValue, keywords } = token;
      return nonMatchingRegex.every(regex => regex.test(tokenName) || regex.test(tokenValue) || regex.test(keywords));
    });
  }
  Object.keys(node).forEach(key => {
    if (key !== '_children') {
      const subNode = filterTokenNode(node[key], key, nonMatchingRegex);
      if (subNode !== null) subNodesRet[key] = subNode;
    }
  });
  if (Object.keys(subNodesRet).length > 0 || childrenRet.length > 0) {
    return {
      ...(name !== null ? { _children: childrenRet } : null),
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

const filteredTokensKeys = computed(() => Object.keys(filteredTokens.value));

const hasSearchTerm = computed(() => searchInput.value && searchInput.value.trim().length > 0);

const noSearchResults = computed(() => filteredTokensKeys.value.length === 0);

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
        shadow: [...],
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

// eslint-disable-next-line complexity
const addTokenToStructure = (token, format, structure) => {
  const [key, value] = token;
  if (!value[FORMAT_MAP[format]] || !value[FORMAT_MAP.CSS]) return;

  const { name, value: tokenValue, description, keywords } = value[FORMAT_MAP[format]];
  const { value: exampleValue, name: exampleName } = value[FORMAT_MAP.CSS];
  const displayToken = { exampleValue, exampleName, name, tokenValue, description, keywords };

  if (isBaseToken(key)) return;

  const splitKeys = key.split('/');

  // COLOR
  if (key.startsWith('color') && SUBCATEGORY_MAP.color.includes(splitKeys[1])) {
    addTokenToSubcategory(displayToken, 'color', SUBCATEGORY_MAP.color.find(sub => sub === splitKeys[1]), structure);
    return;
  }

  if (key.startsWith('color/brand') || key.startsWith('color/gradient')) {
    structure.color.brand._children.push(displayToken);
    return;
  }

  if (key.startsWith('opacity')) {
    structure.color.opacity._children.push(displayToken);
    return;
  }

  if ((CATEGORY_MAP.component.includes(splitKeys[0]) && (splitKeys[1] === 'color')) ||
    (CATEGORY_MAP.component.includes(splitKeys[1]) && splitKeys[0] === 'theme')) {
    structure.color.components._children.push(displayToken);
    return;
  }

  if (key.startsWith('color')) {
    structure.color.base._children.push(displayToken);
  }

  // TYPOGRAPHY
  if (key.startsWith('typography')) {
    structure.typography['font style']._children.push({ ...displayToken, hidden: true });
    return;
  }

  if (key.startsWith('font') && SUBCATEGORY_MAP.font.includes(splitKeys[1])) {
    const displaySubcategory = `font ${SUBCATEGORY_MAP.font.find(sub => sub === splitKeys[1])}`;
    addTokenToSubcategory(displayToken, 'typography', displaySubcategory, structure);
    return;
  }

  if (key.startsWith('font/text-case')) {
    structure.typography.textcase._children.push(displayToken);
    return;
  }

  if (key.startsWith('font/lineHeight')) {
    structure.typography['line height']._children.push(displayToken);
    return;
  }

  if (CATEGORY_MAP.component.includes(splitKeys[0]) &&
    (splitKeys[1] === 'font' || splitKeys[1] === 'lineHeight')) {
    structure.typography.components._children.push(displayToken);
    return;
  }

  // SHADOW
  if (key.startsWith('shadow')) {
    structure.shadow._children.push({ ...displayToken, hidden: true });
    return;
  }

  // SIZE
  if (key.startsWith('size') && key.endsWith('negative')) {
    structure.size.negative._children.push(displayToken);
    return;
  }

  if (key.startsWith('size') && key.endsWith('percent')) {
    structure.size.percentage._children.push(displayToken);
    return;
  }

  if (key.startsWith('size') && SUBCATEGORY_MAP.size.includes(splitKeys[1])) {
    addTokenToSubcategory(displayToken, 'size', SUBCATEGORY_MAP.size.find(sub => sub === splitKeys[1]), structure);
    return;
  }

  if (key.startsWith('size/radius')) {
    structure.size.radius._children.push(displayToken);
    return;
  }

  if (key.startsWith('size/border')) {
    structure.size.border._children.push(displayToken);
    return;
  }

  if (key.startsWith('size')) {
    structure.size._children.push(displayToken);
    return;
  }

  if (CATEGORY_MAP.component.includes(splitKeys[0]) && splitKeys[1] === 'size') {
    if (splitKeys[2] === 'border') {
      structure.size.components._children.push({ ...displayToken, hidden: true });
    } else {
      structure.size.components._children.push(displayToken);
    }
    return;
  }

  // SPACE
  if (key.startsWith('space') && key.endsWith('negative')) {
    structure.space.negative._children.push(displayToken);
    return;
  }

  if (key.startsWith('space') && key.endsWith('percent')) {
    structure.space.percentage._children.push(displayToken);
    return;
  }

  if (key.startsWith('space')) {
    structure.space._children.push(displayToken);
  }
};

const addTokenToSubcategory = (token, category, subcategory, structure) => {
  structure[category][subcategory]._children.push(token);
};

/*
* Tokens that are a combination of other tokens.
* Adds property "hidden" to the base tokens, because we don't want to show them on the list.
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

const isBaseToken = (name) => name.endsWith('base') || name.endsWith('root');
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
