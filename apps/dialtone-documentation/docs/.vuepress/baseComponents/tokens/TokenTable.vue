<template>
  <div v-dt-scrollbar:never class="d-hmx464 d-bar8 d-ba d-bc-subtle">
    <div>
      <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th
              scope="col"
              class="d-p0 d-bbw0 d-label--sm-compact d-tt-none"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Preview
              </div>
            </th>
            <th
              scope="col"
              class="d-p0 d-bbw0 d-label--sm-compact d-tt-none"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Token Name
              </div>
            </th>
            <th
              scope="col"
              class="d-p0 d-bbw0 d-label--sm-compact d-tt-none d-ta-right"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                {{ tokenList ? "REM" : "Value" }}
              </div>
            </th>
            <th
              v-show="!!tokenList"
              scope="col"
              class="d-p0 d-bbw0 d-label--sm-compact"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                PX
              </div>
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
            <td class="d-w72 sm:d-w128 d-box-content">
              <token-example
                :category="category"
                :name="exampleName || name"
                :value="exampleValue.toString()"
                :theme="theme"
              />
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
                      v-if="!isSmallDevice"
                      :text="name"
                      aria-label="Copy Token"
                    />
                  </dt-lazy-show>
                </div>
              </dt-stack>
              <div class="d-body--sm">
                {{ description }}
              </div>
              <token-value
                v-if="isSmallDevice"
                :token-value="valueToString(tokenValue)"
                :tokens="tokens"
              />
            </th>
            <td v-if="!isSmallDevice" class="d-code--sm  d-fc-blue-500 d-ta-right d-wmx164">
              <token-value :token-value="valueToString(tokenValue)" :tokens="tokens" />
            </td>
            <td
              v-if="!!tokenList"
              class="d-code--sm d-docsite-code"
            >
              <div class="d-wmx264">
                {{ remToPixels(tokenValue) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import CopyButton from '../CopyButton.vue';
import TokenExample from './TokenExample.vue';
import TokenValue from './TokenValue.vue';
import { CATEGORY_MAP } from './constants';

export default {
  name: 'TokenTable',

  components: {
    CopyButton,
    TokenExample,
    TokenValue,
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

    theme: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    hoveredRow: null,
    isSmallDevice: false,
  }),

  computed: {
    shownTokens () {
      return this.tokens.filter(token => !token.hidden);
    },
  },

  beforeMount () {
    this.isSmallDevice = window.outerWidth <= 480;
  },

  methods: {
    valueToString (value) {
      if (Array.isArray(value)) {
        return value.map(partial => partial.toString());
      }
      return value.toString();
    },

    remToPixels (value) {
      if (this.category !== 'size' && this.category !== 'space') return;
      return `${parseFloat(value.replace('rem', '')) * 10}px`;
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

.d-table tr th:first-child {
  width: 16rem;
}

.d-table thead tr {
  display: none;
}

@media (min-width: 480px) {
  .d-table thead tr {
    display: table-row;
  }
}
</style>
