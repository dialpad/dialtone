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
        v-for="({ exampleValue, exampleName, name, tokenValue, description }) in tokens"
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
    tokens: {
      type: Array,
      default: () => [],
    },

    category: {
      type: String,
      default: 'color',
      validator: (v) => Object.keys(CATEGORY_MAP).includes(v),
    },

    tokenList: {
      type: Object,
      default: null,
    },
  },

  methods: {
    remToPixels (value) {
      if (this.category !== 'size' && this.category !== 'space') return;
      return `${parseFloat(value.replace('rem', '')) * 10}px`;
    },
  },
};
</script>
