<template>
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" colspan="2">
          Color
        </th>
        <th scope="col">
          CSS variable
        </th>
        <th scope="col">
          CSS utility
        </th>
      </tr>
    </thead>
    <tbody v-for="c in borders" :key="c">
      <tr>
        <th scope="row" class="d-pr0" colspan="2">
          <div class="d-d-flex d-ai-center d-gg16">
            <div
              :class="['d-d-inline-flex d-p4 d-bar-pill', { 'd-bgc-contrast': c.includes('inverted') }]"
            >
              <div :class="`d-bar-circle d-w42 d-h42 d-ba d-bas-solid d-baw4 d-bc-${c}`" />
            </div>
            <div class="d-lh-300 d-tt-capitalize">
              {{ c.replace('-', ' ') }}
            </div>
          </div>
        </th>
        <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100 d-ws-nowrap">
          var(--dt-color-border-{{ c }})
        </td>
        <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100 d-ws-nowrap">
          .d-bc-{{ c }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { borders } from '@data/colors.json';

export default {
  name: 'BorderColorTable',

  data () {
    return {
      borders,
    };
  },
};
</script>
