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
        v-for="({ exampleValue, exampleName, name, tokenValue, description }) in shownTokens"
        :key="name"
        tabindex="0"
        @mouseenter="onEnterRow(name)"
        @mouseleave="onLeaveRow()"
        @focusin="onEnterRow(name)"
        @focusout="onLeaveRow()"
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
            <div class="d-w32">
              <dt-lazy-show :show="showCopyButton(name)">
                <copy-button
                  :text="name"
                  aria-label="Copy Token"
                />
              </dt-lazy-show>
            </div>
          </dt-stack>
        </th>
        <td
          class="d-code--sm"
        >
          <div v-if="isCompositionToken(tokenValue)" class="d-wmx264">
            <span v-for="value in tokenValue" :key="value">
              <span v-if="valueIsDivided(value)">
                <span v-dt-tooltip="getTokenValue(getFirstValue(value))">
                  {{ getFirstValue(value) }}
                </span>
                /
                <span v-dt-tooltip="getTokenValue(getSecondValue(value))">
                  {{ getSecondValue(value) }}&nbsp;
                </span>
              </span>
              <span v-else v-dt-tooltip="getTokenValue(value)">
                {{ value }}&nbsp;
              </span>
            </span>
          </div>
          <div v-else class="d-wmx264">
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

  data: () => ({
    hoveredRow: null,
  }),

  computed: {
    shownTokens () {
      return this.tokens.filter(token => !token.hidden);
    },
  },

  methods: {
    getTokenValue (value) {
      return this.tokens.find(token => token.name === value.replace(/,$/, ''))?.tokenValue.toString();
    },

    isCompositionToken (value) {
      return Array.isArray(value);
    },

    remToPixels (value) {
      if (this.category !== 'size' && this.category !== 'space') return;
      return `${parseFloat(value.replace('rem', '')) * 10}px`;
    },

    valueIsDivided (value) {
      return value.includes(' / ');
    },

    getFirstValue (value) {
      return value.split(' / ')[0];
    },

    getSecondValue (value) {
      return value.split(' / ')[1];
    },

    onEnterRow (name) {
      this.hoveredRow = name;
    },

    onLeaveRow () {
      this.hoveredRow = null;
    },

    showCopyButton (name) {
      return this.hoveredRow === name;
    },
  },
};
</script>
