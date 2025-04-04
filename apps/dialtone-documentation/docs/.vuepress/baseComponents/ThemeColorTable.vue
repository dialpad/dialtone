<template>
  <div v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
    <div>
      <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th class="d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Color
              </div>
            </th>
            <th class="d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Section
              </div>
            </th>
            <th class="d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                State
              </div>
            </th>
            <th class="d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Property
              </div>
            </th>
            <th class="d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Variable
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="color in themeColors" :key="color.variable">
            <td>
              <div v-if="color.section === 'sidebar icon'" class="d-d-flex d-ai-center d-jc-center" title="Sample icon">
                <dt-icon name="info" :style="{ color: `var(--${color.variable})` }" />
              </div>
              <div
                v-else-if="color.section === 'mention' && color.property === 'color'"
                class="d-d-flex d-ai-center d-jc-center"
              >
                <div
                  :style="{
                    color: `var(${color.variable})`,
                    'background-color': `var(--dt-theme-mention-color-background)`,
                  }"
                  class="d-bar-circle d-w42 d-h42 d-fs-300 d-d-flex d-ai-center d-jc-center d-fw-medium"
                >
                  Aa
                </div>
              </div>
              <div v-else-if="color.property === 'background-color'" class="d-d-flex d-ai-center d-jc-center">
                <div
                  :style="{ backgroundColor: `var(${color.variable})` }"
                  class="d-w42 d-h42 d-bar-circle d-ba d-bc-subtle"
                />
              </div>
              <div
                v-else-if="color.property === 'color'"
                :style="{ color: `var(${color.variable})` }"
                class="d-fs-300 d-p6 d-ta-center d-fw-medium"
              >
                Aa
              </div>
              <div
                v-else-if="color.property === 'border-color'"
                :class="['d-d-inline-flex d-p4 d-bar-pill', { 'd-bgc-contrast': color.variable.includes('inverted') }]"
              >
                <div
                  :style="{ borderColor: `var(--${color.variable})` }"
                  class="d-bar-circle d-w42 d-h42 d-ba d-bas-solid d-baw4"
                />
              </div>
            </td>
            <th scope="row" class="d-ws-nowrap d-tt-capitalize" v-text="color.section" />
            <td class="d-tt-capitalize" v-text="color.states" />
            <td class="d-code--sm d-docsite-code" v-text="color.property" />
            <td class="d-code--sm d-docsite-code" v-text="color.variable" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const tokensDocs = inject('tokensDocs');
const excludedThemeColors = ['--dt-theme-color-base'];
const themeColors = Object.keys(tokensDocs)
  .filter(token =>
    !/-(h|s|l|a|hsl|hsla)$/.test(token) &&
    /--dt-theme-(\w+)-.+/.test(token) &&
    !excludedThemeColors.includes(token),
  )
  .map(token => {
    return {
      section: token.replace(/--dt-theme-([\w-]+)-color.+/, '$1').replace('-', ' '),
      states: getTokenStates(token),
      property: getTokenProperty(token),
      variable: token,
    };
  });

function getTokenProperty (token) {
  if (token.includes('-color-foreground')) return 'color';
  else if (token.includes('-color-background')) return 'background-color';
  else if (token.includes('-color-border')) return 'border-color';
  else return '-';
}

function getTokenStates (token) {
  const states = {
    hovering: token.endsWith('-hover'),
    pressing: token.endsWith('-active'),
    inverted: token.includes('inverted'),
    unread: token.endsWith('-unread'),
    selected: token.includes('selected'),
    available: token.endsWith('-available'),
    'actively-busy': token.endsWith('-busy-unavailable'),
    busy: token.endsWith('-busy'),
  };

  return Object.keys(states).filter(state => states[state]).join(', ').replace('-', ' ') || 'resting';
}
</script>
