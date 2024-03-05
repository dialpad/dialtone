<template>
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
          {{ tokenList ? "REM" : "Value" }}
        </th>
        <th
          v-show="!!tokenList"
          scope="col"
        >
          PX
        </th>
        <th
          scope="col"
        >
          {{ tokenList ? "Usage" : "Description" }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="({ exampleValue, exampleName, name, tokenValue, description }) in tokensProcessed"
        :key="name"
      >
        <td>
          <token-example :category="category" :name="exampleName || name" :value="exampleValue.toString()" />
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
          class="d-ff-mono d-fw-normal d-fs-100 d-fs-100 d-lh-300"
        >
          <div class="d-wmx264">
            {{ tokenValue }}
          </div>
        </td>
        <td
          v-show="!!tokenList"
          class="d-ff-mono d-fw-normal d-fs-100 d-fs-100 d-lh-300"
        >
          <div class="d-wmx264">
            {{ remToPixels(tokenValue) }}
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

export const FORMAT_MAP = {
  CSS: 'css/variables',
  Android: 'compose/object',
  iOS: 'ios-swift/enum.swift',
};

export const THEMES = [
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

    format: {
      type: String,
      default: 'CSS',
      validator: (v) => Object.keys(FORMAT_MAP).includes(v),
    },

    theme: {
      type: String,
      default: 'light',
      validator: (v) => THEMES.find(theme => theme.value === v),
    },

    tokenList: {
      type: Object,
      default: null,
    },
  },

  data () {
    return {
      processedTokens: {
        CSS: {
          light: [],
          dark: [],
        },

        Android: {
          light: [],
          dark: [],
        },

        iOS: {
          light: [],
          dark: [],
        },
      },
    };
  },

  computed: {
    tokensProcessed () {
      return this.processedTokens[this.format][this.theme];
    },

    formatSelectMenuOptions () {
      return Object.keys(FORMAT_MAP).map((item) => {
        return { value: item, label: item };
      });
    },
  },

  beforeMount () {
    this.addTokens();
    this.addComposedTokens();
  },

  methods: {
    remToPixels (value) {
      if (this.category !== 'size' && this.category !== 'space') return;
      return `${parseFloat(value.replace('rem', '')) * 10}px`;
    },

    isBaseToken (name) {
      return name.endsWith('base)') || name.endsWith('root)');
    },

    tokenInList (name) {
      return this.tokenList && this.tokenList[name];
    },

    addTokens () {
      for (const format in this.processedTokens) {
        for (const theme of THEMES) {
          const tokens = [];
          Object.entries(tokensJson[theme.value])
            .filter(([key, value]) => CATEGORY_MAP[this.category].includes(key.split('/')[0]) &&
          value[FORMAT_MAP.CSS] &&
          (!this.tokenList || this.tokenList[value[FORMAT_MAP.CSS].name]))
            .forEach(([_, value]) => {
              const { name, value: tokenValue, description } = value[FORMAT_MAP[format]] || {};
              const tokenDescription = this.tokenInList(name) ? this.tokenList[name].description : description;
              // exclude base tokens
              if (name && !this.isBaseToken(name)) {
                const { value: exampleValue, name: exampleName } = value[FORMAT_MAP.CSS];
                tokens.push({ exampleValue, exampleName, name, tokenValue, description: tokenDescription });
              }
            });
          this.processedTokens[format][theme.value] = [...tokens];
        }
      }
    },

    addComposedTokens () {
      if (this.category === 'typography') {
        for (const theme of THEMES) {
          this.processedTokens.CSS[theme.value] = [
            ...getComposedTypographyTokens(),
            ...this.processedTokens.CSS[theme.value],
          ];
        }
      } else if (this.category === 'shadow') {
        for (const theme of THEMES) {
          this.processedTokens.CSS[theme.value] = [
            ...getComposedShadowTokens(theme.value),
            ...this.processedTokens.CSS[theme.value],
          ];
        }
      }
    },
  },
};
</script>
