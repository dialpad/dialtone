<template>
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col">
          Color
        </th>
        <th scope="col">
          Section
        </th>
        <th scope="col">
          State
        </th>
        <th scope="col">
          Property
        </th>
        <th scope="col">
          Variable
        </th>
      </tr>
    </thead>
    <tbody v-for="c in theme" :key="c.name">
      <tr>
        <td>
          <div v-if="c.section === 'Sidebar Icon'" class="d-d-flex d-ai-center d-jc-center" title="Sample icon">
            <dt-icon name="info" :style="{ color: `var(--${c.name})` }" />
          </div>
          <div v-else-if="c.property === 'background-color'" class="d-d-flex d-ai-center d-jc-center">
            <div
              class="d-w42 d-h42 d-bar-circle d-ba d-bc-subtle"
              :style="{ backgroundColor: `var(--${c.name})` }"
            />
          </div>
          <div
            v-else-if="c.property === 'color'"
            class="d-fs-300 d-p6 d-ta-center d-fw-medium"
            :style="{ color: `var(--${c.name})` }"
          >
            Aa
          </div>
          <div
            v-else-if="c.property === 'border-color'"
            :class="['d-d-inline-flex d-p4 d-bar-pill', { 'd-bgc-contrast': c.name.includes('inverted') }]"
          >
            <div
              class="d-bar-circle d-w42 d-h42 d-ba d-bas-solid d-baw4"
              :style="{ borderColor: `var(--${c.name})` }"
            />
          </div>
        </td>
        <th scope="row">
          <div class="d-ws-nowrap">
            {{ c.section }}
          </div>
        </th>
        <td>
          {{ c.item }}
        </td>
        <td>
          <div class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            {{ c.property }}
          </div>
        </td>
        <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100 d-ws-nowrap">
          var(--{{ c.name }})
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { theme } from '@data/colors.json';

export default {
  name: 'ThemeColorTable',

  data () {
    return {
      theme,
    };
  },
};
</script>
