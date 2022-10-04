<template>
  <div
    v-if="defaultIcon || $slots.default"
    aria-hidden="true"
    class="d-notice__icon"
  >
    <!-- @slot Slot for the main content -->
    <slot>
      <component
        :is="defaultIcon"
      />
    </slot>
  </div>
</template>

<script>
import IconLightbulb from '@dialpad/dialtone/lib/dist/vue/icons/IconLightbulb';
import IconInfo from '@dialpad/dialtone/lib/dist/vue/icons/IconInfo';
import IconWarning from '@dialpad/dialtone/lib/dist/vue/icons/IconWarning';
import IconError from '@dialpad/dialtone/lib/dist/vue/icons/IconError';
import IconCheckCircle from '@dialpad/dialtone/lib/dist/vue/icons/IconCheckCircle';
import { NOTICE_KINDS } from './notice_constants.js';

const kindToIcon = new Map([
  ['info', 'IconInfo'],
  ['success', 'IconCheckCircle'],
  ['warning', 'IconWarning'],
  ['error', 'IconError'],
  ['base', 'IconLightbulb'],
]);

export default {
  name: 'DtNoticeIcon',

  components: {
    IconLightbulb,
    IconInfo,
    IconWarning,
    IconError,
    IconCheckCircle,
  },

  props: {
    /**
     * Kind of icon
     * @values base, error, info, success, warning
     */
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
