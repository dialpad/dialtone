<template>
  <div
    aria-hidden="true"
    :class="['d-toast-layout-alternate__icon', iconClass]"
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
} from '@dialpad/dialtone-icons/vue';
import { TOAST_ALTERNATE_KINDS } from '../ToastConstants.js';
import { ICON_SIZE_MODIFIERS } from '@/components/Icon/IconConstants.js';
import { ordinalSizeValidator } from '@/common/validators';

const kindToIcon = new Map([
  ['info', DtIconInfo],
  ['positive', DtIconInfo],
  ['warning', DtIconAlertTriangle],
  ['critical', DtIconInfo],
  ['base', DtIconBell],
  ['gradient', DtIconSparkle],
]);

export default {
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
     * @values base, critical, info, positive, warning
     */
    kind: {
      type: String,
      default: 'base',
      validator (kind) {
        return TOAST_ALTERNATE_KINDS.includes(kind);
      },
    },

    size: {
      type: [String, Number],
      default: 400,
      validator: ordinalSizeValidator(ICON_SIZE_MODIFIERS),
    },

    /**
     * Additional class name for the icon wrapper element.
     */
    iconClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  computed: {
    defaultIcon () {
      return kindToIcon.get(this.kind);
    },
  },
};
</script>
