<template>
  <div
    v-if="defaultIcon || $slots.default"
    class="d-notice__icon d-as-center"
  >
    <slot>
      <component
        :is="defaultIcon"
      />
    </slot>
  </div>
</template>

<script>
import IconInfo from '@dialpad/dialtone/lib/dist/vue/icons/IconInfo';
import IconWarning from '@dialpad/dialtone/lib/dist/vue/icons/IconWarning';
import IconError from '@dialpad/dialtone/lib/dist/vue/icons/IconError';
import IconCheckmark from '@dialpad/dialtone/lib/dist/vue/icons/IconCheckmark';
import { NOTICE_KINDS } from './notice_constants.js';

const kindToIcon = new Map([
  ['info', 'IconInfo'],
  ['success', 'IconCheckmark'],
  ['warning', 'IconWarning'],
  ['error', 'IconError'],
  ['base', null],
]);

export default {
  name: 'DtNoticeIcon',

  components: {
    IconInfo,
    IconWarning,
    IconError,
    IconCheckmark,
  },

  props: {
    kind: {
      type: String,
      default: 'base',
      validate (kind) {
        return NOTICE_KINDS.includes(kind);
      },
    },
  },

  computed: {
    defaultIcon () {
      return kindToIcon.get(this.kind);
    },
  },
};
</script>
