<template>
  <div
    v-if="defaultIcon || hasSlotContent($slots.default)"
    aria-hidden="true"
    :class="['d-notice__icon', iconClass]"
  >
    <!-- @slot Slot for the main content -->
    <slot>
      <component
        :is="defaultIcon"
        size="400"
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
} from '@dialpad/dialtone-icons/vue';
import { NOTICE_KINDS } from './NoticeConstants.js';
import { hasSlotContent } from '@/common/utils';

const kindToIcon = new Map([
  ['info', DtIconInfo],
  ['positive', DtIconCheckCircle],
  ['warning', DtIconAlertTriangle],
  ['critical', DtIconAlertCircle],
  ['base', DtIconBell],
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
  },

  props: {
    /**
     * Kind of icon
     * @values base, critical, info, positive, warning
     */
    kind: {
      type: String,
      default: 'base',
      validator (kind) {
        return NOTICE_KINDS.includes(kind);
      },
    },

    /**
     * Additional class name for the icon wrapper element.
     */
    iconClass: {
      type: [String, Array, Object],
      default: '',
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
