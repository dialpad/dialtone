<template>
  <div
    v-if="defaultIcon || $slots.default"
    aria-hidden="true"
    class="d-notice__icon"
  >
    <!-- @slot Slot for the main content -->
    <slot>
      <dt-icon
        :name="defaultIcon"
        size="400"
      />
    </slot>
  </div>
</template>

<script>
import { DtIcon } from '@/components/icon';
import { NOTICE_KINDS } from './notice_constants.js';

const kindToIcon = new Map([
  ['info', 'info'],
  ['success', 'check-circle'],
  ['warning', 'alert-triangle'],
  ['error', 'alert-circle'],
  ['base', 'bell'],
]);

export default {
  name: 'DtNoticeIcon',

  components: {
    DtIcon,
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
