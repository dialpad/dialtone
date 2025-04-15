<template>
  <div
    aria-hidden="true"
    class="d-toast-layout-alternate__icon"
  >
    <slot>
      <component
        :is="defaultIcon"
        v-if="defaultIcon"
        :size="size"
      />
    </slot>
  </div>
</template>

<script>
import {
  DtIconInfo,
  DtIconAlertTriangle,
  DtIconBell,
  DtIconSparkle,
} from '@dialpad/dialtone-icons/vue3';
import { TOAST_ALTERNATE_KINDS } from '../toast_constants.js';
import { ICON_SIZE_MODIFIERS } from '@/components/icon/icon_constants.js';

const kindToIcon = new Map([
  ['info', DtIconInfo],
  ['success', DtIconInfo],
  ['warning', DtIconAlertTriangle],
  ['error', DtIconInfo],
  ['base', DtIconBell],
  ['gradient', DtIconSparkle],
]);

export default {
  compatConfig: { MODE: 3 },
  name: 'DtToastLayoutAlternateIcon',

  components: {
    DtIconInfo,
    DtIconAlertTriangle,
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
        return TOAST_ALTERNATE_KINDS.includes(kind);
      },
    },

    size: {
      type: String,
      default: '400',
      validator: (s) => Object.keys(ICON_SIZE_MODIFIERS).includes(s),
    },
  },

  computed: {
    defaultIcon () {
      return kindToIcon.get(this.kind);
    },
  },
};
</script>
