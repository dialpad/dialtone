<template>
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th
          scope="col"
          class="d-label--sm-compact d-tt-none"
        >
          Preview
        </th>
        <th
          scope="col"
          class="d-label--sm-compact d-tt-none"
        >
          Token Name
        </th>
        <th
          scope="col"
          class="d-label--sm-compact d-tt-none d-ta-right"
        >
          {{ tokenList ? "REM" : "Value" }}
        </th>
        <th
          v-show="!!tokenList"
          scope="col"
          class="d-label--sm-compact"
        >
          PX
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
        <th scope="row">
          <dt-stack
            direction="row"
            gap="300"
            class="d-ai-center token-name"
          >
            <span class="d-label--md-compact">
              {{ name }}
            </span>
            <div class="d-w32">
              <dt-lazy-show :show="showCopyButton(name)">
                <copy-button
                  :text="name"
                  aria-label="Copy Token"
                />
              </dt-lazy-show>
            </div>
          </dt-stack>
          <div class="d-body--sm">
            {{ description }}
          </div>
        </th>
        <td class="d-code--sm d-fc-purple-400 d-ta-right d-wmx164">
          <div v-if="isCompositionToken(tokenValue)">
            <span v-for="value in tokenValue" :key="value">
              <span v-if="valueIsDivided(value)">
                <span v-dt-tooltip="getTokenValue(getFirstValue(value))" class="h:d-fc-secondary">
                  {{ getFirstValue(value) }}
                </span>
                /
                <span v-dt-tooltip="getTokenValue(getSecondValue(value))" class="h:d-fc-secondary">
                  {{ getSecondValue(value) }}&nbsp;
                </span>
              </span>
              <span v-else v-dt-tooltip="getTokenValue(value)" class="h:d-fc-secondary">
                {{ value }}&nbsp;
              </span>
            </span>
          </div>
          <div v-else>
            {{ tokenValue }}
          </div>
        </td>
        <td
          v-if="!!tokenList"
          class="d-code--sm d-fc-purple-400"
        >
          <div class="d-wmx264">
            {{ remToPixels(tokenValue) }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import CopyButton from '../CopyButton.vue';
import TokenExample from './TokenExample.vue';
import { CATEGORY_MAP } from './constants';

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

<style scoped>
.token-name {
  /* make space for the copy button that appears on mouse enter */
  min-height: 2.8rem;
}

.d-table th {
  color: var(--color-foreground-tertiary);
  font-weight: var(--dt-font-weight-semi-bold);
}
</style>
