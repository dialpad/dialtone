<template>
  <div
    v-if="defaultIcon || hasSlotContent($slots.default)"
    aria-hidden="true"
    class="d-notice__icon"
  >
    <!-- @slot Slot for the main content -->
    <slot>
      <component
        :is="defaultIcon"
        :size="size"
      />
    </slot>
  </div>
</template>

<script>
import {
  DtIconInfo,
  DtIconCheckCircle,
  DtIconAlertTriangle,
  DtIconAlertCircle,
  DtIconBell,
  DtIconSparkle,
} from '@dialpad/dialtone-icons/vue3';
import { NOTICE_KINDS } from './notice_constants.js';
import { hasSlotContent } from '@/common/utils';
import { ICON_SIZE_MODIFIERS } from '@/components/icon/icon_constants.js';

const kindToIcon = new Map([
  ['info', DtIconInfo],
  ['success', DtIconCheckCircle],
  ['warning', DtIconAlertTriangle],
  ['error', DtIconAlertCircle],
  ['base', DtIconBell],
  ['gradient', DtIconSparkle],
]);

export default {
  compatConfig: { MODE: 3 },
  name: 'DtNoticeIcon',

  components: {
    DtIconInfo,
    DtIconCheckCircle,
    DtIconAlertTriangle,
    DtIconAlertCircle,
    DtIconBell,
    DtIconSparkle,
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

    size: {
      type: String,
      default: '400',
      validator: (s) => Object.keys(ICON_SIZE_MODIFIERS).includes(s),
    },
  },

  data () {
    return {
      hasSlotContent,
    };
  },

  computed: {
    defaultIcon () {
      return kindToIcon.get(this.kind);
    },
  },
};
</script>
