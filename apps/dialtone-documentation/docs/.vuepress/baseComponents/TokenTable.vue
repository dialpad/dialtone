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
          class="d-code--sm d-fc-purple-400"
        >
          <dt-stack
            direction="row"
            gap="300"
            class="d-ai-center"
          >
            <span>{{ name }}</span>
            <copy-button
              :text="name"
              aria-label="copy token"
            />
          </dt-stack>
        </th>
        <td
          class="d-code--sm"
        >
          <div class="d-wmx264">
            {{ tokenValue }}
          </div>
        </td>
        <td
          v-show="!!tokenList"
          class="d-code--sm"
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
import { CATEGORY_MAP } from '../common/constants';

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
      type: Boolean,
      default: false,
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
