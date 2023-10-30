<template>
  <!-- eslint-disable vue/no-static-inline-styles -->
  <dt-stack :direction="{ default: 'row' }" gap="400">
    <dt-select-menu
      name="format-select"
      label="Select Format"
      select-class="d-w128"
      :options="formatSelectMenuOptions"
      @change="setFormat"
    />
    <dt-select-menu
      v-if="category === 'color'"
      name="theme-select"
      label="Select Theme"
      select-class="d-w128"
      :options="THEMES"
      @change="setTheme"
    />
  </dt-stack>
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th
          scope="col"
        />
        <th
          scope="col"
        >
          Name
        </th>
        <th
          scope="col"
        >
          Value
        </th>
        <th
          scope="col"
        >
          Description
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="({ exampleValue, exampleName, name, tokenValue, description }) in tokensProcessed"
        :key="name"
      >
        <td>
          <token-example :category="category" :name="exampleName || name" :value="exampleValue" />
        </td>
        <th
          scope="row"
          class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100"
        >
          <dt-stack
            direction="row"
            gap="300"
            class="d-ai-center"
          >
            <span class="d-ws-nowrap">{{ name }}</span>
            <copy-button
              :text="name"
              aria-label="copy token"
            />
          </dt-stack>
        </th>
        <td
          class="d-fs-100 d-lh-300"
        >
          <div class="d-wmx264">
            {{ tokenValue }}
          </div>
        </td>
        <td
          class="d-fs-100 d-lh-300"
          v-text="description"
        />
      </tr>
    </tbody>
  </table>
</template>

<script>
import * as tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';
import { getComposedTypographyTokens, getComposedShadowTokens } from '../common/token-utilities';
import CopyButton from './CopyButton.vue';
import TokenExample from './TokenExample.vue';

const FORMAT_MAP = {
  CSS: 'css/variables',
  Android: 'compose/object',
  iOS: 'ios-swift/enum.swift',
};

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export const CATEGORY_MAP = {
  color: ['color', 'opacity', 'theme'],
  typography: ['typography', 'font'],
  size: ['size'],
  space: ['space'],
  shadow: ['shadow'],
  component: ['avatar', 'badge', 'checkbox', 'icon', 'inputs', 'action'],
};

const COMPOSED_TOKENS_CATEGORIES = [
  {
    category: 'typography',
    format: 'CSS',
    getTokensFn: getComposedTypographyTokens,
  },
  {
    category: 'shadow',
    format: 'CSS',
    getTokensFn: getComposedShadowTokens,
  },
];

export default {
  name: 'TokenTable',

  components: {
    CopyButton,
    TokenExample,
  },

  props: {
    category: {
      type: String,
      default: 'color',
      validator: (v) => Object.keys(CATEGORY_MAP).includes(v),
    },
  },

  data () {
    return {
      format: 'CSS',
      theme: 'light',
      THEMES,
    };
  },

  computed: {
    tokensProcessed () {
      const tokens = [];
      Object.entries(tokensJson[this.theme])
        .filter(([key, value]) => CATEGORY_MAP[this.category].includes(key.split('/')[0]) && value[FORMAT_MAP.CSS])
        .forEach(([_, value]) => {
          const { name, value: tokenValue, description } = value[FORMAT_MAP[this.format]] || {};
          // exclude base tokens
          if (!name.endsWith('base)') && !name.endsWith('root)')) {
            const { value: exampleValue, name: exampleName } = value[FORMAT_MAP.CSS];
            tokens.push({ exampleValue, exampleName, name, tokenValue, description });
          }
        });
      const composedTokens = [];
      if (COMPOSED_TOKENS_CATEGORIES.some(item => item.category === this.category && item.format === this.format)) {
        composedTokens.push(...COMPOSED_TOKENS_CATEGORIES
          .find(item => item.category === this.category).getTokensFn(this.theme));
      }
      return [...composedTokens, ...tokens];
    },

    formatSelectMenuOptions () {
      return Object.keys(FORMAT_MAP).map((item) => {
        return { value: item, label: item };
      });
    },
  },

  methods: {
    setFormat (newFormat) {
      this.format = newFormat;
    },

    setTheme (newTheme) {
      this.theme = newTheme;
    },

  },
};
</script>
